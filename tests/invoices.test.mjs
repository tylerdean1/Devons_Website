import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

async function loadHandler(entryPoint) {
  const compiled = await build({ entryPoints: [entryPoint], bundle: true, platform: 'node', format: 'esm', write: false });
  return (await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].contents).toString('base64')}`)).default;
}

const authHandler = await loadHandler('api/invoice-auth.ts');
const invoicesHandler = await loadHandler('api/invoices.ts');
const adminPassword = 'a-private-test-password-with-more-than-24-characters';
const sessionSecret = 'a-different-test-session-secret-with-at-least-32-characters';
const submissionId = 'f05d668f-034d-4fa8-982f-4db8df0042da';

function configure() {
  process.env.STRIPE_SECRET_KEY = 'sk_test_testsecret123';
  process.env.INVOICE_ADMIN_PASSWORD = adminPassword;
  process.env.INVOICE_SESSION_SECRET = sessionSecret;
  process.env.INVOICE_SITE_ORIGIN = 'https://devonmccleese.com';
  process.env.NODE_ENV = 'test';
}

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(body) { this.body = body ? JSON.parse(body) : null; },
  };
}

function request(method, body, { cookie = '', origin = 'https://devonmccleese.com' } = {}) {
  return { method, body, headers: { cookie, origin, 'x-forwarded-proto': 'https' } };
}

async function login() {
  const result = response();
  await authHandler(request('POST', { action: 'login', password: adminPassword }), result);
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.authenticated, true);
  return result.headers['set-cookie'].split(';')[0];
}

test('invoice endpoints require an authenticated owner session', async () => {
  configure();
  const originalFetch = globalThis.fetch;
  let stripeCalled = false;
  globalThis.fetch = async () => { stripeCalled = true; throw new Error('unexpected request'); };
  try {
    const result = response();
    await invoicesHandler(request('GET'), result);
    assert.equal(result.statusCode, 401);
    assert.equal(stripeCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('login uses a signed HttpOnly session cookie and rejects a different origin', async () => {
  configure();
  const wrongOrigin = response();
  await authHandler(request('POST', { action: 'login', password: adminPassword }, { origin: 'https://not-devonmccleese.com' }), wrongOrigin);
  assert.equal(wrongOrigin.statusCode, 403);
  assert.equal(wrongOrigin.headers['set-cookie'], undefined);

  const wrongPassword = response();
  await authHandler(request('POST', { action: 'login', password: 'wrong-password' }), wrongPassword);
  assert.equal(wrongPassword.statusCode, 401);
  assert.equal(wrongPassword.headers['set-cookie'], undefined);

  const cookie = await login();
  assert.match(cookie, /^devon_invoice_session=\d+\.[A-Za-z0-9_-]+$/);
  const sessionStatus = response();
  await authHandler(request('GET', undefined, { cookie }), sessionStatus);
  assert.deepEqual(sessionStatus.body, { configured: true, authenticated: true });

  const [name, value] = cookie.split('=');
  const [expiresAt, signature] = value.split('.');
  const tamperedCookie = `${name}=${expiresAt}.${signature.slice(0, -1)}${signature.endsWith('A') ? 'B' : 'A'}`;
  const rejectedSession = response();
  await authHandler(request('GET', undefined, { cookie: tamperedCookie }), rejectedSession);
  assert.deepEqual(rejectedSession.body, { configured: true, authenticated: false });

  const logout = response();
  await authHandler(request('POST', { action: 'logout' }, { cookie }), logout);
  assert.match(logout.headers['set-cookie'], /Max-Age=0/);
});

test('invoice creation rejects cross-origin requests before calling Stripe', async () => {
  configure();
  const cookie = await login();
  const originalFetch = globalThis.fetch;
  let stripeCalled = false;
  globalThis.fetch = async () => { stripeCalled = true; throw new Error('unexpected request'); };
  try {
    const result = response();
    await invoicesHandler(request('POST', {
      submissionId,
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '',
      memo: '',
      dueDays: 14,
      items: [{ description: 'Drywall repair', amountCents: 25000 }],
    }, { cookie, origin: 'https://attacker.example' }), result);
    assert.equal(result.statusCode, 403);
    assert.equal(stripeCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('invoice creation rejects oversized request bodies before calling Stripe', async () => {
  configure();
  const cookie = await login();
  const originalFetch = globalThis.fetch;
  let stripeCalled = false;
  globalThis.fetch = async () => { stripeCalled = true; throw new Error('unexpected request'); };
  try {
    const result = response();
    await invoicesHandler(request('POST', 'x'.repeat(64 * 1024 + 1), { cookie }), result);
    assert.equal(result.statusCode, 400);
    assert.equal(stripeCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('invoice endpoints fail closed when Stripe or owner secrets are missing', async () => {
  const names = ['STRIPE_SECRET_KEY', 'INVOICE_ADMIN_PASSWORD', 'INVOICE_SESSION_SECRET'];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];
  try {
    const auth = response();
    await authHandler(request('GET', undefined), auth);
    assert.deepEqual(auth.body, { configured: false, authenticated: false });

    const invoices = response();
    await invoicesHandler(request('GET', undefined), invoices);
    assert.equal(invoices.statusCode, 503);
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});

test('owner can create and send a Stripe invoice with validated, idempotent line items', async () => {
  configure();
  const cookie = await login();
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const parsedUrl = new URL(url);
    const params = options.body instanceof URLSearchParams ? Object.fromEntries(options.body.entries()) : {};
    calls.push({ url: String(url), method: options.method, headers: options.headers, params });

    let payload;
    if (parsedUrl.pathname === '/v1/customers') payload = { id: 'cus_example' };
    else if (parsedUrl.pathname === '/v1/invoices' && options.method === 'POST') payload = { id: 'in_example' };
    else if (parsedUrl.pathname === '/v1/invoiceitems') payload = { id: `ii_${calls.length}` };
    else if (parsedUrl.pathname.endsWith('/finalize')) payload = { id: 'in_example', status: 'open' };
    else if (parsedUrl.pathname.endsWith('/send')) payload = {
      id: 'in_example',
      number: 'INV-2026-0001',
      status: 'open',
      currency: 'usd',
      amount_due: 47500,
      amount_paid: 0,
      created: 1790280000,
      due_date: 1790884800,
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      hosted_invoice_url: 'https://invoice.stripe.com/test',
      invoice_pdf: 'https://invoice.stripe.com/test.pdf',
      livemode: false,
    };
    else throw new Error(`Unexpected Stripe URL: ${url}`);

    return { ok: true, status: 200, json: async () => payload };
  };

  try {
    const result = response();
    await invoicesHandler(request('POST', {
      submissionId,
      customerName: 'Test Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '555-0100',
      memo: 'Guest bedroom repair',
      dueDays: 14,
      items: [
        { description: 'Drywall repair', amountCents: 25000 },
        { description: 'Interior paint touch-up', amountCents: 22500 },
      ],
    }, { cookie }), result);

    assert.equal(result.statusCode, 200);
    assert.equal(result.body.invoice.number, 'INV-2026-0001');
    assert.equal(result.body.invoice.amountDue, 47500);
    assert.equal(result.body.invoice.hostedInvoiceUrl, 'https://invoice.stripe.com/test');
    assert.equal(calls.length, 6);
    assert.deepEqual(calls.map((call) => new URL(call.url).pathname), [
      '/v1/customers', '/v1/invoices', '/v1/invoiceitems', '/v1/invoiceitems', '/v1/invoices/in_example/finalize', '/v1/invoices/in_example/send',
    ]);
    assert.ok(calls.every((call) => call.headers.Authorization === `Bearer ${process.env.STRIPE_SECRET_KEY}`));
    assert.equal(calls[1].params.collection_method, 'send_invoice');
    assert.equal(calls[1].params.days_until_due, '14');
    assert.equal(calls[2].params.amount, '25000');
    assert.equal(calls[3].params.amount, '22500');
    assert.equal(new Set(calls.map((call) => call.headers['Idempotency-Key'])).size, calls.length);
    assert.equal(JSON.stringify(result.body).includes(process.env.STRIPE_SECRET_KEY), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('invalid invoices fail before any Stripe request', async () => {
  configure();
  const cookie = await login();
  const originalFetch = globalThis.fetch;
  let stripeCalled = false;
  globalThis.fetch = async () => { stripeCalled = true; throw new Error('unexpected request'); };
  try {
    const result = response();
    await invoicesHandler(request('POST', {
      submissionId,
      customerName: 'Test Customer',
      customerEmail: 'not-an-email',
      dueDays: 14,
      items: [{ description: 'Work', amountCents: -1 }],
    }, { cookie }), result);
    assert.equal(result.statusCode, 400);
    assert.equal(stripeCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('invoice list reads authoritative status from Stripe and reports test mode', async () => {
  configure();
  const cookie = await login();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(new URL(url).pathname, '/v1/invoices');
    assert.equal(new URL(url).searchParams.get('collection_method'), 'send_invoice');
    assert.equal(options.method, 'GET');
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: [{ id: 'in_paid', status: 'paid', amount_paid: 47500, amount_due: 0, currency: 'usd', customer_email: 'customer@example.com', livemode: false }] }),
    };
  };

  try {
    const result = response();
    await invoicesHandler(request('GET', undefined, { cookie }), result);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.mode, 'test');
    assert.equal(result.body.invoices[0].status, 'paid');
    assert.equal(result.body.invoices[0].amountPaid, 47500);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
