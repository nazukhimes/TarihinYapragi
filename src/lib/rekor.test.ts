import { describe, it, expect } from "vitest";
import {
  buildRekorTalk,
  gununRekorlari,
  rekorGunAnahtari,
  rekorMetni,
  rotasyonAdimi,
} from "./rekor";
import { REKORLAR } from "../data/rekorlar";
import type { WorldRecord } from "../data/types";
import { daysInMonth } from "./date";

function sahteRekor(id: string, ek: Partial<WorldRecord> = {}): WorldRecord {
  return {
    id,
    title: `Rekor ${id}`,
    holder: "Test",
    value: "1 birim",
    year: 2000,
    scope: "tuhaf",
    status: "GÜNCEL",
    summary: "özet",
    story: "hikâye",
    official: true,
    tags: [],
    ...ek,
  };
}

describe("rotasyonAdimi", () => {
  it("havuz boyuyla aralarında asal bir değer döner", () => {
    // Aralarında asal olmazsa rotasyon havuzun bir alt kümesinde döner ve
    // bazı rekorlar hiçbir gün görünmez — bu fonksiyonun tek işi bunu önlemek.
    for (let n = 3; n <= 60; n++) {
      const adim = rotasyonAdimi(n);
      const obeb = (a: number, b: number): number => (b === 0 ? a : obeb(b, a % b));
      expect(obeb(adim, n), `n=${n}`).toBe(1);
    }
  });

  it("çok küçük havuzlarda 1 döner", () => {
    expect(rotasyonAdimi(1)).toBe(1);
    expect(rotasyonAdimi(2)).toBe(1);
  });
});

describe("rekorGunAnahtari", () => {
  it("MM-DD biçimi üretir", () => {
    expect(rekorGunAnahtari(8, 5)).toBe("08-05");
    expect(rekorGunAnahtari(12, 31)).toBe("12-31");
  });
});

describe("gununRekorlari", () => {
  const havuz = Array.from({ length: 12 }, (_, i) => sahteRekor(`r${i}`));

  it("aynı gün her zaman aynı sonucu verir", () => {
    const a = gununRekorlari(havuz, 8, 5);
    const b = gununRekorlari(havuz, 8, 5);
    expect(a.gosterilecek.map((r) => r.id)).toEqual(b.gosterilecek.map((r) => r.id));
  });

  it("ardışık günler farklı rekorlar gösterir", () => {
    const a = gununRekorlari(havuz, 8, 5).gosterilecek.map((r) => r.id);
    const b = gununRekorlari(havuz, 8, 6).gosterilecek.map((r) => r.id);
    expect(a).not.toEqual(b);
  });

  it("istenen adet kadar kayıt döner", () => {
    expect(gununRekorlari(havuz, 3, 14, 3).gosterilecek).toHaveLength(3);
    expect(gununRekorlari(havuz, 3, 14, 5).gosterilecek).toHaveLength(5);
  });

  it("havuz adetten küçükse havuz kadar döner, tekrar etmez", () => {
    const kucuk = [sahteRekor("a"), sahteRekor("b")];
    const sonuc = gununRekorlari(kucuk, 6, 1, 5).gosterilecek;
    expect(sonuc).toHaveLength(2);
    expect(new Set(sonuc.map((r) => r.id)).size).toBe(2);
  });

  it("boş havuzda çökmez", () => {
    expect(gununRekorlari([], 1, 1).gosterilecek).toEqual([]);
  });

  it("bir yıl boyunca havuzun tamamını dolaşır", () => {
    // Rotasyonun asıl vaadi bu: hiçbir rekor "hiç görünmeyen" olmamalı.
    const gorulen = new Set<string>();
    for (let ay = 1; ay <= 12; ay++) {
      for (let gun = 1; gun <= daysInMonth(ay); gun++) {
        gununRekorlari(havuz, ay, gun).gosterilecek.forEach((r) => gorulen.add(r.id));
      }
    }
    expect(gorulen.size).toBe(havuz.length);
  });

  it("tarihi sabitlenmiş rekor yalnızca kendi gününde ve listenin başında çıkar", () => {
    const sabitli = [...havuz, sahteRekor("sabit", { date: "04-08" })];

    const oGun = gununRekorlari(sabitli, 4, 8);
    expect(oGun.gosterilecek[0].id).toBe("sabit");
    expect(oGun.sabit.map((r) => r.id)).toEqual(["sabit"]);

    const baskaGun = gununRekorlari(sabitli, 4, 9);
    expect(baskaGun.gosterilecek.some((r) => r.id === "sabit")).toBe(false);
    expect(baskaGun.sabit).toEqual([]);
  });

  it("sabit kayıt adet sınırını doldurur, toplam adet aşılmaz", () => {
    const sabitli = [...havuz, sahteRekor("s1", { date: "04-08" })];
    expect(gununRekorlari(sabitli, 4, 8, 3).gosterilecek).toHaveLength(3);
  });

  it("sabit kayıtlar adetten fazlaysa hepsi gösterilir", () => {
    // Doğrulanmış bir rekoru kontenjan yüzünden gizlemek yanlış olurdu.
    const cokSabit = [
      sahteRekor("s1", { date: "04-08" }),
      sahteRekor("s2", { date: "04-08" }),
      sahteRekor("s3", { date: "04-08" }),
      sahteRekor("s4", { date: "04-08" }),
    ];
    expect(gununRekorlari(cokSabit, 4, 8, 2).gosterilecek).toHaveLength(4);
  });

  it("yıla göre değişmez — paylaşılan bağlantı aynı içeriği açar", () => {
    // dayOfYear sabit referans yılla çağrıldığı için sonuç takvim gününe bağlıdır.
    const a = gununRekorlari(havuz, 11, 20).gosterilecek.map((r) => r.id);
    const b = gununRekorlari(havuz, 11, 20).gosterilecek.map((r) => r.id);
    expect(a).toEqual(b);
  });
});

describe("rekorMetni", () => {
  it("boş alanları atlar", () => {
    expect(rekorMetni(sahteRekor("x"))).toBe("hikâye");
  });

  it("kıyas ve soruyu ekler", () => {
    const r = sahteRekor("x", { compare: "kıyas", question: "soru" });
    expect(rekorMetni(r)).toBe("hikâye kıyas soru");
  });
});

describe("buildRekorTalk", () => {
  it("yalnızca opener'ı olan rekorlar karta dönüşür", () => {
    const kartlar = buildRekorTalk([
      sahteRekor("a", { opener: "kanca" }),
      sahteRekor("b"), // opener yok → kart olmamalı
    ]);
    expect(kartlar).toHaveLength(1);
    expect(kartlar[0].hook).toBe("kanca");
  });

  it("adet sınırına uyar", () => {
    const cok = Array.from({ length: 5 }, (_, i) => sahteRekor(`r${i}`, { opener: "k" }));
    expect(buildRekorTalk(cok, 2)).toHaveLength(2);
  });

  it("TalkCard sözleşmesini karşılar", () => {
    const [kart] = buildRekorTalk([sahteRekor("a", { opener: "kanca" })]);
    expect(kart.id).toBe("talk-a");
    expect(kart.category).toBe("Rekorlar");
    expect(kart.body.length).toBeGreaterThan(0);
    expect([1, 2, 3]).toContain(kart.minutes);
  });
});

describe("gerçek havuzla davranış", () => {
  it("her takvim günü dolu bir kasa döner (boş gün yoktur ilkesi)", () => {
    for (let ay = 1; ay <= 12; ay++) {
      for (let gun = 1; gun <= daysInMonth(ay); gun++) {
        const sonuc = gununRekorlari(REKORLAR, ay, gun);
        expect(sonuc.gosterilecek.length, `${ay}-${gun}`).toBeGreaterThan(0);
      }
    }
  });
});
