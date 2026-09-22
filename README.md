# Antigravity Türkçe Yerelleştirme Paketi 🇹🇷

Google Antigravity ve Antigravity IDE için **kapsamlı Türkçe dil desteği**, **akıllı yapay zeka davranış kuralları** ve **özel bileşen yama aracı**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen.svg)]()
[![Antigravity](https://img.shields.io/badge/Google%20Antigravity-IDE%20%26%20Desktop-orange.svg)]()

---

## 🌟 Neler İçerir?

| Katman | Kapsam | Açıklama |
| :--- | :--- | :--- |
| 🧠 **Yapay Zeka Asistanı** | `GEMINI.md` | Antigravity AI asistanının düşünce akışını, araç bildirimlerini (*"Dosya okunuyor"*, *"Test çalıştırılıyor"*), planlama şablonlarını (*Uygulama Planı*, *Uygulama Özeti*) ve iletişim dilini akıcı Türkçeye çevirir. |
| 🖥️ **IDE Arayüzü** | `VS Code Entegrasyonu` | Tüm menüleri (Dosya, Düzenle, Görünüm, Terminal, Gezgin, Git vb.) ve ayarlar panelini Türkçe yapar. |
| 🎯 **Özel Google Yamaları** | `Patcher Motoru` | Resmi Microsoft dil paketinde bulunmayan, Google'a özgü özel butonları (**"Record Audio"** ➔ *"Ses Kaydet"*, **"Editor-Specific Settings"** ➔ *"Editöre Özel Ayarlar"*, vb.) güvenle yamalar. |
| 🛡️ **Güvenli Yedekleme** | `.bak Sistemi` | Yapılan tüm dosya değişiklikleri öncesinde otomatik yedek alır; dilediğiniz zaman tek komutla orijinal haline döndürülebilir. |

---

## 🚀 Hızlı Kurulum

### Yöntem 1: PowerShell ile Tek Komut (Windows)

PowerShell pencerenizi açın ve şu komutu çalıştırın:

```powershell
irm https://raw.githubusercontent.com/gmzoztr/antigravity-tr/main/install.ps1 | iex
```

### Yöntem 2: NPX ile Kurulum (Çapraz Platform)

```bash
npx antigravity-tr
```

### Yöntem 3: Depoyu Klonlayarak Kurulum

```bash
git clone https://github.com/gmzoztr/antigravity-tr.git
cd antigravity-tr
node bin/antigravity-tr.js install
```

> [!NOTE]
> Kurulum tamamlandıktan sonra değişikliklerin devreye girmesi için açık olan Antigravity ve Antigravity IDE pencerelerini bir kez kapatıp yeniden başlatmanız gerekir.

---

## 🔄 Güncellemelerden Sonra Ne Olur?

Google Antigravity güncellendiğinde arayüz bundle dosyaları orijinal haline dönebilir. Böyle bir durumda tek yapmanız gereken kurulum komutunu tekrar çalıştırmaktır:

```bash
npx antigravity-tr install
```

---

## ↩️ Geri Alma / Orijinale Dönüş (Uninstall)

Tüm Türkçe ayarları ve yama dosyalarını orijinal haline döndürmek için:

```bash
npx antigravity-tr restore
```
Veya PowerShell ile:
```powershell
.\restore.ps1
```

---

## 📂 Proje Yapısı

```
antigravity-tr/
├── locales/
│   └── tr.json          # Google/Antigravity'ye özgü arayüz metinleri sözlüğü
├── rules/
│   └── GEMINI.md        # Antigravity yapay zeka Türkçe davranış yönergeleri
├── src/
│   ├── config.js        # Platform ve dizin tespit modülü
│   ├── patcher.js       # Güvenli yedeklemeli yama ve restore motoru
│   └── installer.js     # Tam kurulum ve dil senkronizasyon yöneticisi
├── bin/
│   └── antigravity-tr.js# CLI çalıştırılabilir giriş noktası
├── install.ps1          # Tek satırlık Windows kurulum betiği
├── restore.ps1          # Tek satırlık orijinal ayarlara dönüş betiği
└── package.json
```

---

## 🤝 Katkıda Bulunma

Eksik gördüğünüz çevirileri veya yeni gelen Antigravity butonlarını eklemek için lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını inceleyin. Her türlü Pull Request ve geri bildirim memnuniyetle karşılanır!

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında açık kaynak olarak dağıtılmaktadır.
