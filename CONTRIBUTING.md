# Katkıda Bulunma Kılavuzu (Contributing)

`antigravity-tr` projesine katkıda bulunmak istediğiniz için teşekkürler! Antigravity geliştirme ortamını ve yapay zeka deneyimini Türkçe kullanan herkes için daha iyi hale getirmeyi amaçlıyoruz.

## Nasıl Katkı Sağlayabilirsiniz?

1. **Yeni Çeviriler Eklemek:**
   - Antigravity veya Antigravity IDE güncellendikçe yeni İngilizce kalan butonlar veya etiketler çıkabilir.
   - `locales/tr.json` dosyasına yeni `search` ve `replace` kuralları ekleyerek bir Pull Request (PR) açabilirsiniz.

2. **Yapay Zeka Kurallarını İyileştirmek:**
   - `rules/GEMINI.md` dosyasında asistanın Türkçesini, kod yorumlama tarzını veya planlama formatını geliştirecek öneriler sunabilirsiniz.

3. **Hata Bildirimi (Issue):**
   - Karşılaştığınız eksik çevirileri, hatalı eşleşmeleri veya güncelleme sonrası oluşan durumları GitHub Issues sekmesinden bildirebilirsiniz.

## Geliştirme Adımları

1. Depoyu forklayın (`Fork`).
2. Yeni bir özellik dalı oluşturun: `git checkout -b ozellik/yeni-ceviri`
3. Değişikliklerinizi yapın ve test edin:
   ```bash
   node bin/antigravity-tr.js install
   ```
4. Commit oluşturun:
   ```bash
   git commit -m "feat(locales): Record Audio ve Editor Settings çevirileri eklendi"
   ```
5. Dalınızı gönderin: `git push origin ozellik/yeni-ceviri`
6. Bir Pull Request açın.
