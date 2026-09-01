import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DetayPaneli, wikiAramaUrl, type OlayKaynagi } from "./DetayPaneli";
import { ozetOnbelleginiTemizle } from "../lib/sayfaOzeti";

const SAYFALAR: OlayKaynagi[] = [
  {
    title: "İngiltere",
    description: "Batı Avrupa'daki bir Birleşik Krallık ülkesi",
    extract: "İngiltere, Birleşik Krallık'ı oluşturan dört ülkeden biridir.",
    thumbnail: "https://upload.wikimedia.org/ingiltere.jpg",
    url: "https://tr.wikipedia.org/wiki/%C4%B0ngiltere",
  },
  {
    title: "Beyaz Saray",
    description: "ABD başkanının resmî konutu",
    url: "https://tr.wikipedia.org/wiki/Beyaz_Saray",
  },
];

function fetchKuklasi(extract = "Washington Yangını, 1812 Savaşı sırasında yaşandı.") {
  const kukla = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          title: "Washington Yangını",
          titles: { normalized: "Washington Yangını" },
          extract,
          content_urls: { desktop: { page: "https://tr.wikipedia.org/wiki/Washington_Yangini" } },
        }),
    } as Response)
  );
  vi.stubGlobal("fetch", kukla);
  return kukla;
}

afterEach(() => {
  ozetOnbelleginiTemizle();
  vi.unstubAllGlobals();
});

describe("wikiAramaUrl", () => {
  it("olay metnini arama sayfasına taşır", () =>
    expect(wikiAramaUrl("tr", "Bursa Kapalı Çarşı yangını")).toBe(
      "https://tr.wikipedia.org/w/index.php?search=Bursa%20Kapal%C4%B1%20%C3%87ar%C5%9F%C4%B1%20yang%C4%B1n%C4%B1"
    ));

  it("dil uç noktayı belirler", () =>
    expect(wikiAramaUrl("en", "moon")).toBe("https://en.wikipedia.org/w/index.php?search=moon"));
});

describe("DetayPaneli — kaynak rozeti", () => {
  it("editör kaydında Editör rozeti", () => {
    render(<DetayPaneli baslik="Bir olay" kaynak="editor" />);
    expect(screen.getByText("Editör")).toBeInTheDocument();
  });

  it("besleme kaydında Otomatik rozeti", () => {
    render(<DetayPaneli baslik="Bir olay" kaynak="otomatik" />);
    expect(screen.getByText("Otomatik")).toBeInTheDocument();
  });

  it("rozet çağrı noktasında zaten varsa basılmaz", () => {
    render(<DetayPaneli baslik="Bir olay" kaynak="otomatik" rozetGoster={false} />);
    expect(screen.queryByText("Otomatik")).not.toBeInTheDocument();
  });
});

describe("DetayPaneli — görsel", () => {
  it("görsel verilirse başlıkla etiketlenmiş olarak basılır", () => {
    render(<DetayPaneli baslik="Washington Yangını" kaynak="otomatik" gorsel="https://x/y.jpg" />);
    expect(screen.getByRole("img", { name: "Washington Yangını" })).toHaveAttribute(
      "src",
      "https://x/y.jpg"
    );
  });

  /* Kabul kriteri: görseli olmayan kayıtta boş alan bırakılmaz. */
  it("görsel yoksa hiç img düğümü olmaz", () => {
    render(<DetayPaneli baslik="Bir olay" metin="Bir metin." kaynak="otomatik" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("DetayPaneli — metin künyesi", () => {
  it("metnin hangi maddeden geldiğini söyler", () => {
    render(
      <DetayPaneli
        baslik="İngiliz Birlikleri Washington'u işgal etti"
        metin={SAYFALAR[0].extract}
        metinKaynagi={SAYFALAR[0]}
        kaynak="otomatik"
      />
    );
    expect(screen.getByRole("link", { name: "İngiltere" })).toHaveAttribute(
      "href",
      SAYFALAR[0].url
    );
  });
});

describe("DetayPaneli — kaynak çipleri", () => {
  it("her sayfa için bir çip ve arama çıkışı basar", () => {
    render(
      <DetayPaneli baslik="Bir olay" sayfalar={SAYFALAR} aramaMetni="Bir olay" kaynak="otomatik" />
    );
    expect(screen.getByRole("link", { name: /İngiltere/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Beyaz Saray/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Vikipedi'de ara/ })).toHaveAttribute(
      "href",
      wikiAramaUrl("tr", "Bir olay")
    );
  });

  it("çapraz eşleme aynı bağlantıyı ikinci kez basmaz", () => {
    render(
      <DetayPaneli
        baslik="Bir olay"
        sayfalar={SAYFALAR}
        olayMakalesi={{ title: "Beyaz Saray", url: SAYFALAR[1].url }}
        kaynak="otomatik"
      />
    );
    expect(screen.getAllByRole("link", { name: /Beyaz Saray/ })).toHaveLength(1);
    expect(screen.getByText("Bu olay hakkında")).toBeInTheDocument();
  });

  it("hiç çip ve arama metni yoksa Kaynaklar başlığı çıkmaz", () => {
    render(<DetayPaneli baslik="Bir olay" metin="Editör metni." kaynak="editor" />);
    expect(screen.queryByText("Kaynaklar")).not.toBeInTheDocument();
  });
});

describe("DetayPaneli — Daha fazlasını oku", () => {
  it("ozetBasligi verilmezse düğme hiç çıkmaz", () => {
    const kukla = fetchKuklasi();
    render(<DetayPaneli baslik="Bir olay" metin="Bir metin." kaynak="otomatik" />);
    expect(screen.queryByRole("button", { name: /Daha fazlasını oku/ })).not.toBeInTheDocument();
    expect(kukla).not.toHaveBeenCalled();
  });

  /* Kabul kriteri: ağ isteği YALNIZCA basılınca çıkar. */
  it("panel açılırken ağa çıkmaz, yalnızca basılınca çıkar", async () => {
    const kukla = fetchKuklasi();
    render(<DetayPaneli baslik="Bir olay" kaynak="otomatik" ozetBasligi="Washington Yangını" />);
    expect(kukla).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /Daha fazlasını oku/ }));
    await screen.findByText("Washington Yangını, 1812 Savaşı sırasında yaşandı.");
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  /* Kabul kriteri: aynı paneli iki kez açmak iki istek üretmez. */
  it("panel kapanıp yeniden açıldığında ikinci istek çıkmaz", async () => {
    const kukla = fetchKuklasi();
    const { unmount } = render(
      <DetayPaneli baslik="Bir olay" kaynak="otomatik" ozetBasligi="Washington Yangını" />
    );
    await userEvent.click(screen.getByRole("button", { name: /Daha fazlasını oku/ }));
    await screen.findByText("Washington Yangını, 1812 Savaşı sırasında yaşandı.");
    unmount();

    render(<DetayPaneli baslik="Bir olay" kaynak="otomatik" ozetBasligi="Washington Yangını" />);
    await userEvent.click(screen.getByRole("button", { name: /Daha fazlasını oku/ }));
    await screen.findByText("Washington Yangını, 1812 Savaşı sırasında yaşandı.");
    expect(kukla).toHaveBeenCalledTimes(1);
  });

  it("beklerken iskelet gösterir", async () => {
    let cozumle: (() => void) | null = null;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((res) => {
            cozumle = () =>
              res({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ title: "X", extract: "Uzun özet." }),
              } as Response);
          })
      )
    );
    render(<DetayPaneli baslik="Bir olay" kaynak="otomatik" ozetBasligi="X" />);
    await userEvent.click(screen.getByRole("button", { name: /Daha fazlasını oku/ }));

    expect(screen.getByRole("status", { name: "Özet yükleniyor" })).toBeInTheDocument();
    cozumle!();
    await screen.findByText("Uzun özet.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  /* Kabul kriteri: hata panelin geri kalanını bozmaz, mesaj Türkçe çıkar. */
  it("hata Türkçe basılır, çipler ve metin yerinde kalır", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) } as Response)
      )
    );
    render(
      <DetayPaneli
        baslik="Bir olay"
        metin="Beslemeden gelen özet."
        sayfalar={SAYFALAR}
        aramaMetni="Bir olay"
        kaynak="otomatik"
        ozetBasligi="Yok Böyle Bir Madde"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /Daha fazlasını oku/ }));

    await waitFor(() =>
      expect(screen.getByText("Bu madde Vikipedi'de bulunamadı.")).toBeInTheDocument()
    );
    expect(screen.getByText("Beslemeden gelen özet.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /İngiltere/ })).toBeInTheDocument();
    // Düğme duruyor — tekrar denenebilir.
    expect(screen.getByRole("button", { name: /Daha fazlasını oku/ })).toBeInTheDocument();
  });
});

/* T-19 madde 6: yuva tanımlı ve bu talimatta boş. */
describe("DetayPaneli — T-20 yuvası", () => {
  it("children verilmezse hiç render edilmez", () => {
    const { container } = render(
      <DetayPaneli baslik="Bir olay" metin="Bir metin." kaynak="otomatik" />
    );
    expect(container.querySelector(".border-dashed")).toBeNull();
  });

  it("children verilirse panelin en altında basılır", () => {
    render(
      <DetayPaneli baslik="Bir olay" metin="Bir metin." kaynak="otomatik">
        <p>Yapay zekâ bölümü</p>
      </DetayPaneli>
    );
    expect(screen.getByText("Yapay zekâ bölümü")).toBeInTheDocument();
  });
});
