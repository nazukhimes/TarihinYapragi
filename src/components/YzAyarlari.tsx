import { useState } from "react";
import {
  ADAY_MODELLER,
  anahtarOku,
  anahtarSil,
  anahtarTemizle,
  anahtarYaz,
  aramaAcikMi,
  aramaYaz,
  modelleriGetir,
  modelOku,
  modelSil,
  modelYaz,
  saglayici,
  YZ_MESAJ,
  YzHatasi,
} from "../lib/yapayzeka";
import { IconExternal, IconSpark, Modal, toast } from "./ui";

/** "Bağlantıyı sına" isteği — kısa ve sabit, gerçek bir soru değil (T-24 madde 4). */
const SINAMA_ISTEMI = "Tek kelimeyle yanıtla: bağlantı.";
const SINAMA_BAGLAMI = "Bu, yapay zekâ bağlantısını sınamak için gönderilen kısa bir metindir.";

/** Ayarlar modalını **her yerden** açan olay — `toast` ile aynı desen. */
const AC = "ty-yz-ayarlar";

/**
 * Ayarlar ekranını açar.
 *
 * Panel, ağacın çok derinindeki bir detay kutusunun içinde; "Önce anahtarınızı
 * girin" uyarısından ayarlara gitmek için prop zinciri kurmak yerine
 * `ui.tsx`'teki `toast`un kullandığı olay deseni tekrarlanıyor.
 */
export function yzAyarlariniAc(): void {
  window.dispatchEvent(new CustomEvent(AC));
}

/** `App`'in aboneliği — modalı açık duruma geçirir. */
export function yzAyarlarinaAbone(geriCagri: () => void): () => void {
  window.addEventListener(AC, geriCagri);
  return () => window.removeEventListener(AC, geriCagri);
}

const ANAHTAR_ADRESI = "https://aistudio.google.com/apikey";

/**
 * YAPAY ZEKÂ AYARLARI (T-20 madde 2)
 *
 * Anahtar **kullanıcınındır**: buradan girilir, `localStorage`'da durur,
 * buradan silinir. Depoya, `.env`'e ya da sürüm kontrolüne hiçbir koşulda
 * yazılmaz — gerekçe `lib/yapayzeka/anahtar.ts` başlığında.
 */
export function YzAyarlari({ onClose }: { onClose: () => void }) {
  const [deger, setDeger] = useState(() => anahtarOku());
  const kayitli = anahtarOku();

  const [aramaAcik, setAramaAcik] = useState(() => aramaAcikMi());

  const [model, setModel] = useState(() => modelOku());
  const [modelListesi, setModelListesi] = useState<string[] | null>(null);
  const [modelYukleniyor, setModelYukleniyor] = useState(false);
  const [modelHata, setModelHata] = useState<string | null>(null);

  const [sinaniyor, setSinaniyor] = useState(false);
  const [sinamaSonucu, setSinamaSonucu] = useState<{ basarili: boolean; mesaj: string } | null>(
    null
  );

  const kaydet = () => {
    // `trim()` değil `anahtarTemizle()`: yapıştırılan anahtarın ortasında
    // kalan görünmez karakter de burada düşsün, bir alt katmanda değil.
    const temiz = anahtarTemizle(deger);
    if (!temiz) return;
    anahtarYaz(temiz);
    toast("Anahtar bu tarayıcıya kaydedildi");
    onClose();
  };

  const sil = () => {
    anahtarSil();
    setDeger("");
    toast("Anahtar silindi");
  };

  const aramaDegistir = () => {
    const yeni = !aramaAcik;
    aramaYaz(yeni);
    setAramaAcik(yeni);
  };

  const modelleriGetirTikla = async () => {
    setModelYukleniyor(true);
    setModelHata(null);
    try {
      const liste = await modelleriGetir();
      setModelListesi(liste);
      if (!liste.length) setModelHata(YZ_MESAJ.modelListesiBos);
    } catch (e) {
      setModelHata(e instanceof YzHatasi ? e.message : YZ_MESAJ.ag);
    } finally {
      setModelYukleniyor(false);
    }
  };

  const modelSec = (secilen: string) => {
    if (!secilen) return;
    modelYaz(secilen);
    setModel(secilen);
    toast(`Model kaydedildi: ${secilen}`);
  };

  const varsayilanaDon = () => {
    modelSil();
    setModel("");
    toast("Model seçimi temizlendi, otomatik zincire dönüldü");
  };

  const baglantiyiSina = async () => {
    setSinaniyor(true);
    setSinamaSonucu(null);
    try {
      // Sınama tanı aracıdır; günlük arama kotasını yakmamalı (T-25 madde 7).
      await saglayici.sor({ soru: SINAMA_ISTEMI, baglam: SINAMA_BAGLAMI, arama: false });
      setModel(modelOku());
      setSinamaSonucu({
        basarili: true,
        mesaj: `${YZ_MESAJ.baglantiTamam} (${modelOku() || ADAY_MODELLER[0]})`,
      });
    } catch (e) {
      setSinamaSonucu({
        basarili: false,
        mesaj: e instanceof YzHatasi ? e.message : YZ_MESAJ.ag,
      });
    } finally {
      setSinaniyor(false);
    }
  };

  return (
    <Modal onClose={onClose} titleId="yz-ayar-baslik">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3
            id="yz-ayar-baslik"
            className="flex items-center gap-2.5 font-display font-bold text-2xl text-ink"
          >
            <span className="text-lilac">
              <IconSpark className="w-5 h-5" />
            </span>
            Yapay Zekâ Ayarları
          </h3>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="w-9 h-9 shrink-0 grid place-items-center rounded-sm border border-line text-ink-dim hover:text-brand hover:border-brand transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-[14px] leading-relaxed text-ink-dim">
          Detay panellerindeki <strong className="text-ink">Yapay zekâya sor</strong> bölümü,
          Vikipedi metnini {saglayici.ad}&apos;ye açıklatır. Bunun için{" "}
          <strong className="text-ink">kendi anahtarınız</strong> gerekir.
        </p>

        <label className="block mt-6">
          <span className="block font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
            {saglayici.ad} API anahtarı
          </span>
          <input
            type="password"
            value={deger}
            onChange={(e) => setDeger(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && kaydet()}
            autoComplete="off"
            spellCheck={false}
            placeholder="Anahtarınızı buraya yapıştırın"
            className="w-full px-3.5 py-2.5 rounded-sm bg-panel-2 border border-line font-mono text-[13px] text-ink placeholder:text-ink-faint outline-none focus:border-gold/70 focus:shadow-[0_0_0_3px_rgba(232,176,75,0.12)] transition-all duration-200"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={kaydet}
            disabled={!deger.trim()}
            className="px-4 py-2.5 rounded-sm bg-brand text-paper font-mono text-[11.5px] tracking-[0.18em] uppercase font-semibold hover:bg-brand-deep transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Kaydet
          </button>
          {kayitli && (
            <button
              onClick={sil}
              className="px-4 py-2.5 rounded-sm border border-line text-ink-dim font-mono text-[11.5px] tracking-[0.18em] uppercase hover:text-brand-text hover:border-brand/60 transition-colors duration-200 cursor-pointer"
            >
              Anahtarı sil
            </button>
          )}
          <a
            href={ANAHTAR_ADRESI}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11.5px] tracking-wider uppercase text-ink-faint hover:text-gold transition-colors"
          >
            Anahtar al <IconExternal className="w-3.5 h-3.5" />
          </a>
        </div>

        {kayitli && (
          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="block font-mono text-[11px] tracking-[0.24em] uppercase text-gold">
                Kullanılan model
              </span>
              {model && (
                <button
                  onClick={varsayilanaDon}
                  className="font-mono text-[10.5px] tracking-wider uppercase text-ink-faint hover:text-brand-text transition-colors cursor-pointer"
                >
                  Varsayılana dön
                </button>
              )}
            </div>
            <p className="font-mono text-[13px] text-ink mb-4">
              {model || ADAY_MODELLER[0]}
              {!model && <span className="text-ink-faint"> (otomatik aday zinciri)</span>}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void modelleriGetirTikla()}
                disabled={modelYukleniyor}
                className="px-4 py-2.5 rounded-sm border border-line text-ink-dim font-mono text-[11.5px] tracking-[0.18em] uppercase hover:text-brand-text hover:border-brand/60 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {modelYukleniyor ? "Getiriliyor…" : "Modelleri getir"}
              </button>
              <button
                onClick={() => void baglantiyiSina()}
                disabled={sinaniyor}
                className="px-4 py-2.5 rounded-sm border border-line text-ink-dim font-mono text-[11.5px] tracking-[0.18em] uppercase hover:text-brand-text hover:border-brand/60 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sinaniyor ? "Sınanıyor…" : "Bağlantıyı sına"}
              </button>
            </div>

            {modelListesi && modelListesi.length > 0 && (
              <label className="block mt-3">
                <span className="sr-only">Model seç</span>
                <select
                  value={model && modelListesi.includes(model) ? model : ""}
                  onChange={(e) => modelSec(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-sm bg-panel-2 border border-line font-mono text-[13px] text-ink outline-none focus:border-gold/70 transition-all duration-200"
                >
                  <option value="" disabled>
                    Bir model seçin…
                  </option>
                  {modelListesi.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {modelHata && (
              <p className="mt-3 text-[13px] text-brand-text" role="status">
                {modelHata}
              </p>
            )}

            {sinamaSonucu && (
              <p
                className={`mt-3 text-[13px] ${sinamaSonucu.basarili ? "text-ink" : "text-brand-text"}`}
                role="status"
              >
                {sinamaSonucu.mesaj}
              </p>
            )}
          </div>
        )}

        {kayitli && (
          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="block font-mono text-[11px] tracking-[0.24em] uppercase text-gold">
                Web&apos;de araştır
              </span>
              <button
                onClick={aramaDegistir}
                role="switch"
                aria-checked={aramaAcik}
                className={`relative w-11 h-6 shrink-0 rounded-full border transition-colors duration-200 cursor-pointer ${
                  aramaAcik ? "bg-lilac/70 border-lilac" : "bg-panel-2 border-line"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-paper transition-transform duration-200 ${
                    aramaAcik ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
              Açıkken model, Vikipedi özetiyle sınırlı kalmadan olayı Google Arama ile araştırır ve
              kaynaklarını gösterir.
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink-faint">
              Ücretsiz katmanda günlük arama hakkı sınırlıdır; dolduğunda yanıt sayfadaki metinle
              üretilir.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-sm border border-dashed border-line bg-panel-2/50 px-4 py-3.5 text-[13px] leading-relaxed text-ink-dim">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ink-faint mb-2">
            Anahtarınız nerede duruyor
          </p>
          <p>
            Yalnızca <strong className="text-ink">bu tarayıcıda</strong>. Sunucumuz yok; anahtar
            hiçbir yere gönderilmez, yalnızca {saglayici.ad}&apos;ye giden isteğin başlığında
            kullanılır. Tarayıcı verilerini temizlerseniz silinir.
          </p>
          <p className="mt-2">
            Ortak bir bilgisayardaysanız işiniz bitince{" "}
            <strong className="text-ink">Anahtarı sil</strong> deyin.
          </p>
        </div>
      </div>
    </Modal>
  );
}
