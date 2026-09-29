"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Preload script — runs in every BrowserWindow before the page loads.
 * Exposes a minimal, secure API via contextBridge so the renderer can
 * communicate with the main-process auto-updater without nodeIntegration.
 */
const electron_1 = require("electron");
const updaterAPI = {
    onStateChanged: (callback) => {
        const handler = (_event, state) => {
            callback(state);
        };
        electron_1.ipcRenderer.on('updater:state-changed', handler);
        // Return unsubscribe function
        return () => {
            electron_1.ipcRenderer.removeListener('updater:state-changed', handler);
        };
    },
    applyUpdate: () => electron_1.ipcRenderer.invoke('updater:apply'),
    quitAndInstall: () => electron_1.ipcRenderer.invoke('updater:quit-and-install'),
    checkForUpdates: () => electron_1.ipcRenderer.invoke('updater:check-for-updates'),
    getState: () => electron_1.ipcRenderer.invoke('updater:get-state'),
};
const dialogAPI = {
    showOpenDialog: () => electron_1.ipcRenderer.invoke('dialog:open-workspace'),
    showOpenMultipleFolderDialog: () => electron_1.ipcRenderer.invoke('dialog:open-workspaces'),
};
const notificationAPI = {
    send: (options) => electron_1.ipcRenderer.invoke('notification:send', options),
    openSystemPreferences: () => electron_1.ipcRenderer.invoke('notification:open-system-preferences'),
    onClicked: (callback) => {
        const handler = (_event, payload) => {
            callback(payload);
        };
        electron_1.ipcRenderer.on('notification:clicked', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('notification:clicked', handler);
        };
    },
};
const storageAPI = {
    getItems: () => electron_1.ipcRenderer.invoke('storage:get-items'),
    updateItems: (changes) => electron_1.ipcRenderer.invoke('storage:update-items', changes),
    onChanged: (callback) => {
        const handler = (_event, changes) => {
            callback(changes);
        };
        electron_1.ipcRenderer.on('storage:changed', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('storage:changed', handler);
        };
    },
};
const logsAPI = {
    getElectronLogs: () => electron_1.ipcRenderer.invoke('logs:electron'),
};
const extensionsAPI = {
    sendAuthorities: (authoritiesMap) => electron_1.ipcRenderer.invoke('extensions:send-authorities', authoritiesMap),
};
const deepLinkAPI = {
    onDeepLink: (callback) => {
        const handler = (_event, url) => {
            callback(url);
        };
        electron_1.ipcRenderer.on('deep-link', handler);
        return () => {
            electron_1.ipcRenderer.removeListener('deep-link', handler);
        };
    },
    getStoredDeepLink: () => electron_1.ipcRenderer.invoke('deep-link:get-stored'),
};
const agentAPI = {
    updateActiveAgentCount: (count) => electron_1.ipcRenderer.invoke('agent:update-active-count', count),
};
const electronNativeAPI = {
    getZoomLevel: () => electron_1.webFrame.getZoomFactor(),
    setTitleBarOverlay: (options) => electron_1.ipcRenderer.invoke('window:set-title-bar-overlay', options),
    minimize: () => electron_1.ipcRenderer.invoke('window:minimize'),
    maximize: () => electron_1.ipcRenderer.invoke('window:maximize'),
    unmaximize: () => electron_1.ipcRenderer.invoke('window:unmaximize'),
    isMaximized: () => electron_1.ipcRenderer.invoke('window:is-maximized'),
    close: () => electron_1.ipcRenderer.invoke('window:close'),
    toggleDevTools: () => electron_1.ipcRenderer.invoke('window:toggle-devtools'),
    zoomIn: () => {
        void electron_1.ipcRenderer.invoke('window:zoom-in');
    },
    zoomOut: () => {
        void electron_1.ipcRenderer.invoke('window:zoom-out');
    },
    resetZoom: () => {
        void electron_1.ipcRenderer.invoke('window:reset-zoom');
    },
    openExternal: (url) => electron_1.ipcRenderer.invoke('shell:open-external', url),
    revealInFilePicker: (path) => electron_1.ipcRenderer.invoke('shell:reveal-in-file-picker', path),
};
const ideAPI = {
    isInstalled: () => electron_1.ipcRenderer.invoke('ide:is-installed'),
};
const wslAPI = {
    getState: () => electron_1.ipcRenderer.invoke('wsl:get-state'),
    connect: (distro) => electron_1.ipcRenderer.invoke('wsl:connect', distro),
};
electron_1.contextBridge.exposeInMainWorld('electronUpdater', updaterAPI);
electron_1.contextBridge.exposeInMainWorld('dialog', dialogAPI);
electron_1.contextBridge.exposeInMainWorld('nativeNotifications', notificationAPI);
electron_1.contextBridge.exposeInMainWorld('nativeStorage', storageAPI);
electron_1.contextBridge.exposeInMainWorld('logs', logsAPI);
electron_1.contextBridge.exposeInMainWorld('extensions', extensionsAPI);
electron_1.contextBridge.exposeInMainWorld('deepLink', deepLinkAPI);
electron_1.contextBridge.exposeInMainWorld('agent', agentAPI);
electron_1.contextBridge.exposeInMainWorld('electronNative', electronNativeAPI);
electron_1.contextBridge.exposeInMainWorld('ide', ideAPI);
electron_1.contextBridge.exposeInMainWorld('wsl', wslAPI);


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
    'Configure allowed and denied URLs for reading.': 'Okuma için izin verilen ve reddedilen URL\'leri yapılandırın.',
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
