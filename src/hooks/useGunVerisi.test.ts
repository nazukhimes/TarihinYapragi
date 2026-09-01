import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import type { CuratedDay } from "../data";
import type { DayData, OtdItem } from "../lib/wiki";
import { useGunVerisi } from "./useGunVerisi";

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

const bosGunler: CuratedDay = { cases: [], science: [], talk: [] };

/** 29 Ekim'in canlı Vikipedi yanıtından alınmış, `classifyItem`'ın "bilim"
 *  saydığı gerçek bir olay metni: editör dosyasındaki `sci-1029-arpanet`
 *  kaydıyla AYNI olayı anlatıyor. */
const arpanetOlayi: OtdItem = {
  id: "e-arpanet",
  year: 1969,
  lang: "tr",
  text: "ABD'de ARPANET üzerinden ilk ağ mesajı gönderildi; bilgisayar bilimi tarihinde yeni bir dönem başladı.",
};

describe("allScience — editör/otomatik mükerrer ayıklaması (O-12)", () => {
  const kur = (curated: CuratedDay, events: OtdItem[]) =>
    renderHook(() => useGunVerisi({ ...bosGun, events }, curated, 10, 29)).result.current
      .allScience;

  it("matchKeys yazılmamışsa eleme yapılmaz — aynı olay iki kez listelenir", () => {
    const bilim = kur(
      {
        ...bosGunler,
        science: [
          {
            id: "sci-arpanet",
            year: 1969,
            field: "Teknoloji",
            title: "İlk ARPANET mesajı gönderildi",
            summary: "Editör kaydı.",
          },
        ],
      },
      [arpanetOlayi]
    );
    // O-12'nin ta kendisi: koruma yokken bölüm aynı olayı iki kez gösteriyordu.
    expect(bilim).toHaveLength(2);
  });

  it("matchKeys eşleşince Vikipedi'den gelen kopya düşer, editör kaydı kalır", () => {
    const bilim = kur(
      {
        ...bosGunler,
        science: [
          {
            id: "sci-arpanet",
            year: 1969,
            field: "Teknoloji",
            title: "İlk ARPANET mesajı gönderildi",
            summary: "Editör kaydı.",
            matchKeys: ["arpanet"],
          },
        ],
      },
      [arpanetOlayi]
    );
    expect(bilim).toHaveLength(1);
    expect(bilim[0]).toMatchObject({ id: "sci-arpanet", curated: true });
  });

  it("eşleşme Türkçe'ye duyarlı küçük harfle yapılır (İ/I tuzağı)", () => {
    const bilim = kur(
      {
        ...bosGunler,
        science: [
          {
            id: "sci-x",
            year: 1969,
            field: "Teknoloji",
            title: "Editör kaydı",
            summary: "…",
            matchKeys: ["İLK AĞ MESAJI"],
          },
        ],
      },
      [arpanetOlayi]
    );
    expect(bilim).toHaveLength(1);
  });

  it("eşleşmeyen otomatik kayıt korunur — koruma fazla eleme yapmıyor", () => {
    const baskaOlay: OtdItem = {
      id: "e-baska",
      year: 1895,
      lang: "tr",
      text: "Alman fizikçi Wilhelm Röntgen, X ışınını keşfetti.",
    };
    const bilim = kur(
      {
        ...bosGunler,
        science: [
          {
            id: "sci-arpanet",
            year: 1969,
            field: "Teknoloji",
            title: "İlk ARPANET mesajı gönderildi",
            summary: "Editör kaydı.",
            matchKeys: ["arpanet"],
          },
        ],
      },
      [arpanetOlayi, baskaOlay]
    );
    expect(bilim.map((s) => s.id)).toEqual(["sci-arpanet", "sci-e-baska"]);
  });
});
