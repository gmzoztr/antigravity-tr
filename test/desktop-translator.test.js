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

test('customization budget translates split React text nodes and copy tooltip', async () => {
  const dom = new JSDOM('<body><div id="budget"></div><button title="Copy Path">Copy Path</button></body>', { runScripts: 'outside-only' });
  try {
    const budget = dom.window.document.getElementById('budget');
    for (const value of ['1.148', ' / ', '20.000', ' tokens (', '5.7', '%)']) budget.append(dom.window.document.createTextNode(value));
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    assert.equal(budget.textContent, '1.148 / 20.000 token (5.7%)');
    assert.equal(dom.window.document.querySelector('button').title, 'Yolu Kopyala');
  } finally { dom.window.close(); }
});

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

test('custom menu items and select labels translate without changing option values', async () => {
  const dom = new JSDOM('<body><div role="menu"><span>Zoom In</span><span>Zoom Out</span><span>Reset Zoom</span><span>Minimize</span><span>Maximize</span></div><select><option value="always">Always</option><option value="never">Never</option></select></body>', { runScripts: 'outside-only' });
  try {
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    assert.deepEqual([...dom.window.document.querySelectorAll('[role="menu"] span')].map(n => n.textContent), ['Yakınlaştır', 'Uzaklaştır', 'Yakınlaştırmayı Sıfırla', 'Simge Durumuna Küçült', 'Ekranı Kapla']);
    assert.deepEqual([...dom.window.document.querySelectorAll('option')].map(n => [n.value, n.textContent]), [['always', 'Her Zaman'], ['never', 'Asla']]);
  } finally { dom.window.close(); }
});

test('reported settings screens translate initial and asynchronously added labels', async () => {
  const labels = ['New', 'Search tasks...', 'No scheduled tasks configured.', 'Five Hour Limit Remaining', 'Inherit Global', 'Full machine', 'Windows Subsystem for Linux', 'Connect', 'Version', 'App version', 'Automatic Check for Updates', 'Upgrade', 'Model Credits', 'Enable AI Credit Overages', 'Back', 'File Permissions', 'File Reads', 'File Writes', 'Allow', 'Deny'];
  const dom = new JSDOM('<body><div role="dialog"></div></body>', { runScripts: 'outside-only' });
  try {
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 10));
    const container = dom.window.document.querySelector('[role="dialog"]');
    for (const text of labels) { const node = dom.window.document.createElement('span'); node.textContent = text; container.append(node); }
    const quota = dom.window.document.createElement('span'); quota.textContent = 'Resets in 16h 24m'; container.append(quota);
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    labels.forEach((text, index) => assert.notEqual(container.children[index].textContent, text, text));
    assert.equal(quota.textContent, '16 saat 24 dakika sonra yenilenir');
    quota.textContent = 'Resets in 16h 23m';
    await new Promise(resolve => dom.window.setTimeout(resolve, 20));
    assert.equal(quota.textContent, '16 saat 23 dakika sonra yenilenir');
  } finally { dom.window.close(); }
});
test('sidebar status and shortcut tooltip fit while message text stays intact', async () => {
  const dom = new JSDOM('<body><div class="markdown">Copy<div role="tooltip">Copy</div></div><div id="shortcut" style="white-space:nowrap">Alt+Enter On empty prompt, sends next in queue</div><span id="updated">Updated 3 Eki, 14:09</span><span>Archived Only</span></body>', {runScripts:'outside-only'});
  try {
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve => dom.window.setTimeout(resolve,20));
    const doc=dom.window.document;
    assert.equal(doc.querySelector('.markdown').firstChild.nodeValue,'Copy');
    assert.equal(doc.querySelector('[role="tooltip"]').textContent,'Kopyala');
    assert.equal(doc.querySelector('#shortcut').style.whiteSpace,'normal');
    assert.equal(doc.querySelector('#shortcut').style.overflowWrap,'anywhere');
    assert.equal(doc.querySelector('#shortcut').textContent,'Alt+Enter: Alan boşsa sıradaki iletiyi gönderir');
    assert.equal(doc.querySelector('#updated').textContent,'Güncellendi: 3 Eki, 14:09');
  } finally {dom.window.close();}
});
test('native context menu translates nested labels and preserves actions and IDs', () => {
  const vm=require('node:vm');
  const input=fixture();
  input.set('dist/ipcHandlers.js', 'function buildContextMenuTemplate(items, onSelect) { return items.map(item => ({id:item.id,label:item.label,submenu:item.submenu?buildContextMenuTemplate(item.submenu,onSelect):undefined,click:()=>onSelect(item.id)})); }');
  const output=transformDesktopSources(input);
  assert.deepEqual(transformDesktopSources(output),output);
  const context={};vm.createContext(context);vm.runInContext(output.get('dist/ipcHandlers.js'),context);
  let selected;
  const result=context.buildContextMenuTemplate([{id:'rename',label:'Rename'},{id:'read',label:'Mark Unread'},{id:'copy',label:'Copy',submenu:[{id:'unknown',label:'Custom project title'},{id:'name',label:'Conversation Name'},{id:'cid',label:'Conversation ID'},{id:'project',label:'Project Name'},{id:'right',label:'Split Right'},{id:'down',label:'Split Down'}]},{id:'split',label:'Split'},{id:'archive',label:'Archive'},{id:'delete',label:'Delete'}],id=>selected=id);
  assert.deepEqual(Array.from(result,x=>x.label),['Yeniden Adlandır','Okunmadı Olarak İşaretle','Kopyala','Böl','Arşivle','Sil']);
  assert.deepEqual(Array.from(result[2].submenu,x=>x.label),['Custom project title','Konuşma Adı','Konuşma Kimliği','Proje Adı','Sağa Böl','Aşağı Böl']);result[0].click();assert.equal(selected,'rename');
});
test('consent split across inline elements translates without changing checkbox or policy link', async () => {
  const dom = new JSDOM('<body><label><input type="checkbox" checked><span>Yes, I agree to help improve Antigravity by allowing Google to collect and use my </span><span>Interactions data, subject to the Google Antigravity </span><a href="https://example.test/terms">Terms of Service</a></label></body>', {runScripts:'outside-only'});
  try {
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(resolve=>dom.window.setTimeout(resolve,20));
    assert.ok(!dom.window.document.querySelector('label').textContent.includes('Interactions data'));
    assert.ok(dom.window.document.querySelector('label').textContent.includes('etkileşim verilerimi'));
    assert.equal(dom.window.document.querySelector('input').checked,true);
    assert.equal(dom.window.document.querySelector('a').href,'https://example.test/terms');
  } finally {dom.window.close();}
});
test('new marketplace and automation UI preserves product names, form values and button behavior', async () => {
  const catalog=require('./marketplace-oct8.json');
  const dom=new JSDOM('<body><input placeholder="Search automations..." value="My automation"><button id="add">Add Automation</button><h2>New Automation</h2><span>Installed</span><span>Worktree</span></body>',{runScripts:'outside-only'});
  try {
    const doc=dom.window.document;
    for(const item of catalog){const card=doc.createElement('div');const title=doc.createElement('h3');title.textContent=item.name;const description=doc.createElement('p');description.textContent=item.description;card.append(title,description);doc.body.append(card);}
    let clicked=false;doc.querySelector('#add').onclick=()=>clicked=true;
    dom.window.eval(transformDesktopSources(fixture()).get('dist/preload.js'));
    await new Promise(r=>dom.window.setTimeout(r,20));
    assert.equal(doc.querySelector('input').value,'My automation');assert.equal(doc.querySelector('input').placeholder,'Otomasyonlarda ara...');
    assert.equal(doc.querySelector('#add').textContent,'Otomasyon Ekle');doc.querySelector('#add').click();assert.equal(clicked,true);
    [...doc.querySelectorAll('h3')].forEach((el,i)=>assert.equal(el.textContent,catalog[i].name));
    [...doc.querySelectorAll('p')].forEach((el,i)=>assert.notEqual(el.textContent,catalog[i].description,catalog[i].name));
  }finally{dom.window.close();}
});
