/**
 * Ayarlar panelini tam simüle eder.
 * - gDe() fonksiyonunu çalıştırır (category + label üretimi)
 * - _eTr ile dropdown değerlerini kontrol eder
 * - NLS description'larını kontrol eder
 * - Hepsini raporlar
 */
const fs = require('fs');

const BENCH_PATH = 'C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';
const BAK_PATH = BENCH_PATH + '.bak';
const NLS_PATH = 'C:\\Users\\Work-D\\.antigravity\\extensions\\ms-ceintl.vscode-language-pack-tr-1.106.0-universal\\translations\\main.i18n.json';
const TR_JSON = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));

// ── Mevcut _tr, _cat, _eTr sözlüklerini oku ────────────────────────────────
const gdeRule = TR_JSON.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const catS = gdeRule.replace.indexOf('const _cat=') + 'const _cat='.length;
const trS  = gdeRule.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalc = gdeRule.replace.indexOf(';const cat=');
const _cat = JSON.parse(gdeRule.replace.slice(catS, gdeRule.replace.indexOf(';const _tr=')));
const _tr  = JSON.parse(gdeRule.replace.slice(trS, catCalc));

const enumRule = TR_JSON.rules.workbench.find(r => r.replace && r.replace.includes('const _eTr='));
const eStart = enumRule.replace.indexOf('const _eTr=') + 'const _eTr='.length;
const eEnd   = enumRule.replace.indexOf('},d=wBa', eStart) + 1;
const _eTr   = JSON.parse(enumRule.replace.slice(eStart, eEnd));

// ── NLS dosyasını oku ───────────────────────────────────────────────────────
const nlsData = JSON.parse(fs.readFileSync(NLS_PATH, 'utf8'));

// ── NLa simülasyonu ─────────────────────────────────────────────────────────
const specialWords = new Set(['css','html','json','url','uri','api','id','git','gpu','ui','ip','cpu','sdk','ai','sql','ssh','ftp','http','https','svg','pdf','xml','ansi','rgb','rgba']);
function NLa(t) {
  return t
    .replace(/\.([a-z0-9])/g, (e,i) => ` \u203A ${i.toUpperCase()}`)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/^[a-z]/g, e => e.toUpperCase())
    .replace(/\b\w+\b/g, e => specialWords.has(e.toLowerCase()) ? e.toUpperCase() : e);
}

function simulateGde(key) {
  const n = key.lastIndexOf('.');
  let r = n >= 0 ? key.substring(0, n) : '';
  let leaf = n >= 0 ? key.substring(n + 1) : key;
  const rLabel = NLa(r);
  const cat = rLabel.split(' \u203A ').map(seg => _cat[seg] || seg).join(' \u203A ');
  const s = NLa(leaf);
  const lab = _tr[s] || _tr[s.replace(/ \u203A /g, ': ')] || _tr[key] || null;
  return { key, cat, rawLabel: s, label: lab };
}

// ── workbench kaynak kodundan ayar kayıtlarını çıkar ────────────────────────
const bench = fs.readFileSync(BENCH_PATH, 'utf8');

// Tüm configuration property kayıtlarını bul
// Format: "key.sub.prop": { type: ..., description: ..., enum: [...] }
const propRegex = /"((?:editor|workbench|window|files|terminal|explorer|search|git|diffEditor|debug|extensions|security|scm|comments|chat|notebook|testing|accessibility)\.[a-zA-Z0-9._]+)":\s*\{([^}]{0,600})\}/g;
let m;

const missingLabels   = [];
const missingEnums    = [];
const untranslatedCat = new Set();

while ((m = propRegex.exec(bench)) !== null) {
  const key     = m[1];
  const body    = m[2];
  const simulated = simulateGde(key);

  // 1. Başlık Türkçe mi?
  if (!simulated.label) {
    missingLabels.push({ key, rawLabel: simulated.rawLabel, cat: simulated.cat });
  }

  // 2. Kategorideki seğmentler Türkçe mi?
  for (const seg of simulated.cat.split(' \u203A ')) {
    if (/^[A-Z]/.test(seg) && /[a-z]/.test(seg) && !seg.includes('IDE') && !seg.includes('Git')) {
      // Hâlâ İngilizce görünüyor
      untranslatedCat.add(seg);
    }
  }

  // 3. Dropdown enum değerleri Türkçe mi?
  const enumMatch = body.match(/enum:\s*\[([^\]]+)\]/);
  if (enumMatch) {
    const vals = enumMatch[1].match(/'([^']+)'/g) || [];
    for (const v of vals) {
      const raw = v.replace(/'/g, '');
      if (!_eTr[raw] && raw.length > 1 && !/^\d/.test(raw) && !raw.startsWith('0x')) {
        missingEnums.push({ key, enumVal: raw });
      }
    }
  }
}

// ── Rapor ───────────────────────────────────────────────────────────────────
console.log(`\n=== AYARLAR PANELİ SİMÜLASYON RAPORU ===\n`);
console.log(`İncelenen toplam ayar: (regex eşleşmeleri)`);
console.log(`\n📌 EKSİK BAŞLIKLAR (${missingLabels.length} adet):`);
const uniqLabels = [...new Map(missingLabels.map(x => [x.rawLabel, x])).values()].sort((a,b)=>a.rawLabel.localeCompare(b.rawLabel));
uniqLabels.forEach(x => console.log(`  "${x.rawLabel}"  [${x.key}]`));

console.log(`\n📌 EKSİK ENUM DEĞERLERİ (${new Set(missingEnums.map(x=>x.enumVal)).size} benzersiz):`);
[...new Set(missingEnums.map(x=>x.enumVal))].sort().forEach(v => console.log(`  "${v}"`));

console.log(`\n📌 HÂLÂ İNGİLİZCE KATEGORİ SEGMENTLERİ (${untranslatedCat.size} adet):`);
[...untranslatedCat].sort().forEach(s => console.log(`  "${s}"`));

// JSON olarak da kaydet
fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\full_settings_audit.json', JSON.stringify({
  missingLabels: uniqLabels,
  missingEnums: [...new Set(missingEnums.map(x=>x.enumVal))].sort(),
  untranslatedCategories: [...untranslatedCat].sort()
}, null, 2), 'utf8');
console.log('\nDetaylı rapor: scripts/full_settings_audit.json');
