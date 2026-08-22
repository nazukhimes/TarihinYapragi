import { MONTHS_TR } from "../components/leaf";
import { daysInMonth } from "./date";

/** "Ağustos" → "agustos" (URL güvenli) */
const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
};

function asciify(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const MONTH_SLUGS = MONTHS_TR.map(asciify);

/** (8, 21) → "21-agustos" */
export function toDaySlug(month: number, day: number): string {
  return `${day}-${MONTH_SLUGS[month - 1]}`;
}

/** "21-agustos" | "08-21" → { month, day } | null */
export function parseDaySlug(slug: string): { month: number; day: number } | null {
  const s = slug.trim().toLocaleLowerCase("tr-TR");

  // sayısal biçim: 08-21
  const num = /^(\d{1,2})-(\d{1,2})$/.exec(s);
  if (num) {
    const m = Number(num[1]);
    const d = Number(num[2]);
    return isValidDay(m, d) ? { month: m, day: d } : null;
  }

  // ad biçimi: 21-agustos
  const named = /^(\d{1,2})-([a-z]+)$/.exec(s);
  if (named) {
    const d = Number(named[1]);
    const m = MONTH_SLUGS.indexOf(named[2]) + 1;
    return m > 0 && isValidDay(m, d) ? { month: m, day: d } : null;
  }

  return null;
}

function isValidDay(month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false;
  // 29 Şubat geçerlidir (arşiv modu) — daysInMonth(month) yıl vermeden çağrılır
  return day <= daysInMonth(month);
}
