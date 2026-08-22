import { describe, it, expect } from "vitest";
import { normalize, classifyStatus, buildAutoTalk } from "./wiki";
import type { DayData } from "./wiki";

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
          pages: [
            {
              title: "Kişi",
              displaytitle: "Kişi",
              excerpt: "Kısa özet.",
              thumbnail: { source: "x.jpg" },
            },
          ],
        },
      ],
      deaths: [
        {
          id: "d1",
          year: 1945,
          text: "Bir köydeki katliamda çok sayıda kişi hayatını kaybetti.",
          lang: "tr",
          pages: [{ title: "Kurban", excerpt: "Özet." }],
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
