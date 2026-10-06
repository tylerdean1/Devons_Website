import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

test('homepage JSON-LD declares Devon’s Handyman Services as the website name', async (t) => {
  try {
    await access('dist/index.html');
  } catch {
    t.skip('Run npm run build before validating generated structured data.');
    return;
  }

  const html = await readFile('dist/index.html', 'utf8');
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json));
  const nodes = graphs.flatMap(({ '@graph': graph, ...node }) => graph ?? [node]);
  const website = nodes.find((node) => node['@type'] === 'WebSite');

  assert.ok(website, 'homepage should include a WebSite entity');
  assert.equal(website.name, "Devon's Handyman Services");
  assert.equal(website.url, 'https://devonmccleese.com/');
  assert.equal(website.publisher?.['@id'], 'https://devonmccleese.com/#business');
});

test('homepage business JSON-LD includes the real project photos shown on the site', async (t) => {
  try {
    await access('dist/index.html');
  } catch {
    t.skip('Run npm run build before validating generated structured data.');
    return;
  }

  const html = await readFile('dist/index.html', 'utf8');
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json));
  const nodes = graphs.flatMap(({ '@graph': graph, ...node }) => graph ?? [node]);
  const business = nodes.find((node) => node['@type'] === 'HomeAndConstructionBusiness');

  assert.ok(business, 'homepage should include Devon’s local business entity');
  const images = Array.isArray(business.image) ? business.image : [business.image];
  for (const path of [
    '/images/projects/flagler-beach-kitchen-remodel.jpg',
    '/images/projects/flagler-beach-bathroom-finish.jpg',
    '/images/projects/cypress-tongue-and-groove-ceiling.jpg',
  ]) {
    assert.ok(images.includes(`https://devonmccleese.com${path}`), `${path} should be associated with the business`);
  }
});
