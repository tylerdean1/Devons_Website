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
npm test
```

The build renders a separate HTML page for the homepage, services, and three featured services. The quote and project-list pages are rendered with `noindex`. Keep `src/data/site.ts`, `src/data/seo.ts`, `scripts/prerender.mjs`, and `public/sitemap.xml` in sync when changing the service area or public routes. The service-area business address is intentionally absent from the website and structured data.

## Quote email configuration

The quote form posts to the server-side `/api/send-quote` Vercel Function. That function sends
two separate messages through [Resend](https://resend.com): the full request to Devon and a
brief confirmation of the selected services and scheduling details to the customer. The Resend
credential never reaches the browser. Devon can reply to the customer notification, and the
customer can reply to their confirmation to reach Devon. A submission ID prevents duplicate
messages if a request is retried.

Required Vercel environment variable:

- `RESEND_API_KEY` — a Resend sending key with access to the verified `mail.devonmccleese.com`
  domain.

Optional environment variables:

- `OWNER_EMAIL` — Devon's inbox for new quote notifications. It defaults to `devonmgm@gmail.com`.
- `QUOTE_FROM_EMAIL` — the authenticated sender. It defaults to
  `Devon McCleese Website <quotes@mail.devonmccleese.com>`.

The sending domain must remain verified in Resend. If the domain or API key changes, update the
Vercel environment variables and redeploy so the server function receives the new configuration.

## Stripe invoices

The private `/invoices/` page lets the owner create manual USD invoices, send them through Stripe,
and review the latest payment status from Stripe. Customers pay on Stripe’s hosted invoice page;
the website does not collect card numbers. Invoice records and payment status live in Stripe, so
there is no local payment database or payment webhook to maintain.

Follow [`docs/stripe-invoice-setup.md`](docs/stripe-invoice-setup.md) to complete account onboarding,
configure Vercel environment variables, test with Stripe test mode, and switch to live payments.
Keep all Stripe and invoice-desk secrets in Vercel only. Do not commit them or expose them to browser
code. Test mode does not email customers or accept real payments.
