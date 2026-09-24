# Stripe invoice setup

The website includes a private invoice desk at `https://devonmccleese.com/invoices/`. It creates a
Stripe customer and invoice, adds the approved job line items, finalizes and emails the invoice,
then shows the Stripe hosted payment link and the current status. Customers enter payment details
on Stripe’s hosted page; the site never receives card numbers. Stripe stores the invoice history.

## Complete Stripe onboarding as Devon

Create and own the Stripe account with Devon’s business identity and payout bank details. Use
`devonmgm@gmail.com` for the account if that is the intended business inbox. Devon must review and
accept Stripe’s current agreement and personally complete any identity, business, tax, and bank
verification Stripe requests. Do not send bank details, tax identifiers, identity documents, or
Stripe credentials in chat or email.

Use the business’s accurate legal name and business type. Enter the business website,
customer-support contact details, and a recognizable statement descriptor. Verify the default
invoice payment methods and invoice email settings in Stripe. Ask the business’s tax professional
whether sales tax should be configured; this integration does not calculate or add tax by default.

## Add Vercel environment variables

In the linked Vercel project, add these server-side variables. Keep the Stripe key and both invoice
secrets out of source files, browser variables, and Git:

| Variable | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | Start with the Stripe test-mode secret key (`sk_test_…`). Replace it with the live key (`sk_live_…`) only after testing and completing onboarding. |
| `INVOICE_ADMIN_PASSWORD` | A private random password with at least 24 characters. |
| `INVOICE_SESSION_SECRET` | A separate random secret with at least 32 characters. |
| `INVOICE_SITE_ORIGIN` | Optional. Defaults to `https://devonmccleese.com`. Set this only to the canonical site origin. |

Add the three required variables to the Vercel Production environment. For isolated testing, use
Stripe test-mode credentials in a Vercel Preview environment too. Changing Vercel variables affects
new deployments, so redeploy after adding or changing them.

## Test, then enable live payments

1. Deploy the invoice code with a Stripe test key and private invoice-desk secrets.
2. Open `/invoices/`, sign in, create a clearly labeled test invoice using a test customer email,
   and verify the invoice number, hosted link, PDF, and listed status. Stripe test mode does not
   email customers or accept real money.
3. Complete Stripe onboarding, add its live secret key to the Vercel Production environment, and
   redeploy. Keep the test key in Preview if you want continued sandbox testing.
4. Sign in to `/invoices/`, confirm the page displays **Live payments**, and send only real invoices
   for work and amounts already agreed with the customer.

The form supports up to 20 USD line items, a short project note, and 7-, 14-, or 30-day payment
terms. It shows a full review before sending. The invoice API uses Stripe idempotency keys to protect
short-term retries. Stripe can prune those keys after they are at least 24 hours old. If a send
returns an ambiguous network error, check Stripe’s Recent invoices before retrying. For requests
older than 24 hours, confirm the invoice was not created before starting another one.

The owner page uses a signed, `HttpOnly`, `SameSite=Strict` cookie that expires after 12 hours. The
invoice API rejects requests without a valid owner session and checks the same-origin header for
sign-in, sign-out, and invoice creation. Invoice status is fetched from Stripe when the page opens
or refreshes. No webhook signing secret is needed for this design.
