const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { transformDesktopSources } = require('../src/desktop_patcher');
const expected = require('./heading-style.json');
const dictionary = require('../scripts/desktop_full_dictionary.json');

test('reviewed titles use consistent Turkish capitalization', () => {
  for (const [source, translated] of Object.entries(expected)) assert.equal(dictionary[source], translated, source);
});

test('Turbo mode is a title while its description remains a sentence', async () => {
  const dom = new JSDOM('<body><div role="option"><span>Turbo mode</span><p>Disables all safety barriers for maximal iteration velocity.</p></div><input value="Turbo mode"><code>Turbo mode</code></body>', { runScripts: 'outside-only' });
  try {
    const source = transformDesktopSources(new Map([['dist/preload.js', '"use strict";']])).get('dist/preload.js');
    dom.window.eval(source);
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    const doc = dom.window.document;
    assert.equal(doc.querySelector('span').textContent, 'Turbo Mod');
    assert.equal(doc.querySelector('p').textContent, 'Daha hızlı çalışmak için tüm güvenlik kısıtlamalarını kaldırır.');
    assert.equal(doc.querySelector('input').value, 'Turbo mode');
    assert.equal(doc.querySelector('code').textContent, 'Turbo mode');
  } finally { dom.window.close(); }
});
