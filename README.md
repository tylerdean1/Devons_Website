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

The quote form submits through [FormSubmit's AJAX endpoint](https://formsubmit.co/ajax-documentation)
from the live website. FormSubmit supports cross-origin browser AJAX, so the request preserves the
website origin and does not require a provider API key or server-side credential.

- `OWNER_EMAIL` — Devon's inbox for new quote notifications. It defaults to `devonmgm@gmail.com`.

FormSubmit sends a one-time activation email the first time an address is used. The inbox
owner must activate the form once; later quote requests are delivered automatically. The
website displays that activation state instead of claiming a quote was delivered before
activation is complete.
