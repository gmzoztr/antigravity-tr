const fs = require('fs');
const path = require('path');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

const newWorkbenchRules = [
  {
    "search": "t.CASCADE=\"Agent\"",
    "replace": "t.CASCADE=\"Ajan\""
  },
  {
    "search": "label:\"Auto Execution\"",
    "replace": "label:\"Otomatik Çalıştırma\""
  },
  {
    "search": "label:\"Review Policy\"",
    "replace": "label:\"İnceleme İlkesi\""
  },
  {
    "search": "{label:\"Agent Decides\",value:c3.AUTO",
    "replace": "{label:\"Ajan Karar Versin\",value:c3.AUTO"
  },
  {
    "search": "label:\"Suggestions in Editor\"",
    "replace": "label:\"Düzenleyicide Öneriler\""
  },
  {
    "search": "label:\"Tab Gitignore Access\"",
    "replace": "label:\"Tab Gitignore Erişimi\""
  },
  {
    "search": "label:\"Tab Speed\"",
    "replace": "label:\"Tab Hızı\""
  },
  {
    "search": "{label:\"Slow\",value:nIe.SLOW},{label:\"Fast\"",
    "replace": "{label:\"Yavaş\",value:nIe.SLOW},{label:\"Hızlı\""
  },
  {
    "search": "label:\"Tab to Import\"",
    "replace": "label:\"İçe Aktarmalar İçin Tab\""
  },
  {
    "search": "label:\"Tab to Jump\"",
    "replace": "label:\"Atlama İçin Tab\""
  },
  {
    "search": "label:\"Open Command\"",
    "replace": "label:\"Komutu Aç\""
  },
  {
    "search": "label:\"Open Agent\"",
    "replace": "label:\"Ajanı Aç\""
  },
  {
    "search": "label:\"AI Shortcuts\"",
    "replace": "label:\"Yapay Zeka Kısayolları\""
  },
  {
    "search": "n.textContent=\"Customizations\"",
    "replace": "n.textContent=\"Özelleştirmeler\""
  },
  {
    "search": "r.textContent=\"Manage\"",
    "replace": "r.textContent=\"Yönet\""
  },
  {
    "search": "n.textContent=\"Snooze\"",
    "replace": "n.textContent=\"Ertele\""
  },
  {
    "search": "r.textContent=o?\"Cancel\":\"Start\"",
    "replace": "r.textContent=o?\"İptal\":\"Başlat\""
  },
  {
    "search": "n.textContent=\"Advanced Settings\"",
    "replace": "n.textContent=\"Gelişmiş Ayarlar\""
  },
  {
    "search": "r.textContent=`View all ${this.productService.nameShort} shortcuts`",
    "replace": "r.textContent=`Tüm ${this.productService.nameShort} kısayollarını görüntüle`"
  },
  {
    "search": "name:p(4027,null)",
    "replace": "name:\"Profil\""
  },
  {
    "search": "title:p(3308,null),icon:fe.search",
    "replace": "title:\"Hızlı Aç\",icon:fe.search"
  },
  {
    "search": "title:p(4199,null),icon:fe.search",
    "replace": "title:\"Hızlı Aç\",icon:fe.search"
  },
  {
    "search": "createTextNode(`By default, ${this.productService.nameLong} uses `)",
    "replace": "createTextNode(`Varsayılan olarak ${this.productService.nameLong}, pazar yeri olarak `)"
  },
  {
    "search": "createTextNode(\" as a marketplace. This can be changed in \")",
    "replace": "createTextNode(\" kullanır. Bu ayar, \")"
  },
  {
    "search": "`${this.productService.nameShort} settings`)",
    "replace": "`${this.productService.nameShort} ayarlarından`)"
  }
];

const existing = trData.rules.workbench || [];
for (const rule of newWorkbenchRules) {
  const idx = existing.findIndex(r => r.search === rule.search);
  if (idx !== -1) {
    existing[idx] = rule;
  } else {
    existing.push(rule);
  }
}
trData.rules.workbench = existing;

fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log(`Successfully added ${newWorkbenchRules.length} popup, titlebar & marketplace rules to tr.json!`);
