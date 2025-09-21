// api/send-quote.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (allow POST from your site; keep '*' if you truly need any origin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN; // e.g. mg.devonmccleese.com
    const OWNER_EMAIL = process.env.OWNER_EMAIL || 'devonmgm@gmail.com';

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return res.status(500).json({ error: 'Missing Mailgun configuration' });
    }

    // Expect JSON body from client
    type QuoteRequestBody = {
      customerEmail?: string;
      customerName?: string;
      quote?: string;
      meta?: unknown;
    };

    // Vercel's Node runtime may supply the body as an already-parsed object,
    // a JSON string, or even a Buffer. Normalize that into an object so the
    // downstream logic always works the same way.
    let parsedBody: QuoteRequestBody;

    try {
      if (!req.body) {
        parsedBody = {};
      } else if (typeof req.body === 'string') {
        parsedBody = JSON.parse(req.body) as QuoteRequestBody;
      } else if (Buffer.isBuffer(req.body)) {
        parsedBody = JSON.parse(req.body.toString('utf-8')) as QuoteRequestBody;
      } else {
        parsedBody = req.body as QuoteRequestBody;
      }
    } catch (parseError) {
      console.error('Invalid JSON body provided to /api/send-quote:', parseError);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { customerEmail, customerName, quote, meta } = parsedBody;
    if (!customerEmail || !quote) {
      return res.status(400).json({ error: 'Missing fields: customerEmail and quote are required.' });
    }

    const sender = `Devon's Handyman <no-reply@${MAILGUN_DOMAIN}>`; // must be on your Mailgun sending domain
    const replyTo = 'devonmgm@gmail.com';

    // helper: send via Mailgun REST
    const sendEmail = async (
      to: string,
      subject: string,
      text: string,
      html: string
    ) => {
      const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

      const form = new URLSearchParams();
      form.append('from', sender);
      form.append('to', to);
      form.append('subject', subject);
      form.append('text', text);
      form.append('html', html);
      form.append('h:Reply-To', replyTo); // replies go to your Gmail

      const resp = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
      });

      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`Mailgun error ${resp.status}: ${detail}`);
      }
      return resp.json();
    };

    // Build email bodies
    const customerText = `Hi ${customerName || 'there'},

Thank you for your quote request! Here are the details:

${quote}

Devon will review your request and get back to you within 24 hours.

Best regards,
Devon McCleese
Handyman Services
devonmgm@gmail.com
(904) 501-7147`;

    const customerHtml = `
      <h2>Thank you for your quote request!</h2>
      <p>Hi ${customerName || 'there'},</p>
      <p>Here are the details of your quote request:</p>
      <div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:12px 0;">
        <pre style="white-space:pre-wrap;font-family:system-ui,Arial,sans-serif;">${quote}</pre>
      </div>
      <p>Devon will review your request and get back to you within 24 hours.</p>
      <p style="margin-top:16px;">
        Best regards,<br>
        <strong>Devon McCleese</strong><br>
        Handyman Services<br>
        Email: devonmgm@gmail.com<br>
        Phone: (904) 501-7147
      </p>
    `;

    const ownerText = `New quote request received:

Customer: ${customerName || 'Not provided'}
Email: ${customerEmail}

Quote Details:
${quote}

Additional Info:
${meta ? JSON.stringify(meta, null, 2) : '—'}`;

    const ownerHtml = `
      <h2>New Quote Request</h2>
      <p><strong>Customer:</strong> ${customerName || 'Not provided'}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <h3>Quote Details</h3>
      <div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:12px 0;">
        <pre style="white-space:pre-wrap;font-family:system-ui,Arial,sans-serif;">${quote}</pre>
      </div>
      ${meta ? `<h3>Additional Information</h3><pre style="white-space:pre-wrap;">${JSON.stringify(meta, null, 2)}</pre>` : ''}
    `;

    // Send both emails (separately)
    await sendEmail(customerEmail, "Your quote from Devon's Handyman Services", customerText, customerHtml);
    await sendEmail(OWNER_EMAIL, `New Quote Request from ${customerName || customerEmail}`, ownerText, ownerHtml);

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Email send failed';
    return res.status(500).json({ error: message });
  }
}
