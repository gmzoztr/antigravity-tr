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
    "Open IDE": "IDE'yi Aç",
    "Antigravity": "Antigravity",
    "File": "Dosya",
    "View": "Görünüm",
    "Window": "Pencere",
    "Help": "Yardım",
    "New Conversation": "Yeni Konuşma",
    "Conversation History": "Konuşma Geçmişi",
    "Scheduled Tasks": "Zamanlanmış Görevler",
    "Pinned Conversations": "Sabitlenmiş Konuşmalar",
    "Projects": "Projeler",
    "Conversations": "Konuşmalar",
    "Settings": "Ayarlar",
    "Shortcuts": "Kısayollar",
    "Provide Feedback": "Geri Bildirimde Bulun",
    "No Project": "Proje Yok",
    "Select project, current: No Project": "Proje seçin, geçerli: Proje Yok",
    "Create New Project": "Yeni Proje Oluştur",
    "Display Options": "Görünüm Seçenekleri",
    "Sidebar": "Kenar Çubuğu",
    "Toggle Sidebar": "Kenar Çubuğunu Aç/Kapat",
    "Go Back": "Geri Git",
    "Go Forward": "İleri Git",
    "Notifications": "Bildirimler",
    "More options": "Daha fazla seçenek",
    "More actions": "Daha fazla işlem",
    "Pin conversation": "Konuşmayı sabitle",
    "Unpin conversation": "Konuşmayı sabitlemeden kaldır",
    "Archive conversation": "Konuşmayı arşivle",
    "Stop execution": "Yürütmeyi durdur",
    "Message input": "İleti girişi",
    "Add context": "Bağlam ekle",
    "Record voice memo": "Ses kaydı yap",
    "Send message": "İleti gönder",
    "Typeahead menu": "Otomatik tamamlama menüsü",
    "Select model": "Model seç",
    "General": "Genel",
    "Application": "Uygulama",
    "Appearance": "Görünüm",
    "Models": "Modeller",
    "Customizations": "Özelleştirmeler",
    "Browser": "Tarayıcı",
    "Not In Project": "Proje Dışı",
    "Not in Project": "Proje Dışı",
    "Configure agent execution, queued message delivery, and permissions.": "Ajan yürütmesini, kuyruktaki ileti teslimini ve izinleri yapılandırın.",
    "Execution": "Yürütme",
    "Queued Messages": "Kuyruktaki İletiler",
    "Configure when follow-up messages are sent.": "Takip iletilerinin ne zaman gönderileceğini yapılandırın.",
    "Queue": "Kuyruğa Ekle",
    "Send Immediately": "Hemen Gönder",
    "Queue until after the current turn.": "Mevcut tur bitene kadar kuyrukta beklet.",
    "Interrupt the agent and send immediately.": "Ajanı durdur ve hemen gönder.",
    "Keyboard shortcuts": "Klavye kısayolları",
    "Genel İzinler": "Genel İzinler",
    "Global Permissions": "Genel İzinler",
    "Güvenlik Önayarı": "Güvenlik Önayarı",
    "Security Preset": "Güvenlik Önayarı",
    "Controls the actions the agent can take.": "Ajanın gerçekleştirebileceği eylemleri denetler.",
    "Modified in Outside of Project": "Proje Dışı alanında değiştirildi",
    "Modified in": "Şurada değiştirildi:",
    "Outside of Project": "Proje Dışı",
    "Learn more about Turbo mode": "Turbo mod hakkında daha fazla bilgi edinin",
    "Learn more about": "Hakkında daha fazla bilgi edinin:",
    "Turbo mode": "Turbo mod",
    "Turbo Mode": "Turbo Mod",
    "Normal Mode": "Normal Mod",
    "Plan Mode": "Plan Modu",
    "Tool Permissions": "Araç İzinleri",
    "Modify permissions for file, terminal, and MCP tools.": "Dosya, terminal ve MCP araçları için izinleri düzenleyin.",
    "Open": "Aç",
    "Close": "Kapat",
    "Ajan Davranışı": "Ajan Davranışı",
    "Agent Behavior": "Ajan Davranışı",
    "Plan İnceleme İlkesi": "Plan İnceleme İlkesi",
    "Plan Review Policy": "Plan İnceleme İlkesi",
    "Whether the agent asks you to review its documents.": "Ajanın belgelerini incelemenizi isteyip istemeyeceği.",
    "Always Proceed": "Her Zaman Devam Et",
    "Ask Before Proceeding": "Devam Etmeden Önce Sor",
    "Never Proceed": "Asla Devam Etme",
    "Type": "Ajanın plan oluşturması için",
    "and select": "yazın ve",
    "to have the agent generate a plan.": "öğesini seçin.",
    "Network Permissions": "Ağ İzinleri",
    "Ağ Erişim Kuralları": "Ağ Erişim Kuralları",
    "Network Access Rules": "Ağ Erişim Kuralları",
    "Configure allowed and denied URLs for reading.": "Okuma için izin verilen ve reddedilen URL'leri yapılandırın.",
    "Commands Outside Sandbox": "Korumalı Alan Dışı Komutlar",
    "Configure allowed commands outside the sandbox.": "Korumalı alan dışında izin verilen komutları yapılandırın.",
    "Show 1 breakdown": "1 ayrıntıyı göster",
    "Show 79 breakdowns": "79 ayrıntıyı göster",
    "Terminal & Tooling Permissions": "Terminal ve Araç İzinleri",
    "Account": "Hesap",
    "Manage your plan, credentials, and general preferences.": "Planınızı, kimlik bilgilerinizi ve genel tercihlerinizi yönetin.",
    "Enable Telemetry": "Telemetriyi Etkinleştir",
    "When toggled on, Antigravity collects usage data to help Google enhance performance and features.": "Etkinleştirildiğinde, Antigravity Google'ın performansı ve özellikleri geliştirmesine yardımcı olmak için kullanım verilerini toplar.",
    "Marketing Emails": "Pazarlama E-postaları",
    "Receive product updates, tips, and promotions from Google Antigravity via email.": "E-posta yoluyla Google Antigravity'den ürün güncellemeleri, ipuçları ve promosyonlar alın.",
    "Your Plan:": "Planınız:",
    "Antigravity Starter Quota": "Antigravity Başlangıç Kotası",
    "This account is ineligible for higher rate limits through a Google AI plan at this time.": "Bu hesap şu anda bir Google AI planı aracılığıyla daha yüksek istek limitleri için uygun değildir.",
    "Email": "E-posta",
    "Sign Out": "Oturumu Kapat",
    "Terms of Service": "Hizmet Şartları",
    "By using this app, you agree to its": "Bu uygulamayı kullanarak şunları kabul etmiş olursunuz:",
    "Manage Antigravity app settings.": "Antigravity uygulama ayarlarını yönetin.",
    "Prevent Sleep": "Uykuyu Önle",
    "Prevent the computer from sleeping while the app is running.": "Uygulama çalışırken bilgisayarın uyku moduna geçmesini önleyin.",
    "Keep In Menu Bar": "Menü Çubuğunda Tut",
    "Keep the app accessible from the menu bar and running in the background when all windows are closed.": "Tüm pencereler kapatıldığında uygulamanın menü çubuğundan erişilebilir olmasını ve arka planda çalışmasını sağlayın.",
    "Remote Control": "Uzaktan Kontrol",
    "Enable Remote Control": "Uzaktan Kontrolü Etkinleştir",
    "Work with local agents from another device.": "Yerel ajanlarla başka bir cihazdan çalışın.",
    "Device Name": "Cihaz Adı",
    "Scan the code to open this device in Remote Control, or": "Bu cihazı Uzaktan Kontrol'de açmak için QR kodunu tarayın veya",
    "Show Remote Control QR code": "Uzaktan Kontrol QR kodunu göster",
    "Remote Control link": "Uzaktan Kontrol bağlantısı",
    "Enter device name...": "Cihaz adı girin...",
    "Notification Settings": "Bildirim Ayarları",
    "To modify notification settings, open your operating system's system preferences.": "Bildirim ayarlarını değiştirmek için işletim sisteminizin sistem tercihlerini açın.",
    "Open System Preferences": "Sistem Tercihlerini Aç",
    "Advanced Settings": "Gelişmiş Ayarlar",
    "Configure the agent's visual theme and display preferences.": "Ajanın görsel temasını ve görüntüleme tercihlerini yapılandırın.",
    "Theme": "Tema",
    "System": "Sistem",
    "Light": "Açık",
    "Dark": "Koyu",
    "Default Light": "Varsayılan Açık",
    "Default Dark": "Varsayılan Koyu",
    "Light Theme": "Açık Tema",
    "Dark Theme": "Koyu Tema",
    "Contrast": "Kontrast",
    "Preset": "Önayar",
    "Background": "Arka Plan",
    "Foreground": "Ön Plan",
    "Accent": "Vurgu",
    "Narrow": "Dar",
    "Wide": "Geniş",
    "Default": "Varsayılan",
    "Strong": "Belirgin",
    "Simplified": "Basitleştirilmiş",
    "The full developer experience.": "Eksiksiz geliştirici deneyimi.",
    "Simplified interface without developer tooling.": "Geliştirici araçları olmadan basitleştirilmiş arayüz.",
    "Chat Settings": "Sohbet Ayarları",
    "Verbose Agent Chat": "Ayrıntılı Ajan Sohbeti",
    "Display and preserve intermediate thinking steps.": "Ara düşünme adımlarını görüntüleyin ve saklayın.",
    "Conversation Width": "Konuşma Genişliği",
    "Configure the maximum width of the conversation panel.": "Konuşma panelinin maksimum genişliğini yapılandırın.",
    "Skin": "Görünüm Teması",
    "Choose the product skin that fits how you work.": "Çalışma biçiminize en uygun ürün temasını seçin.",
    "Product Skin": "Ürün Teması",
    "Choose how technical the interface should be.": "Arayüzün ne kadar teknik olacağını seçin.",
    "Editor Settings": "Düzenleyici Ayarları",
    "Configure editor-specific behaviors and shortcuts.": "Düzenleyiciye özgü davranışları ve kısayolları yapılandırın.",
    "Open Editor Settings": "Düzenleyici Ayarlarını Aç",
    "Go to General settings": "Genel ayarlara git",
    "Marketplace": "Pazar Yeri",
    "Marketplace Item URL": "Pazar Yeri Öğe URL'si",
    "Marketplace Gallery URL": "Pazar Yeri Galeri URL'si",
    "Selection Actions": "Seçim Eylemleri",
    "Show Selection Actions": "Seçim Eylemlerini Göster",
    "Show \"Edit\" and \"Chat\" buttons when selecting text in the editor.": "Düzenleyicide metin seçerken \"Düzenle\" ve \"Sohbet\" butonlarını göster.",
    "To modify editor settings, open Settings within the editor window.": "Düzenleyici ayarlarını değiştirmek için düzenleyici penceresindeki Ayarlar'ı açın.",
    "Tab": "Sekme",
    "Configure tab completion, suggestions, and navigation behavior.": "Sekme tamamlama, öneriler ve gezinme davranışını yapılandırın.",
    "Models & Usage": "Modeller ve Kullanım",
    "Manage your model quota and credits.": "Model kotanızı ve kredilerinizi yönetin.",
    "Model Quota": "Model Kotası",
    "Gemini Models": "Gemini Modelleri",
    "Weekly Limit Remaining": "Kalan Haftalık Limit",
    "Claude and GPT models": "Claude ve GPT Modelleri",
    "Refresh quota and credits data": "Kota ve kredi verilerini yenile",
    "Plan": "Plan",
    "Select Model": "Model Seç",
    "Temperature": "Sıcaklık",
    "Max Tokens": "Maksimum Token",
    "Context Window": "Bağlam Penceresi",
    "API Key": "API Anahtarı",
    "API Keys": "API Anahtarları",
    "Configure default behaviors, skills, and MCP servers.": "Varsayılan davranışları, becerileri ve MCP sunucularını yapılandırın.",
    "Token Usage": "Belirteç (Token) Kullanımı",
    "Skills": "Beceriler",
    "Rules": "Kurallar",
    "Add MCP": "MCP Ekle",
    "Customize": "Özelleştir",
    "copy link": "bağlantıyı kopyala",
    "Copy path": "Yolu kopyala",
    "Refresh MCP servers": "MCP sunucularını yenile",
    "Delete server": "Sunucuyu sil",
    "Delete plugin": "Eklentiyi sil",
    "Installed MCP Servers": "Yüklü MCP Sunucuları",
    "Plugins": "Eklentiler",
    "Build With Google Plugins": "Build With Google Eklentileri",
    "Browse and enable plugins from the Build With Google catalog.": "Build With Google kataloğundaki eklentilere göz atın ve etkinleştirin.",
    "Enter bot name (optional)": "Bot adı girin (isteğe bağlı)",
    "Enter avatar URL (optional)": "Avatar URL'si girin (isteğe bağlı)",
    "Jetski Chat": "Jetski Sohbet",
    "Configure a chat bot so you can use Jetski directly from Google Chat.": "Jetski'yi doğrudan Google Chat üzerinden kullanabilmek için bir sohbet botu yapılandırın.",
    "Setup": "Kurulum",
    "Bot Name": "Bot Adı",
    "Avatar URL": "Avatar URL'si",
    "Setup Jetski Chat": "Jetski Sohbeti Yapılandır",
    "Error:": "Hata:",
    "Browser Settings": "Tarayıcı Ayarları",
    "Browser settings have moved": "Tarayıcı ayarları taşındı",
    "Browser settings have moved to the Browser section of General settings.": "Tarayıcı ayarları, Genel ayarlar altındaki Tarayıcı bölümüne taşındı.",
    "Configure the browser subagent. It requires": "Tarayıcı alt ajanını yapılandırın. Şunu gerektirir:",
    "Google Chrome": "Google Chrome",
    "to be installed.": "kurulu olmalıdır.",
    "The browser subagent can be invoked by typing /browser in the conversation input box.": "Tarayıcı alt ajanı, konuşma giriş kutusuna /browser yazılarak çağrılabilir.",
    "Browser Javascript Execution Policy": "Tarayıcı JavaScript Yürütme İlkesi",
    "Controls whether the agent can run custom JavaScript to automate complex browser actions.": "Ajanın karmaşık tarayıcı eylemlerini otomatikleştirmek için özel JavaScript çalıştırıp çalıştıramayacağını denetler.",
    "Browser Actuation Rules": "Tarayıcı Eyleme Geçirme Kuralları",
    "Configure allowed and denied URLs for browser actuation.": "Tarayıcı otomasyonu için izin verilen ve reddedilen URL'leri yapılandırın.",
    "Agent settings and permissions for conversations outside of projects.": "Projeler dışındaki konuşmalar için ajan ayarları ve izinleri.",
    "Agent Settings": "Ajan Ayarları",
    "Local Permissions": "Yerel İzinler",
    "Also includes": "Şunları da içerir:",
    "when working in this project.": "bu projede çalışırken.",
    "Also includes Global Permissions when working in this project. Learn more.": "Bu projede çalışırken Genel İzinleri de içerir. Daha fazla bilgi edinin.",
    "File Access Rules": "Dosya Erişim Kuralları",
    "Configure allowed and denied paths for file reads and writes.": "Dosya okuma ve yazma işlemleri için izin verilen ve reddedilen yolları yapılandırın.",
    "Terminal Commands": "Terminal Komutları",
    "Configure allowed terminal commands.": "İzin verilen terminal komutlarını yapılandırın.",
    "MCP Tools": "MCP Araçları",
    "Configure external tools via Model Context Protocol.": "Model Context Protocol üzerinden harici araçları yapılandırın.",
    "Core tools and knowledge required to develop for Android": "Android geliştirmek için gereken temel araçlar ve bilgiler",
    "Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer": "Chrome DevTools ve Puppeteer kullanarak Chrome'da güvenilir otomasyon, derinlemesine hata ayıklama ve performans analizi",
    "Using the Google Antigravity Python SDK to build AI agents": "Yapay zeka ajanları oluşturmak için Google Antigravity Python SDK'sını kullanma",
    "Curated collection of agent skills for modern web development.": "Modern web geliştirme için derlenmiş ajan becerileri koleksiyonu.",
    "Curated collection of agent skills for science tasks.": "Bilimsel görevler için derlenmiş ajan becerileri koleksiyonu.",
    "Science": "Bilim",
    "Keyboard shortcuts for quick navigation and control.": "Hızlı gezinme ve denetim için klavye kısayolları.",
    "Recommended": "Önerilen",
    "Open Conversation Picker": "Konuşma Seçiciyi Aç",
    "Open File Search": "Dosya Aramayı Aç",
    "Focus Input": "Giriş Alanına Odaklan",
    "Navigation": "Gezinme",
    "File Picker": "Dosya Seçici",
    "Select Previous Conversation": "Önceki Konuşmayı Seç",
    "Select Next Conversation": "Sonraki Konuşmayı Seç",
    "Previous Pane Tab": "Önceki Bölme Sekmesi",
    "Next Pane Tab": "Sonraki Bölme Sekmesi",
    "Open Settings": "Ayarları Aç",
    "Conversation": "Konuşma",
    "Toggle Model Selector": "Model Seçiciyi Aç/Kapat",
    "Toggle Voice Recording": "Ses Kaydını Aç/Kapat",
    "Find in Pane": "Bölmede Bul",
    "Add to Chat/Quote": "Sohbete Ekle/Alıntı Yap",
    "Layout Controls": "Düzen Denetimleri",
    "Toggle Auxiliary Pane": "Yardımcı Bölmeyi Aç/Kapat",
    "Toggle Terminal": "Terminali Aç/Kapat",
    "Feedback Type": "Geri Bildirim Türü",
    "Bug Report": "Hata Bildirimi",
    "Feature Request": "Özellik İsteği",
    "Auth and Billing": "Kimlik Doğrulama ve Faturalandırma",
    "Remote Control Issue": "Uzaktan Kontrol Sorunu",
    "General Feedback": "Genel Geri Bildirim",
    "Description": "Açıklama",
    "Please describe the issue in detail. The more actionable your feedback, the quicker our team can address your request. Some helpful information includes:": "Lütfen sorunu ayrıntılı olarak açıklayın. Geri bildiriminiz ne kadar eyleme geçirilebilir olursa ekibimiz o kadar hızlı yanıtlayabilir. Faydalı bilgiler şunları içerir:",
    "Steps to reproduce the issue": "Sorunu yeniden oluşturma adımları",
    "Expected behavior": "Beklenen davranış",
    "Actual behavior": "Gerçekleşen davranış",
    "Any error messages": "Varsa hata mesajları",
    "Any relevant information": "İlgili tüm bilgiler",
    "Steps to Reproduce": "Yeniden Oluşturma Adımları",
    "Attach a screenshot (optional)": "Ekran görüntüsü ekle (isteğe bağlı)",
    "Attach Antigravity server logs": "Antigravity sunucu günlüklerini ekle",
    "Describe the bug you encountered...": "Karşılaştığınız hatayı açıklayın...",
    "Please list the steps to reproduce the issue": "Sorunu yeniden oluşturma adımlarını yazın",
    "Submit": "Gönder",
    "Labs": "Laboratuvar",
    "Labs settings have moved": "Laboratuvar ayarları taşındı",
    "Labs settings have moved to the Advanced section of General settings.": "Laboratuvar ayarları, Genel ayarlar altındaki Gelişmiş bölümüne taşındı.",
    "Workspace Settings": "Çalışma Alanı Ayarları",
    "Workspace settings have moved": "Çalışma alanı ayarları taşındı",
    "Workspace settings have moved to the Advanced section of General settings.": "Çalışma alanı ayarları, Genel ayarlar altındaki Gelişmiş bölümüne taşındı.",
    "Best of N": "En İyi N",
    "Best of N settings have moved": "En İyi N ayarları taşındı",
    "Best of N settings have moved to the Advanced section of General settings.": "En İyi N ayarları, Genel ayarlar altındaki Gelişmiş bölümüne taşındı.",
    "Developer": "Geliştirici",
    "Developer-only tools. These settings are stored locally in this browser and do not affect other users.": "Yalnızca geliştiricilere yönelik araçlar. Bu ayarlar bu tarayıcıda yerel olarak saklanır ve diğer kullanıcıları etkilemez.",
    "Learn more": "Daha fazla bilgi edinin",
    "Learn more.": "Daha fazla bilgi edinin.",
    "Edit": "Düzenle",
    "Delete": "Sil",
    "Save": "Kaydet",
    "Cancel": "İptal",
    "Confirm": "Onayla",
    "Ask anything, @ to mention, / for actions": "Bir şey sorun, @ ile bahsedin, / ile eylemler",
    "Ask anything, @ to mention / for actions": "Bir şey sorun, @ ile bahsedin, / ile eylemler",
    "Thought for": "Düşünme süresi:",
    "Thinking": "Düşünülüyor",
    "Thinking...": "Düşünülüyor..."
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
