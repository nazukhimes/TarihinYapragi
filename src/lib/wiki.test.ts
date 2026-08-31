import { describe, it, expect } from "vitest";
import { normalize, classifyStatus, buildAutoTalk } from "./wiki";
import type { DayData, WikiPage } from "./wiki";
import otd from "./__fixtures__/otd-tr-08-31.json";

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
  it("pages 3 ile sınırlı", () => {
    const r = normalize([{ year: 1, text: "a", pages: [1, 2, 3, 4, 5] as never }], "tr", "x");
    expect(r[0].pages).toHaveLength(3);
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

  it("240-459 karakter gövde → estimateMinutes 2 döner", () => {
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
