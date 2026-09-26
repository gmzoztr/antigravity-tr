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
    // 4. Birincil Kenar Çubuğu (Primary Side Bar Menus)
    if (!data.contents['vs/workbench/browser/parts/sidebar/sidebarPart']) {
      data.contents['vs/workbench/browser/parts/sidebar/sidebarPart'] = {};
    }
    const sb = data.contents['vs/workbench/browser/parts/sidebar/sidebarPart'];
    sb.showSideBar = 'Birincil Kenar Çubuğunu Göster';
    sb.hideSideBar = 'Birincil Kenar Çubuğunu Gizle';
    sb.sideBar = 'Birincil Kenar Çubuğu';
    sb.miSidebar = '&&Birincil Kenar Çubuğu';
    sb.toggleSideBar = 'Birincil Kenar Çubuğunu Aç/Kapat';
    sb.moveSideBarRight = 'Birincil Kenar Çubuğunu Sağa Taşı';
    sb.moveSideBarLeft = 'Birincil Kenar Çubuğunu Sola Taşı';
    sb.miMoveSideBarRight = '&&Birincil Kenar Çubuğunu Sağa Taşı';
    sb.miMoveSideBarLeft = '&&Birincil Kenar Çubuğunu Sola Taşı';
    sb.toggleSideBarPosition = 'Birincil Kenar Çubuğu Pozisyonunu Değiştir';

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
      const wslReplacements = [
        ['"default distro"', '"Varsayılan Dağıtım"'],
        ['"Close Remote"', '"Uzak Bağlantıyı Kapat"'],
        ['"Retry"', '"Yeniden Dene"'],
        ['"Select WSL distro"', '"WSL dağıtımı seçin"'],
        ['"Select the WSL distro to install"', '"Yüklenecek WSL dağıtımını seçin"'],
        ['" (Workspace)"', '" (Çalışma Alanı)"'],
      ];
      for (const [en, tr] of wslReplacements) {
        c = c.replaceAll(en, tr);
      }
      fs.writeFileSync(wslFile, c, 'utf8');
    } catch (e) {}
  }
}

function patchClaudeExtension(paths) {
  const dirs = [
    paths.ide?.extensionsDir,
    path.join(process.env.USERPROFILE || 'C:\\Users\\Work-D', '.vscode', 'extensions')
  ];
  const replacements = [
    ['Claude Code: Open in New Tab', 'Claude Code: Yeni Sekmede Aç'],
    ['Claude Code: Open in Primary Editor', 'Claude Code: Birincil Düzenleyicide Aç'],
    ['Claude Code: Open in Side Bar', 'Claude Code: Kenar Çubuğunda Aç'],
    ['Claude Code: Open in Terminal', 'Claude Code: Terminalde Aç'],
    ['Claude Code: Open in New Window', 'Claude Code: Yeni Pencerede Aç'],
    ['Claude Code: Open', 'Claude Code: Aç'],
    ['Claude Code: New Conversation', 'Claude Code: Yeni Konuşma'],
    ['Claude Code: Reopen Closed Session', 'Claude Code: Kapatılan Oturumu Yeniden Aç'],
    ['Claude Code: Accept Proposed Changes', 'Claude Code: Önerilen Değişiklikleri Kabul Et'],
    ['Claude Code: Reject Proposed Changes', 'Claude Code: Önerilen Değişiklikleri Reddet']
  ];

  for (const d of dirs) {
    if (!d || !fs.existsSync(d)) continue;
    try {
      for (const sub of fs.readdirSync(d)) {
        if (sub.startsWith('anthropic.claude-code')) {
          const pkgPath = path.join(d, sub, 'package.json');
          if (fs.existsSync(pkgPath)) {
            try { fs.chmodSync(pkgPath, 0o666); } catch (e) {}
            let content = fs.readFileSync(pkgPath, 'utf8');
            for (const [en, tr] of replacements) {
              content = content.replaceAll(en, tr);
            }
            fs.writeFileSync(pkgPath, content, 'utf8');
          }
        }
      }
    } catch (e) {}
  }
}

function patchCodexExtension(paths) {
  const dirs = [
    paths.ide?.extensionsDir,
    path.join(process.env.USERPROFILE || 'C:\\Users\\Work-D', '.vscode', 'extensions')
  ];
  const replacements = [
    ['"Open Codex Sidebar"', '"Codex Kenar Çubuğunu Aç"'],
    ['"Open Codex Command Menu"', '"Codex Komut Menüsünü Aç"'],
    ['"Implement with Codex"', '"Codex ile Uygula"'],
    ['"New Codex Agent"', '"Yeni Codex Ajanı"'],
    ['"Add to Codex Thread"', '"Codex İş Parçacığına Ekle"'],
    ['"Add File to Codex Thread"', '"Dosyayı Codex İş Parçacığına Ekle"'],
    ['"New Chat in ChatGPT Sidebar"', '"ChatGPT Kenar Çubuğunda Yeni Sohbet"'],
    ['"Copy Codex CLI args for LSP MCP"', '"LSP MCP için Codex CLI Bağımsız Değişkenlerini Kopyala"'],
    ['"Codex Settings"', '"Codex Ayarları"']
  ];

  for (const d of dirs) {
    if (!d || !fs.existsSync(d)) continue;
    try {
      for (const sub of fs.readdirSync(d)) {
        if (sub.startsWith('openai.chatgpt')) {
          const pkgPath = path.join(d, sub, 'package.json');
          if (fs.existsSync(pkgPath)) {
            try { fs.chmodSync(pkgPath, 0o666); } catch (e) {}
            let content = fs.readFileSync(pkgPath, 'utf8');
            for (const [en, tr] of replacements) {
              content = content.replaceAll(en, tr);
            }
            fs.writeFileSync(pkgPath, content, 'utf8');
          }
        }
      }
    } catch (e) {}
  }
}

/**
 * Antigravity yerleşik uzak ve çekirdek uzantıların (Dev Containers, SSH, WSL, Antigravity)
 * package.json açıklamalarını ve başlıklarını Türkçeleştirir.
 */
function patchAntigravityRemoteExtensions(paths) {
  if (!paths.ide || !paths.ide.appPath) return;
  const extsDir = path.join(paths.ide.appPath, 'resources', 'app', 'extensions');

  const configs = [
    {
      dir: 'antigravity-dev-containers',
      replacements: [
        ['"Enable SSH agent forwarding when connecting to devcontainers."', '"Dev container\'lara bağlanırken SSH aracısı iletimini etkinleştirin."'],
        ['"Disable the server checksum verification. This is only recommended for development and testing."', '"Sunucu sağlama toplamı doğrulamasını devre dışı bırakın. Bu yalnızca geliştirme ve test için önerilir."'],
        ['"Use devcontainers within Antigravity"', '"Antigravity içinde dev container\'ları kullanın"'],
        ['"Dev Containers (Antigravity)"', '"Geliştirme Kapsayıcıları (Antigravity)"'],
        ['"Reopen in Container"', '"Kapsayıcıda Yeniden Aç"'],
        ['"Show Antigravity Dev Containers Log"', '"Antigravity Geliştirme Kapsayıcıları Günlüğünü Göster"'],
        ['"Open Folder in Container"', '"Klasörü Kapsayıcıda Aç"'],
        ['"Reopen Folder Locally"', '"Klasörü Yerel Olarak Yeniden Aç"'],
        ['"Attach to Running Container"', '"Çalışan Kapsayıcıya Bağlan"'],
        ['"category": "Dev Containers"', '"category": "Geliştirme Kapsayıcıları"']
      ]
    },
    {
      dir: 'antigravity-remote-openssh',
      replacements: [
        ['"The absolute file path to a custom SSH config file."', '"Özel bir SSH yapılandırma dosyasının mutlak dosya yolu."'],
        ['"The absolute file path to the SSH executable. If empty, will use the ssh on the PATH."', '"SSH yürütülebilir dosyasının mutlak dosya yolu. Boşsa PATH üzerindeki ssh kullanılır."'],
        ['"Experimental: The URL from where the Antigravity server will be downloaded. The following variables can be substituted: ${os}, ${arch}, ${ideVersion}, ${vscodeVersion} ${commit}, ${quality}."', '"Deneysel: Antigravity sunucusunun indirileceği URL. Şu değişkenler yerine konulabilir: ${os}, ${arch}, ${ideVersion}, ${vscodeVersion} ${commit}, ${quality}."'],
        ['"Experimental: The name of the server binary, use this if you are using a client without a corresponding server release, or if you are iterating on remote extensions."', '"Deneysel: Sunucu ikili dosyasının adı; ilgili sunucu sürümü olmayan bir istemci kullanıyorsanız veya uzak uzantılar üzerinde çalışıyorsanız bunu kullanın."'],
        ['"Experimental: Disable the server checksum verification. This is only recommended for development and testing."', '"Deneysel: Sunucu sağlama toplamı doğrulamasını devre dışı bırakın. Bu yalnızca geliştirme ve test için önerilir."'],
        ['"Connect to remote machines over SSH using Antigravity"', '"Antigravity kullanarak SSH üzerinden uzak makinelere bağlanın"'],
        ['"SSH (Antigravity)"', '"SSH Hedefleri (Antigravity)"'],
        ['"Close SSH Process"', '"SSH İşlemini Kapat"'],
        ['"Connect to SSH Host..."', '"SSH Ana Bilgisayarına Bağlan..."'],
        ['"Connect to SSH Host in Current Window..."', '"Geçerli Pencerede SSH Ana Bilgisayarına Bağlan..."'],
        ['"Show SSH Log..."', '"SSH Günlüğünü Göster..."'],
        ['"Connect to SSH Host in New Window"', '"Yeni Pencerede SSH Ana Bilgisayarına Bağlan"'],
        ['"Connect to SSH Host in Current Window"', '"Geçerli Pencerede SSH Ana Bilgisayarına Bağlan"'],
        ['"Open on SSH Host in Current Window"', '"Geçerli Pencerede SSH Ana Bilgisayarında Aç"'],
        ['"Open on SSH Host in New Window"', '"Yeni Pencerede SSH Ana Bilgisayarında Aç"'],
        ['"Remove from List"', '"Listeden Kaldır"'],
        ['"Refresh"', '"Yenile"'],
        ['"Configure"', '"Yapılandır"'],
        ['"Add New"', '"Yeni Ekle"'],
        ['"Add Cloudtop URL"', '"Cloudtop URL\'si Ekle"'],
        ['"category": "Remote-SSH"', '"category": "Uzak-SSH"']
      ]
    },
    {
      dir: 'antigravity-remote-wsl',
      replacements: [
        ['"The URL from where the Antigravity server will be downloaded. The following variables can be substituted: ${os}, ${arch}, ${ideVersion}, ${vscodeVersion} ${commit}, ${quality}."', '"Antigravity sunucusunun indirileceği URL. Şu değişkenler yerine konulabilir: ${os}, ${arch}, ${ideVersion}, ${vscodeVersion} ${commit}, ${quality}."'],
        ['"Experimental: Disable the server checksum verification. This is only recommended for development and testing."', '"Deneysel: Sunucu sağlama toplamı doğrulamasını devre dışı bırakın. Bu yalnızca geliştirme ve test için önerilir."'],
        ['"WSL Targets (Antigravity)"', '"WSL Hedefleri (Antigravity)"'],
        ['"Connect to WSL"', '"WSL\'ye Bağlan"'],
        ['"Connect to WSL in New Window"', '"Yeni Pencerede WSL\'ye Bağlan"'],
        ['"Connect to WSL using Distro..."', '"Dağıtım Kullanarak WSL\'ye Bağlan..."'],
        ['"Connect to WSL using Distro in New Window..."', '"Yeni Pencerede Dağıtım Kullanarak WSL\'ye Bağlan..."'],
        ['"Show Log"', '"Günlüğü Göster"'],
        ['"Connect in New Window"', '"Yeni Pencerede Bağlan"'],
        ['"Connect in Current Window"', '"Geçerli Pencerede Bağlan"'],
        ['"Open in Current Window"', '"Geçerli Pencerede Aç"'],
        ['"Open in New Window"', '"Yeni Pencerede Aç"'],
        ['"Remove From Recent List"', '"Son Kullanılanlar Listesinden Kaldır"'],
        ['"Refresh"', '"Yenile"'],
        ['"Add a Distro"', '"Dağıtım Ekle"'],
        ['"Set as Default Distro"', '"Varsayılan Dağıtım Olarak Ayarla"'],
        ['"Delete Distro"', '"Dağıtımı Sil"'],
        ['"category": "Remote-WSL"', '"category": "Uzak-WSL"']
      ]
    },
    {
      dir: 'antigravity',
      replacements: [
        ['"Changes the base URL for marketplace search results. [Available Options](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#extensions-marketplace). You must restart Antigravity to use the new marketplace after changing this value."', '"Marketplace arama sonuçları için temel URL\'yi değiştirir. [Kullanılabilir Seçenekler](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#extensions-marketplace). Bu değeri değiştirdikten sonra yeni marketplace\'i kullanmak için Antigravity\'yi yeniden başlatmanız gerekir."'],
        ['"Changes the base URL on each extension page. [Available Options](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#extensions-marketplace). You must restart Antigravity to use the new marketplace after changing this value."', '"Her uzantı sayfasındaki temel URL\'yi değiştirir. [Kullanılabilir Seçenekler](https://github.com/VSCodium/vscodium/blob/master/docs/index.md#extensions-marketplace). Bu değeri değiştirdikten sonra yeni marketplace\'i kullanmak için Antigravity\'yi yeniden başlatmanız gerekir."'],
        ['"Jetski will attempt to compute embeddings for workspaces up to this many files. This file count ignores .gitignore and binary files. Raising this limit from the default value may lead to performance issues. Values 0 or below will be treated as unlimited."', '"Jetski, bu sayıya kadar dosyaya sahip çalışma alanları için yerleştirmeleri (embeddings) hesaplamaya çalışır. Bu dosya sayısı .gitignore ve ikili (binary) dosyaları yoksayar. Bu sınırın varsayılan değerin üzerine çıkarılması performans sorunlarına yol açabilir. 0 veya daha düşük değerler sınırsız kabul edilir."'],
        ['"Enable the Cursor-import commands in the palette"', '"Komut paletinde Cursor içe aktarma komutlarını etkinleştirin"'],
        ['"Keep the Language Server running after the editor is closed."', '"Düzenleyici kapatıldıktan sonra Dil Sunucusunun çalışmaya devam etmesini sağlayın."']
      ]
    }
  ];

  for (const cfg of configs) {
    const pkgPath = path.join(extsDir, cfg.dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        try { fs.chmodSync(pkgPath, 0o666); } catch (e) {}
        let content = fs.readFileSync(pkgPath, 'utf8');
        for (const [en, tr] of cfg.replacements) {
          content = content.replaceAll(en, tr);
        }
        fs.writeFileSync(pkgPath, content, 'utf8');
      } catch (e) {}
    }
  }
}

/**
 * clangd eklentisinin package.json açıklamalarını Türkçeleştirir.
 */
function patchClangdExtension(paths) {
  const dirs = [
    paths.ide?.extensionsDir,
    path.join(process.env.USERPROFILE || 'C:\\Users\\Work-D', '.vscode', 'extensions')
  ];

  const replacements = [
    ['"Arguments for clangd server."', '"clangd sunucusu için bağımsız değişkenler."'],
    ['"Check for language server updates on startup."', '"Başlangıçta dil sunucusu güncellemelerini denetleyin."'],
    ['"Warn about conflicting extensions and suggest disabling them."', '"Çakışan uzantılar hakkında uyarın ve bunları devre dışı bırakmayı önerin."'],
    ['"Enable code completion provided by the language server"', '"Dil sunucusu tarafından sağlanan kod tamamlamayı etkinleştirin"'],
    ['"Enable hovers provided by the language server"', '"Dil sunucusu tarafından sağlanan üzerine gelme ipuçlarını etkinleştirin"'],
    ['"Extra clang flags used to parse files when no compilation database is found."', '"Derleme veritabanı bulunamadığında dosyaları ayrıştırmak için kullanılan ek clang bayrakları."'],
    ['"The path to clangd executable, e.g.: /usr/bin/clangd."', '"clangd yürütülebilir dosyasının yolu, örn.: /usr/bin/clangd."'],
    ['"Names a file that clangd should log a performance trace to, in chrome trace-viewer JSON format."', '"clangd\'nin chrome trace-viewer JSON biçiminde performans izi kaydedeceği dosyanın adı."'],
    ['"Auto restart clangd (up to 4 times) if it crashes."', '"clangd çökerse otomatik olarak (en fazla 4 kez) yeniden başlatın."'],
    ['"Always rank completion items on the server as you type. This produces more accurate results, at the cost of higher latency."', '"Yazarken her zaman tamamlama öğelerini sunucuda sıralayın. Bu, daha yüksek gecikme pahasına daha doğru sonuçlar üretir."'],
    ['"What to do when clangd configuration files are changed. Ignored if clangd does not support config file watching."', '"clangd yapılandırma dosyaları değiştirildiğinde ne yapılacağı. clangd yapılandırma dosyası izlemeyi desteklemiyorsa yoksayılır."'],
    ['"Force enable of \\"On Config Changed\\" option regardless of clangd version."', '"clangd sürümünden bağımsız olarak \\"Yapılandırma Değiştiğinde\\" seçeneğini zorla etkinleştirin."'],
    ['"Allows the path to be a script e.g.: clangd.sh."', '"Yolun clangd.sh gibi bir komut dosyası olmasına izin verir."'],
    ['"Use a background highlight rather than opacity to identify inactive code."', '"Etkin olmayan kodu belirtmek için opaklık yerine arka plan vurgulaması kullanın."']
  ];

  for (const d of dirs) {
    if (!d || !fs.existsSync(d)) continue;
    try {
      for (const sub of fs.readdirSync(d)) {
        if (sub.includes('clangd')) {
          const pkgPath = path.join(d, sub, 'package.json');
          if (fs.existsSync(pkgPath)) {
            try { fs.chmodSync(pkgPath, 0o666); } catch (e) {}
            let content = fs.readFileSync(pkgPath, 'utf8');
            for (const [en, tr] of replacements) {
              content = content.replaceAll(en, tr);
            }
            fs.writeFileSync(pkgPath, content, 'utf8');
          }
        }
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

  // 5. Google Cloud, Antigravity, Remote, Clangd, Claude, Codex ve WSL Eklenti Yamaları
  console.log('5. Eklenti arayüz dizeleri yamalanıyor...');
  patchGoogleCloudExtension(paths);
  patchAntigravityExtension(paths);
  patchAntigravityRemoteExtensions(paths);
  patchClangdExtension(paths);
  patchWslExtension(paths);
  patchClaudeExtension(paths);
  patchCodexExtension(paths);
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
