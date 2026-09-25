const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

// 1. Extract gDe and NLa from wb
const gDeIdx = content.indexOf('function gDe(');
const gDeEnd = content.indexOf('function ', gDeIdx + 20);

const jihIdx = content.indexOf('function jIh(');
const jihEnd = content.indexOf('function ', jihIdx + 20);

const jihCode = content.substring(jihIdx, jihEnd);
const gDeCode = content.substring(gDeIdx, gDeEnd);

const fullCode = `
const FLa = new Set(["html","scss","less","json","js","ts","ie","id","php","scm"]);
const Lee = new Map();
Lee.set("power shell","PowerShell");
function NLa(t){
  t=t.replace(/\\.([a-z0-9])/g,(e,i)=>' \\u203A '+i.toUpperCase())
     .replace(/([a-z0-9])([A-Z])/g,"$1 $2")
     .replace(/([A-Z]{1,})([A-Z][a-z])/g,"$1 $2")
     .replace(/^[a-z]/g,e=>e.toUpperCase())
     .replace(/\\b\\w+\\b/g,e=>FLa.has(e.toLowerCase())?e.toUpperCase():e);
  for(const[e,i]of Lee)t=t.replace(new RegExp('\\\\b'+e+'\\\\b',"gi"),i);
  return t;
}
${jihCode}
function oln(t) { return t; }
${gDeCode}
return { gDe, NLa, jIh };
`;

const fn = new Function(fullCode);
const { gDe } = fn();

// 2. Extract _eTr
const eTrIdx = content.indexOf('const _eTr=');
const eTrEnd = content.indexOf('},d=wBa', eTrIdx) + 1;
const eTrStr = content.substring(eTrIdx + 'const _eTr='.length, eTrEnd);
const eTr = JSON.parse(eTrStr);

// 3. Scan for all configuration properties registered:
// e.g. "editor.something", "workbench.something", "files.something", "terminal.something", etc.
const propRegex = /"(editor\.[a-zA-Z0-9\._]+|workbench\.[a-zA-Z0-9\._]+|files\.[a-zA-Z0-9\._]+|window\.[a-zA-Z0-9\._]+|terminal\.[a-zA-Z0-9\._]+|search\.[a-zA-Z0-9\._]+|security\.[a-zA-Z0-9\._]+|explorer\.[a-zA-Z0-9\._]+|debug\.[a-zA-Z0-9\._]+|scm\.[a-zA-Z0-9\._]+|diffEditor\.[a-zA-Z0-9\._]+|inlineChat\.[a-zA-Z0-9\._]+|chat\.[a-zA-Z0-9\._]+|notebook\.[a-zA-Z0-9\._]+|zenMode\.[a-zA-Z0-9\._]+|breadcrumbs\.[a-zA-Z0-9\._]+|screencastMode\.[a-zA-Z0-9\._]+)"\s*:\s*\{/g;

const foundKeys = new Set();
let match;
while ((match = propRegex.exec(content)) !== null) {
  foundKeys.add(match[1]);
}

console.log(`Found ${foundKeys.size} configuration keys via property regex.`);

// Also extract all editor options: e.g. 170+ options from EditorOptions
const editorOptionRegex = /t\[t\.([a-zA-Z0-9]+)=\d+\]="([a-zA-Z0-9]+)"/g;
const editorOptions = new Set();
while ((match = editorOptionRegex.exec(content)) !== null) {
  editorOptions.add('editor.' + match[2]);
}
console.log(`Found ${editorOptions.size} editor options.`);
for (const k of editorOptions) {
  foundKeys.add(k);
}

// 4. Test gDe for each key
// Check if result looks English or not translated
const englishWords = new Set([
  'Enabled', 'Disabled', 'Auto', 'None', 'Default', 'Inherit', 'Custom',
  'Mode', 'Type', 'Format', 'Options', 'Setting', 'Settings', 'Highlight',
  'Selection', 'Hover', 'Cursor', 'Scroll', 'Bracket', 'Guide', 'Ruler',
  'Minimap', 'Suggest', 'Completion', 'Find', 'Replace', 'Inline',
  'Font', 'Size', 'Weight', 'Family', 'Line', 'Height', 'Spacing',
  'Color', 'Colors', 'Theme', 'View', 'Show', 'Hide', 'Render',
  'Whitespace', 'Wrapping', 'Indent', 'Tab', 'Detect', 'Control',
  'Action', 'Widget', 'Toolbar', 'Status', 'Bar', 'Menu', 'Quick',
  'Open', 'Close', 'Save', 'Files', 'Explorer', 'Search', 'Debug',
  'Terminal', 'Git', 'Source', 'Code', 'Output', 'Problem', 'Problems',
  'Symbols', 'Definitions', 'References', 'Implementations', 'Declarations',
  'Allowed', 'Locales', 'Characters', 'Include', 'Strings', 'Comments',
  'Basic', 'Paste', 'Copy', 'Occurrences', 'Lightbulb', 'Smart', 'Semantic',
  'Tokens', 'Customizations', 'Delay', 'Timeout', 'Threshold', 'Limit',
  'Max', 'Min', 'Count', 'Interval', 'Rate', 'Speed', 'Duration',
  'Vertical', 'Horizontal', 'Top', 'Bottom', 'Left', 'Right', 'Center',
  'Active', 'Inactive', 'Focus', 'Blur', 'Click', 'Double', 'Middle',
  'Drag', 'Drop', 'Select', 'Multi', 'Single', 'Column', 'Row'
]);

const untranslatedSettings = [];

for (const key of Array.from(foundKeys).sort()) {
  const parts = key.split('.');
  const parentId = parts[0];
  const res = gDe(key, parentId);
  
  // Check category and label
  const labelWords = res.label.split(/\s+/);
  const catWords = res.category ? res.category.split(/\s+/) : [];
  
  let labelEnglishCount = 0;
  for (const w of labelWords) {
    if (englishWords.has(w)) labelEnglishCount++;
  }
  
  let catEnglishCount = 0;
  for (const w of catWords) {
    if (englishWords.has(w)) catEnglishCount++;
  }
  
  if (labelEnglishCount > 0 || catEnglishCount > 0) {
    untranslatedSettings.push({
      key,
      category: res.category,
      label: res.label,
      labelEnglishCount,
      catEnglishCount
    });
  }
}

console.log(`\nPotential untranslated settings count: ${untranslatedSettings.length}`);
fs.writeFileSync('scripts/audit_untranslated_settings.json', JSON.stringify(untranslatedSettings, null, 2), 'utf8');

// Print first 50
console.log('Sample of 30 untranslated:');
console.log(untranslatedSettings.slice(0, 30).map(s => `${s.key} => [${s.category}] : ${s.label}`).join('\n'));
