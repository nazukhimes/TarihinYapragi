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
  location: string;
  status: "ÇÖZÜLDÜ" | "FAİLİ MEÇHUL" | "SÜRÜYOR" | "KAPANDI";
  summary: string;
  detail: string;
  tags: string[];
}

export interface ScienceMilestone {
  id: string;
  year: number;
  field: string;
  title: string;
  summary: string;
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

export function curatedKey(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
