const fs = require('fs');
const path = require('path');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

const newWorkbenchRules = [
  // 1. S2 enum for dropdown On / Off labels
  {
    "search": "var S2;(function(t){t.ON=\"On\",t.OFF=\"Off\"})(S2||(S2={}));",
    "replace": "var S2;(function(t){t.ON=\"Açık\",t.OFF=\"Kapalı\"})(S2||(S2={}));"
  },
  // 2. Snooze tooltip
  {
    "search": "let o=`Snooze ${this._productService.nameLong} Tab for 10 minutes`;",
    "replace": "let o=`${this._productService.nameLong} Tab tamamlamayı 10 dakika ertele`;"
  },
  {
    "search": "o=`Snoozed for ${u} more minute${u!==1?\"s\":\"\"}`",
    "replace": "o=`${u} dakika daha ertelendi`"
  },
  // 3. Customizations hover tooltip
  {
    "search": "content:\"View and manage Agent memories, workflows, and rules\"",
    "replace": "content:\"Ajan hafızasını, iş akışlarını ve kurallarını görüntüleyin ve yönetin\""
  },
  // 4. Tab Speed description (info icon tooltip)
  {
    "search": "description:[\"Set the speed of tab suggestions\"]",
    "replace": "description:[\"Tab önerilerinin hızını belirleyin\"]"
  },
  // 5. Suggestions in editor description
  {
    "search": "description:[\"Show AI autocomplete suggestions in the editor\"]",
    "replace": "description:[\"Düzenleyicide yapay zeka otomatik tamamlama önerilerini göster\"]"
  },
  // 6. Tab Gitignore Access description
  {
    "search": "description:[\"Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.\"]",
    "replace": "description:[\"Tab'ın .gitignore içindeki dosyaları görüntülemesine ve düzenlemesine izin verin. .gitignore dosyanız kimlik bilgileri, gizli anahtarlar veya hassas bilgiler içeren dosyaları listeliyorsa dikkatli kullanın.\"]"
  },
  // 7. Tab to Jump description
  {
    "search": "description:[\"Predict the location of your next edit and navigates you there with a tab keypress\"]",
    "replace": "description:[\"Bir sonraki düzenleme konumunuzu tahmin eder ve Tab tuşuyla sizi oraya yönlendirir\"]"
  },
  // 8. Tab to import description
  {
    "search": "description:[\"Quickly add and update imports with a tab keypress.\"]",
    "replace": "description:[\"Tab tuşuna basarak içe aktarmaları hızlıca ekleyin ve güncelleyin.\"]"
  },
  // 9. Auto execution descriptions
  {
    "search": "description:[\"Always Proceed - Agent never asks for confirmation before executing terminal commands (except those in the Deny List)\",\"Request Review - Agent always asks for confirmation before executing terminal commands (except those in the Allow List)\"]",
    "replace": "description:[\"Her Zaman Devam Et - Ajan, terminal komutlarını çalıştırmadan önce asla onay istemez (Engellenenler Listesindekiler hariç)\",\"İnceleme İste - Ajan, terminal komutlarını çalıştırmadan önce her zaman onay ister (İzin Verilenler Listesindekiler hariç)\"]"
  },
  // 10. Review policy descriptions
  {
    "search": "description:[\"Always Proceed - Trust the agent to do tasks end-to-end\",\"Agent Decides - Assist the agent to complete tasks\",\"Request Review - Collaborate with the agent to complete tasks\"]",
    "replace": "description:[\"Her Zaman Devam Et - Görevleri uçtan uca tamamlaması için ajana güvenin\",\"Ajan Karar Versin - Görevleri tamamlaması için ajana yardımcı olun\",\"İnceleme İste - Görevleri tamamlamak için ajanla iş birliği yapın\"]"
  },
  // 11. Auto fix lint errors description
  {
    "search": "description:[\"When enabled, Agent is given awareness of lint errors created by its edits and may fix them without explicit user prompting. Note that this may increase Agent's tool usage.\"]",
    "replace": "description:[\"Etkinleştirildiğinde, Ajan yaptığı düzenlemelerden kaynaklanan lint hatalarının farkında olur ve kullanıcı uyarısı olmadan bunları düzeltebilir. Bunun Ajanın araç kullanımını artırabileceğini unutmayın.\"]"
  },
  // 12. Open files on edit description
  {
    "search": "description:[\"Open files in the background if the agent creates or edits them\"]",
    "replace": "description:[\"Ajan dosyaları oluşturduğunda veya düzenlediğinde arka planda aç\"]"
  },
  // 13. Open command and open agent descriptions
  {
    "search": "description:[\"Open Command\"]",
    "replace": "description:[\"Komutu Aç\"]"
  },
  {
    "search": "description:[\"Open Agent\"]",
    "replace": "description:[\"Ajanı Aç\"]"
  },
  // 14. Option descriptions for Jump, Auto Execute & Review Policy
  {
    "search": "description:\"Enable navigation suggestions that predict your next edit\"",
    "replace": "description:\"Bir sonraki düzenlemenizi tahmin eden gezinti önerilerini etkinleştirin\""
  },
  {
    "search": "description:\"Always auto-execute commands unless they are in your deny list. This also allows Agent to auto-execute Browser controls.\"",
    "replace": "description:\"Engellenenler listenizde olmadığı sürece komutları her zaman otomatik çalıştırın. Bu aynı zamanda Ajanın Tarayıcı kontrollerini de otomatik yürütmesine olanak tanır.\""
  },
  {
    "search": "description:\"Never auto-execute commands unless they are in your allow list.\"",
    "replace": "description:\"İzin verilenler listenizde olmadığı sürece komutları asla otomatik çalıştırmayın.\""
  },
  {
    "search": "description:\"Trust the agent to do tasks end-to-end\"",
    "replace": "description:\"Görevleri uçtan uca tamamlaması için ajana güvenin\""
  },
  {
    "search": "description:\"Assist the agent to complete tasks\"",
    "replace": "description:\"Görevleri tamamlaması için ajana yardımcı olun\""
  },
  {
    "search": "description:\"Collaborate with the agent to complete tasks\"",
    "replace": "description:\"Görevleri tamamlamak için ajanla iş birliği yapın\""
  },
  // 15. Highlight After Accept & Tab Sounds
  {
    "search": "label:\"Highlight After Accept\"",
    "replace": "label:\"Kabulden Sonra Vurgula\""
  },
  {
    "search": "description:[\"Highlight newly inserted text after accepting a Tab completion.\"]",
    "replace": "description:[\"Bir Tab tamamlamasını kabul ettikten sonra yeni eklenen metni vurgulayın.\"]"
  },
  {
    "search": "label:\"Enable Tab Sounds (Beta)\"",
    "replace": "label:\"Tab Seslerini Etkinleştir (Beta)\""
  },
  {
    "search": "description:[\"Turn this on for some sick beats. The more Tab suggestions you accept in a row, the better.\"]",
    "replace": "description:[\"Harika ritimler için bunu açın. Arka arkaya ne kadar çok Tab önerisi kabul ederseniz o kadar iyi.\"]"
  },
  // 16. Keybindings resetAll and unassigned
  {
    "search": "resetAll:n,viewAll:r}=e;n.textContent=p(5014,null)",
    "replace": "resetAll:n,viewAll:r}=e;n.textContent=\"Tümünü Sıfırla\""
  },
  {
    "search": "r.textContent=p(5015,null),r.classList.add(\"no-keybinding\")",
    "replace": "r.textContent=\"Atanmadı\",r.classList.add(\"no-keybinding\")"
  },
  // 17. Security section title in Settings
  {
    "search": "{title:\"Security\",settings:[vo.SECURE_MODE_ENABLED]}",
    "replace": "{title:\"Güvenlik\",settings:[vo.SECURE_MODE_ENABLED]}"
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
console.log(`Successfully added/updated ${newWorkbenchRules.length} button and tooltip rules in tr.json!`);
console.log(`Total workbench rules now: ${existing.length}`);
