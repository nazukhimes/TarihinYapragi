/**
 * REKOR AVI — editör için aday üretici.
 *
 * Elle çalıştırılır:  npm run rekor-avi
 *                     npm run rekor-avi -- "Türkiye"
 *
 * Ne yapar: Türkçe Vikipedi'yi `insource:` tam metin aramasıyla tarar, "Guinness
 * Rekorlar Kitabı" / "Guinness Dünya Rekorları" geçen maddeleri bulur, eşleşen
 * cümleyi wikitext artıklarından temizler ve editörün önüne **aday** olarak koyar.
 *
 * Ne YAPMAZ: `src/data/rekorlar.ts` dosyasına yazmaz. Bu bilinçli bir sınırdır —
 * `Dokumanlar/ICERIK-SABLONU.md` §0 toplu otomatik içerik üretimini yasaklar.
 * Script aday bulur; kaydı editör okur, doğrular ve elle yazar.
 *
 * Neden doğrudan yazmıyor: arama snippet'leri ham wikitext taşır (ref etiketleri,
 * şablon artıkları, HTML varlıkları) ve kalitesi maddeden maddeye değişir. Bir
 * kısmı yayın kalitesinde ("Taipei 101 ... dünyanın en yüksek binası olarak
 * onaylanmıştır"), bir kısmı kaynak listesi kırıntısıdır. Ayıklama insan işidir.
 *
 * Çıktı: konsola özet + `Dokumanlar/rekor-adaylari.md` dosyasına tam liste.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CIKTI = path.join(ROOT, "Dokumanlar", "rekor-adaylari.md");

const UA = "TarihinYapragi-rekor-avi/1.0 (https://github.com/nazukhimes/TarihinYapragi)";
const API = "https://tr.wikipedia.org/w/api.php";
const SAYFA_BASI = 50;

/** Aranacak kalıplar. Vikipedi'de her iki ad da kullanılıyor. */
const KALIPLAR = ['insource:"Guinness Rekorlar Kitabı"', 'insource:"Guinness Dünya Rekorları"'];

/** Bunlar geçen snippet'ler atılır — kaynakça/şablon kırıntısı olma ihtimali yüksek. */
const COP_ISARETLERI = [
  "arşivtarihi",
  "erişimtarihi",
  "ölüurl",
  "Web kaynağı",
  "Kaynak belirt",
  "başlık=",
  "url=",
];

/* ---------------- havuzda zaten olanlar ---------------- */

/**
 * `rekorlar.ts` dosyasını ayrıştırmak için TS derleyicisi kurmak yerine
 * `sourceUrl` ve `holder` alanlarını düz metinden okur. Amaç yalnızca "bu madde
 * zaten kasada mı" sorusuna cevap vermek; tam bir ayrıştırma gerekmiyor.
 */
function mevcutKayitlar() {
  try {
    const src = readFileSync(path.join(ROOT, "src", "data", "rekorlar.ts"), "utf8");
    const baslik = new Set();
    for (const m of src.matchAll(/sourceUrl:\s*"([^"]+)"/g)) {
      const son = decodeURIComponent(m[1].split("/").pop() ?? "").replace(/_/g, " ");
      if (son) baslik.add(son.toLocaleLowerCase("tr-TR"));
    }
    for (const m of src.matchAll(/holder:\s*"([^"]+)"/g)) {
      baslik.add(m[1].toLocaleLowerCase("tr-TR"));
    }
    return baslik;
  } catch {
    return new Set();
  }
}

/* ---------------- snippet temizliği ---------------- */

const VARLIKLAR = {
  "&#039;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

/**
 * Arama snippet'ini okunabilir düz metne indirger.
 *
 * Sıra önemli: önce HTML vurgu etiketleri, sonra varlıklar (çünkü `&lt;ref&gt;`
 * çözülünce gerçek bir `<ref>` etiketine dönüşür), sonra wikitext yapıları.
 */
function temizle(snippet) {
  let s = snippet;

  s = s.replace(/<[^>]+>/g, ""); // <span class="searchmatch">
  for (const [k, v] of Object.entries(VARLIKLAR)) s = s.replaceAll(k, v);
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "").replace(/<ref[^>]*\/>/g, "");
  s = s.replace(/<[^>]+>/g, ""); // varlıklardan çözülen etiketler
  s = s.replace(/\{\{[^{}]*\}\}/g, ""); // {{şablon}}
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2"); // [[hedef|görünen]]
  s = s.replace(/\[\[([^\]]+)\]\]/g, "$1"); // [[sayfa]]
  s = s.replace(/'{2,}/g, ""); // ''italik'' / '''kalın'''
  s = s.replace(/\s+/g, " ").trim();

  return s;
}

function copMu(snippet) {
  return COP_ISARETLERI.some((i) => snippet.includes(i));
}

/* ---------------- arama ---------------- */

async function ara(sorgu, offset = 0) {
  const url =
    `${API}?action=query&list=search&format=json&origin=*` +
    `&srsearch=${encodeURIComponent(sorgu)}` +
    `&srlimit=${SAYFA_BASI}&sroffset=${offset}&srnamespace=0&srprop=snippet`;

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Vikipedi ${res.status}`);
  const json = await res.json();
  return {
    sonuclar: json.query?.search ?? [],
    toplam: json.query?.searchinfo?.totalhits ?? 0,
    devam: json.continue?.sroffset,
  };
}

/* ---------------- ana akış ---------------- */

const tema = process.argv[2]?.trim();
const mevcut = mevcutKayitlar();

console.log("REKOR AVI — Türkçe Vikipedi taraması");
if (tema) console.log(`Tema süzgeci: "${tema}"`);
console.log("");

const adaylar = new Map(); // başlık → { baslik, cumle, url }
let toplamHam = 0;

for (const kalip of KALIPLAR) {
  const sorgu = tema ? `${kalip} ${tema}` : kalip;
  let offset = 0;

  // İki sayfa (100 sonuç) yeterli: ötesi kuyruk gürültüsü oluyor ve Vikipedi'ye
  // gereksiz yük bindiriyor. Daha derin tarama gerekirse tema süzgeciyle daraltın.
  for (let sayfa = 0; sayfa < 2; sayfa++) {
    let sonuc;
    try {
      sonuc = await ara(sorgu, offset);
    } catch (e) {
      console.error(`  ! ${kalip} — ${e.message}`);
      break;
    }

    if (sayfa === 0) console.log(`  ${kalip} → ${sonuc.toplam} madde`);
    toplamHam += sonuc.sonuclar.length;

    for (const r of sonuc.sonuclar) {
      if (adaylar.has(r.title)) continue;
      if (mevcut.has(r.title.toLocaleLowerCase("tr-TR"))) continue; // kasada var
      if (copMu(r.snippet)) continue;

      const cumle = temizle(r.snippet);
      if (cumle.length < 40) continue; // anlamlı bir cümle çıkmadı

      adaylar.set(r.title, {
        baslik: r.title,
        cumle,
        url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, "_"))}`,
      });
    }

    if (!sonuc.devam) break;
    offset = sonuc.devam;
  }
}

const liste = [...adaylar.values()].sort((a, b) => a.baslik.localeCompare(b.baslik, "tr"));

console.log("");
console.log(
  `Ham sonuç: ${toplamHam} · Elenen: ${toplamHam - liste.length} · Aday: ${liste.length}`
);
console.log("");

for (const a of liste.slice(0, 15)) {
  console.log(`  • ${a.baslik}`);
  console.log(`    ${a.cumle.slice(0, 150)}${a.cumle.length > 150 ? "…" : ""}`);
}
if (liste.length > 15) console.log(`  … ve ${liste.length - 15} aday daha`);

/* ---------------- rapor dosyası ---------------- */

const satirlar = [
  "# Rekor Adayları",
  "",
  "> `npm run rekor-avi` çıktısı. **Bu dosya içerik değildir, aday listesidir.**",
  "> Her madde okunup doğrulanmadan `src/data/rekorlar.ts` dosyasına geçirilmez.",
  "> Snippet'ler Vikipedi arama sonucundan gelir ve cümlenin ortasından başlayabilir.",
  "",
  `**Tarama:** ${new Date().toISOString().slice(0, 10)}${tema ? ` · tema: "${tema}"` : ""}`,
  `**Aday sayısı:** ${liste.length}`,
  "",
  "## Editör kontrol listesi",
  "",
  "Bir adayı kasaya almadan önce:",
  "",
  "1. Maddeyi aç, rekorun **rakamını** ve **yılını** kaynakta doğrula.",
  "2. Rekor hâlâ geçerli mi? Sonradan kırılmış olabilir — `status` alanını buna göre yaz.",
  "3. Guinness'in resmen onayladığı bir unvan mı? Değilse `official: false`.",
  '4. Kırılma günü kesin biliniyorsa `date: "MM-DD"` ekle; **emin değilsen ekleme.**',
  "5. `value` alanına yalnızca kaynakta açıkça geçen rakamı yaz.",
  "",
  "---",
  "",
];

for (const a of liste) {
  satirlar.push(`### ${a.baslik}`);
  satirlar.push("");
  satirlar.push(a.cumle);
  satirlar.push("");
  satirlar.push(`[Maddeyi aç](${a.url})`);
  satirlar.push("");
}

writeFileSync(CIKTI, satirlar.join("\n"), "utf8");
console.log("");
console.log(`Tam liste yazıldı: ${path.relative(ROOT, CIKTI)}`);
