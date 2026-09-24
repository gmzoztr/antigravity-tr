const fs = require('fs');
const vm = require('vm');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log('--- 1. Primary & Secondary Side Bar NLS Kuralları Ekleniyor ---');

const sideBarNls = [
  // Primary Side Bar
  { index: 3176, replace: "Birincil Kenar Çubuğu Pozisyonunu Değiştir" },
  { index: 3179, replace: "Birincil Kenar Çubuğunu Sağa Taşı" },
  { index: 3180, replace: "Birincil Kenar Çubuğunu Sola Taşı" },
  { index: 3187, replace: "&&Birincil Kenar Çubuğunu Sağa Taşı" },
  { index: 3188, replace: "&&Birincil Kenar Çubuğunu Sola Taşı" },
  { index: 3191, replace: "Birincil Kenar Çubuğunu Gizle" },
  { index: 3192, replace: "Birincil Kenar Çubuğunu Gizle" },
  { index: 3193, replace: "Birincil Kenar Çubuğunu Göster" },
  { index: 3194, replace: "Birincil Kenar Çubuğu" },
  { index: 3195, replace: "&&Birincil Kenar Çubuğu" },
  { index: 3197, replace: "Birincil Kenar Çubuğu gizlendi" },
  { index: 3198, replace: "Birincil Kenar Çubuğu gösterildi" },
  { index: 3199, replace: "Birincil Kenar Çubuğunu Gizle" },
  { index: 3200, replace: "Birincil Kenar Çubuğunu Aç/Kapat" },
  { index: 3201, replace: "Birincil Kenar Çubuğunu Aç/Kapat" },
  { index: 3254, replace: "Birincil Kenar Çubuğunu Sağa Taşı" },
  { index: 3255, replace: "Birincil Kenar Çubuğunu Sola Taşı" },
  { index: 3256, replace: "Birincil Kenar Çubuğu Pozisyonunu Değiştir" },
  { index: 3258, replace: "Birincil Kenar Çubuğu Görünürlüğünü Aç/Kapat" },
  { index: 4155, replace: "Birincil Kenar Çubuğunu Kapat" },
  { index: 4156, replace: "Birincil Kenar Çubuğuna Odaklan" },

  // Secondary Side Bar
  { index: 3428, replace: "İkincil Kenar Çubuğunu Gizle" },
  { index: 3429, replace: "İkincil Kenar Çubuğunu Göster" },
  { index: 3430, replace: "İkincil Kenar Çubuğunu Gizle" },
  { index: 3431, replace: "&&İkincil Kenar Çubuğu" },
  { index: 3433, replace: "İkincil Kenar Çubuğu gizlendi" },
  { index: 3434, replace: "İkincil Kenar Çubuğu gösterildi" },
  { index: 3435, replace: "İkincil Kenar Çubuğunu Gizle" },
  { index: 3436, replace: "İkincil Kenar Çubuğunu Aç/Kapat" },
  { index: 3437, replace: "İkincil Kenar Çubuğunu Aç/Kapat" },
  { index: 3440, replace: "İkincil Kenar Çubuğu Görünürlüğünü Aç/Kapat" },
  { index: 3441, replace: "İkincil Kenar Çubuğunu Gizle" },
  { index: 3442, replace: "İkincil Kenar Çubuğuna Odaklan" },
  { index: 3446, replace: "İkincil Kenar Çubuğunu Ekranı Kapla" },
  { index: 3447, replace: "İkincil Kenar Çubuğunu Önceki Boyutuna Döndür" },
  { index: 3452, replace: "İkincil Kenar Çubuğunu Sola Taşı" },
  { index: 3453, replace: "İkincil Kenar Çubuğunu Sağa Taşı" },
  { index: 3454, replace: "İkincil Kenar Çubuğunu Gizle" }
];

for (const item of sideBarNls) {
  const existing = dict.rules.nlsMessages.find(m => m.index === item.index);
  if (existing) {
    existing.replace = item.replace;
  } else {
    dict.rules.nlsMessages.push(item);
  }
}
dict.rules.nlsMessages.sort((a, b) => a.index - b.index);

console.log('--- 2. Enter Workflow Name Workbench Kuralı Ekleniyor ---');

const workflowInputRule = {
  search: 'prompt:"Enter workflow name",placeHolder:"e.g. debug-memory-leak",validateInput:async n=>Axa(n)?null:"Invalid workflow name. Only lowercase letters, numbers, and dashes are allowed"',
  replace: 'prompt:"İş akışı adını girin",placeHolder:"örn. bellek-sızıntısı-ayıklama",validateInput:async n=>Axa(n)?null:"Geçersiz iş akışı adı. Yalnızca küçük harfler, sayılar ve kısa çizgiler kullanılabilir."'
};

const existingWf = dict.rules.workbench.find(x => x.search === workflowInputRule.search);
if (existingWf) {
  existingWf.replace = workflowInputRule.replace;
} else {
  dict.rules.workbench.push(workflowInputRule);
}

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('locales/tr.json güncellendi.');

// V8 Derleme Testi
const bak = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');
let testCode = bak;
for (const rule of dict.rules.workbench) {
  testCode = testCode.replaceAll(rule.search, rule.replace);
}

try {
  new vm.SourceTextModule(testCode);
  console.log('V8 MODÜL DERLEMESİ GEÇERLİ [✓][✓][✓]');
} catch (e) {
  console.error('V8 DERLEME HATASI:', e);
  process.exit(1);
}
