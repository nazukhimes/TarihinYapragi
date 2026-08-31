import { describe, it, expect } from "vitest";
import { normalize, type SparqlBinding } from "./wikidata";

/**
 * Fixture'lar gerçek WDQS yanıtlarından kırpılmıştır (16 Ağustos ve 5 Ağustos
 * sorguları). Alan adları ve biçimler uydurulmadı — sözleşme değişirse bu
 * testler kırmızıya döner.
 */
function b(holder: string, holderLabel: string, recLabel: string, start: string): SparqlBinding {
  return {
    holder: { value: `http://www.wikidata.org/entity/${holder}` },
    holderLabel: { value: holderLabel },
    recLabel: { value: recLabel },
    start: { value: start },
  };
}

describe("normalize", () => {
  it("gerçek yanıttan geçerli kayıt üretir", () => {
    const out = normalize([
      b(
        "Q1189",
        "Usain Bolt",
        "Erkekler 100 metre dünya rekorunun gelişimi",
        "2009-08-16T00:00:00Z"
      ),
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      id: "wd-Q1189",
      holder: "Usain Bolt",
      record: "Erkekler 100 metre dünya rekorunun gelişimi",
      year: 2009,
    });
  });

  it("etiketi çözülmemiş kayıtları atar", () => {
    // Ne TR ne EN etiketi olan öğe için servis ham Q kimliğini döndürür.
    const out = normalize([
      b("Q1", "Usain Bolt", "Q3922803", "2012-08-05T00:00:00Z"),
      b("Q2", "Q999999", "men's pole vault world record", "2024-08-05T00:00:00Z"),
    ]);
    expect(out).toEqual([]);
  });

  it("jenerik rekor adlarını atar", () => {
    // "national record" ekranda hiçbir şey anlatmıyor — 16 Ağustos'ta gözlendi.
    const out = normalize([
      b("Q1", "Israel Olatunde", "national record", "2022-08-16T00:00:00Z"),
      b("Q2", "Biri", "world record", "2020-08-16T00:00:00Z"),
      b("Q3", "Başkası", "record", "2019-08-16T00:00:00Z"),
    ]);
    expect(out).toEqual([]);
  });

  it("jenerik olmayan uzun adları korur", () => {
    const out = normalize([
      b("Q1", "Sandra Perković", "Croatian record in discus throw", "2014-08-16T00:00:00Z"),
    ]);
    expect(out).toHaveLength(1);
  });

  it("kişi başına tek satır bırakır", () => {
    // Aynı yüzücü aynı gün iki mesafede rekor kırınca liste tek isimle doluyordu.
    const out = normalize([
      b(
        "Q25",
        "Shiro Hashizume",
        "World record progression 1500 metres freestyle",
        "1949-08-16T00:00:00Z"
      ),
      b(
        "Q25",
        "Shiro Hashizume",
        "World record progression 800 metres freestyle",
        "1949-08-16T00:00:00Z"
      ),
    ]);
    expect(out).toHaveLength(1);
  });

  it("yeniden eskiye sıralar", () => {
    const out = normalize([
      b("Q1", "Eski", "Men's 400 metres hurdles world record progression", "1920-08-16T00:00:00Z"),
      b("Q2", "Yeni", "5000 metres world record progression", "1995-08-16T00:00:00Z"),
    ]);
    expect(out.map((r) => r.year)).toEqual([1995, 1920]);
  });

  it("gösterim sınırını aşmaz", () => {
    const cok = Array.from({ length: 20 }, (_, i) =>
      b(
        `Q${i}`,
        `Sporcu ${i}`,
        `${i} metre dünya rekorunun gelişimi`,
        `20${10 + (i % 10)}-08-16T00:00:00Z`
      )
    );
    expect(normalize(cok).length).toBeLessThanOrEqual(6);
  });

  it("eksik veya bozuk alanlarda çökmez", () => {
    expect(normalize([])).toEqual([]);
    expect(normalize([{}])).toEqual([]);
    expect(normalize([{ holderLabel: { value: "Biri" } }])).toEqual([]);
    expect(normalize([b("Q1", "Biri", "geçerli uzun rekor adı", "bozuk-tarih")]).length).toBe(0);
  });
});
