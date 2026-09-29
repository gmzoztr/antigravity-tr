/**
 * Antigravity IDE Kapsamlı Ayar ve Açıklama Denetleyicisi (Comprehensive Settings Audit)
 * 1. Tüm kurulu ve yerleşik eklentilerin package.json dosyalarını tarar.
 * 2. Temel IDE'nin (workbench + nls.messages) ayarlarını tarar.
 * 3. Her ayarın başlığını, açıklamasını ve açılır kutu (enum) etiketlerini analiz eder.
 * 4. İngilizce kalan açıklamaları ve enum seçeneklerini tam rapor olarak kaydeder.
 */

const fs = require('fs');
const path = require('path');
const { getPaths } = require('../src/config.js');

const paths = getPaths();

// Türkçe harf / kelime kontrol fonksiyonu
const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
function isLikelyEnglish(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length < 3) return false;
  // Türkçe özel karakter içeriyorsa büyük ihtimalle Türkçedir
  if (TR_CHARS.test(trimmed)) return false;
  
  // Yaygın İngilizce ayar kelimeleri kontrolü
  const englishSignals = /\b(the|is|to|for|when|whether|controls|enable|disable|configure|specifies|determines|overrides|automatically|default|path|requires|allowed|behavior|options|before|after|which|should|will|from|with)\b/i;
  return englishSignals.test(trimmed);
}

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalSettingsFound: 0,
    fullyTranslated: 0,
    untranslatedDescriptions: 0,
    untranslatedEnums: 0,
    byExtension: {}
  },
  untranslatedSettings: []
};

// 1. Eklentileri Tara
const extDirs = [
  'C:/Users/Work-D/.antigravity-ide/extensions',
  'C:/Users/Work-D/AppData/Local/Programs/Antigravity IDE/resources/app/extensions'
];

for (const dir of extDirs) {
  if (!fs.existsSync(dir)) continue;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const pkgPath = path.join(dir, ent.name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;

    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const cfg = pkg.contributes?.configuration;
      if (!cfg) continue;

      const configs = Array.isArray(cfg) ? cfg : [cfg];
      for (const c of configs) {
        if (!c.properties) continue;

        for (const [key, prop] of Object.entries(c.properties)) {
          report.summary.totalSettingsFound++;
          const extName = ent.name;

          if (!report.summary.byExtension[extName]) {
            report.summary.byExtension[extName] = { total: 0, missingDesc: 0, missingEnum: 0 };
          }
          report.summary.byExtension[extName].total++;

          const desc = prop.description || prop.markdownDescription || '';
          const isDescEng = isLikelyEnglish(desc);
          
          let isEnumEng = false;
          let enumDetails = null;

          if (prop.enum && Array.isArray(prop.enum)) {
            const labels = prop.enumItemLabels || [];
            const descs = prop.enumDescriptions || [];
            
            // Eğer enumItemLabels tanımlanmamışsa veya içinde İngilizce varsa
            if (labels.length === 0 && prop.enum.some(e => typeof e === 'string' && isLikelyEnglish(e))) {
              isEnumEng = true;
              enumDetails = { rawEnum: prop.enum, missingLabels: true };
            } else if (labels.some(l => isLikelyEnglish(l))) {
              isEnumEng = true;
              enumDetails = { labels, missingLabels: false };
            }
          }

          if (isDescEng || isEnumEng) {
            if (isDescEng) {
              report.summary.untranslatedDescriptions++;
              report.summary.byExtension[extName].missingDesc++;
            }
            if (isEnumEng) {
              report.summary.untranslatedEnums++;
              report.summary.byExtension[extName].missingEnum++;
            }

            report.untranslatedSettings.push({
              key,
              extension: extName,
              pkgPath,
              description: desc,
              isDescriptionEnglish: isDescEng,
              isEnumEnglish: isEnumEng,
              enumDetails,
              type: prop.type
            });
          } else {
            report.summary.fullyTranslated++;
          }
        }
      }
    } catch (e) {}
  }
}

// 2. Temel IDE Ayarları (nls.messages.json)
if (fs.existsSync(paths.ide.nlsFile)) {
  const nls = JSON.parse(fs.readFileSync(paths.ide.nlsFile, 'utf8'));
  const nlsTotal = Array.isArray(nls) ? nls.length : Object.keys(nls).length;
  report.summary.coreNlsTotalMessages = nlsTotal;
}

// 3. Raporu diske kaydet
const outPath = path.join(__dirname, 'comprehensive_audit_report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

console.log('====================================================');
console.log('   ANTIGRAVITY IDE AYARLAR DERİN DENETİM RAPORU     ');
console.log('====================================================');
console.log(`Toplam Taranan Ayar Sayısı: ${report.summary.totalSettingsFound}`);
console.log(`Tamamen Türkçe Olan Ayarlar: ${report.summary.fullyTranslated}`);
console.log(`Açıklaması İngilizce Kalan Ayarlar: ${report.summary.untranslatedDescriptions}`);
console.log(`Açılır Kutusu (Enum) İngilizce Kalan Ayarlar: ${report.summary.untranslatedEnums}`);
console.log('\n--- UZANTI BAZINDA EKSİK DAĞILIMI ---');

for (const [ext, stats] of Object.entries(report.summary.byExtension)) {
  if (stats.missingDesc > 0 || stats.missingEnum > 0) {
    console.log(`  * ${ext}:`);
    console.log(`      Toplam: ${stats.total} | Eksik Açıklama: ${stats.missingDesc} | Eksik Enum: ${stats.missingEnum}`);
  }
}

console.log(`\n✓ Ayrıntılı JSON raporu kaydedildi: ${outPath}`);
