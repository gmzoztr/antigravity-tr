const fs = require('fs');
const path = require('path');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

const trJson = require('../locales/tr.json');
const gdeRule = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));

const catStart = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const catEnd = gdeRule.replace.indexOf(';const _tr=');
const currentCat = JSON.parse(gdeRule.replace.slice(catStart, catEnd));

const trStart = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gdeRule.replace.indexOf(';const cat=');
const currentTr = JSON.parse(gdeRule.replace.slice(trStart, catCalcStart));

// NLa implementation
const FLa = new Set(["html","scss","less","json","js","ts","ie","id","php","scm"]);
const Lee = new Map([
  ["power shell","PowerShell"],["powershell","PowerShell"],
  ["javascript","JavaScript"],["typescript","TypeScript"],
  ["github","GitHub"],["jet brains","JetBrains"],["jetbrains","JetBrains"],
  ["re sharper","ReSharper"],["resharper","ReSharper"]
]);
function NLa(t){
  t=t.replace(/\.([a-z0-9])/g,(e,i)=>' \u203A '+i.toUpperCase())
     .replace(/([a-z0-9])([A-Z])/g,"$1 $2")
     .replace(/([A-Z]{1,})([A-Z][a-z])/g,"$1 $2")
     .replace(/^[a-z]/g,e=>e.toUpperCase())
     .replace(/\b\w+\b/g,e=>FLa.has(e.toLowerCase())?e.toUpperCase():e);
  for(const[e,i]of Lee)t=t.replace(new RegExp('\\b'+e+'\\b',"gi"),i);
  return t;
}

const settingPrefixes = new Set([
  'editor', 'files', 'workbench', 'window', 'terminal', 'search', 'diffEditor',
  'multiDiffEditor', 'explorer', 'security', 'debug', 'scm', 'git', 'http',
  'html', 'css', 'less', 'scss', 'json', 'javascript', 'typescript',
  'markdown', 'problems', 'output', 'comments', 'notebook', 'interactiveWindow',
  'testing', 'task', 'zenMode', 'screencastMode', 'breadcrumbs', 'settingsSync',
  'accessibility', 'telemetry', 'update', 'extensions', 'remote', 'mergeEditor',
  'chat', 'inlineChat', 'antigravity', 'application', 'outline', 'emmet', 'npm',
  'audioCues', 'simpleBrowser', 'issueReporter'
]);

// Fast regex over content
const strRegex = /"([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)"/g;
const allCandidateKeys = new Set();
let m;
while ((m = strRegex.exec(content)) !== null) {
  const k = m[1];
  const p = k.split('.')[0];
  if (settingPrefixes.has(p)) {
    if (!k.includes('.action.') && !k.includes('.Views.') && !k.startsWith('workbench.action') && !k.startsWith('editor.action') && !k.startsWith('terminal.action') && !k.startsWith('workbench.view.')) {
      allCandidateKeys.add(k);
    }
  }
}

// Also check extensions
const extDirs = [
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions',
  'C:/Users/Work-D/.antigravity-ide/extensions'
];

for (const d of extDirs) {
  if (!fs.existsSync(d)) continue;
  for (const sub of fs.readdirSync(d, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue;
    const pkgPath = path.join(d, sub.name, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const configs = pkg.contributes?.configuration;
        const configList = Array.isArray(configs) ? configs : (configs ? [configs] : []);
        for (const cfg of configList) {
          if (cfg.properties) {
            for (const k of Object.keys(cfg.properties)) {
              allCandidateKeys.add(k);
            }
          }
        }
      } catch (e) {}
    }
  }
}

// Check which ones have missing leaf in currentTr
const missingFromTr = [];
for (const k of Array.from(allCandidateKeys).sort()) {
  const n = k.lastIndexOf('.');
  const leaf = k.substring(n + 1);
  const s = NLa(leaf);
  if (!currentTr[s] && !currentTr[leaf] && !currentTr[k]) {
    missingFromTr.push({ key: k, leaf, s });
  }
}

console.log(`Total candidate setting keys: ${allCandidateKeys.size}`);
console.log(`Missing from _tr: ${missingFromTr.length}`);

// 2. Check all EXISTING values in currentTr and currentCat for broken Turkish (verb-first) or English words!
const verbFirstRegex = /^(Göster|Gizle|Etkinleştir|Devre Dışı Bırak|Aç|Kapat|Kaydet|Temizle|Yoksay|İzin Ver|Engelle|Algıla|Seç|Kopyala|Yapıştır|Sil|Kırp|Dışla|Takip Et|Birleştir|Böl|Daralt|Genişlet|Kullan|Kontrol Et|Belirle|Ayarla|Sıfırla|Yeniden Yükle|Güncelle|İndir|Yükle)\s+/;

const brokenVerbFirst = [];
for (const [k, v] of Object.entries(currentTr)) {
  if (verbFirstRegex.test(v)) {
    brokenVerbFirst.push({ key: k, value: v });
  }
}

const englishInValuesRegex = /\b(Context|Token|Tokens|Customizations|Customization|Association|Associations|Show|Hide|Enable|Disable|Enabled|Disabled|Allow|Allowed|Ignore|Ignored|Default|Inherit|Mode|Type|Format|Options|Option|Setting|Settings|Highlight|Highlighting|Selection|Hover|Cursor|Scroll|Scrolling|Bracket|Brackets|Guide|Guides|Ruler|Rulers|Minimap|Suggest|Suggestions|Completion|Completions|Find|Replace|Inline|Font|Size|Weight|Family|Line|Lines|Height|Spacing|Color|Colors|Theme|Themes|View|Views|Whitespace|Wrap|Wrapping|Indent|Indentation|Tab|Tabs|Detect|Detection|Control|Controls|Action|Actions|Widget|Toolbar|Status|Bar|Menu|Menus|Quick|Open|Close|Save|File|Files|Explorer|Search|Debug|Source|Code|Output|Problem|Problems|Symbol|Symbols|Definition|Definitions|Reference|References|Locales|Locale|Character|Characters|Include|Strings|String|Comment|Comments|Basic|Paste|Copy|Occurrences|Occurrence|Lightbulb|Smart|Semantic|Delay|Timeout|Threshold|Limit|Count|Interval|Rate|Speed|Duration|Vertical|Horizontal|Top|Bottom|Left|Right|Center|Active|Inactive|Focus|Blur|Click|Double|Middle|Drag|Drop|Select|Multi|Single|Column|Columns|Row|Rows|Order|Sort|Behavior|History|Log|Logging|Level|Filter|Match|Matchers|Case|Sensitive|Whole|Word|Words|Validation|Strict|Warn|Warning|Warnings|Error|Errors|Info|Information|Path|Paths|Folder|Folders|Workspace|Workspaces|Window|Windows|Editor|Editors|Diff|Notebook|Notebooks|Panel|Panels|Sidebar|Titlebar|Statusbar|Breadcrumbs|Breadcrumb|Zen|Screencast|Accessibility|Telemetry|Update|Updates|Extension|Extensions|Security|Trust|Tasks|Task|Testing|Keybindings|Keybinding|Keyboard|Mouse|Touch|Gestures|Audio|Sound|Speech|Voice|Chat|Session|Sessions|Tools|Tool|Agent|Agents|Moves|Move|Region|Regions|Unchanged|Experimental|Preview|Sticky|Folding|Fold|Unfold|Snippets|Snippet|QuickFix|CodeLens|Inlay|Hints|Hint|Parameter|Parameters|Signature|Link|Links|Decorations|Decoration|Render|Whitespace|Boundary|Glyph|Margin|Overview|Caret|Animation|Smooth|Blinking|Style|Width|Surrounding|Modifier|MultiCursor|Paste|Clipboard|Trim|Trailing|Auto|Final|Newline|Encoding|Guess|Assoc|Exclude|Include|Readonly|Permissions|Watcher|Symlinks|Trash|Confirm|Delete|Restore|HotExit|ZenMode|ScreencastMode)\b/i;

const acceptableInTurkish = new Set([
  'terminal', 'panel', 'test', 'windows', 'auto', 'git', 'json', 'html', 'css', 'regex', 'ascii', 'unicode', 'markdown', 'kod', 'dizi', 'satır', 'dosya', 'sözcük'
]);

const englishInTrValues = [];
for (const [k, v] of Object.entries(currentTr)) {
  const words = v.split(/[\s:›\-_\/\\(),.]+/).filter(Boolean);
  const badWords = words.filter(w => englishInValuesRegex.test(w) && !acceptableInTurkish.has(w.toLowerCase()));
  if (badWords.length > 0) {
    englishInTrValues.push({ key: k, value: v, badWords });
  }
}

const englishInCatValues = [];
for (const [k, v] of Object.entries(currentCat)) {
  const words = v.split(/[\s:›\-_\/\\(),.]+/).filter(Boolean);
  const badWords = words.filter(w => englishInValuesRegex.test(w) && !acceptableInTurkish.has(w.toLowerCase()));
  if (badWords.length > 0) {
    englishInCatValues.push({ key: k, value: v, badWords });
  }
}

console.log(`Broken verb-first in _tr: ${brokenVerbFirst.length}`);
console.log(`English words remaining inside _tr values: ${englishInTrValues.length}`);
console.log(`English words remaining inside _cat values: ${englishInCatValues.length}`);

fs.writeFileSync(path.join(__dirname, 'deep_audit_report.json'), JSON.stringify({
  missingFromTr,
  brokenVerbFirst,
  englishInTrValues,
  englishInCatValues
}, null, 2), 'utf8');
console.log('✓ deep_audit_report.json saved successfully!');
