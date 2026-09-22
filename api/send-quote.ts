import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';

interface QuoteService {
  name: string;
  category: string;
  description: string;
  quantity: number;
}

interface QuoteRequestPayload {
  submissionId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
  services: QuoteService[];
}

interface UnknownRecord {
  [key: string]: unknown;
}

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

type VercelResponse = ServerResponse<IncomingMessage>;

const MAX_FIELD_LENGTH = 500;
const MAX_NOTES_LENGTH = 3000;
const OWNER_EMAIL = process.env.OWNER_EMAIL?.trim() || 'devonmgm@gmail.com';
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL?.trim() || 'Devon McCleese Website <quotes@mail.devonmccleese.com>';

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeText(value: string, maximumLength: number): string {
  return value.trim().slice(0, maximumLength);
}

function sendJson(response: VercelResponse, statusCode: number, body: UnknownRecord): void {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

async function readRequestBody(request: VercelRequest): Promise<unknown> {
  if (request.body !== undefined) {
    return request.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) as unknown : null;
}

function parseQuoteRequest(value: unknown): QuoteRequestPayload {
  if (!isRecord(value)) {
    throw new Error('The quote request was not valid.');
  }

  const requiredFields = ['name', 'email', 'phone', 'address', 'preferredDate', 'preferredTime'];
  for (const field of requiredFields) {
    if (!isNonEmptyString(value[field])) {
      throw new Error(`Please provide a valid ${field}.`);
    }
  }

  const email = normalizeText(value.email as string, MAX_FIELD_LENGTH);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please provide a valid email address.');
  }

  const services = Array.isArray(value.services)
    ? value.services.flatMap((service): QuoteService[] => {
      if (!isRecord(service) || !isNonEmptyString(service.name)) {
        return [];
      }

      const quantity = typeof service.quantity === 'number' && Number.isFinite(service.quantity)
        ? Math.max(1, Math.min(99, Math.round(service.quantity)))
        : 1;

      return [{
        name: normalizeText(service.name, MAX_FIELD_LENGTH),
        category: isNonEmptyString(service.category) ? normalizeText(service.category, MAX_FIELD_LENGTH) : 'General',
        description: isNonEmptyString(service.description) ? normalizeText(service.description, MAX_FIELD_LENGTH) : '',
        quantity,
      }];
    })
    : [];

  return {
    submissionId: typeof value.submissionId === 'string' && /^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(value.submissionId)
      ? value.submissionId
      : crypto.randomUUID(),
    name: normalizeText(value.name as string, MAX_FIELD_LENGTH),
    email,
    phone: normalizeText(value.phone as string, MAX_FIELD_LENGTH),
    address: normalizeText(value.address as string, MAX_FIELD_LENGTH),
    preferredDate: normalizeText(value.preferredDate as string, MAX_FIELD_LENGTH),
    preferredTime: normalizeText(value.preferredTime as string, MAX_FIELD_LENGTH),
    additionalNotes: isNonEmptyString(value.additionalNotes)
      ? normalizeText(value.additionalNotes, MAX_NOTES_LENGTH)
      : 'None provided',
    services,
  };
}

function renderServicesHtml(services: QuoteService[]): string {
  if (services.length === 0) {
    return '<p style="margin:0;color:#475569;">No services were selected.</p>';
  }

  return `<ul style="margin:0;padding-left:20px;color:#0f172a;">${services.map((service) => `
    <li style="margin:0 0 8px;">
      <strong>${escapeHtml(service.name)}</strong> <span style="color:#64748b;">(${escapeHtml(service.category)}) × ${service.quantity}</span>
      ${service.description ? `<div style="color:#475569;">${escapeHtml(service.description)}</div>` : ''}
    </li>`).join('')}</ul>`;
}

function renderQuoteHtml(request: QuoteRequestPayload): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
      <div style="background:#111827;border-radius:16px 16px 0 0;padding:24px 28px;color:#fff;">
        <p style="margin:0 0 6px;color:#facc15;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Devon McCleese Website</p>
        <h1 style="margin:0;font-size:26px;line-height:1.2;">New quote request</h1>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:28px;">
        <p style="margin:0 0 24px;color:#475569;">A new request was submitted through devonmccleese.com.</p>
        <h2 style="margin:0 0 12px;font-size:16px;">Customer information</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:8px 0;color:#64748b;width:160px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(request.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(request.email)}" style="color:#0369a1;">${escapeHtml(request.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${escapeHtml(request.phone)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Project address</td><td style="padding:8px 0;">${escapeHtml(request.address)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Preferred date</td><td style="padding:8px 0;">${escapeHtml(request.preferredDate)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Preferred time</td><td style="padding:8px 0;">${escapeHtml(request.preferredTime)}</td></tr>
        </table>
        <h2 style="margin:0 0 12px;font-size:16px;">Requested services</h2>
        <div style="margin-bottom:24px;">${renderServicesHtml(request.services)}</div>
        <h2 style="margin:0 0 12px;font-size:16px;">Additional notes</h2>
        <p style="white-space:pre-wrap;margin:0;color:#334155;">${escapeHtml(request.additionalNotes)}</p>
      </div>
    </div>
  </body>
</html>`;
}

function renderQuoteText(request: QuoteRequestPayload): string {
  const services = request.services.length > 0
    ? request.services.map((service) => `- ${service.name} (${service.category}) x${service.quantity}${service.description ? `\n  ${service.description}` : ''}`).join('\n')
    : 'No services were selected.';

  return [
    'New quote request from devonmccleese.com',
    '',
    'Customer information',
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone}`,
    `Project address: ${request.address}`,
    `Preferred date: ${request.preferredDate}`,
    `Preferred time: ${request.preferredTime}`,
    '',
    'Requested services',
    services,
    '',
    'Additional notes',
    request.additionalNotes,
  ].join('\n');
}

function renderCustomerServicesHtml(services: QuoteService[]): string {
  if (services.length === 0) {
    return '<p style="margin:0;">No specific services selected.</p>';
  }

  return `<ul style="margin:0;padding-left:20px;">${services.map((service) =>
    `<li>${escapeHtml(service.name)} × ${service.quantity}</li>`).join('')}</ul>`;
}

function renderCustomerHtml(request: QuoteRequestPayload): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <div style="background:#111827;border-radius:16px 16px 0 0;padding:24px 28px;color:#fff;">
        <p style="margin:0 0 6px;color:#facc15;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Devon's Handyman Services</p>
        <h1 style="margin:0;font-size:24px;">We received your quote request</h1>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:28px;">
        <p>Hi ${escapeHtml(request.name)},</p>
        <p>Thanks for reaching out. Here is a brief summary of the request you sent to Devon:</p>
        <h2 style="font-size:16px;">Requested services</h2>
        ${renderCustomerServicesHtml(request.services)}
        <p><strong>Project address:</strong> ${escapeHtml(request.address)}<br>
        <strong>Preferred date:</strong> ${escapeHtml(request.preferredDate)}<br>
        <strong>Preferred time:</strong> ${escapeHtml(request.preferredTime)}</p>
        <p><strong>Additional notes:</strong><br><span style="white-space:pre-wrap;">${escapeHtml(request.additionalNotes)}</span></p>
        <p>Devon will review your request and reply to you. If you need to add anything, reply to this email or call (904) 501-7147.</p>
      </div>
    </div>
  </body>
</html>`;
}

function renderCustomerText(request: QuoteRequestPayload): string {
  const services = request.services.length > 0
    ? request.services.map((service) => `- ${service.name} x${service.quantity}`).join('\n')
    : 'No specific services selected.';

  return [
    `Hi ${request.name},`,
    '',
    'Thanks for reaching out. We received your quote request for Devon.',
    '',
    'Requested services',
    services,
    '',
    `Project address: ${request.address}`,
    `Preferred date: ${request.preferredDate}`,
    `Preferred time: ${request.preferredTime}`,
    `Additional notes: ${request.additionalNotes}`,
    '',
    'Devon will review your request and reply to you. To add anything, reply to this email or call (904) 501-7147.',
  ].join('\n');
}

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  const requestId = crypto.randomUUID();
  let quoteRequest: QuoteRequestPayload;

  try {
    quoteRequest = parseQuoteRequest(await readRequestBody(request));
  } catch (error) {
    console.error('[send-quote] Invalid quote request', { error, requestId, trigger: 'user' });
    sendJson(response, 400, { error: error instanceof Error ? error.message : 'Please check the form and try again.' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error('[send-quote] Missing RESEND_API_KEY', { requestId, trigger: 'user' });
    sendJson(response, 503, { error: 'Email delivery is temporarily unavailable. Please call Devon directly.' });
    return;
  }

  try {
    const contentHash = createHash('sha256').update(JSON.stringify(quoteRequest)).digest('hex').slice(0, 16);
    const resendResponse = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `quote-${quoteRequest.submissionId}-${contentHash}`,
      },
      body: JSON.stringify([
        {
          from: FROM_EMAIL,
          to: [OWNER_EMAIL],
          reply_to: quoteRequest.email,
          subject: `New quote request from ${quoteRequest.name}`,
          html: renderQuoteHtml(quoteRequest),
          text: renderQuoteText(quoteRequest),
        },
        {
          from: FROM_EMAIL,
          to: [quoteRequest.email],
          reply_to: OWNER_EMAIL,
          subject: "Your quote request to Devon's Handyman Services",
          html: renderCustomerHtml(quoteRequest),
          text: renderCustomerText(quoteRequest),
        },
      ]),
    });

    const responseBody: unknown = await resendResponse.json().catch(() => null);
    const emails = isRecord(responseBody) && Array.isArray(responseBody.data) ? responseBody.data : [];
    if (!resendResponse.ok || emails.length !== 2 || !emails.every((email) => isRecord(email) && isNonEmptyString(email.id))) {
      console.error('[send-quote] Resend did not accept both messages', {
        requestId,
        status: resendResponse.status,
        responseBody,
        trigger: 'user',
      });
      sendJson(response, 502, { error: 'Email delivery failed. Please try again or call Devon directly.' });
      return;
    }

    console.info('[send-quote] Both quote emails accepted', {
      requestId,
      emailIds: emails.map((email) => email.id),
    });
    sendJson(response, 200, { success: true, message: 'Your quote request and confirmation email were sent.' });
  } catch (error) {
    console.error('[send-quote] Resend request failed', { error, requestId, trigger: 'user' });
    sendJson(response, 502, { error: 'Email delivery failed. Please try again or call Devon directly.' });
  }
}
