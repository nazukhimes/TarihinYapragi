import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADAY_MODELLER,
  ANAHTAR_ADI,
  anahtarOku,
  anahtarSil,
  anahtarTemizle,
  anahtarYaz,
  ARAMA_ADI,
  aramaAcikMi,
  aramaYaz,
  baglamiKirp,
  istemBirlestir,
  MODEL_ADI,
  modelleriGetir,
  saglayici,
  VARSAYILAN_ISTEM,
  VARSAYILAN_ISTEM_ARASTIRMA,
  YZ_MESAJ,
  YzHatasi,
  yzDurumMesaji,
  type YzOlay,
} from "./index";
import { kaynaklariCoz, yanitiCoz } from "./gemini";

const EXTRACT =
  "Washington Yangını, 1812 Savaşı sırasında 24 Ağustos 1814 tarihinde İngiliz " +
  "kuvvetlerinin Washington D.C. şehrini işgal edip Beyaz Saray'ı ateşe vermesiyle " +
  "sonuçlanan olaydır.";

const OLAY: YzOlay = {
  tarih: "24 Ağustos 1814",
  baslik: "İngiliz kuvvetleri Washington'u işgal etti.",
  madde: "İngiltere",
};

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

/** Gemini'nin başarılı, aramasız yanıt gövdesi. */
function metinYaniti(metin: string) {
  return { candidates: [{ content: { parts: [{ text: metin }] } }] };
}

/** Gemini'nin `groundingMetadata` taşıyan, arama yapılmış yanıt gövdesi. */
function aramaYanitiOlustur(
  metin: string,
  opts: {
    sorgular?: string[];
    kaynaklar?: { uri: string; title?: string }[];
    oneriHtml?: string;
  } = {}
) {
  return {
    candidates: [
      {
        content: { parts: [{ text: metin }] },
        groundingMetadata: {
          webSearchQueries: opts.sorgular ?? ["Washington Yangını 1814"],
          groundingChunks: (
            opts.kaynaklar ?? [{ uri: "https://vertexaisearch.example/1", title: "reuters.com" }]
          ).map((k) => ({ web: k })),
          ...(opts.oneriHtml ? { searchEntryPoint: { renderedContent: opts.oneriHtml } } : {}),
        },
      },
    ],
  };
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
   * koyamayıp `TypeError` fırlatıyor, kullanıcı "Bağlantı kurulamadı." görüyordu.
   * Bunlar artık **her yerinden** sökülüyor.
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

/* ------------------------------------------------------- arama tercihi (T-25) */

describe("arama tercihi (T-25 madde 7)", () => {
  it("depo anahtarının adı sabittir", () => expect(ARAMA_ADI).toBe("ty-yz-arama"));

  it("kayıt yoksa varsayılan açık — kullanıcının şikâyeti 'araştırmıyor'du", () => {
    expect(aramaAcikMi()).toBe(true);
  });

  it("kapatılınca kapalı okunur", () => {
    aramaYaz(false);
    expect(aramaAcikMi()).toBe(false);
  });

  it("tekrar açılınca açık okunur", () => {
    aramaYaz(false);
    aramaYaz(true);
    expect(aramaAcikMi()).toBe(true);
  });

  it("localStorage erişimi fırlatsa bile açık sayılır", () => {
    const asil = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("engellendi");
    };
    expect(aramaAcikMi()).toBe(true);
    Storage.prototype.getItem = asil;
  });
});

/* -------------------------------------------------------------------- istem */

describe("istem kurulumu — kaynağa sadık mod (arama kapalı, T-20'nin orijinali)", () => {
  it("bağlam isteme gömülür", () => {
    expect(istemBirlestir("Neden oldu?", EXTRACT, false)).toContain(EXTRACT);
  });

  it("soru boşsa kaynağa sadık varsayılan görev kullanılır", () => {
    expect(istemBirlestir("   ", EXTRACT, false)).toContain(VARSAYILAN_ISTEM);
  });

  it("metnin dışına çıkmama kuralı istemde geçer", () => {
    const istem = istemBirlestir("", EXTRACT, false);
    expect(istem).toContain("metinde olmayan bilgi ekleme");
    expect(istem).toContain("kaynakta belirtilmemiş");
  });

  it("kurallar bağlamdan önce gelir — model uzun metnin başındaki yönergeye uyar", () => {
    const istem = istemBirlestir("", EXTRACT, false);
    expect(istem.indexOf("Kurallar:")).toBeLessThan(istem.indexOf(EXTRACT));
  });

  it("künye verilmezse OLAY KÜNYESİ bloğu hiç yazılmaz", () => {
    expect(istemBirlestir("", EXTRACT, false)).not.toContain("OLAY KÜNYESİ");
  });

  it("künye verilince tarih ve olay cümlesi istemde geçer, madde satırı geçmez", () => {
    const istem = istemBirlestir("", EXTRACT, false, OLAY);
    expect(istem).toContain("OLAY KÜNYESİ");
    expect(istem).toContain(`Tarih: ${OLAY.tarih}`);
    expect(istem).toContain(`Olay: ${OLAY.baslik}`);
    // Hazır İstem Metni'nin B bölümünde künye yalnızca Tarih/Olay taşır.
    expect(istem).not.toContain("İlgili Vikipedi maddesi");
  });

  it("görev satırı yalnızca bir kez geçer", () => {
    const istem = istemBirlestir("Ne oldu?", EXTRACT, false);
    expect(istem.split("Görev: Ne oldu?").length - 1).toBe(1);
  });
});

describe("istem kurulumu — araştırma modu (arama açık, T-25)", () => {
  it("soru boşsa araştırma görevini kullanır, kaynağa sadık varsayılanı değil", () => {
    const istem = istemBirlestir("", EXTRACT, true);
    expect(istem).toContain(VARSAYILAN_ISTEM_ARASTIRMA);
    expect(istem).not.toContain(VARSAYILAN_ISTEM);
  });

  it("metnin dışına çıkmama kuralı YOK — model aramaya teşvik edilir", () => {
    const istem = istemBirlestir("", EXTRACT, true);
    expect(istem).not.toContain("metinde olmayan bilgi ekleme");
    expect(istem).not.toContain("kaynakta belirtilmemiş");
    expect(istem).toContain("Google Arama");
  });

  it("künye varsa madde satırı da eklenir", () => {
    const istem = istemBirlestir("", EXTRACT, true, OLAY);
    expect(istem).toContain("OLAY KÜNYESİ");
    expect(istem).toContain(`İlgili Vikipedi maddesi: ${OLAY.madde}`);
  });

  it("künyenin madde alanı boşsa o satır hiç yazılmaz", () => {
    const istem = istemBirlestir("", EXTRACT, true, { tarih: OLAY.tarih, baslik: OLAY.baslik });
    expect(istem).toContain("OLAY KÜNYESİ");
    expect(istem).not.toContain("İlgili Vikipedi maddesi");
  });

  it("künye yoksa yine de çalışır — bağlam metnine düşer", () => {
    const istem = istemBirlestir("", EXTRACT, true);
    expect(istem).not.toContain("OLAY KÜNYESİ");
    expect(istem).toContain(EXTRACT);
  });

  it("görev satırı iki kez geçer — kurallardan hemen sonra ve metnin sonunda", () => {
    const istem = istemBirlestir("Ne oldu?", EXTRACT, true);
    expect(istem.split("Görev: Ne oldu?").length - 1).toBe(2);
    const ilk = istem.indexOf("Görev: Ne oldu?");
    const son = istem.lastIndexOf("Görev: Ne oldu?");
    expect(son).toBeGreaterThan(ilk);
  });
});

describe("baglamiKirp", () => {
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
   * kurulmuştu. `yzDurumMesaji` tek bir isteğin durumunu çeviriyor — zincirin
   * tamamı tükenince görülecek mesaj budur (bkz. "aday zinciri" testleri).
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

describe("gemini sağlayıcısı — kaynağa sadık çağrılar (arama kapalı)", () => {
  it("anahtar yoksa ağa hiç çıkmaz", async () => {
    const kukla = fetchKuklasi(metinYaniti("x"));
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.anahtar
    );
    expect(kukla).not.toHaveBeenCalled();
  });

  it("anahtar sorgu dizesinde değil, başlıkta gider", async () => {
    anahtarYaz("KUKLA-GIZLI");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, arama: false });

    const [url, init] = kukla.mock.calls[0];
    expect(url).not.toContain("KUKLA-GIZLI");
    expect((init?.headers as Record<string, string>)["x-goog-api-key"]).toBe("KUKLA-GIZLI");
  });

  it("hiçbir model sabitlenmemişse aday zincirinin ilki denenir", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, arama: false });
    expect(kukla.mock.calls[0]?.[0] ?? "").toContain(`models/${ADAY_MODELLER[0]}:generateContent`);
  });

  it("gövdeye hem bağlam hem kullanıcının sorusu gömülür", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor({ soru: "Kaç kişi öldü?", baglam: EXTRACT, arama: false });

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as {
      contents: { parts: { text: string }[] }[];
    };
    const istem = govde.contents[0].parts[0].text;
    expect(istem).toContain(EXTRACT);
    expect(istem).toContain("Kaç kişi öldü?");
  });

  it("arama kapalıyken gövdede tools alanı hiç yok, jeton bütçesi eski değer", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, arama: false });

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as {
      tools?: unknown;
      generationConfig: { maxOutputTokens: number };
    };
    expect(govde.tools).toBeUndefined();
    expect(govde.generationConfig.maxOutputTokens).toBe(2048);
  });

  it("başarılı yanıt kırpılmış düz metin ve boş kaynak/sorgu listesiyle döner", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi(metinYaniti("  Beyaz Saray yakıldı.  "));
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).resolves.toMatchObject(
      {
        metin: "Beyaz Saray yakıldı.",
        arandi: false,
        kaynaklar: [],
        sorgular: [],
      }
    );
  });

  it("çok parçalı yanıt birleştirilir", () =>
    expect(
      yanitiCoz({ candidates: [{ content: { parts: [{ text: "Bir " }, { text: "iki." }] } }] })
    ).toBe("Bir iki."));

  it("boş aday listesi boş metin verir", () => expect(yanitiCoz({ candidates: [] })).toBe(""));

  it("içeriksiz 200 yanıtı → 'yanıt üretmedi' mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({ candidates: [] });
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.bos
    );
  });

  /**
   * Düşünen model, jeton bütçesini düşünmeye harcayıp metinsiz kapanabilir.
   * Bu "model yanıt üretmedi" değil, "yanıt kesildi"dir — tekrar denemeye değer.
   */
  it("MAX_TOKENS ile metinsiz yanıt → 'kesildi' mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({ candidates: [{ content: { parts: [] }, finishReason: "MAX_TOKENS" }] });
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.kesik
    );
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
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.anahtar
    );
    expect(kukla).not.toHaveBeenCalled();
  });

  it("geçersiz anahtar (400) → Türkçe anahtar mesajı", async () => {
    anahtarYaz("KUKLA-BOZUK");
    fetchKuklasi({ error: { status: "INVALID_ARGUMENT" } }, 400);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.anahtar
    );
  });

  it("kota (429) → Türkçe kota mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({}, 429);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.kota
    );
  });

  it("ağ hatası → bağlantı mesajı", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
    );
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.ag
    );
  });

  it("hata daima YzHatasi tipinde — panel mesajı olduğu gibi basabilsin", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({}, 500);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toBeInstanceOf(
      YzHatasi
    );
  });

  it("zaman aşımı → tekrar deneme mesajı", async () => {
    vi.useFakeTimers();
    anahtarYaz("KUKLA-ANAHTAR");
    asiliFetchKuklasi();

    const beklenen = expect(
      saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })
    ).rejects.toThrow(YZ_MESAJ.zamanAsimi);
    await vi.advanceTimersByTimeAsync(31_000);
    await beklenen;
  });

  it("dışarıdan iptal zaman aşımına dönüşmez — çağıran iptali görür", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    asiliFetchKuklasi();

    const ctrl = new AbortController();
    const istek = saglayici.sor({ soru: "", baglam: EXTRACT, arama: false, signal: ctrl.signal });
    ctrl.abort();
    await expect(istek).rejects.toThrow(/Aborted/);
  });
});

/* --------------------------------------------------------- web araması (T-25) */

describe("gemini sağlayıcısı — web araması (T-25)", () => {
  it("arama açıkken gövdede google_search aracı ve büyütülmüş jeton bütçesi gider", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(aramaYanitiOlustur("Washington yakıldı."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as {
      tools?: { google_search: object }[];
      generationConfig: { maxOutputTokens: number };
    };
    expect(govde.tools?.[0]).toEqual({ google_search: {} });
    expect(govde.generationConfig.maxOutputTokens).toBe(3072);
  });

  it("künye gövdede geçer — arama olayın kendisini hedefler", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(aramaYanitiOlustur("Washington yakıldı."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as { contents: { parts: { text: string }[] }[] };
    expect(govde.contents[0].parts[0].text).toContain(OLAY.tarih);
    expect(govde.contents[0].parts[0].text).toContain(OLAY.baslik);
  });

  it("groundingMetadata dolu yanıt → arandi true, kaynaklar tekilleşmiş ve 5'e kırpılmış, sorgular geçiyor", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kaynaklar = [
      { uri: "https://vertexaisearch.example/0", title: "reuters.com" },
      { uri: "https://vertexaisearch.example/1", title: "bbc.com" },
      { uri: "https://vertexaisearch.example/2", title: "nytimes.com" },
      { uri: "https://vertexaisearch.example/3", title: "britannica.com" },
      { uri: "https://vertexaisearch.example/4", title: "history.com" },
      { uri: "https://vertexaisearch.example/5", title: "wikipedia.org" },
      { uri: "https://vertexaisearch.example/0" }, // aynı URL — tekilleşmeli
    ];
    fetchKuklasi(aramaYanitiOlustur("Washington yakıldı.", { sorgular: ["a", "b"], kaynaklar }));

    const yanit = await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(yanit.arandi).toBe(true);
    expect(yanit.sorgular).toEqual(["a", "b"]);
    expect(yanit.kaynaklar).toHaveLength(5);
    expect(new Set(yanit.kaynaklar.map((k) => k.url)).size).toBe(5);
  });

  it("web.title boşsa alan adı gösterilir — yönlendirme adresi çözülmez", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi(
      aramaYanitiOlustur("Yanıt.", {
        kaynaklar: [{ uri: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/x" }],
      })
    );
    const yanit = await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(yanit.kaynaklar[0]).toEqual({
      baslik: "vertexaisearch.cloud.google.com",
      url: "https://vertexaisearch.cloud.google.com/grounding-api-redirect/x",
    });
  });

  it("groundingMetadata yok ama 200 → arandi false, metin yine dönüyor (model aramaya gerek görmedi)", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi(metinYaniti("Model aramaya gerek görmedi."));
    const yanit = await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(yanit.arandi).toBe(false);
    expect(yanit.metin).toBe("Model aramaya gerek görmedi.");
    expect(yanit.aramaDesteklenmedi).toBeUndefined();
  });

  it("400 + gövdede araç hatası → ikinci istek tools'suz atılır, metin döner, arandi false", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = vi.fn((_url: string, init?: RequestInit) => {
      const govde = JSON.parse((init?.body as string) ?? "{}") as { tools?: unknown };
      if (govde.tools) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({ error: { message: "Tool google_search is not supported" } }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(metinYaniti("Aramasız yanıt.")),
      } as Response);
    });
    vi.stubGlobal("fetch", kukla);

    const yanit = await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(yanit.metin).toBe("Aramasız yanıt.");
    expect(yanit.arandi).toBe(false);
    expect(yanit.aramaDesteklenmedi).toBe(true);
    expect(kukla).toHaveBeenCalledTimes(2);
  });

  it("400 + araçla ilgisiz gövde → tek istek, anahtar mesajı — gerçek hata gizlenmez", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi({ error: { message: "API key not valid" } }, 400);
    await expect(
      saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true })
    ).rejects.toThrow(YZ_MESAJ.anahtar);
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("429 → tek istek, kota mesajı, geri çekilme yok — kota ikinci istekle yakılmaz", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi({}, 429);
    await expect(
      saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true })
    ).rejects.toThrow(YZ_MESAJ.kota);
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("aramayı desteklemediği öğrenilen model → ikinci soruda doğrudan tools'suz gider (tek istek)", async () => {
    anahtarYaz("KUKLA-ANAHTAR");

    const ilkKukla = vi.fn((_url: string, init?: RequestInit) => {
      const govde = JSON.parse((init?.body as string) ?? "{}") as { tools?: unknown };
      if (govde.tools) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: { message: "google_search tool not supported" } }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(metinYaniti("Aramasız yanıt.")),
      } as Response);
    });
    vi.stubGlobal("fetch", ilkKukla);
    await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(ilkKukla).toHaveBeenCalledTimes(2);

    const ikinciKukla = fetchKuklasi(metinYaniti("İkinci yanıt."));
    const yanit = await saglayici.sor({ soru: "", baglam: EXTRACT, olay: OLAY, arama: true });
    expect(ikinciKukla).toHaveBeenCalledTimes(1);

    const init = ikinciKukla.mock.calls[0]?.[1] as RequestInit;
    const gonderilenGovde = JSON.parse(init.body as string) as { tools?: unknown };
    expect(gonderilenGovde.tools).toBeUndefined();
    expect(yanit.aramaDesteklenmedi).toBe(true);
  });

  it("kaynaklariCoz — groundingMetadata yoksa güvenli varsayılanlar döner", () => {
    expect(kaynaklariCoz({ candidates: [{ content: { parts: [] } }] })).toEqual({
      arandi: false,
      kaynaklar: [],
      sorgular: [],
      aramaOnerileriHtml: undefined,
    });
  });

  it("kaynaklariCoz — searchEntryPoint.renderedContent olduğu gibi geçer", () => {
    const ham = aramaYanitiOlustur("x", { oneriHtml: "<div>öneri</div>" });
    expect(kaynaklariCoz(ham).aramaOnerileriHtml).toBe("<div>öneri</div>");
  });
});

/* ------------------------------------------------- aday zinciri (T-24) */

describe("aday zinciri ve kendini onarma (T-24)", () => {
  /** URL'sinde `model` geçen isteğe 404, diğerlerine başarılı yanıt döner. */
  function zincirKuklasi(model: string, basariliMetin: string) {
    const kukla = vi.fn((url: string) =>
      Promise.resolve({
        ok: !url.includes(model),
        status: url.includes(model) ? 404 : 200,
        json: () => Promise.resolve(metinYaniti(basariliMetin)),
      } as Response)
    );
    vi.stubGlobal("fetch", kukla);
    return kukla;
  }

  it("404 → sıradaki aday sessizce denenir, kullanıcı hatayı görmez", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = zincirKuklasi(ADAY_MODELLER[0], "İkinci aday yanıtı.");

    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).resolves.toMatchObject(
      { metin: "İkinci aday yanıtı." }
    );
    expect(kukla).toHaveBeenCalledTimes(2);
    expect(kukla.mock.calls[1]?.[0]).toContain(`models/${ADAY_MODELLER[1]}:generateContent`);
  });

  it("zincirin tamamı 404 verirse model mesajı gösterilir", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi({}, 404);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.model
    );
    expect(kukla).toHaveBeenCalledTimes(ADAY_MODELLER.length);
  });

  it("400'de sıradaki aday denenmez — anahtar sorunu gizlenmez", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi({}, 400);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.anahtar
    );
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("429'da sıradaki aday denenmez — kota boşa yakılmaz", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi({}, 429);
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).rejects.toThrow(
      YZ_MESAJ.kota
    );
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("çalışan model localStorage'a yazılır ve ikinci çağrıda doğrudan kullanılır", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi(metinYaniti("Yanıt."));
    await saglayici.sor({ soru: "", baglam: EXTRACT, arama: false });
    expect(localStorage.getItem(MODEL_ADI)).toBe(ADAY_MODELLER[0]);

    const kukla2 = fetchKuklasi(metinYaniti("İkinci yanıt."));
    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).resolves.toMatchObject(
      { metin: "İkinci yanıt." }
    );
    expect(kukla2).toHaveBeenCalledTimes(1);
    expect(kukla2.mock.calls[0]?.[0]).toContain(`models/${ADAY_MODELLER[0]}:generateContent`);
  });

  it("elle seçilen (ya da önceden öğrenilmiş) model aday zincirinin önüne geçer", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    localStorage.setItem(MODEL_ADI, "gemini-ozel-model");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));

    await saglayici.sor({ soru: "", baglam: EXTRACT, arama: false });
    expect(kukla.mock.calls[0]?.[0]).toContain("models/gemini-ozel-model:generateContent");
  });

  it("sabitlenen model de 404 verirse aday zincirine düşülür — onarma tek seferlik değil", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    localStorage.setItem(MODEL_ADI, "gemini-artik-emekli");
    const kukla = zincirKuklasi("gemini-artik-emekli", "Zincir yanıtı.");

    await expect(saglayici.sor({ soru: "", baglam: EXTRACT, arama: false })).resolves.toMatchObject(
      { metin: "Zincir yanıtı." }
    );
    expect(kukla.mock.calls[0]?.[0]).toContain("models/gemini-artik-emekli:generateContent");
    expect(kukla.mock.calls[1]?.[0]).toContain(`models/${ADAY_MODELLER[0]}:generateContent`);
    expect(localStorage.getItem(MODEL_ADI)).toBe(ADAY_MODELLER[0]);
  });
});

/* -------------------------------------------- model listeleme (T-24) */

describe("modelleriGetir — ayarlardaki 'Modelleri getir' (T-24 madde 3)", () => {
  it("anahtar yoksa ağa hiç çıkmaz", async () => {
    const kukla = vi.fn();
    vi.stubGlobal("fetch", kukla);
    await expect(modelleriGetir()).rejects.toThrow(YZ_MESAJ.anahtar);
    expect(kukla).not.toHaveBeenCalled();
  });

  it("yalnızca generateContent destekleyen modeller, önek atılmış ve sıralı döner", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              models: [
                {
                  name: "models/gemini-2.5-flash",
                  supportedGenerationMethods: ["generateContent"],
                },
                { name: "models/embedding-001", supportedGenerationMethods: ["embedContent"] },
                {
                  name: "models/gemini-2.5-flash-lite",
                  supportedGenerationMethods: ["generateContent"],
                },
              ],
            }),
        } as Response)
      )
    );

    await expect(modelleriGetir()).resolves.toEqual(["gemini-2.5-flash", "gemini-2.5-flash-lite"]);
  });

  it("HTTP hatası Türkçe mesaja çevrilir — script ile aynı yzDurumMesaji", async () => {
    anahtarYaz("KUKLA-ANAHTAR");
    fetchKuklasi({}, 429);
    await expect(modelleriGetir()).rejects.toThrow(YZ_MESAJ.kota);
  });
});
