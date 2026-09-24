import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface InvoiceApiRequest extends IncomingMessage {
  body?: unknown;
}

export type InvoiceApiResponse = ServerResponse<IncomingMessage>;

const COOKIE_NAME = 'devon_invoice_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const ADMIN_PASSWORD_MIN_LENGTH = 24;
const SESSION_SECRET_MIN_LENGTH = 32;
const MAX_REQUEST_BODY_BYTES = 64 * 1024;

function envSecret(name: string): string {
  return process.env[name]?.trim() ?? '';
}

export function invoiceSetupReady(): boolean {
  const stripeKey = envSecret('STRIPE_SECRET_KEY');
  return /^sk_(test|live)_[A-Za-z0-9]+$/.test(stripeKey)
    && envSecret('INVOICE_ADMIN_PASSWORD').length >= ADMIN_PASSWORD_MIN_LENGTH
    && envSecret('INVOICE_SESSION_SECRET').length >= SESSION_SECRET_MIN_LENGTH;
}

export function sendJson(response: InvoiceApiResponse, statusCode: number, data: Record<string, unknown>): void {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(data));
}

export async function readJsonBody(request: InvoiceApiRequest): Promise<unknown> {
  const contentLength = Number(request.headers['content-length']);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    throw new Error('Request body is too large.');
  }

  if (request.body !== undefined) {
    if (typeof request.body === 'string' || Buffer.isBuffer(request.body)) {
      const rawBody = request.body.toString();
      if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BODY_BYTES) throw new Error('Request body is too large.');
      return JSON.parse(rawBody);
    }
    if (Buffer.byteLength(JSON.stringify(request.body), 'utf8') > MAX_REQUEST_BODY_BYTES) throw new Error('Request body is too large.');
    return request.body;
  }

  const chunks: Buffer[] = [];
  let bytesRead = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    bytesRead += buffer.byteLength;
    if (bytesRead > MAX_REQUEST_BODY_BYTES) throw new Error('Request body is too large.');
    chunks.push(buffer);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) as unknown : null;
}

export function isSameOriginRequest(request: InvoiceApiRequest): boolean {
  const origin = request.headers.origin;
  if (typeof origin !== 'string') return false;

  const configuredOrigin = envSecret('INVOICE_SITE_ORIGIN') || 'https://devonmccleese.com';
  if (origin === configuredOrigin) return true;

  if (process.env.NODE_ENV !== 'production') {
    try {
      const parsedOrigin = new URL(origin);
      return ['localhost', '127.0.0.1'].includes(parsedOrigin.hostname);
    } catch {
      return false;
    }
  }

  return false;
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sessionSignature(expiresAt: string): string {
  return createHmac('sha256', envSecret('INVOICE_SESSION_SECRET'))
    .update(expiresAt)
    .digest('base64url');
}

export function passwordMatches(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const expected = envSecret('INVOICE_ADMIN_PASSWORD');
  return expected.length >= ADMIN_PASSWORD_MIN_LENGTH && safeEqual(value, expected);
}

export function createSessionCookie(request: InvoiceApiRequest): string {
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  const signature = sessionSignature(expiresAt);
  const secure = process.env.NODE_ENV === 'production' || request.headers['x-forwarded-proto'] === 'https';
  const securePart = secure ? '; Secure' : '';
  return `${COOKIE_NAME}=${expiresAt}.${signature}; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${securePart}`;
}

export function expiredSessionCookie(request: InvoiceApiRequest): string {
  const secure = process.env.NODE_ENV === 'production' || request.headers['x-forwarded-proto'] === 'https';
  const securePart = secure ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=0${securePart}`;
}

export function requestHasInvoiceSession(request: InvoiceApiRequest): boolean {
  if (!invoiceSetupReady()) return false;
  const cookieHeader = request.headers.cookie;
  if (typeof cookieHeader !== 'string') return false;

  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const token = cookie?.slice(COOKIE_NAME.length + 1);
  const [expiresAt, signature, extra] = token?.split('.') ?? [];
  if (!expiresAt || !signature || extra || !/^\d{10}$/.test(expiresAt)) return false;
  if (Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sessionSignature(expiresAt));
}

export function ownerCookieName(): string {
  return COOKIE_NAME;
}
