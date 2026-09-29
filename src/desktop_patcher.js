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
    return { success: false, reason: 'app.asar bulunamadı' };
  }

  // 1. Yedekleme
  if (!fs.existsSync(backupPath)) {
    try {
      fs.copyFileSync(asarPath, backupPath);
    } catch (e) {
      return { success: false, reason: 'Yedekleme başarısız: ' + e.message };
    }
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

  // 3. preload.js Yamalama
  const preloadPath = path.join(extractDir, 'dist', 'preload.js');
  if (fs.existsSync(preloadPath)) {
    let content = fs.readFileSync(preloadPath, 'utf8');
    if (!content.includes('ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ')) {
      const translatorCode = `
// ═══════════════════════════════════════════════════════════════════
// ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ
// ═══════════════════════════════════════════════════════════════════
(function() {
  const dictionary = {
    // Üst Bar & Butonlar
    'Open IDE': "IDE'yi Aç",
    'Antigravity': 'Antigravity',

    // Sol Kenar Çubuğu
    'New Conversation': 'Yeni Konuşma',
    'Conversation History': 'Konuşma Geçmişi',
    'Scheduled Tasks': 'Zamanlanmış Görevler',
    'Pinned Conversations': 'Sabitlenmiş Konuşmalar',
    'Projects': 'Projeler',
    'Conversations': 'Konuşmalar',
    'Settings': 'Ayarlar',
    'Shortcuts': 'Kısayollar',
    'Provide Feedback': 'Geri Bildirimde Bulun',

    // Ayarlar Sol Menü
    'General': 'Genel',
    'Application': 'Uygulama',
    'Appearance': 'Görünüm',
    'Models': 'Modeller',
    'Customizations': 'Özelleştirmeler',
    'Browser': 'Tarayıcı',
    'Not In Project': 'Proje Dışı',

    // Ayarlar - Konuşmalar Sekmesi
    'Agent settings and permissions for conversations outside of projects.': 'Projeler dışındaki konuşmalar için ajan ayarları ve izinleri.',
    'Agent Settings': 'Ajan Ayarları',
    'Security Preset': 'Güvenlik Önayarı',
    'Controls the actions the agent can take.': 'Ajanın gerçekleştirebileceği eylemleri denetler.',
    'Learn more about Turbo mode': 'Turbo mod hakkında daha fazla bilgi edinin',
    'Turbo Mode': 'Turbo Mod',
    'Normal Mode': 'Normal Mod',
    'Plan Mode': 'Plan Modu',
    'Agent Behavior': 'Ajan Davranışı',
    'Plan Review Policy': 'Plan İnceleme İlkesi',
    'Whether the agent asks you to review its documents.': 'Ajanın belgelerini incelemenizi isteyip istemeyeceği.',
    'Always Proceed': 'Her Zaman Devam Et',
    'Ask Before Proceeding': 'Devam Etmeden Önce Sor',
    'Never Proceed': 'Asla Devam Etme',
    'to have the agent generate a plan.': 'öğesini seçin.',
    'Type': 'Ajanın plan oluşturması için',
    'and select': 'yazın ve',
    'Local Permissions': 'Yerel İzinler',
    'Global Permissions': 'Genel İzinler',
    'Also includes': 'Şunları da içerir:',
    'when working in this project.': 'bu projede çalışırken.',
    'Also includes Global Permissions when working in this project. Learn more.': 'Bu projede çalışırken Genel İzinleri de içerir. Daha fazla bilgi edinin.',
    'Learn more.': 'Daha fazla bilgi edinin.',
    'Learn more': 'Daha fazla bilgi edinin',
    'File Access Rules': 'Dosya Erişim Kuralları',
    'Configure allowed and denied paths for file reads and writes.': 'Dosya okuma ve yazma işlemleri için izin verilen ve reddedilen yolları yapılandırın.',
    'Network Access Rules': 'Ağ Erişim Kuralları',
    'Configure allowed and denied URLs for reading.': 'Okuma için izin verilen ve reddedilen URL\\'leri yapılandırın.',
    'Terminal Commands': 'Terminal Komutları',
    'Configure allowed terminal commands.': 'İzin verilen terminal komutlarını yapılandırın.',
    'Commands Outside Sandbox': 'Korumalı Alan Dışı Komutlar',
    'Configure allowed commands outside the sandbox.': 'Korumalı alan dışında izin verilen komutları yapılandırın.',
    'Open': 'Aç',
    'Close': 'Kapat',

    // Ayarlar - Görünüm / Appearance
    'Theme': 'Tema',
    'Dark': 'Koyu',
    'Light': 'Açık',
    'System': 'Sistem',
    'Font Size': 'Yazı Boyutu',
    'Zoom Level': 'Yakınlaştırma Düzeyi',
    'Compact Mode': 'Kompakt Görünüm',
    'Language': 'Dil',

    // Ayarlar - Modeller
    'Default Model': 'Varsayılan Model',
    'Select Model': 'Model Seç',
    'Thinking Budget': 'Düşünme Bütçesi',
    'Max Tokens': 'Maksimum Token',
    'API Keys': 'API Anahtarları',
    'API Key': 'API Anahtarı',

    // Ayarlar - Özelleştirmeler
    'Skills': 'Beceriler',
    'Rules': 'Kurallar',
    'MCP Servers': 'MCP Sunucuları',
    'Custom Prompts': 'Özel İstemler',

    // Ayarlar - Tarayıcı
    'Browser Use': 'Tarayıcı Kullanımı',
    'Headless': 'Başsız (Headless)',
    'Allow Browser Automation': 'Tarayıcı Otomasyonuna İzin Ver',

    // Chat / İletişim Alanı
    'Ask anything, @ to mention, / for actions': 'Bir şey sorun, @ ile bahsedin, / ile eylemler',
    'Ask anything, @ to mention / for actions': 'Bir şey sorun, @ ile bahsedin, / ile eylemler',
    'Thought for': 'Düşünme süresi:',
    'Thinking': 'Düşünülüyor',
    'Thinking...': 'Düşünülüyor...',
    'Stop': 'Durdur',
    'Copy': 'Kopyala',
    'Retry': 'Yeniden Dene',
    'Edit': 'Düzenle',
    'Delete': 'Sil',
    'Cancel': 'İptal',
    'Save': 'Kaydet',
    'Confirm': 'Onayla',
    'Send': 'Gönder',
    'No conversations yet': 'Henüz konuşma yok',
    'Search conversations': 'Konuşmalarda ara',
    'Search': 'Ara'
  };

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (dictionary[trimmed]) {
      return text.replace(trimmed, dictionary[trimmed]);
    }
    return null;
  }

  function walkAndTranslate(root) {
    if (!root) return;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === 'pre' || tag === 'code' || node.classList.contains('monaco-editor') || node.isContentEditable) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let curr;
    while ((curr = walker.nextNode())) {
      if (curr.nodeType === Node.TEXT_NODE) {
        const replacement = translateText(curr.nodeValue);
        if (replacement !== null && curr.nodeValue !== replacement) {
          curr.nodeValue = replacement;
        }
      } else if (curr.nodeType === Node.ELEMENT_NODE) {
        if (curr.placeholder) {
          const rep = translateText(curr.placeholder);
          if (rep !== null) curr.placeholder = rep;
        }
        if (curr.title) {
          const rep = translateText(curr.title);
          if (rep !== null) curr.title = rep;
        }
        const aria = curr.getAttribute('aria-label');
        if (aria) {
          const rep = translateText(aria);
          if (rep !== null) curr.setAttribute('aria-label', rep);
        }
      }
    }
  }

  function initTranslator() {
    if (document.body) {
      walkAndTranslate(document.body);
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const node = m.addedNodes[i];
            walkAndTranslate(node);
          }
        } else if (m.type === 'characterData') {
          const replacement = translateText(m.target.nodeValue);
          if (replacement !== null && m.target.nodeValue !== replacement) {
            m.target.nodeValue = replacement;
          }
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslator);
  } else {
    initTranslator();
  }
})();
`;
      content += '\n' + translatorCode;
      fs.writeFileSync(preloadPath, content, 'utf8');
    }
  }

  // 4. menu.js Yamalama
  const menuPath = path.join(extractDir, 'dist', 'menu.js');
  if (fs.existsSync(menuPath)) {
    let content = fs.readFileSync(menuPath, 'utf8');
    content = content
      .replace(/'New Window'/g, "'Yeni Pencere'")
      .replace(/'Connect to WSL'/g, "'WSL\\'ye Bağlan'")
      .replace(/'Reopen Locally'/g, "'Yerel Olarak Yeniden Aç'")
      .replace(/'Docs'/g, "'Belgeler'")
      .replace(/'Check for Updates'/g, "'Güncellemeleri Denetle'");

    const menuTranslationHelper = `
function localizeAppMenu(menu) {
  if (!menu || !menu.items) return;
  const menuMap = {
    'File': 'Dosya', 'Edit': 'Düzenle', 'View': 'Görünüm', 'Window': 'Pencere', 'Help': 'Yardım',
    'Undo': 'Geri Al', 'Redo': 'Yinele', 'Cut': 'Kes', 'Copy': 'Kopyala', 'Paste': 'Yapıştır',
    'Select All': 'Tümünü Seç', 'Reload': 'Yeniden Yükle', 'Force Reload': 'Zorla Yeniden Yükle',
    'Toggle Full Screen': 'Tam Ekranı Aç/Kapat', 'Actual Size': 'Gerçek Boyut',
    'Zoom In': 'Yakınlaştır', 'Zoom Out': 'Uzaklaştır', 'Minimize': 'Simge Durumuna Küçült',
    'Zoom': 'Büyüt', 'Close': 'Kapat'
  };
  menu.items.forEach(item => {
    if (menuMap[item.label]) item.label = menuMap[item.label];
    if (item.submenu) localizeAppMenu(item.submenu);
  });
}
`;
    if (!content.includes('localizeAppMenu')) {
      content = menuTranslationHelper + '\n' + content;
      content = content.replace(
        'electron_1.Menu.setApplicationMenu(menu);',
        'localizeAppMenu(menu);\n    electron_1.Menu.setApplicationMenu(menu);'
      );
      fs.writeFileSync(menuPath, content, 'utf8');
    }
  }

  // 5. tray.js Yamalama
  const trayPath = path.join(extractDir, 'dist', 'tray.js');
  if (fs.existsSync(trayPath)) {
    let content = fs.readFileSync(trayPath, 'utf8');
    content = content
      .replace('No agents running', 'Çalışan ajan yok')
      .replace('Quit', 'Çıkış');
    fs.writeFileSync(trayPath, content, 'utf8');
  }

  // 6. Yeniden Paketleme
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
