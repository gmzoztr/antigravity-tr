/**
 * Antigravity Desktop - Tam Otomatik CDP Ayarlar Tarayıcısı
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.env.APPDATA, 'Antigravity', 'logs', 'main.log');
const REPORT_FILE = path.join(__dirname, 'desktop_english_strings.json');
const SCREENSHOT_DIR = path.join(__dirname, '..', 'scratch', 'desktop_pages');

function findPort() {
  if (!fs.existsSync(LOG_FILE)) throw new Error('main.log bulunamadı: ' + LOG_FILE);
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  const matches = [...content.matchAll(/Local:\s+(https:\/\/127\.0\.0\.1:(\d+)\/)/g)];
  if (!matches.length) throw new Error('Port bilgisi log\'da bulunamadı!');
  const last = matches[matches.length - 1];
  return { url: last[1], port: last[2] };
}

async function extractEnglishTexts(page) {
  return page.evaluate(() => {
    const results = [];
    const seen = new Set();

    function skipEl(el) {
      const tag = el.tagName?.toLowerCase();
      if (['script', 'style', 'noscript', 'svg', 'path', 'code', 'pre'].includes(tag)) return true;
      if (el.classList?.contains('monaco-editor')) return true;
      if (el.isContentEditable) return true;
      return false;
    }

    function isTurkish(text) {
      return /[ğüşıöçĞÜŞİÖÇ]/.test(text);
    }

    function isEnglish(text) {
      const t = text.trim();
      if (!t || t.length < 2) return false;
      if (!/[a-zA-Z]/.test(t)) return false;
      if (isTurkish(t)) return false;
      if (/^\d[\d.,\s%]*$/.test(t)) return false;
      if (/^(https?:\/\/|\/\/|\.|@)/.test(t)) return false;
      if (t.length > 250) return false;
      if (/^[{[(]/.test(t)) return false;
      return true;
    }

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          let el = node.parentElement;
          while (el) {
            if (skipEl(el)) return NodeFilter.FILTER_REJECT;
            el = el.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (!text || seen.has(text)) continue;
      if (!isEnglish(text)) continue;
      seen.add(text);

      const parent = node.parentElement;
      results.push({
        text,
        tag: parent?.tagName?.toLowerCase(),
        cls: parent?.className?.toString()?.substring(0, 60)
      });
    }

    document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => {
      const attrs = ['placeholder', 'title', 'aria-label'];
      attrs.forEach(attr => {
        const val = el.getAttribute(attr)?.trim();
        if (val && !seen.has(val) && isEnglish(val)) {
          seen.add(val);
          results.push({ text: val, tag: el.tagName.toLowerCase(), attr });
        }
      });
    });

    return results;
  });
}

async function main() {
  console.log('=== ANTİGRAVİTY DESKTOP OTOMATİK CDP AYARLAR TARAYICI ===\n');

  const { url: appUrl } = findPort();
  console.log(`[✓] Language server URL: ${appUrl}`);

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--ignore-certificate-errors', '--disable-web-security', '--no-sandbox']
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();
  console.log(`[1] Arayüze bağlanılıyor: ${appUrl}`);
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const allEnglishStrings = new Map();

  function recordStrings(texts, pageName) {
    for (const item of texts) {
      const key = item.text;
      if (allEnglishStrings.has(key)) {
        const existing = allEnglishStrings.get(key);
        existing.count++;
        if (!existing.pages.includes(pageName)) existing.pages.push(pageName);
      } else {
        allEnglishStrings.set(key, { count: 1, pages: [pageName], tag: item.tag });
      }
    }
  }

  // 1. Ana Ekran
  console.log('[2] Ana ekran taranıyor...');
  const mainTexts = await extractEnglishTexts(page);
  recordStrings(mainTexts, 'Ana Ekran');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_ana_ekran.png') });

  // 2. Ayarlar Modalını Aç (data-testid="settings-button")
  console.log('[3] Ayarlar butonu tıklanıyor (data-testid="settings-button")...');
  await page.click('[data-testid="settings-button"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_ayarlar_modal.png') });

  // 3. Modal içindeki sol menü sekme butonlarını listele
  const tabs = await page.evaluate(() => {
    // Sol taraftaki menüde yer alan tıklanabilir butonları/spanları bul
    const dialog = document.querySelector('[role="dialog"], [aria-modal="true"], div.fixed');
    if (!dialog) return [];
    const buttons = dialog.querySelectorAll('button, [role="button"], a');
    const names = [];
    for (const b of buttons) {
      const txt = b.innerText?.trim();
      if (txt && txt.length < 30 && !txt.includes('\n')) {
        names.push(txt);
      }
    }
    return names;
  });

  console.log(`[4] Ayarlar modalında bulunan butonlar/sekmeler (${tabs.length}):`, tabs);

  // Belirli bilinen sekmeler
  const targetTabs = [
    'General', 'Genel',
    'Application', 'Uygulama',
    'Appearance', 'Görünüm',
    'Models', 'Modeller',
    'Customizations', 'Özelleştirmeler',
    'Browser', 'Tarayıcı',
    'Conversations', 'Konuşmalar',
    'Shortcuts', 'Kısayollar'
  ];

  for (let i = 0; i < targetTabs.length; i++) {
    const tabName = targetTabs[i];
    const clicked = await page.evaluate((name) => {
      const dialog = document.querySelector('[role="dialog"], [aria-modal="true"], div.fixed');
      if (!dialog) return false;
      const all = dialog.querySelectorAll('button, [role="button"], a, span');
      for (const el of all) {
        if (el.textContent?.trim() === name) {
          el.click();
          return true;
        }
      }
      return false;
    }, tabName);

    if (clicked) {
      console.log(`    → "${tabName}" sekmesi tıklandı.`);
      await page.waitForTimeout(1500);

      const tabTexts = await extractEnglishTexts(page);
      recordStrings(tabTexts, `Ayarlar-${tabName}`);
      console.log(`      Bulunan İngilizce metin: ${tabTexts.length}`);

      const cleanName = tabName.replace(/[^a-zA-Z0-9]/g, '_');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `tab_${cleanName}.png`) });
    }
  }

  await browser.close();

  // Rapor oluştur
  const sorted = [...allEnglishStrings.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([text, info]) => ({ text, ...info }));

  fs.writeFileSync(REPORT_FILE, JSON.stringify(sorted, null, 2), 'utf8');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  TARAMA BAŞARIYLA TAMAMLANDI!`);
  console.log(`  Toplam Tespit Edilen Benzersiz İngilizce Metin: ${sorted.length}`);
  console.log(`  Rapor: ${REPORT_FILE}`);
  console.log(`${'='.repeat(60)}\n`);

  sorted.forEach((s, i) => {
    console.log(`  ${(i+1).toString().padStart(3)}. "${s.text}" [${s.pages.join(', ')}]`);
  });
}

main().catch(err => {
  console.error('\n[HATA]', err);
  process.exit(1);
});
