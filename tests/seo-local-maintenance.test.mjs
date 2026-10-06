import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('St. Augustine landing page presents home maintenance in its snippet and visible copy', async (t) => {
  const path = 'dist/areas/st-augustine/index.html';
  try {
    await access(path);
  } catch {
    t.skip('Run npm run build before validating prerendered local SEO content.');
    return;
  }

  const html = await readFile(path, 'utf8');
  const description = html.match(/<meta name="description" content="([^"]*)"\s*\/>/)?.[1] ?? '';
  const visibleText = html
    .replace(/<head>[\s\S]*?<\/head>/i, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  assert.match(description.toLowerCase(), /home maintenance/);
  assert.match(visibleText, /home maintenance in st\. augustine/);
});
