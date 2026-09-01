import { describe, it, expect } from "vitest";
import {
  esOlayiBul,
  jetonlar,
  katla,
  olayAnahtari,
  olayMakalesiMi,
  ortakJetonSayisi,
  yilAralikta,
} from "./olayMakalesi";
import type { WikiPage } from "./wiki";

/**
 * Bu dosyadaki sayfa ve metin örneklerinin tamamı **canlı beslemeden** alınmıştır
 * (`api.wikimedia.org/feed/v1/wikipedia/{tr,en}/onthisday/events/…`, 2026-08-31'de
 * çekilen 6 gün: 08-24, 03-07, 02-29, 10-29, 01-01, 07-15). Uydurma açıklama yok —
 * sözleşme değişirse test değil, gerçek davranış konuşur (bkz. wiki.test.ts notu).
 */
const sayfa = (title: string, description?: string): WikiPage => ({ title, description });

describe("katla — TR/EN karşılaştırması için normalleştirme", () => {
  it("Türkçe harfleri ASCII'ye indiriyor", () => {
    expect(katla("Bişkek")).toBe("biskek");
    expect(katla("Iğdır")).toBe("igdir");
    expect(katla("İstanbul")).toBe("istanbul");
  });
  it("aksanları çözüyor", () => expect(katla("Getúlio")).toBe("getulio"));
});

describe("jetonlar", () => {
  it("Türkçe eki atıyor", () => expect(jetonlar("Washington'u işgal")).toContain("washington"));
  it("kısa kelimeleri eliyor", () => {
    // "the", "ile", "bir" iki metni rastgele eşleştirirdi.
    expect(jetonlar("bir ile the Washington")).toEqual(["washington"]);
  });
});

describe("ortakJetonSayisi", () => {
  it("hiç ortak yoksa 0", () =>
    expect(ortakJetonSayisi(["washington"], ["hurricane", "andrew"])).toBe(0));
  it("tam eşleşme sayılıyor", () =>
    expect(ortakJetonSayisi(["windows", "microsoft"], ["microsoft", "releases", "windows"])).toBe(
      2
    ));
  it("5 harflik ön ek eşleşmesi sayılıyor", () =>
    expect(ortakJetonSayisi(["grunwald"], ["grunwaldu"])).toBe(1));
  it("aynı jeton iki kez sayılmıyor", () =>
    expect(ortakJetonSayisi(["boeing"], ["boeing", "boeing"])).toBe(1));
});

/* Aralık kapısı olmadan 1991 olayı "Sovyetler Birliği Komünist Partisi"ne,
   1954 olayı "Café Filho"ya bağlanıyordu — O-14'ün ta kendisi. */
describe("yilAralikta", () => {
  it.each([
    ["Ruling party of the Soviet Union (1912–1991)", 1991],
    ["Leader of the Soviet Union from 1985 to 1991", 1991],
    ["President of Brazil from 1954 to 1955", 1954],
    ["Government of the United Kingdom from 1929 to 1931", 1931],
    ["Unrecognized state in Spain (1936–37)", 1936],
    ["Part of Ottoman–Mamluk War (1516–17)", 1516],
  ])('"%s" içinde %i bir aralığın parçası', (metin, yil) =>
    expect(yilAralikta(metin, yil)).toBe(true)
  );

  it.each([
    ["1814 British attack on the United States", 1814],
    ["Category 5 Atlantic hurricane in 1992", 1992],
    ["1991 act declaring independence from the USSR", 1991],
    ["Sack of Rome (410)", 410],
  ])('"%s" içinde %i aralık değil', (metin, yil) => expect(yilAralikta(metin, yil)).toBe(false));
});

describe("olayMakalesiMi", () => {
  it("hedef örnek: Burning of Washington geçiyor", () =>
    expect(
      olayMakalesiMi(
        sayfa("Burning_of_Washington", "1814 British attack on the United States"),
        1814
      )
    ).toBe(true));

  it("başlıkta yıl taşıyan makale geçiyor", () =>
    expect(
      olayMakalesiMi(sayfa("1929_Hebron_massacre", "Killing of Jews in Mandatory Palestine"), 1929)
    ).toBe(true));

  it("yılı hiç geçmeyen genel varlık geçmiyor", () =>
    expect(olayMakalesiMi(sayfa("Ukraine", "Country in Eastern Europe"), 1991)).toBe(false));

  it("puanlamanın bozduğu örnek — Amelia Earhart geçmiyor", () =>
    // 1932 olayında kişinin ömür aralığı (1897–1937) yılı içermez; içerseydi bile
    // aralık kapısı elerdi. O-14'te otomatik puanlama tam burada sonucu bozmuştu.
    expect(
      olayMakalesiMi(sayfa("Amelia_Earhart", "American aviation pioneer (1897–1937)"), 1932)
    ).toBe(false));

  it("ömür/görev aralığı taşıyan kişi maddesi geçmiyor", () =>
    expect(olayMakalesiMi(sayfa("Café_Filho", "President of Brazil from 1954 to 1955"), 1954)).toBe(
      false
    ));

  it.each(["AD 161", "404", "44 BC"])('EN yıl maddesi "%s" geçmiyor', (baslik) =>
    expect(olayMakalesiMi(sayfa(baslik, "year"), 404)).toBe(false)
  );

  it("yıl parantez içindeyse geçiyor", () =>
    expect(
      olayMakalesiMi(sayfa("Sack_of_Rome_(410)", "Siege and sack of Rome by the Visigoths"), 410)
    ).toBe(true));

  it("başka bir yılın geçmesi yetmiyor", () =>
    expect(
      olayMakalesiMi(sayfa("Murder_of_John_Lennon", "1980 murder in New York City, US"), 1981)
    ).toBe(false));
});

describe("esOlayiBul — aynı yıl yetmez", () => {
  const bulunanMetin = (r: { text: string } | null) => r?.text;

  it("ortak özel isim yoksa eşleştirmiyor", () => {
    // 24 Ağustos 1992: TR "Çin–Güney Kore", EN "Hurricane Andrew". Aynı yıl,
    // bambaşka olay — bu kapı olmadan çip Hurricane Andrew'a gidiyordu.
    const r = esOlayiBul("Çin ve Güney Kore arasında diplomatik ilişkiler başladı.", [
      { text: "Hurricane Andrew makes landfall in Homestead, Florida as a Category 5 hurricane." },
    ]);
    expect(r).toBeNull();
  });

  it("ortak özel isim varsa doğru adayı seçiyor", () => {
    const r = esOlayiBul("İngiliz Birlikleri, Washington'u işgal etti, White House…", [
      { text: "Ukraine declares itself independent from the Soviet Union." },
      { text: "British troops capture Washington, D.C. and set the Presidential Mansion…" },
    ]);
    expect(bulunanMetin(r)).toMatch(/British troops/);
  });

  it("berabere kalan adaylarda susuyor", () => {
    const r = esOlayiBul("Boeing 737 kazası", [
      { text: "A Boeing crash in Guatemala." },
      { text: "Another Boeing crash in Nigeria." },
    ]);
    expect(r).toBeNull();
  });

  it("aday yoksa null", () => expect(esOlayiBul("herhangi bir olay", [])).toBeNull());
});

describe("olayAnahtari — önbellek anahtarı içerikten türer", () => {
  it("aynı olay aynı anahtarı verir", () =>
    expect(olayAnahtari(1814, "İngiliz Birlikleri, Washington'u işgal etti.")).toBe(
      olayAnahtari(1814, "İngiliz Birlikleri, Washington'u işgal etti.")
    ));

  it("farklı yıl farklı anahtar", () =>
    expect(olayAnahtari(1814, "aynı metin")).not.toBe(olayAnahtari(1815, "aynı metin")));

  it("dizinden bağımsızdır — besleme sıra değiştirse de anahtar sabit kalır", () =>
    expect(olayAnahtari(1814, "Washington işgal edildi.")).not.toContain("events-tr"));
});
