const fs = require('fs');

const tr = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));
const settingsDict = require('C:\\Users\\Work-D\\source\\antigravity-tr\\src\\settings_dictionary.js');

console.log('=== TÜRKÇE YERELLEŞTİRME GENEL DENETİMİ (AUDIT) ===\n');

// 1. NLS Mesajları Denetimi
console.log('--- 1. NLS MESAJLARI (224 adet) ---');
const nlsIssues = [];
for (const m of tr.rules.nlsMessages) {
  const text = m.replace;
  const clean = text.replace(/^&&/, '');
  const first = clean[0];
  // Küçük harfle başlayanlar veya uygunsuz karakterler
  if (first && first === first.toLowerCase() && first !== first.toUpperCase() && !clean.startsWith('settings.json')) {
    nlsIssues.push({ index: m.index, text, issue: 'Küçük harfle başlıyor' });
  }
}
console.log(`Tespit edilen NLS sorun sayısı: ${nlsIssues.length}`);
for (const issue of nlsIssues) {
  console.log(`  [${issue.index}] "${issue.text}" -> ${issue.issue}`);
}

// 2. _eTr Enum Sözlüğü Denetimi
console.log('\n--- 2. DROPDOWN ENUM SEÇENEKLERİ (_eTr) ---');
const wRule = tr.rules.workbench.find(r => r.replace && r.replace.includes('_eTr'));
if (wRule) {
  const start = wRule.replace.indexOf('{');
  const end = wRule.replace.indexOf('},d=');
  const eTr = JSON.parse(wRule.replace.slice(start, end + 1));
  console.log(`Toplam enum sayısı: ${Object.keys(eTr).length}`);
  const enumIssues = [];
  for (const [k, v] of Object.entries(eTr)) {
    // Title case mi? Her kelimenin baş harfi büyük mü?
    const words = v.split(' ');
    const notTitle = words.some(w => {
      // "ve", "ile", "için" gibi bağlaçlar hariç
      if (['ve', 'ile', 'veya', 'için'].includes(w.toLowerCase())) return false;
      const f = w[0];
      return f && f === f.toLowerCase() && f !== f.toUpperCase();
    });
    if (notTitle) {
      enumIssues.push({ key: k, value: v });
    }
  }
  console.log(`Title case olmayan enum sayısı: ${enumIssues.length}`);
  for (const e of enumIssues) {
    console.log(`  "${e.key}": "${e.value}"`);
  }
}

// 3. Settings GUI Metinleri (11161-11375)
console.log('\n--- 3. AYARLAR GUI BUTONLARI VE ETİKETLERİ ---');
const settingsNls = tr.rules.nlsMessages.filter(m => m.index >= 11161 && m.index <= 11375);
console.log(`Toplam Settings GUI NLS sayısı: ${settingsNls.length}`);
for (const s of settingsNls.slice(0, 30)) {
  console.log(`  [${s.index}] ${s.replace}`);
}

// 4. Workbench Diğer Metinleri
console.log('\n--- 4. WORKBENCH DİĞER KURALLARI ---');
console.log(`Toplam workbench kural sayısı: ${tr.rules.workbench.length}`);
for (const r of tr.rules.workbench) {
  if (r.replace && !r.replace.includes('_eTr') && !r.replace.includes('function(')) {
    if (r.replace.length < 80) {
      console.log(`  ${r.replace}`);
    }
  }
}
