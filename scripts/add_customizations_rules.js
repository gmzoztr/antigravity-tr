const fs = require('fs');
const vm = require('vm');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log('--- 1. NLS Mesajları Ekleniyor ---');
const nlsAdditions = [
  { index: 4206, replace: "Görünüm verisi sağlayabilecek kayıtlı bir veri sağlayıcı yok." },
  { index: 7897, replace: "Çalıştırma ve Hata Ayıklamayı özelleştirmek için [bir launch.json dosyası oluşturun]({0})." },
  { index: 7898, replace: "Çalıştırma ve Hata Ayıklamayı özelleştirmek için [bir klasör açın]({0}) ve bir launch.json dosyası oluşturun." },
  { index: 12967, replace: "Terminali Sohbete Gönder" }
];

for (const item of nlsAdditions) {
  const existing = dict.rules.nlsMessages.find(m => m.index === item.index);
  if (existing) {
    existing.replace = item.replace;
  } else {
    dict.rules.nlsMessages.push(item);
  }
}
dict.rules.nlsMessages.sort((a, b) => a.index - b.index);

console.log('--- 2. Workbench Kuralları Ekleniyor ---');
const workbenchAdditions = [
  {
    search: '"Customize Agent to get a better, more personalized experience."',
    replace: '"Daha iyi ve kişiselleştirilmiş bir deneyim için Ajanı özelleştirin."'
  },
  {
    search: '{id:"workflows",label:"Workflows",enabled:!0}',
    replace: '{id:"workflows",label:"İş Akışları",enabled:!0}'
  },
  {
    search: '"Rules help guide the behavior of Agent."',
    replace: '"Kurallar, Ajanın davranışını yönlendirmeye yardımcı olur."'
  },
  {
    search: 'children:"Refresh rules"',
    replace: 'children:"Kuralları Yenile"'
  },
  {
    search: 'icon:E($e,{name:"add",size:12}),onClick:()=>void o(!0),children:"Global"}',
    replace: 'icon:E($e,{name:"add",size:12}),onClick:()=>void o(!0),children:"Genel"}'
  },
  {
    search: '"div",{className:"mr-1 font-medium",children:"Workflows"}',
    replace: '"div",{className:"mr-1 font-medium",children:"İş Akışları"}'
  },
  {
    search: 'children:"Refresh workflows"',
    replace: 'children:"İş Akışlarını Yenile"'
  },
  {
    search: '\'Workflows are saved prompts that Agent can follow. To trigger a workflow, type "/" in Agent.\'',
    replace: '\'İş akışları, Ajanın izleyebileceği kayıtlı yönlendirmelerdir. Bir iş akışını tetiklemek için Ajanda "/" yazın.\''
  },
  {
    search: 'title:"Send Terminal to Chat"',
    replace: 'title:"Terminali Sohbete Gönder"'
  }
];

for (const r of workbenchAdditions) {
  const existing = dict.rules.workbench.find(x => x.search === r.search);
  if (existing) {
    existing.replace = r.replace;
  } else {
    dict.rules.workbench.push(r);
  }
}

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('locales/tr.json başarıyla güncellendi.');

// V8 derleme testi
const bak = fs.readFileSync('C:\\Users\\Work-D\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');
let testCode = bak;
for (const rule of dict.rules.workbench) {
  testCode = testCode.replaceAll(rule.search, rule.replace);
}

try {
  new vm.SourceTextModule(testCode);
  console.log('TEST BAŞARILI: VM SourceTextModule SÖZDİZİMİ TAMAMEN GEÇERLİ! [✓][✓][✓]');
} catch (e) {
  console.error('TEST BAŞARISIZ:', e);
  process.exit(1);
}
