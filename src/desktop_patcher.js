/** Antigravity Desktop Turkish patch. Existing dictionaries are preserved. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { translateDynamic } = require('./desktop_dynamic');
const { rewriteArchive, restoreArchive } = require('./desktop_archive');

function transformDesktopSources(input) {
  const sources = new Map(input);
  const fileName = name => 'dist/' + name;
  // 3. loadingOverlay.js Yamalama
  const loadingPath = fileName('loadingOverlay.js');
  if (sources.has(loadingPath)) {
    let c = sources.get(loadingPath);
    c = c.replace('Loading Antigravity', 'Antigravity Yükleniyor...');
    sources.set(loadingPath, c);
  }

  // 4. provisionSplash.js Yamalama
  const splashPath = fileName('provisionSplash.js');
  if (sources.has(splashPath)) {
    let c = sources.get(splashPath);
    c = c.replace('Setting up WSL:', 'WSL Yapılandırılıyor:');
    sources.set(splashPath, c);
  }

  // 5. tray.js ve main.js Yamalama
  const trayPath = fileName('tray.js');
  if (sources.has(trayPath)) {
    let c = sources.get(trayPath);
    c = c.replace('No agents running', 'Çalışan ajan yok').replace('Quit', 'Çıkış');
    c = c.replace(
      "(count > 0 ? `${count}` : 'No') +\n                    ' agent' +\n                    (count === 1 ? '' : 's') +\n                    ' running'",
      "(count > 0 ? `${count} ajan çalışıyor` : 'Çalışan ajan yok')"
    );
    sources.set(trayPath, c);
  }

  const mainPath = fileName('main.js');
  if (sources.has(mainPath)) {
    let c = sources.get(mainPath);
    c = c.replace("'No agents running'", "'Çalışan ajan yok'")
         .replace("'Quit'", "'Çıkış'")
         .replace("'New Window'", "'Yeni Pencere'");
    sources.set(mainPath, c);
  }

  // 6. menu.js Yamalama
  const menuPath = fileName('menu.js');
  if (sources.has(menuPath)) {
    let c = sources.get(menuPath);
    if (c.trimStart().startsWith('function menuToTemplate(menu)')) {
      const originalStart = c.indexOf('"use strict";');
      if (originalStart < 0 || !c.slice(0, originalStart).includes('function rebuildLocalizedMenu(menu)')) {
        throw new Error('Eski menü yamasının sınırları doğrulanamadı.');
      }
      c = c.slice(originalStart);
    }

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

    sources.set(menuPath, c);
  }

  // 7. preload.js Yamalama
  const preloadPath = fileName('preload.js');
  if (sources.has(preloadPath)) {
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
      "Unpin": "Sabitlemeyi Kaldır",
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

    let preloadContent = sources.get(preloadPath);

    const translatorScript = `
// ═══════════════════════════════════════════════════════════════════
// ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ (V2)
// ═══════════════════════════════════════════════════════════════════
(function() {
  const dictionary = ${JSON.stringify(dictionary, null, 2)};
  const translateDynamic = ${translateDynamic.toString()};

  function translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    const parent = node.parentElement;
    if (!parent) return;
    const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
    if (tag === 'script' || tag === 'style' || tag === 'pre' || tag === 'code') return;
    if (parent.isContentEditable) return;
    if (parent.closest && parent.closest('script,style,pre,code,textarea,input,.monaco-editor,.markdown,[data-message-author-role],[data-antigravity-tr-ignore]')) return;

    const val = node.nodeValue;
    if (!val) return;
    const trimmed = val.trim();
    if (!trimmed) return;

    const translated = Object.prototype.hasOwnProperty.call(dictionary, trimmed) ? dictionary[trimmed] : translateDynamic(trimmed);
    if (translated === trimmed && parent.childNodes.length > 1 && Array.from(parent.childNodes).every(n => n.nodeType === 3)) {
      const combined = parent.textContent.trim();
      if (Object.prototype.hasOwnProperty.call(dictionary, combined) && dictionary[combined] !== combined) {
        parent.childNodes[0].nodeValue = dictionary[combined];
        for (let i = 1; i < parent.childNodes.length; i++) parent.childNodes[i].nodeValue = '';
        return;
      }
    }
    if (translated !== trimmed) {
      node.nodeValue = val.replace(trimmed, translated);
    }
  }

  function translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.placeholder && Object.prototype.hasOwnProperty.call(dictionary, el.placeholder.trim()) && dictionary[el.placeholder.trim()] !== el.placeholder) {
      el.placeholder = dictionary[el.placeholder.trim()];
    }
    if (el.title && Object.prototype.hasOwnProperty.call(dictionary, el.title.trim()) && dictionary[el.title.trim()] !== el.title) {
      el.title = dictionary[el.title.trim()];
    }
    const aria = el.getAttribute('aria-label');
    if (aria && Object.prototype.hasOwnProperty.call(dictionary, aria.trim()) && dictionary[aria.trim()] !== aria) {
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

    const options = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] };
    const observedRoot = document.documentElement || document.body;
    if (!observedRoot) return;
    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      try {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            translateTree(m.addedNodes[j]);
          }
        } else if (m.type === 'characterData') {
          translateTextNode(m.target);
        } else if (m.type === 'attributes') {
          translateAttributes(m.target);
        }
      }
      } finally { observer.observe(observedRoot, options); }
    });
    observer.observe(observedRoot, options);
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslator);
  } else {
    initTranslator();
  }
})();
`;

    const marker = 'ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ';
    const markerIndex = preloadContent.indexOf(marker);
    if (markerIndex >= 0) {
      const start = preloadContent.lastIndexOf('// ═', markerIndex);
      const end = preloadContent.indexOf('\n})();', markerIndex);
      if (start < 0 || end < 0 || preloadContent.slice(end + 6).trim()) {
        throw new Error('Eski çeviri katmanının sınırları doğrulanamadı.');
      }
      preloadContent = preloadContent.slice(0, start).trimEnd();
    }

    preloadContent += '\n' + translatorScript;
    sources.set(preloadPath, preloadContent);
  }

  for (const [name, source] of sources) new vm.Script(source, { filename: name });
  return sources;
}

async function patchDesktopApp(paths) {
  try {
    const asar = await import('@electron/asar');
    const archive = path.join(paths.desktop.appPath, 'resources', 'app.asar');
    asar.uncacheAll();
    const version = JSON.parse(asar.extractFile(archive, 'package.json').toString()).version;
    if (!['2.17.0', '2.18.1'].includes(version)) throw new Error(`Desktop ${version} henüz doğrulanmadı; desteklenen sürümler: 2.17.0, 2.18.1.`);
    const names = ['loadingOverlay.js', 'provisionSplash.js', 'tray.js', 'menu.js', 'preload.js', 'main.js'];
    const sources = new Map();
    for (const name of names) {
      const key = 'dist/' + name;
      sources.set(key, asar.extractFile(archive, path.normalize(key)).toString('utf8'));
    }
    const next = transformDesktopSources(sources);
    const changes = new Map([...next].filter(([name, value]) => value !== sources.get(name)).map(([name, value]) => [name, Buffer.from(value)]));
    if (!changes.size) return { success: true, changedFiles: [], message: 'Yama zaten güncel.' };
    return await rewriteArchive(archive, changes);
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

async function restoreDesktopApp(paths, selectedBackup) {
  const archive = path.join(paths.desktop.appPath, 'resources', 'app.asar');
  const backup = selectedBackup || (fs.existsSync(archive + '.bak') ? archive + '.bak' :
    fs.readdirSync(path.dirname(archive)).filter(n => /^app\.asar\.backup-\d+-[a-f0-9]+$/.test(n)).sort().map(n => path.join(path.dirname(archive), n))[0]);
  if (!backup) return { restored: false, reason: 'Yedek bulunamadı.' };
  try { return await restoreArchive(archive, path.resolve(backup)); }
  catch (error) { return { restored: false, reason: error.message }; }
}

module.exports = { patchDesktopApp, restoreDesktopApp, transformDesktopSources };
