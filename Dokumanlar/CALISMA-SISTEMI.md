# ÇALIŞMA SİSTEMİ — Plan ve Talimat Akışı

> Bu projede iş, **plan → talimat → uygulama → arşiv** döngüsüyle yürür.
> Bu belge o döngünün kurallarını tanımlar. Yeni bir plan başlatmadan önce okuyun.
>
> **Son güncelleme:** 2026-08-21

---

## 1. Neden Böyle Bir Sistem?

Bir uygulamanın tamamı tek oturumda yazılamaz. İş parçalara bölünmezse:
yarım kalan işler unutulur, aynı dosyaya iki farklı yönde dokunulur,
neyin bittiği belirsizleşir.

Bu sistem üç şeyi garanti eder:

1. **Kapsam netliği** — Her talimat tek bir işi tanımlar, sınırı yazılıdır.
2. **Bitmişlik ölçüsü** — Her talimatın kabul kriterleri vardır; "bitti" bir histir değil, bir testtir.
3. **İzlenebilirlik** — Klasörün kendisi ilerleme panosudur. Bakınca nerede olduğunuz görünür.

---

## 2. Klasör Yapısı

```
Talimatlar/
│
├── PLAN-01-temel-duzeltme-ve-tamamlama.md    ← AKTİF PLAN
├── T-01-....md                               ← AKTİF TALİMATLAR (bekleyen)
├── T-02-....md
├── ...
│
├── Tamamlandı/          ← Biten talimatlar buraya taşınır
│   ├── T-01-....md
│   └── T-02-....md
│
└── Plan/                ← Tüm talimatları biten planlar buraya taşınır
    └── PLAN-01-....md
```

### Kural

| Klasör | Anlamı |
|---|---|
| `Talimatlar/` **kökü** | Yapılacak iş. Burada dosya varsa iş bitmemiştir. |
| `Talimatlar/Tamamlandı/` | Bitmiş talimatlar. Geçmiş kaydı — silinmez. |
| `Talimatlar/Plan/` | Tamamen bitmiş planlar. Proje tarihçesi. |

> **Kökte hiç `T-*.md` kalmadığında** plan tamamlanmıştır → plan dosyası `Plan/` klasörüne taşınır.

---

## 3. Döngü

```
   ┌─────────────────────────────────────────────────────────┐
   │  1. ANALİZ                                              │
   │     Kod okunur, uygulama çalıştırılır, eksikler kanıtla │
   │     tespit edilir → Dokumanlar/ANALIZ-RAPORU.md         │
   └───────────────────────┬─────────────────────────────────┘
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │  2. PLAN                                                │
   │     Bulgular fazlara ve talimatlara bölünür             │
   │     → Talimatlar/PLAN-NN-....md                         │
   └───────────────────────┬─────────────────────────────────┘
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │  3. TALİMAT YAZIMI                                      │
   │     Her iş parçası için tek dosya                       │
   │     → Talimatlar/T-NN-....md                            │
   └───────────────────────┬─────────────────────────────────┘
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │  4. UYGULAMA  (talimat başına bir oturum)               │
   │     · Talimat okunur                                    │
   │     · Yalnızca o talimatın kapsamı değiştirilir         │
   │     · Kabul kriterleri tek tek doğrulanır               │
   │     · typecheck + build yeşil olmalı                    │
   └───────────────────────┬─────────────────────────────────┘
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │  5. KAPANIŞ                                             │
   │     · Talimatın "Tamamlanma Kaydı" doldurulur           │
   │     · Dosya → Tamamlandı/                               │
   │     · PLAN dosyasındaki ilerleme tablosu güncellenir    │
   └───────────────────────┬─────────────────────────────────┘
                           ▼
              Kökte T-*.md kaldı mı?
                    │           │
                 EVET          HAYIR
                    │             │
                    └──► 4'e     ▼
                              PLAN → Plan/ klasörüne
                              BAGLAM.md güncellenir
                              Yeni analiz → 1'e
```

---

## 4. Adlandırma Kuralları

| Tür | Kalıp | Örnek |
|---|---|---|
| Plan | `PLAN-NN-kisa-slug.md` | `PLAN-01-temel-duzeltme-ve-tamamlama.md` |
| Talimat | `T-NN-kisa-slug.md` | `T-03-takvim-tarih-dogrulugu.md` |

- `NN` iki haneli, sıfır dolgulu (`01`, `02`, … `14`).
- Slug **ASCII**: Türkçe karakter yok, boşluk yok, küçük harf, tire ayraçlı.
  (Dosya *içeriği* Türkçe'dir — yalnızca dosya **adı** ASCII.)
- Numara **asla yeniden kullanılmaz.** T-05 tamamlandıysa, yeni bir iş T-15 olur.
- Plan içindeki talimat sırası = uygulama sırası değildir; bağımlılıklar plan tablosunda yazılıdır.

---

## 5. Talimat Dosyası Şablonu

Her `T-NN-*.md` dosyası şu bölümleri **eksiksiz** taşır:

```markdown
# T-NN · [Başlık]

| Alan | Değer |
|---|---|
| **Faz** | FAZ n — [ad] |
| **Öncelik** | Kritik / Yüksek / Orta / Düşük |
| **Tahmini süre** | ~n saat |
| **Bağımlılık** | T-xx tamamlanmış olmalı / Yok |
| **İlgili bulgu** | K-n, O-n, U-n |
| **Durum** | ⬜ Bekliyor |

## 🎯 Amaç
[Tek paragraf: bu talimat bitince ne değişmiş olacak]

## 📍 Mevcut Durum
[Sorunun kanıtı — dosya:satır, kod parçası, ekran çıktısı]

## ✅ Yapılacaklar
[Numaralı, atomik adımlar. Her adım tek bir değişiklik.]

## 🚫 Kapsam Dışı
[Bu talimatta KESİNLİKLE dokunulmayacaklar — hangi talimata ait olduğuyla]

## ☑️ Kabul Kriterleri
- [ ] Doğrulanabilir madde
- [ ] `npm run typecheck` hatasız
- [ ] `npm run build` hatasız

## 🧪 Doğrulama
[Kriterlerin nasıl test edileceği — komut, tıklama adımı, beklenen çıktı]

## 📝 Tamamlanma Kaydı
> Talimat bitince doldurulur.
- **Tamamlanma tarihi:**
- **Değişen dosyalar:**
- **Sapmalar / notlar:**
- **Sonraki talimata not:**
```

---

## 6. Uygulama Kuralları

### 6.1 Kapsam disiplini

> **Bir talimat, yalnızca kendi kapsamına dokunur.**

Talimatı uygularken başka bir eksik fark ederseniz:

- ❌ Düzeltmeyin.
- ✅ İlgili talimatın dosyasına bir not düşün veya plana yeni bir talimat ekleyin.
- ✅ Kendi talimatınızın *Tamamlanma Kaydı → Sonraki talimata not* alanına yazın.

Sebebi: kapsam kayması, incelemeyi imkânsızlaştırır ve "neyin neyi bozduğu" izini yok eder.

### 6.2 Yeşil kapı

Hiçbir talimat şu ikisi geçmeden kapatılmaz:

```bash
npm run typecheck
```

```bash
npm run build
```

### 6.3 Görsel doğrulama

Arayüze dokunan her talimat, tarayıcıda **en az 3 farklı günde** denenir:

1. **Özel dosyalı bir gün** — örn. `29 Ekim` (editör içeriği dolu)
2. **Sıradan bir gün** — örn. `7 Mart` (yalnızca otomatik içerik)
3. **29 Şubat** — kenar durum

### 6.4 Türkçe karakter ve kodlama

- Tüm `.md`, `.ts`, `.tsx`, `.css` dosyaları **UTF-8, BOM'suz**.
- `.bat` dosyaları **UTF-8 BOM'suz + CRLF satır sonu** (BOM varsa cmd hata verir).
- Küçük harfe çevirmede daima `toLocaleLowerCase("tr-TR")`.

### 6.5 Sürüm kontrolü

- Her talimat için ayrı bir dal (branch): `talimat/T-NN-kisa-slug`
- Commit mesajı Türkçe, ilk satırda talimat numarası:
  `T-03: takvim gün sayısı artık yıl hatası düzeltildi`
- Talimat kapanınca `main`'e birleştirilir.

---

## 7. Kapanış Kontrol Listesi

### Bir talimat kapatılırken

- [ ] Tüm kabul kriterleri işaretli
- [ ] `npm run typecheck` yeşil
- [ ] `npm run build` yeşil
- [ ] 3 günde görsel doğrulama yapıldı
- [ ] *Tamamlanma Kaydı* dolduruldu
- [ ] Dosya `Talimatlar/Tamamlandı/` klasörüne taşındı
- [ ] `PLAN-NN` içindeki ilerleme tablosunda durum `✅` yapıldı

### Bir plan kapatılırken

- [ ] `Talimatlar/` kökünde hiç `T-*.md` kalmadı
- [ ] Plan dosyasının *Kapanış Özeti* bölümü dolduruldu
- [ ] `Dokumanlar/BAGLAM.md` → *Mevcut Durum* bölümü güncellendi
- [ ] `Dokumanlar/ANALIZ-RAPORU.md` → çözülen bulgular işaretlendi
- [ ] `Dokumanlar/KULLANIM-KILAVUZU.md` → yeni özellikler ve düzelen sorunlar yazıldı
- [ ] Plan dosyası `Talimatlar/Plan/` klasörüne taşındı

---

## 8. Taşıma Komutları

Talimat tamamlandığında:

```bash
git mv "Talimatlar/T-01-proje-kimligi-ve-bagimlilik-temizligi.md" "Talimatlar/Tamamlandı/"
```

Plan tamamlandığında:

```bash
git mv "Talimatlar/PLAN-01-temel-duzeltme-ve-tamamlama.md" "Talimatlar/Plan/"
```

> Git kullanmıyorsanız `move` (Windows) veya `mv` (Bash) da olur;
> `git mv` geçmişin izlenebilir kalmasını sağlar.

---

## 9. Yeni Plan Başlatma

Bir plan bittiğinde döngü baştan başlar:

1. Kod tabanı yeniden analiz edilir → `ANALIZ-RAPORU.md` **üzerine yazılır**
   (eski sürüm git geçmişinde durur).
2. Yeni bulgular fazlara bölünür → `PLAN-02-....md`
3. Talimat numaraları kaldığı yerden devam eder (T-15, T-16, …).

---

## 10. Özet — Tek Cümlelik Kurallar

1. Talimat kökte duruyorsa iş bitmemiştir.
2. Bir talimat tek bir işi yapar; gerisine dokunmaz.
3. Kabul kriteri geçilmeden hiçbir şey "tamam" değildir.
4. `typecheck` ve `build` yeşil değilse talimat kapanmaz.
5. Biten talimat `Tamamlandı/`, biten plan `Plan/` klasörüne gider.
6. Plan kapanırken belgeler güncellenir — yoksa bağlam çürür.
