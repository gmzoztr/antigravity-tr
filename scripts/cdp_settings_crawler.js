const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('=== ANTIGRAVITY IDE GERÇEK BROWSER-USE AYARLAR DENETÇİSİ ===\n');
  console.log('1. IDE Chrome DevTools arayüzüne bağlanılıyor (localhost:9222)...');

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  const page = context.pages().find(p => p.url().includes('workbench.html')) || context.pages()[0];

  console.log(`✓ Bağlanıldı: "${await page.title()}"`);

  // 2. Ayarlar sekmesini aç (Control+,)
  console.log('\n2. Ayarlar sekmesi açılıyor (Control+,)...');
  await page.keyboard.press('Control+,');
  await page.waitForTimeout(2000);

  // Ayarlar editörünün yüklenmesini bekle
  try {
    await page.waitForSelector('.settings-editor', { timeout: 5000 });
    console.log('✓ Ayarlar penceresi yüklendi!');
  } catch (e) {
    console.log('Ayarlar seçicisi doğrudan bulunamadı, komut paleti üzerinden deneniyor...');
    await page.keyboard.press('F1');
    await page.waitForTimeout(500);
    await page.keyboard.type('Preferences: Open Settings (UI)');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
  }

  // 3. Sol taraftaki Ayarlar Ağacı (TOC - Table of Contents) sekmelerini çekelim
  const categories = await page.$$eval('.settings-toc-container .monaco-list-row', rows => {
    return rows.map((r, idx) => ({
      index: idx,
      text: r.textContent.trim(),
      id: r.id
    })).filter(x => x.text.length > 0);
  });

  console.log(`\n3. Ayarlar Ağacında ${categories.length} Kategori Bulundu:`);
  categories.forEach(c => console.log(`   [${c.index}] ${c.text}`));

  // 4. Her bir kategoriye tıkla ve içindeki ayarları tara
  const auditReport = [];

  // İlk 6 ana kategoriyi (Metin Düzenleyici, Çalışma Yeri, Pencere, Özellikler, Uygulama, Uzantılar) gez
  const targetCategories = categories.slice(0, 10);

  for (const cat of targetCategories) {
    console.log(`\n>>> [KATEGORİ GEZİLİYOR: ${cat.text}] <<<`);
    
    // Kategoriye DOM tıklaması yap (evaluate ile sanal liste gecikmesi olmadan anlık)
    try {
      const rows = await page.$$('.settings-toc-container .monaco-list-row');
      if (rows[cat.index]) {
        await page.evaluate(el => el.click(), rows[cat.index]);
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('Kategoriye tıklama hatası:', e.message);
    }

    // Ekrandaki ayarları topla
    const settings = await page.$$eval('.setting-item-contents', items => {
      return items.map(el => {
        const titleEl = el.querySelector('.setting-item-title');
        const descEl = el.querySelector('.setting-item-description');
        const selectEl = el.querySelector('.monaco-select-box select');
        
        let selectOptions = [];
        if (selectEl) {
          selectOptions = Array.from(selectEl.options).map(o => o.text.trim());
        }

        return {
          title: titleEl ? titleEl.textContent.trim() : null,
          description: descEl ? descEl.textContent.trim() : null,
          selectOptions
        };
      }).filter(s => s.title || s.description);
    });

    console.log(`   Bulunan Ayar Sayısı: ${settings.length}`);

    // İngilizce kalanları filtrele
    const englishSettings = settings.filter(s => {
      const desc = s.description || '';
      return /\b(the|is|to|for|when|whether|controls|enable|disable|automatically|default|path|requires)\b/i.test(desc);
    });

    console.log(`   Açıklaması İngilizce Kalan: ${englishSettings.length}`);
    if (englishSettings.length > 0) {
      console.log('   Örnek İngilizce Ayarlar:');
      englishSettings.slice(0, 3).forEach(s => {
        console.log(`     * ${s.title}`);
        console.log(`       -> ${s.description ? s.description.slice(0, 80) + '...' : '-'}`);
        if (s.selectOptions.length > 0) console.log(`       [Seçenekler]: ${s.selectOptions.join(', ')}`);
      });
    }

    auditReport.push({
      category: cat.text,
      totalCount: settings.length,
      untranslatedCount: englishSettings.length,
      untranslatedSamples: englishSettings.slice(0, 5)
    });
  }

  // 5. Canlı Ekran Görüntüsü Kaydet (Doğrudan Chromium üzerinden)
  const screenshotPath = path.join(__dirname, '..', 'scratch', 'cdp_settings_live.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\n✓ Canlı Ayarlar ekran görüntüsü kaydedildi: ${screenshotPath}`);

  // Raporu JSON olarak yaz
  const reportPath = path.join(__dirname, 'cdp_crawler_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2), 'utf8');
  console.log(`✓ DOM Denetim Raporu kaydedildi: ${reportPath}`);

  // await browser.close(); IDE'nin kapanmaması için yoruma alındı
}

main().catch(err => console.error('Hata:', err));
