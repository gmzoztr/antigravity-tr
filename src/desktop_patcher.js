/**
 * Antigravity Desktop (Electron + Language Server) Uygulamasını Türkçeleştirme Modülü
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function patchDesktopApp(paths) {
  const asarPath = path.join(paths.desktop.appPath, 'resources', 'app.asar');
  const backupPath = path.join(paths.desktop.appPath, 'resources', 'app.asar.bak');
  const extractDir = path.join(paths.desktop.dataPath || path.join(paths.home, '.antigravity'), 'asar_extracted');

  if (!fs.existsSync(asarPath)) {
    return { success: false, reason: 'app.asar bulunamadı: ' + asarPath };
  }

  // 1. Yedekleme
  try {
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(asarPath, backupPath);
    }
  } catch (e) {
    return { success: false, reason: 'Yedekleme başarısız: ' + e.message };
  }

  // 2. Çıkarma
  try {
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    fs.mkdirSync(extractDir, { recursive: true });
    execSync(`npx asar extract "${asarPath}" "${extractDir}"`, { stdio: 'ignore' });
  } catch (e) {
    return { success: false, reason: 'asar çıkarma başarısız: ' + e.message };
  }

  // 3. loadingOverlay.js Yamalama
  const loadingPath = path.join(extractDir, 'dist', 'loadingOverlay.js');
  if (fs.existsSync(loadingPath)) {
    let c = fs.readFileSync(loadingPath, 'utf8');
    c = c.replace('Loading Antigravity', 'Antigravity Yükleniyor...');
    fs.writeFileSync(loadingPath, c, 'utf8');
  }

  // 4. provisionSplash.js Yamalama
  const splashPath = path.join(extractDir, 'dist', 'provisionSplash.js');
  if (fs.existsSync(splashPath)) {
    let c = fs.readFileSync(splashPath, 'utf8');
    c = c.replace('Setting up WSL:', 'WSL Yapılandırılıyor:');
    fs.writeFileSync(splashPath, c, 'utf8');
  }

  // 5. tray.js Yamalama
  const trayPath = path.join(extractDir, 'dist', 'tray.js');
  if (fs.existsSync(trayPath)) {
    let c = fs.readFileSync(trayPath, 'utf8');
    c = c.replace('No agents running', 'Çalışan ajan yok').replace('Quit', 'Çıkış');
    fs.writeFileSync(trayPath, c, 'utf8');
  }

  // 6. menu.js Yamalama
  const menuPath = path.join(extractDir, 'dist', 'menu.js');
  if (fs.existsSync(menuPath)) {
    let c = fs.readFileSync(menuPath, 'utf8');

    c = c.replace(/'New Window'/g, "'Yeni Pencere'")
         .replace(/'Connect to WSL'/g, "'WSL\\'ye Bağlan'")
         .replace(/'Reopen Locally'/g, "'Yerel Olarak Yeniden Aç'")
         .replace(/'Docs'/g, "'Belgeler'")
         .replace(/'Check for Updates'/g, "'Güncellemeleri Denetle'");

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

    c = c.replace(
      'const submenuItem = appMenu.items.find((item) => item.label === submenuLabel);',
      "const submenuItem = appMenu.items.find((item) => item.label === submenuLabel || item.label === ({'File':'Dosya','Help':'Yardım','View':'Görünüm','Window':'Pencere','Edit':'Düzenle'}[submenuLabel] || submenuLabel));"
    );

    c = c.replace(
      /electron_1\.Menu\.setApplicationMenu\(menu\);/g,
      'electron_1.Menu.setApplicationMenu(rebuildLocalizedMenu(menu));'
    );

    fs.writeFileSync(menuPath, c, 'utf8');
  }

  // 7. preload.js Yamalama
  const preloadPath = path.join(extractDir, 'dist', 'preload.js');
  if (fs.existsSync(preloadPath)) {
    const dictFile = path.join(__dirname, '..', 'scripts', 'desktop_full_dictionary.json');
    let dictionary = {};
    if (fs.existsSync(dictFile)) {
      dictionary = JSON.parse(fs.readFileSync(dictFile, 'utf8'));
    }

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

    if (preloadContent.includes('ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ')) {
      preloadContent = preloadContent.replace(/\/\/ ═+[\s\S]*?ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ[\s\S]*?\n\}\)\(\);\n?/m, '');
    }

    preloadContent += '\n' + translatorScript;
    fs.writeFileSync(preloadPath, preloadContent, 'utf8');
  }

  // 8. Yeniden Paketleme
  try {
    const tempAsar = path.join(path.dirname(extractDir), 'app.asar.new');
    execSync(`npx asar pack "${extractDir}" "${tempAsar}"`, { stdio: 'ignore' });
    fs.copyFileSync(tempAsar, asarPath);
    try { fs.rmSync(tempAsar, { force: true }); } catch (e) {}
    try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch (e) {}
    return { success: true };
  } catch (e) {
    return { success: false, reason: 'Paketleme/yazma başarısız: ' + e.message };
  }
}

function restoreDesktopApp(paths) {
  const asarPath = path.join(paths.desktop.appPath, 'resources', 'app.asar');
  const backupPath = path.join(paths.desktop.appPath, 'resources', 'app.asar.bak');

  if (fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(backupPath, asarPath);
      return { restored: true };
    } catch (e) {
      return { restored: false, reason: e.message };
    }
  }
  return { restored: false, reason: 'Yedek bulunamadı' };
}

module.exports = {
  patchDesktopApp,
  restoreDesktopApp
};
