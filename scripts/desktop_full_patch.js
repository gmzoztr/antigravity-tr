/**
 * Antigravity Desktop App - Tam Türkçeleştirme Scripti
 * 
 * Bu script:
 * 1. CDP (port 9223) üzerinden Desktop app'e bağlanır
 * 2. Tüm ekranları gezerek İngilizce metinleri toplar
 * 3. app.asar'ı çıkarır
 * 4. Bundle JS dosyalarında metinleri bulur ve Türkçesiyle değiştirir
 * 5. app.asar'ı yeniden paketler
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ASAR_PATH = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Antigravity', 'resources', 'app.asar');
const EXTRACT_DIR = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Antigravity', 'resources', 'app.asar.extracted');
const BACKUP_PATH = ASAR_PATH + '.backup';

// ═══════════════════════════════════════════════════════════════════
// TÜRKÇE ÇEVIRI SÖZLÜĞÜ
// ═══════════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  // Sol Kenar Çubuğu
  'New Conversation': 'Yeni Konuşma',
  'Conversation History': 'Konuşma Geçmişi',
  'Scheduled Tasks': 'Zamanlanmış Görevler',
  'Pinned Conversations': 'Sabitlenmiş Konuşmalar',
  'Projects': 'Projeler',
  'Conversations': 'Konuşmalar',
  'Settings': 'Ayarlar',

  // Üst Menü
  'Open IDE': "IDE'yi Aç",
  'File': 'Dosya',
  'View': 'Görünüm',
  'Window': 'Pencere',

  // Ayarlar Menüsü
  'General': 'Genel',
  'Application': 'Uygulama',
  'Appearance': 'Görünüm',
  'Models': 'Modeller',
  'Customizations': 'Özelleştirmeler',
  'Browser': 'Tarayıcı',
  'Not In Project': 'Proje Dışı',
  'Shortcuts': 'Kısayollar',
  'Provide Feedback': 'Geri Bildirim Ver',

  // Ayarlar İçerikleri - Genel
  'Agent Settings': 'Ajan Ayarları',
  'Agent Behavior': 'Ajan Davranışı',
  'Local Permissions': 'Yerel İzinler',
  'Global Permissions': 'Genel İzinler',
  'Security Preset': 'Güvenlik Ön Ayarı',
  'Controls the actions the agent can take.': 'Ajanın gerçekleştirebileceği eylemleri denetler.',
  'Turbo Mode': 'Turbo Mod',
  'Default': 'Varsayılan',
  'Plan Review Policy': 'Plan İnceleme Politikası',
  'Whether the agent asks you to review its documents.': 'Ajanın belgelerini incelemenizi isteyip istemeyeceği.',
  'Always Proceed': 'Her Zaman Devam Et',
  'Type': 'Yaz',
  'and select': 've seç',
  'to have the agent generate a plan.': 'ile ajana plan oluşturmasını söyleyin.',
  'Also includes': 'Şunları da içerir:',
  'when working in this project.': 'bu proje üzerinde çalışırken.',
  'Learn more.': 'Daha fazla bilgi edinin.',
  'Learn more': 'Daha fazla bilgi edinin',
  'File Access Rules': 'Dosya Erişim Kuralları',
  'Configure allowed and denied paths for file reads and writes.': 'Dosya okuma ve yazma için izin verilen ve reddedilen yolları yapılandırın.',
  'Network Access Rules': 'Ağ Erişim Kuralları',
  'Configure allowed and denied URLs for reading.': 'Okuma için izin verilen ve reddedilen URL\'leri yapılandırın.',
  'Terminal Commands': 'Terminal Komutları',
  'Configure allowed terminal commands.': 'İzin verilen terminal komutlarını yapılandırın.',
  'Commands Outside Sandbox': 'Kum Havuzu Dışı Komutlar',
  'Configure allowed commands outside the sandbox.': 'Kum havuzu dışında izin verilen komutları yapılandırın.',
  'Open': 'Aç',
  'Agent settings and permissions for conversations outside of projects.': 'Projeler dışındaki konuşmalar için ajan ayarları ve izinleri.',

  // Görünüm / Appearance
  'Theme': 'Tema',
  'Dark': 'Koyu',
  'Light': 'Açık',
  'System': 'Sistem',
  'Font Size': 'Yazı Tipi Boyutu',
  'Font Family': 'Yazı Tipi Ailesi',
  'Compact Mode': 'Kompakt Mod',
  'Language': 'Dil',

  // Modeller
  'Model': 'Model',
  'Select Model': 'Model Seç',
  'Temperature': 'Sıcaklık',
  'Max Tokens': 'Maksimum Token',
  'Context Window': 'Bağlam Penceresi',
  'API Key': 'API Anahtarı',
  'Endpoint': 'Uç Nokta',
  'Add Model': 'Model Ekle',
  'Edit': 'Düzenle',
  'Delete': 'Sil',
  'Save': 'Kaydet',
  'Cancel': 'İptal',
  'Confirm': 'Onayla',

  // Konuşma arayüzü
  'Ask anything, @ to mention / for actions': 'Bir şey sor, @ ile bahset, / ile eylemler',
  'Ask anything': 'Bir şey sor',
  '@ to mention': '@ ile bahset',
  '/ for actions': '/ ile eylemler',
  'Send': 'Gönder',
  'Stop': 'Durdur',
  'Copy': 'Kopyala',
  'Retry': 'Yeniden Dene',
  'New conversation': 'Yeni konuşma',
  'Thinking': 'Düşünüyor',
  'Loading': 'Yükleniyor',
  'No conversations yet': 'Henüz konuşma yok',
  'Start a new conversation': 'Yeni bir konuşma başlat',
  'Search conversations': 'Konuşmalarda ara',
  'Search': 'Ara',
  'Pin': 'Sabitle',
  'Unpin': 'Sabitlemeden Kaldır',
  'Rename': 'Yeniden Adlandır',
  'Archive': 'Arşivle',
  'Attach': 'Ekle',
  'Attach file': 'Dosya ekle',
  'Upload': 'Yükle',

  // Proje
  'Project': 'Proje',
  'Create Project': 'Proje Oluştur',
  'New Project': 'Yeni Proje',
  'Project Name': 'Proje Adı',
  'Description': 'Açıklama',
  'Add Folder': 'Klasör Ekle',
  'Remove Folder': 'Klasörü Kaldır',

  // Ortak Butonlar / İfadeler
  'Back': 'Geri',
  'Next': 'İleri',
  'Close': 'Kapat',
  'Done': 'Tamam',
  'Apply': 'Uygula',
  'Reset': 'Sıfırla',
  'Clear': 'Temizle',
  'Yes': 'Evet',
  'No': 'Hayır',
  'Enable': 'Etkinleştir',
  'Disable': 'Devre Dışı Bırak',
  'Enabled': 'Etkin',
  'Disabled': 'Devre Dışı',
  'On': 'Açık',
  'Off': 'Kapalı',
  'Error': 'Hata',
  'Warning': 'Uyarı',
  'Success': 'Başarılı',
  'Info': 'Bilgi',
  'Required': 'Zorunlu',
  'Optional': 'İsteğe Bağlı',
  'Advanced': 'Gelişmiş',
  'More options': 'Daha fazla seçenek',
  'See all': 'Tümünü gör',
  'Show more': 'Daha fazla göster',
  'Show less': 'Daha az göster',

  // Hata mesajları
  'Something went wrong': 'Bir şeyler yanlış gitti',
  'Failed to connect': 'Bağlantı başarısız',
  'Unauthorized': 'Yetkisiz',
  'Not found': 'Bulunamadı',
  'Network error': 'Ağ hatası',

  // Scheduled Tasks
  'Add Task': 'Görev Ekle',
  'Task Name': 'Görev Adı',
  'Schedule': 'Zamanlama',
  'Run Now': 'Şimdi Çalıştır',
  'Last Run': 'Son Çalıştırma',
  'Next Run': 'Sonraki Çalıştırma',
  'Status': 'Durum',
  'Running': 'Çalışıyor',
  'Pending': 'Bekliyor',
  'Completed': 'Tamamlandı',
  'Failed': 'Başarısız',

  // Özelleştirmeler / Customizations
  'Shortcuts': 'Kısayollar',
  'Keyboard Shortcuts': 'Klavye Kısayolları',
  'Hotkeys': 'Kısayol Tuşları',

  // Güvenlik Ön Ayarları
  'Normal Mode': 'Normal Mod',
  'Plan Mode': 'Plan Modu',
  'I learn more about Turbo mode': 'Turbo mod hakkında daha fazla bilgi edinin',
  'Learn more about': 'Hakkında daha fazla bilgi edinin:',
};

// ═══════════════════════════════════════════════════════════════════
// CDP TARAMASI
// ═══════════════════════════════════════════════════════════════════
async function scanDesktopUI() {
  console.log('\n1. Antigravity Desktop CDP portuna bağlanılıyor (localhost:9223)...');
  const browser = await chromium.connectOverCDP('http://localhost:9223');
  const contexts = browser.contexts();
  
  let mainPage = null;
  for (const ctx of contexts) {
    for (const page of ctx.pages()) {
      const title = await page.title().catch(() => '');
      const url = page.url();
      console.log(`   Sayfa: "${title}" | ${url}`);
      if (url.includes('app://') || url.includes('antigravity') || title.includes('Antigravity') || url.startsWith('app:')) {
        mainPage = page;
      }
    }
  }

  if (!mainPage) {
    mainPage = contexts[0]?.pages()[0];
  }
  
  if (!mainPage) throw new Error('Antigravity Desktop penceresi bulunamadı!');
  console.log('   ✓ Ana pencereye bağlanıldı\n');

  // Settings'i aç
  const foundTexts = new Set();
  
  // Tüm görünür metin node'larını topla
  const texts = await mainPage.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    const result = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text.length > 1 && /[a-zA-Z]/.test(text)) {
        const parent = node.parentElement;
        result.push({
          text,
          tag: parent?.tagName?.toLowerCase(),
          role: parent?.getAttribute('role'),
          cls: parent?.className?.substring(0, 60),
        });
      }
    }
    return result;
  });

  console.log(`   Taranan metin sayısı: ${texts.length}`);
  texts.forEach(t => foundTexts.add(t.text));

  // Ekran görüntüsü al
  const ssPath = path.join(__dirname, '..', 'scratch', 'desktop_scan.png');
  await mainPage.screenshot({ path: ssPath, fullPage: false });
  console.log(`   📸 Ekran görüntüsü kaydedildi: ${ssPath}`);

  await browser.close();
  return { texts, foundTexts };
}

// ═══════════════════════════════════════════════════════════════════
// ASAR ÇIKARMA VE YAMA
// ═══════════════════════════════════════════════════════════════════
async function patchAsar() {
  console.log('\n2. app.asar yedeği alınıyor...');
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(ASAR_PATH, BACKUP_PATH);
    console.log(`   ✓ Yedek: ${BACKUP_PATH}`);
  } else {
    console.log('   ℹ Yedek zaten mevcut, atlanıyor.');
  }

  console.log('\n3. app.asar çıkarılıyor...');
  if (fs.existsSync(EXTRACT_DIR)) {
    fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  }
  execSync(`npx asar extract "${ASAR_PATH}" "${EXTRACT_DIR}"`, { stdio: 'inherit' });
  console.log('   ✓ Çıkarma tamamlandı.');

  console.log('\n4. Bundle JS dosyaları taranıyor ve yamalar uygulanıyor...');
  
  const jsFiles = [];
  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walkDir(full);
      } else if (entry.endsWith('.js') && stat.size < 10 * 1024 * 1024) {
        jsFiles.push(full);
      }
    }
  }
  walkDir(EXTRACT_DIR);
  console.log(`   ${jsFiles.length} JS dosyası bulundu.`);

  let totalPatches = 0;
  const patchReport = [];

  for (const file of jsFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    let filePatches = 0;

    for (const [en, tr] of Object.entries(TRANSLATIONS)) {
      // String literalleri yakala: "text" veya 'text' veya `text`
      const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Çift tırnak
      const dq = new RegExp(`"${escaped}"`, 'g');
      if (dq.test(content)) {
        content = content.replace(dq, `"${tr}"`);
        modified = true;
        filePatches++;
      }
      
      // Tek tırnak
      const sq = new RegExp(`'${escaped}'`, 'g');
      if (sq.test(content)) {
        content = content.replace(sq, `'${tr}'`);
        modified = true;
        filePatches++;
      }

      // JSX / template literal içi (>Text< gibi)
      const jsx = new RegExp(`(>)${escaped}(<)`, 'g');
      if (jsx.test(content)) {
        content = content.replace(jsx, `$1${tr}$2`);
        modified = true;
        filePatches++;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      totalPatches += filePatches;
      patchReport.push({ file: path.relative(EXTRACT_DIR, file), patches: filePatches });
    }
  }

  console.log(`   ✓ Toplam ${totalPatches} string yamalandı, ${patchReport.length} dosya değiştirildi.`);
  if (patchReport.length > 0) {
    patchReport.sort((a, b) => b.patches - a.patches);
    patchReport.slice(0, 10).forEach(r => console.log(`     - ${r.file}: ${r.patches} değişiklik`));
  }

  console.log('\n5. app.asar yeniden paketleniyor...');
  fs.copyFileSync(ASAR_PATH, ASAR_PATH + '.before_patch');
  execSync(`npx asar pack "${EXTRACT_DIR}" "${ASAR_PATH}"`, { stdio: 'inherit' });
  console.log('   ✓ asar paketi güncellendi.');

  // Temizle
  fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
  console.log('   ✓ Geçici çıkarma dizini temizlendi.');

  return { totalPatches, patchReport };
}

// ═══════════════════════════════════════════════════════════════════
// DOĞRULAMA
// ═══════════════════════════════════════════════════════════════════
async function verifyPatch() {
  console.log('\n6. Doğrulama: yeniden başlatın ve CDP\'ye bağlanın...');
  console.log('   Antigravity Desktop\'ı yeniden başlatın, ardından:');
  console.log('   node scripts/desktop_verify.js');
}

// ═══════════════════════════════════════════════════════════════════
// ANA FONKSİYON
// ═══════════════════════════════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   ANTİGRAVİTY DESKTOP TÜRKÇE YAMA ARACI');
  console.log('═══════════════════════════════════════════════════════\n');

  const mode = process.argv[2] || 'all';

  try {
    if (mode === 'scan') {
      // Sadece tara, yama yapma
      const { texts } = await scanDesktopUI();
      const reportPath = path.join(__dirname, 'desktop_scan_report.json');
      const englishOnly = texts.filter(t => /^[A-Za-z0-9\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(t.text));
      fs.writeFileSync(reportPath, JSON.stringify(englishOnly, null, 2), 'utf8');
      console.log(`\n✓ Rapor kaydedildi: ${reportPath}`);
      console.log(`  İngilizce metin sayısı: ${englishOnly.length}`);

    } else if (mode === 'patch') {
      // Sadece yama yap (CDP gerektirmez)
      await patchAsar();

    } else {
      // Hem tara hem yama (varsayılan)
      let scanResult = null;
      try {
        scanResult = await scanDesktopUI();
      } catch (e) {
        console.log(`   ⚠ CDP taraması atlandı (Desktop açık değil): ${e.message}`);
      }
      await patchAsar();
      await verifyPatch();
    }

    console.log('\n✅ Tamamlandı! Değişikliklerin görünmesi için Antigravity Desktop\'ı yeniden başlatın.');

  } catch (err) {
    console.error('\n❌ Hata:', err.message);
    process.exit(1);
  }
}

main();
