# 🧠 antigravity-tr — AI Ajanı Devir-Teslim Hafızası

Bu dosya, projeye cold-start eden herhangi bir yapay zeka ajanının (Antigravity, Cursor, Claude Code, Copilot) projeyi anında kavraması için oluşturulmuştur.

---

## 🎯 Projenin Amacı ve Kapsamı
Google Antigravity ve Antigravity IDE (VS Code tabanlı) ortamını hem yapay zeka asistanı (`GEMINI.md`) hem de arayüz (VS Code + Google özel bileşenleri) düzeyinde eksiksiz Türkçeleştiren açık kaynak otomasyon aracı.

---

## 🏗️ Mimari ve Çekirdek Bileşenler

```
antigravity-tr/
├── .memory/               # AI devir-teslim ve görsel hafıza dokümanları
│   ├── MEMORY.md          # Bu dosya
│   ├── VISUAL_FIXES.md    # Kullanıcı görselleri ve kod düzeltme tablosu
│   └── UPDATE_RUNBOOK.md  # Güncelleme sonrası adım adım yama algoritması
├── locales/
│   └── tr.json            # 90+ Jetski, Workbench ve NLS çeviri kuralı
├── rules/
│   └── GEMINI.md          # Asistan Türkçe düşünce ve davranış yönergeleri
├── src/
│   ├── config.js          # Cross-platform dizin tespit modülü
│   ├── patcher.js         # Bundle AST/Regex yama + SHA256 Checksum onarıcı
│   ├── installer.js       # Tam kurulum, V8 önbellek temizleme, dil senkronizasyonu
│   └── scanner.js         # Koddan otomatik UI dizesi çıkaran araç (npm run scan)
├── bin/
│   └── antigravity-tr.js  # CLI giriş noktası
├── install.ps1            # Windows tek tık kurulum betiği
└── restore.ps1            # Fabrika ayarlarına dönüş betiği
```

---

## ⚠️ Kritik Kurallar ve Tuzaklar (Ajanların Dikkatine!)

1. **`product.json` Checksums Kuralı:**
   - `workbench.desktop.main.js` veya `jetskiAgent/main.js` dosyalarında 1 bayt bile değişirse, `product.json` içindeki Base64 SHA-256 hash'i güncellenmelidir (`src/patcher.js -> updateProductChecksums()`). Aksi halde editör *"yüklemeniz bozuk gibi görünüyor"* uyarısı verir.
2. **V8 Bytecode Cache Kuralı:**
   - Yama uygulandıktan sonra `AppData\Roaming\Antigravity IDE\Code Cache` ve `CachedData` klasörleri silinmelidir (`src/installer.js -> clearElectronCache()`). Aksi halde Electron RAM'deki eski kodu çalıştırmaya devam eder.
3. **Ayar Başlıkları (`Files: Auto Save`, `Editor: Font Size`):**
   - Bu başlıklar statik değildir! `workbench.desktop.main.js` içindeki `gDe()` fonksiyonu tarafından camelCase anahtarlardan dinamik üretilir. `gDe()` fonksiyonu yamalanmadan bu başlıklar Türkçeleştirilemez.
4. **Masaüstüne Asla Dosya Bırakma:**
   - Kullanıcının masaüstüne kesinlikle geçici veya kalıcı dosya atılmaz. Tüm işlemler proje dizininde veya geçici dizinlerde (`$env:TEMP`) yapılır.
