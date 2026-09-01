import { describe, it, expect } from "vitest";
import {
  normalize,
  classifyStatus,
  buildAutoTalk,
  estimateMinutes,
  gecerliHolidayMi,
  yilMaddesiMi,
  PAGES_LIMIT,
} from "./wiki";
import type { DayData, RawHoliday, WikiPage } from "./wiki";
import otd from "./__fixtures__/otd-tr-08-31.json";
import otdTatil from "./__fixtures__/otd-tr-10-29-holidays.json";

/**
 * `otd`, gerçek API yanıtının kırpılmış hâlidir:
 * `api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/08/31` (31 Ağustos 2026).
 * Her bölümden 3 öğe, her öğeden en fazla 3 `pages` (`normalize()`'ın kendi
 * sınırı) alındı; sayfa nesnelerinden **tek bir alan bile silinmedi**.
 *
 * Bu dosyadaki testler artık alan adı uydurmuyor — sayfa nesneleri fixture'dan,
 * yani Vikipedi'nin kendi yanıtından geliyor. Sözleşme değişirse (bir alan adı
 * değişir ya da kaybolursa) testler kırmızıya döner. T-16 öncesinde kod `excerpt`
 * ve `displaytitle` bekliyor, testler de aynı uydurma alanları kuruyordu; ikisi
 * birlikte yanlış olduğu için hata hiç görünmüyordu (bkz. ANALIZ-RAPORU m-9).
 */
type RawOge = { text?: string; year?: number; pages?: WikiPage[] };
const fixture = otd as unknown as Record<"selected" | "births" | "deaths" | "events", RawOge[]>;

/** Fixture'dan koşula uyan gerçek bir API sayfası döndürür. */
function gercekSayfa(bolum: "births" | "deaths", kosul: (p: WikiPage) => boolean): WikiPage {
  const p = fixture[bolum].flatMap((o) => o.pages ?? []).find(kosul);
  if (!p) throw new Error(`fixture'ın "${bolum}" bölümünde koşula uyan sayfa yok`);
  return p;
}

describe("API veri sözleşmesi — fixture gerçek yanıttan", () => {
  it("API yanıtı beklenen alanları taşıyor", () => {
    const p = fixture.births[0].pages![0];
    expect(p).toHaveProperty("extract");
    expect(p).toHaveProperty("normalizedtitle");
    expect(p).not.toHaveProperty("excerpt");
  });

  it("normalizedtitle düz metindir, displaytitle ise ham HTML taşır", () => {
    const p = fixture.births[0].pages![0];
    expect(p.normalizedtitle).not.toMatch(/^</);
    // API `displaytitle`ı hâlâ döndürüyor; artık okumuyoruz. K-7'nin sebebi buydu.
    expect((p as unknown as Record<string, unknown>).displaytitle).toMatch(/^<span/);
  });

  it("normalize gerçek yanıtı bozmuyor, extract sayfada kalıyor", () => {
    const items = normalize(fixture.births, "tr", "births");
    expect(items).toHaveLength(fixture.births.length);
    expect(items[0].pages![0].extract).toEqual(expect.any(String));
    expect(items[0].pages![0].extract!.length).toBeGreaterThan(0);
  });
});

describe("normalize — bozuk veriye dayanıklılık", () => {
  it("undefined → boş dizi", () => expect(normalize(undefined, "tr", "x")).toEqual([]));
  it("year yoksa eler", () => expect(normalize([{ text: "a" }], "tr", "x")).toHaveLength(0));
  it("text boşsa eler", () =>
    expect(normalize([{ year: 1, text: "  " }], "tr", "x")).toHaveLength(0));
  it(`pages ${PAGES_LIMIT} ile sınırlı`, () => {
    const fazla = Array.from({ length: PAGES_LIMIT + 3 }, (_, i) => ({ title: `S${i}` }));
    const r = normalize([{ year: 1, text: "a", pages: fazla }], "tr", "x");
    expect(r[0].pages).toHaveLength(PAGES_LIMIT);
  });
  it("geçerli girdi doğru alanlarla eşleniyor", () => {
    const r = normalize([{ year: 1922, text: "  Cumhuriyet ilan edildi.  " }], "tr", "events");
    expect(r).toEqual([
      {
        text: "Cumhuriyet ilan edildi.",
        year: 1922,
        pages: [],
        lang: "tr",
        id: "events-tr-1922-0",
      },
    ]);
  });
});

/* T-18 / Kanıt 1b: besleme, olay metnindeki yıl sayısı için de bir madde
   döndürüyor (`1985 · "yıl"`). Tek sayfa gösterilirken görünmüyorlardı; tüm
   sayfalar çip olarak basılınca doğrudan çöp çipe dönüşürler. */
describe("yilMaddesiMi — çöp çip elemesi", () => {
  it("fixture'daki gerçek yıl maddesini tanıyor", () => {
    const yil = fixture.deaths[0].pages![1];
    expect(yil.title).toBe("1985");
    expect(yil.description).toBe("yıl");
    expect(yilMaddesiMi(yil)).toBe(true);
  });

  it("gerçek kişi maddesini elemiyor", () => {
    expect(yilMaddesiMi(fixture.deaths[0].pages![0])).toBe(false);
  });

  it("MÖ yılı da eleniyor", () =>
    expect(yilMaddesiMi({ title: "MÖ 44", description: "yıl" })).toBe(true));

  it('2016\'nın "bir yıl" açıklaması da eleniyor', () =>
    expect(yilMaddesiMi({ title: "2016", description: "bir yıl" })).toBe(true));

  it("EN besleme karşılığı da eleniyor", () =>
    expect(yilMaddesiMi({ title: "1985", description: "year" })).toBe(true));

  it("başlık salt yıl değilse açıklama eşleşse bile elemiyor", () =>
    // İki koşul birlikte aranır; tek başına açıklama gerçek bir maddeyi de elerdi.
    expect(yilMaddesiMi({ title: "Işık yılı", description: "yıl" })).toBe(false));

  it('"yüzyıl" açıklaması yıl maddesi değildir', () =>
    expect(yilMaddesiMi({ title: "1985", description: "yüzyıl" })).toBe(false));

  it("normalize yıl maddelerini gerçek yanıttan ayıklıyor", () => {
    const items = normalize(fixture.deaths, "tr", "deaths");
    const hepsi = items.flatMap((i) => i.pages ?? []);
    expect(hepsi.length).toBeGreaterThan(0);
    expect(hepsi.map((p) => p.title)).not.toContain("1985");
    expect(hepsi.some((p) => p.description === "yıl")).toBe(false);
  });
});

describe("classifyStatus — HTTP durum kodu → kullanıcı mesajı", () => {
  it("404 → notfound, tekrar denenemez", () => {
    expect(classifyStatus(404)).toEqual({
      kind: "notfound",
      message: "Bu gün için Vikipedi'de kayıt bulunamadı.",
      retryable: false,
    });
  });

  it("429 → ratelimit, tekrar denenebilir", () => {
    const r = classifyStatus(429);
    expect(r.kind).toBe("ratelimit");
    expect(r.retryable).toBe(true);
  });

  it.each([500, 502, 503])("%i → server, tekrar denenebilir", (status) => {
    const r = classifyStatus(status);
    expect(r.kind).toBe("server");
    expect(r.retryable).toBe(true);
  });

  it("beklenmeyen kod (ör. 403) → unknown", () => {
    const r = classifyStatus(403);
    expect(r.kind).toBe("unknown");
    expect(r.retryable).toBe(true);
  });
});

describe("gecerliHolidayMi — şablon artığı çöp kayıtlar (O-11)", () => {
  /**
   * `otdTatil`, gerçek API yanıtının `holidays` dizisidir:
   * `api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/10/29` (29 Ekim).
   * Hiçbir kayıttan tek bir alan bile silinmedi — çöp kayıtların imzası
   * (`namespace.id`, boş `pages`) uydurma değil, Vikipedi'nin kendi yanıtı.
   */
  const tatiller = (otdTatil as { holidays: RawHoliday[] }).holidays;
  const metin = (h: RawHoliday) => h.text?.trim() ?? "";
  const bul = (t: string) => {
    const h = tatiller.find((x) => metin(x) === t);
    if (!h) throw new Error(`fixture'da "${t}" kaydı yok`);
    return h;
  };

  it("fixture gerçekten çöp kayıt içeriyor — g / t / d", () => {
    expect(tatiller.map(metin)).toEqual([
      "Türkiye'de Cumhuriyet Bayramı",
      "Kızılay Haftası (29 Ekim - 4 Kasım)",
      "g",
      "t",
      "d",
    ]);
  });

  it("5 kayıttan yalnızca 2 gerçek tatil geçiyor", () => {
    expect(tatiller.filter(gecerliHolidayMi).map(metin)).toEqual([
      "Türkiye'de Cumhuriyet Bayramı",
      "Kızılay Haftası (29 Ekim - 4 Kasım)",
    ]);
  });

  it('"g" şablon uzayına (namespace 10) işaret ettiği için elenir', () => {
    const g = bul("g");
    expect(g.pages![0].namespace!.id).toBe(10);
    expect(gecerliHolidayMi(g)).toBe(false);
  });

  it('"t" şablon tartışma uzayına (namespace 11) işaret ettiği için elenir', () => {
    const t = bul("t");
    expect(t.pages![0].namespace!.id).toBe(11);
    expect(gecerliHolidayMi(t)).toBe(false);
  });

  it('"d" hiç sayfa taşımaz — onu yalnızca uzunluk kuralı yakalar', () => {
    const d = bul("d");
    expect(d.pages ?? []).toHaveLength(0); // ad uzayı kuralı burada çaresiz
    expect(gecerliHolidayMi(d)).toBe(false);
  });

  it("sayfası olmayan GEÇERLİ kayıt elenmez — boş pages tek başına çöp demek değil", () => {
    const k = bul("Kızılay Haftası (29 Ekim - 4 Kasım)");
    expect(k.pages ?? []).toHaveLength(0);
    expect(gecerliHolidayMi(k)).toBe(true);
  });

  it("madde uzayındaki (namespace 0) kayıt geçer", () => {
    const c = bul("Türkiye'de Cumhuriyet Bayramı");
    expect(c.pages![0].namespace!.id).toBe(0);
    expect(gecerliHolidayMi(c)).toBe(true);
  });

  it.each([
    ["metin yok", {}],
    ["boş metin", { text: "   " }],
    ["tek harf", { text: "x" }],
  ])("%s → elenir", (_ad, h) => expect(gecerliHolidayMi(h as RawHoliday)).toBe(false));

  it("ad uzayı bilinmiyorsa kayda karışılmaz", () => {
    const h: RawHoliday = { text: "Bir bayram", pages: [{ title: "Bayram" }] };
    expect(gecerliHolidayMi(h)).toBe(true);
  });
});

describe("estimateMinutes — hiçbir dal erişilemez değil (m-8)", () => {
  const govde = (n: number) => "a".repeat(n);

  it.each([
    [1, 0],
    [1, 239],
    [2, 240],
    [2, 329],
    [3, 330],
    [3, 420],
  ])("→ %i dakika (%i karakter)", (beklenen, uzunluk) => {
    expect(estimateMinutes(govde(uzunluk))).toBe(beklenen);
  });

  it("3 dalı GERÇEK boru hattından da çıkabiliyor — eşik kırpma sınırının altında", () => {
    // m-8'in özü: eşik, gövdenin kırpıldığı sınırın (420) üstünde kalırsa bu dal
    // hiçbir zaman çalışmaz. Kırpılmış gerçek bir gövdeyle doğrulanır.
    const uzunOlay = "Uzun bir olay metni. " + "ayrıntı ".repeat(120);
    const gun: DayData = {
      events: [{ id: "e1", year: 1900, text: uzunOlay, lang: "tr" }],
      births: [],
      deaths: [],
      holidays: [],
      selected: [],
      sources: { events: "tr", births: "tr", deaths: "tr" },
      offline: false,
      stale: false,
      error: null,
      fetchedAt: 0,
    };
    const kart = buildAutoTalk(gun)[0];
    expect(kart.body.length).toBeLessThanOrEqual(420); // kırpma hâlâ yürürlükte
    expect(kart.minutes).toBe(3);
  });
});

describe("buildAutoTalk — sohbet kartı üretimi", () => {
  const bosGun: DayData = {
    events: [],
    births: [],
    deaths: [],
    holidays: [],
    selected: [],
    sources: { events: "tr", births: "tr", deaths: "tr" },
    offline: false,
    stale: false,
    error: null,
    fetchedAt: 0,
  };

  it("hiç veri yoksa boş dizi döner", () => {
    expect(buildAutoTalk(bosGun)).toEqual([]);
  });

  it.each([
    [300, "Kadim Tarih"],
    [900, "Orta Çağ"],
    [1922, "Tarih"],
  ])("öne çıkan olay yılı %i → kategori %s", (year, kategori) => {
    const gun: DayData = {
      ...bosGun,
      events: [{ id: "e1", year, text: "Bir olay yaşandı.", lang: "tr" }],
    };
    const cards = buildAutoTalk(gun);
    expect(cards[0]).toMatchObject({ id: "auto-lead", category: kategori });
  });

  it("gerçek API yanıtı doğum ve vefat kartlarını üretiyor", () => {
    // K-6'nın regresyon testi: kod `excerpt` beklediği sürece bu iki kart
    // hiç üretilmiyordu, çünkü API alanın adına `extract` diyor.
    const gun: DayData = {
      ...bosGun,
      births: normalize(fixture.births, "tr", "births"),
      deaths: normalize(fixture.deaths, "tr", "deaths"),
    };
    const ids = buildAutoTalk(gun).map((c) => c.id);
    expect(ids).toContain("auto-birth");
    expect(ids).toContain("auto-death");
  });

  it("doğum kartının kancası ham HTML değil, düz ad taşıyor", () => {
    const gun: DayData = { ...bosGun, births: normalize(fixture.births, "tr", "births") };
    const birth = buildAutoTalk(gun).find((c) => c.id === "auto-birth")!;
    expect(birth.hook).not.toContain("<span");
    expect(birth.body.length).toBeGreaterThan(0);
  });

  it("en az 5 kart adayı olduğunda sonuç 5 ile sınırlanır ve karanlık/tatil kartları doğru üretilir", () => {
    const gun: DayData = {
      events: [
        { id: "e1", year: 1922, text: "Cumhuriyet ilan edildi.", lang: "tr" },
        { id: "e2", year: 2001, text: "Bir olay daha yaşandı.", lang: "tr" },
      ],
      births: [
        {
          id: "b1",
          year: 1930,
          text: "Biri doğdu.",
          lang: "tr",
          pages: [gercekSayfa("births", (p) => !!p.thumbnail && !!p.extract)],
        },
      ],
      deaths: [
        {
          id: "d1",
          year: 1945,
          text: "Bir köydeki katliamda çok sayıda kişi hayatını kaybetti.",
          lang: "tr",
          pages: [gercekSayfa("deaths", (p) => !!p.extract)],
        },
      ],
      holidays: [{ id: "h1", text: "Bugünün bir anlamı var." }],
      selected: [],
      sources: { events: "tr", births: "tr", deaths: "tr" },
      offline: false,
      stale: false,
      error: null,
      fetchedAt: 0,
    };

    const cards = buildAutoTalk(gun);
    expect(cards.length).toBe(5); // 6 aday üretilir (lead/contrast/birth/death/dark/holiday), 5 ile sınırlanır
    expect(cards.map((c) => c.id)).toContain("auto-dark");
    expect(cards.find((c) => c.id === "auto-dark")?.hook).toContain("Şiddet");
    expect(cards.map((c) => c.id)).toContain("auto-birth");
    expect(cards.map((c) => c.id)).toContain("auto-contrast");
    // 6. sıradaki "auto-holiday" sınıra takılıp düşmeli
    expect(cards.map((c) => c.id)).not.toContain("auto-holiday");
  });

  it("240-329 karakter gövde → estimateMinutes 2 döner", () => {
    const uzunMetin = "Bu, ".repeat(70) + "bitti.";
    const gun: DayData = {
      ...bosGun,
      events: [{ id: "e1", year: 1900, text: uzunMetin, lang: "tr" }],
    };
    expect(buildAutoTalk(gun)[0].minutes).toBe(2);
  });

  it("yalnızca tatil verisi varsa tatil kartı üretilir", () => {
    const gun: DayData = { ...bosGun, holidays: [{ id: "h1", text: "Bugünün bir anlamı var." }] };
    const cards = buildAutoTalk(gun);
    expect(cards).toEqual([
      expect.objectContaining({ id: "auto-holiday", body: "Bugünün bir anlamı var." }),
    ]);
  });
});
