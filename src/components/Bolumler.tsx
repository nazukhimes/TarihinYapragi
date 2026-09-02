import { REKORLAR, type TalkCard } from "../data";
import type { DayData } from "../lib/wiki";
import type { OlayMakalesi } from "../lib/olayMakalesi";
import type { WikidataRekor } from "../lib/wikidata";
import type { AramaSonuclari, GunVerisi } from "../hooks/useGunVerisi";
import { ErrorBoundary } from "./ErrorBoundary";
import { RekorlarSection } from "./rekorlar";
import { CasesSection, PeopleRow, ScienceSection, SectionShell, TimelineSection } from "./sections";
import { TalkSection } from "./talk";
import { IconAtom, Reveal, SectionHead } from "./ui";
import { SkeletonCards, SkeletonLines } from "./Iskeletler";

/** Altı içerik bölümü (Zaman Tüneli … Sohbet Kartları) + "Bugünün anlamı" şeridi +
 * arama sonuçsuz kaldığında gösterilen boş durum. */
export function Bolumler({
  noSearchResults,
  query,
  setQuery,
  bugüneDön,
  data,
  loading,
  veri,
  arama,
  dayLabel,
  onBroadcast,
  wikidata,
  wikidataLoading,
  olayMakaleleri,
}: {
  noSearchResults: boolean;
  query: string;
  setQuery: (q: string) => void;
  bugüneDön: () => void;
  data: DayData | null;
  loading: boolean;
  veri: GunVerisi;
  arama: AramaSonuclari;
  dayLabel: string;
  onBroadcast: () => void;
  /** Seçili günde kırılmış, Wikidata'dan canlı gelen rekorlar (bkz. Rekorlar Kasası). */
  wikidata: WikidataRekor[];
  wikidataLoading: boolean;
  /** Olay kimliği → EN beslemesinden çözülmüş TR olay makalesi (bkz. lib/olayMakalesi.ts). */
  olayMakaleleri: Record<string, OlayMakalesi>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      {noSearchResults ? (
        <div className="py-24 text-center">
          <p className="font-display italic text-2xl text-ink">
            &quot;{query}&quot; için bu günde sonuç yok.
          </p>
          <p className="mt-3 text-ink-dim max-w-md mx-auto text-[15px] leading-relaxed">
            Başka bir gün deneyin ya da aramayı temizleyin.
          </p>
          <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setQuery("")}
              className="px-5 py-3 rounded-sm bg-gold text-night font-mono text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-paper transition-colors cursor-pointer"
            >
              Aramayı temizle
            </button>
            <button
              onClick={bugüneDön}
              className="px-5 py-3 rounded-sm border border-line text-ink-dim hover:text-gold hover:border-gold/60 font-mono text-[12px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              Bugüne dön
            </button>
          </div>
        </div>
      ) : (
        <>
          {data && data.holidays.length > 0 && (
            <Reveal className="mt-8">
              <div className="rounded-sm border border-gold/40 bg-gold/[0.06] px-5 py-4">
                <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-gold mb-2">
                  Bugünün anlamı
                </p>
                <ul className="space-y-1.5">
                  {data.holidays.map((h) => (
                    <li
                      key={h.id}
                      className="text-[14.5px] text-ink-dim leading-relaxed flex gap-2.5"
                    >
                      <span className="text-gold shrink-0">◆</span>
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* ======== 01 ZAMAN TÜNELİ ======== */}
          <SectionShell id="tunel" labelledBy="baslik-01">
            <div className="pt-16">
              <SectionHead
                index="01"
                kicker="Kronoloji"
                title="Zaman Tüneli"
                desc={`${dayLabel} gününe düşen tüm tarihî kayıtlar — en eskiden en yeniye. Noktalara dokun, yüzyıllar arasında gezin.`}
                accent="#e8b04b"
              />
              {loading ? (
                <SkeletonLines />
              ) : (
                <ErrorBoundary variant="section">
                  <TimelineSection
                    events={veri.mergedEvents}
                    matched={arama.olay}
                    olayMakaleleri={olayMakaleleri}
                    dayLabel={dayLabel}
                  />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>

          {/* ======== 02 DOĞANLAR ======== */}
          <SectionShell id="doganlar" labelledBy="baslik-02">
            <div className="pt-20">
              <SectionHead
                index="02"
                kicker="Portreler"
                title="Bugün Doğanlar"
                desc="Siyasetçiler, sanatçılar, bilim insanları, sporcular… Bu tarihte dünyaya gelenler. Karta dokun, portreyi aç."
                accent="#8fbf6a"
              />
              {loading ? (
                <SkeletonCards />
              ) : (
                <ErrorBoundary variant="section">
                  <PeopleRow
                    people={veri.births}
                    matched={arama.dogum}
                    accentLabel="Doğum"
                    accentColor="#8fbf6a"
                    emptyText="Bu tarih için arşivde doğum kaydı bulunamadı — başka bir güne bak."
                    dayLabel={dayLabel}
                  />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>

          {/* ======== 03 KAYBETTİKLERİMİZ ======== */}
          <SectionShell id="kaybettiklerimiz" labelledBy="baslik-03">
            <div className="pt-20">
              <SectionHead
                index="03"
                kicker="Vedalar"
                title="Kaybettiklerimiz"
                desc="Bu tarihte aramızdan ayrılanlar. Arşiv, her vedanın ardındaki hikâyeyi kartlara işler."
                accent="#6f9fd8"
              />
              {loading ? (
                <SkeletonCards />
              ) : (
                <ErrorBoundary variant="section">
                  <PeopleRow
                    people={veri.deaths}
                    matched={arama.vefat}
                    accentLabel="Vefat"
                    accentColor="#6f9fd8"
                    emptyText="Bu tarih için arşivde vefat kaydı bulunamadı."
                    dayLabel={dayLabel}
                  />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>

          {/* ======== 04 KARANLIK DOSYALAR ======== */}
          <SectionShell id="karanlik" labelledBy="baslik-04">
            <div className="pt-20">
              <SectionHead
                index="04"
                kicker="Adli arşiv"
                title="Karanlık Dosyalar"
                desc="Suikastlar, katliamlar, kayıplar ve felaketler. Editör dosyaları elle derlenir; arşiv taraması, günün kayıtlarını otomatik tarar."
                accent="#e05b4b"
              />
              {loading ? (
                <SkeletonCards />
              ) : (
                <ErrorBoundary variant="section">
                  <CasesSection cases={veri.allCases} matched={arama.dosya} dayLabel={dayLabel} />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>

          {/* ======== 05 BİLİM & KEŞİF ======== */}
          <SectionShell id="bilim" labelledBy="baslik-05">
            <div className="pt-20">
              <SectionHead
                index="05"
                kicker="Dönüm noktaları"
                title="Bilim & Keşif"
                desc="DNA'dan Mars'a, ilk bilgisayarlardan ilk pilotlara… Bu güne denk gelen büyük sıçramalar."
                accent="#43a08f"
              />
              {loading ? (
                <SkeletonCards />
              ) : (
                <ErrorBoundary variant="section">
                  <ScienceSection items={veri.allScience} matched={arama.bilim} />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>

          {/* ======== 06 REKORLAR KASASI ======== */}
          <SectionShell id="rekorlar" labelledBy="baslik-06">
            <div className="pt-20">
              <SectionHead
                index="06"
                kicker="Sınırlar"
                title="Rekorlar Kasası"
                desc="Dünyanın 'en'leri — editör kasasından günlük seçki. Rekoru aç: hikâyesi, kıyası ve yayında okunacak açılış cümlesi içinde."
                accent="#dd8552"
                right={
                  veri.rekorlar.length > 0 && (
                    <span className="font-mono text-[12px] text-ink-faint">
                      {REKORLAR.length} kayıtlık kasadan {veri.rekorlar.length}&apos;ü
                    </span>
                  )
                }
              />
              <ErrorBoundary variant="section">
                <RekorlarSection
                  records={veri.rekorlar}
                  matched={arama.rekor}
                  wikidata={wikidata}
                  wikidataLoading={wikidataLoading}
                />
              </ErrorBoundary>
            </div>
          </SectionShell>

          {/* ======== 07 SOHBET KARTLARI ======== */}
          <SectionShell id="sohbet" labelledBy="baslik-07">
            <div className="pt-20 pb-24">
              <SectionHead
                index="07"
                kicker="Yayıncılar için"
                title="Sohbet Kartları"
                desc="Canlı yayında okunmaya hazır, kanca cümleli bilgi kartları. Kopyala ve paylaş ya da Yayın Modu ile teleprompter gibi kullan."
                accent="#d23b2e"
                right={
                  veri.talkCards.length > 0 && (
                    <span className="flex items-center gap-2 font-mono text-[12px] text-ink-faint">
                      <IconAtom className="w-4 h-4 text-teal" />
                      {sumMinutes(veri.talkCards)} dk malzeme
                    </span>
                  )
                }
              />
              {loading ? (
                <SkeletonCards />
              ) : (
                <ErrorBoundary variant="section">
                  <TalkSection
                    cards={veri.talkCards}
                    dayLabel={dayLabel}
                    onBroadcast={onBroadcast}
                  />
                </ErrorBoundary>
              )}
            </div>
          </SectionShell>
        </>
      )}
    </div>
  );
}

function sumMinutes(cards: TalkCard[]): number {
  return cards.reduce((a, c) => a + c.minutes, 0);
}
