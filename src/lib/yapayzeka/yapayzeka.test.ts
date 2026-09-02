import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANAHTAR_ADI,
  anahtarOku,
  anahtarSil,
  anahtarTemizle,
  anahtarYaz,
  baglamiKirp,
  istemBirlestir,
  saglayici,
  VARSAYILAN_ISTEM,
  YZ_MESAJ,
  YzHatasi,
  yzDurumMesaji,
} from "./index";
import { GEMINI_MODEL, yanitiCoz } from "./gemini";

const EXTRACT =
  "Washington Yangını, 1812 Savaşı sırasında 24 Ağustos 1814 tarihinde İngiliz " +
  "kuvvetlerinin Washington D.C. şehrini işgal edip Beyaz Saray'ı ateşe vermesiyle " +
  "sonuçlanan olaydır.";

/**
 * `fetch` kuklası.
 *
 * Parametreler kullanılmasa da **imzada duruyor**: `vi.fn(() => …)` yazıldığında
 * `mock.calls` boş demet olarak tiplenir ve çağrı argümanlarını okuyan testler
 * `npm run typecheck` altında patlar.
 */
function fetchKuklasi(yanit: unknown, durum = 200) {
  const kukla = vi.fn((_url: string, _init?: RequestInit) =>
    Promise.resolve({
      ok: durum >= 200 && durum < 300,
      status: durum,
      json: () => Promise.resolve(yanit),
    } as Response)
  );
  vi.stubGlobal("fetch", kukla);
  return kukla;
}

/** Uçmayan istek: yalnızca iptal edildiğinde reddeder — zaman aşımı testleri için. */
function asiliFetchKuklasi() {
  const kukla = vi.fn(
    (_u: string, init: RequestInit) =>
      new Promise<Response>((_res, rej) =>
        init.signal?.addEventListener("abort", () => rej(new DOMException("Aborted", "AbortError")))
      )
  );
  vi.stubGlobal("fetch", kukla);
  return kukla;
}

/** Gemini'nin başarılı yanıt gövdesi. */
function metinYaniti(metin: string) {
  return { candidates: [{ content: { parts: [{ text: metin }] } }] };
}

afterEach(() => {
  anahtarSil();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/* ------------------------------------------------------------------ anahtar */

describe("anahtar yönetimi", () => {
  it("yazılan anahtar okunur", () => {
    anahtarYaz("KUKLA-ANAHTAR-1");
    expect(anahtarOku()).toBe("KUKLA-ANAHTAR-1");
  });

  it("baştaki ve sondaki boşluk kırpılır — yapıştırmada sık olur", () => {
    anahtarYaz("  KUKLA-ANAHTAR-1\n");
    expect(anahtarOku()).toBe("KUKLA-ANAHTAR-1");
  });

  it("boş dizge yazmak anahtarı siler", () => {
    anahtarYaz("KUKLA-ANAHTAR-1");
    anahtarYaz("   ");
    expect(anahtarOku()).toBe("");
  });

  it("silinen anahtar boş dizge döner ve depoda kalmaz", () => {
    anahtarYaz("KUKLA-ANAHTAR-1");
    anahtarSil();
    expect(anahtarOku()).toBe("");
    expect(localStorage.getItem(ANAHTAR_ADI)).toBeNull();
  });

  it("localStorage erişimi fırlatsa bile çökmez", () => {
    const asil = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("engellendi");
    };
    expect(anahtarOku()).toBe("");
    Storage.prototype.getItem = asil;
  });

  it("depo anahtarının adı sabittir", () => {
    expect(ANAHTAR_ADI).toBe("ty-yz-anahtar");
  });

  /**
   * GERİLEME TESTİ — gerçek arıza.
   *
   * AI Studio'dan kopyalanan anahtara karışan görünmez karakterler `trim()`in
   * boşluk tanımına girmediği için depoya yazılıyordu; `fetch` başlığa
   * koyamayıp `TypeError` fırlatıyor, kullanıcı "Bağlantı kurulamadı."
   * görüyordu. Bunlar artık **her yerinden** sökülüyor.
   */
  it("görünmez yapıştırma artıkları anahtardan sökülür", () => {
    const beklenen = "AIzaSyKUKLA123";
    expect(anahtarTemizle("​AIzaSy​KUKLA123﻿")).toBe(beklenen);
    expect(anahtarTemizle("AIzaSy­KUKLA123")).toBe(beklenen);
    expect(anahtarTemizle("AIzaSy\nKUKLA123")).toBe(beklenen);
    expect(anahtarTemizle("AIzaSy KUKLA123 ")).toBe(beklenen);
  });

  it("ortasında görünmez karakter olan anahtar temiz okunur", () => {
    anahtarYaz("AIzaSy​KUKLA123");
    expect(anahtarOku()).toBe("AIzaSyKUKLA123");
  });

  it("düzeltme öncesi kirli kaydedilmiş anahtar okumada da temizlenir", () => {
    localStorage.setItem(ANAHTAR_ADI, "AIzaSy​KUKLA123");
    expect(anahtarOku()).toBe("AIzaSyKUKLA123");
  });

  it("yalnızca görünmez karakterden ibaret değer anahtarı siler", () => {
    anahtarYaz("KUKLA-ANAHTAR-1");
    anahtarYaz("​﻿");
    expect(anahtarOku()).toBe("");
  });
});

/* -------------------------------------------------------------------- istem */

describe("istem kurulumu", () => {
  it("bağlam isteme gömülür", () => {
    expect(istemBirlestir("Neden oldu?", EXTRACT)).toContain(EXTRACT);
  });

  it("soru boşsa varsayılan görev kullanılır", () => {
    expect(istemBirlestir("   ", EXTRACT)).toContain(VARSAYILAN_ISTEM);
  });

  it("metnin dışına çıkmama kuralı istemde geçer", () => {
    const istem = istemBirlestir("", EXTRACT);
    expect(istem).toContain("metinde olmayan bilgi ekleme");
    expect(istem).toContain("kaynakta belirtilmemiş");
  });

  it("kurallar bağlamdan önce gelir — model uzun metnin başındaki yönergeye uyar", () => {
    const istem = istemBirlestir("", EXTRACT);
    expect(istem.indexOf("Kurallar:")).toBeLessThan(istem.indexOf(EXTRACT));
  });

  it("kısa bağlam olduğu gibi kalır", () => {
    expect(baglamiKirp(`  ${EXTRACT}  `)).toBe(EXTRACT);
  });

  it("çok uzun bağlam kelime ortasından bölünmeden kırpılır", () => {
    const uzun = "kelime ".repeat(2000);
    const kirpik = baglamiKirp(uzun);
    expect(kirpik.length).toBeLessThan(uzun.length);
    expect(kirpik.endsWith("…")).toBe(true);
    expect(kirpik).not.toContain("kel…");
  });
});

/* ------------------------------------------------------------- hata eşlemesi */

describe("hata mesajları — hepsi Türkçe (T-20 madde 6)", () => {
  it("400/401/403 → anahtar mesajı", () => {
    expect(yzDurumMesaji(400)).toBe(YZ_MESAJ.anahtar);
    expect(yzDurumMesaji(401)).toBe(YZ_MESAJ.anahtar);
    expect(yzDurumMesaji(403)).toBe(YZ_MESAJ.anahtar);
  });

  it("429 → kota mesajı", () => expect(yzDurumMesaji(429)).toBe(YZ_MESAJ.kota));

  it("5xx → sunucu mesajı", () => {
    expect(yzDurumMesaji(500)).toBe(YZ_MESAJ.sunucu);
    expect(yzDurumMesaji(503)).toBe(YZ_MESAJ.sunucu);
  });

  it("bilinmeyen durum → ağ mesajı", () => expect(yzDurumMesaji(418)).toBe(YZ_MESAJ.ag));

  /**
   * 404 eskiden `ag`'ye düşüp "Bağlantı kurulamadı." diyordu; oysa bağlantı
   * kurulmuştu. Model emekliye ayrıldığında görülecek tek ipucu budur —
   * `GEMINI_MODEL`'i güncellemek gerektiğini söyler.
   */
  it("404 → ağ değil, model mesajı", () => {
    expect(yzDurumMesaji(404)).toBe(YZ_MESAJ.model);
    expect(yzDurumMesaji(404)).not.toBe(YZ_MESAJ.ag);
  });

  it("hiçbir mesaj İngilizce sızdırmaz", () => {
    for (const m of Object.values(YZ_MESAJ)) {
      expect(m).toMatch(/[çğıöşüÇĞİÖŞÜ]/);
    }
  });
});

/* ------------------------------------------------------------------- gemini */

describe("gemini sağlayıcısı", () => {
  it("anahtar yoksa ağa hiç çıkmaz", async () => {
    const kukla = fetchKuklasi(metinYaniti("x"));
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.anahtar);
    expect(kukla).not.toHaveBeenCalled();
  });

  it("anahtar sorgu dizesinde değil, başlıkta gider", async () => {
    anahtarYaz("KUKLA-GIZLI");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor("", EXTRACT);

    const [url, init] = kukla.mock.calls[0];
    expect(url).not.toContain("KUKLA-GIZLI");
    expect((init?.headers as Record<string, string>)["x-goog-api-key"]).toBe("KUKLA-GIZLI");
  });

  it("uç nokta tek model sabitinden kurulur", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor("", EXTRACT);
    expect(kukla.mock.calls[0]?.[0] ?? "").toContain(`models/${GEMINI_MODEL}:generateContent`);
  });

  it("gövdeye hem bağlam hem kullanıcının sorusu gömülür", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor("Kaç kişi öldü?", EXTRACT);

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as {
      contents: { parts: { text: string }[] }[];
    };
    const istem = govde.contents[0].parts[0].text;
    expect(istem).toContain(EXTRACT);
    expect(istem).toContain("Kaç kişi öldü?");
  });

  it("başarılı yanıt kırpılmış düz metin döner", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi(metinYaniti("  Beyaz Saray yakıldı.  "));
    await expect(saglayici.sor("", EXTRACT)).resolves.toBe("Beyaz Saray yakıldı.");
  });

  it("çok parçalı yanıt birleştirilir", () =>
    expect(
      yanitiCoz({ candidates: [{ content: { parts: [{ text: "Bir " }, { text: "iki." }] } }] })
    ).toBe("Bir iki."));

  it("boş aday listesi boş metin verir", () => expect(yanitiCoz({ candidates: [] })).toBe(""));

  it("içeriksiz 200 yanıtı → 'yanıt üretmedi' mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({ candidates: [] });
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.bos);
  });

  /**
   * Düşünen model, jeton bütçesini düşünmeye harcayıp metinsiz kapanabilir.
   * Bu "model yanıt üretmedi" değil, "yanıt kesildi"dir — tekrar denemeye değer.
   */
  it("MAX_TOKENS ile metinsiz yanıt → 'kesildi' mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({ candidates: [{ content: { parts: [] }, finishReason: "MAX_TOKENS" }] });
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.kesik);
  });

  /**
   * GERİLEME TESTİ — başlığa konamayan anahtar.
   *
   * `fetch` başlık değerine ASCII dışı karakter kabul etmez ve isteği hiç
   * göndermeden `TypeError` fırlatır. Bu eskiden ağ hatası sanılıp
   * "Bağlantı kurulamadı." deniyordu. Artık ağa **çıkılmıyor** ve doğru
   * mesaj veriliyor.
   */
  it("ASCII dışı karakter kalan anahtar ağa çıkmadan reddedilir", async () => {
    anahtarYaz("AIzaSyKUKLAı123");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.anahtar);
    expect(kukla).not.toHaveBeenCalled();
  });

  it("geçersiz anahtar (400) → Türkçe anahtar mesajı", async () => {
    anahtarYaz("KUKLA-BOZUK");
    fetchKuklasi({ error: { status: "INVALID_ARGUMENT" } }, 400);
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.anahtar);
  });

  it("kota (429) → Türkçe kota mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({}, 429);
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.kota);
  });

  it("ağ hatası → bağlantı mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
    );
    await expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.ag);
  });

  it("hata daima YzHatasi tipinde — panel mesajı olduğu gibi basabilsin", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({}, 500);
    await expect(saglayici.sor("", EXTRACT)).rejects.toBeInstanceOf(YzHatasi);
  });

  it("zaman aşımı → tekrar deneme mesajı", async () => {
    vi.useFakeTimers();
    anahtarYaz("KUKLA-ANAHTAR");
    asiliFetchKuklasi();

    const beklenen = expect(saglayici.sor("", EXTRACT)).rejects.toThrow(YZ_MESAJ.zamanAsimi);
    await vi.advanceTimersByTimeAsync(31_000);
    await beklenen;
  });

  it("dışarıdan iptal zaman aşımına dönüşmez — çağıran iptali görür", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    asiliFetchKuklasi();

    const ctrl = new AbortController();
    const istek = saglayici.sor("", EXTRACT, ctrl.signal);
    ctrl.abort();
    await expect(istek).rejects.toThrow(/Aborted/);
  });
});
