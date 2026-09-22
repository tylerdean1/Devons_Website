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

The quote form posts to the server-side `/api/send-quote` Vercel Function. That function sends
through [Resend](https://resend.com), so the Resend credential never reaches the browser and
customers can reply directly to their original email address.

Required Vercel environment variable:

- `RESEND_API_KEY` — a Resend sending key with access to the verified `mail.devonmccleese.com`
  domain.

Optional environment variables:

- `OWNER_EMAIL` — Devon's inbox for new quote notifications. It defaults to `devonmgm@gmail.com`.
- `QUOTE_FROM_EMAIL` — the authenticated sender. It defaults to
  `Devon McCleese Website <quotes@mail.devonmccleese.com>`.

The sending domain must remain verified in Resend. If the domain or API key changes, update the
Vercel environment variables and redeploy so the server function receives the new configuration.
