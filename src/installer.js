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
 * Resmi VS Code Türkçe dil paketini Antigravity IDE'ye kurar veya bağlar.
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

  // Dil paketinde eksik olan başlık çubuğu quickOpen dizesini ekle
  if (paths.ide && paths.ide.extensionsDir) {
    const lpDir = path.join(paths.ide.extensionsDir, 'ms-ceintl.vscode-language-pack-tr-1.106.0-universal');
    const mainJsonPath = path.join(lpDir, 'translations', 'main.i18n.json');
    if (fs.existsSync(mainJsonPath)) {
      try {
        try { fs.chmodSync(mainJsonPath, 0o666); } catch (e) {}
        const data = JSON.parse(fs.readFileSync(mainJsonPath, 'utf8'));
        if (!data.contents['vs/workbench/browser/parts/titlebar/titlebarPart']) {
          data.contents['vs/workbench/browser/parts/titlebar/titlebarPart'] = {};
        }
        data.contents['vs/workbench/browser/parts/titlebar/titlebarPart'].quickOpen = 'Hızlı Aç';
        fs.writeFileSync(mainJsonPath, JSON.stringify(data), 'utf8');
      } catch (e) {}
    }
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
      if (c.includes('(no project)')) {
        c = c.replaceAll('(no project)', '(proje seçilmedi)');
      }
      if (c.includes('Signed in as ')) {
        c = c.replaceAll('`Signed in as ', '`Şununla oturum açıldı: ');
      }
      fs.writeFileSync(jsFile, c, 'utf8');
    } catch (e) {}
  }

  const pkgFile = path.join(dcDir, 'package.json');
  if (fs.existsSync(pkgFile)) {
    try {
      try { fs.chmodSync(pkgFile, 0o666); } catch (e) {}
      let p = fs.readFileSync(pkgFile, 'utf8');
      p = p.replace('"title": "Databases"', '"title": "Veritabanları"')
           .replace('"title": "Data Engineering"', '"title": "Veri Mühendisliği"')
           .replace('"title": "Catalog"', '"title": "Katalog"');
      fs.writeFileSync(pkgFile, p, 'utf8');
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

  // 5. Google Cloud ve Antigravity Eklenti Yamaları
  console.log('5. Eklenti arayüz dizeleri yamalanıyor...');
  patchGoogleCloudExtension(paths);
  patchAntigravityExtension(paths);
  console.log('   [✓] (no project) -> (proje seçilmedi) ve Antigravity - Ayarlar güncellendi.');

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
