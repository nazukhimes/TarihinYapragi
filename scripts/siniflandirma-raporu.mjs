/**
 * classifyItem/detectDarkItem doğruluğunu altın kümeye (src/lib/__fixtures__/
 * siniflandirma-ornekleri.ts) karşı ölçer. Elle çalıştırılır: npm run siniflandirma
 *
 * src/lib/classification.ts ve fixtures dosyası TypeScript oldukları için —
 * ve `tsx`/`ts-node` gibi bir çalışma zamanı bağımlılığı eklemeden, Vite'ın
 * kendisinin de kullandığı esbuild ile tam olarak PRODUCTION'daki aynı
 * sınıflandırıcıyı (kopyasını değil) çalışma zamanında TS'ten JS'e çevirip
 * geçici bir dosyaya yazar, sonra import eder — böylece bu rapor her zaman
 * gerçek kodu ölçer, kural değişince ayrı bir yerde güncellenmesi gereken
 * bir kopyayı değil.
 */
import esbuild from "esbuild";
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync, rmdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");

async function loadTs(relPath) {
  const abs = path.join(ROOT, relPath);
  const src = readFileSync(abs, "utf8");
  const { code } = esbuild.transformSync(src, { loader: "ts", format: "esm", target: "es2020" });
  const dir = mkdtempSync(path.join(os.tmpdir(), "ty-siniflandirma-"));
  const tmp = path.join(dir, path.basename(abs).replace(/\.ts$/, ".mjs"));
  writeFileSync(tmp, code);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    unlinkSync(tmp);
    rmdirSync(dir);
  }
}

const { classifyItem, detectDarkItem } = await loadTs("src/lib/classification.ts");
const { ORNEKLER } = await loadTs("src/lib/__fixtures__/siniflandirma-ornekleri.ts");

/* ---------------- kategori doğruluğu ---------------- */

const KATEGORILER = ["savas", "siyaset", "bilim", "kesif", "kultur", "spor", "felaket", "genel"];
const perCat = new Map(KATEGORILER.map((k) => [k, { dogru: 0, toplam: 0 }]));
const hatali = [];

for (const o of ORNEKLER) {
  const bulunan = classifyItem(o.text);
  const stat = perCat.get(o.beklenen);
  stat.toplam++;
  if (bulunan === o.beklenen) stat.dogru++;
  else hatali.push({ text: o.text, beklenen: o.beklenen, bulunan });
}

const toplamDogru = [...perCat.values()].reduce((s, v) => s + v.dogru, 0);
const toplamOrnek = ORNEKLER.length;

/* ---------------- karanlık tespiti ---------------- */

let dTP = 0,
  dFP = 0,
  dFN = 0;
const karanlikHatali = [];

for (const o of ORNEKLER) {
  const beklenenKaranlik = o.karanlik !== null;
  const bulunan = detectDarkItem(o.text);
  const bulunanKaranlik = bulunan !== null;

  if (beklenenKaranlik && bulunanKaranlik) dTP++;
  else if (!beklenenKaranlik && bulunanKaranlik) {
    dFP++;
    karanlikHatali.push({ text: o.text, tur: "YANLIŞ POZİTİF", beklenen: o.karanlik, bulunan });
  } else if (beklenenKaranlik && !bulunanKaranlik) {
    dFN++;
    karanlikHatali.push({ text: o.text, tur: "YANLIŞ NEGATİF", beklenen: o.karanlik, bulunan });
  }
}

const kesinlik = dTP + dFP > 0 ? dTP / (dTP + dFP) : 1;
const duyarlilik = dTP + dFN > 0 ? dTP / (dTP + dFN) : 1;

/* ---------------- performans ---------------- */

const perfMetni = ORNEKLER.map((o) => o.text);
const t0 = performance.now();
for (let i = 0; i < 100; i++) {
  const t = perfMetni[i % perfMetni.length];
  classifyItem(t);
  detectDarkItem(t);
}
const perfMs = performance.now() - t0;

/* ---------------- yazdırma ---------------- */

const yuzde = (a, b) => (b === 0 ? "—" : `${((100 * a) / b).toFixed(0)}%`);
const pad = (s, n) => String(s).padEnd(n);

console.log("KATEGORİ DOĞRULUĞU");
console.log("─".repeat(40));
for (const kat of KATEGORILER) {
  const { dogru, toplam } = perCat.get(kat);
  if (toplam === 0) continue;
  console.log(`${pad(kat, 10)}  ${pad(`${dogru}/${toplam}`, 8)} ${yuzde(dogru, toplam)}`);
}
console.log("─".repeat(40));
console.log(
  `${pad("TOPLAM", 10)}  ${pad(`${toplamDogru}/${toplamOrnek}`, 8)} ${yuzde(toplamDogru, toplamOrnek)}`
);

console.log("\nKARANLIK TESPİT");
console.log("─".repeat(40));
console.log(`Doğru pozitif   ${dTP}`);
console.log(`Yanlış pozitif  ${dFP}   ← hedef: 0`);
console.log(`Yanlış negatif  ${dFN}`);
console.log(`Kesinlik        ${(100 * kesinlik).toFixed(0)}%   ← hedef: ≥90%`);
console.log(`Duyarlılık      ${(100 * duyarlilik).toFixed(0)}%`);

if (hatali.length > 0) {
  console.log("\nHATALI ÖRNEKLER (kategori)");
  console.log("─".repeat(40));
  for (const h of hatali) {
    console.log(`✗ "${h.text.slice(0, 70)}${h.text.length > 70 ? "…" : ""}"`);
    console.log(`    beklenen: ${h.beklenen}   bulunan: ${h.bulunan}`);
  }
}

if (karanlikHatali.length > 0) {
  console.log("\nHATALI ÖRNEKLER (karanlık)");
  console.log("─".repeat(40));
  for (const h of karanlikHatali) {
    console.log(`✗ [${h.tur}] "${h.text.slice(0, 70)}${h.text.length > 70 ? "…" : ""}"`);
    console.log(`    beklenen: ${h.beklenen ?? "null"}   bulunan: ${h.bulunan ?? "null"}`);
  }
}

console.log(
  `\nPERFORMANS: 100 öğe sınıflandırma+karanlık taraması ${perfMs.toFixed(2)} ms sürdü (hedef: <5 ms)`
);

const kategoriGecti = toplamDogru / toplamOrnek >= 0.85;
const karanlikGecti = dFP === 0 && kesinlik >= 0.9;
console.log(
  `\n${kategoriGecti && karanlikGecti ? "✅ HEDEFLER TUTUYOR" : "✗ HEDEFLER TUTMUYOR"} ` +
    `(kategori ≥85%: ${kategoriGecti ? "✓" : "✗"} · karanlık YP=0 & kesinlik ≥90%: ${karanlikGecti ? "✓" : "✗"})`
);

if (!kategoriGecti || !karanlikGecti) process.exitCode = 1;
