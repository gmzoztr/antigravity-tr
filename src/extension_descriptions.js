/**
 * Antigravity eklentilerinin package.json dosyalarında yer alan İngilizce ayar açıklamalarını,
 * seçeneklerini (enumItemLabels, enumDescriptions), NLS yerelleştirme şablonlarını (%key%)
 * doğrudan Türkçe metinlerle çözen ve kategori başlıklarını eksiksiz Türkçeleştiren akıllı modül.
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

  // Go (golang.go)
  "go.showWelcome": "İlk kurulumda Hoş Geldiniz deneyiminin gösterilip gösterilmeyeceğini belirtir",
  "go.buildOnSave": "'go build' veya 'go test -c' kullanarak dosya kaydedildiğinde kodu derler. Dil sunucusu kullanılırken geçerli değildir.",
  "go.buildFlags": "Kaydederken derleme veya test çalıştırma sırasında kullanılan 'go build'/'go test' bayrakları.",
  "go.buildTags": "'-tags' bağımsız değişkenini destekleyen tüm komutlar için kullanılacak Go derleme etiketleri.",
  "go.testTags": "Testler çalıştırılırken kullanılacak Go derleme etiketleri. Boşsa buildTags kullanılır.",
  "go.disableConcurrentTests": "True ise, testler eşzamanlı çalışmaz. Yeni bir test çalışması başlatıldığında önceki iptal edilir.",
  "go.installDependenciesWhenBuilding": "True ise, kod her derlendiğinde 'go build' komutuna '-i' bayrağı iletilir.",
  "go.lintOnSave": "Yapılandırılan Lint aracını kullanarak dosya kaydedildiğinde kodu denetler.",
  "go.lintTool": "Go uzantısı tarafından çalıştırılması gereken ek bir istemci tarafı linting aracı belirtir.",
  "go.lintFlags": "Lint aracına iletilecek bayraklar (örn. ['-min_confidence=.8']).",
  "go.vetOnSave": "'go tool vet' kullanarak dosya kaydedildiğinde kodu denetler.",
  "go.vetFlags": "'go tool vet' komutuna iletilecek bayraklar.",
  "go.formatTool": "Biçimlendirme için kullanılacak araç.",
  "go.formatFlags": "Biçimlendirme aracına iletilecek bayraklar.",
  "go.inferGopath": "GOPATH'i çalışma alanı kökünden çıkarsayın. Go Modülleri kullanılırken yoksayılır.",
  "go.gopath": "Ortam değişkeni olarak ayarlanan GOPATH'i geçersiz kılmak için buraya belirtin.",
  "go.toolsGopath": "Go araçlarının yükleneceği konum.",
  "go.goroot": "Ortam değişkeni ayarlanmadığında kullanılacak GOROOT'u belirtir.",
  "go.testOnSave": "Geçerli paket için kaydetme sırasında 'go test' çalıştırın.",
  "go.coverOnSave": "True ise, kaydetme sırasında 'go test -coverprofile' çalıştırır ve test kapsamını gösterir.",
  "go.coverMode": "Kod kapsamı oluşturulurken -covermode değeri.",
  "go.coverageOptions": "Yalnızca kapsanan, yalnızca kapsanmayan veya her iki kodun da gösterilip gösterilmeyeceğini denetler.",
  "go.testTimeout": "ParseDuration biçiminde go test için zaman aşımını belirtir.",
  "go.testExplorer.enable": "Go test gezginini etkinleştirin.",
  "go.testExplorer.packageDisplayMode": "Paketleri test gezgininde düz veya iç içe sunun.",
  "go.useLanguageServer": "Go dili için intellisense, kod gezintisi, yeniden düzenleme ve tanılamayı etkinleştirin.",
  "go.toolsManagement.checkForUpdates": "Go araçları için güncellemelerin nasıl denetleneceğini belirtir.",
  "go.toolsManagement.autoUpdate": "Kullanıcıya sormadan uzantı tarafından kullanılan araçları otomatik olarak güncelleyin.",

  // Claude Code (anthropic.claude-code)
  "claudeCode.showMessageTimestamps": "Her iletinin ne zaman gönderildiğini gösterin. Günün değiştiği yerde bir tarih çizgisi işaretlenir.",

  // Go (golang.go)
  "go.coverOnTestPackage": "True ise, Go: Test Paketi komutu çalıştırıldığında test kapsamını gösterir.",
  "go.coverOnSingleTest": "True ise, Go: İmleçteki Fonksiyonu Test Et komutu çalıştırıldığında test kapsamını gösterir.",
  "go.coverOnSingleTestFile": "True ise, Go: Tek Dosyayı Test Et komutu çalıştırıldığında test kapsamını gösterir.",
  "go.coverShowCounts": "Kod kapsamı oluşturulurken sayıların --374-- şeklinde gösterilip gösterilmeyeceğini belirler.",
  "go.coverageDecorator": "Bu seçenek, kod kapsamını görüntüleme biçimini seçmenizi sağlar. Satırın tamamını vurgulamayı veya kenar boşluğunda bir gösterge görüntülemeyi seçin. Satır vurgulama için renkleri ve kenarlıkları, kenar boşluğu için stili özelleştirebilirsiniz.",
  "go.testEnvVars": "Go testlerini çalıştıran işleme iletilecek ortam değişkenleri.",
  "go.testEnvFile": "Ortam değişkeni tanımlarını içeren bir dosyanın mutlak yolu. Dosya içeriği anahtar=değer biçiminde olmalıdır.",
  "go.testFlags": "`go test` komutuna iletilecek bayraklar. Boşsa buildFlags kullanılır. Bu, dil sunucusuna iletilmez.",
  "go.testExplorer.alwaysRunBenchmarks": "Bir dosya veya klasördeki tüm testleri çalıştırırken performans ölçümlerini (benchmark) de çalıştırın.",
  "go.testExplorer.concatenateMessages": "Belirli bir konum için tüm test günlüğü iletilerini tek bir iletide birleştirin.",
  "go.testExplorer.showDynamicSubtestsInEditor": "Dinamik olarak keşfedilen alt testlerin kaynak konumunu kapsayan işlevin konumuna ayarlayın. Sonuç olarak dinamik alt testler, kapsayan işlevin kenar boşluğu test pencere öğesine eklenir.",
  "go.testExplorer.showOutput": "Bir test çalıştırması başlatıldığında test çıktısı terminalini açın.",
  "go.experiments": "Deneysel özellikleri devre dışı bırakın. Bu özellikler yalnızca yayın öncesi (pre-release) sürümde mevcuttur.",
  "go.generateTestsFlags": "Test oluşturmak için `gotests` aracına iletilecek ek komut satırı bayrakları.",
  "go.toolsEnvVars": "Go araçlarını çalıştıran araçlara (örn. CGO_CFLAGS) ve Delve tarafından başlatılan hata ayıklanan işleme iletilecek ortam değişkenleri. Dize anahtar:değer çiftleri olarak biçimlendirin. Hata ayıklarken `env` > `envFile` > `go.toolsEnvVars` önceliğiyle `envFile` ve `env` değerleriyle birleştirilir.",
  "go.languageServerFlags": "Dil sunucusunu çalıştırırken kullanılacak -rpc.trace ve -logfile gibi bayraklar.",
  "go.trace.server": "VS Code ile Go dil sunucusu arasındaki iletişimi izleyin.",
  "go.toolsManagement.go": "Go araçlarını yüklemek için kullanılan `go` ikili dosyasının yolu. Boşsa, araç yükleme için proje için seçilen aynı `go` ikili dosyası kullanılır.",
  "go.enableCodeLens": "Başvurular için CodeLens'i ve çalıştırma/hata ayıklama testlerini etkinleştirmek/devre dışı bırakmak için özellik düzeyi ayarı.",
  "go.addTags": "Burada yapılandırılan etiketler ve seçenekler, yapı (struct) alanlarına etiket eklemek için Etiket Ekle komutu tarafından kullanılır. promptForTags true ise kullanıcıdan etiketler ve seçenekler istenir. Varsayılan olarak json etiketleri eklenir.",
  "go.removeTags": "Burada yapılandırılan etiketler ve seçenekler, yapı alanlarından etiketleri kaldırmak için Etiketleri Kaldır komutu tarafından kullanılır. promptForTags true ise kullanıcıdan etiketler ve seçenekler istenir. Varsayılan olarak tüm etiketler ve seçenekler kaldırılır.",
  "go.playground": "Burada yapılandırılan bayraklar `goplay` komutuna iletilir.",
  "go.survey.prompt": "gopls anketi ve Go geliştirici anketi dahil olmak üzere anketler için bildirimde bulunun.",
  "go.editorContextMenuCommands": "Deneysel Özellik: Düzenleyicideki bağlam menüsünden girdileri etkinleştirin veya devre dışı bırakın.",
  "go.delveConfig": "Tüm hata ayıklama oturumlarına uygulanan Delve ayarları. launch.json dosyasındaki hata ayıklama yapılandırması bu değerleri geçersiz kılar.",
  "go.alternateTools": "Go uzantısı tarafından kullanılan aynı araçlar için alternatif araçlar veya alternatif yollar. GOPATH/bin, GOROOT/bin veya PATH içindeki mutlak yolu veya ikili dosyanın adını belirtin. Go araçları için sarmalayıcı komut dosyası kullanmak istediğinizde kullanışlıdır.",
  "go.tasks.provideDefault": "Varsayılan go build/test görev sağlayıcısını etkinleştirin.",
  "go.terminal.activateEnvironment": "Uzantı tarafından kullanılan Go & PATH ortam değişkenlerini tüm tümleşik terminallere uygulayın.",
  "gopls": "Varsayılan Go dil sunucusunu ('gopls') yapılandırın. Çoğu durumda bu bölümü yapılandırmak gereksizdir. Kullanılabilir tüm ayarlar için belgelere bakın.",
  "go.inlayHints.assignVariableTypes": "`\"assignVariableTypes\"` atama ifadelerindeki değişken türleri için satır içi ipuçlarını denetler.",
  "go.inlayHints.compositeLiteralFields": "`\"compositeLiteralFields\"` bileşik hazır bilgi alan adları için satır içi ipuçlarını denetler.",
  "go.inlayHints.compositeLiteralTypes": "`\"compositeLiteralTypes\"` bileşik hazır bilgi türleri için satır içi ipuçlarını denetler.",
  "go.inlayHints.constantValues": "`\"constantValues\"` sabit değerler için satır içi ipuçlarını denetler.",
  "go.inlayHints.functionTypeParameters": "`\"functionTypeParameters\"` genel işlevlerdeki örtük tür parametreleri için satır içi ipuçlarını denetler.",
  "go.inlayHints.parameterNames": "`\"parameterNames\"` parametre adları için satır içi ipuçlarını denetler.",
  "go.inlayHints.rangeVariableTypes": "`\"rangeVariableTypes\"` aralık (range) döngü ifadelerindeki değişken türleri için satır içi ipuçlarını denetler.",
  "go.inlayHints.ignoredError": "`\"ignoredError\"` örtük olarak yok sayılan hatalar için satır içi ipuçlarını denetler.",

  // Google Cloud Data Agent Kit
  "google.datacloud.expandMenus": "Ağaç görünümü öğelerini varsayılan olarak genişletin.",
  "google.datacloud.recentProjectsEnabled": "Proje değiştiricide son projeleri etkinleştirin.",
  "google.datacloud.agent.skills.autoUpdate": "Etkinleştirildiğinde, beceriler otomatik olarak güncellenir.",
  "google.datacloud.spark.notebooks.inCellMonitoringEnabled": "Hücre içi izlemeyi etkinleştirin.",
  "google.datacloud.executeCellToolForNotebookMCP": "Notebook MCP için execute_cell aracını etkinleştirin. Değişiklikten sonra IDE'nin yeniden başlatılması gerekir.",
  "google.datacloud.executeCellToolConsent": "execute_cell aracıyla hücreleri çalıştırmadan önce açık kullanıcı onayı istemini etkinleştirin.",

  // Ruby LSP (shopify.ruby-lsp)
  "rubyLsp.addonSettings": "Ruby LSP eklentilerinin davranışını yapılandırmak üzere iletilecek ayarlar. Anahtarlar eklenti adları, değerler ayar nesneleridir.",
  "rubyLsp.customRubyCommand": "Doğru Ruby sürümünü etkinleştirmek veya PATH ortam değişkenine özel bir Ruby bin klasörü eklemek için bir kabuk komutu. Yalnızca rubyVersionManager 'custom' olarak ayarlandığında kullanılır.",
  "rubyLsp.bundleGemfile": "Ruby LSP sunucusunu paketlemek için kullanılacak Gemfile dosyasının göreceli veya mutlak yolu. Bir monorepo üzerinde çalışıyorsanız veya projenizin Gemfile'ı bir alt dizindeyse bunu kullanmayın (bunun yerine çok köklü çalışma alanlarını inceleyin). Yalnızca Ruby LSP için ayrı bir Gemfile kullanırken gereklidir.",
  "rubyLsp.useBundlerCompose": "Bu, test amaçlı geçici bir ayardır, kullanmayın! Bileşik paket mantığını bundler-compose ile değiştirir.",
  "rubyLsp.bypassTypechecker": "Projenin bir tür denetleyici kullanıp kullanmadığını yoksayar. Yalnızca Ruby LSP'nin kendisi üzerinde çalışırken kullanılmak üzere tasarlanmıştır.",
  "rubyLsp.indexing": "Dizin oluşturma yapılandırmaları. Bunların değiştirilmesi, tanım, tamamlama ve diğer özellikler için hangi bildirimlerin kullanılabilir olduğunu etkiler.",

  // JavaScript Debug (ms-vscode.js-debug)
  "debug.javascript.terminalOptions": "JavaScript hata ayıklama terminali ve npm komut dosyaları için varsayılan başlatma seçenekleri.",
  "debug.javascript.automaticallyTunnelRemoteServer": "Uzak bir web uygulamasında hata ayıklarken, uzak sunucunun yerel makinenize otomatik olarak tünellenip tünellenmeyeceğini yapılandırır.",
  "debug.javascript.debugByLinkOptions": "Hata ayıklama terminalinin içinden tıklanan açık bağlantılarda hata ayıklanırken kullanılan seçenekler. Bu davranışı devre dışı bırakmak için \"false\" olarak ayarlanabilir.",

  // Jupyter
  "jupyter.executionAnalysis.enabled": "Not defterlerinde yürütme analizini etkinleştirmeye yönelik deneysel özellik.",

  // Diğer Yerleşik Eklentiler
  "github-authentication.preferDeviceCodeFlow": "OAuth yerine cihaz kodu akışını tercih edin.",
  "html.suggest.hideEndTagSuggestions": "Kapanış etiketi önerilerinin gizlenip gizlenmeyeceğini yapılandırır.",
  "mermaid-chat.enabled": "Mermaid sohbet özelliklerini etkinleştirin.",
  "typescript.implementationsCodeLens.showOnAllClassMethods": "Yalnızca arabirimleri uygulayan yöntemler yerine tüm sınıf yöntemlerinde uygulamalar CodeLens'ini gösterin."
};

/**
 * Açılır menülerde (enum dropdown) İngilizce ham anahtarlar yerine gösterilecek Türkçe etiketler.
 */
const enumItemLabelsMap = {
  // Claude Code
  "claudeCode.initialPermissionMode": [
    "Varsayılan",
    "Manuel",
    "Düzenlemeleri Kabul Et",
    "Plan",
    "İzinleri Atla"
  ],
  "claudeCode.preferredLocation": [
    "Kenar Çubuğu (Sağ)",
    "Panel (Yeni Sekme)"
  ],
  "claudeCode.archiveInactiveSessions": [
    "Asla",
    "1 gün",
    "2 gün",
    "7 gün",
    "14 gün"
  ],

  // Codex (openai.chatgpt)
  "chatgpt.followUpQueueMode": [
    "Kuyruğa Al",
    "Yönlendir",
    "Kes"
  ],
  "chatgpt.composerEnterBehavior": [
    "Enter",
    "Çok Satırlıysa Cmd/Ctrl+Enter",
    "Her Zaman Cmd/Ctrl+Enter"
  ],
  "chatgpt.reviewDelivery": [
    "Satır İçi",
    "Ayrı Pencere"
  ],

  // Google Cloud Data Agent Kit
  "google.datacloud.agent.skills.installLocation": [
    "Genel (Global)",
    "Çalışma Alanı (Workspace)"
  ],

  // Clangd
  "clangd.onConfigChanged": [
    "Kullanıcıya Sor",
    "Yeniden Başlat",
    "Yoksay"
  ],

  // Pyrefly (meta.pyrefly)
  "python.pyrefly.typeCheckingMode": [
    "Otomatik",
    "Kapalı",
    "Temel",
    "Eski",
    "Varsayılan",
    "Katı",
    "Tümü"
  ],
  "python.pyrefly.displayTypeErrors": [
    "Varsayılan",
    "Her Zaman Göster",
    "Asla Gösterme",
    "Eksik İçe Aktarmalarda Hata"
  ],
  "pyrefly.trace.server": [
    "Kapalı",
    "Ayrıntılı"
  ],
  "python.analysis.diagnosticMode": [
    "Yalnızca Açık Dosyalar",
    "Çalışma Alanı"
  ],
  "python.analysis.importFormat": [
    "Mutlak",
    "Göreceli"
  ],
  "python.pyrefly.diagnosticMode": [
    "Yalnızca Açık Dosyalar",
    "Çalışma Alanı"
  ],

  // Python (ms-python.python)
  "python.createEnvironment.contentButton": [
    "Göster",
    "Gizle"
  ],
  "python.createEnvironment.trigger": [
    "Kapalı",
    "Kullanıcıya Sor"
  ],
  "python.languageServer": [
    "Varsayılan",
    "Jedi",
    "Pylance",
    "Hiçbiri"
  ],
  "python.interpreter.infoVisibility": [
    "Asla",
    "Python ile İlgili Dosyalarda",
    "Her Zaman"
  ],
  "python.logging.level": [
    "Hata Ayıklama",
    "Hata",
    "Bilgi",
    "Kapalı",
    "Uyarı"
  ],
  "python.missingPackage.severity": [
    "Hata",
    "İpucu",
    "Bilgi",
    "Uyarı"
  ],
  "python.locator": [
    "JavaScript",
    "Yerel (Native)"
  ],

  // Python Envs (ms-python.vscode-python-envs)
  "python-envs.terminal.autoActivationType": [
    "Komut",
    "Kabuk Başlatma",
    "Kapalı"
  ],

  // Jupyter (ms-toolsai.jupyter)
  "jupyter.logging.level": [
    "Kapalı",
    "Hata",
    "Uyarı",
    "Bilgi",
    "Hata Ayıklama",
    "İzleme"
  ],
  "jupyter.interactiveWindow.cellMarker.decorateCells": [
    "Geçerli Hücre",
    "Tüm Hücreler",
    "Hiçbiri"
  ],
  "jupyter.interactiveWindow.creationMode": [
    "Dosya Başına",
    "Tek",
    "Çoklu"
  ],
  "jupyter.interactiveWindow.viewColumn": [
    "Yanda",
    "Etkin",
    "İkinci Grup"
  ],
  "jupyter.pythonExportMethod": [
    "Doğrudan",
    "Sihirleri Yorum Satırı Yap",
    "nbconvert"
  ],

  // Go (golang.go)
  "go.buildOnSave": [
    "Paket",
    "Çalışma Alanı",
    "Kapalı"
  ],
  "go.lintOnSave": [
    "Dosya",
    "Paket",
    "Çalışma Alanı",
    "Kapalı"
  ],
  "go.lintTool": [
    "staticcheck",
    "golint",
    "golangci-lint",
    "golangci-lint-v2",
    "revive"
  ],
  "go.vetOnSave": [
    "Paket",
    "Çalışma Alanı",
    "Kapalı"
  ],
  "go.formatTool": [
    "Varsayılan",
    "gofmt",
    "goimports",
    "goformat",
    "gofumpt",
    "Özel"
  ],
  "go.coverMode": [
    "Varsayılan",
    "Ayarla (Set)",
    "Sayım (Count)",
    "Atomik (Atomic)"
  ],
  "go.coverageOptions": [
    "Yalnızca Kapsanan Kodu Göster",
    "Yalnızca Kapsanmayan Kodu Göster",
    "Her İkisini de Göster"
  ],
  "go.testExplorer.packageDisplayMode": [
    "Düz",
    "İç İçe"
  ],
  "go.trace.server": [
    "Kapalı",
    "İletiler",
    "Ayrıntılı"
  ],
  "go.toolsManagement.checkForUpdates": [
    "Proxy",
    "Yerel",
    "Kapalı"
  ],
  "go.diagnostic.vulncheck": [
    "İçe Aktarmalar",
    "Kapalı",
    "Kullanıcıya Sor"
  ],

  // Ruby LSP (shopify.ruby-lsp)
  "rubyLsp.formatter": [
    "Otomatik",
    "RuboCop",
    "Dahili RuboCop",
    "Syntax Tree",
    "Standard",
    "rubyfmt",
    "Hiçbiri"
  ],
  "rubyLsp.pullDiagnosticsOn": [
    "Değişiklikte",
    "Kaydetmede",
    "Her İkisinde de"
  ]
};

const enumDescriptionsMap = {
  "clangd.onConfigChanged": [
    "Sunucuyu yeniden başlatmak için kullanıcıya sor",
    "Sunucuyu otomatik olarak yeniden başlat",
    "Hiçbir şey yapma"
  ],
  "claudeCode.initialPermissionMode": [
    "Oturum için Claude Code CLI varsayılanını kullan",
    "Her eylem için onay iste",
    "Dosya düzenlemelerini otomatik olarak kabul et",
    "Yalnızca planlama yap, değişiklik uygulama",
    "Tüm izin istemlerini atla"
  ],
  "claudeCode.preferredLocation": [
    "Claude'u sağ kenar çubuğunda aç",
    "Claude'u ana panel sekmesinde aç"
  ]
};

const titleTranslations = {
  "Antigravity Remote - Dev Containers": "Antigravity Uzak - Geliştirme Kapsayıcıları",
  "Antigravity Remote - SSH": "Antigravity Uzak - SSH",
  "JavaScript Debugger": "JavaScript Hata Ayıklayıcısı",
  "Python Debugger": "Python Hata Ayıklayıcısı",
  "Media Previewer": "Medya Önizleyici",
  "Mermaid Chat Features": "Mermaid Sohbet Özellikleri",
  "Markdown Math": "Markdown Matematik",
  "Simple Browser": "Basit Tarayıcı",
  "Claude Code": "Claude Code",
  "Codex Settings": "Codex Ayarları",
  "Go": "Go",
  "Ruby LSP": "Ruby LSP",
  "Jupyter": "Jupyter",
  "Python": "Python"
};

/**
 * Bir uzantı için geçerli NLS Türkçe sözlüğünü yükler.
 */
function getExtensionNlsMap(extFullPath, extName) {
  const dataDir = path.join(__dirname, 'data');
  const lowerName = extName.toLowerCase();

  if (lowerName.includes('ms-toolsai.jupyter')) {
    const f = path.join(dataDir, 'jupyter.nls.tr.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  if (lowerName.includes('ms-python.python-')) {
    const f = path.join(dataDir, 'python.nls.tr.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  if (lowerName.includes('ms-python.vscode-python-envs')) {
    const f = path.join(dataDir, 'python-envs.nls.tr.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  }
  if (lowerName.includes('ms-python.debugpy')) {
    const f = path.join(dataDir, 'debugpy.nls.tr.json');
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  }

  // Yerleşik eklentiler için dil paketi dosyasını kontrol et
  const userProfile = process.env.USERPROFILE || 'C:\\Users\\Work-D';
  const langBases = [
    path.join(userProfile, '.antigravity-ide', 'extensions', 'ms-ceintl.vscode-language-pack-tr-1.106.0-universal', 'translations', 'extensions'),
    path.join(userProfile, '.vscode', 'extensions', 'ms-ceintl.vscode-language-pack-tr-1.106.0-universal', 'translations', 'extensions')
  ];

  for (const lb of langBases) {
    if (!fs.existsSync(lb)) continue;
    const candidates = [
      `vscode.${extName}.i18n.json`,
      `${extName}.i18n.json`,
      `vscode.${extName.replace(/^vscode\./, '')}.i18n.json`
    ];
    for (const c of candidates) {
      const p = path.join(lb, c);
      if (fs.existsSync(p)) {
        try {
          const d = JSON.parse(fs.readFileSync(p, 'utf8'));
          return d.contents?.package || null;
        } catch (e) {}
      }
    }
  }

  return null;
}

/**
 * Değerdeki %nlsKey% şablonunu NLS haritasındaki Türkçe karşılığıyla çözer.
 */
function resolveNls(val, nlsMap) {
  if (typeof val !== 'string') return val;
  if (val.startsWith('%') && val.endsWith('%')) {
    const key = val.slice(1, -1);
    if (nlsMap && nlsMap[key]) {
      return nlsMap[key];
    }
  }
  return val;
}

/**
 * NLS (Yerelleştirme) dosyalarını Antigravity IDE'ye kusursuzca entegre eder.
 * Hem package.nls.tr.json dosyasını yazar hem de garanti fallback için package.nls.json'ı günceller.
 */
function syncExtensionNls(extPath, nlsMap) {
  if (!nlsMap) return false;

  try {
    // 1. package.nls.tr.json oluştur / güncelle
    const trFile = path.join(extPath, 'package.nls.tr.json');
    try { fs.chmodSync(trFile, 0o666); } catch (e) {}
    fs.writeFileSync(trFile, JSON.stringify(nlsMap, null, 2), 'utf8');

    // 2. package.nls.json dosyasına da Türkçe çevirileri merge et (garanti fallback!)
    const enFile = path.join(extPath, 'package.nls.json');
    if (fs.existsSync(enFile)) {
      try {
        try { fs.chmodSync(enFile, 0o666); } catch (e) {}
        let enData = {};
        try { enData = JSON.parse(fs.readFileSync(enFile, 'utf8')); } catch (e) {}
        const merged = { ...enData, ...nlsMap };
        fs.writeFileSync(enFile, JSON.stringify(merged, null, 2), 'utf8');
      } catch (e) {}
    }

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Belirtilen dizinlerdeki tüm eklentilerin package.json dosyalarını tarar ve
 * ayar açıklamalarını, enumarasyon etiketlerini (enumItemLabels), enumarasyon açıklamalarını
 * ve NLS şablonlarını doğrudan Türkçe metinlerle çözer.
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
        const extFullPath = path.join(base, d);
        if (!fs.statSync(extFullPath).isDirectory()) continue;

        // 1. NLS sözlüğünü al
        const nlsMap = getExtensionNlsMap(extFullPath, d);

        // 2. NLS dosyalarını senkronize et
        if (nlsMap) {
          syncExtensionNls(extFullPath, nlsMap);
        }

        // 3. package.json dosyasını DOĞRUDAN çöz ve güncelle
        const pkgPath = path.join(extFullPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
          try {
            const content = fs.readFileSync(pkgPath, 'utf8');
            let pkg;
            try { pkg = JSON.parse(content); } catch (e) { continue; }
            let modified = false;

            // Display name
            if (pkg.displayName) {
              const resolvedDisplayName = resolveNls(pkg.displayName, nlsMap);
              if (resolvedDisplayName !== pkg.displayName) {
                pkg.displayName = resolvedDisplayName;
                modified = true;
              } else if (titleTranslations[pkg.displayName]) {
                pkg.displayName = titleTranslations[pkg.displayName];
                modified = true;
              }
            }

            // Description of extension
            if (pkg.description && nlsMap) {
              const resolvedDesc = resolveNls(pkg.description, nlsMap);
              if (resolvedDesc !== pkg.description) {
                pkg.description = resolvedDesc;
                modified = true;
              }
            }

            // Configuration title & properties
            const configs = pkg.contributes?.configuration;
            const list = Array.isArray(configs) ? configs : (configs ? [configs] : []);
            for (const c of list) {
              if (c.title) {
                const resolvedTitle = resolveNls(c.title, nlsMap);
                if (resolvedTitle !== c.title) {
                  c.title = resolvedTitle;
                  modified = true;
                } else if (titleTranslations[c.title]) {
                  c.title = titleTranslations[c.title];
                  modified = true;
                }
              }

              const props = c.properties || {};
              for (const [k, v] of Object.entries(props)) {
                // Doğrudan tanımlı açıklama çevirisi
                if (propertyTranslations[k]) {
                  v.description = propertyTranslations[k];
                  if (v.markdownDescription) v.markdownDescription = propertyTranslations[k];
                  modified = true;
                } else if (nlsMap) {
                  // NLS şablonu çözümü (%key%)
                  if (typeof v.description === 'string' && v.description.startsWith('%') && v.description.endsWith('%')) {
                    const resolved = resolveNls(v.description, nlsMap);
                    if (resolved !== v.description) {
                      v.description = resolved;
                      modified = true;
                    }
                  }
                  if (typeof v.markdownDescription === 'string' && v.markdownDescription.startsWith('%') && v.markdownDescription.endsWith('%')) {
                    const resolved = resolveNls(v.markdownDescription, nlsMap);
                    if (resolved !== v.markdownDescription) {
                      v.markdownDescription = resolved;
                      modified = true;
                    }
                  }
                }

                // Açılır menü etiketleri (enumItemLabels)
                if (enumItemLabelsMap[k]) {
                  v.enumItemLabels = enumItemLabelsMap[k];
                  modified = true;
                }

                // Enum açıklamaları (enumDescriptions)
                if (enumDescriptionsMap[k]) {
                  v.enumDescriptions = enumDescriptionsMap[k];
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
  enumItemLabelsMap,
  enumDescriptionsMap,
  titleTranslations,
  getExtensionNlsMap,
  resolveNls,
  syncExtensionNls,
  patchAllExtensions
};
