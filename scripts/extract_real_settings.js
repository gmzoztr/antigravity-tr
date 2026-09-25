const fs = require('fs');

const wbPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/out/vs/workbench/workbench.desktop.main.js';
const content = fs.readFileSync(wbPath, 'utf8');

// Match all property definitions in configurations: e.g. "editor.xxx": { ... } or "workbench.xxx": { ... }
const regex = /"([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_$-]+)+)"\s*:\s*\{([^}]+)\}/g;
const realSettings = new Map();

let m;
while ((m = regex.exec(content)) !== null) {
  const key = m[1];
  const body = m[2];
  if (
    body.includes('description') ||
    body.includes('type') ||
    body.includes('default') ||
    body.includes('enum')
  ) {
    // Extract enum values if present
    let enumVals = [];
    const enumMatch = body.match(/enum\s*:\s*\[([^\]]+)\]/);
    if (enumMatch) {
      const raw = enumMatch[1];
      const stringMatches = raw.match(/"([^"]+)"|'([^']+)'/g);
      if (stringMatches) {
        enumVals = stringMatches.map(s => s.replace(/['"]/g, ''));
      }
    }
    realSettings.set(key, { body: body.substring(0, 150), enumVals });
  }
}

console.log(`Extracted ${realSettings.size} real configuration settings!`);

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

// Load _eTr
const eTrIdx = content.indexOf('const _eTr=');
const eTrEnd = content.indexOf('},d=wBa', eTrIdx) + 1;
const eTrStr = content.substring(eTrIdx + 'const _eTr='.length, eTrEnd);
const eTr = JSON.parse(eTrStr);

// Collect all enums and test them
const allEnumVals = new Set();
for (const [k, data] of realSettings.entries()) {
  for (const ev of data.enumVals) {
    allEnumVals.add(ev);
  }
}

const missingEnums = [];
for (const ev of Array.from(allEnumVals).sort()) {
  if (!eTr[ev]) {
    missingEnums.push(ev);
  }
}

console.log(`Total unique string enum values found: ${allEnumVals.size}`);
console.log(`Missing enum translations in _eTr: ${missingEnums.length}`);

// Test settings translations
const results = [];
for (const [key, data] of realSettings.entries()) {
  const parts = key.split('.');
  const parentId = parts[0];
  const { category, label } = gDe(key, parentId);
  results.push({ key, category, label, enumVals: data.enumVals });
}

fs.writeFileSync('scripts/real_settings_audit.json', JSON.stringify({
  totalSettings: realSettings.size,
  totalEnums: allEnumVals.size,
  missingEnums,
  settings: results
}, null, 2), 'utf8');

console.log('Saved audit to scripts/real_settings_audit.json');
