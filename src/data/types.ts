export type CategoryId =
  "savas" | "siyaset" | "bilim" | "kesif" | "kultur" | "spor" | "felaket" | "genel";

export const CATEGORIES: Record<CategoryId, { label: string; color: string }> = {
  savas: { label: "Savaş & İşgal", color: "#e05b4b" },
  siyaset: { label: "Siyaset", color: "#6f9fd8" },
  bilim: { label: "Bilim", color: "#43a08f" },
  kesif: { label: "Keşif & Uzay", color: "#e8b04b" },
  kultur: { label: "Kültür & Sanat", color: "#c08bc9" },
  spor: { label: "Spor", color: "#8fbf6a" },
  felaket: { label: "Felaket", color: "#dd8552" },
  genel: { label: "Genel", color: "#8e99ab" },
};

export type CaseType = "suikast" | "cinayet" | "katliam" | "kayıp" | "felaket" | "idam" | "skandal";

export const CASE_LABELS: Record<CaseType, string> = {
  suikast: "SUİKAST",
  cinayet: "CİNAYET",
  katliam: "KATLİAM",
  kayıp: "KAYIP DOSYASI",
  felaket: "FELAKET",
  idam: "İNFAZ",
  skandal: "SKANDAL",
};

export interface CaseFile {
  id: string;
  year: number;
  type: CaseType;
  title: string;
  /** Gerçek yer adı. Bilinmiyorsa boş bırakılır — uydurma konum yazılmaz. */
  location: string;
  /**
   * Dosyanın akıbeti. İlk dördü editör hükmüdür; **"ARŞİV KAYDI" hüküm değildir**,
   * yalnızca kaydın Vikipedi taramasından geldiğini ve akıbetinin bilinmediğini
   * söyler (T-17 / O-15).
   */
  status: "ÇÖZÜLDÜ" | "FAİLİ MEÇHUL" | "SÜRÜYOR" | "KAPANDI" | "ARŞİV KAYDI";
  summary: string;
  detail: string;
  tags: string[];
  /** Kayıt elle mi yazıldı, Vikipedi taramasından mı geldi. */
  curated?: boolean;
  /** Detay panelindeki "Vikipedi'de ara" çıkışının hangi Vikipedi'ye gideceği.
   *  Editör dosyalarında yazılmaz — varsayılan "tr" (T-19). */
  lang?: "tr" | "en";
}

export interface ScienceMilestone {
  id: string;
  year: number;
  field: string;
  title: string;
  summary: string;
  /** Aynı olayın Vikipedi'den gelen otomatik kaydını elemek için aranan
   *  anahtarlar — `CuratedEvent.matchKeys` ile aynı iş, aynı kural (O-12).
   *  İsteğe bağlı: yazılmadığında eleme yapılmaz, kayıt bozulmaz. Yalnızca
   *  otomatik karşılığı GERÇEKTEN çıkan kayıtlara yazılır (bkz. T-21). */
  matchKeys?: string[];
}

export interface TalkCard {
  id: string;
  category: string;
  hook: string;
  body: string;
  minutes: 1 | 2 | 3;
}

export interface CuratedEvent {
  id: string;
  year: number;
  text: string;
  detail: string;
  category: CategoryId;
  matchKeys: string[];
}

export interface CuratedDay {
  events?: CuratedEvent[];
  cases: CaseFile[];
  science: ScienceMilestone[];
  talk: TalkCard[];
  spotlight?: { kicker: string; title: string; text: string };
}

/* ================= REKORLAR KASASI ================= */

export type RecordScope =
  "insan" | "doga" | "yapi" | "hiz" | "dayaniklilik" | "kultur" | "tuhaf" | "turkiye";

export const RECORD_SCOPES: Record<RecordScope, { label: string; color: string }> = {
  insan: { label: "İnsan Bedeni", color: "#dd8552" },
  doga: { label: "Doğa", color: "#8fbf6a" },
  yapi: { label: "Yapılar", color: "#8e99ab" },
  hiz: { label: "Hız", color: "#e8b04b" },
  dayaniklilik: { label: "Dayanıklılık", color: "#43a08f" },
  kultur: { label: "Kültür", color: "#c08bc9" },
  tuhaf: { label: "Tuhaf Kategoriler", color: "#6f9fd8" },
  turkiye: { label: "Türkiye", color: "#d23b2e" },
};

/** GÜNCEL: bugün hâlâ geçerli · KIRILDI: sonradan aşıldı ·
 * EMEKLİ: kategori artık kabul edilmiyor (genelde güvenlik gerekçesiyle). */
export type RecordStatus = "GÜNCEL" | "KIRILDI" | "EMEKLİ";

export const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  GÜNCEL: "HÂLÂ GEÇERLİ",
  KIRILDI: "SONRADAN KIRILDI",
  EMEKLİ: "KATEGORİ EMEKLİ",
};

export interface WorldRecord {
  id: string;
  /** Rekorun adı — tek satır, ekranda başlık olur. */
  title: string;
  /** Kişi, kurum, tür ya da yer. */
  holder: string;
  /** Rakam ve birimiyle: "8,8 cm", "192 saat 19 dakika", "9,58 saniye". */
  value: string;
  /** Rekorun kurulduğu/ölçüldüğü yıl. */
  year: number;
  /**
   * Rekorun kırıldığı gün, `MM-DD` biçiminde. **İsteğe bağlı.**
   * Verilirse rekor o güne sabitlenir ("Bugün kırılan rekor"); verilmezse
   * yıl boyunca dönen rotasyon havuzuna girer (bkz. `src/lib/rekor.ts`).
   */
  date?: string;
  place?: string;
  scope: RecordScope;
  status: RecordStatus;
  /** Kırıldıysa kim/ne tarafından — `status: "KIRILDI"` ile birlikte anlamlı. */
  brokenBy?: string;
  /** 1-2 cümle. Kartın üstünde görünen özet. */
  summary: string;
  /** 3-4 cümle. Rekorun değil, ardındaki hikâyenin anlatımı — yayında okunacak metin. */
  story: string;
  /** Rakamı hayal edilebilir kılan kıyas: "üst üste dizilmiş 14 otobüs kadar". */
  compare?: string;
  /** Yayında konuya girerken okunacak tek cümlelik açılış. Soru işareti yok. */
  opener?: string;
  /** İzleyiciye sorulabilecek tartışma sorusu. */
  question?: string;
  /**
   * Guinness World Records'ın resmen onayladığı bir unvan mı, yoksa
   * "en"i tartışmalı/başka kaynaklara dayanan bir kayıt mı.
   */
  official: boolean;
  /** Doğrulama bağlantısı — tercihen Vikipedi. Ekranda "Kaynağı aç" olur. */
  sourceUrl?: string;
  tags: string[];
}

export function curatedKey(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
