const fs = require('fs');
const path = require('path');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

// Load gDe
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

const audit = require('./real_settings_audit.json');

const commonEnglishWords = new Set([
  'Show', 'Hide', 'Enable', 'Disable', 'Enabled', 'Disabled', 'Auto',
  'Allow', 'Ignore', 'Default', 'Inherit', 'Custom', 'Mode', 'Type',
  'Format', 'Options', 'Setting', 'Settings', 'Highlight', 'Selection',
  'Hover', 'Cursor', 'Scroll', 'Bracket', 'Guide', 'Ruler', 'Minimap',
  'Suggest', 'Completion', 'Find', 'Replace', 'Inline', 'Font', 'Size',
  'Weight', 'Family', 'Line', 'Height', 'Spacing', 'Color', 'Colors',
  'Theme', 'View', 'Whitespace', 'Wrapping', 'Indent', 'Tab', 'Detect',
  'Control', 'Action', 'Widget', 'Toolbar', 'Status', 'Bar', 'Menu',
  'Quick', 'Open', 'Close', 'Save', 'Files', 'Explorer', 'Search',
  'Debug', 'Terminal', 'Git', 'Source', 'Code', 'Output', 'Problem',
  'Problems', 'Symbols', 'Definitions', 'References', 'Allowed',
  'Locales', 'Characters', 'Include', 'Strings', 'Comments', 'Basic',
  'Paste', 'Copy', 'Occurrences', 'Lightbulb', 'Smart', 'Semantic',
  'Tokens', 'Customizations', 'Delay', 'Timeout', 'Threshold', 'Limit',
  'Max', 'Min', 'Count', 'Interval', 'Rate', 'Speed', 'Duration',
  'Vertical', 'Horizontal', 'Top', 'Bottom', 'Left', 'Right', 'Center',
  'Active', 'Inactive', 'Focus', 'Blur', 'Click', 'Double', 'Middle',
  'Drag', 'Drop', 'Select', 'Multi', 'Single', 'Column', 'Row', 'Order',
  'Sort', 'SortOrder', 'Behavior', 'History', 'Log', 'Logging', 'Level',
  'Filter', 'Match', 'Case', 'Sensitive', 'Whole', 'Word', 'Regex',
  'Validation', 'ValidationRules', 'Strict', 'Relaxed', 'Loose',
  'Warn', 'Warning', 'Warnings', 'Error', 'Errors', 'Info', 'Information',
  'Path', 'Paths', 'Folder', 'Folders', 'File', 'Workspace', 'Window',
  'Editor', 'Diff', 'Notebook', 'Output', 'Panel', 'Sidebar', 'Titlebar',
  'Statusbar', 'Breadcrumbs', 'Zen', 'Screencast', 'Accessibility',
  'Telemetry', 'Update', 'Extensions', 'Extension', 'Security', 'Trust',
  'WorkspaceTrust', 'Terminal', 'Debug', 'Tasks', 'Task', 'Testing',
  'Test', 'Tests', 'Keybindings', 'Keybinding', 'Keyboard', 'Mouse',
  'Touch', 'Gestures', 'Audio', 'Sound', 'Speech', 'Voice', 'Chat',
  'InlineChat', 'Interactive', 'Session', 'Tools', 'Agent', 'Agents'
]);

const whitelist = new Set([
  'Git', 'JSON', 'CSS', 'HTML', 'SCSS', 'LESS', 'JS', 'TS', 'PHP',
  'Linux', 'macOS', 'Windows', 'OS X', 'URL', 'URI', 'ASCII', 'Unicode',
  'RGB', 'RGBA', 'HEX', 'ID', 'API', 'SDK', 'CLI', 'V8', 'Electron',
  'Claude', 'Antigravity', 'PowerShell', 'Bash', 'Zsh', 'WSL', 'AI',
  'Markdown', 'TextMate', 'Emmet', 'Node', 'NPM', 'SSL', 'TLS', 'SSH',
  'HTTP', 'HTTPS', 'FTP', 'FTPS', 'TCP', 'UDP', 'IP', 'IPv4', 'IPv6',
  'WOFF', 'WOFF2', 'TrueType', 'OpenType', 'SVG', 'PNG', 'JPEG', 'GIF',
  'WebP', 'AVIF', 'PDF', 'XML', 'YAML', 'YML', 'TOML', 'INI', 'ENV',
  'Terminal'
]);

const remaining = [];
for (const s of audit.settings) {
  const parts = s.key.split('.');
  const parentId = parts[0];
  const res = gDe(s.key, parentId);
  
  const labelWords = res.label.split(/[\s:›\-_\/\\]+/).filter(Boolean);
  const catWords = res.category ? res.category.split(/[\s:›\-_\/\\]+/).filter(Boolean) : [];
  
  const untranslatedLabel = labelWords.filter(w => commonEnglishWords.has(w) && !whitelist.has(w));
  const untranslatedCat = catWords.filter(w => commonEnglishWords.has(w) && !whitelist.has(w));
  
  if (untranslatedLabel.length > 0 || untranslatedCat.length > 0) {
    remaining.push({
      key: s.key,
      category: res.category,
      label: res.label,
      untranslatedLabel,
      untranslatedCat
    });
  }
}

console.log(`Remaining flagged settings: ${remaining.length} / ${audit.settings.length}`);
if (remaining.length > 0) {
  console.log('Sample remaining:');
  remaining.slice(0, 10).forEach(r => console.log(r.key, '=>', '[' + r.category + ']', r.label));
}
