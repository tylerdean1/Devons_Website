// api/send-quote.ts
/**
 * Env vars in Vercel:
 *  - MAILGUN_API_KEY
 *  - MAILGUN_DOMAIN  (mg.devonmccleese.com)
 *  - OWNER_EMAIL     (devonmgm@gmail.com)
 * Optional:
 *  - MAILGUN_REGION  (us or eu; defaults to us)
 *  - MAILGUN_API_BASE_URL (override the regional API host when needed)
 *  - MAILGUN_FROM_EMAIL (verified sender address)
 *  - REPLY_TO_EMAIL
 * Optional:
 *  - MAILGUN_TEST_MODE = 1
 */

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  setHeader(name: string, value: string): VercelResponse;
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
  end(): VercelResponse;
}

interface QuoteRequestBody {
  customerEmail?: unknown;
  customerName?: unknown;
  quote?: unknown;
  meta?: unknown;
}

class MailgunError extends Error {
  public readonly status: number;
  public readonly responseText: string;

  constructor(
    status: number,
    responseText: string,
  ) {
    super(`Mailgun request failed with status ${status}`);
    this.name = 'MailgunError';
    this.status = status;
    this.responseText = responseText;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (tighten later)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN?.trim();
    const ownerEmail = (process.env.OWNER_EMAIL || "devonmgm@gmail.com").trim();
    const replyTo = (process.env.REPLY_TO_EMAIL || "devonmgm@gmail.com").trim();
    const testMode = process.env.MAILGUN_TEST_MODE === "1";
    const region = (process.env.MAILGUN_REGION || "us").trim().toLowerCase();
    const mailgunApiBaseUrl = (
      process.env.MAILGUN_API_BASE_URL ||
      (region === "eu" ? "https://api.eu.mailgun.net" : "https://api.mailgun.net")
    ).replace(/\/$/, "");

    if (!mailgunApiKey || !mailgunDomain) {
      console.error("[send-quote] Missing Mailgun configuration", {
        hasApiKey: Boolean(mailgunApiKey),
        hasDomain: Boolean(mailgunDomain),
        trigger: "user",
      });
      return res.status(500).json({ error: "Missing Mailgun configuration" });
    }

    if (!process.env.MAILGUN_API_BASE_URL && region !== "us" && region !== "eu") {
      console.error("[send-quote] Invalid Mailgun region", { region, trigger: "user" });
      return res.status(500).json({ error: "Invalid Mailgun region configuration" });
    }

    if (!EMAIL_PATTERN.test(ownerEmail) || !EMAIL_PATTERN.test(replyTo)) {
      console.error("[send-quote] Invalid owner/reply-to email configuration", {
        ownerEmail,
        replyTo,
        trigger: "background",
      });
      return res.status(500).json({ error: "Invalid email configuration" });
    }

    // Body may arrive as string
    let raw: unknown = req.body ?? {};
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { raw = {}; }
    }
    const body = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};

    const { customerEmail, customerName, quote, meta } = (body as QuoteRequestBody) ?? {};
    const normalizedCustomerEmail = typeof customerEmail === "string" ? customerEmail.trim() : "";
    const normalizedCustomerName = typeof customerName === "string" ? customerName.trim() : "";
    const normalizedQuote = typeof quote === "string" ? quote.trim() : "";

    if (!normalizedCustomerEmail || !normalizedQuote) {
      return res.status(400).json({ error: "Missing fields: customerEmail and quote are required." });
    }

    if (!EMAIL_PATTERN.test(normalizedCustomerEmail)) {
      return res.status(400).json({ error: "customerEmail must be a valid email address." });
    }

    // Brand colors
    const COLORS = {
      header: "#111827",   // gray-900
      bodyBg: "#f6f7f9",
      cardBorder: "#e5e7eb",
      accent: "#facc15",   // yellow-400
      text: "#111827",
      sub: "#6b7280",      // gray-500
      blockBg: "#f9fafb",  // gray-50
    };

    const sender = process.env.MAILGUN_FROM_EMAIL?.trim() || `Devon's Handyman <quotes@${mailgunDomain}>`;

    const esc = (s: string) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Clean card template (no monospace; keeps line breaks)
    function renderEmail(opts: {
      title: string;
      greeting: string;
      lead?: string;
      quoteText: string;
      extraHtml?: string;
    }) {
      const q = esc(opts.quoteText);
      return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.bodyBg}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.bodyBg}">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="100%" style="max-width:720px;background:#fff;border:1px solid ${COLORS.cardBorder};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${COLORS.header};color:#fff;padding:18px 24px;font:600 18px/1.25 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
                Devon’s Handyman Services
                <div style="height:4px;background:${COLORS.accent};margin:12px -24px -18px -24px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px;font:700 22px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.text};">
                ${esc(opts.title)}
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px 24px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.text};">
                ${opts.greeting}
              </td>
            </tr>
            ${opts.lead ? `
            <tr>
              <td style="padding:0 24px 16px 24px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.text};">
                ${opts.lead}
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:0 24px 16px 24px;">
                <div style="border-left:4px solid ${COLORS.accent};background:${COLORS.blockBg};border:1px solid ${COLORS.cardBorder};
                            border-left-color:${COLORS.accent};border-radius:10px;padding:14px 16px;color:${COLORS.text};
                            font:400 15px/1.7 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;white-space:pre-line;">
${q}
                </div>
              </td>
            </tr>

            ${opts.extraHtml ? `
            <tr>
              <td style="padding:0 24px 8px 24px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:${COLORS.text};">
                ${opts.extraHtml}
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:16px 24px 24px 24px;">
                <hr style="border:none;border-top:1px solid ${COLORS.cardBorder};margin:0 0 12px 0;">
                <p style="margin:0;color:${COLORS.sub};font:400 13px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
                  Devon McCleese · Handyman Services<br>
                  <a href="mailto:devonmgm@gmail.com" style="color:#2563eb;text-decoration:none;">devonmgm@gmail.com</a> · (904) 501-7147
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:12px 0 0 0;color:#9ca3af;font:400 12px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;">
            Tip: reply to this email to continue the conversation.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    }

    // Text versions (deliverability)
    const customerText = `Hi ${normalizedCustomerName || "there"},

Thanks for reaching out! Here are your details:

${normalizedQuote}

We’ll review and get back to you within 24 hours.

Best regards,
Devon McCleese
Handyman Services
devonmgm@gmail.com
(904) 501-7147`;

    const ownerText = `New quote request received:

Customer: ${normalizedCustomerName || "Not provided"}
Email: ${normalizedCustomerEmail}

Quote Details:
${normalizedQuote}

Additional Info:
${meta ? JSON.stringify(meta, null, 2) : "—"}`;

    // HTML versions
    const customerHtml = renderEmail({
      title: "Your quote request",
      greeting: `Hi ${esc(normalizedCustomerName || "there")},`,
      lead: "Thanks for reaching out! Here are your details:",
      quoteText: normalizedQuote,
      extraHtml: "We’ll review and get back to you within 24 hours.",
    });

    const ownerHtml = renderEmail({
      title: "New quote request",
      greeting: `<strong>Customer:</strong> ${esc(normalizedCustomerName || "Not provided")}<br>
                 <strong>Email:</strong> <a href="mailto:${encodeURIComponent(normalizedCustomerEmail)}">${esc(normalizedCustomerEmail)}</a>`,
      quoteText: normalizedQuote,
      extraHtml: meta ? `<strong>Additional info:</strong><br><div style="white-space:pre-line;margin-top:6px;">${esc(
        JSON.stringify(meta, null, 2)
      )}</div>` : "",
    });

    // ---- Mailgun helper
    const sendEmail = async (to: string, subject: string, text: string, html: string) => {
      const auth = Buffer.from(`api:${mailgunApiKey}`).toString("base64");
      // Mailgun's messages endpoint expects multipart/form-data. Let fetch set
      // the boundary automatically instead of overriding Content-Type manually.
      const form = new FormData();
      form.append("from", sender);
      form.append("to", to);
      form.append("subject", subject);
      form.append("text", text);
      form.append("html", html);
      form.append("h:Reply-To", replyTo);
      form.append("h:List-Unsubscribe", `<mailto:${replyTo}?subject=unsubscribe>`);
      form.append("h:List-Unsubscribe-Post", "List-Unsubscribe=One-Click");
      if (testMode) form.append("o:testmode", "yes");

      const resp = await fetch(`${mailgunApiBaseUrl}/v3/${mailgunDomain}/messages`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}` },
        body: form,
      });
      if (!resp.ok) {
        const responseText = await resp.text();
        throw new MailgunError(resp.status, responseText);
      }
      return resp.json();
    };

    await sendEmail(normalizedCustomerEmail, "Your quote from Devon's Handyman Services", customerText, customerHtml);
    await sendEmail(ownerEmail, `New Quote Request from ${normalizedCustomerName || normalizedCustomerEmail}`, ownerText, ownerHtml);

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    console.error("[send-quote] Email delivery failed", {
      error: err,
      trigger: "user",
    });
    const providerDetails = err instanceof MailgunError
      ? {
          providerStatus: err.status,
          providerMessage: err.responseText.replace(/[\r\n]+/g, " ").slice(0, 300),
        }
      : {};
    return res.status(502).json({
      error: "Email delivery failed. Please try again or call Devon directly.",
      ...providerDetails,
    });
  }
}
