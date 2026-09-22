/**
 * Quote delivery configuration:
 *  - OWNER_EMAIL (optional; defaults to Devon's inbox)
 *
 * The handler uses FormSubmit's server-side AJAX endpoint so the browser never
 * needs an email-provider credential. FormSubmit may send a one-time activation
 * email before it accepts the first real submission.
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

interface FormSubmitResponse {
  success?: boolean | string;
  message?: string;
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_OWNER_EMAIL = "devonmgm@gmail.com";
const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

function parseRequestBody(raw: unknown): Record<string, unknown> {
  if (typeof raw === "string") {
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

function parseFormSubmitResponse(responseText: string): FormSubmitResponse {
  try {
    const parsed: unknown = JSON.parse(responseText);
    return parsed && typeof parsed === "object"
      ? (parsed as FormSubmitResponse)
      : {};
  } catch {
    return {};
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const ownerEmail = (process.env.OWNER_EMAIL || DEFAULT_OWNER_EMAIL).trim();

    if (!EMAIL_PATTERN.test(ownerEmail)) {
      console.error("[send-quote] Invalid owner email configuration", {
        ownerEmail,
        trigger: "background",
      });
      return res.status(500).json({ error: "Invalid email configuration" });
    }

    const body = parseRequestBody(req.body) as QuoteRequestBody;
    const normalizedCustomerEmail =
      typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const normalizedCustomerName =
      typeof body.customerName === "string" ? body.customerName.trim() : "";
    const normalizedQuote = typeof body.quote === "string" ? body.quote.trim() : "";
    const normalizedMeta =
      body.meta && typeof body.meta === "object" ? body.meta : undefined;

    if (!normalizedCustomerEmail || !normalizedQuote) {
      return res.status(400).json({
        error: "Missing fields: customerEmail and quote are required.",
      });
    }

    if (!EMAIL_PATTERN.test(normalizedCustomerEmail)) {
      return res.status(400).json({
        error: "customerEmail must be a valid email address.",
      });
    }

    const customerName = normalizedCustomerName || "Not provided";
    const message = [
      "New quote request received from devonmccleese.com",
      "",
      `Customer: ${customerName}`,
      `Email: ${normalizedCustomerEmail}`,
      "",
      "Quote details:",
      normalizedQuote,
      "",
      "Additional information:",
      normalizedMeta ? JSON.stringify(normalizedMeta, null, 2) : "Not provided",
    ].join("\n");

    const providerResponse = await fetch(
      `${FORM_SUBMIT_ENDPOINT}/${encodeURIComponent(ownerEmail)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://devonmccleese.com",
          Referer: "https://devonmccleese.com/",
        },
        body: JSON.stringify({
          name: customerName,
          email: normalizedCustomerEmail,
          _replyto: normalizedCustomerEmail,
          _subject: `New quote request from ${customerName}`,
          _template: "table",
          _url: "https://devonmccleese.com/",
          message,
        }),
      },
    );

    const providerText = await providerResponse.text();
    const providerResult = parseFormSubmitResponse(providerText);
    const providerMessage = providerResult.message || "";
    const activationRequired = /activat/i.test(providerMessage);
    const providerSuccess =
      providerResult.success === true ||
      providerResult.success === "true" ||
      activationRequired;

    if (!providerResponse.ok || !providerSuccess) {
      console.error("[send-quote] FormSubmit delivery failed", {
        status: providerResponse.status,
        message: providerResult.message || providerResult.error || providerText,
        trigger: "user",
      });
      return res.status(502).json({
        error: "Email delivery failed. Please try again or call Devon directly.",
        providerStatus: providerResponse.status,
        providerMessage: providerMessage.slice(0, 300),
      });
    }

    return res.status(200).json({
      ok: true,
      activationRequired,
    });
  } catch (error) {
    console.error("[send-quote] FormSubmit request failed", {
      error,
      trigger: "user",
    });
    return res.status(502).json({
      error: "Email delivery failed. Please try again or call Devon directly.",
    });
  }
}
