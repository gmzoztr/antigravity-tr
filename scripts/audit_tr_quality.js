const fs = require('fs');

const trJson = JSON.parse(fs.readFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\locales\\tr.json', 'utf8'));
const gde = trJson.rules.workbench.find(r => r.replace && r.replace.includes('_cat'));
const trStart = gde.replace.indexOf(';const _tr=') + ';const _tr='.length;
const catCalcStart = gde.replace.indexOf(';const cat=');
const _tr = JSON.parse(gde.replace.slice(trStart, catCalcStart));

const knownTech = new Set([
  'CSS', 'HTML', 'JSON', 'URL', 'URI', 'Git', 'ANSI', 'UNC', 'PCRE', 'WSL', 'PTY', 'ConPTY',
  'SDK', 'AI', 'SQL', 'SSH', 'FTP', 'HTTP', 'HTTPS', 'SVG', 'PDF', 'XML', 'REPL', 'Ripgrep',
  'Tree-sitter', 'Node', 'SKU', 'DOM', 'API', 'ID', 'GPU', 'CPU', 'Windows', 'Linux', 'macOS',
  'CodeLens', 'Emmet', 'Shadow', 'PCRE2'
]);

// Turkish words that only contain ASCII letters (no special chars like ç, ğ, ı, ö, ş, ü)
const asciiTurkishWords = new Set([
  've', 'ile', 'veya', 'Aç', 'Kapat', 'Kaydet', 'Bul', 'Ara', 'Sil', 'Ekle', 'Seç',
  'Taşı', 'Kopyala', 'Yapıştır', 'Uygula', 'Durdur', 'Sonra', 'Önce', 'Geri', 'İleri',
  'Açık', 'Kapalı', 'Yok', 'Var', 'Evet', 'Hayır', 'Her', 'Zaman', 'Asla', 'Otomatik',
  'Manuel', 'Varsayılan', 'Özel', 'Basit', 'Gelişmiş', 'Statik', 'Dinamik', 'Sabit',
  'Esnek', 'Blok', 'Yatay', 'Dikey', 'Üst', 'Alt', 'Sol', 'Sağ', 'Orta', 'Büyük',
  'Küçük', 'Kompakt', 'Normal', 'Kısa', 'Uzun', 'Hızlı', 'Yavaş', 'Koyu', 'Kalın',
  'İtalik', 'Yeni', 'Eski', 'İlk', 'Son', 'Sonraki', 'Önceki', 'Birincil', 'İkincil',
  'Ana', 'Yan', 'Tek', 'Tüm', 'Yalnızca', 'Ayrı', 'Panel', 'Pencere', 'Sekme', 'Grup',
  'Terminal', 'Konsol', 'Menü', 'Modal', 'Rozet', 'Etiket', 'Simge', 'Düğme', 'Liste',
  'Tablo', 'Izgara', 'Satır', 'Sütun', 'Başlık', 'Bölüm', 'Bölge', 'Öğe', 'Bileşen',
  'Dosya', 'Klasör', 'Dizin', 'Yol', 'Karakter', 'Sözcük', 'Belirteç', 'Tür', 'Değer',
  'Anahtar', 'Ad', 'Yorum', 'Kod', 'Komut', 'Eylem', 'Olay', 'Sinyal', 'Ayar', 'Seçenek',
  'Mod', 'Stil', 'Tema', 'Renk', 'Boyutu', 'Genişliği', 'Derinliği', 'Uzunluğu', 'Sayısı',
  'Sınırı', 'Gecikme', 'Aralık', 'Süre', 'Düzeyi', 'Konumu', 'Kapsam', 'Kaynak', 'Hedef',
  'Girdi', 'Çıktı', 'Veri', 'İçerik', 'Metin', 'İleti', 'Hata', 'Uyarı', 'Bilgi', 'Durum',
  'Geçmişi', 'Günlük', 'İzleme', 'Profil', 'Uzantı', 'Eklenti', 'Dil', 'Proje', 'Depo',
  'Dal', 'İmleç', 'Seçim', 'Vurgula', 'Süsleme', 'Ayraç', 'Girinti', 'Kaydır', 'Katlama',
  'Anahat', 'Tamamlama', 'Öneri', 'Şablon', 'Tanım', 'Başvuru', 'Bildirim', 'Uygulama',
  'Git', 'Lint', 'Test', 'Kapsam', 'Görev', 'Performans', 'Bellek', 'Önbellek', 'Ağ',
  'Proxy', 'Sertifika', 'Deneysel', 'Telemetri', 'Sesli', 'Konuşma', 'Sinyaller', 'Depolar',
  'Katılımcılar', 'Algıla', 'Katılımcı', 'Ajan', 'Araçlar', 'İstekler', 'Listesi', 'Aracı',
  'Gönder', 'Sohbete', 'Gezinme', 'Sonuçlar', 'Düzenleme', 'Bölgeler', 'Dahili', 'Gecikmeler',
  'Seçenekler', 'Klavye', 'Fare', 'Ekran', 'Okuyucu', 'Seslendir', 'Optimize', 'Ayrıntılı',
  'İlerleme', 'Kabuk', 'Sürümü', 'Profiller', 'Düzelt', 'Yukarı', 'Ok', 'Gezinir', 'Çalıştır',
  'Harici', 'Denetim', 'Türü', 'Destek', 'Sanal', 'Genel', 'Gezgin', 'Başlangıç', 'Depola',
  'Sentezle', 'Anonim', 'Erişim', 'Dışla', 'Dahil', 'İzleyici', 'Yaz', 'Oku', 'Kodlama',
  'Tahmin', 'Kırp', 'Sondaki', 'Boşluk', 'Dizgiler', 'Yanıt', 'Yanıtlar', 'Tembel', 'Değişkenler',
  'Yürütme', 'Odaklan', 'Noktaları', 'Yerde', 'Çubuğu', 'Davranışı', 'Tıklama', 'Çizgi',
  'Görüntüler', 'Onayla', 'Denetle', 'Gözat', 'Odak', 'Etkin', 'Etkinleştir', 'İzin', 'Ver',
  'Devre', 'Dışı', 'Bırak', 'Göster', 'Gizle', 'Yeniden', 'Yükle', 'Yenile', 'Önizleme',
  'Daralt', 'Genişlet', 'Birleştir', 'Sırala', 'Filtrele', 'Biçimlendir', 'Doğrula',
  'Çalıştırılabilir', 'Uzantıları', 'Akor', 'Kısayolları', 'Kısayol', 'Harfleri', 'Zil',
  'Çalışanlar', 'Çalışan', 'Karartma', 'Odaksız', 'Değişmemiş', 'Birleştirmesi', 'Ayrıştırma',
  'Kontrol', 'Bağlam', 'Örtük', 'Düşünme', 'İş', 'Parçacığı', 'Erişilebilirlik', 'Ayrıntı',
  'Ses', 'Çalışma', 'Kümeleri', 'Yapılacaklar', 'Sözcükler', 'Karakterler', 'Satırlar',
  'Uygulamalar', 'Tanımlar', 'Bildirimler', 'Başvurular', 'Ayraçlar', 'Süslemeler', 'Renkler',
  'Kılavuzlar', 'Modlar', 'Defteri', 'Al', 'Kullan', 'Ayarla', 'Oluştur', 'Değiştir', 'Böl',
  'Sıfırla', 'İndir', 'Eşitle', 'Taşı', 'Boyutlandır', 'Büyük', 'Küçük', 'Soluk', 'Sığdır',
  'Doldur', 'Orantılı', 'Görünür', 'Gizli', 'Sözcük', 'Kaydırma', 'Ayraç', 'Çiftleri',
  'Renk', 'Havuzu', 'Zaman', 'Uyumsuz', 'Doğrulaması', 'Belirsiz', 'Görünmez', 'Renklendirilmiş',
  'Tohum', 'Pano', 'Ekstra', 'Döngü', 'Sabit', 'Gizleme', 'Aşağıda', 'Maksimum', 'Minimum',
  'Model', 'Çoklu', 'Alternatif', 'Yanda', 'Kayıt', 'İşaretçi', 'Enter', 'Taşmaya', 'Aria',
  'Zorunlu', 'Katman', 'İpucunu', 'Eşaralıklı', 'İyileştirmelerini', 'Salt', 'Okunur',
  'Taşma', 'Bölge', 'Tıklandığında', 'Çeşitleri', 'Üst', 'Üste', 'Binen', 'Birleştir',
  'Şeritleri', 'Farklı', 'İpuçları', 'Tutucu', 'Zengin', 'Yuvarlatılmış', 'Köşeleri', 'Baskın',
  'Eksende', 'Karakterden', 'İşlemeyi', 'İndeksi', 'Kaçışlı', 'Geçerli', 'Oranı', 'Odaklama',
  'Kümeleri'
]);

const suspicious = [];
for (const [en, tr] of Object.entries(_tr)) {
  const words = tr.split(/\s+/);
  for (const w of words) {
    const cleanW = w.replace(/[^A-Za-z]/g, '');
    if (cleanW.length > 1 && !knownTech.has(cleanW) && !asciiTurkishWords.has(cleanW)) {
      suspicious.push({ en, tr, word: cleanW });
    }
  }
}

console.log('Total labels in _tr:', Object.keys(_tr).length);
console.log('Labels with untranslated English words:', suspicious.length);

const uniqueUntranslatedWords = new Set(suspicious.map(x => x.word));
console.log('Unique untranslated words count:', uniqueUntranslatedWords.size);
console.log('Sample untranslated words:');
console.log(Array.from(uniqueUntranslatedWords).slice(0, 50));

fs.writeFileSync('C:\\Users\\Work-D\\source\\antigravity-tr\\scripts\\untranslated_words_in_tr.json', JSON.stringify({
  words: Array.from(uniqueUntranslatedWords).sort(),
  examples: suspicious.slice(0, 100)
}, null, 2), 'utf8');
