// api/send-quote.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Serverless function for sending quote emails via Mailgun.
 * Env vars required in Vercel:
 *  - MAILGUN_API_KEY
 *  - MAILGUN_DOMAIN = mg.devonmccleese.com
 *  - OWNER_EMAIL = devonmgm@gmail.com
 * Optional:
 *  - MAILGUN_TEST_MODE=1  (Mailgun won't actually send; great for testing)
 */

export default async function handler(req: any, res: any) {
  // CORS (keep '*' while testing; later restrict to your domains)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN; // e.g., "mg.devonmccleese.com"
    const OWNER_EMAIL = process.env.OWNER_EMAIL || "devonmgm@gmail.com";
    const TEST_MODE = process.env.MAILGUN_TEST_MODE === "1"; // optional

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return res.status(500).json({ error: "Missing Mailgun configuration" });
    }

    // Body may be an object (already parsed) or a JSON string; handle both
    let body: any = req.body ?? {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        // ignore parse error and treat as empty object
        body = {};
      }
    }

    type QuoteRequestBody = {
      customerEmail?: string;
      customerName?: string;
      quote?: string;
      meta?: unknown;
    };

    const { customerEmail, customerName, quote, meta } = body as QuoteRequestBody;
    if (!customerEmail || !quote) {
      return res
        .status(400)
        .json({ error: "Missing fields: customerEmail and quote are required." });
    }

    const sender = `Devon's Handyman <no-reply@${MAILGUN_DOMAIN}>`; // must be on your Mailgun domain
    const replyTo = "devonmgm@gmail.com";

    // ---------- HTML template (email safe) ----------
    const escapeText = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    function renderQuoteEmail({
      heading,
      introHtml,
      quoteText,
      footerHtml,
    }: {
      heading: string;
      introHtml: string; // already-safe HTML
      quoteText: string; // will be escaped
      footerHtml?: string; // already-safe HTML
    }) {
      const quoteEsc = escapeText(quoteText);
      return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f6f7f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="100%" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#111827;color:#ffffff;padding:18px 24px;font:600 18px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
                Devon’s Handyman Services
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
                <h1 style="margin:0 0 12px 0;font:700 22px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
                  ${escapeText(heading)}
                </h1>
                <div style="margin:0 0 16px 0;">${introHtml}</div>
                <div style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;padding:14px;white-space:pre-wrap;font:400 14px/1.5 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:#111827;">
${quoteEsc}
                </div>
                ${
                  footerHtml
                    ? `<div style="margin:16px 0 0 0;color:#374151;">${footerHtml}</div>`
                    : ""
                }
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
                <p style="margin:0;color:#6b7280;font-size:13px;">
                  Devon McCleese · Handyman Services<br>
                  <a href="mailto:devonmgm@gmail.com" style="color:#2563eb;text-decoration:none;">devonmgm@gmail.com</a>
                  · (904) 501-7147
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0 0;color:#9ca3af;font:400 12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
            Reply to this email to continue the conversation.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    }
    // ------------------------------------------------

    // Plain-text fallbacks (good for deliverability)
    const customerText = `Hi ${customerName || "there"},

Thank you for your quote request! Here are the details:

${quote}

I will review your request and get back to you within 24 hours.

Best regards,
Devon McCleese
Handyman Services
devonmgm@gmail.com
(904) 501-7147`;

    const ownerText = `New quote request received:

Customer: ${customerName || "Not provided"}
Email: ${customerEmail}

Quote Details:
${quote}

Additional Info:
${meta ? JSON.stringify(meta, null, 2) : "—"}`;

    const customerHtml = renderQuoteEmail({
      heading: "Your quote request",
      introHtml: `Hi ${escapeText(
        customerName || "there"
      )}, thanks for reaching out! Here are your details:`,
      quoteText: quote,
      footerHtml: "We’ll review and get back to you within 24 hours.",
    });

    const ownerHtml = renderQuoteEmail({
      heading: "New quote request",
      introHtml: `<strong>Customer:</strong> ${escapeText(
        customerName || "Not provided"
      )}<br><strong>Email:</strong> <a href="mailto:${encodeURI(
        customerEmail
      )}">${escapeText(customerEmail)}</a>`,
      quoteText: quote,
      footerHtml: meta
        ? `<strong>Additional info:</strong><br><pre style="white-space:pre-wrap;margin:8px 0 0 0;">${escapeText(
            JSON.stringify(meta, null, 2)
          )}</pre>`
        : "",
    });

    // --- Mailgun REST helper ---
    const sendEmail = async (to: string, subject: string, text: string, html: string) => {
      const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");

      const form = new URLSearchParams();
      form.append("from", sender);
      form.append("to", to);
      form.append("subject", subject);
      form.append("text", text);
      form.append("html", html);
      form.append("h:Reply-To", replyTo);
      if (TEST_MODE) form.append("o:testmode", "yes"); // optional test mode (no delivery)

      const resp = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
      });

      if (!resp.ok) {
        const detail = await resp.text().catch(() => "");
        throw new Error(`Mailgun error ${resp.status}: ${detail}`);
      }
      return resp.json();
    };

    // Send both emails (separately)
    await sendEmail(
      customerEmail,
      "Your quote from Devon's Handyman Services",
      customerText,
      customerHtml
    );
    await sendEmail(
      OWNER_EMAIL,
      `New Quote Request from ${customerName || customerEmail}`,
      ownerText,
      ownerHtml
    );

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Email send failed" });
  }
}
