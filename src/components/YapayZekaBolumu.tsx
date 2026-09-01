import { useEffect, useRef, useState } from "react";
import {
  SORU_IPUCU,
  saglayici,
  useYzAnahtari,
  VARSAYILAN_ISTEM,
  YZ_MESAJ,
  YzHatasi,
} from "../lib/yapayzeka";
import { SkeletonParagraf } from "./Iskeletler";
import { IconArrow, IconSpark } from "./ui";
import { yzAyarlariniAc } from "./YzAyarlari";

/**
 * "YAPAY ZEKÂYA SOR" (T-20 madde 3–7)
 *
 * `DetayPaneli`'nin T-19'da ayırdığı yuvayı doldurur. Panelin elindeki Vikipedi
 * metnini modele **bağlam olarak** verir; kullanıcı isterse kendi sorusunu yazar.
 *
 * ## Üç kural, üçü de bilerek
 *
 * 1. **Bağlamsız çağrı yok.** `baglam` boşsa bölüm hiç render edilmez. Bağlamsız
 *    soru, modeli "hatırlamaya" zorlar; niş Türkiye tarihi konularında bu düpedüz
 *    uydurma demektir (T-20 §Halüsinasyon Riski).
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
}: {
  /** Modelin dayanacağı metin — panelin gösterdiği Vikipedi özeti. */
  baglam: string;
  /** Bağlamın hangi maddeden geldiği; künye satırında geçer. Bilinmiyorsa yok. */
  kaynakAdi?: string;
}) {
  const anahtar = useYzAnahtari();
  const [acik, setAcik] = useState(false);
  const [soru, setSoru] = useState("");
  const [yanit, setYanit] = useState<{ soru: string; metin: string } | null>(null);
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
      const metin = await saglayici.sor(sorulan || VARSAYILAN_ISTEM, baglam, ctrl.signal);
      if (!ctrl.signal.aborted) setYanit({ soru: sorulan, metin });
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
        Boş bırakırsanız olayı kısaca açıklar
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

      {yanit && <YzYaniti soru={yanit.soru} metin={yanit.metin} />}
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
 * Kutunun altındaki uyarı satırı sabittir, kapatılamaz.
 */
function YzYaniti({ soru, metin }: { soru: string; metin: string }) {
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

      <p className="mt-3 pt-2.5 border-t border-dashed border-lilac/25 font-mono text-[10.5px] leading-relaxed tracking-wide text-ink-faint">
        Bu metin, yukarıdaki Vikipedi özetine dayanılarak {saglayici.ad} tarafından üretildi. Editör
        derlemesi değildir; yayında kullanmadan önce kaynaktan doğrulayın.
      </p>
    </div>
  );
}
