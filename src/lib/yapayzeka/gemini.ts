/**
 * GEMINI SAĞLAYICISI (T-20 madde 1, aday zinciri T-24)
 *
 * `YzSaglayici` arayüzünün tek uygulaması. Sağlayıcıya özgü **her şey** —
 * uç nokta, gövde biçimi, yanıt ayrıştırma, model listeleme — bu dosyada
 * kalır; panel ve `istem.ts` Gemini'yi tanımaz.
 *
 * Gemini, ücretsiz katmanı olduğu için seçildi (kullanıcı kararı, 2026-08-24
 * oturumu). Ücretsiz katmanda **web araması yoktur**; halüsinasyon azaltması
 * bu yüzden bağlam gömmeye dayanır, bkz. `istem.ts`.
 */

import { anahtarOku, modelOku, modelYaz } from "./anahtar";
import { istemBirlestir } from "./istem";
import { YZ_MESAJ, YzHatasi, yzDurumMesaji, type YzSaglayici } from "./tipler";

/**
 * ADAY MODEL ZİNCİRİ (T-24 madde 1).
 *
 * Tek bir model adı artık **tahmindir**, sabit değil: Google bir modeli
 * emekliye ayırdığında ya da ücretsiz katmandan çıkardığında uygulama `404`
 * alıp kilitleniyordu, düzeltmesi kaynak kodu güncellemekti (bkz. T-24
 * talimatı — canlı arıza, 2026-09-02).
 *
 * Sıra bilinçli: önce yeni/yetenekli, sonra ucuz/yüksek kotalı. `preview` ve
 * `exp` ekli adlar bilerek **dışarıda** — ücretsiz katmanda habersiz kapanırlar.
 * Zincirdeki ilk aday (henüz) yoksa bile zarar yok: `sor()` 404'te sessizce
 * sıradakine geçer.
 */
export const ADAY_MODELLER = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

function ucNokta(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

const MODEL_LISTESI_UCU = "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200";

const ZAMAN_ASIMI_MS = 30_000;

/**
 * ÇIKTI JETON BÜTÇESİ.
 *
 * Eskiden 900'dü ve bu **dardı**: `gemini-2.5-flash` düşünen bir modeldir,
 * düşünme varsayılan olarak açıktır ve düşünme jetonları da bu bütçeden
 * yenir. Model 900 jetonu düşünmeye harcayıp `finishReason: "MAX_TOKENS"` ile
 * **hiç metin döndürmeden** kapanabiliyordu; ekranda sebepsiz bir "yanıt
 * üretmedi" beliriyordu.
 *
 * Bütçe, düşünme payı üstüne birkaç paragraflık yanıt kalacak şekilde
 * genişletildi. Düşünmeyi tümden kapatan `thinkingConfig` alanı bilerek
 * kullanılmadı: v1beta şemasında doğrulanamadı ve tanınmayan bir alan
 * bütün istekleri 400'e düşürür.
 */
const YANIT_JETONU = 2048;

/** Yanıt gövdesinin okuduğumuz kadarı — Google'ın şemasının tamamı değil. */
interface GeminiYanit {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

/**
 * Anahtar HTTP başlığına konabilir mi?
 *
 * Başlık değerleri yalnızca ISO-8859-1 taşır. İçinde ASCII dışı ya da
 * görünmez bir karakter kalan anahtar `fetch`i **istek çıkmadan** `TypeError`
 * ile düşürür; bu da aşağıdaki `catch`te ağ hatasına benzer ve kullanıcıya
 * "Bağlantı kurulamadı." denirdi. Sebebi burada, doğru mesajla yakalıyoruz.
 *
 * `anahtar.ts` görünmezleri zaten siliyor; buraya düşen artık gerçek bir
 * karakterdir (yanlış kopyalanmış bir harf gibi) — yani anahtar hatalıdır.
 */
function basliktaTasinabilir(anahtar: string): boolean {
  return /^[\x21-\x7E]+$/.test(anahtar);
}

/** `candidates[0].content.parts[*].text` → tek düz metin. */
export function yanitiCoz(ham: GeminiYanit): string {
  const parcalar = ham.candidates?.[0]?.content?.parts ?? [];
  return parcalar
    .map((p) => p.text ?? "")
    .join("")
    .trim();
}

/**
 * Bu çağrıda sırayla denenecek modeller.
 *
 * `localStorage`'da sabitlenmiş bir model varsa (otomatik öğrenilmiş ya da
 * ayarlardan elle seçilmiş — ikisi de aynı yerde durur, bkz. `anahtar.ts`)
 * o ilk sırada denenir. Aday zincirinin geri kalanı **onu da** kapsar:
 * sabitlenen model de zamanla emekliye ayrılabilir, kendini onarma tek
 * seferlik bir keşif değil, her arızada yeniden devreye giren bir kuraldır.
 */
function denemeSirasi(): string[] {
  const sabit = modelOku();
  if (!sabit) return [...ADAY_MODELLER];
  return [sabit, ...ADAY_MODELLER.filter((m) => m !== sabit)];
}

async function sor(istem: string, baglam: string, signal?: AbortSignal): Promise<string> {
  const anahtar = anahtarOku();
  if (!anahtar) throw new YzHatasi(YZ_MESAJ.anahtar);
  if (!basliktaTasinabilir(anahtar)) throw new YzHatasi(YZ_MESAJ.anahtar);

  // Kendi süremizi koyuyoruz; dışarıdan gelen iptal de bu denetleyiciye bağlanır
  // (sayfaOzeti.ts'teki zamanlayıcı deseninin aynısı). Süre, aday zincirindeki
  // **bütün** denemeleri kapsar — tek istekte olduğu gibi tek bütçe.
  const ctrl = new AbortController();
  let zamanAsti = false;
  const zamanlayici = setTimeout(() => {
    zamanAsti = true;
    ctrl.abort();
  }, ZAMAN_ASIMI_MS);
  const disaridanIptal = () => ctrl.abort();
  signal?.addEventListener("abort", disaridanIptal);

  try {
    const govde = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: istemBirlestir(istem, baglam) }] }],
      generationConfig: {
        // Görev "açıkla", "yarat" değil — düşük sıcaklık metne bağlı kalmayı artırır.
        temperature: 0.2,
        maxOutputTokens: YANIT_JETONU,
      },
    });

    for (const model of denemeSirasi()) {
      const res = await fetch(ucNokta(model), {
        method: "POST",
        // Anahtar **başlıkta** gider, sorgu dizesinde değil: URL'ler tarayıcı
        // geçmişine, sunucu günlüklerine ve Referer başlığına düşer.
        headers: { "Content-Type": "application/json", "x-goog-api-key": anahtar },
        body: govde,
        signal: ctrl.signal,
      });

      // Yalnızca 404'te sıradaki adaya geçilir, kullanıcı hiçbir şey görmez
      // (T-24 madde 2). 400/401/403 anahtar sorunudur, 429 kotadır — bunlarda
      // başka model denemek arızayı gizler ve kotayı boşa yakar.
      if (res.status === 404) continue;
      if (!res.ok) throw new YzHatasi(yzDurumMesaji(res.status));

      const ham = (await res.json()) as GeminiYanit;
      const metin = yanitiCoz(ham);
      if (!metin) {
        // 200 döndü ama metin yok. İki ayrı sebep, iki ayrı mesaj: bütçe
        // dolduğu için kesilen yanıt ile güvenlik filtresine takılan yanıt
        // kullanıcı açısından aynı şey değil — biri tekrar denemeye değer.
        const sebep = ham.candidates?.[0]?.finishReason;
        throw new YzHatasi(sebep === "MAX_TOKENS" ? YZ_MESAJ.kesik : YZ_MESAJ.bos);
      }

      modelYaz(model);
      return metin;
    }
    // Zincirdeki her aday 404 verdi.
    throw new YzHatasi(YZ_MESAJ.model);
  } catch (e) {
    if (signal?.aborted) throw e; // beklenen iptal — çağıran bilmeli
    if (zamanAsti) throw new YzHatasi(YZ_MESAJ.zamanAsimi);
    if (e instanceof YzHatasi) throw e;
    // Buraya düşen hata kullanıcıya tek cümleye indirgenerek gösteriliyor;
    // ham hâli yutulmasın. Reklam engelleyicinin kestiği istek, kurumsal
    // güvenlik duvarı ve gerçek çevrimdışılık ekranda aynı görünür ama
    // konsolda ayrışır — kullanıcıdan tek isteyeceğimiz şey bu satır.
    console.error("[yapay zekâ] istek başarısız:", e);
    throw new YzHatasi(YZ_MESAJ.ag);
  } finally {
    clearTimeout(zamanlayici);
    signal?.removeEventListener("abort", disaridanIptal);
  }
}

/**
 * Anahtarın gerçekten erişebildiği, `generateContent` destekleyen modelleri
 * listeler — ayarlar ekranındaki "Modelleri getir" (T-24 madde 3).
 *
 * `scripts/yz-model-listesi.mjs` ile aynı süzgeç (aynı sürüm, aynı yöntem
 * filtresi, `models/` önekinin atılması) böylece ikisi **aynı** listeyi verir
 * — talimatın "Tanı" doğrulaması bunu karşılaştırıyor. Betikle paylaşılan bir
 * modül yok çünkü betik Node CLI'dır, bu dosya tarayıcı paketine girer.
 */
export async function modelleriGetir(): Promise<string[]> {
  const anahtar = anahtarOku();
  if (!anahtar) throw new YzHatasi(YZ_MESAJ.anahtar);
  if (!basliktaTasinabilir(anahtar)) throw new YzHatasi(YZ_MESAJ.anahtar);

  const ctrl = new AbortController();
  const zamanlayici = setTimeout(() => ctrl.abort(), ZAMAN_ASIMI_MS);

  let res: Response;
  try {
    res = await fetch(MODEL_LISTESI_UCU, {
      headers: { "x-goog-api-key": anahtar },
      signal: ctrl.signal,
    });
  } catch {
    throw new YzHatasi(YZ_MESAJ.ag);
  } finally {
    clearTimeout(zamanlayici);
  }

  if (!res.ok) throw new YzHatasi(yzDurumMesaji(res.status));

  const ham = (await res.json()) as {
    models?: { name?: string; supportedGenerationMethods?: string[] }[];
  };
  return (ham.models ?? [])
    .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m) => (m.name ?? "").replace(/^models\//, ""))
    .filter(Boolean)
    .sort();
}

export const gemini: YzSaglayici = { ad: "Gemini", sor };
