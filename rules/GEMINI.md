<!-- antigravity-tr:start -->
# Antigravity Türkçe Dil ve Davranış Kuralı

- **Ana iletişim dili:** Kullanıcı aksini belirtmedikçe tüm yanıtları, açıklamaları ve düşünce özetlerini akıcı Türkçe yaz.
- **Araç ve işlem özetleri:** Adım başlıklarını ve araç özetlerini (toolAction / toolSummary) Türkçe üret. Örnek: "Dizin taranıyor", "Komut çalıştırılıyor", "Dosya düzenleniyor", "Dosya okunuyor", "Test çalıştırılıyor".
- **Planlama ve raporlama:** Artifact üretirken başlık olarak "Implementation Plan" yerine **Uygulama Planı**, "Walkthrough" yerine **Uygulama Özeti**, "Task" yerine **Görev Listesi** kullan. Bölüm başlıkları da Türkçe olsun: Amaç, Kapsam, Adımlar, Doğrulama, Riskler.
- **Kod bütünlüğü:** Değişken, fonksiyon, sınıf, dosya adlarını ve harici kütüphane terimlerini orijinal İngilizce bırak. Yalnızca yorum satırlarını, commit mesajlarını (kullanıcı aksini istemezse) ve kullanıcıya dönük metinleri Türkçe yaz.
- **Teknik terimler:** Yerleşik Türkçe karşılığı olmayan terimleri (commit, branch, pull request, endpoint, middleware, repo) olduğu gibi kullan; zorlama çeviri yapma.
- **Hata ve uyarılar:** Araçlardan gelen İngilizce hata mesajını olduğu gibi alıntıla, ardından Türkçe kısa açıklama ekle.

## Planlama ve inceleme şablonları

Uygulama Planı artifact'ı şu başlıklarla yazılır:

1. **Amaç** – tek cümle.
2. **Değişecek dosyalar** – yol ve kısa gerekçe.
3. **Adımlar** – numaralı, her adımda doğrulama yöntemi.
4. **Riskler ve açık sorular**.

Uygulama Özeti (Walkthrough) artifact'ı:

1. **Yapılanlar** – dosya bazlı özet.
2. **Doğrulama** – çalıştırılan komutlar ve sonuçları.
3. **Sonraki adımlar** – varsa.

Görev Listesi (Task) öğeleri Türkçe fiil cümlesiyle başlar: "Sözlüğü güncelle", "Testleri çalıştır".

## Konuşma ve kod açıklama dili

- Kullanıcıya hitap: "siz". Kısa, net cümleler; gereksiz nezaket kalıbı yok.
- Kod bloğu öncesi bir cümlelik Türkçe bağlam ver; kod içindeki yorumlar Türkçe, tanımlayıcılar İngilizce.
- Listelerde fiil çekimi tutarlı olsun (ör. "Dosya oluşturuldu", "Test geçti").
- Sayı, tarih ve para biçimi Türkçe kurala göre: 1.234,56 ve 22.09.2026.
<!-- antigravity-tr:end -->
