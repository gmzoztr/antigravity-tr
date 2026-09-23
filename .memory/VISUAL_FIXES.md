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

## 9. Metin Düzenleyici Ayar Başlıkları (Tam İfadeler & Frankenstein Kelime Engeli)
- **Görsel:** `media_1790092728641.png` - Ayarlar > Metin Düzenleyici altındaki karmaşık ayar başlıkları.
- **Sorun:** Naif regex alt dize değiştiricileri (`Indent` -> `Girinti`), `Auto Indent On Paste` gibi ifadeleri `Auto Girinti On Paste` veya `Independent Renk Pool` gibi hibrit/bozuk ifadelere dönüştürüyordu.
- **Çözüm:** Naif regex kaldırıldı. `src/settings_dictionary.js` içinde tam ifadeler (full phrase) eşlemesi tanımlandı:
  - `"Auto Indent On Paste"` -> `"Yapıştırırken Otomatik Girintile"`
  - `"Auto Indent On Paste Within String"` -> `"Dizgi İçinde Yapıştırırken Otomatik Girintile"`
  - `"Bracket Pair Colorization: Independent Color Pool Per Bracket Type"` -> `"Ayraç Çifti Renklendirmesi: Ayraç Türü Başına Bağımsız Renk Havuzu"`
  - `"Code Actions: Trigger On Focus Change"` -> `"Kod Eylemleri: Odak Değiştiğinde Tetikle"`
  - Eşleşmeyen terimler temiz İngilizce bırakılarak açıklama metinleri ve kod referansları (`afterDelay`) bozulmaktan korundu.

---

## 10. Başlık Çubuğu Büyüteç Tooltip'i (Hızlı Aç / Quick Open)
- **Görsel:** `media_1790092679030.png` - Üst başlık çubuğu büyüteç ikonuna gelindiğinde çıkan `Quick Open` ipucu.
- **Kaynak Dosya:** `resources/app/out/nls.messages.json` (indeks 4199: `titlebarPart.quickOpen`) ve `translations/main.i18n.json`.
- **Teknik Neden:** Başlık çubuğu aksiyonu (`workbench.action.quickOpenWithModes`), `p(4199, null)` çağrısı yapıyordu. Daha önce sadece 3308 yamalandığı için 4199 İngilizce kalmıştı.
- **Çözüm:** İndeks 4199 `nlsMessages` kurallarına eklendi ve Türkçe dil paketinin `main.i18n.json` dosyasına `quickOpen: "Hızlı Aç"` yazıldı.

---

## 11. Durum Çubuğu Antigravity Ayarları
- **Görsel:** `media_1790092697072.png` - Sağ alttaki `Antigravity - Settings` butonu.
- **Kaynak Dosya:** `resources/app/extensions/antigravity/dist/extension.js`.
- **Teknik Neden:** Google Antigravity eklentisi durum çubuğu öğesini `"Antigravity - Settings"` dizesiyle hardcoded oluşturur.
- **Çözüm:** `patchAntigravityExtension()` fonksiyonu ile eklenti dosyasında `"Antigravity - Ayarlar"` olarak yamalandı.

---

## 12. Eklenti Salt Okunur (Read-Only) Dosya İzinleri
- **Görsel:** `media_1790092697072.png` - Sol alttaki `(no project)` göstergesi.
- **Kaynak Dosya:** `extensions/googlecloudtools.datacloud-0.11.0-universal/datacloud_vscode.js`.
- **Teknik Neden:** Windows üzerinde VS Code tarafından kurulan eklenti dosyaları salt okunur (`+R / ReadOnly`) öznitelikle korunur. `fs.writeFileSync` çağrısı `EPERM` hatası veriyordu.
- **Çözüm:** Yama öncesinde `fs.chmodSync(filePath, 0o666)` çalıştırılarak dosya yazılabilir yapıldı ve `(no project)` -> `(proje seçilmedi)` kalıcı olarak uygulandı.

---

## 13. Çok Seviyeli Kategori Segmentleri ve Ayar Yaprak Etiketleri (Nihai Mimari)
- **Görsel:** `media_1790093708040.png` - Ayarlar > Metin Düzenleyici altındaki `Code Action Widget: Show Headers`, `Bracket Pair Colorization: Independent Color Pool Per Bracket Type` gibi bileşik başlıklar.
- **Teknik Neden:** VS Code `gDe(t, e, i)` fonksiyonu ayar kategorisini `r` (`Editor › Bracket Pair Colorization` gibi çok parçalı), ayar adını ise `s` (`Show Headers`, `Independent Color Pool Per Bracket Type` gibi yaprak etiket) olarak ayrı ayrı üretip UI'da iki nokta (`: `) ile birleştirir. `_trCats` sadece tek parça aradığı için çok seviyeli kategorileri kaçırıyordu.
- **Kök Çözüm:**
  - Tüm IDE taranarak 203 benzersiz kategori segmenti (`r_segments.json`) ve yaprak etiketler (`s_labels.json`) otomatik ayrıştırıldı.
  - `gDe` fonksiyonuna segment-bazlı kategori çevirisi eklendi:
    `const cat = r.split(' \u203A ').map(seg => _cat[seg] || seg).join(' \u203A ');`
  - Bu sayede `Bracket Pair Colorization` otomatik olarak `Ayraç Çifti Renklendirmesi`, `Code Actions` -> `Kod Eylemleri`, `Code Action Widget` -> `Kod Eylemi Pencere Öğesi` haline gelir.
  - Yaprak etiketler `_tr` ile birleştiğinde UI'da:
    - `Ayraç Çifti Renklendirmesi: Ayraç Türü Başına Bağımsız Renk Havuzu`
    - `Kod Eylemi Pencere Öğesi: Başlıkları Göster`
    - `Kod Eylemleri: Odak Değiştiğinde Tetikle`
    eksiksiz ve doğal Türkçe olarak ekrana basılır.

---

## 14. Antigravity Durum Çubuğu Hızlı Menüsü (Ajan, Sekme ve Ayarlar)
- **Görsel:** `media_1790172897898.png` ve `media_1790172906870.png` - Sağ alttaki `Antigravity - Ayarlar` tıklandığında açılan menü.
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js` (`FSr`, `NSr`, `_getSettingsItems()`).
- **Yamalanan Alanlar:**
  - `S8.CASCADE` başlığı: `Agent` -> `Ajan`
  - `Auto Execution` -> `Otomatik Çalıştırma`
  - `Review Policy` -> `İnceleme İlkesi` (`Agent Decides` -> `Ajan Karar Versin`)
  - `Suggestions in Editor` -> `Düzenleyicide Öneriler`
  - `Tab Gitignore Access` -> `Tab Gitignore Erişimi`
  - `Tab Speed` -> `Tab Hızı` (`Slow` -> `Yavaş`, `Fast` -> `Hızlı`)
  - `Tab to Import` -> `İçe Aktarmalar İçin Tab`
  - `Tab to Jump` -> `Atlama İçin Tab`
  - `Open Command` -> `Komutu Aç`
  - `Open Agent` -> `Ajanı Aç`
  - `Customizations` -> `Özelleştirmeler`, `Manage` -> `Yönet`
  - `Snooze` -> `Ertele`, `Start` -> `Başlat`, `Cancel` -> `İptal`
  - `Advanced Settings` -> `Gelişmiş Ayarlar`
  - Sekme Adı: `AI Shortcuts` -> `Yapay Zeka Kısayolları`
  - Alt Bağlantı: `View all Antigravity IDE shortcuts` -> `Tüm Antigravity IDE kısayollarını görüntüle`

---

## 15. Başlık Çubuğu Kullanıcı Profil Butonu
- **Görsel:** `media_1790172933744.png` - Sağ üstteki kullanıcı avatarı ikonu üzerine gelindiğinde çıkan tooltip.
- **İngilizce Metin:** `Profile`
- **Türkçe Karşılık:** `Profil`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js` (`name: p(4027, null)`)
- **Çözüm:** `name: "Profil"` olarak doğrudan yamalandı.

---

## 16. Uzantılar Pazar Yeri Open VSX Bilgilendirme Metni
- **Görsel:** `media_1790172858973.png` - Uzantılar kenar çubuğunda arama kutusu altındaki bilgilendirme metni.
- **İngilizce Metin:** `By default, Antigravity IDE uses Open VSX as a marketplace. This can be changed in Antigravity IDE settings.`
- **Türkçe Karşılık:** `Varsayılan olarak Antigravity IDE, pazar yeri olarak Open VSX kullanır. Bu ayar, Antigravity IDE ayarlarından değiştirilebilir.`
- **Kaynak Dosya:** `resources/app/out/vs/workbench/workbench.desktop.main.js`

---

## 17. Durum Çubuğu Google Hesabı Tooltip'i
- **Görsel:** `media_1790172868521.png` - Sağ alttaki e-posta üzerine gelindiğinde çıkan tooltip.
- **İngilizce Metin:** `Signed in as user@gmail.com`
- **Türkçe Karşılık:** `Şununla oturum açıldı: user@gmail.com`
- **Kaynak Dosya:** `extensions/googlecloudtools.datacloud-0.11.0-universal/datacloud_vscode.js`




