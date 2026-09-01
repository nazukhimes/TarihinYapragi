import { useState, type ReactNode } from "react";
import type { OlayMakalesi } from "../lib/olayMakalesi";
import { sayfaOzetiGetir, type SayfaOzeti } from "../lib/sayfaOzeti";
import { SkeletonParagraf } from "./Iskeletler";
import { IconArrow, IconExternal, IconSearch } from "./ui";

/** Olayla/kişiyle ilgili tek bir Vikipedi sayfası — çip olarak basılır (T-18). */
export interface OlayKaynagi {
  title: string;
  /** API'nin kısa tanımı ("ABD başkanının resmî konutu"). Boş gelebilir. */
  description?: string;
  extract?: string;
  /** `thumbnail.source`. Panel görseli metnin geldiği sayfadan alınır. */
  thumbnail?: string;
  url: string;
}

/**
 * Olay metniyle Vikipedi'nin **gerçek arama sayfasını** açar.
 *
 * Hiçbir sayfanın olayın kendisi olmadığı durumların tek dürüst çıkışı budur:
 * 1958 Bursa Kapalı Çarşı yangınının beslemedeki tek sayfası "Bursa"dır.
 */
export function wikiAramaUrl(lang: "tr" | "en", metin: string): string {
  return `https://${lang}.wikipedia.org/w/index.php?search=${encodeURIComponent(metin)}`;
}

export interface DetayPaneliProps {
  /**
   * Panelin neyi anlattığı. Görselin `alt` metni ve panelin erişilebilir adıdır;
   * **görünür bir başlık olarak basılmaz** — üç çağrı noktasının üçünde de
   * başlık (olay metni / dosya adı / kişi adı) panelin hemen üstünde zaten
   * duruyor, panel onu ikinci kez yazmaz.
   */
  baslik: string;
  /** Hazır özet: editör `detail`i ya da beslemenin `extract`i. */
  metin?: string;
  /** `thumbnail.source`. Yoksa görsel alanı **hiç render edilmez**. */
  gorsel?: string;
  /** `metin`in hangi maddeden geldiği — künye satırı olarak basılır. */
  metinKaynagi?: OlayKaynagi;
  /** T-18'in kaynak çipleri. */
  sayfalar?: OlayKaynagi[];
  /** T-18'in çapraz eşlemesi — "Bu olay hakkında" altın çipi. */
  olayMakalesi?: OlayMakalesi;
  /** "Vikipedi'de ara" için ham metin. Yoksa arama düğmesi çıkmaz. */
  aramaMetni?: string;
  /** Arama ve özet çağrısının hangi Vikipedi'ye gideceği. */
  dil?: "tr" | "en";
  /** Kaynak rozeti (T-17 ile aynı biçim). */
  kaynak: "editor" | "otomatik";
  /**
   * Rozet panelin **hemen üstünde** zaten basılıyorsa (Karanlık Dosyalar'ın üst
   * bandı, Zaman Tüneli'nin "Editör notu" çipi) `false` verilir — aynı rozet
   * iki kez basılmaz.
   */
  rozetGoster?: boolean;
  /**
   * "Daha fazlasını oku"nun çekeceği **Vikipedi madde başlığı**.
   *
   * Yalnızca elimizde özeti **olmayan** bir madde varsa verilir; verilmezse
   * düğme hiç çıkmaz. Gerekçe `lib/sayfaOzeti.ts` başlığında.
   */
  ozetBasligi?: string;
  /**
   * **T-20 yuvası.** Yapay zekâ bölümü buraya girecek; bu talimatta hiçbir
   * çağrı noktası doldurmaz, dolayısıyla alan hiç render edilmez.
   */
  children?: ReactNode;
}

/**
 * ZENGİN DETAY PANELİ (T-19)
 *
 * Zaman Tüneli'nin "Detayı aç"ı, Karanlık Dosyalar'ın "Dosyayı aç"ı ve kişi
 * kartı modalı T-19 öncesinde aynı işi üç ayrı biçimde yapıyordu; her biri
 * farklı alanları okuyor, T-18'in çipleri gibi bir iyileştirme üç yere ayrı
 * ayrı yazılmak zorunda kalıyordu. Üçü de artık bu bileşeni çağırır.
 *
 * Panel **çerçevesizdir**: sol kenarlık (Zaman Tüneli), kesik çizgili üst ayraç
 * (Karanlık Dosyalar) ve modal gövdesi çağrı noktalarında kalır — görsel dil
 * böylece korunur, panel yalnızca içeriği verir.
 *
 * İçerik sırası: kaynak rozeti · görsel · metin · "Daha fazlasını oku" ·
 * kaynak çipleri + "Vikipedi'de ara" · T-20 yuvası.
 */
export function DetayPaneli({
  baslik,
  metin,
  gorsel,
  metinKaynagi,
  sayfalar = [],
  olayMakalesi,
  aramaMetni,
  dil = "tr",
  kaynak,
  rozetGoster = true,
  ozetBasligi,
  children,
}: DetayPaneliProps) {
  return (
    <div className="text-[14.5px] leading-relaxed text-ink-dim">
      {rozetGoster && <KaynakRozeti kaynak={kaynak} />}

      {(gorsel || metin) && (
        <div className={`flex gap-4 items-start ${rozetGoster ? "mt-3" : ""}`}>
          {gorsel && (
            <img
              src={gorsel}
              alt={baslik}
              width={96}
              height={112}
              loading="lazy"
              decoding="async"
              className="w-24 h-28 object-cover object-top rounded-sm border border-line shrink-0"
            />
          )}
          {metin && (
            <div className="min-w-0">
              <p>{metin}</p>
              {metinKaynagi && <MetinKunyesi sayfa={metinKaynagi} />}
            </div>
          )}
        </div>
      )}

      {ozetBasligi && <DahaFazlasi baslik={ozetBasligi} dil={dil} />}

      <KaynakCipleri
        sayfalar={sayfalar}
        olayMakalesi={olayMakalesi}
        aramaMetni={aramaMetni}
        dil={dil}
        ustBosluk={!!(gorsel || metin || ozetBasligi)}
      />

      {/* T-20 yuvası — bu talimatta boş. */}
      {children && (
        <div className="mt-5 pt-4 border-t border-dashed border-line/70">{children}</div>
      )}
    </div>
  );
}

/** Editör / Otomatik rozeti — biçim T-17'deki dosya ve bilim rozetiyle birebir aynı. */
function KaynakRozeti({ kaynak }: { kaynak: "editor" | "otomatik" }) {
  const editor = kaynak === "editor";
  return (
    <span
      className={`inline-block font-mono text-[9.5px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-sm border ${
        editor ? "bg-gold/15 text-gold border-gold/40" : "text-ink-faint border-line"
      }`}
    >
      {editor ? "Editör" : "Otomatik"}
    </span>
  );
}

/**
 * Metnin künyesi — "Özet · İngiltere".
 *
 * T-18'in T-19'a bıraktığı birinci iş: besleme, olay metnindeki ilk varlığın
 * özetini veriyor, bu da çiplerle çelişiyordu (kullanıcı "Beyaz Saray /
 * Washington, DC" çiplerini görürken paragraf İngiltere'yi anlatıyordu).
 * Metin artık **hangi maddeden geldiğini söylüyor**; çelişki, kaynağı
 * gizlemeyerek çözülüyor (BAGLAM.md §1, ürün ilkesi 3).
 */
function MetinKunyesi({ sayfa }: { sayfa: OlayKaynagi }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-faint">
      Özet ·{" "}
      <a
        href={sayfa.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-line underline-offset-4 hover:text-sky hover:decoration-sky transition-colors"
      >
        {sayfa.title}
      </a>
    </p>
  );
}

/**
 * "Daha fazlasını oku" — `page/summary` çağrısı **yalnızca basılınca**.
 *
 * Basıldığında düğmenin yerini iskelet alır; yanıt gelince özet açılır ve düğme
 * geri gelmez. Hata hâlinde Türkçe mesaj çıkar, panelin geri kalanı çalışmaya
 * devam eder ve düğme tekrar denenebilir olarak kalır.
 */
function DahaFazlasi({ baslik, dil }: { baslik: string; dil: "tr" | "en" }) {
  const [ozet, setOzet] = useState<SayfaOzeti | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const oku = () => {
    setYukleniyor(true);
    setHata(null);
    sayfaOzetiGetir(baslik, dil)
      .then((o) => setOzet(o))
      .catch((e: unknown) => setHata(e instanceof Error ? e.message : "Özet alınamadı."))
      .finally(() => setYukleniyor(false));
  };

  return (
    <div className="mt-4">
      {yukleniyor ? (
        <SkeletonParagraf />
      ) : ozet ? (
        <div className="rise-in rounded-sm border border-line bg-panel-2/50 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-gold mb-2">
            {ozet.baslik}
          </p>
          <p className="text-ink/92">{ozet.metin}</p>
          {ozet.url && (
            <a
              href={ozet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-ink-faint hover:text-gold transition-colors"
            >
              Maddenin tamamı <IconExternal className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            onClick={oku}
            className="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-wider uppercase text-gold transition-colors duration-200 hover:text-paper cursor-pointer"
          >
            <span className="underline decoration-gold/40 underline-offset-4 hover:decoration-paper">
              Daha fazlasını oku
            </span>
            <IconArrow dir="down" className="w-3 h-3" />
          </button>
          <span className="font-mono text-[11px] tracking-wider text-ink-faint">
            {baslik} maddesinden
          </span>
        </div>
      )}
      {hata && <p className="mt-2 text-[13px] text-brand-text">{hata}</p>}
    </div>
  );
}

/**
 * Kaynak çıkışları: ilgili sayfaların hepsi + Vikipedi araması.
 *
 * **Tek bir sayfa "doğru cevap" olarak dayatılmaz.** Besleme sayfaları olay
 * metnindeki geçiş sırasına göre verir; hangisinin olayın kendisi olduğunu
 * güvenilir biçimde seçen bir kural yoktur (O-14'te bir puanlama sezgiseli
 * denendi ve 3 olayda sonucu bozduğu için reddedildi). Bu yüzden hepsi
 * açıklamasıyla listelenir, seçim kullanıcınındır.
 */
function KaynakCipleri({
  sayfalar,
  olayMakalesi,
  aramaMetni,
  dil,
  ustBosluk,
}: {
  sayfalar: OlayKaynagi[];
  olayMakalesi?: OlayMakalesi;
  aramaMetni?: string;
  dil: "tr" | "en";
  ustBosluk: boolean;
}) {
  // Çapraz eşleme zaten listede olan bir sayfayı bulduysa aynı bağlantıyı iki kez basma.
  const cipler = olayMakalesi ? sayfalar.filter((p) => p.url !== olayMakalesi.url) : sayfalar;
  if (cipler.length === 0 && !olayMakalesi && !aramaMetni) return null;

  return (
    <div className={ustBosluk ? "mt-4" : ""}>
      <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ink-faint mb-2">
        Kaynaklar
      </p>
      <div className="flex flex-wrap gap-2">
        {olayMakalesi && (
          <a
            href={olayMakalesi.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cip max-w-full rounded-sm border border-gold/50 bg-gold/[0.08] px-3 py-1.5 transition-colors hover:border-gold hover:bg-gold/15"
          >
            <span className="block font-mono text-[9.5px] tracking-[0.2em] uppercase text-gold">
              Bu olay hakkında
            </span>
            <span className="block text-[13px] leading-snug text-ink group-hover/cip:text-gold transition-colors">
              {olayMakalesi.title} <IconExternal className="inline w-3 h-3 align-[-1px]" />
            </span>
          </a>
        )}
        {cipler.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cip max-w-full sm:max-w-[280px] rounded-sm border border-line bg-panel-2/60 px-3 py-1.5 transition-colors hover:border-sky/60 hover:bg-panel-2"
          >
            <span className="block text-[13px] leading-snug text-ink group-hover/cip:text-sky transition-colors">
              {p.title} <IconExternal className="inline w-3 h-3 align-[-1px]" />
            </span>
            {p.description && (
              <span className="block text-[11.5px] leading-snug text-ink-faint line-clamp-1">
                {p.description}
              </span>
            )}
          </a>
        ))}
        {aramaMetni && (
          <a
            href={wikiAramaUrl(dil, aramaMetni)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start rounded-sm border border-dashed border-line px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase text-ink-faint transition-colors hover:text-gold hover:border-gold/60"
          >
            <IconSearch className="w-3.5 h-3.5" />
            Vikipedi&apos;de ara
          </a>
        )}
      </div>
    </div>
  );
}
