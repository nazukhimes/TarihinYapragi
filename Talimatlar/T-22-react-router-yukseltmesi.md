# T-22 · `react-router` Güvenlik Yükseltmesi (6 → 7)

| Alan | Değer |
|---|---|
| **Faz** | FAZ 4 — Devir ve Temizlik |
| **Öncelik** | 🟢 Düşük (güvenlik: orta) |
| **Tahmini süre** | ~2 saat |
| **Bağımlılık** | Yok — ama **planın EN SONUNA bırakılmalıdır** |
| **İlgili bulgu** | O-13 |
| **Durum** | ⬜ Bekliyor |

> ⚠️ **Bu kırıcı bir yükseltmedir ve bilerek en sona bırakılmıştır.** Yönlendirme
> katmanı kırılırsa diğer altı talimatın görsel doğrulaması bulanır — hangi
> değişikliğin neyi bozduğu ayırt edilemez.

---

## 🎯 Amaç

`react-router`'daki iki orta seviye güvenlik danışma kaydını kapatmak ve
uygulamanın yönlendirmesini **davranış değişmeden** 7'ye taşımak.

---

## 📍 Mevcut Durum

### `npm audit` çıktısı (2026-08-31 doğrulaması)

```
react-router  6.0.0 - 7.17.0
Severity: moderate

· Open redirect via backslash in <Link> and useNavigate (CVE-2025-68470 bypass)
  GHSA-wrjc-x8rr-h8h6
· Arbitrary Constructor Injection via deserializeErrors() in React Router
  SSR Hydration
  GHSA-337j-9hxr-rhxg

fix available via `npm audit fix --force`
Will install react-router-dom@7.18.3, which is a breaking change
```

| | Değer |
|---|---|
| `package.json` | `"react-router-dom": "^6.8.0"` |
| Hedef | `7.18.3` (npm'deki güncel sürüm) |

### Risk değerlendirmesi

İkinci kayıt (`deserializeErrors`) **SSR hidrasyonu** ile ilgilidir; bu uygulama
tamamen istemci taraflı statik bir SPA olduğu için o yol hiç çalışmaz. Birinci
kayıt (open redirect) `<Link>` ve `useNavigate` üzerinden geçerlidir ve uygulama
ikisini de kullanır — asıl gerekçe budur.

### Etkilenecek dosyalar

| Dosya | Ne kullanıyor |
|---|---|
| `src/main.tsx` | `createBrowserRouter`, `RouterProvider`, `Navigate`, `errorElement` |
| `src/App.tsx` | `useParams`, `useNavigate` |
| `src/lib/slug.ts` | Doğrudan router API'si kullanmıyor ama URL sözleşmesini üretiyor |
| `src/components/NotFound.tsx` | Bağlantılar |

### Özel dikkat — T-09'un bulgusu

`MIMARI.md` §12.4: rota elemanında oluşan bir hata kök `ErrorBoundary`'ye
**ulaşmaz**; react-router kendi iç hata sınırını kullanır. Gerçek koruma
`errorElement`'tir ve bu T-09'da canlı doğrulanmıştır.

**Yükseltmeden sonra bu davranış yeniden doğrulanmalıdır.** v7'de hata sınırı
davranışı değişmiş olabilir.

---

## ✅ Yapılacaklar

1. **Ayrı bir dal aç:** `talimat/T-22-react-router-yukseltmesi`
   (`CALISMA-SISTEMI.md` §6.5).

2. **Yükseltmeyi yap:**
   ```bash
   npm install react-router-dom@7
   ```
   `npm audit fix --force` yerine doğrudan kurulum tercih edilir — `--force`
   başka paketleri de habersiz değiştirebilir.

3. **v7 göç rehberini uygula.** Kırıcı değişiklikleri tek tek gözden geçir:
   - `createBrowserRouter` imzası
   - `RouterProvider` propları
   - `errorElement` → v7'de `ErrorBoundary` alanına taşınmış olabilir
   - `Navigate` / `useNavigate` davranışı
   - Future flag'lerin artık varsayılan olması

4. **Kanonik yönlendirmeyi doğrula.** `App.tsx`'teki sayısal → ad biçimi
   yönlendirmesi (`/08-21` → `/21-agustos`, `replace: true`) çalışmaya devam etmeli.

5. **`errorElement` davranışını yeniden doğrula** (yukarıdaki T-09 notu).
   Rota bileşenine bilerek bir hata attırıp `RouteErrorFallback`'in çıktığını
   görün; kök `ErrorBoundary`'nin devreye girmediğini teyit edin.

6. **`npm audit` temiz dönmeli.**

7. **Bulgu belgelerini güncelle:** `ANALIZ-RAPORU.md` §O-13 çözüldü olarak
   işaretlenir; `MIMARI.md` §12 sürüm bilgisi güncellenir.

---

## 🚫 Kapsam Dışı

| Konu | Neden |
|---|---|
| Yeni rota eklemek (`/olay/...` gibi) | Plan §2 — kapsam dışı |
| URL şemasını değiştirmek | T-06'nın kurduğu sözleşme korunur |
| Data router / loader / action özelliklerine geçmek | Bu bir **güvenlik yükseltmesidir**, mimari değişikliği değil |
| Diğer bağımlılıkların yükseltilmesi | Ayrı iş; bu talimat yalnızca `react-router-dom` |
| React 18 → 19 | Bu talimatta yok |

---

## ☑️ Kabul Kriterleri

- [ ] `npm audit` → **0 açık** (en azından `react-router` kaynaklı 0)
- [ ] `package.json` → `react-router-dom` 7.x
- [ ] `/` kökü bugünün gününe yönlendiriyor
- [ ] `/08-21` → `/21-agustos` kanonik yönlendirmesi çalışıyor (adres çubuğunda)
- [ ] Geçersiz slug (`/abc`) → `NotFound`
- [ ] Tarayıcı geri/ileri tuşu gün geçmişinde doğru çalışıyor
- [ ] `errorElement` hâlâ devrede (elle doğrulandı)
- [ ] `npm run kontrol` yeşil
- [ ] `ANALIZ-RAPORU.md` §O-13 çözüldü olarak işaretli

---

## 🧪 Doğrulama

```bash
npm audit
```

```bash
npm run kontrol
```

**Yönlendirme testi — sırayla:**

| Adres | Beklenen |
|---|---|
| `/` | Bugünün gününe yönlenir |
| `/08-21` | `/21-agustos` olarak yeniden yazılır |
| `/21-agustos` | Doğrudan açılır |
| `/29-subat` | Açılır (kenar durum) |
| `/abc` | `NotFound` |
| Geri tuşu | Önceki güne döner |

**Tarayıcıda (üç gün):** 29 Ekim · 7 Mart · 29 Şubat — her birinde gün gezinme
düğmeleri, mini takvim ve paylaş bağlantısı çalışmalı.

---

## 📝 Tamamlanma Kaydı

> Talimat bitince doldurulur.

- **Tamamlanma tarihi:**
- **Kurulan sürüm:**
- **Değişen dosyalar:**
- **Karşılaşılan kırıcı değişiklikler:**
- **`errorElement` davranışı (v7'de değişti mi):**
- **`npm audit` sonucu:**
- **Sapmalar / notlar:**
