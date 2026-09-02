import { useEffect, useRef, useState } from "react";
import {
  saglayici,
  SORU_IPUCU,
  useAramaTercihi,
  useYzAnahtari,
  YZ_MESAJ,
  YzHatasi,
  type YzOlay,
} from "../lib/yapayzeka";
import { SkeletonParagraf } from "./Iskeletler";
import { IconArrow, IconExternal, IconSpark } from "./ui";
import { yzAyarlariniAc } from "./YzAyarlari";

/**
 * "YAPAY ZEKÂYA SOR" (T-20 madde 3–7, web araması T-25)
 *
 * `DetayPaneli`'nin T-19'da ayırdığı yuvayı doldurur. Panelin elindeki Vikipedi
 * metnini modele **bağlam olarak** verir; kullanıcı isterse kendi sorusunu yazar.
 * Ayarlardan arama açıksa (varsayılan budur, T-25 madde 7) model bağlamla
 * sınırlı kalmaz, olayı gerçekten web'de araştırır ve kaynaklarını gösterir.
 *
 * ## Kurallar, hepsi bilerek
 *
 * 1. **Bağlamsız çağrı yok.** `baglam` boşsa bölüm hiç render edilmez. Bağlamsız
 *    soru, arama kapalıyken modeli "hatırlamaya" zorlar (T-20 §Halüsinasyon Riski);
 *    arama açıkken de aramanın **neyi** hedefleyeceğini belirsizleştirir.
 * 2. **Otomatik çağrı yok.** İstek yalnızca düğmeye basılınca gider. Aksi hâlde
 *    her sayfa açılışı onlarca boşuna istek olurdu; ücretsiz kota bir günde biterdi.
 * 3. **Düz metin.** Model çıktısı React'in kendi metin düğümü olarak basılır;
 *    ham HTML basan hiçbir kaçış yolu kullanılmaz (T-20 madde 7, XSS yüzeyi).
 *
 * Hata hâlinde yalnızca bu bölüm bir satır Türkçe mesaj gösterir; panelin
 * Vikipedi içeriği, çipleri ve "Daha fazlasını oku"su yerinde kalır.
 */
export function YapayZekaBolumu({
  baglam,
  kaynakAdi,
  olay,
}: {
  /** Modelin dayanacağı metin — panelin gösterdiği Vikipedi özeti. */
  baglam: string;
  /** Bağlamın hangi maddeden geldiği; künye satırında geçer. Bilinmiyorsa yok. */
  kaynakAdi?: string;
  /** Modelin **neyi** araştıracağını söyleyen künye (T-25) — bağlam metninden
   *  bağımsızdır, arama modunun olayın kendisini hedeflemesini sağlar. */
  olay?: YzOlay;
}) {
  const anahtar = useYzAnahtari();
  const aramaAcik = useAramaTercihi();
  const [acik, setAcik] = useState(false);
  const [soru, setSoru] = useState("");
  const [yanit, setYanit] = useState<{
    soru: string;
    metin: string;
    arandi: boolean;
    kaynaklar: { baslik: string; url: string }[];
    sorgular: string[];
    aramaDesteklenmedi?: boolean;
  } | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const iptal = useRef<AbortController | null>(null);

  // Panel kapanırsa (detay kutusu kapandı, gün değişti) uçan istek iptal edilir.
  useEffect(() => () => iptal.current?.abort(), []);

  if (!baglam.trim()) return null;

  /**
   * `then/catch/finally` yerine `async` gövde: sonuç ve "yükleniyor bitti"
   * durumları **aynı** senkron blokta yazılıyor, React ikisini tek render'da
   * toparlıyor. Zincirli sürümde iki ayrı mikro görevde iki ayrı güncelleme
   * oluyor ve testlerde `act(...)` uyarısı çıkıyordu.
   */
  const sor = async () => {
    iptal.current?.abort();
    const ctrl = new AbortController();
    iptal.current = ctrl;

    const sorulan = soru.trim();
    setYukleniyor(true);
    setHata(null);
    setYanit(null);

    try {
      const cevap = await saglayici.sor({
        soru: sorulan,
        baglam,
        olay,
        arama: aramaAcik,
        signal: ctrl.signal,
      });
      if (!ctrl.signal.aborted) {
        setYanit({
          soru: sorulan,
          metin: cevap.metin,
          arandi: cevap.arandi,
          kaynaklar: cevap.kaynaklar,
          sorgular: cevap.sorgular,
          aramaDesteklenmedi: cevap.aramaDesteklenmedi,
        });
      }
    } catch (e) {
      // İptal bir hata değil: panel kapandı ya da yeni soru soruldu.
      if (!ctrl.signal.aborted) setHata(e instanceof YzHatasi ? e.message : YZ_MESAJ.ag);
    } finally {
      if (!ctrl.signal.aborted) setYukleniyor(false);
    }
  };

  // --- Anahtarsız durum: istek denenmez bile, kullanıcı ayarlara yönlendirilir.
  if (!anahtar) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <button
          onClick={yzAyarlariniAc}
          className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wider uppercase text-lilac transition-colors duration-200 hover:text-paper cursor-pointer"
        >
          <IconSpark className="w-3.5 h-3.5" />
          <span className="underline decoration-lilac/40 underline-offset-4 hover:decoration-paper">
            Önce anahtarınızı girin
          </span>
        </button>
        <span className="font-mono text-[11px] tracking-wider text-ink-faint">
          yapay zekâya sormak için
        </span>
      </div>
    );
  }

  // --- Kapalı durum: tek düğme. Soru kutusu her paneli doldurmasın diye gizli.
  if (!acik && !yanit && !yukleniyor && !hata) {
    return (
      <button
        onClick={() => setAcik(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wider uppercase text-lilac transition-colors duration-200 hover:text-paper cursor-pointer"
      >
        <IconSpark className="w-3.5 h-3.5" />
        <span className="underline decoration-lilac/40 underline-offset-4 hover:decoration-paper">
          Yapay zekâya sor
        </span>
        <IconArrow dir="down" className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={soru}
          onChange={(e) => setSoru(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !yukleniyor) void sor();
          }}
          type="text"
          aria-label="Yapay zekâya sorulacak soru"
          placeholder={SORU_IPUCU}
          className="flex-1 min-w-0 px-3.5 py-2 rounded-sm bg-panel-2 border border-line text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-lilac/70 transition-colors duration-200"
        />
        <button
          onClick={() => void sor()}
          disabled={yukleniyor}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm border border-lilac/50 bg-lilac/10 font-mono text-[11.5px] tracking-[0.18em] uppercase text-lilac hover:bg-lilac/20 hover:border-lilac transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <IconSpark className="w-3.5 h-3.5" />
          {yukleniyor ? "Soruluyor…" : "Sor"}
        </button>
      </div>
      <p className="mt-1.5 font-mono text-[10.5px] tracking-wide text-ink-faint">
        {aramaAcik
          ? "Boş bırakırsanız olayı araştırıp özetler"
          : "Boş bırakırsanız olayı kısaca açıklar"}
        {kaynakAdi ? ` · bağlam: ${kaynakAdi} maddesi` : ""}
      </p>

      {yukleniyor && (
        <div className="mt-3">
          <SkeletonParagraf />
        </div>
      )}

      {hata && (
        <p className="mt-3 text-[13px] text-brand-text" role="status">
          {hata}
        </p>
      )}

      {yanit && <YzYaniti {...yanit} />}
    </div>
  );
}

/**
 * Yanıt kutusu — **"YZ ÜRETİMİ" rozetiyle** (T-20 madde 5).
 *
 * Rozet rengi bilerek leylaktır: Editör altın, Otomatik nötr gri. Üç kaynak üç
 * ayrı renk taşır ki kullanıcı bakışta ayırsın — BAGLAM.md §1'in üçüncü ürün
 * ilkesi ("kaynağı gizleme") bu katman için de geçerli, hatta burada daha sert:
 * üretilmiş metin, derlenmiş metin gibi görünmemelidir.
 *
 * Künye cümlesi `arandi`ya göre değişir (T-25 madde 6.1): web'de arandıysa
 * bunu söyler ve kaynak listesine yönlendirir; aranmadıysa T-20'nin orijinal
 * "Vikipedi özetine dayanarak" cümlesi aynen kalır. Kutunun altındaki uyarı
 * satırı sabittir, kapatılamaz.
 */
function YzYaniti({
  soru,
  metin,
  arandi,
  kaynaklar,
  sorgular,
  aramaDesteklenmedi,
}: {
  soru: string;
  metin: string;
  arandi: boolean;
  kaynaklar: { baslik: string; url: string }[];
  sorgular: string[];
  aramaDesteklenmedi?: boolean;
}) {
  return (
    <div
      className="rise-in mt-3 rounded-sm border border-lilac/40 bg-lilac/[0.06] px-4 py-3"
      role="region"
      aria-label="Yapay zekâ yanıtı"
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-2">
        <span className="inline-block font-mono text-[9.5px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm border bg-lilac/15 text-lilac border-lilac/50">
          YZ üretimi
        </span>
        {soru && <span className="font-mono text-[11px] text-ink-faint">“{soru}”</span>}
      </div>

      {/* Düz metin — modelin çıktısı hiçbir zaman HTML olarak yorumlanmaz. */}
      <p className="whitespace-pre-wrap text-ink/92" aria-live="polite">
        {metin}
      </p>

      {aramaDesteklenmedi && (
        <p className="mt-2 text-[12px] text-ink-faint" role="status">
          {YZ_MESAJ.aramaYok}
        </p>
      )}

      {arandi && kaynaklar.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-lilac/25">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint mb-1.5">
            Kaynaklar
          </p>
          <ul className="flex flex-col gap-1">
            {kaynaklar.map((k) => (
              <li key={k.url} className="min-w-0">
                <a
                  href={k.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 max-w-full text-[12.5px] text-sky hover:text-paper transition-colors"
                >
                  <IconExternal className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{k.baslik}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Google'ın "Search Suggestions" bağlantıları — Plan B (T-25 madde 6.3'ün
          hazır iframe'i yerine): sorgular düz metin, her biri arama sonucuna
          çıkan bir bağlantı. Kullanım şartının "arama önerileri ya da diğer
          bağlantılar gösterilsin" koşulunu karşılar, sandbox iframe'in canlıda
          doğrulanmamış tıklama riskini almadan. */}
      {arandi && sorgular.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {sorgular.map((s) => (
            <a
              key={s}
              href={`https://www.google.com/search?q=${encodeURIComponent(s)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10.5px] px-2 py-1 rounded-sm border border-line text-ink-faint hover:text-gold hover:border-gold/50 transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      )}

      <p className="mt-3 pt-2.5 border-t border-dashed border-lilac/25 font-mono text-[10.5px] leading-relaxed tracking-wide text-ink-faint">
        {arandi
          ? `Bu metin, ${saglayici.ad} tarafından web'de arama yapılarak üretildi. Editör derlemesi değildir; aşağıdaki kaynaklardan doğrulayın.`
          : `Bu metin, yukarıdaki Vikipedi özetine dayanılarak ${saglayici.ad} tarafından üretildi. Editör derlemesi değildir; yayında kullanmadan önce kaynaktan doğrulayın.`}
      </p>
    </div>
  );
}
