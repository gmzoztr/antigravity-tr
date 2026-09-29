/**
 * Antigravity Desktop Eksiksiz ve Kesin Çözüm Yaması
 * 
 * 1. app.asar'ı çıkartır
 * 2. loadingOverlay.js'i Türkçeleştirir ("Antigravity Yükleniyor...")
 * 3. provisionSplash.js'i Türkçeleştirir ("WSL Yapılandırılıyor...")
 * 4. menu.js'i native Menu.buildFromTemplate ile yeniden inşa eder (HMENU gerçek güncelleme)
 * 5. tray.js'i Türkçeleştirir
 * 6. preload.js içine hatasız, sağlam, tam sözlüklü DOM çevirmenini enjekte eder
 * 7. app.asar'ı paketleyip yerine yazar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const asarPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity/resources/app.asar';
const backupPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity/resources/app.asar.bak';
const extractDir = path.join(__dirname, '..', 'scratch', 'desktop_asar');

console.log('=== KAPSAMLI ANTIGRAVITY DESKTOP YAMASI ===\n');

// 1. Yedek
if (!fs.existsSync(backupPath)) {
  console.log('[1] Yedek alınıyor...');
  fs.copyFileSync(asarPath, backupPath);
} else {
  console.log('[1] Yedek zaten mevcut.');
}

// 2. Çıkar
console.log('[2] app.asar ayıklanıyor...');
if (fs.existsSync(extractDir)) {
  fs.rmSync(extractDir, { recursive: true, force: true });
}
fs.mkdirSync(extractDir, { recursive: true });
execSync(`npx asar extract "${asarPath}" "${extractDir}"`, { stdio: 'ignore' });
console.log('    [✓] Ayıklama tamamlandı.');

// 3. loadingOverlay.js
console.log('[3] loadingOverlay.js yamalanıyor...');
const loadingPath = path.join(extractDir, 'dist', 'loadingOverlay.js');
if (fs.existsSync(loadingPath)) {
  let c = fs.readFileSync(loadingPath, 'utf8');
  c = c.replace('Loading Antigravity', 'Antigravity Yükleniyor...');
  fs.writeFileSync(loadingPath, c, 'utf8');
  console.log('    [✓] "Loading Antigravity" -> "Antigravity Yükleniyor..." yapıldı.');
}

// 4. provisionSplash.js
console.log('[4] provisionSplash.js yamalanıyor...');
const splashPath = path.join(extractDir, 'dist', 'provisionSplash.js');
if (fs.existsSync(splashPath)) {
  let c = fs.readFileSync(splashPath, 'utf8');
  c = c.replace('Setting up WSL:', 'WSL Yapılandırılıyor:');
  fs.writeFileSync(splashPath, c, 'utf8');
  console.log('    [✓] provisionSplash güncellendi.');
}

// 5. tray.js
console.log('[5] tray.js yamalanıyor...');
const trayPath = path.join(extractDir, 'dist', 'tray.js');
if (fs.existsSync(trayPath)) {
  let c = fs.readFileSync(trayPath, 'utf8');
  c = c.replace('No agents running', 'Çalışan ajan yok').replace('Quit', 'Çıkış');
  fs.writeFileSync(trayPath, c, 'utf8');
  console.log('    [✓] tray.js güncellendi.');
}

// 6. menu.js - Native Rebuild
console.log('[6] menu.js yamalanıyor...');
const menuPath = path.join(extractDir, 'dist', 'menu.js');
if (fs.existsSync(menuPath)) {
  let c = fs.readFileSync(menuPath, 'utf8');

  // String değiştirmeler
  c = c.replace(/'New Window'/g, "'Yeni Pencere'")
       .replace(/'Connect to WSL'/g, "'WSL\\'ye Bağlan'")
       .replace(/'Reopen Locally'/g, "'Yerel Olarak Yeniden Aç'")
       .replace(/'Docs'/g, "'Belgeler'")
       .replace(/'Check for Updates'/g, "'Güncellemeleri Denetle'");

  // Helper ekle
  const rebuildCode = `
function menuToTemplate(menu) {
  if (!menu || !menu.items) return [];
  const menuMap = {
    'File': 'Dosya', 'Edit': 'Düzenle', 'View': 'Görünüm', 'Window': 'Pencere', 'Help': 'Yardım',
    'Undo': 'Geri Al', 'Redo': 'Yinele', 'Cut': 'Kes', 'Copy': 'Kopyala', 'Paste': 'Yapıştır',
    'Select All': 'Tümünü Seç', 'Reload': 'Yeniden Yükle', 'Force Reload': 'Zorla Yeniden Yükle',
    'Toggle Full Screen': 'Tam Ekranı Aç/Kapat', 'Actual Size': 'Gerçek Boyut',
    'Zoom In': 'Yakınlaştır', 'Zoom Out': 'Uzaklaştır', 'Minimize': 'Simge Durumuna Küçült',
    'Zoom': 'Büyüt', 'Close': 'Kapat',
    'New Conversation': 'Yeni Konuşma', 'Create Project': 'Proje Oluştur',
    'Command Palette': 'Komut Paleti', 'New Window': 'Yeni Pencere',
    'Quit': 'Çıkış', 'Docs': 'Belgeler', 'Check for Updates': 'Güncellemeleri Denetle',
    'Connect to WSL': "WSL'ye Bağlan", 'Reopen Locally': 'Yerel Olarak Yeniden Aç',
    'Split': 'Böl', 'Archive': 'Arşivle', 'Rename': 'Yeniden Adlandır',
    'Remote Control': 'Uzaktan Kontrol', 'Terminal': 'Terminal'
  };

  return menu.items.map(item => {
    const label = menuMap[item.label] || item.label;
    const opts = {
      label: label,
      type: item.type,
      role: item.role,
      accelerator: item.accelerator,
      click: item.click,
      enabled: item.enabled,
      visible: item.visible,
      checked: item.checked,
      id: item.id
    };
    if (item.submenu) {
      opts.submenu = menuToTemplate(item.submenu);
    }
    return opts;
  });
}

function rebuildLocalizedMenu(menu) {
  if (!menu) return menu;
  try {
    const template = menuToTemplate(menu);
    return electron_1.Menu.buildFromTemplate(template);
  } catch (e) {
    return menu;
  }
}
`;

  c = rebuildCode + '\n' + c;

  // addItemToSubmenu güncellemesi: Hem 'File' hem 'Dosya' arasın
  c = c.replace(
    'const submenuItem = appMenu.items.find((item) => item.label === submenuLabel);',
    "const submenuItem = appMenu.items.find((item) => item.label === submenuLabel || item.label === ({'File':'Dosya','Help':'Yardım','View':'Görünüm','Window':'Pencere','Edit':'Düzenle'}[submenuLabel] || submenuLabel));"
  );

  // setApplicationMenu çağrılarını rebuildLocalizedMenu ile sar
  c = c.replace(
    /electron_1\.Menu\.setApplicationMenu\(menu\);/g,
    'electron_1.Menu.setApplicationMenu(rebuildLocalizedMenu(menu));'
  );

  fs.writeFileSync(menuPath, c, 'utf8');
  console.log('    [✓] menu.js native rebuild ile yamalandı.');
}

// 7. preload.js - DOM Çevirmeni
console.log('[7] preload.js içine akıllı DOM çevirmeni enjekte ediliyor...');
const dictFile = path.join(__dirname, 'desktop_full_dictionary.json');
const dictionary = JSON.parse(fs.readFileSync(dictFile, 'utf8'));

// Ek eksikleri de sözlüğe ekle
Object.assign(dictionary, {
  "File": "Dosya",
  "View": "Görünüm",
  "Window": "Pencere",
  "Help": "Yardım",
  "Open IDE": "IDE'yi Aç",
  "Open Antigravity IDE": "Antigravity IDE'yi Aç",
  "Create Project": "Proje Oluştur",
  "Command Palette": "Komut Paleti",
  "Rename": "Yeniden Adlandır",
  "Unpin": "Sabitlemeden Kaldır",
  "Archive": "Arşivle",
  "Remote Control": "Uzaktan Kontrol",
  "Split": "Böl",
  "Terminal": "Terminal",
  "Model": "Model",
  "Fast": "Hızlı",
  "Medium": "Orta",
  "Low": "Düşük",
  "High": "Yüksek",
  "View Usage": "Kullanımı Görüntüle",
  "View plans": "Planları Görüntüle",
  "This account is ineligible for higher rate limits through a Google AI plan at this time.": "Bu hesap şu anda bir Google AI planı aracılığıyla daha yüksek istek limitleri için uygun değildir."
});

const preloadPath = path.join(extractDir, 'dist', 'preload.js');
let preloadContent = fs.readFileSync(preloadPath, 'utf8');

const translatorScript = `
// ═══════════════════════════════════════════════════════════════════
// ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ (V2)
// ═══════════════════════════════════════════════════════════════════
(function() {
  const dictionary = ${JSON.stringify(dictionary, null, 2)};

  function translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    const parent = node.parentElement;
    if (!parent) return;
    const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
    if (tag === 'script' || tag === 'style' || tag === 'pre' || tag === 'code') return;
    if (parent.isContentEditable) return;
    if (parent.closest && parent.closest('.monaco-editor')) return;

    const val = node.nodeValue;
    if (!val) return;
    const trimmed = val.trim();
    if (!trimmed) return;

    if (dictionary[trimmed]) {
      node.nodeValue = val.replace(trimmed, dictionary[trimmed]);
    }
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.placeholder && dictionary[el.placeholder.trim()]) {
      el.placeholder = dictionary[el.placeholder.trim()];
    }
    if (el.title && dictionary[el.title.trim()]) {
      el.title = dictionary[el.title.trim()];
    }
    const aria = el.getAttribute('aria-label');
    if (aria && dictionary[aria.trim()]) {
      el.setAttribute('aria-label', dictionary[aria.trim()]);
    }
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType === 1) {
      translateAttributes(root);
    }

    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      let n;
      while ((n = walker.nextNode())) {
        translateTextNode(n);
      }
    } catch (e) {}

    if (root.querySelectorAll) {
      try {
        const els = root.querySelectorAll('[placeholder],[title],[aria-label]');
        for (let i = 0; i < els.length; i++) {
          translateAttributes(els[i]);
        }
      } catch (e) {}
    }
  }

  function initTranslator() {
    if (document.body) {
      translateTree(document.body);
    }

    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            translateTree(m.addedNodes[j]);
          }
        } else if (m.type === 'characterData') {
          translateTextNode(m.target);
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // İlk 5 saniye boyunca her 500ms'de dinamik portal ve menüleri de tara
    let checks = 0;
    const interval = setInterval(() => {
      if (document.body) translateTree(document.body);
      checks++;
      if (checks > 10) clearInterval(interval);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslator);
  } else {
    initTranslator();
  }
})();
`;

// preloadContent'te eski çevirmen varsa temizle
if (preloadContent.includes('ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ')) {
  preloadContent = preloadContent.replace(/\/\/ ═+[\s\S]*?ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ[\s\S]*?\n\}\)\(\);\n?/m, '');
}

preloadContent += '\n' + translatorScript;
fs.writeFileSync(preloadPath, preloadContent, 'utf8');
console.log('    [✓] preload.js V2 güncellendi.');

// 8. Paketle
console.log('[8] app.asar yeniden paketleniyor...');
const tempAsar = path.join(path.dirname(extractDir), 'app.asar.new');
execSync(`npx asar pack "${extractDir}" "${tempAsar}"`, { stdio: 'ignore' });
fs.copyFileSync(tempAsar, asarPath);
try { fs.rmSync(tempAsar, { force: true }); } catch (e) {}
try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch (e) {}

console.log('\n' + '='.repeat(55));
console.log('  YAMA BAŞARIYLA UYGULANDI VE app.asar YAZILDI!');
console.log('='.repeat(55) + '\n');
