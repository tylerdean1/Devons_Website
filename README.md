# Devon's Handyman Services

St. Augustine-focused handyman services website built with Vite, React, TypeScript, and Tailwind CSS.

## Local development

```bash
npm ci
npm run dev
```

Available checks:

```bash
npx tsc --noEmit
npm run build
npm run lint
```

The current service area is St. Augustine and nearby St. Johns County communities. Shared business details and location copy live in `src/data/site.ts`; update that file alongside `index.html` when the service area changes.

## Quote email configuration

The quote form calls `api/send-quote.ts`, which sends through Mailgun. Configure these Vercel environment variables for the relevant deployment environments:

- `MAILGUN_API_KEY` — a Mailgun sending or private API key.
- `MAILGUN_DOMAIN` — the verified Mailgun sending domain.
- `OWNER_EMAIL` — Devon's inbox for new quote notifications.
- `MAILGUN_REGION` — `us` by default, or `eu` for a Mailgun EU domain.
- `MAILGUN_FROM_EMAIL` — optional verified `From` address; otherwise the handler uses `quotes@MAILGUN_DOMAIN`.
- `REPLY_TO_EMAIL` — optional reply-to address; otherwise it uses Devon's public email.
- `MAILGUN_TEST_MODE` — optional `1` value for Mailgun test mode.

Never put Mailgun credentials in frontend code or `VITE_*` variables.
