import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDollarSign, FileText, LogOut, Plus, RefreshCw, Send, ShieldCheck, Trash2 } from 'lucide-react';

interface InvoiceSummary {
  id: string;
  number: string | null;
  status: string;
  currency: string;
  amountDue: number;
  amountPaid: number;
  created: number | null;
  dueDate: number | null;
  customerName: string;
  customerEmail: string;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
  livemode: boolean;
}

interface AuthResponse {
  configured?: boolean;
  authenticated?: boolean;
  error?: string;
}

interface LineItemDraft {
  id: string;
  description: string;
  amount: string;
}

interface InvoiceDraft {
  submissionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  memo: string;
  dueDays: number;
  items: Array<{ description: string; amountCents: number }>;
}

const initialLineItem: LineItemDraft = { id: 'line-1', description: '', amount: '' };

function formatMoney(amountCents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amountCents / 100);
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(timestamp * 1000));
}

function amountToCents(value: string): number | null {
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value) * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

async function readResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : 'The request could not be completed.';
    throw new Error(error);
  }
  return data as T;
}

export default function InvoiceAdmin() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [mode, setMode] = useState<'dashboard' | 'review'>('dashboard');
  const [items, setItems] = useState<LineItemDraft[]>([initialLineItem]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDays, setDueDays] = useState(14);
  const [draft, setDraft] = useState<InvoiceDraft | null>(null);
  const [formError, setFormError] = useState('');
  const [lastSent, setLastSent] = useState<InvoiceSummary | null>(null);
  const [testMode, setTestMode] = useState(false);

  const loadInvoices = async () => {
    const response = await fetch('/api/invoices', { headers: { Accept: 'application/json' } });
    const result = await readResponse<{ invoices?: InvoiceSummary[]; mode?: string }>(response);
    setInvoices(Array.isArray(result.invoices) ? result.invoices : []);
    setTestMode(result.mode !== 'live');
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch('/api/invoice-auth', { headers: { Accept: 'application/json' } });
        const status = await readResponse<AuthResponse>(response);
        if (!active) return;
        setConfigured(status.configured === true);
        setAuthenticated(status.authenticated === true);
        if (status.authenticated) await loadInvoices();
      } catch (error) {
        if (active) setLoginError(error instanceof Error ? error.message : 'The invoice service is unavailable.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setLoginError('');
    try {
      const response = await fetch('/api/invoice-auth', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const result = await readResponse<AuthResponse>(response);
      setAuthenticated(result.authenticated === true);
      setPassword('');
      await loadInvoices();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/invoice-auth', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setAuthenticated(false);
    setInvoices([]);
    setLastSent(null);
    setPassword('');
  };

  const refreshInvoices = async () => {
    setBusy(true);
    setFormError('');
    try {
      await loadInvoices();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Invoices could not be refreshed.');
    } finally {
      setBusy(false);
    }
  };

  const reviewInvoice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    if (!customerName.trim()) return setFormError('Enter the customer’s name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) return setFormError('Enter a valid customer email.');
    const parsedItems = items.map((item) => ({ description: item.description.trim(), amountCents: amountToCents(item.amount) }));
    if (parsedItems.some((item) => !item.description || !item.amountCents)) {
      return setFormError('Add a description and valid amount to every invoice item.');
    }
    if (parsedItems.length > 20) return setFormError('Invoices can have up to 20 line items.');
    const total = parsedItems.reduce((sum, item) => sum + (item.amountCents ?? 0), 0);
    if (total > 250_000_000) return setFormError('The invoice total cannot exceed $2,500,000.00.');

    setDraft({
      submissionId: crypto.randomUUID(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      memo: memo.trim(),
      dueDays,
      items: parsedItems.map((item) => ({ description: item.description, amountCents: item.amountCents as number })),
    });
    setMode('review');
  };

  const sendInvoice = async () => {
    if (!draft || busy) return;
    setBusy(true);
    setFormError('');
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const result = await readResponse<{ invoice?: InvoiceSummary }>(response);
      if (!result.invoice) throw new Error('Stripe did not return the invoice details.');
      setLastSent(result.invoice);
      setDraft(null);
      setMode('dashboard');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setMemo('');
      setItems([{ ...initialLineItem, id: crypto.randomUUID() }]);
      await loadInvoices();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The invoice could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  const totalCents = draft?.items.reduce((sum, item) => sum + item.amountCents, 0) ?? 0;

  return (
    <section className="min-h-screen bg-[#f7f6f2] py-12 sm:py-16" aria-labelledby="invoice-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-900">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Devon’s Handyman Services</p>
            <h1 id="invoice-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Invoice desk</h1>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">Checking invoice setup…</div>
        ) : configured === false ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <ShieldCheck className="h-9 w-9 text-amber-600" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Finish secure setup</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              The invoice desk is ready, but Stripe and owner sign-in credentials still need to be added to the Vercel project’s encrypted environment settings.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li><code>STRIPE_SECRET_KEY</code> — start with a Stripe test key, then switch to a live key after onboarding and testing.</li>
              <li><code>INVOICE_ADMIN_PASSWORD</code> — use a private random password at least 24 characters long.</li>
              <li><code>INVOICE_SESSION_SECRET</code> — use a separate random secret at least 32 characters long.</li>
            </ul>
            <p className="mt-5 text-sm text-slate-600">
              Keep these values in Vercel’s environment settings only. Never put Stripe keys in website code or send them in email or chat.
            </p>
            <a className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700" href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">
              Open Stripe API keys <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : !authenticated ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <ShieldCheck className="h-8 w-8 text-amber-600" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Owner sign-in</h2>
            <p className="mt-2 text-slate-600">Sign in to create invoices and review their payment status.</p>
            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <label className="block text-sm font-semibold text-slate-800" htmlFor="invoice-password">Invoice desk password</label>
              <input
                id="invoice-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              {loginError && <p role="alert" className="text-sm font-medium text-red-700">{loginError}</p>}
              <button type="submit" disabled={busy} className="w-full rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60">
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${testMode ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                  {testMode ? 'Test mode' : 'Live payments'}
                </span>
                <span className="text-sm text-slate-600">Invoices are stored in Stripe.</span>
              </div>
              <button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>

            {testMode && (
              <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                Test mode is active. Stripe test invoices do not send customer emails or accept real payments.
              </p>
            )}

            {lastSent && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" role="status">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-emerald-950">Invoice {lastSent.number ?? ''} sent to {lastSent.customerEmail}.</p>
                    <p className="mt-1 text-sm text-emerald-900">Amount due: {formatMoney(lastSent.amountDue, lastSent.currency)}.</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                      {lastSent.hostedInvoiceUrl && <a href={lastSent.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="underline">Open hosted invoice</a>}
                      {lastSent.invoicePdf && <a href={lastSent.invoicePdf} target="_blank" rel="noreferrer" className="underline">Download PDF</a>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'review' && draft ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <button type="button" onClick={() => { setMode('dashboard'); setDraft(null); }} disabled={busy} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-60">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Edit invoice
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Review before sending</h2>
                <p className="mt-2 text-slate-600">Stripe will email the invoice and provide the customer with a secure online payment page.</p>
                <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
                  <p><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Customer</span><span className="mt-1 block font-semibold text-slate-900">{draft.customerName}</span></p>
                  <p><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Email</span><span className="mt-1 block break-all font-semibold text-slate-900">{draft.customerEmail}</span></p>
                  <p><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Due</span><span className="mt-1 block font-semibold text-slate-900">{draft.dueDays} days after sending</span></p>
                  {draft.memo && <p className="sm:col-span-2"><span className="block text-xs font-bold uppercase tracking-wide text-slate-500">Project note</span><span className="mt-1 block text-slate-900">{draft.memo}</span></p>}
                </div>
                <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {draft.items.map((item) => (
                    <div key={`${item.description}-${item.amountCents}`} className="flex items-start justify-between gap-4 p-4">
                      <span className="text-slate-700">{item.description}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-900">{formatMoney(item.amountCents)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 bg-slate-50 p-4 text-lg font-bold text-slate-900">
                    <span>Total due</span><span className="tabular-nums">{formatMoney(totalCents)}</span>
                  </div>
                </div>
                {formError && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => { setMode('dashboard'); setDraft(null); }} disabled={busy} className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                  <button type="button" onClick={() => void sendInvoice()} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-900 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60">
                    <Send className="h-4 w-4" aria-hidden="true" /> {busy ? 'Sending invoice…' : `Send invoice for ${formatMoney(totalCents)}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
                <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={reviewInvoice}>
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-6 w-6 text-amber-600" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-slate-900">Create an invoice</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Enter the agreed customer and job details. Each line amount is the full amount for that item.</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-800">Customer name
                      <input required maxLength={120} value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" autoComplete="name" />
                    </label>
                    <label className="text-sm font-semibold text-slate-800">Email for invoice
                      <input required type="email" maxLength={254} value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" autoComplete="email" />
                    </label>
                    <label className="text-sm font-semibold text-slate-800">Phone (optional)
                      <input type="tel" maxLength={40} value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" autoComplete="tel" />
                    </label>
                    <label className="text-sm font-semibold text-slate-800">Payment due
                      <select value={dueDays} onChange={(event) => setDueDays(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal">
                        <option value={7}>Within 7 days</option>
                        <option value={14}>Within 14 days</option>
                        <option value={30}>Within 30 days</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-7">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900">Work and materials</h3>
                      <button type="button" onClick={() => setItems((current) => [...current, { id: crypto.randomUUID(), description: '', amount: '' }])} disabled={items.length >= 20} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50">
                        <Plus className="h-4 w-4" aria-hidden="true" /> Add line
                      </button>
                    </div>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={item.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_42px]">
                          <label className="sr-only" htmlFor={`invoice-item-${item.id}`}>Description for item {index + 1}</label>
                          <input id={`invoice-item-${item.id}`} required maxLength={200} value={item.description} onChange={(event) => setItems((current) => current.map((line) => line.id === item.id ? { ...line, description: event.target.value } : line))} placeholder="e.g. Drywall repair and finish" className="w-full rounded-lg border border-slate-300 px-3 py-2.5" />
                          <label className="relative block">
                            <span className="sr-only">Amount for item {index + 1}</span>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input required inputMode="decimal" type="number" min="0.01" max="1000000" step="0.01" value={item.amount} onChange={(event) => setItems((current) => current.map((line) => line.id === item.id ? { ...line, amount: event.target.value } : line))} placeholder="0.00" className="w-full rounded-lg border border-slate-300 py-2.5 pl-7 pr-3 text-right tabular-nums" />
                          </label>
                          <button type="button" aria-label={`Remove line ${index + 1}`} onClick={() => setItems((current) => current.filter((line) => line.id !== item.id))} disabled={items.length === 1} className="flex h-11 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-30">
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="mt-6 block text-sm font-semibold text-slate-800">Project note (optional)
                    <textarea maxLength={500} rows={3} value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="Short project summary or agreed payment note" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" />
                  </label>
                  {formError && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{formError}</p>}
                  <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300 sm:w-auto">
                    Review invoice <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="recent-invoices-heading">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 id="recent-invoices-heading" className="text-xl font-bold text-slate-900">Recent invoices</h2>
                      <p className="mt-1 text-sm text-slate-600">Payment status comes directly from Stripe.</p>
                    </div>
                    <button type="button" aria-label="Refresh invoices" onClick={() => void refreshInvoices()} disabled={busy} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50">
                      <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
                    </button>
                  </div>
                  {invoices.length === 0 ? (
                    <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">No invoices yet. A copy of every sent invoice will appear here.</div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {invoices.map((invoice) => (
                        <article key={invoice.id} className="rounded-xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900">{invoice.number || 'Invoice'} · {formatMoney(invoice.amountDue + invoice.amountPaid, invoice.currency)}</p>
                              <p className="mt-1 truncate text-sm text-slate-600">{invoice.customerName} · {invoice.customerEmail}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-900' : invoice.status === 'open' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>{invoice.status}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">Sent {formatDate(invoice.created)} · Due {formatDate(invoice.dueDate)}</p>
                          <div className="mt-3 flex gap-4 text-sm font-semibold">
                            {invoice.hostedInvoiceUrl && <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="text-slate-800 underline">{invoice.status === 'paid' ? 'View receipt' : 'View / pay'}</a>}
                            {invoice.invoicePdf && <a href={invoice.invoicePdf} target="_blank" rel="noreferrer" className="text-slate-600 underline">PDF</a>}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
