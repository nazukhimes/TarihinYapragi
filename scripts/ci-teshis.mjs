// Gecici: CI'daki kararsiz (flaky) test hatasini teshis etmek icin.
// Bir log dosyasini okur, ANSI kodlarini temizler, son N satiri tek bir
// GitHub Actions ::error:: notasyonu olarak (cok satirli, %0A ile) yazdirir.
import { readFileSync } from "node:fs";

const [, , logPath, labelArg] = process.argv;
const label = labelArg ?? "deneme";
let s = readFileSync(logPath, "utf8");
// eslint-disable-next-line no-control-regex -- ANSI renk kodlarini temizlemek icin kasitli
s = s.replace(/\x1b\[[0-9;]*m/g, "");
const lines = s.split("\n").slice(-150).join("\n");
const esc = lines.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
console.log(`::error::${label} BASARISIZ - ${esc}`);
