import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

/**
 * `localStorage` yaması.
 *
 * Bu kurulumdaki jsdom `window.localStorage`'ı **tanımsız** bırakıyor
 * (Node'un kendi deneysel `localStorage` global'i `--localstorage-file`
 * verilmediği için devre dışı ve jsdom'unkini gölgeliyor). Uygulama kodu
 * buna karşı zaten korumalı — `wiki.ts`'in çevrimdışı yedeği de,
 * `lib/yapayzeka/anahtar.ts` de her erişimi try/catch'e alıyor — ama
 * korumanın **sessizce** devreye girmesi, depoya yazan davranışın hiç test
 * edilememesi demek: T-20'nin anahtar yönetimi tam olarak bu.
 *
 * Bellek içi, gerçeğine denk bir uygulama koyuluyor ve her testten önce
 * sıfırlanıyor ki testler birbirine anahtar sızdırmasın.
 */
class BellekDeposu implements Storage {
  #kayit = new Map<string, string>();

  get length(): number {
    return this.#kayit.size;
  }
  key(i: number): string | null {
    return [...this.#kayit.keys()][i] ?? null;
  }
  getItem(k: string): string | null {
    return this.#kayit.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.#kayit.set(k, String(v));
  }
  removeItem(k: string): void {
    this.#kayit.delete(k);
  }
  clear(): void {
    this.#kayit.clear();
  }
}

const depo = new BellekDeposu();
Object.defineProperty(globalThis, "localStorage", { value: depo, configurable: true });
Object.defineProperty(window, "localStorage", { value: depo, configurable: true });

beforeEach(() => depo.clear());
