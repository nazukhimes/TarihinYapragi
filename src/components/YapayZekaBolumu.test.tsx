import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { YapayZekaBolumu } from "./YapayZekaBolumu";
import { anahtarSil, anahtarYaz, YZ_MESAJ } from "../lib/yapayzeka";

const EXTRACT =
  "Washington Yangını, 1812 Savaşı sırasında İngiliz kuvvetlerinin Beyaz Saray'ı " +
  "ateşe vermesiyle sonuçlanan olaydır.";

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

function metinYaniti(metin: string) {
  return { candidates: [{ content: { parts: [{ text: metin }] } }] };
}

/** Gemini'nin `groundingMetadata` taşıyan, arama yapılmış yanıt gövdesi (T-25). */
function aramaYaniti(
  metin: string,
  kaynaklar: { uri: string; title?: string }[] = [
    { uri: "https://vertexaisearch.example/1", title: "reuters.com" },
  ]
) {
  return {
    candidates: [
      {
        content: { parts: [{ text: metin }] },
        groundingMetadata: {
          webSearchQueries: ["Washington Yangını 1814"],
          groundingChunks: kaynaklar.map((k) => ({ web: k })),
        },
      },
    ],
  };
}

/** Anahtarlı, kutusu açılmış bölüm — testlerin çoğu buradan başlıyor. */
async function bolumuAc(baglam = EXTRACT) {
  anahtarYaz("KUKLA-ANAHTAR");
  render(<YapayZekaBolumu baglam={baglam} />);
  await userEvent.click(screen.getByRole("button", { name: /Yapay zekâya sor/ }));
}

afterEach(() => {
  anahtarSil();
  vi.unstubAllGlobals();
});

/* ------------------------------------------------------- anahtarsız durum */

describe("YapayZekaBolumu — anahtar yokken", () => {
  it("soru kutusu yerine ayarlara yönlendiren uyarı çıkar", () => {
    render(<YapayZekaBolumu baglam={EXTRACT} />);
    expect(screen.getByRole("button", { name: /Önce anahtarınızı girin/ })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("uyarı düğmesi ayarlar olayını yayınlar — panel çökmez", async () => {
    const dinleyici = vi.fn();
    window.addEventListener("ty-yz-ayarlar", dinleyici);
    render(<YapayZekaBolumu baglam={EXTRACT} />);

    await userEvent.click(screen.getByRole("button", { name: /Önce anahtarınızı girin/ }));
    expect(dinleyici).toHaveBeenCalledTimes(1);
    window.removeEventListener("ty-yz-ayarlar", dinleyici);
  });

  it("anahtar kaydedilince düğme kendiliğinden 'Yapay zekâya sor'a döner", async () => {
    render(<YapayZekaBolumu baglam={EXTRACT} />);
    expect(screen.getByRole("button", { name: /Önce anahtarınızı girin/ })).toBeInTheDocument();

    // `anahtarYaz` olayı senkron yayınlıyor; abone bileşenin güncellemesi
    // React'in gözü önünde olsun diye `act` içine alınıyor.
    act(() => anahtarYaz("KUKLA-ANAHTAR"));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Yapay zekâya sor/ })).toBeInTheDocument()
    );
  });
});

/* --------------------------------------------------------- bağlam koşulu */

describe("YapayZekaBolumu — bağlam koşulu", () => {
  it("bağlam boşsa bölüm hiç render edilmez — bağlamsız soru sorulmaz", () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const { container } = render(<YapayZekaBolumu baglam="   " />);
    expect(container).toBeEmptyDOMElement();
  });
});

/* ------------------------------------------------- tetikleme (T-20 madde 4) */

describe("YapayZekaBolumu — istek yalnızca düğmeye basılınca", () => {
  it("render sırasında hiçbir istek çıkmaz", () => {
    anahtarYaz("KUKLA-ANAHTAR");
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    render(<YapayZekaBolumu baglam={EXTRACT} />);
    expect(kukla).not.toHaveBeenCalled();
  });

  it("kutuyu açmak da istek çıkarmaz", async () => {
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await bolumuAc();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(kukla).not.toHaveBeenCalled();
  });

  it("istek yalnızca 'Sor'a basılınca gider ve bir kez gider", async () => {
    const kukla = fetchKuklasi(metinYaniti("Beyaz Saray yakıldı."));
    await bolumuAc();

    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));
    await waitFor(() => expect(screen.getByText("Beyaz Saray yakıldı.")).toBeInTheDocument());
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("serbest soru isteğe taşınır", async () => {
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await bolumuAc();

    await userEvent.type(screen.getByRole("textbox"), "Kaç kişi öldü?");
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    await waitFor(() => expect(kukla).toHaveBeenCalledTimes(1));
    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    expect(init.body as string).toContain("Kaç kişi öldü?");
  });

  it("bağlam her istekte gövdeye gömülür", async () => {
    const kukla = fetchKuklasi(metinYaniti("Yanıt."));
    await bolumuAc();

    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));
    await waitFor(() => expect(kukla).toHaveBeenCalledTimes(1));

    const init = kukla.mock.calls[0]?.[1] as RequestInit;
    const govde = JSON.parse(init.body as string) as {
      contents: { parts: { text: string }[] }[];
    };
    expect(govde.contents[0].parts[0].text).toContain(EXTRACT);
  });
});

/* ---------------------------------------------- çıktı etiketi (T-20 madde 5) */

describe("YapayZekaBolumu — çıktı etiketleme", () => {
  it("yanıt 'YZ üretimi' rozetiyle basılır", async () => {
    fetchKuklasi(metinYaniti("Beyaz Saray yakıldı."));
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    await waitFor(() => expect(screen.getByText("YZ üretimi")).toBeInTheDocument());
  });

  it("rozet rengi Editör (altın) ve Otomatik (nötr) rozetlerinden farklı", async () => {
    fetchKuklasi(metinYaniti("Yanıt."));
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    const rozet = await screen.findByText("YZ üretimi");
    expect(rozet.className).toContain("lilac");
    expect(rozet.className).not.toContain("gold");
  });

  it("yanıtın altında doğrulama uyarısı sabit durur", async () => {
    fetchKuklasi(metinYaniti("Yanıt."));
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    expect(await screen.findByText(/doğrulayın/)).toBeInTheDocument();
    expect(screen.getByText(/Editör derlemesi değildir/)).toBeInTheDocument();
  });

  it("model çıktısı HTML olarak yorumlanmaz, düz metin basılır", async () => {
    // Sağlayıcı ele geçirilse bile çıktı bir metin düğümüdür: React'in kendi
    // kaçışı devrede, ham HTML basan hiçbir kaçış yolu kullanılmıyor.
    const zararli = '<img src=x onerror="alert(1)">Metin';
    fetchKuklasi(metinYaniti(zararli));

    anahtarYaz("KUKLA-ANAHTAR");
    const { container } = render(<YapayZekaBolumu baglam={EXTRACT} />);
    await userEvent.click(screen.getByRole("button", { name: /Yapay zekâya sor/ }));
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    expect(await screen.findByText(zararli)).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });
});

/* ------------------------------------------------- hata durumları (madde 6) */

describe("YapayZekaBolumu — dört hata durumu da Türkçe", () => {
  const senaryolar: [string, () => void, string][] = [
    ["geçersiz anahtar (400)", () => fetchKuklasi({}, 400), YZ_MESAJ.anahtar],
    ["kota dolu (429)", () => fetchKuklasi({}, 429), YZ_MESAJ.kota],
    [
      "ağ hatası",
      () =>
        vi.stubGlobal(
          "fetch",
          vi.fn(() => Promise.reject(new TypeError("Failed to fetch")))
        ),
      YZ_MESAJ.ag,
    ],
    ["içeriksiz yanıt", () => fetchKuklasi({ candidates: [] }), YZ_MESAJ.bos],
  ];

  for (const [ad, kur, mesaj] of senaryolar) {
    it(`${ad} → "${mesaj}"`, async () => {
      kur();
      await bolumuAc();
      await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

      expect(await screen.findByText(mesaj)).toBeInTheDocument();
    });
  }

  it("hata sonrası soru kutusu yerinde kalır — tekrar denenebilir", async () => {
    fetchKuklasi({}, 429);
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    expect(await screen.findByText(YZ_MESAJ.kota)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Sor$/ })).toBeEnabled();
  });

  it("hata hâlinde yanıt kutusu ve rozet basılmaz", async () => {
    fetchKuklasi({}, 500);
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    expect(await screen.findByText(YZ_MESAJ.sunucu)).toBeInTheDocument();
    expect(screen.queryByText("YZ üretimi")).not.toBeInTheDocument();
  });
});

/* --------------------------------------------------------- web araması (T-25) */

describe("YapayZekaBolumu — web araması (T-25 madde 6)", () => {
  it("arandi true iken kaynak listesi ve yeni künye cümlesi basılır", async () => {
    fetchKuklasi(
      aramaYaniti("Washington yakıldı.", [
        { uri: "https://vertexaisearch.example/1", title: "reuters.com" },
      ])
    );
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    await waitFor(() => expect(screen.getByText("Washington yakıldı.")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /reuters\.com/ })).toHaveAttribute(
      "href",
      "https://vertexaisearch.example/1"
    );
    expect(screen.getByText(/web'de arama yapılarak üretildi/)).toBeInTheDocument();
  });

  it("arandi false iken eski künye cümlesi basılır ve kaynak listesi hiç yok", async () => {
    fetchKuklasi(metinYaniti("Bağlamdan üretilen yanıt."));
    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    await waitFor(() => expect(screen.getByText("Bağlamdan üretilen yanıt.")).toBeInTheDocument());
    expect(screen.getByText(/Vikipedi özetine dayanılarak/)).toBeInTheDocument();
    expect(screen.queryByText("Kaynaklar")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("model aramayı desteklemiyorsa 'Anahtar geçersiz' değil, aramasız yanıt + tek satır açıklama gösterilir", async () => {
    const kukla = vi.fn((_url: string, init?: RequestInit) => {
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
    vi.stubGlobal("fetch", kukla);

    await bolumuAc();
    await userEvent.click(screen.getByRole("button", { name: /^Sor$/ }));

    await waitFor(() => expect(screen.getByText("Aramasız yanıt.")).toBeInTheDocument());
    expect(screen.queryByText(YZ_MESAJ.anahtar)).not.toBeInTheDocument();
    expect(screen.getByText(YZ_MESAJ.aramaYok)).toBeInTheDocument();
  });
});
