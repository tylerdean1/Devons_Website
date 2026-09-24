import type { InvoiceApiRequest, InvoiceApiResponse } from '../src/server/invoiceSecurity.js';
import {
  invoiceSetupReady,
  isSameOriginRequest,
  readJsonBody,
  requestHasInvoiceSession,
  sendJson,
} from '../src/server/invoiceSecurity.js';

interface UnknownRecord {
  [key: string]: unknown;
}

interface InvoiceLineInput {
  description: string;
  amountCents: number;
}

interface InvoiceInput {
  submissionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  memo: string;
  dueDays: number;
  items: InvoiceLineInput[];
}

interface StripeInvoice {
  id: string;
  number?: string | null;
  status?: string | null;
  currency?: string;
  amount_due?: number;
  amount_paid?: number;
  created?: number;
  due_date?: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;
  livemode?: boolean;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_LINE_AMOUNT_CENTS = 100_000_000;
const MAX_INVOICE_TOTAL_CENTS = 250_000_000;
const MAX_LINE_ITEMS = 20;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function parseInvoiceInput(value: unknown): InvoiceInput {
  if (!isRecord(value) || !UUID_PATTERN.test(String(value.submissionId ?? ''))) {
    throw new Error('Please refresh the page and try again.');
  }

  const customerName = normalizeString(value.customerName, 120);
  const customerEmail = normalizeString(value.customerEmail, 254);
  const customerPhone = normalizeString(value.customerPhone, 40);
  const memo = normalizeString(value.memo, 500);
  const dueDays = value.dueDays;

  if (!customerName) throw new Error('Enter the customer’s name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw new Error('Enter a valid customer email.');
  if (dueDays !== 7 && dueDays !== 14 && dueDays !== 30) throw new Error('Choose a valid payment due date.');
  if (!Array.isArray(value.items) || value.items.length < 1 || value.items.length > MAX_LINE_ITEMS) {
    throw new Error(`Add between 1 and ${MAX_LINE_ITEMS} invoice items.`);
  }

  const items: InvoiceLineInput[] = value.items.map((item) => {
    if (!isRecord(item)) throw new Error('Check each invoice item.');
    const description = normalizeString(item.description, 200);
    const amountCents = item.amountCents;
    if (!description) throw new Error('Add a description to every invoice item.');
    if (!Number.isSafeInteger(amountCents) || (amountCents as number) < 1 || (amountCents as number) > MAX_LINE_AMOUNT_CENTS) {
      throw new Error('Enter an amount between $0.01 and $1,000,000.00 for each item.');
    }
    return { description, amountCents: amountCents as number };
  });

  const total = items.reduce((sum, item) => sum + item.amountCents, 0);
  if (total > MAX_INVOICE_TOTAL_CENTS) throw new Error('The invoice total cannot exceed $2,500,000.00.');

  return {
    submissionId: value.submissionId as string,
    customerName,
    customerEmail,
    customerPhone,
    memo,
    dueDays,
    items,
  };
}

async function stripeRequest<T extends object>(
  path: string,
  method: 'GET' | 'POST',
  parameters: Record<string, string | number | boolean> = {},
  idempotencyKey?: string,
): Promise<T> {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!apiKey) throw new Error('Stripe is not configured.');

  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) form.set(key, String(value));
  const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}` };
  if (method === 'POST') headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const query = method === 'GET' && form.size > 0 ? `?${form.toString()}` : '';
  const result = await fetch(`https://api.stripe.com/v1/${path}${query}`, {
    method,
    headers,
    body: method === 'POST' ? form : undefined,
  });
  const payload: unknown = await result.json().catch(() => null);

  if (!result.ok || !isRecord(payload)) {
    const stripeError = isRecord(payload) && isRecord(payload.error) ? payload.error : {};
    const error = new Error('Stripe request failed.') as Error & { status?: number; code?: string };
    error.status = result.status;
    error.code = typeof stripeError.code === 'string' ? stripeError.code : undefined;
    throw error;
  }

  return payload as T;
}

function publicInvoice(invoice: StripeInvoice): Record<string, unknown> {
  return {
    id: invoice.id,
    number: invoice.number ?? null,
    status: invoice.status ?? 'unknown',
    currency: invoice.currency ?? 'usd',
    amountDue: typeof invoice.amount_due === 'number' ? invoice.amount_due : 0,
    amountPaid: typeof invoice.amount_paid === 'number' ? invoice.amount_paid : 0,
    created: typeof invoice.created === 'number' ? invoice.created : null,
    dueDate: typeof invoice.due_date === 'number' ? invoice.due_date : null,
    customerName: invoice.customer_name ?? 'Customer',
    customerEmail: invoice.customer_email ?? '',
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    invoicePdf: invoice.invoice_pdf ?? null,
    livemode: invoice.livemode === true,
  };
}

async function listInvoices(response: InvoiceApiResponse): Promise<void> {
  const result = await stripeRequest<{ data?: StripeInvoice[] }>('invoices', 'GET', {
    limit: 50,
    collection_method: 'send_invoice',
  });
  const invoices = Array.isArray(result.data) ? result.data.map(publicInvoice) : [];
  sendJson(response, 200, {
    invoices,
    mode: process.env.STRIPE_SECRET_KEY?.trim().startsWith('sk_live_') ? 'live' : 'test',
  });
}

async function createAndSendInvoice(input: InvoiceInput, response: InvoiceApiResponse): Promise<void> {
  const requestId = input.submissionId;
  const customer = await stripeRequest<{ id: string }>(
    'customers',
    'POST',
    {
      name: input.customerName,
      email: input.customerEmail,
      ...(input.customerPhone ? { phone: input.customerPhone } : {}),
    },
    `invoice-customer-${requestId}`,
  );

  const invoice = await stripeRequest<StripeInvoice>(
    'invoices',
    'POST',
    {
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: input.dueDays,
      auto_advance: false,
      ...(input.memo ? { description: input.memo } : {}),
    },
    `invoice-create-${requestId}`,
  );

  for (const [index, item] of input.items.entries()) {
    await stripeRequest(
      'invoiceitems',
      'POST',
      {
        customer: customer.id,
        invoice: invoice.id,
        amount: item.amountCents,
        currency: 'usd',
        description: item.description,
      },
      `invoice-item-${requestId}-${index}`,
    );
  }

  await stripeRequest<StripeInvoice>(
    `invoices/${encodeURIComponent(invoice.id)}/finalize`,
    'POST',
    { auto_advance: false },
    `invoice-finalize-${requestId}`,
  );
  const sent = await stripeRequest<StripeInvoice>(
    `invoices/${encodeURIComponent(invoice.id)}/send`,
    'POST',
    {},
    `invoice-send-${requestId}`,
  );

  sendJson(response, 200, { invoice: publicInvoice(sent) });
}

export default async function handler(request: InvoiceApiRequest, response: InvoiceApiResponse): Promise<void> {
  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!invoiceSetupReady()) {
    sendJson(response, 503, { error: 'Invoice setup is not complete yet.' });
    return;
  }

  if (!requestHasInvoiceSession(request)) {
    sendJson(response, 401, { error: 'Sign in to manage invoices.' });
    return;
  }

  if (request.method === 'GET') {
    try {
      await listInvoices(response);
    } catch (error) {
      const stripeStatus = error instanceof Error && 'status' in error ? error.status : undefined;
      console.error('[invoices] Could not load invoices', { stripeStatus });
      sendJson(response, 502, { error: 'Invoices could not be loaded. Try again in a moment.' });
    }
    return;
  }

  if (!isSameOriginRequest(request)) {
    sendJson(response, 403, { error: 'This request is not allowed.' });
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { error: 'Please check the invoice details.' });
    return;
  }

  let input: InvoiceInput;
  try {
    input = parseInvoiceInput(body);
  } catch (error) {
    sendJson(response, 400, { error: error instanceof Error ? error.message : 'Please check the invoice details.' });
    return;
  }

  try {
    await createAndSendInvoice(input, response);
  } catch (error) {
    const stripeStatus = error instanceof Error && 'status' in error ? error.status : undefined;
    const stripeCode = error instanceof Error && 'code' in error ? error.code : undefined;
    console.error('[invoices] Invoice was not completed', { stripeStatus, stripeCode });
    sendJson(response, 502, {
      error: 'Stripe could not confirm the invoice was sent. Check Recent invoices in Stripe before retrying. Idempotency keys can be pruned after 24 hours, so verify the invoice in Stripe before retrying an older request.',
    });
  }
}
