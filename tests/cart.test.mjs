import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

const compiled = await build({
  entryPoints: ['src/context/cartReducer.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { cartReducer } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].contents).toString('base64')}`);

test('requesting a service quote adds that service once without increasing an existing quantity', () => {
  const customProject = { id: '25', name: 'Custom Project / Other', category: 'Other' };
  const emptyCart = { items: [], total: 0 };

  const selected = cartReducer(emptyCart, { type: 'ENSURE_ITEM', payload: customProject });
  assert.equal(selected.items.length, 1);
  assert.equal(selected.items[0].service.id, '25');
  assert.equal(selected.items[0].quantity, 1);

  const selectedAgain = cartReducer(selected, { type: 'ENSURE_ITEM', payload: customProject });
  assert.equal(selectedAgain.items.length, 1);
  assert.equal(selectedAgain.items[0].quantity, 1);
});
