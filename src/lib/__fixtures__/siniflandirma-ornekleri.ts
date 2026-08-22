import type { CategoryId } from "../../data/types";

export interface Ornek {
  text: string;
  beklenen: CategoryId;
  karanlik: string | null;
  not?: string; // neden bu kategori/karanlık değeri — tartışmalı örnekler için
}

/**
 * Altın küme — gerçek Vikipedi "bugün tarihte" verisinden (TR, çok sayıda
 * gün taranarak) ve talimatın kendi verdiği örneklerden derlendi. Hedefe
 * göre ayarlanmadı: `npm run siniflandirma` hedefi tutturamıyorsa kuralları
 * (`src/lib/classification.ts`) düzelt, bu listeyi değiştirme (bkz. T-11
 * Adım 6).
 */
export const ORNEKLER: Ornek[] = [
  // ==================== felaket ====================
  {
    text: "İstanbul Kuledibi'ndeki Eskiciler Çarşısı yandı; 167 dükkân kül oldu.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  {
    text: "Guatemala ve Honduras'taki 7,5 şiddetindeki depremde 22.778 kişi öldü.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  {
    text: "Nepal'de 7,8 veya 8,1 şiddetinde deprem meydana geldi, 8.000'den fazla kişi öldü.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  {
    text:
      "Hint Okyanusu tabanında meydana gelen 9,1 büyüklüğündeki depremin yarattığı tsunami, " +
      "Güneydoğu Asya'da 13 ülkede 200.000'den fazla kişinin ölümüne yol açtı.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  { text: "Japonya'da tren kazası: 107 ölü.", beklenen: "felaket", karanlik: "Felaket" },
  {
    text: "New York Menkul Kıymetler Borsası çöktü; Amerika Birleşik Devletleri'nde ekonomik depresyonun başlangıcı.",
    beklenen: "felaket",
    karanlik: null,
    not: "ekonomik çöküş — can kaybı yok, karanlık eşiğini geçmemeli",
  },
  {
    text: "İran'ın Kirman Eyaleti'nde 6,6 büyüklüğünde deprem oldu. Çoğunluğu Bam'da olmak üzere 20.000 kişi öldü.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  {
    text: "1918'de başlayan İspanyol gribi salgını, dünya genelinde tahmini 50 milyon kişinin ölümüne yol açtı.",
    beklenen: "felaket",
    karanlik: "Felaket",
  },
  {
    text:
      "Van çığ faciası: Van, Bahçesaray'da çığ altında kalan vatandaşları kurtarmaya giden askerler ve " +
      "kurtarma ekipleri de üzerlerine düşen çığın altında kaldı.",
    beklenen: "felaket",
    karanlik: "Felaket",
    not: "'Bahçesaray'da' içindeki 'ay' kalıba takılmamalı — asıl eşleşme 'facia'/'çığ'",
  },
  { text: "Gemi fırtınada battı, 200 kişi öldü.", beklenen: "felaket", karanlik: "Felaket" },

  // ==================== savas ====================
  { text: "İkinci Anafartalar Savaşı başladı.", beklenen: "savas", karanlik: null },
  {
    text:
      "Sovyetler Birliği'nin Kızıl Ordu birlikleri, Polonya'da Almanya'nın kurduğu Auschwitz-Birkenau " +
      "Toplama ve İmha Kampını ele geçirdi.",
    beklenen: "savas",
    karanlik: null,
  },
  {
    text:
      "Kıbrıs Harekâtı: Türk Silahlı Kuvvetleri'nin Garanti Anlaşması'nın III. maddesine istinaden " +
      "gerçekleştirdiği askerî harekâtın başlangıcı.",
    beklenen: "savas",
    karanlik: null,
  },
  { text: "Amerika Birleşik Devletleri Deniz Kuvvetleri, Haiti'yi işgal etti.", beklenen: "savas", karanlik: null },
  { text: "II. Viyana Kuşatması ile sonuçlanacak savaş ilan edildi.", beklenen: "savas", karanlik: null },
  {
    text: "Mastaba Meydan Muharebesi: Canberdi Gazali İsyanı bastırıldı.",
    beklenen: "savas",
    karanlik: null,
  },
  {
    text: "I. Dünya Savaşı: Rus askerleri Osmanlı İmparatorluğu'nun Gümüşhane kentini işgal etti.",
    beklenen: "savas",
    karanlik: null,
  },
  {
    text:
      "Suruç saldırısı: Şanlıurfa'nın Suruç ilçesinde düzenlenen bombalı intihar saldırısında 34 kişi öldü, " +
      "100'den fazla kişi yaralandı.",
    beklenen: "savas",
    karanlik: "Şiddet",
    not: "'bombalı intihar saldırısı' — 'bombalı' ile 'saldırı' arasına giren 'intihar' kalıbı bozmamalı",
  },

  // ==================== siyaset ====================
  { text: "Ebu'l-Hasan Beni Sadr, İran'ın ilk Cumhurbaşkanı oldu.", beklenen: "siyaset", karanlik: null },
  {
    text: "Fransa'da Camille Chautemps istifa etti. Yeni hükûmeti, Édouard Daladier kurdu.",
    beklenen: "siyaset",
    karanlik: null,
  },
  { text: "Montrö Boğazlar Sözleşmesi imzalandı.", beklenen: "siyaset", karanlik: null },
  {
    text:
      "Türkiye'de askerî darbe girişimi sonrasında, Millî Güvenlik Kurulu önerisi ve Bakanlar Kurulu kararı " +
      "ile olağanüstü hâl ilân edildi.",
    beklenen: "siyaset",
    karanlik: null,
  },
  {
    text: "Cenevre'de Milletler Cemiyeti toplantısında, Hatay'ın bağımsızlığı kabul edildi.",
    beklenen: "siyaset",
    karanlik: null,
  },
  {
    text: "Ürdün Kralı I. Abdullah, Cuma namazı sırasında bir Filistinli tarafından öldürüldü.",
    beklenen: "siyaset",
    karanlik: "Suikast",
  },
  {
    text: "Vitalianus, 657'den 672'deki ölümüne kadar Katolik Kilisesi için papalık yapmıştır.",
    beklenen: "siyaset",
    karanlik: null,
  },
  {
    text: "Sovyet Devrimi liderlerinden Leon Troçki, Meksika'da öldürüldü.",
    beklenen: "siyaset",
    karanlik: "Suikast",
  },
  {
    text: "Cumhuriyet Halk Partisi lideri Bülent Ecevit'in seçim otobüsü, Niksar'da kurşunlandı. Saldırıda 10 kişi yaralandı.",
    beklenen: "siyaset",
    karanlik: null,
    not: "'saldırı' tek başına (puan 2) eşik olan 3'ün altında kalmalı",
  },

  // ==================== bilim ====================
  {
    text:
      "Cambridge Üniversitesi'nde iki bilim insanı, kalıtsal özellikleri ebeveynden çocuğa taşıyan " +
      "deoksiribonükleik asit (DNA) adını verdikleri molekül yapıyı tanımladı.",
    beklenen: "bilim",
    karanlik: null,
  },
  {
    text:
      "İlk nükleer denizaltı olan USS Nautilus, yüzeye hiç çıkmadan 60.000 deniz mili katederek " +
      "Jules Verne'in ünlü romanını gerçeğe dönüştürdü.",
    beklenen: "bilim",
    karanlik: null,
    not: "'nükleer' (bilim, güçlü) ile 'romanını' (kultur) eşit ağırlıkta değil — bilim önde, eşitlikte de PRIORITY sırasında önde",
  },
  { text: "Charles Townes, Amerikalı fizikçi ve Nobel Fizik Ödülü sahibi oldu.", beklenen: "bilim", karanlik: null },
  {
    text: "Bilim tarihinde çığır açan bir buluş olarak nitelendirildi.",
    beklenen: "bilim",
    karanlik: null,
    not: "'çığ' kalıbı 'çığır'a takılmamalı (Türkçe-farkında sınır testi)",
  },

  // ==================== kesif ====================
  {
    text:
      "Tarihte ilk kez insanlı bir uzay aracı, Ay'a ulaştı. Apollo 11 Ay yüzeyine indi. " +
      "Astronot Neil Armstrong da Ay'a ilk ayak basan insan oldu.",
    beklenen: "kesif",
    karanlik: null,
  },
  { text: "Apollo 11 Ay'a indi.", beklenen: "kesif", karanlik: null },
  {
    text: "Viking 1, 11 ay süren yolculuktan sonra Mars'a kondu ve Dünya'ya fotoğraflar aktarmaya başladı.",
    beklenen: "kesif",
    karanlik: null,
  },
  {
    text: "Sovyetler Birliği'nin ilk yapay uydu Sputnik'i fırlatmasıyla ABD ile arasındaki uzay yarışı başladı.",
    beklenen: "kesif",
    karanlik: null,
  },
  {
    text: "İlk başarılı Amerika Birleşik Devletleri uydusu Explorer 1, Dünya çevresindeki yörüngesine oturdu.",
    beklenen: "kesif",
    karanlik: null,
  },
  {
    text: "Semiorka adıyla bilinen Sovyet füzesi R7'nin ilk başarılı uçuşu gerçekleşti.",
    beklenen: "kesif",
    karanlik: null,
    not: "'ilk' ile 'uçuş' arası 'başarılı' sıfatını atlayabilmeli",
  },

  // ==================== kultur ====================
  {
    text: "Mona Lisa tablosu, Louvre Müzesi'nin bir çalışanı tarafından çalındı.",
    beklenen: "kultur",
    karanlik: null,
  },
  {
    text: "Topkapı Sarayı'na yeni bir kütüphane eklendi.",
    beklenen: "kultur",
    karanlik: null,
    not: "'ay'' kalıbı Saray'a takılmamalı — eşleşme 'kütüphane'den gelir",
  },
  {
    text: "Boris Vladimiroviç Asafiev, Rus müzikolog ve besteci öldü.",
    beklenen: "kultur",
    karanlik: null,
  },
  {
    text: "Amerikalı romancı Edgar Rice Burroughs'un yarattığı Tarzan'ı konu alan ilk film gösterime girdi.",
    beklenen: "kultur",
    karanlik: null,
  },
  {
    text: "İstanbul Aksaray'daki Küçük Opera Tiyatrosu tamamen yandı.",
    beklenen: "kultur",
    karanlik: "Felaket",
    not: "'Aksaray'daki' içindeki 'ay' kalıba takılmamalı; 'opera'+'tiyatro' kultur'u, 'yandı' karanlığı belirler",
  },

  // ==================== spor ====================
  { text: "Kış Olimpiyat Oyunları Innsbruck'ta (Avusturya) başladı.", beklenen: "spor", karanlik: null },
  {
    text: "İstanbul Çavuşoğlu Lisesi, Dünya Liselerarası Basketbol Şampiyonu oldu.",
    beklenen: "spor",
    karanlik: null,
  },

  // ==================== genel ====================
  { text: "55. Eurovision Şarkı Yarışması finali Oslo'da yapıldı.", beklenen: "genel", karanlik: null },
  { text: "Kanada, aynı cinsler arasında evliliğe izin veren dördüncü ülke oldu.", beklenen: "genel", karanlik: null },
  { text: "Londra Borsası halka açıldı.", beklenen: "genel", karanlik: null },
  {
    text:
      "Penthouse dergisi çıplak fotoğraflarını yayımlayınca, Miss America yarışması yetkilileri, " +
      "Vanessa Williams'tan tacını iade etmesini istedi.",
    beklenen: "genel",
    karanlik: null,
  },
  { text: "Ford ilk arabasını üretti.", beklenen: "genel", karanlik: null },
  { text: "Britanya Kolumbiyası, Kanada Federasyonu'na katıldı.", beklenen: "genel", karanlik: null },
  {
    text: "Casus balon krizi. ABD ordusu, Çin'e ait olan casus balonu füzeyle vurarak düşürdü.",
    beklenen: "genel",
    karanlik: null,
    not: "'ABD ordusu' — 'abd' milliyet listesinde yok, kalıp bilinçli olarak tetiklenmiyor",
  },
  { text: "Moğolistan Halk Ordusu kuruldu.", beklenen: "genel", karanlik: null },

  // ==================== karanlık — ek örnekler ====================
  {
    text: "Muratağa, Sandallar ve Atlılar Katliamı: 88 Türk'ün öldürülüp yakılarak çukura gömüldüğü ortaya çıktı.",
    beklenen: "genel",
    karanlik: "Şiddet",
  },
  {
    text: "William Kemmler, elektrikli sandalye ile idam edilen ilk kişi oldu.",
    beklenen: "genel",
    karanlik: "İnfaz & İdam",
  },

  // ==================== YANLIŞ POZİTİF TUZAKLARI ====================
  {
    text: "Bursa kazası kadılığına atama yapıldı.",
    beklenen: "genel",
    karanlik: null,
    not: "'kazas' kalıbı buraya takılmamalı (Osmanlı idari birimi)",
  },
  {
    text: "Rumeli kazaskerliğine getirildi.",
    beklenen: "genel",
    karanlik: null,
    not: "'kazasker' unvanı 'kaza'ya takılmamalı",
  },
  {
    text: "Ordu ilinde belediye seçimleri yapıldı.",
    beklenen: "siyaset",
    karanlik: null,
    not: "'ordu' kalıbı il adına takılmamalı — asıl eşleşme 'seçim'den",
  },
  {
    text: "Ülkedeki nüfus patlaması tartışmaya yol açtı.",
    beklenen: "genel",
    karanlik: null,
    not: "mecazi 'patlama' felaket sayılmamalı",
  },
  {
    text: "Selanik'te yeni bir okul açıldı.",
    beklenen: "genel",
    karanlik: null,
    not: "'sel' kalıbı Selanik'e takılmamalı",
  },
  {
    text: "Galatasaray Lisesi, İstanbul'da açıldı.",
    beklenen: "genel",
    karanlik: null,
    not: "'Galatasaray' içindeki 'ay' kalıba takılmamalı",
  },
  {
    text: "Papağan yetiştiriciliği ilçede yaygınlaştı.",
    beklenen: "genel",
    karanlik: null,
    not: "'papa' kalıbı papağan'a takılmamalı",
  },
  {
    text: "Genç yaşta yazarken yayınevinden ret cevabı aldı.",
    beklenen: "genel",
    karanlik: null,
    not: "'yazar' kalıbı 'yazarken'e (yazmak fiili) takılmamalı",
  },
  {
    text: "Deneyimli bir doktor hastaneye başhekim olarak atandı.",
    beklenen: "genel",
    karanlik: null,
    not: "'deney' kalıbı 'deneyimli'ye takılmamalı",
  },
  {
    text: "Uydurma bir haber yüzünden piyasalar karıştı.",
    beklenen: "genel",
    karanlik: null,
    not: "'uydu' kalıbı 'uydurma'ya takılmamalı",
  },
  {
    text: "Marsilya limanında yeni bir liman inşa edildi.",
    beklenen: "genel",
    karanlik: null,
    not: "'mars' kalıbı Marsilya'ya takılmamalı",
  },
];
