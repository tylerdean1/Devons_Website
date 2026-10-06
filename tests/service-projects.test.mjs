import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { build } from 'esbuild';

const compiled = await build({
  entryPoints: ['src/data/serviceDetails.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { serviceDetails } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].contents).toString('base64')}`);

test('selected past projects have responsive image assets, descriptive alt text, and captions', () => {
  const projectPages = ['kitchenFinishUpdates', 'bathroomFinishUpdates', 'customProject'];

  for (const view of projectPages) {
    const photos = serviceDetails[view].projectPhotos;
    assert.ok(Array.isArray(photos) && photos.length > 0, `${view} should show relevant past project photos`);

    for (const photo of photos) {
      assert.ok(photo.alt.trim(), `${view} photo should have descriptive alt text`);
      assert.ok(photo.caption.trim(), `${view} photo should have a visible project caption`);
      assert.ok(photo.src.startsWith('/images/projects/'), `${view} photo should use a local project image`);
      assert.ok(existsSync(resolve('public', photo.src.slice(1))), `${photo.src} should exist in the public folder`);

      const webpCandidates = photo.webpSrcSet.split(',').map((candidate) => candidate.trim().split(/\s+/));
      assert.ok(webpCandidates.length >= 3, `${view} photo should offer responsive WebP sizes`);
      for (const [src, width] of webpCandidates) {
        assert.match(width, /^\d+w$/, `${src} should declare its intrinsic width`);
        assert.ok(src.startsWith('/images/projects/') && src.endsWith('.webp'), `${src} should be a local WebP project image`);
        assert.ok(existsSync(resolve('public', src.slice(1))), `${src} should exist in the public folder`);
      }
    }
  }
});
