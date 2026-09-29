# Katkıda bulunma

1. Windows üzerinde Node.js 22.12+ kurun; `npm ci --ignore-scripts` çalıştırın.
2. Desktop etiketleri için `scripts/desktop_full_dictionary.json`, IDE kuralları için `locales/tr.json` veya `src/settings_dictionary.js` dosyalarını düzenleyin.
3. `npm test` ile regresyon testlerini çalıştırın. Testler kurulu uygulamaya yazmaz.
4. Gerçek uygulama kontrolünü ayrı yapın: pencereyi kapatın, `install-desktop` uygulayın, tekrar açın. Açılış, ayarlar, sohbet listesi, metin girişi ve araç ipuçlarını denetleyin.
5. PR açıklamasına test edilen uygulama sürümünü, etkilenen etiketleri ve canlı kontrol sonucunu yazın.

Aynı İngilizce ve Türkçe değerler döngü yaratmamalıdır. Çevirmen yeniden kurulduğunda aynı kaynak üretilmelidir. Kod, model kimlikleri ve kullanıcı mesajları çeviri hedefi değildir. Ekran görüntülerine hesap bilgisi veya özel konuşma eklemeyin.

Yeni uygulama sürümünü desteklenen listeye eklemeden önce değişen kaynak biçimini ve tüm testleri doğrulayın. Yedekleri veya hata kontrollerini kaldırmayın.
