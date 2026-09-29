const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { repairTranslator } = require('../src/desktop_repair');

const fixture = `// ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ (V2)
const dictionary = { Antigravity: 'Antigravity', Terminal: 'Terminal', Save: 'Kaydet' };
function translate(node) {
  const val = node.nodeValue, trimmed = val.trim();
  if (dictionary[trimmed]) { node.nodeValue = val.replace(trimmed, dictionary[trimmed]); }
}`;

function mutationDrain(source, input) {
  const context = vm.createContext({});
  vm.runInContext(source, context);
  let value = input, writes = 0, pending = true;
  const node = { get nodeValue() { return value; }, set nodeValue(next) { value = next; writes++; pending = true; } };
  for (let turn = 0; pending && turn < 100; turn++) {
    pending = false;
    context.translate(node);
  }
  return { value, writes, pending };
}

test('old self-translation reproduces an endless mutation queue', () => {
  assert.equal(mutationDrain(fixture, 'Antigravity').pending, true);
});
test('fixed translation reaches idle for unchanged labels and translated labels', () => {
  const fixed = repairTranslator(fixture);
  for (const label of ['Antigravity', 'Terminal', 'toString', '__proto__']) {
    assert.deepEqual(mutationDrain(fixed, label), { value: label, writes: 0, pending: false });
  }
  assert.deepEqual(mutationDrain(fixed, ' Save '), { value: ' Kaydet ', writes: 1, pending: false });
});
test('repair is idempotent and refuses unknown sources', () => {
  const fixed = repairTranslator(fixture);
  assert.equal(repairTranslator(fixed), fixed);
  assert.throws(() => repairTranslator('unrelated source'));
});
