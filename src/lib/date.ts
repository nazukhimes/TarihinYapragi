/** Verilen yıl artık yıl mı? (Gregoryen kural) */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const DAYS_NORMAL = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Aydaki gün sayısı. year verilmezse Şubat 29 kabul edilir (arşiv modu). */
export function daysInMonth(month: number, year?: number): number {
  if (month === 2) {
    return year === undefined ? 29 : isLeapYear(year) ? 29 : 28;
  }
  return DAYS_NORMAL[month - 1];
}

/** Yılın kaçıncı günü. year verilmezse içinde bulunulan yıl kullanılır. */
export function dayOfYear(month: number, day: number, year = new Date().getFullYear()): number {
  let total = day;
  for (let m = 1; m < month; m++) total += daysInMonth(m, year);
  return total;
}

/**
 * Haftanın günü indeksi (0 = Pazar).
 * 29 Şubat, verilen yıl artık yıl değilse gerçekte var olmadığı için `null` döner.
 */
export function weekdayIndex(
  month: number,
  day: number,
  year = new Date().getFullYear()
): number | null {
  if (month === 2 && day === 29 && !isLeapYear(year)) return null;
  return new Date(year, month - 1, day).getDay();
}
