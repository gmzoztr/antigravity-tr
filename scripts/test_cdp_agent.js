const { chromium } = require('playwright-core');

async function main() {
  console.log('1. Antigravity IDE Chrome DevTools (CDP) portuna bağlanılıyor (http://localhost:9222)...');
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('✓ Başarıyla bağlandı!');

    const contexts = browser.contexts();
    console.log(`Context sayısı: ${contexts.length}`);

    for (const ctx of contexts) {
      const pages = ctx.pages();
      console.log(`Sayfa/Pencere sayısı: ${pages.length}`);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const title = await page.title();
        const url = page.url();
        console.log(`  [Pencere ${i + 1}] Başlık: "${title}" | URL: ${url}`);

        // Eğer VS Code / Antigravity IDE penceresiyse
        if (title.includes('Antigravity') || url.includes('workbench.html') || url.includes('vscode')) {
          console.log('\n2. Antigravity IDE Workbench DOM arayüzü inceleniyor...');
          
          // Açık olan sekmeler
          const tabs = await page.$$eval('.tab .label-name', els => els.map(e => e.textContent.trim()));
          console.log('Açık Sekmeler:', tabs);

          // Ayarlar açık mı?
          const isSettingsOpen = tabs.some(t => t.toLowerCase().includes('ayar') || t.toLowerCase().includes('setting'));
          console.log('Ayarlar sekmesi açık mı:', isSettingsOpen);

          // Ayarlar sekmesindeki kategorileri çekelim
          const categories = await page.$$eval('.settings-toc-container .monaco-list-row', els => els.map(e => e.textContent.trim()));
          if (categories.length > 0) {
            console.log(`\n3. Ayarlar Ağacı Kategorileri (${categories.length} adet):`);
            categories.slice(0, 15).forEach(c => console.log('  -', c));
          }

          // Ekranda görünen ayar başlıklarını ve açıklamalarını çekelim
          const settings = await page.$$eval('.setting-item-contents', els => {
            return els.map(el => {
              const titleEl = el.querySelector('.setting-item-title');
              const descEl = el.querySelector('.setting-item-description');
              return {
                title: titleEl ? titleEl.textContent.trim() : null,
                description: descEl ? descEl.textContent.trim() : null
              };
            });
          });

          console.log(`\n4. Ekranda Canlı Görünen Ayarlar (${settings.length} adet):`);
          settings.slice(0, 10).forEach(s => {
            console.log(`  * ${s.title || '-'}`);
            console.log(`    Açıklama: ${s.description ? s.description.slice(0, 100) + '...' : '-'}`);
          });
        }
      }
    }

    await browser.close();
    console.log('\n✓ CDP denetimi başarıyla tamamlandı.');
  } catch (err) {
    console.error('CDP Bağlantı Hatası:', err.message);
  }
}

main();
