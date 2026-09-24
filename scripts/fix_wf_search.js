const fs = require('fs');

const dictPath = 'C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const r = dict.rules.workbench.find(x => x.search && x.search.includes('Enter workflow name'));

r.search = 'prompt:"Enter workflow name",placeHolder:"e.g. debug-memory-leak",validateInput:async n=>Axa(n)?null:"Invalid workflow name. Only lowercase letters, numbers, and hyphens are allowed."';
r.replace = 'prompt:"İş akışı adını girin",placeHolder:"örn. bellek-sızıntısı-ayıklama",validateInput:async n=>Axa(n)?null:"Geçersiz iş akışı adı. Yalnızca küçük harfler, sayılar ve kısa çizgiler kullanılabilir."';

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('tr.json içindeki kural düzeltildi.');
