/**
 * GEMINI SAĞLAYICISI (T-20 madde 1)
 *
 * `YzSaglayici` arayüzünün tek uygulaması. Sağlayıcıya özgü **her şey** —
 * uç nokta, gövde biçimi, yanıt ayrıştırma — bu dosyada kalır; panel ve
 * `istem.ts` Gemini'yi tanımaz.
 *
 * Gemini, ücretsiz katmanı olduğu için seçildi (kullanıcı kararı, 2026-08-24
 * oturumu). Ücretsiz katmanda **web araması yoktur**; halüsinasyon azaltması
 * bu yüzden bağlam gömmeye dayanır, bkz. `istem.ts`.
 */

import { anahtarOku } from "./anahtar";
import { istemBirlestir } from "./istem";
import { YZ_MESAJ, YzHatasi, yzDurumMesaji, type YzSaglayici } from "./tipler";

/**
 * KULLANILAN MODEL — değiştirilecek **tek yer** burasıdır.
 *
 * Google'ın ücretsiz katmanındaki güncel Flash ailesi seçildi. Kota dolarsa ya
 * da model emekliye ayrılırsa `gemini-2.5-flash-lite` (daha ucuz, daha yüksek
 * ücretsiz kota) bir alt basamaktır; başka hiçbir yer değişmez.
 */
export const GEMINI_MODEL = "gemini-2.5-flash";

const UC_NOKTA = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const ZAMAN_ASIMI_MS = 30_000;

/** Yanıt gövdesinin okuduğumuz kadarı — Google'ın şemasının tamamı değil. */
interface GeminiYanit {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

/** `candidates[0].content.parts[*].text` → tek düz metin. */
export function yanitiCoz(ham: GeminiYanit): string {
  const parcalar = ham.candidates?.[0]?.content?.parts ?? [];
  return parcalar
    .map((p) => p.text ?? "")
    .join("")
    .trim();
}

async function sor(istem: string, baglam: string, signal?: AbortSignal): Promise<string> {
  const anahtar = anahtarOku();
  if (!anahtar) throw new YzHatasi(YZ_MESAJ.anahtar);

  // Kendi süremizi koyuyoruz; dışarıdan gelen iptal de bu denetleyiciye bağlanır
  // (sayfaOzeti.ts'teki zamanlayıcı deseninin aynısı).
  const ctrl = new AbortController();
  let zamanAsti = false;
  const zamanlayici = setTimeout(() => {
    zamanAsti = true;
    ctrl.abort();
  }, ZAMAN_ASIMI_MS);
  const disaridanIptal = () => ctrl.abort();
  signal?.addEventListener("abort", disaridanIptal);

  try {
    const res = await fetch(UC_NOKTA, {
      method: "POST",
      // Anahtar **başlıkta** gider, sorgu dizesinde değil: URL'ler tarayıcı
      // geçmişine, sunucu günlüklerine ve Referer başlığına düşer.
      headers: { "Content-Type": "application/json", "x-goog-api-key": anahtar },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: istemBirlestir(istem, baglam) }] }],
        generationConfig: {
          // Görev "açıkla", "yarat" değil — düşük sıcaklık metne bağlı kalmayı artırır.
          temperature: 0.2,
          maxOutputTokens: 900,
        },
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) throw new YzHatasi(yzDurumMesaji(res.status));

    const ham = (await res.json()) as GeminiYanit;
    const metin = yanitiCoz(ham);
    // Güvenlik filtresi ya da boş aday: 200 döner ama içerik gelmez.
    if (!metin) throw new YzHatasi(YZ_MESAJ.bos);
    return metin;
  } catch (e) {
    if (signal?.aborted) throw e; // beklenen iptal — çağıran bilmeli
    if (zamanAsti) throw new YzHatasi(YZ_MESAJ.zamanAsimi);
    if (e instanceof YzHatasi) throw e;
    throw new YzHatasi(YZ_MESAJ.ag);
  } finally {
    clearTimeout(zamanlayici);
    signal?.removeEventListener("abort", disaridanIptal);
  }
}

export const gemini: YzSaglayici = { ad: "Gemini", sor };
