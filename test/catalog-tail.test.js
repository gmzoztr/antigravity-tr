const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { transformDesktopSources } = require('../src/desktop_patcher');
const rows = [...require('./catalog-tail.json'), ...require('./reported-oct5.json'), ...require('./catalog-remaining.json')];
const dictionary = require('../scripts/desktop_full_dictionary.json');

test('catalog tail descriptions, split Wiz text, and server names', async () => {
  const dom = new JSDOM('<body><h2>Wiz</h2><h2>S&amp;P Global</h2><input placeholder="Search MCP servers by name"></body>', { runScripts: 'outside-only' });
  try {
    const doc = dom.window.document;
    for (const row of rows) {
      const p = doc.createElement('p'); p.textContent = row.source; doc.body.append(p);
    }
    const wizSource = Object.keys(dictionary).find(k => k.startsWith('The Wiz MCP') && k.endsWith('—'));
    const span = doc.createElement('span'); span.textContent = wizSource; doc.body.append(span);
    dom.window.eval(transformDesktopSources(new Map([['dist/preload.js', '"use strict";']])).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    rows.forEach((row, i) => assert.equal(doc.querySelectorAll('p')[i].textContent, row.translation));
    assert.equal(span.textContent, dictionary[wizSource]);
    assert.deepEqual([...doc.querySelectorAll('h2')].map(n => n.textContent), ['Wiz', 'S&P Global']);
    assert.equal(doc.querySelector('input').placeholder, 'MCP sunucularını ada göre ara');
  } finally { dom.window.close(); }
});

test('catalog descriptions tolerate line breaks without translating user content', async () => {
  const source = Object.keys(dictionary).find(k => k.startsWith('The Wiz MCP') && k.endsWith('mitigation.'));
  const dom = new JSDOM('<body><p></p><pre></pre><div class="markdown"></div></body>', { runScripts: 'outside-only' });
  try {
    const doc = dom.window.document;
    const multiline = source.replace(/\. /g, '.\n\n');
    for (const selector of ['p', 'pre', '.markdown']) doc.querySelector(selector).textContent = multiline;
    dom.window.eval(transformDesktopSources(new Map([['dist/preload.js', '"use strict";']])).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    assert.equal(doc.querySelector('p').textContent, dictionary[source]);
    assert.equal(doc.querySelector('pre').textContent, multiline);
    assert.equal(doc.querySelector('.markdown').textContent, multiline);
  } finally { dom.window.close(); }
});
