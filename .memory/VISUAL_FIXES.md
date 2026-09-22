# 🖼️ Kullanıcı Ekran Görüntüleri ve Kod Eşleme Tablosu

Bu doküman, kullanıcının ilettiği 9 farklı ekran görüntüsündeki her bir görsel kusurun hangi dosyada, hangi fonksiyonda ve nasıl çözüldüğünü belgeler.

---

## 1. Sohbet ve Ses Kayıt Mikrofonu
- **Görsel:** Chat giriş çubuğundaki mikrofon ikonu tooltip'i.
- **İngilizce Metin:** `Record Audio` / `Stop Recording`
- **Türkçe Karşılık:** `Ses Kaydet` / `Kaydı Durdur`
- **Kaynak Dosya:** `resources/app/out/jetskiAgent/main.js`
- **Teknik Neden:** Google Antigravity'ye özel React bileşenidir; standart dil paketinde bulunmaz.
- **Çözüm:** `locales/tr.json` içindeki `jetskiAgent` kuralları ile JSX metinleri yamalandı.

---

## 2. Üst Bar Editör Ayarları
- **Görsel:** Üst başlık çubuğundaki çark ikonu tooltip'i.
- **İngilizce Metin:** `Editor-Specific Settings`
- **Türkçe Karşılık:** `Editöre Özel Ayarlar`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js`
- **Teknik Neden:** Standart VS Code menü aksiyonlarına eklenen Google'a özel action.
- **Çözüm:** `workbench` kuralı ile eylem başlığı yamalandı.

---

## 3. Üst Bar Hızlı Aç (Arama Büyüteci)
- **Görsel:** Üst başlık çubuğundaki büyüteç ikonu tooltip'i.
- **İngilizce Metin:** `Quick Open`
- **Türkçe Karşılık:** `Hızlı Aç`
- **Kaynak Dosya:** `resources/app/out/nls.messages.json` (indeks 3308)
- **Teknik Neden:** `workbench.action.quickOpenWithModes` aksiyonu `p(3308, null)` çağrısı yapar. Google build sırasında `nls.keys` eşleşmesi koptuğu için varsayılan İngilizce dizisi düşer.
- **Çözüm:** `nls.messages.json` 3308. elemanı doğrudan `Hızlı Aç` yapıldı.

---

## 4. Ayarlar Sekmesi Başlığı
- **Görsel:** Ayarlar sayfasındaki sekme başlığı (`Kullanıcı` sekmesinin yanı).
- **İngilizce Metin:** `Antigravity IDE Settings`
- **Türkçe Karşılık:** `Antigravity IDE Ayarları`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js`
- **Kod Satırı:** `this.antigravitySettingsLink = new qn("antigravitySettings", \`${this.productService.nameLong} Settings\`, ...)`
- **Çözüm:** Template literal `\`${this.productService.nameLong} Ayarları\`` olarak yamalandı.

---

## 5. Ayar Sayfası Başlıkları
- **Görsel:** Ayarlar ekranındaki başlıklar:
  - `Files: Auto Save` ➔ `Dosyalar: Otomatik Kaydet`
  - `Editor: Font Size` ➔ `Metin Düzenleyici: Yazı Tipi Boyutu`
  - `Editor: Font Family` ➔ `Metin Düzenleyici: Yazı Tipi Ailesi`
  - `Editor: Tab Size` ➔ `Metin Düzenleyici: Sekme Boyutu`
  - `Editor: Render Whitespace` ➔ `Metin Düzenleyici: Boşluk Karakterlerini Göster`
  - `Editor: Cursor Style` ➔ `Metin Düzenleyici: İmleç Stili`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js`
- **Teknik Neden:** VS Code `gDe(t, e, i)` fonksiyonu ayar anahtarlarını (`files.autoSave`) camelCase'e göre ayırıp `NLa()` ile İngilizce kelimeler üretir.
- **Çözüm:** `gDe` fonksiyonunun `return {category: r, label: s}` satırına `_tr` sözlük haritası entegre edildi: `return {category: _tr[r] || r, label: _tr[s] || s}`.

---

## 6. Durum Çubuğu Proje Göstergesi
- **Görsel:** Sol alttaki bulut ikonu ve durum metni.
- **İngilizce Metin:** `(no project)`
- **Türkçe Karşılık:** `(proje seçilmedi)`
- **Kaynak Dosya:** `extensions/googlecloudtools.datacloud-0.11.0-universal/datacloud_vscode.js`
- **Teknik Neden:** Google Cloud Data Agent Kit eklentisinin aktif GCP projesi seçilmediğinde gösterdiği metin.
- **Çözüm:** `patchGoogleCloudExtension()` fonksiyonu ile doğrudan eklenti JS dosyası yamalandı.

---

## 7. Sol Aktivite Çubuğu Eklenti Başlıkları
- **Görsel:** Sol kenar çubuğu sağ tık menüsündeki İngilizce eklentiler.
- **İngilizce Metin:** `Databases`, `Data Engineering`, `Catalog`
- **Türkçe Karşılık:** `Veritabanları`, `Veri Mühendisliği`, `Katalog`
- **Kaynak Dosya:** `extensions/googlecloudtools.datacloud-0.11.0-universal/package.json`
- **Çözüm:** `viewsContainers` bölümündeki `title` alanları Türkçeleştirildi.

---

## 8. "Yüklemeniz Bozuk Görünüyor" Uyarısı
- **Görsel:** Sağ altta çıkan sarı uyarı balonu.
- **İngilizce Metin:** `Your Antigravity IDE installation appears to be corrupt. Please reinstall.`
- **Kaynak Dosya:** `resources/app/product.json`
- **Teknik Neden:** VS Code `IntegrityService` bundle dosyalarının SHA-256 hash'ini `product.json` içindeki imzalarla karşılaştırır.
- **Çözüm:** `src/patcher.js -> updateProductChecksums()` fonksiyonu değiştirilen dosyaların Base64 SHA-256 hash'lerini otomatik hesaplayıp `product.json`'a işler.

---

## 9. Metin Düzenleyici Alt Ayar Başlıkları (Erişilebilirlik & Yazı Tipleri)
- **Görsel:** `media_1790087624535.png` - Ayarlar > Metin Düzenleyici altındaki ayar başlıkları.
- **İngilizce Metin:** `Accessibility Page Size`, `Accessibility Support`, `Allow Variable Fonts`, `Allow Variable Fonts In Accessibility Mode`, `Allow Variable Line Heights` vb.
- **Türkçe Karşılık:** `Erişilebilirlik Sayfa Boyutu`, `Erişilebilirlik Desteği`, `Değişken Yazı Tiplerine İzin Ver`, `Erişilebilirlik Modunda Değişken Yazı Tiplerine İzin Ver`, `Değişken Satır Yüksekliklerine İzin Ver`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js` (`gDe` fonksiyonu)
- **Teknik Neden:** VS Code, ayar başlıklarını statik dil paketlerinden değil, `gDe(t, e, i)` fonksiyonu içinde `NLa(t)` ile camelCase anahtarları dinamik olarak ayırarak üretir.
- **Çözüm:** `gDe` fonksiyonu içerisine genişletilmiş `_tr` sözlük haritası ve sözlükte doğrudan yer almayan bileşik ayarlar için otomatik örüntü çevirici (`_trF`) entegre edildi. Artık tüm alt ayar başlıkları anında Türkçeleştirilir.

