const fs = require('fs');
const path = require('path');

const trPath = path.join(__dirname, '..', 'locales', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

const newWorkbenchRules = [
  {
    search: 'F=bra(d,"Agent")',
    replace: 'F=bra(d,"Ajan")'
  },
  {
    search: 'T=bra(u,"Parent")',
    replace: 'T=bra(u,"Üst")'
  },
  {
    search: 'children:"Past Conversations"',
    replace: 'children:"Geçmiş Sohbetler"'
  },
  {
    search: 'children:"Additional Options"',
    replace: 'children:"Ek Seçenekler"'
  },
  {
    search: 'children:"Close Agent View"',
    replace: 'children:"Ajan Görünümünü Kapat"'
  },
  {
    search: '{label:"Customization",onClick:()=>{n(Ts.CASCADE_CLICK_EVENT,go({extra:{type:"header-customizations"}}',
    replace: '{label:"Özelleştirmeler",onClick:()=>{n(Ts.CASCADE_CLICK_EVENT,go({extra:{type:"header-customizations"}}'
  },
  {
    search: 'd?{label:"Export",onClick:V}:null',
    replace: 'd?{label:"Dışa Aktar",onClick:V}:null'
  },
  {
    search: 'l?{label:"Toggle Dev View",onClick:()=>{y(H7u(!k))}}:null',
    replace: 'l?{label:"Geliştirici Görünümünü Aç/Kapat",onClick:()=>{y(H7u(!k))}}:null'
  },
  {
    search: '"Back to Agent"',
    replace: '"Ajana Geri Dön"'
  },
  {
    search: 'children:"Back to parent agent"',
    replace: 'children:"Üst ajana geri dön"'
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
console.log(`Successfully added ${newWorkbenchRules.length} Agent header rules to tr.json!`);
