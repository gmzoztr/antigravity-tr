/**
 * Antigravity Desktop Uygulamasını Eksiksiz Türkçeleştiren Yama Aracı
 * 
 * 1. app.asar yedeğini alır (app.asar.bak)
 * 2. app.asar'ı scratch/desktop_asar dizinine açar
 * 3. dist/preload.js dosyasına akıllı DOM çeviri motorunu enjekte eder
 * 4. dist/menu.js dosyasındaki menüleri Türkçeleştirir
 * 5. dist/tray.js dosyasındaki sistem tepsisi menüsünü Türkçeleştirir
 * 6. Yeniden paketleyip doğrudan app.asar olarak diske yazar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const asarPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity/resources/app.asar';
const backupPath = 'C:/Users/Work-D/AppData/Local/Programs/Antigravity/resources/app.asar.bak';
const extractDir = path.join(__dirname, '..', 'scratch', 'desktop_asar');

console.log('=== ANTIGRAVITY DESKTOP TÜRKÇELEŞTİRME BAŞLATILIYOR ===\n');

// 1. Yedekleme
if (!fs.existsSync(backupPath)) {
  console.log('1. Orijinal app.asar yedeği alınıyor...');
  fs.copyFileSync(asarPath, backupPath);
  console.log('   [✓] Yedek oluşturuldu:', backupPath);
} else {
  console.log('1. [✓] Yedek zaten mevcut:', backupPath);
}

// 2. Çıkarma
console.log('2. app.asar ayıklanıyor...');
if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir, { recursive: true });
}
execSync(`npx asar extract "${asarPath}" "${extractDir}"`, { stdio: 'inherit' });
console.log('   [✓] Ayıklama tamamlandı.');

// 3. preload.js Yamalama - Canlı DOM Çevirmeni
console.log('3. preload.js içine akıllı DOM çevirmeni enjekte ediliyor...');
const preloadPath = path.join(extractDir, 'dist', 'preload.js');
let preloadContent = fs.readFileSync(preloadPath, 'utf8');

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
    
    // Yalnızca arayüz elementlerini çevir, kod veya editör kutularına dokunma
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

if (!preloadContent.includes('ANTIGRAVITY DESKTOP TÜRKÇE CANLI ARAYÜZ ÇEVİRMENİ')) {
  preloadContent += '\n' + translatorCode;
  fs.writeFileSync(preloadPath, preloadContent, 'utf8');
  console.log('   [✓] preload.js içine çeviri motoru eklendi.');
} else {
  console.log('   [✓] preload.js çeviri motoru güncellendi.');
}

// 4. menu.js Yamalama - Masaüstü Yerel Menüleri
console.log('4. menu.js yerel menüleri Türkçeleştiriliyor...');
const menuPath = path.join(extractDir, 'dist', 'menu.js');
let menuContent = fs.readFileSync(menuPath, 'utf8');

// Menü etiketlerini Türkçeye çevir
menuContent = menuContent
  .replace(/'New Window'/g, "'Yeni Pencere'")
  .replace(/'Connect to WSL'/g, "'WSL\\'ye Bağlan'")
  .replace(/'Reopen Locally'/g, "'Yerel Olarak Yeniden Aç'")
  .replace(/'Docs'/g, "'Belgeler'")
  .replace(/'Check for Updates'/g, "'Güncellemeleri Denetle'");

// Varsayılan Electron menü başlıklarını da yerelleştiren kod ekle
const menuTranslationHelper = `
function localizeAppMenu(menu) {
  if (!menu || !menu.items) return;
  const menuMap = {
    'File': 'Dosya',
    'Edit': 'Düzenle',
    'View': 'Görünüm',
    'Window': 'Pencere',
    'Help': 'Yardım',
    'Undo': 'Geri Al',
    'Redo': 'Yinele',
    'Cut': 'Kes',
    'Copy': 'Kopyala',
    'Paste': 'Yapıştır',
    'Select All': 'Tümünü Seç',
    'Reload': 'Yeniden Yükle',
    'Force Reload': 'Zorla Yeniden Yükle',
    'Toggle Full Screen': 'Tam Ekranı Aç/Kapat',
    'Actual Size': 'Gerçek Boyut',
    'Zoom In': 'Yakınlaştır',
    'Zoom Out': 'Uzaklaştır',
    'Minimize': 'Simge Durumuna Küçült',
    'Zoom': 'Büyüt',
    'Close': 'Kapat'
  };
  menu.items.forEach(item => {
    if (menuMap[item.label]) item.label = menuMap[item.label];
    if (item.submenu) localizeAppMenu(item.submenu);
  });
}
`;

if (!menuContent.includes('localizeAppMenu')) {
  menuContent = menuTranslationHelper + '\n' + menuContent;
  menuContent = menuContent.replace(
    'electron_1.Menu.setApplicationMenu(menu);',
    'localizeAppMenu(menu);\n    electron_1.Menu.setApplicationMenu(menu);'
  );
  fs.writeFileSync(menuPath, menuContent, 'utf8');
  console.log('   [✓] menu.js yerel menüleri güncellendi.');
}

// 5. tray.js Yamalama - Sistem Tepsisi
console.log('5. tray.js sistem tepsisi menüsü Türkçeleştiriliyor...');
const trayPath = path.join(extractDir, 'dist', 'tray.js');
if (fs.existsSync(trayPath)) {
  let trayContent = fs.readFileSync(trayPath, 'utf8');
  trayContent = trayContent
    .replace('No agents running', 'Çalışan ajan yok')
    .replace('Quit', 'Çıkış');
  fs.writeFileSync(trayPath, trayContent, 'utf8');
  console.log('   [✓] tray.js güncellendi.');
}

// 6. Yeniden Paketleme
console.log('6. app.asar yeniden paketleniyor...');
const tempAsar = path.join(__dirname, '..', 'scratch', 'app.asar.new');
execSync(`npx asar pack "${extractDir}" "${tempAsar}"`, { stdio: 'inherit' });

console.log('7. app.asar dosyası yerine yerleştiriliyor...');
fs.copyFileSync(tempAsar, asarPath);
console.log('   [✓] app.asar başarıyla güncellendi!');

console.log('\n=======================================================');
console.log('   ANTIGRAVITY DESKTOP TÜRKÇELEŞTİRME TAMAMLANDI!      ');
console.log('=======================================================');
console.log('Değişikliklerin görünmesi için Antigravity uygulamasını kapatıp açmanız yeterlidir.');
