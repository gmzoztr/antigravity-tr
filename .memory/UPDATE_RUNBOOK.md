# 🔄 Antigravity Güncelleme Sonrası Yeniden Yama Rehberi (Runbook)

Google Antigravity veya Antigravity IDE güncellendiğinde bundle dosyaları orijinaline döner. Herhangi bir AI ajanı veya kullanıcı bu rehberi takip ederek 30 saniyede yamayı baştan sona eksiksiz yenileyebilir.

---

## ⚡ Hızlı Yöntem (Tek Komut)

1. Tüm açık Antigravity ve Antigravity IDE pencerelerini kapatın.
2. Terminali açıp şu komutu çalıştırın:
   ```powershell
   cd C:\Users\Work-D\source\antigravity-tr
   node bin/antigravity-tr.js install
   ```
3. Komut bittiğinde Antigravity IDE'yi başlatın.

---

## 🔍 Yeni Çevrilmemiş Metinler Varsa (Geliştirici Ajan Akışı)

Google yeni bir sürümde arayüze yeni butonlar veya ayarlar eklediyse:

1. **Yeni Dizeleri Tara:**
   ```bash
   npm run scan
   ```
2. **Sözlüğü Güncelle:**
   - Çıkan yeni İngilizce dizeleri `locales/tr.json` dosyasına ekleyin.
3. **Yamayı Uygula ve Test Et:**
   ```bash
   node bin/antigravity-tr.js install
   ```
4. **Bütünlük Kontrolü:**
   - Komut çıktısında `product.json Checksums Doğrulaması` adımının çalıştığından emin olun.
5. **Git'e Commit Et:**
   ```bash
   git add locales/tr.json
   git commit -m "feat(locales): vX.X sürümü için yeni arayüz metinleri eklendi"
   ```
