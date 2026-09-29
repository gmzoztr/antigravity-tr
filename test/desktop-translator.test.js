const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { transformDesktopSources } = require('../src/desktop_patcher');

function fixture() {
  return new Map([
    ['dist/preload.js', '"use strict";'],
    ['dist/menu.js', '"use strict"; const electron_1 = {}; const menu = {}; electron_1.Menu.setApplicationMenu(menu);'],
    ['dist/tray.js', 'const label = "No agents running";'],
    ['dist/loadingOverlay.js', 'const label = "Loading Antigravity";'],
    ['dist/provisionSplash.js', 'const label = "Setting up WSL:";']
  ]);
}

test('repeated installation produces identical valid JavaScript and exactly one translator', () => {
  const first = transformDesktopSources(fixture());
  const second = transformDesktopSources(first);
  assert.deepEqual(second, first);
  assert.equal((first.get('dist/preload.js').match(/const dictionary =/g) || []).length, 1);
  assert.equal((first.get('dist/menu.js').match(/function menuToTemplate/g) || []).length, 1);
});

test('DOM translation settles, follows added UI and attribute changes, preserves code and message content', { timeout: 5000 }, async () => {
  const dom = new JSDOM('<body><button>Save</button><span>Antigravity</span><pre><span>Save</span></pre><div class="markdown">Save</div><textarea>Save</textarea><input value="Save"></body>', { runScripts: 'outside-only' });
  try {
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    const doc = dom.window.document;
    assert.equal(doc.querySelector('button').textContent, 'Kaydet');
    assert.equal(doc.querySelector('pre').textContent, 'Save');
    assert.equal(doc.querySelector('.markdown').textContent, 'Save');
    assert.equal(doc.querySelector('textarea').value, 'Save');
    assert.equal(doc.querySelector('input').value, 'Save');
    const button = doc.createElement('button'); button.textContent = 'Cancel'; doc.body.append(button);
    doc.querySelector('input').setAttribute('aria-label', 'Save');
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    assert.equal(button.textContent, 'İptal');
    assert.equal(doc.querySelector('input').getAttribute('aria-label'), 'Kaydet');
    let mutations = 0;
    const observer = new dom.window.MutationObserver(ms => { mutations += ms.length; });
    observer.observe(doc.body, { characterData: true, subtree: true, attributes: true });
    await new Promise(resolve => dom.window.setTimeout(resolve, 30));
    assert.equal(mutations, 0);
    observer.disconnect();
  } finally { dom.window.close(); }
});
