const fs = require('fs');
const path = require('path');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// 1. NLS Mesajları
const newNlsRules = [
  { index: 3141, replace: "&&Geri Bildirimde Bulun" },
  { index: 3154, replace: "Geri Bildirimde Bulun" },
  { index: 3155, replace: "Tanılama Bilgilerini İndir" },
  { index: 3156, replace: "Tanılama Bilgilerini İndir" },
  { index: 3406, replace: "İkincil Etkinlik Çubuğu Pozisyonu" },
  { index: 3407, replace: "&&Varsayılan" },
  { index: 3408, replace: "Varsayılan" },
  { index: 3409, replace: "&&Üst" },
  { index: 3410, replace: "Üst" },
  { index: 3411, replace: "&&Alt" },
  { index: 3412, replace: "Alt" },
  { index: 3413, replace: "&&Gizli" },
  { index: 3414, replace: "Gizli" },
  { index: 3415, replace: "İkincil Etkinlik Çubuğu Pozisyonu" },
  { index: 3416, replace: "İkincil Etkinlik Çubuğu Pozisyonu" },
  { index: 3417, replace: "İkincil Etkinlik Çubuğu Pozisyonu" },
  { index: 3418, replace: "İkincil Etkinlik Çubuğunu Yan Tarafa Taşı" },
  { index: 3419, replace: "İkincil Etkinlik Çubuğunu En Üste Taşı" },
  { index: 3420, replace: "İkincil Etkinlik Çubuğunu Alta Taşı" },
  { index: 3421, replace: "İkincil Etkinlik Çubuğunu Gizle" }
];

const existingNls = trData.rules.nlsMessages || [];
for (const rule of newNlsRules) {
  const idx = existingNls.findIndex(r => r.index === rule.index);
  if (idx !== -1) {
    existingNls[idx] = rule;
  } else {
    existingNls.push(rule);
  }
}
trData.rules.nlsMessages = existingNls;

// 2. Workbench Bundle Kuralları
const newWorkbenchRules = [
  {
    search: 're(3154,"Provide Feedback")',
    replace: 're(3154,"Geri Bildirimde Bulun")'
  },
  {
    search: 're(3155,"Download Diagnostics")',
    replace: 're(3155,"Tanılama Bilgilerini İndir")'
  },
  {
    search: 're(3156,"Download Diagnostics")',
    replace: 're(3156,"Tanılama Bilgilerini İndir")'
  },
  {
    search: 're(3418,"Move Secondary Activity Bar to Side")',
    replace: 're(3418,"İkincil Etkinlik Çubuğunu Yan Tarafa Taşı")'
  },
  {
    search: 're(3419,"Move Secondary Activity Bar to Top")',
    replace: 're(3419,"İkincil Etkinlik Çubuğunu En Üste Taşı")'
  },
  {
    search: 're(3420,"Move Secondary Activity Bar to Bottom")',
    replace: 're(3420,"İkincil Etkinlik Çubuğunu Alta Taşı")'
  },
  {
    search: 're(3421,"Hide Secondary Activity Bar")',
    replace: 're(3421,"İkincil Etkinlik Çubuğunu Gizle")'
  },
  {
    search: 'pVn={"bug-report":"Bug Report","feature-request":"Feature Request","auth-and-billing":"Auth and Billing","general-feedback":"General Feedback"}',
    replace: 'pVn={"bug-report":"Hata Bildirimi","feature-request":"Özellik İsteği","auth-and-billing":"Kimlik Doğrulama ve Faturalandırma","general-feedback":"Genel Geri Bildirim"}'
  },
  {
    search: 'title:"Provide Feedback"',
    replace: 'title:"Geri Bildirimde Bulun"'
  },
  {
    search: 'children:"Feedback Type"',
    replace: 'children:"Geri Bildirim Türü"'
  },
  {
    search: 'children:"Steps to Reproduce"',
    replace: 'children:"Yeniden Oluşturma Adımları"'
  },
  {
    search: 'placeholder:"Please list the steps to reproduce the issue"',
    replace: 'placeholder:"Lütfen sorunu yeniden oluşturma adımlarını listeleyin"'
  }
];

const existingWb = trData.rules.workbench || [];
for (const rule of newWorkbenchRules) {
  const idx = existingWb.findIndex(r => r.search === rule.search);
  if (idx !== -1) {
    existingWb[idx] = rule;
  } else {
    existingWb.push(rule);
  }
}
trData.rules.workbench = existingWb;

fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log(`Successfully added ${newNlsRules.length} NLS rules and ${newWorkbenchRules.length} workbench rules!`);
console.log(`Total NLS rules: ${existingNls.length}, Total Workbench rules: ${existingWb.length}`);
