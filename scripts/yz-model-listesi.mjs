/**
 * ANAHTARIN GÖRDÜĞÜ MODELLERİ LİSTELER — tanı betiği.
 *
 * Neden var: `gemini.ts`'teki `GEMINI_MODEL` sabit bir tahmindir. Google bir
 * modeli emekliye ayırdığında ya da ücretsiz katmandan çıkardığında uygulama
 * `404` alır ve "Model bulunamadı" der — ama **hangi modele geçileceğini**
 * söyleyemez, çünkü bu anahtardan anahtara değişir.
 *
 * Bu betik o boşluğu doldurur: anahtarın gerçekte erişebildiği, `generateContent`
 * destekleyen modelleri listeler. Çıktısı doğrudan `GEMINI_MODEL`'e yazılacak
 * adaydır.
 *
 * ## Gizlilik
 *
 * Anahtar **yalnızca ortam değişkeninden** okunur, hiçbir yere yazılmaz ve
 * ekrana basılmaz. Komut satırı argümanı olarak da alınmaz: argümanlar kabuk
 * geçmişine ve işlem listesine düşer.
 *
 * ## Kullanım
 *
 *   PowerShell:  $env:GEMINI_ANAHTARI="AIza..."; node scripts/yz-model-listesi.mjs
 *   bash:        GEMINI_ANAHTARI="AIza..." node scripts/yz-model-listesi.mjs
 */

const ANAHTAR = (process.env.GEMINI_ANAHTARI ?? "").replace(/[\s\p{Cf}]/gu, "");

if (!ANAHTAR) {
  console.error("HATA: GEMINI_ANAHTARI ortam değişkeni boş.\n");
  console.error('  PowerShell:  $env:GEMINI_ANAHTARI="AIza..."; node scripts/yz-model-listesi.mjs');
  console.error('  bash:        GEMINI_ANAHTARI="AIza..." node scripts/yz-model-listesi.mjs');
  process.exit(1);
}

// Başlığa konamayan anahtar `fetch`i istek çıkmadan düşürür — sebebi burada
// söylemek, ham `TypeError`ı okutmaktan iyidir (bkz. lib/yapayzeka/gemini.ts).
if (!/^[\x21-\x7E]+$/.test(ANAHTAR)) {
  console.error("HATA: Anahtarda ASCII dışı karakter var; kopyalama hatalı görünüyor.");
  process.exit(1);
}

/** Uygulamanın kullandığı sürüm önce; `v1` karşılaştırma için. */
const SURUMLER = ["v1beta", "v1"];

async function listele(surum) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/${surum}/models?pageSize=200`,
    {
      headers: { "x-goog-api-key": ANAHTAR },
    }
  );

  if (!res.ok) {
    const govde = await res.text();
    return { surum, hata: `HTTP ${res.status} — ${govde.slice(0, 200)}` };
  }

  const ham = await res.json();
  const modeller = (ham.models ?? [])
    .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""))
    .sort();

  return { surum, modeller };
}

const sonuclar = await Promise.all(
  SURUMLER.map((s) => listele(s).catch((e) => ({ surum: s, hata: String(e) })))
);

for (const s of sonuclar) {
  console.log(`\n=== ${s.surum} ===`);
  if (s.hata) {
    console.log(`  HATA: ${s.hata}`);
    continue;
  }
  if (!s.modeller.length) {
    console.log("  (generateContent destekleyen model yok)");
    continue;
  }
  for (const m of s.modeller) console.log(`  ${m}`);
}

// `GEMINI_MODEL`'e yazılacak adayı doğrudan söyle: ucuz/hızlı Flash ailesi,
// en yenisi başta. Sürüm numarasına göre azalan sıralama yeterli — adlar
// `gemini-<sürüm>-flash...` kalıbında.
const v1beta = sonuclar.find((s) => s.surum === "v1beta");
const flash = (v1beta?.modeller ?? [])
  .filter((m) => m.includes("flash") && !m.includes("preview") && !m.includes("exp"))
  .sort((a, b) => b.localeCompare(a, "en", { numeric: true }));

console.log("\n--- ÖNERİ ---");
if (flash.length) {
  console.log(`src/lib/yapayzeka/gemini.ts içindeki GEMINI_MODEL için aday:\n\n  ${flash[0]}\n`);
  if (flash.length > 1) console.log(`Yedekler: ${flash.slice(1, 4).join(", ")}`);
} else {
  console.log("v1beta üzerinde uygun bir Flash modeli bulunamadı; yukarıdaki listeye bakın.");
}
