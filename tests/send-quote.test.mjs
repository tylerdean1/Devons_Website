import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const compiled = await build({
  entryPoints: ['api/send-quote.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { default: handler } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].contents).toString('base64')}`);

const quote = {
  submissionId: 'f05d668f-034d-4fa8-982f-4db8df0042da',
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '555-0100',
  address: '123 Example Street',
  preferredDate: 'next-week',
  preferredTime: '10am-12pm',
  additionalNotes: 'Please call first.',
  services: [{ name: '<Paint & Repair>', category: 'Interior', description: 'One wall', quantity: 2 }],
};

function response() {
  return {
    statusCode: 200,
    setHeader() {},
    end(body) { this.body = JSON.parse(body); },
  };
}

test('a quote sends distinct owner and customer messages with a safe summary', async () => {
  process.env.RESEND_API_KEY = 'test-key';
  let sent;
  let idempotencyKey;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails/batch');
    sent = JSON.parse(options.body);
    idempotencyKey = options.headers['Idempotency-Key'];
    return { ok: true, status: 200, json: async () => ({ data: [{ id: 'owner-id' }, { id: 'customer-id' }] }) };
  };

  const result = response();
  await handler({ method: 'POST', body: quote }, result);

  assert.equal(result.statusCode, 200);
  assert.equal(result.body.success, true);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[0].to, ['devonmgm@gmail.com']);
  assert.deepEqual(sent[1].to, ['customer@example.com']);
  assert.equal(sent[0].reply_to, 'customer@example.com');
  assert.equal(sent[1].reply_to, 'devonmgm@gmail.com');
  assert.match(sent[1].text, /<Paint & Repair> \(Interior\) x2/);
  assert.match(sent[1].text, /One wall/);
  assert.match(sent[1].text, /next-week/);
  assert.match(sent[1].html, /&lt;Paint &amp; Repair&gt;/);
  assert.doesNotMatch(sent[1].html, /<Paint & Repair>/);
  assert.match(idempotencyKey, /^quote-f05d668f-034d-4fa8-982f-4db8df0042da-[0-9a-f]{16}$/);
});

test('a provider failure does not tell the customer that email was sent', async () => {
  process.env.RESEND_API_KEY = 'test-key';
  globalThis.fetch = async () => ({ ok: false, status: 422, json: async () => ({ name: 'validation_error' }) });
  const result = response();
  await handler({ method: 'POST', body: quote }, result);
  assert.equal(result.statusCode, 502);
  assert.equal(result.body.success, undefined);
});

test('custom projects appear in both emails when selected alone or with another service', async () => {
  process.env.RESEND_API_KEY = 'test-key';
  const customProject = {
    name: 'Custom Project / Other',
    category: 'Other',
    description: 'Describe a custom home project so Devon can confirm the scope.',
    quantity: 1,
  };

  async function submit(services, submissionId) {
    let sent;
    globalThis.fetch = async (_url, options) => {
      sent = JSON.parse(options.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ id: 'owner-id' }, { id: 'customer-id' }] }) };
    };

    const result = response();
    await handler({ method: 'POST', body: { ...quote, submissionId, services } }, result);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.success, true);
    return sent;
  }

  const customOnly = await submit([customProject], '735d668f-034d-4fa8-982f-4db8df0042da');
  const mixed = await submit([
    { name: 'Drywall Installation & Repair', category: 'Interior', description: 'Patch and finish a wall.', quantity: 1 },
    customProject,
  ], '835d668f-034d-4fa8-982f-4db8df0042da');

  for (const messages of [customOnly, mixed]) {
    for (const message of messages) {
      assert.match(message.text, /Custom Project \/ Other \(Other\) x1/);
      assert.match(message.text, /Describe a custom home project/);
      assert.match(message.html, /Custom Project \/ Other/);
      assert.match(message.html, /Describe a custom home project/);
      assert.doesNotMatch(message.text, /No specific services selected/);
    }
  }
  assert.match(mixed[0].text, /Drywall Installation & Repair/);
  assert.match(mixed[1].text, /Drywall Installation & Repair/);
});
