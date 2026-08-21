import { writeFileSync } from "node:fs";

// AY_SLUG, src/lib/slug.ts içindeki MONTH_SLUGS (asciify(MONTHS_TR)) ile birebir
// elle senkron tutulmalı — T-12'de bunu doğrulayan bir test eklenecek.
const AY_SLUG = ["ocak","subat","mart","nisan","mayis","haziran",
                 "temmuz","agustos","eylul","ekim","kasim","aralik"];
const GUN = [31,29,31,30,31,30,31,31,30,31,30,31];   // 29 Şubat dahil (arşiv modu)
const TABAN = process.env.SITE_URL || "https://tarihyapragi.example";

const url = [];
for (let m = 0; m < 12; m++)
  for (let d = 1; d <= GUN[m]; d++)
    url.push(`  <url><loc>${TABAN}/${d}-${AY_SLUG[m]}</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>`);

writeFileSync("public/sitemap.xml",
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url.join("\n")}
</urlset>
`);
console.log(`sitemap.xml yazıldı — ${url.length} adres`);
