/**
 * Antigravity eklentilerinin package.json dosyalarında yer alan İngilizce ayar açıklamalarını,
 * seçeneklerini (enumDescriptions) ve kategori başlıklarını Türkçeleştiren akıllı modül.
 */

const fs = require('fs');
const path = require('path');

const propertyTranslations = {
  // Clangd
  "clangd.semanticHighlighting": "clangd içinde anlamsal vurgulamayı etkinleştirin.",
  "clangd.serverCompletionRanking": "Yazarken her zaman tamamlama öğelerini sunucuda sıralayın. Bu, istemci tarafı filtrelemeye kıyasla daha yüksek gecikme pahasına daha doğru sonuçlar üretir.",
  "clangd.onConfigChanged": "clangd yapılandırma dosyaları değiştirildiğinde ne yapılacağı. Bu dosyaları kendisi yeniden yükleyebilen clangd 12+ için yoksayılır; ancak bu durum clangd.onConfigChangedForceEnable ile geçersiz kılınabilir.",
  "clangd.inactiveRegions.useBackgroundHighlight": "Etkin olmayan önişlemci bölgelerini tanımlamak için opaklık yerine arka plan vurgulaması kullanın.",
  "clangd.inactiveRegions.opacity": "Etkin olmayan bölgelerin opaklığı (yalnızca clangd.inactiveRegions.useBackgroundHighlight=false olduğunda kullanılır)",
  "clangd.enable": "clangd dil sunucusu özelliklerini etkinleştirin",
  "clangd.path": "clangd yürütülebilir dosyasının yolu, örn.: /usr/bin/clangd.",
  "clangd.useScriptAsExecutable": "Yolun clangd.sh gibi bir komut dosyası olmasına izin verir.",
  "clangd.arguments": "clangd sunucusu için bağımsız değişkenler.",
  "clangd.trace": "clangd'nin chrome trace-viewer JSON biçiminde performans izi kaydedeceği dosyanın adı.",
  "clangd.fallbackFlags": "Derleme veritabanı bulunamadığında dosyaları ayrıştırmak için kullanılan ek clang bayrakları.",
  "clangd.restartAfterCrash": "clangd çökerse otomatik olarak (en fazla 4 kez) yeniden başlatın.",
  "clangd.checkUpdates": "Başlangıçta dil sunucusu güncellemelerini denetleyin.",
  "clangd.onConfigChangedForceEnable": "clangd sürümünden bağımsız olarak \"Yapılandırma Değiştiğinde\" seçeneğini zorla etkinleştirin.",
  "clangd.detectExtensionConflicts": "Çakışan uzantılar hakkında uyarın ve bunları devre dışı bırakmayı önerin.",
  "clangd.enableCodeCompletion": "Dil sunucusu tarafından sağlanan kod tamamlamayı etkinleştirin",
  "clangd.enableHover": "Dil sunucusu tarafından sağlanan üzerine gelme ipuçlarını etkinleştirin",

  // Codex (openai.chatgpt)
  "chatgpt.commentCodeLensEnabled": "Codex ile uygulamak için TODO yorumlarının üzerinde CodeLens'i etkinleştirin.",
  "chatgpt.cliExecutable": "YALNIZCA GELİŞTİRME: Codex CLI yürütülebilir dosyasının yolu. Codex CLI'yı etkin olarak geliştirmiyorsanız bunu ayarlamanıza gerek yoktur. El ile ayarlanırsa uzantının bazı kısımları beklendiği gibi çalışmayabilir.",
  "chatgpt.openOnStartup": "Uzantı başlatmayı tamamladığında Codex kenar çubuğuna odaklanın.",
  "chatgpt.followUpQueueMode": "Takip iletilerinin kuyruğa mı alınacağını yoksa geçerli çalıştırmayı mı yönlendireceğini denetleyin. Devam eden tek bir takip için tersini yapmak üzere Cmd/Ctrl+Shift+Enter tuşlarına basın.",
  "chatgpt.composerEnterBehavior": "Codex oluşturucusu için Enter tuşu davranışı.",
  "chatgpt.reviewDelivery": "Mümkün olduğunda geçerli sohbette satır içi /review başlatın veya ayrı bir inceleme sohbeti açın.",
  "chatgpt.localeOverride": "Codex kullanıcı arayüzü için tercih edilen dil. Otomatik algılama için boş bırakın.",
  "chatgpt.runCodexInWindowsSubsystemForLinux": "Yalnızca Windows: Linux için Windows Alt Sistemi (WSL) yüklendiğinde, Codex'i otomatik olarak WSL içinde çalıştırın. Gelişmiş korumalı alan güvenliği ve daha iyi performans için önerilir - Windows'ta Ajan modu şu anda WSL gerektirir. Bu ayarın değiştirilmesi, geçerli olması için VS Code'u yeniden yükler.",

  // Claude Code (anthropic.claude-code)
  "claudeCode.environmentVariables": "Claude başlatılırken ayarlanacak ortam değişkenleri.\n\nOrtam değişkenlerini mümkünse Claude'un settings.json dosyasında ayarlamayı tercih edin.\nBelgelere bakın: https://code.claude.com/docs/en/settings",
  "claudeCode.useTerminal": "Claude'u yerel kullanıcı arayüzü yerine terminalde başlatın.",
  "claudeCode.allowDangerouslySkipPermissions": "İzinleri atlama moduna izin verin. Yalnızca internet erişimi olmayan yalıtılmış alanlar (sandbox) için önerilir.",
  "claudeCode.claudeProcessWrapper": "Claude işlemini başlatmak için kullanılan yürütülebilir dosya yolu.",
  "claudeCode.respectGitIgnore": "Dosya aramaları yaparken .gitignore dosyalarını dikkate alın. İpucu: Bu devre dışı bırakıldığında .ignore içindeki diğer hariç tutma desenlerine göre filtreleme yapabilirsiniz.",
  "claudeCode.initialPermissionMode": "Yeni konuşmalar için başlangıç izin modu. Ayarlanmadığında oturum için Claude Code CLI'nın çözümlenen varsayılanına bırakılır. 'manual', kullanıcı arayüzünde Manuel olarak etiketlenen mod olan 'default' için bir takma addır; her zaman Manuel modda başlamak için ikisinden birini ayarlayın.",
  "claudeCode.disableLoginPrompt": "True olduğunda, uzantıda hiçbir zaman oturum açma/kimlik doğrulama istemi göstermeyin. Kimlik doğrulama harici olarak işlendiğinde kullanılır.",
  "claudeCode.autosave": "Claude dosyaları okumadan veya yazmadan önce dosyaları otomatik olarak kaydedin.",
  "claudeCode.focusView": "Odak görünümü: sohbetteki araç çağrılarını ve devam eden diğer etkinlikleri gizleyerek yalnızca istemlerinizi ve Claude'un yanıtlarını gösterin. Katlanmış etkinlik tek tık uzakta kalır ve canlı bir gösterge o anda çalışan aracı belirtir.",
  "claudeCode.useCtrlEnterToSend": "Etkinleştirildiğinde, istemleri yalnızca Enter yerine Ctrl/Cmd+Enter ile gönderin. Bu, Enter tuşunun yeni satır oluşturmasına olanak tanır.",
  "claudeCode.preferredLocation": "Claude'un varsayılan olarak açılacağı yer. Bu ayar, Claude'u yeni bir konumda açtığınızda otomatik olarak güncellenir.",
  "claudeCode.lockEditorGroups": "Claude sekmeleri için başlattığı düzenleyici gruplarını kilitleyin; böylece bir Claude sekmesi odaktayken açtığınız dosyalar yanına değil başka bir gruba gider.",
  "claudeCode.enableNewConversationShortcut": "Claude odaktayken yeni bir konuşma başlatmak için Cmd/Ctrl+N klavye kısayolunu kullanın.",
  "claudeCode.enableReopenClosedSessionShortcut": "En son kapatılan Claude oturum sekmesini yeniden açmak için Cmd/Ctrl+Shift+T kısayolunu kullanın.",
  "claudeCode.hideOnboarding": "Claude Code'daki ilk katılım kontrol listesini gizleyin.",
  "claudeCode.attachOpenFile": "Düzenleyicide açık olan dosyayı iletilerinize ekleyin ve ileti kutusunda gösterin. Kapalı olduğunda yalnızca seçtiğiniz metin eklenir.",
  "claudeCode.continueAfterReload": "Pencere yeniden yüklendikten sonra, geri yüklenen oturum kesintiye uğrayan adıma devam eder.",
  "claudeCode.scrollToBottomOnSend": "Bir ileti gönderdiğinizde konuşmayı en alta kaydırın. Kapalı olduğunda konuşma bıraktığınız yerde kalır.",
  "claudeCode.archiveInactiveSessions": "Etkinlik olmadan bu kadar süre geçtikten sonra bir oturumu arşivleyin. Açık, çalışan, girdi bekleyen veya okunmamış oturumlar hiçbir zaman otomatik olarak arşivlenmez.",
  "claudeCode.usePythonEnvironment": "Claude çalıştırılırken çalışma alanının Python ortamını otomatik olarak etkinleştirin. [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) uzantısını gerektirir.",

  // Pyrefly (meta.pyrefly)
  "pyrefly.lspPath": "Dil sunucusu için çalıştırılacak komut. Mutlak bir yol, çalışma alanı kökünüze göre göreceli bir yol, ~ ile başlayan bir yol veya $PATH'inizde aranacak yalın bir komut adı kabul eder.",
  "pyrefly.lspArguments": "pyrefly.lspPath konumundaki ikili dosyaya iletilmesi gereken ek bağımsız değişkenler",
  "python.pyrefly.disableLanguageServices": "True ise Pyrefly tamamlama, üzerine gelme ipucu, tanım vb. diğer IDE hizmetlerini sağlamaz.",
  "python.pyrefly.disableTypeErrors": "True ise Pyrefly bu çalışma alanındaki dosyalar için tanılama sağlamaz.",
  "python.pyrefly.typeCheckingMode": "Bir `pyrefly.toml` kapsamına girmeyen dosyalar için kullanılacak [Önayar](https://pyrefly.org/en/docs/configuration/#preset).",
  "python.pyrefly.displayTypeErrors": "'default' ise Pyrefly yalnızca dosyanız bir Pyrefly yapılandırması kapsamındaysa IDE'de tür denetimi dalgalı çizgileri sağlar. 'force-off' ise asla sağlamaz. 'force-on' ise her zaman sağlar.",
  "pyrefly.trace.server": "Konsolda LSP izini etkinleştirmek için 'verbose' olarak ayarlayın",
  "python.pyrefly.disabledLanguageServices": "Belirli dil hizmetlerini devre dışı bırakın. Devre dışı bırakmak için bağımsız hizmetleri true olarak ayarlayın.",
  "python.analysis.showHoverGoToLinks": "Üzerine gelme ipuçlarının 'Tanıma git' ve 'Tür tanımına git' gezinti bağlantılarını içerip içermeyeceğini denetler.",
  "python.analysis.completeFunctionParens": "Bir işlevi veya yöntemi tamamlarken otomatik olarak ayraç ekleyin.",
  "python.analysis.autoImportCompletions": "Tamamlamaların henüz içe aktarılmamış simgeleri içerip içermeyeceğini denetler. Etkinleştirildiğinde, böyle bir tamamlamayı kabul etmek gerekli içe aktarma ifadesini de ekler.",
  "python.analysis.diagnosticMode": "Tanılama analizinin kapsamını denetler. 'openFilesOnly' olarak ayarlandığında tanılama yalnızca açık dosyalar için sağlanır. 'workspace' olarak ayarlandığında tüm dosyalar için hesaplanır.",
  "python.analysis.importFormat": "Pyrefly otomatik olarak bir içe aktarma eklediğinde kullanılan biçim.",
  "python.analysis.inlayHints": "Pyrefly'nin hangi satır içi ipuçlarını görüntüleyeceğini denetler.",
  "python.analysis.inlayHintDebounceMs": "Satır içi ipuçları için milisaniye cinsinden gecikme süresi. İpuçlarını hemen güncellemek için 0 olarak ayarlayın.",
  "python.pyrefly.syncNotebooks": "True ise Pyrefly not defteri belgelerini dil sunucusuyla eşitler.",
  "python.pyrefly.runnableCodeLens": "Python dosyaları için Pyrefly'nin Çalıştır/Test Et CodeLens eylemlerini etkinleştirin.",
  "python.pyrefly.streamDiagnostics": "True (varsayılan) ise Pyrefly yeniden denetim sırasında kullanılabilir oldukça tanılamaları aktarır.",
  "python.pyrefly.diagnosticMode": "Pyrefly'nin tanılama analizinin kapsamını denetler.",
  "pyrefly.commentFoldingRanges": "Düzenleyicide açıklama bölümü katlama aralıklarının eklenip eklenmeyeceğini denetler.",
  "python.pyrefly.configPath": "Bir pyrefly.toml veya pyproject.toml yapılandırma dosyasının yolu.",

  // Google Cloud Data Agent Kit
  "google.datacloud.project": "Data-Cloud uzantısı için kullanılacak bir Google Cloud projesi girin.",
  "google.datacloud.enableTelemetry": "Google Cloud Data Agent Kit uzantısı için kullanım ve hata bildirimini etkinleştirin. Toplanan veriler [Google Gizlilik Politikası](https://policies.google.com/privacy) kapsamındadır.",
  "google.datacloud.starredProjects": "Yıldızlı proje kimliklerinin bir listesi.",
  "google.cloud.project": "Data-Cloud uzantısı için kullanılacak bir Google Cloud projesi girin.",
  "google.cloud.billingQuotaProject": "Faturalandırma ve kota amacıyla kullanılan Google Cloud projesi. Boşsa ana proje kullanılır.",
  "google.datacloud.gcloudPath": "Google Cloud CLI yürütülebilir dosyasının dosya sistemi yolu (örn. /usr/bin/gcloud).",
  "google.datacloud.composer.project": "Managed Service for Apache Airflow işlemleri için kullanılacak Google Cloud projesi.",
  "google.datacloud.composer.region": "Managed Service for Apache Airflow işlemleri için kullanılacak bölge.",
  "google.datacloud.composer.environment": "İşlemler için kullanılacak Managed Service for Apache Airflow ortamı.",
  "google.cloud.region": "Data-Cloud uzantısı için kullanılacak bir Google Cloud bölgesi girin.",
  "google.datacloud.agent.skills.installLocation": "Ajan becerilerinin genel olarak mı yoksa geçerli çalışma alanı içinde yerel olarak mı yükleneceğini seçin.",

  // Jupyter
  "jupyter.executionAnalysis.enabled": "Not defterlerinde yürütme analizini etkinleştirmeye yönelik deneysel özellik."
};

const titleTranslations = {
  "Antigravity Remote - Dev Containers": "Antigravity Uzak - Geliştirme Kapsayıcıları",
  "Antigravity Remote - SSH": "Antigravity Uzak - SSH",
  "JavaScript Debugger": "JavaScript Hata Ayıklayıcısı",
  "Python Debugger": "Python Hata Ayıklayıcısı",
  "Media Previewer": "Medya Önizleyici",
  "Mermaid Chat Features": "Mermaid Sohbet Özellikleri",
  "Markdown Math": "Markdown Matematik",
  "Simple Browser": "Basit Tarayıcı"
};

const enumTranslations = {
  "clangd.onConfigChanged": [
    "Sunucuyu yeniden başlatmak için kullanıcıya sor",
    "Sunucuyu otomatik olarak yeniden başlat",
    "Hiçbir şey yapma"
  ],
  "claudeCode.preferredLocation": [
    "Kenar Çubuğu (Sağ)",
    "Panel (Yeni Sekme)"
  ]
};

/**
 * Belirtilen dizinlerdeki tüm eklentilerin package.json dosyalarını tarar ve
 * ayar açıklamalarını, enumarasyon açıklamalarını ve başlıklarını Türkçeleştirir.
 */
function patchAllExtensions(paths) {
  const searchBases = [
    paths.ide?.appPath ? path.join(paths.ide.appPath, 'resources', 'app', 'extensions') : null,
    paths.ide?.extensionsDir,
    path.join(process.env.USERPROFILE || 'C:\\Users\\Work-D', '.vscode', 'extensions')
  ].filter(Boolean);

  let patchedCount = 0;

  for (const base of searchBases) {
    if (!fs.existsSync(base)) continue;
    try {
      const dirs = fs.readdirSync(base);
      for (const d of dirs) {
        const pkgPath = path.join(base, d, 'package.json');
        if (fs.existsSync(pkgPath)) {
          try {
            const content = fs.readFileSync(pkgPath, 'utf8');
            let pkg;
            try { pkg = JSON.parse(content); } catch (e) { continue; }
            let modified = false;

            // 1. Display name
            if (pkg.displayName && titleTranslations[pkg.displayName]) {
              pkg.displayName = titleTranslations[pkg.displayName];
              modified = true;
            }

            // 2. Configuration title & properties
            const configs = pkg.contributes?.configuration;
            const list = Array.isArray(configs) ? configs : (configs ? [configs] : []);
            for (const c of list) {
              if (c.title && titleTranslations[c.title]) {
                c.title = titleTranslations[c.title];
                modified = true;
              }
              const props = c.properties || {};
              for (const [k, v] of Object.entries(props)) {
                if (propertyTranslations[k]) {
                  if (v.description) v.description = propertyTranslations[k];
                  if (v.markdownDescription) v.markdownDescription = propertyTranslations[k];
                  modified = true;
                }
                if (enumTranslations[k] && v.enumDescriptions) {
                  v.enumDescriptions = enumTranslations[k];
                  modified = true;
                }
              }
            }

            if (modified) {
              try { fs.chmodSync(pkgPath, 0o666); } catch (e) {}
              const isFormatted = content.includes('\n  ') || content.includes('\n\t');
              fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, isFormatted ? 2 : undefined), 'utf8');
              patchedCount++;
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  return patchedCount;
}

module.exports = {
  propertyTranslations,
  titleTranslations,
  enumTranslations,
  patchAllExtensions
};
