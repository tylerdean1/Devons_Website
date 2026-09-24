import type { InvoiceApiRequest, InvoiceApiResponse } from '../src/server/invoiceSecurity.js';
import {
  createSessionCookie,
  expiredSessionCookie,
  invoiceSetupReady,
  isSameOriginRequest,
  passwordMatches,
  readJsonBody,
  requestHasInvoiceSession,
  sendJson,
} from '../src/server/invoiceSecurity.js';

interface UnknownRecord {
  [key: string]: unknown;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export default async function handler(request: InvoiceApiRequest, response: InvoiceApiResponse): Promise<void> {
  if (request.method === 'GET') {
    sendJson(response, 200, {
      configured: invoiceSetupReady(),
      authenticated: requestHasInvoiceSession(request),
    });
    return;
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!isSameOriginRequest(request)) {
    sendJson(response, 403, { error: 'This request is not allowed.' });
    return;
  }

  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { error: 'Please check the submitted information.' });
    return;
  }

  const action = isRecord(body) && typeof body.action === 'string' ? body.action : '';
  if (action === 'logout') {
    response.setHeader('Set-Cookie', expiredSessionCookie(request));
    sendJson(response, 200, { authenticated: false });
    return;
  }

  if (action !== 'login') {
    sendJson(response, 400, { error: 'Choose a valid sign-in action.' });
    return;
  }

  if (!invoiceSetupReady()) {
    sendJson(response, 503, { error: 'Invoice setup is not complete yet.' });
    return;
  }

  if (!isRecord(body) || !passwordMatches(body.password)) {
    sendJson(response, 401, { error: 'The password was not accepted.' });
    return;
  }

  response.setHeader('Set-Cookie', createSessionCookie(request));
  sendJson(response, 200, { authenticated: true });
}
