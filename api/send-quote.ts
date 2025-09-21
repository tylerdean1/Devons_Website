// api/send-quote.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Env vars to set in Vercel (Preview + Production):
 *  - MAILGUN_API_KEY (private key, US region)
 *  - MAILGUN_DOMAIN = mg.devonmccleese.com
 *  - OWNER_EMAIL = devonmgm@gmail.com
 * Optional:
 *  - MAILGUN_TEST_MODE = 1 (accept but don't deliver)
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
    const TEST_MODE = process.env.MAILGUN_TEST_MODE === "1";

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      return res.status(500).json({ error: "Missing Mailgun configuration" });
    }

    // Body might be object or JSON string (make ESLint happy; no empty catch)
    let raw: unknown = req.body ?? {};
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = {};
      }
    }
    const body = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};

    type QuoteRequestBody = {
      customerEmail?: string;
      customerName?: string;
      quote?: string; // preformatted details from the form/cart
      meta?: unknown;
    };

    const { customerEmail, customerName, quote, meta } = (body as QuoteRequestBody) ?? {};
    if (!customerEmail || !quote) {
      return res.status(400).json({ error: "Missing fields: customerEmail and quote are required." });
    }

    // Use a human from-address; replies go to your Gmail via Reply-To
    const sender = `Devon's Handyman <quotes@${MAILGUN_DOMAIN}>`;
    const replyTo = "devonmgm@gmail.com";

    // ====== Brand-styled, email-safe template (matches gray-900 / yellow-400) ======
    const COLORS = {
      header: "#111827",   // gray-900
      bodyBg: "#f6f7f9",
      cardBorder: "#e5e7eb",
      accent: "#facc15",   // yellow-400
      textPrimary: "#111827",
      textMuted: "#6b7280",  // gray-500
      blockBg: "#f3f4f6",    // gray-100
    };

    const escapeText = (s: string) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    function renderEmail({
      title,
      introHtml,
      quoteText,
      footerHtml,
    }: { title: string; introHtml: string; quoteText: string; footerHtml?: string; }) {
      const q = escapeText(quoteText);
      return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.bodyBg};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.bodyBg};">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="100%" style="max-width:680px;background:#fff;border-radius:12px;border:1px solid ${COLORS.cardBorder};overflow:hidden;">
            <tr>
              <td style="background:${COLORS.header};color:#fff;padding:18px 24px;font:600 18px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
                Devon’s Handyman Services
                <div style="height:4px;background:${COLORS.accent};margin:12px -24px -18px -24px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.textPrimary};">
                <h1 style="margin:0 0 10px 0;font:700 22px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.textPrimary};">
                  ${escapeText(title)}
                </h1>
                <div style="margin:0 0 16px 0;">${introHtml}</div>

                <div style="background:${COLORS.blockBg};border:1px solid ${COLORS.cardBorder};border-radius:10px;padding:16px;white-space:pre-wrap;color:${COLORS.textPrimary};
                            font:400 14px/1.55 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
${q}
                </div>

                ${footerHtml ? `<div style="margin:16px 0 0 0;color:${COLORS.textPrimary};">${footerHtml}</div>` : ""}

                <hr style="border:none;border-top:1px solid ${COLORS.cardBorder};margin:24px 0;">
                <p style="margin:0;color:${COLORS.textMuted};font-size:13px;">
                  Devon McCleese · Handyman Services<br>
                  <a href="mailto:devonmgm@gmail.com" style="color:#2563eb;text-decoration:none;">devonmgm@gmail.com</a> · (904) 501-7147
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0 0;color:#9ca3af;font:400 12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
            Tip: Reply to this email to continue the conversation.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    }
    // ================================================================================

    // Plain-text fallbacks (good for deliverability)
    const customerText = `Hi ${customerName || "there"},

Thanks for reaching out! Here are your details:

${quote}

We’ll review and get back to you within 24 hours.

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

    const customerHtml = renderEmail({
      title: "Your quote request",
      introHtml: `Hi ${escapeText(customerName || "there")}, thanks for reaching out! Here are your details:`,
      quoteText: quote,
      footerHtml: "We’ll review and get back to you within 24 hours.",
    });

    const ownerHtml = renderEmail({
      title: "New quote request",
      introHtml: `<strong>Customer:</strong> ${escapeText(customerName || "Not provided")}
                  <br><strong>Email:</strong> <a href="mailto:${encodeURIComponent(customerEmail)}">${escapeText(customerEmail)}</a>`,
      quoteText: quote,
      footerHtml: meta
        ? `<strong>Additional info:</strong><br><pre style="white-space:pre-wrap;margin:8px 0 0 0;">${escapeText(
            JSON.stringify(meta, null, 2)
          )}</pre>`
        : "",
    });

    // --- Mailgun helper
    const sendEmail = async (to: string, subject: string, text: string, html: string) => {
      const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");
      const form = new URLSearchParams();
      form.append("from", sender);
      form.append("to", to);
      form.append("subject", subject);
      form.append("text", text);
      form.append("html", html);
      form.append("h:Reply-To", replyTo);
      // Extra headers (optional; fine for transactional)
      form.append("h:List-Unsubscribe", "<mailto:devonmgm@gmail.com?subject=unsubscribe>");
      form.append("h:List-Unsubscribe-Post", "List-Unsubscribe=One-Click");
      if (TEST_MODE) form.append("o:testmode", "yes");

      const resp = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      });
      if (!resp.ok) throw new Error(`Mailgun error ${resp.status}: ${await resp.text()}`);
      return resp.json();
    };

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
