/**
 * Marka görsellerini üretir: favicon, PWA simgeleri, og-image.
 * Kaynak biçim: src/components/ui.tsx içindeki IconLeafMark yol verisi.
 * Elle çalıştırılır (build'e bağlı değil): npm run icons
 * Google Fonts dosyalarını geçici bir klasöre indirir, public/ altına yalnızca
 * üretilen PNG/ICO/SVG çıktıları yazar — yazı tipi dosyaları depoya girmez.
 */
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const FONT_CACHE = path.join(tmpdir(), "tarih-yapragi-og-fonts");

const BRAND = "#d23b2e";
const NIGHT = "#0f131a";
const PAPER = "#f2ead9";
const GOLD = "#e8b04b";
const TEAL = "#43a08f";

mkdirSync(PUBLIC, { recursive: true });
mkdirSync(FONT_CACHE, { recursive: true });

/* ---------- IconLeafMark yol verisi (src/components/ui.tsx ile birebir) ---------- */
function leafGlyph({ solid = BRAND, faintOpacity = 0.16, dot = PAPER, strokeWidth = 1.6 } = {}) {
  return `
    <path d="M4 4h16v12H4z" fill="${solid}" opacity="${faintOpacity}"/>
    <path d="M4 4h16v5H4z" fill="${solid}"/>
    <path d="M4 9v11l2-1.4 2 1.4 2-1.4 2 1.4 2-1.4 2 1.4 2-1.4 2 1.4V9" fill="none" stroke="${solid}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
    <path d="M8 6.5h.01M12 6.5h.01" stroke="${dot}" stroke-width="2" stroke-linecap="round"/>
  `;
}

/* ---------- 1) favicon.svg — vektör, saydam zemin ---------- */
const faviconSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tarih Yaprağı">
  ${leafGlyph()}
</svg>
`;
writeFileSync(path.join(PUBLIC, "favicon.svg"), faviconSvg);
console.log("✓ favicon.svg");

/* ---------- 2) kare uygulama simgesi tabanı (24×24 viewBox + gece zemini) ---------- */
function squareIconSvg() {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" fill="${NIGHT}"/>
  ${leafGlyph()}
</svg>`;
}

/* ---------- 3) maskable simge — güvenli alan: iç %80 daire ---------- */
function maskableIconSvg() {
  // orijinal glif 24×24 içinde (4,4)-(20,20) kutusunda; 36×36 tuvale (6,6) ötelenir
  // → köşe köşegeni merkeze uzaklığı 11.31, güvenli yarıçap 0.4×36=14.4 (%78 doluluk, güvenli pay var)
  return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="36" fill="${NIGHT}"/>
  <g transform="translate(6,6)">
    ${leafGlyph()}
  </g>
</svg>`;
}

async function rasterize(svgString, baseViewBox, size, outPath) {
  const density = 72 * (size / baseViewBox);
  await sharp(Buffer.from(svgString), { density }).resize(size, size).png().toFile(outPath);
}

await rasterize(squareIconSvg(), 24, 180, path.join(PUBLIC, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png (180×180)");

await rasterize(squareIconSvg(), 24, 192, path.join(PUBLIC, "icon-192.png"));
console.log("✓ icon-192.png");

await rasterize(squareIconSvg(), 24, 512, path.join(PUBLIC, "icon-512.png"));
console.log("✓ icon-512.png");

await rasterize(maskableIconSvg(), 36, 512, path.join(PUBLIC, "icon-maskable-512.png"));
console.log("✓ icon-maskable-512.png (maskable, güvenli alan payı bırakılmış)");

/* ---------- 4) favicon.ico — 16/32/48 birleşik ---------- */
const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((size) => {
    const density = 72 * (size / 24);
    return sharp(Buffer.from(squareIconSvg()), { density }).resize(size, size).png().toBuffer();
  })
);
const icoBuffer = await pngToIco(icoBuffers);
writeFileSync(path.join(PUBLIC, "favicon.ico"), icoBuffer);
console.log("✓ favicon.ico (16/32/48 birleşik)");

/* ---------- 5) og-image.png — 1200×630 sosyal önizleme kartı ---------- */
async function fetchFont(url, filename) {
  const dest = path.join(FONT_CACHE, filename);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yazı tipi indirilemedi: ${url} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return dest;
}

console.log("… og-image için yazı tipleri indiriliyor (Fraunces, IBM Plex Mono)");

// Fraunces ve IBM Plex Mono, google/fonts deposundaki tam (alt kümesiz) statik dosyalar —
// Türkçe karakterler (İ, Ğ, Ş, Ö, Ü, Ç, ı) Google Fonts CSS2'nin "latin"/"latin-ext" alt küme
// ayrımına takılmasın diye tek parça, tüm karakter setini içeren dosyalar tercih edildi.
const FRAUNCES_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf";
const PLEXMONO_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-SemiBold.ttf";

const frauncesPath = await fetchFont(FRAUNCES_URL, "Fraunces-Variable.ttf");
const plexMonoPath = await fetchFont(PLEXMONO_URL, "IBMPlexMono-SemiBold.ttf");

const frauncesB64 = readFileSync(frauncesPath).toString("base64");
const plexMonoB64 = readFileSync(plexMonoPath).toString("base64");

function tornEdgePath(width, y, teeth = 34) {
  const step = width / teeth;
  let d = `M0 ${y}`;
  for (let i = 0; i < teeth; i++) {
    const x1 = (i + 0.5) * step;
    const x2 = (i + 1) * step;
    const dip = i % 2 === 0 ? 6 : 3;
    d += ` L${x1.toFixed(1)} ${y + dip} L${x2.toFixed(1)} ${y}`;
  }
  d += ` L${width} ${y + 40} L0 ${y + 40} Z`;
  return d;
}

const OG_W = 1200;
const OG_H = 630;

const ogSvg = `<svg width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <style>
    @font-face {
      font-family: 'Fraunces OG';
      src: url(data:font/ttf;base64,${frauncesB64}) format('truetype');
    }
    @font-face {
      font-family: 'Plex Mono OG';
      src: url(data:font/ttf;base64,${plexMonoB64}) format('truetype');
    }
    .title { font-family: 'Fraunces OG', 'Fraunces', Georgia, serif; font-variation-settings: 'wght' 900, 'opsz' 144, 'SOFT' 0, 'WONK' 0; }
    .mono { font-family: 'Plex Mono OG', 'IBM Plex Mono', Consolas, monospace; font-weight: 600; }
  </style>

  <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#10151e"/>
    <stop offset="40%" stop-color="${NIGHT}"/>
    <stop offset="100%" stop-color="#0d1117"/>
  </linearGradient>

  <radialGradient id="glowRed" cx="86%" cy="-8%" r="65%">
    <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowTeal" cx="-6%" cy="34%" r="55%">
    <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="glowGold" cx="58%" cy="118%" r="55%">
    <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.13"/>
    <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
  </radialGradient>

  <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
    <path d="M44 0H0V44" fill="none" stroke="rgba(142,153,171,0.07)" stroke-width="1"/>
  </pattern>
  <radialGradient id="gridFade" cx="50%" cy="30%" r="75%">
    <stop offset="0%" stop-color="white" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </radialGradient>
  <mask id="gridMask">
    <rect width="${OG_W}" height="${OG_H}" fill="url(#gridFade)"/>
  </mask>

  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"/>
  </filter>
</defs>

<rect width="${OG_W}" height="${OG_H}" fill="url(#base)"/>
<rect width="${OG_W}" height="${OG_H}" fill="url(#glowRed)"/>
<rect width="${OG_W}" height="${OG_H}" fill="url(#glowTeal)"/>
<rect width="${OG_W}" height="${OG_H}" fill="url(#glowGold)"/>
<rect width="${OG_W}" height="${OG_H}" fill="url(#grid)" mask="url(#gridMask)"/>
<rect width="${OG_W}" height="${OG_H}" filter="url(#grain)"/>

<!-- yaprak simgesi -->
<g transform="translate(96,185) scale(11)">
  ${leafGlyph()}
</g>

<!-- metin bloğu -->
<text x="430" y="248" class="mono" font-size="22" letter-spacing="6" fill="${GOLD}">HER GÜNE BİR ARŞİV</text>
<text x="428" y="336" class="title" font-size="72" fill="${PAPER}">TARİH YAPRAĞI</text>
<text x="430" y="392" class="mono" font-size="29" letter-spacing="1.5" fill="${GOLD}">Bugün tarihte ne oldu?</text>

<!-- yırtık kâğıt kenarı -->
<g transform="translate(0, 596)">
  <path d="${tornEdgePath(OG_W, 0)}" fill="${PAPER}" opacity="0.12"/>
</g>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(path.join(PUBLIC, "og-image.png"));
console.log("✓ og-image.png (1200×630)");

rmSync(FONT_CACHE, { recursive: true, force: true });
console.log("\nTüm marka görselleri public/ altında üretildi.");
