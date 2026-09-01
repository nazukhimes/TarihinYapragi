import { describe, it, expect, vi, afterEach } from "vitest";
import {
  OzetHatasi,
  ozetDurumMesaji,
  ozetOnbelleginiTemizle,
  ozetUrl,
  sayfaOzetiGetir,
} from "./sayfaOzeti";

const YANIT = {
  title: "Washington Yangını",
  titles: { normalized: "Washington Yangını" },
  extract: "Washington Yangını, 1812 Savaşı'nın Chesapeake Harekâtı sırasında …",
  content_urls: { desktop: { page: "https://tr.wikipedia.org/wiki/Washington_Yang%C4%B1n%C4%B1" } },
  thumbnail: { source: "https://upload.wikimedia.org/x.jpg" },
};

/** `fetch` kuklası — verilen yanıtı döndürür, çağrı sayısını sayar. */
function fetchKuklasi(ok: boolean, status: number, govde: unknown = YANIT) {
  const kukla = vi.fn(() =>
    Promise.resolve({ ok, status, json: () => Promise.resolve(govde) } as Response)
  );
  vi.stubGlobal("fetch", kukla);
  return kukla;
}

afterEach(() => {
  ozetOnbelleginiTemizle();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("ozetUrl", () => {
  it("boşluk alt çizgiye döner, Türkçe harfler yüzdeyle kodlanır", () =>
    expect(ozetUrl("Washington Yangını", "tr")).toBe(
      "https://tr.wikipedia.org/api/rest_v1/page/summary/Washington_Yang%C4%B1n%C4%B1"
    ));

  it("dil uç noktayı belirler", () =>
    expect(ozetUrl("Moon landing", "en")).toBe(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Moon_landing"
    ));
});

describe("ozetDurumMesaji — hepsi Türkçe", () => {
  it("404", () => expect(ozetDurumMesaji(404)).toBe("Bu madde Vikipedi'de bulunamadı."));
  it("429", () =>
    expect(ozetDurumMesaji(429)).toBe("Arşiv çok yoğun. Biraz sonra tekrar deneyin."));
  it("503", () => expect(ozetDurumMesaji(503)).toBe("Vikipedi sunucusu yanıt vermiyor."));
  it("bilinmeyen", () => expect(ozetDurumMesaji(418)).toBe("Özet alınamadı."));
});

describe("sayfaOzetiGetir", () => {
  it("yanıtı panelin okuduğu alanlara çevirir", async () => {
    fetchKuklasi(true, 200);
    const ozet = await sayfaOzetiGetir("Washington Yangını");
    expect(ozet).toEqual({
      baslik: "Washington Yangını",
      metin: YANIT.extract,
      url: YANIT.content_urls.desktop.page,
      gorsel: YANIT.thumbnail.source,
    });
  });

  /* T-19 kabul kriteri: aynı paneli iki kez açmak iki istek üretmez. */
  it("aynı başlık ikinci kez istendiğinde ağa çıkmaz", async () => {
    const kukla = fetchKuklasi(true, 200);
    await sayfaOzetiGetir("Washington Yangını");
    await sayfaOzetiGetir("Washington Yangını");
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("önbellek dile göre ayrışır", async () => {
    const kukla = fetchKuklasi(true, 200);
    await sayfaOzetiGetir("Apollo 11", "tr");
    await sayfaOzetiGetir("Apollo 11", "en");
    expect(kukla).toHaveBeenCalledTimes(2);
  });

  it("404 → Türkçe mesaj, önbelleğe yazılmaz (tekrar denenebilir)", async () => {
    const kukla = fetchKuklasi(false, 404);
    await expect(sayfaOzetiGetir("Yok Böyle Bir Madde")).rejects.toThrow(
      "Bu madde Vikipedi'de bulunamadı."
    );
    await expect(sayfaOzetiGetir("Yok Böyle Bir Madde")).rejects.toThrow(OzetHatasi);
    expect(kukla).toHaveBeenCalledTimes(2);
  });

  it("özet boş gelirse hata", async () => {
    fetchKuklasi(true, 200, { title: "Boş", extract: "   " });
    await expect(sayfaOzetiGetir("Boş")).rejects.toThrow("Bu madde için özet bulunamadı.");
  });

  it("ağ hatası Türkçeleştirilir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
    );
    await expect(sayfaOzetiGetir("Herhangi")).rejects.toThrow("Bağlantı kurulamadı.");
  });

  it("zaman aşımı Türkçe mesaja döner", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_u: string, init?: RequestInit) =>
          new Promise((_r, rej) =>
            init?.signal?.addEventListener("abort", () =>
              rej(new DOMException("Aborted", "AbortError"))
            )
          )
      )
    );
    const bekleyen = sayfaOzetiGetir("Ağır Madde");
    const beklenti = expect(bekleyen).rejects.toThrow("Yanıt gelmedi, tekrar deneyin.");
    await vi.advanceTimersByTimeAsync(12_000);
    await beklenti;
  });

  /* Dışarıdan gelen iptal (panel kapandı / gün değişti) bir hata değil: çağıran
     bunu bilmeli, bu yüzden Türkçeleştirilmeden yukarı iletilir. */
  it("çağıranın iptali olduğu gibi iletilir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_u: string, init?: RequestInit) =>
          new Promise((_r, rej) =>
            init?.signal?.addEventListener("abort", () =>
              rej(new DOMException("Aborted", "AbortError"))
            )
          )
      )
    );
    const ctrl = new AbortController();
    const bekleyen = sayfaOzetiGetir("Herhangi", "tr", ctrl.signal);
    ctrl.abort();
    await expect(bekleyen).rejects.toSatisfy(
      (e: unknown) => e instanceof DOMException && !(e instanceof OzetHatasi)
    );
  });
});
