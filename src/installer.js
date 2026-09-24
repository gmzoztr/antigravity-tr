const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getPaths } = require('./config');
const { applyAllPatches, restoreAllPatches } = require('./patcher');

/**
 * GEMINI.md kuralını ekler veya günceller.
 */
function setupGeminiRule(paths) {
  const ruleTemplatePath = path.join(__dirname, '..', 'rules', 'GEMINI.md');
  if (!fs.existsSync(ruleTemplatePath)) {
    return { success: false, reason: 'Kural şablon dosyası bulunamadı.' };
  }

  const newRuleContent = fs.readFileSync(ruleTemplatePath, 'utf8').trim();
  const targetFile = paths.geminiRuleFile;

  if (!fs.existsSync(paths.geminiDir)) {
    fs.mkdirSync(paths.geminiDir, { recursive: true });
  }

  let existing = '';
  if (fs.existsSync(targetFile)) {
    existing = fs.readFileSync(targetFile, 'utf8');
  }

  const startTag = '<!-- antigravity-tr:start -->';
  const endTag = '<!-- antigravity-tr:end -->';

  let updated = '';
  if (existing.includes(startTag) && existing.includes(endTag)) {
    const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
    updated = existing.replace(regex, newRuleContent);
  } else {
    updated = existing ? `${existing.trim()}\n\n${newRuleContent}\n` : `${newRuleContent}\n`;
  }

  fs.writeFileSync(targetFile, updated, 'utf8');
  return { success: true, path: targetFile };
}

/**
 * GEMINI.md dosyasından Türkçe kuralını kaldırır.
 */
function removeGeminiRule(paths) {
  const targetFile = paths.geminiRuleFile;
  if (!fs.existsSync(targetFile)) return { success: true };

  let content = fs.readFileSync(targetFile, 'utf8');
  const startTag = '<!-- antigravity-tr:start -->';
  const endTag = '<!-- antigravity-tr:end -->';

  if (content.includes(startTag) && content.includes(endTag)) {
    const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
    content = content.replace(regex, '').trim();
    fs.writeFileSync(targetFile, content + '\n', 'utf8');
    return { success: true, removed: true };
  }

  return { success: true, removed: false };
}

/**
 * argv.json dosyasına "locale": "tr" ekler.
 */
function setArgvLocale(argvPath, locale = 'tr') {
  if (!fs.existsSync(argvPath)) {
    const dir = path.dirname(argvPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(argvPath, `{\n\t"locale": "${locale}"\n}\n`, 'utf8');
    return { success: true, created: true };
  }

  let content = fs.readFileSync(argvPath, 'utf8');
  if (content.includes('"locale"')) {
    content = content.replace(/"locale":\s*"[^"]*"/, `"locale": "${locale}"`);
  } else {
    content = content.replace(/\{/, `{\n\t"locale": "${locale}",`);
  }
  fs.writeFileSync(argvPath, content, 'utf8');
  return { success: true, modified: true };
}

/**
 * locale.json dosyasını yazar.
 */
function setLocaleJson(localePath, locale = 'tr') {
  const dir = path.dirname(localePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(localePath, JSON.stringify({ locale }, null, 2), 'utf8');
  return { success: true };
}

/**
 * Dil paketinde eksik olan Google ve yeni VS Code dizelerini (quickOpen, helpActions, auxiliaryactivitybar) ekler.
 */
function enrichLanguagePackFile(mainJsonPath) {
  if (!fs.existsSync(mainJsonPath)) return;
  try {
    try { fs.chmodSync(mainJsonPath, 0o666); } catch (e) {}
    const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));

    // 1. Başlık çubuğu quickOpen
    if (!data.contents['vs/workbench/browser/parts/titlebar/titlebarPart']) {
      data.contents['vs/workbench/browser/parts/titlebar/titlebarPart'] = {};
    }
    data.contents['vs/workbench/browser/parts/titlebar/titlebarPart'].quickOpen = 'Hızlı Aç';

    // 2. Yardım menüsü (Provide Feedback, Download Diagnostics)
    if (!data.contents['vs/workbench/browser/actions/helpActions']) {
      data.contents['vs/workbench/browser/actions/helpActions'] = {};
    }
    const help = data.contents['vs/workbench/browser/actions/helpActions'];
    help.miProvideFeedback = '&&Geri Bildirimde Bulun';
    help.provideFeedback = 'Geri Bildirimde Bulun';
    help.downloadDiagnostics = 'Tanılama Bilgilerini İndir';

    // 3. İkincil Etkinlik Çubuğu (Secondary Activity Bar Position & Menus)
    if (!data.contents['vs/workbench/browser/parts/auxiliaryactivitybar/auxiliaryactivitybarPart']) {
      data.contents['vs/workbench/browser/parts/auxiliaryactivitybar/auxiliaryactivitybarPart'] = {};
    }
    const aux = data.contents['vs/workbench/browser/parts/auxiliaryactivitybar/auxiliaryactivitybarPart'];
    aux.hideMenu = 'Menüyü Gizle';
    aux['auxiliary activity bar position'] = 'İkincil Etkinlik Çubuğu Pozisyonu';
    aux.miDefaultAuxiliaryActivityBar = '&&Varsayılan';
    aux.default = 'Varsayılan';
    aux.miTopAuxiliaryActivityBar = '&&Üst';
    aux.top = 'Üst';
    aux.miBottomAuxiliaryActivityBar = '&&Alt';
    aux.bottom = 'Alt';
    aux.miHideAuxiliaryActivityBar = '&&Gizli';
    aux.hide = 'Gizli';
    aux.positionAuxiliaryActivituBar = 'İkincil Etkinlik Çubuğu Pozisyonu';
    aux.positionAuxiliaryActivityBarDefault = 'İkincil Etkinlik Çubuğunu Yan Tarafa Taşı';
    aux.positionAuxiliaryActivityBarTop = 'İkincil Etkinlik Çubuğunu En Üste Taşı';
    aux.positionAuxiliaryActivityBarBottom = 'İkincil Etkinlik Çubuğunu Alta Taşı';
    aux.hideAuxiliaryActivityBar = 'İkincil Etkinlik Çubuğunu Gizle';

    fs.writeFileSync(mainJsonPath, JSON.stringify(data), 'utf8');
  } catch (e) {}
}

/**
 * Resmi VS Code Türkçe dil paketini Antigravity IDE ve Masaüstü uygulamasına bağlar/zenginleştirir.
 */
function ensureLanguagePack(paths) {
  const cli = paths.ide.cliCmd;
  if (fs.existsSync(cli)) {
    try {
      execSync(`"${cli}" --install-extension ms-ceintl.vscode-language-pack-tr`, {
        stdio: 'ignore'
      });
    } catch (e) {
      // Eklenti zaten yüklü veya manuel bağlantı kullanılacak
    }
  }

  if (paths.ide && paths.ide.extensionsDir) {
    const mainJsonPath = path.join(paths.ide.extensionsDir, 'ms-ceintl.vscode-language-pack-tr-1.106.0-universal', 'translations', 'main.i18n.json');
    enrichLanguagePackFile(mainJsonPath);
  }

  if (paths.desktop && paths.desktop.extensionsDir) {
    const mainJsonPath = path.join(paths.desktop.extensionsDir, 'ms-ceintl.vscode-language-pack-tr-1.106.0-universal', 'translations', 'main.i18n.json');
    enrichLanguagePackFile(mainJsonPath);
  }

  return { installed: true };
}

/**
 * Masaüstü ve IDE arasında dil paketi ve languagepacks.json senkronizasyonunu sağlar.
 */
function syncLanguagePacks(paths) {
  const ideLp = paths.ide.languagePacksFile;
  const desktopLp = paths.desktop.languagePacksFile;

  if (fs.existsSync(ideLp) && fs.existsSync(path.dirname(desktopLp))) {
    try {
      const content = fs.readFileSync(ideLp, 'utf8').replaceAll('.antigravity-ide', '.antigravity');
      fs.writeFileSync(desktopLp, content, 'utf8');
    } catch (e) {}
  }
}

/**
 * Electron derleme ve bytecode önbelleğini temizler.
 * Böylece yamalanan dosyalar doğrudan diskten taze derlenir.
 */
function clearElectronCache(paths) {
  const targets = [
    path.join(paths.ide.userConfigPath, 'Code Cache'),
    path.join(paths.ide.userConfigPath, 'CachedData'),
    path.join(paths.ide.userConfigPath, 'CachedConfigurations'),
    path.join(paths.ide.userConfigPath, 'CachedProfilesData')
  ];

  let clearedCount = 0;
  for (const t of targets) {
    if (fs.existsSync(t)) {
      try {
        fs.rmSync(t, { recursive: true, force: true });
        clearedCount++;
      } catch (e) {}
    }
  }
  return clearedCount;
}

/**
 * Antigravity ana eklentisindeki (Antigravity - Settings) menüsünü yamalar.
 */
function patchAntigravityExtension(paths) {
  if (!paths.ide || !paths.ide.appPath) return;
  const extFile = path.join(paths.ide.appPath, 'resources', 'app', 'extensions', 'antigravity', 'dist', 'extension.js');
  if (fs.existsSync(extFile)) {
    try {
      try { fs.chmodSync(extFile, 0o666); } catch (e) {}
      let c = fs.readFileSync(extFile, 'utf8');
      if (c.includes('"Antigravity - Settings"')) {
        c = c.replaceAll('"Antigravity - Settings"', '"Antigravity - Ayarlar"');
        fs.writeFileSync(extFile, c, 'utf8');
      }
    } catch (e) {}
  }
}

/**
 * Google Cloud Data Agent Kit eklentisindeki (no project) ve menüleri yamalar.
 */
function patchGoogleCloudExtension(paths) {
  if (!paths.ide || !paths.ide.extensionsDir) return;
  const dcDir = path.join(paths.ide.extensionsDir, 'googlecloudtools.datacloud-0.11.0-universal');
  if (!fs.existsSync(dcDir)) return;

  const jsFile = path.join(dcDir, 'datacloud_vscode.js');
  if (fs.existsSync(jsFile)) {
    try {
      try { fs.chmodSync(jsFile, 0o666); } catch (e) {}
      let c = fs.readFileSync(jsFile, 'utf8');
      
      const jsReplacements = [
        ['(no project)', '(Proje Seçilmedi)'],
        ['(proje seçilmedi)', '(Proje Seçilmedi)'],
        ['`Signed in as ', '`Şununla oturum açıldı: '],
        ['"Google Cloud Data Agent Kit - No Project Selected"', '"Google Cloud Data Agent Kit - Proje Seçilmedi"'],
        ['"$(cloud) Select a Google Cloud project"', '"$(cloud) Bir Google Cloud Projesi Seçin"'],
        ['"$(cloud) Bir Google Cloud projesi seçin"', '"$(cloud) Bir Google Cloud Projesi Seçin"'],
        ['"Google Cloud: Switch Project"', '"Google Cloud: Proje Değiştir"'],
        ['"Google Cloud: Set Billing/Quota Project"', '"Google Cloud: Faturalandırma/Kota Projesini Belirle"'],
        ['"Default (Same as Project)"', '"Varsayılan (Proje ile Aynı)"'],
        ['"Google Cloud: Sign Out"', '"Google Cloud: Oturumu Kapat"'],
        ['"Google Cloud: Reset Billing/Quota Project to Default"', '"Google Cloud: Faturalandırma/Kota Projesini Varsayılana Sıfırla"'],
        ['"Use the selected Google Cloud Project"', '"Seçilen Google Cloud Projesini Kullan"'],
        ['"Select Billing/Quota Project"', '"Faturalandırma/Kota Projesini Seçin"'],
        ['"Sign Out of Google Cloud"', '"Google Cloud Oturumunu Kapat"'],
        ['label:"Starred Projects"', 'label:"Yıldızlı Projeler"'],
        ['label:"Recent Projects"', 'label:"Son Kullanılan Projeler"'],
        ['tooltip:"Remove from recent projects"', 'tooltip:"Son Kullanılan Projelerden Kaldır"'],
        ['tooltip:"Star project"', 'tooltip:"Projeyi Yıldızla"'],
        ['tooltip:"Unstar project"', 'tooltip:"Proje Yıldızını Kaldır"'],
        ['tooltip:"Sign in to Google to manage projects"', 'tooltip:"Projeleri yönetmek için Google\'da oturum açın"'],
        ['b.title="Google Cloud Data Agent Kit Auth Status"', 'b.title="Google Cloud Data Agent Kit Kimlik Doğrulama Durumu"'],
        ['"Sign out of Google Cloud Data Agent Kit Extension"', '"Google Cloud Data Agent Kit Eklentisi Oturumunu Kapat"'],
        ['label:"$(sign-out) Sign Out"', 'label:"$(sign-out) Oturumu Kapat"'],
        ['"Please select a Google Cloud project to continue. If you don\'t have a project yet, you can create one in Cloud Console."', '"Devam etmek için lütfen bir Google Cloud projesi seçin. Henüz bir projeniz yoksa Cloud Console\'da oluşturabilirsiniz."'],
        ['"Select a project"', '"Bir Proje Seçin"'],
        ['"Create a project in Cloud Console"', '"Cloud Console\'da bir proje oluşturun"'],
        ['"Please set a Google Cloud region to continue."', '"Devam etmek için lütfen bir Google Cloud bölgesi belirleyin."'],
        ['"Set region"', '"Bölge Belirle"'],
        ['NO_ITEMS_TO_DISPLAY_LABEL="No items to display"', 'NO_ITEMS_TO_DISPLAY_LABEL="Görüntülenecek Öğe Yok"'],
        ['title:"Load more"', 'title:"Daha Fazla Yükle"'],
        ['title:"Report Bug"', 'title:"Hata Bildir"'],
        ['title:"Open Settings"', 'title:"Ayarları Aç"'],
        ['title:"Open Quick Guide"', 'title:"Hızlı Başlangıç Kılavuzunu Aç"'],
        ['PANEL_TITLE:"Quick Start Guide",LABEL:"Quick Start Guide"', 'PANEL_TITLE:"Hızlı Başlangıç Kılavuzu",LABEL:"Hızlı Başlangıç Kılavuzu"']
      ];

      for (const [s, r] of jsReplacements) {
        if (c.includes(s)) {
          c = c.replaceAll(s, r);
        }
      }

      fs.writeFileSync(jsFile, c, 'utf8');
    } catch (e) {}
  }

  const pkgFile = path.join(dcDir, 'package.json');
  if (fs.existsSync(pkgFile)) {
    try {
      try { fs.chmodSync(pkgFile, 0o666); } catch (e) {}
      let p = fs.readFileSync(pkgFile, 'utf8');
      const pkgReplacements = [
        ['"title": "Databases"', '"title": "Veritabanları"'],
        ['"title": "Data Engineering"', '"title": "Veri Mühendisliği"'],
        ['"title": "Catalog"', '"title": "Katalog"'],
        ['"title": "Compiled Query"', '"title": "Derlenmiş Sorgu"'],
        ['"title": "Runs History"', '"title": "Çalıştırma Geçmişi"'],
        ['"title": "Query Results"', '"title": "Sorgu Sonuçları"'],
        ['"title": "Orchestration Pipeline Runs History"', '"title": "Orkestrasyon İşlem Hattı Çalıştırma Geçmişi"'],
        ['"name": "Catalog"', '"name": "Katalog"'],
        ['"name": "Databases"', '"name": "Veritabanları"'],
        ['"name": "Data Engineering"', '"name": "Veri Mühendisliği"'],
        ['"name": "Compiled Query"', '"name": "Derlenmiş Sorgu"'],
        ['"name": "Runs History"', '"name": "Çalıştırma Geçmişi"'],
        ['"name": "Query Results"', '"name": "Sorgu Sonuçları"'],
        ['"name": "General"', '"name": "Genel"'],
        ['"name": "Managed Service for Apache Airflow Runs History"', '"name": "Managed Service for Apache Airflow Çalıştırma Geçmişi"']
      ];

      for (const [s, r] of pkgReplacements) {
        if (p.includes(s)) {
          p = p.replaceAll(s, r);
        }
      }
      fs.writeFileSync(pkgFile, p, 'utf8');
    } catch (e) {}
  }
}

/**
 * Gömülü WSL uzantısındaki (default distro) metnini yamalar.
 */
function patchWslExtension(paths) {
  if (!paths.ide || !paths.ide.appPath) return;
  const wslFile = path.join(paths.ide.appPath, 'resources', 'app', 'extensions', 'antigravity-remote-wsl', 'dist', 'extension.js');
  if (fs.existsSync(wslFile)) {
    try {
      try { fs.chmodSync(wslFile, 0o666); } catch (e) {}
      let c = fs.readFileSync(wslFile, 'utf8');
      if (c.includes('"default distro"')) {
        c = c.replaceAll('"default distro"', '"Varsayılan Dağıtım"');
        fs.writeFileSync(wslFile, c, 'utf8');
      }
    } catch (e) {}
  }
}

/**
 * Tam kurulum yürütür.
 */
function install() {
  const paths = getPaths();
  const dictPath = path.join(__dirname, '..', 'locales', 'tr.json');
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

  console.log('--- Antigravity Türkçe Kurulum Başlatılıyor ---');

  // 1. AI Kuralları
  console.log('1. Yapay zeka Türkçe kuralları (GEMINI.md) uygulanıyor...');
  const ruleRes = setupGeminiRule(paths);
  if (ruleRes.success) {
    console.log('   [✓] GEMINI.md başarıyla güncellendi.');
  }

  // 2. IDE Yapılandırması
  console.log('2. Antigravity IDE dil ve yerel ayarları yapılandırılıyor...');
  ensureLanguagePack(paths);
  setArgvLocale(paths.ide.argvFile, 'tr');
  setLocaleJson(paths.ide.localeFile, 'tr');
  console.log('   [✓] Antigravity IDE yerel ayarları (tr) bağlandı.');

  // 3. Desktop Yapılandırması
  if (fs.existsSync(paths.desktop.appPath)) {
    console.log('3. Antigravity Desktop ayarları yapılandırılıyor...');
    setArgvLocale(paths.desktop.argvFile, 'tr');
    setLocaleJson(paths.desktop.localeFile, 'tr');
    syncLanguagePacks(paths);
    console.log('   [✓] Antigravity Desktop yerel ayarları bağlandı.');
  }

  // 4. Özel Bileşen Yamaları
  console.log('4. Antigravity arayüz bileşenleri yamalanıyor...');
  const patchResults = applyAllPatches(paths, dict);
  for (const r of patchResults) {
    if (r.modified) {
      console.log(`   [✓] ${r.target}: ${r.matches} dize Türkçeleştirildi.`);
    } else {
      console.log(`   [-] ${r.target}: ${r.message || 'Değişiklik yapılmadı.'}`);
    }
  }

  // 5. Google Cloud, Antigravity ve WSL Eklenti Yamaları
  console.log('5. Eklenti arayüz dizeleri yamalanıyor...');
  patchGoogleCloudExtension(paths);
  patchAntigravityExtension(paths);
  patchWslExtension(paths);
  console.log('   [✓] Eklenti arayüzleri ve durum çubuğu güncellendi.');

  // 6. Önbellek Temizleme
  console.log('6. V8 Bytecode ve Electron önbelleği temizleniyor...');
  clearElectronCache(paths);
  console.log('   [✓] Önbellek temizlendi, taze derleme hazır.');

  console.log('\n--- Kurulum Başarıyla Tamamlandı! ---');
  console.log('Değişikliklerin görünmesi için açık olan Antigravity / Antigravity IDE pencerelerini yeniden başlatın.');
}

/**
 * Tam geri alma (uninstall) yürütür.
 */
function uninstall() {
  const paths = getPaths();
  console.log('--- Antigravity Türkçe Ayarları Geri Alınıyor ---');

  // 1. AI Kuralları
  console.log('1. GEMINI.md Türkçe kuralları temizleniyor...');
  removeGeminiRule(paths);
  console.log('   [✓] Kural bloğu kaldırıldı.');

  // 2. Yamalar
  console.log('2. Orijinal bundle dosyaları (.bak) geri yükleniyor...');
  const restoreResults = restoreAllPatches(paths);
  for (const r of restoreResults) {
    if (r.restored) {
      console.log(`   [✓] ${r.target}: Orijinal dosyaya dönüldü.`);
    } else {
      console.log(`   [-] ${r.target}: ${r.reason || 'Yedek bulunamadı.'}`);
    }
  }

  // 3. Yerel ayarları en'e çevir
  console.log('3. Dil ayarları varsayılana çevriliyor...');
  setArgvLocale(paths.ide.argvFile, 'en');
  setLocaleJson(paths.ide.localeFile, 'en');
  if (fs.existsSync(paths.desktop.appPath)) {
    setArgvLocale(paths.desktop.argvFile, 'en');
    setLocaleJson(paths.desktop.localeFile, 'en');
  }
  console.log('   [✓] Yerel ayarlar varsayılana döndü.');

  // 4. Önbellek Temizle
  clearElectronCache(paths);

  console.log('\n--- Geri Alma Tamamlandı! ---');
}

module.exports = {
  install,
  uninstall
};
