export type CategoryId =
  | "savas"
  | "siyaset"
  | "bilim"
  | "kesif"
  | "kultur"
  | "spor"
  | "felaket"
  | "genel";

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

export type CaseType =
  | "suikast"
  | "cinayet"
  | "katliam"
  | "kayıp"
  | "felaket"
  | "idam"
  | "skandal";

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

export const CURATED: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "02-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Sevgililer Günü Katliamı",
      text: "1929 Chicago: Bir garajda polis kılığına girmiş tetikçiler, Bugs Moran çetesinden 7 kişiyi kurşuna dizdi. Al Capone hiç mahkûm edilmedi.",
    },
    events: [
      {
        id: "ev-0214-rushdie",
        year: 1989,
        text: "İran lideri Ayetullah Humeyni, yazar Salman Rushdie hakkında 'Şeytan Ayetleri' kitabı nedeniyle ölüm fetvası verdi.",
        detail:
          "Fetva, Rushdie'yi on yıllarca saklanmaya ve korumayla yaşamaya mahkûm etti. 2022'de New York'ta bir konuşması sırasında bıçaklı saldırıya uğradı ve ağır yaralandı; saldırıyı gerçekleştiren kişi, fetvadan 30 yılı aşkın süre sonra doğmuştu.",
        category: "siyaset",
        matchKeys: ["rushdie", "humeyni", "fetva"],
      },
    ],
    cases: [
      {
        id: "case-0214-massacre",
        year: 1929,
        type: "katliam",
        title: "Sevgililer Günü Katliamı",
        location: "Chicago, ABD — Clark Caddesi garajı",
        status: "FAİLİ MEÇHUL",
        summary:
          "Polis üniformalı dört kişi, Bugs Moran'ın çetesinden 7 adamı garaj duvarına dizip makineli tüfeklerle taradı.",
        detail:
          "İçki yasağı döneminin en ünlü gangster hesaplaşması. Kurbanlardan biri kurşunlara rağmen saatlerce yaşadı ve polise 'Kimse beni vurmadı' dedi. Tetikçiler asla resmen yakalanmadı; operasyonun Al Capone'nin emriyle yapıldığına kesin gözüyle bakıldı ama Capone hiç bu suçtan yargılanmadı. Olay, Amerikan kamuoyunu mafyaya karşı öyle öfkelendirdi ki FBI'ın güçlendirilmesinin önünü açtı.",
        tags: ["mafya", "Al Capone", "içki yasağı", "Chicago"],
      },
      {
        id: "case-0214-valentine",
        year: 269,
        type: "idam",
        title: "Aziz Valentine'in İnfazı (Rivayet)",
        location: "Roma İmparatorluğu",
        status: "KAPANDI",
        summary:
          "Bugün, adını 14 Şubat'a veren rahip Valentine'in Roma'da idam edildiği rivayet edilen gün.",
        detail:
          "Efsaneye göre Valentine, İmparator II. Claudius'un evlilik yasağına rağmen askerleri gizlice evlendiren bir rahipti. Hapse atıldı, gardiyanının kızına 'senin Valentine'in' imzalı bir mektup bıraktı ve 14 Şubat'ta idam edildi. Tarihçiler birden fazla Valentine hikâyesinin iç içe geçtiğini düşünür; kesin olan tek şey, 14 Şubat'ın Orta Çağ'dan beri aşkla anılması.",
        tags: ["Roma", "efsane", "Hristiyanlık"],
      },
      {
        id: "case-0214-niu",
        year: 2008,
        type: "katliam",
        title: "Northern Illinois Üniversitesi Saldırısı",
        location: "DeKalb, Illinois, ABD",
        status: "KAPANDI",
        summary:
          "Eski bir yüksek lisans öğrencisi, dersliğin kürsüsünden açtığı ateşle 5 kişiyi öldürdü, 21 kişiyi yaraladı.",
        detail:
          "Steven Kazmierczak, sosyoloji dersinin ortasında kürsüye çıkıp pompalı tüfek ve iki tabancayla ateş açtı, ardından intihar etti. Olay günü kampüsteki Sevgililer Günü kutlamaları yarıda kaldı. Soruşturmada saldırganın uzun süredir psikiyatrik tedavi gördüğü ve ilaçlarını bırakmış olduğu ortaya çıktı.",
        tags: ["kampüs", "ABD", "silah"],
      },
    ],
    science: [
      {
        id: "sci-0214-eniac",
        year: 1946,
        field: "Bilişim",
        title: "ENIAC kamuoyuna tanıtıldı",
        summary:
          "İlk genel amaçlı elektronik bilgisayar ENIAC, Pennsylvania Üniversitesi'nde basına gösterildi. 27 ton ağırlığındaydı, bir salonu dolduruyordu ve saniyede 5.000 toplama işlemi yapabiliyordu — o gün için 'dev beyin' manşetleri atıldı.",
      },
      {
        id: "sci-0214-phone",
        year: 1876,
        field: "İletişim",
        title: "Telefonun iki patenti aynı gün dosyalandı",
        summary:
          "Alexander Graham Bell'in patent başvurusu ile Elisha Gray'in benzer tasarımı aynı gün, saatler arayla patent ofisine ulaştı. Patent Bell'e verildi; tarih, telefonu ona yazdı ama tartışma 150 yıldır bitmedi.",
      },
    ],
    talk: [
      {
        id: "talk-0214-1",
        category: "Karanlık Tarih",
        hook: "7 kurşun dizisi, sıfır mahkûmiyet: Sevgililer Günü Katliamı",
        body: "1929 Chicago. Dört adam polis üniforması giydi, Bugs Moran'ın 7 adamını bir garaja topladı ve makineli tüfeklerle taradı. Moran saniyelerle kurtuldu. Tetikçiler hiç yakalanmadı; herkes emri Al Capone'nin verdiğini biliyordu ama kanıt yoktu. Olay mafyaya karşı öfkeyi öyle büyüttü ki, federal güçlerin eli güçlendi. Yayın sorusu: Bir şehir, suçla nasıl başa çıkar?",
        minutes: 3,
      },
      {
        id: "talk-0214-2",
        category: "Bilim",
        hook: "Telefonu kim icat etti? Cevap: aynı gün iki kişi birden",
        body: "14 Şubat 1876'da patent ofisine iki başvuru geldi: Alexander Graham Bell ve Elisha Gray. İkisi de sesi telle iletmeyi düşünmüştü. Patent Bell'e verildi, üç gün sonra Bell ilk cümlesini söyledi: 'Bay Watson, buraya gelin.' Gray tarih kitaplarında dipnot kaldı. Ders: Bazı icatlar tek bir dehanın değil, aynı anda olgunlaşan bir çağın ürünüdür.",
        minutes: 2,
      },
      {
        id: "talk-0214-3",
        category: "Bilim",
        hook: "27 tonluk 'beyin': ENIAC 1946'da bugün tanıtıldı",
        body: "İlk elektronik bilgisayar ENIAC bir salonu dolduruyordu: 17.000 vakum tüpü, 27 ton ağırlık. Programlamak için kabloları elle söküp takıyordunuz. Bugün cebinizdeki telefon ondan milyonlarca kat güçlü. Yine de ENIAC'in yaptığı ilk işlerden biri, hidrojen bombası hesaplarıydı — bilgisayar çağı hem merak hem savaşla doğdu.",
        minutes: 2,
      },
      {
        id: "talk-0214-4",
        category: "Kültür",
        hook: "14 Şubat aslında bir idamın yıl dönümü olabilir",
        body: "Rivayete göre Rahip Valentine, evliliği yasaklanan Roma askerlerini gizlice evlendirdiği için 14 Şubat'ta idam edildi. Hapisten gönderdiği son mektup 'senin Valentine'in' diye bitiyordu. Gerçek mi efsane mi bilinmez; ama Orta Çağ'dan beri bu tarih aşka ayrıldı. Bugün birilerine yazacağınız mesaja 1700 yıllık bir gölge eşlik ediyor.",
        minutes: 1,
      },
      {
        id: "talk-0214-5",
        category: "Dünya",
        hook: "Bir kitabın bedeli: 30 yıl korumayla yaşamak",
        body: "1989'da Ayetullah Humeyni, Salman Rushdie hakkında 'Şeytan Ayetleri' için ölüm fetvası verdi. Rushdie yıllarca saklandı, korumayla yaşadı; 2022'de sahnede bıçaklandı ve bir gözünü kaybetti. Saldırgan, fetva verildiğinde henüz doğmamıştı. Bir cümlenin coğrafyaları ve kuşakları aşan gücü üzerine düşünmek için çarpıcı bir gün.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "03-08": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "MH370: 239 kişiyle kaybolan uçak",
      text: "8 Mart 2014 gecesi Kuala Lumpur'dan kalkan Boeing 777, radardan silindi. Havacılık tarihinin en büyük gizemi hâlâ çözülmedi.",
    },
    events: [
      {
        id: "ev-0308-petrograd",
        year: 1917,
        text: "Petrograd'da kadın tekstil işçilerinin başlattığı grev, Şubat Devrimi'ni tetikleyen kıvılcım oldu.",
        detail:
          "Takvim farkıyla 23 Şubat'a denk gelen 8 Mart günü, kadın işçiler 'Ekmek ve barış!' sloganıyla sokaklara döküldü. Grev dört günde genel greve, genel grev Çarlık'ın çöküşüne dönüştü. Bu olay, 8 Mart'ın uluslararası anlamının temel taşlarından biri sayılır.",
        category: "siyaset",
        matchKeys: ["petrograd", "şubat devrimi", "kadın işçi"],
      },
    ],
    cases: [
      {
        id: "case-0308-mh370",
        year: 2014,
        type: "kayıp",
        title: "Malezya Hava Yolları MH370",
        location: "Kuala Lumpur → Pekin, Hint Okyanusu",
        status: "SÜRÜYOR",
        summary:
          "239 kişiyi taşıyan Boeing 777, kalkıştan 38 dakika sonra radardan kayboldu. Enkazın büyük bölümü hiçbir zaman bulunamadı.",
        detail:
          "Uçağın iletişim sistemleri kapatılmış ve rota güneye, Hint Okyanusu'nun ıssızlığına çevrilmişti. Uydu 'el sıkışma' verileri uçağın saatlerce uçtuğunu gösterdi. Yıllar süren aramada yalnızca bazı parçalar Afrika kıyılarına vurdu. Kaza mı, sabotaj mı, pilot eylemi mi? Resmî soruşturma kesin bir cevap veremedi; dosya havacılığın en büyük 'kayıp' dosyası olarak açık.",
        tags: ["havacılık", "gizem", "Hint Okyanusu", "239 kişi"],
      },
    ],
    science: [
      {
        id: "sci-0308-kepler",
        year: 1618,
        field: "Astronomi",
        title: "Kepler, üçüncü gezegen yasasını formüle etti",
        summary:
          "Johannes Kepler, gezegenlerin yörünge dönemleriyle uzaklıkları arasındaki ilişkiyi bugün buldu: Dönemin karesi, uzaklığın küpüyle orantılıdır. Bu yasa, Newton'un kütleçekimini formüle etmesinin yolunu açtı.",
      },
      {
        id: "sci-0308-laroche",
        year: 1910,
        field: "Havacılık",
        title: "İlk kadın pilot lisansı verildi",
        summary:
          "Raymonde de Laroche, dünyada resmî pilot lisansı alan ilk kadın oldu. Fransız aktris, uçuş derslerine 'havada erkeklerden daha iyi görünüyorum' diyerek başlamıştı; bir yıl önce kendi uçağıyla ilk solo uçuşunu yapmıştı.",
      },
    ],
    talk: [
      {
        id: "talk-0308-1",
        category: "Gizem",
        hook: "239 kişiyle buharlaşan uçak: MH370",
        body: "8 Mart 2014, gece 00:41. 'İyi geceler, Malezya Üç Yedi Sıfır.' Uçağın son telsiz mesajı buydu. Dakikalar sonra transponder kapandı, uçak rotasını çevirdi ve saatlerce kimse görmeden uçtu. Enkazın ana gövdesi hâlâ bulunamadı. Komplo teorilerini boş verin; gerçek hikâye yeterince ürpertici: modern çağda koskoca bir yolcu uçağı gerçekten kaybolabilir.",
        minutes: 3,
      },
      {
        id: "talk-0308-2",
        category: "Tarih",
        hook: "Bir grev bir imparatorluğu devirdi",
        body: "1917'de Petrograd'da kadın tekstil işçileri 'Ekmek ve barış!' diye sokağa çıktı. Dört gün içinde şehir durdu, Çar tahtı bıraktı. Bir asırdır süren imparatorluk, kadınların başlattığı bir grevle sarsıldı. 8 Mart'ın arkasındaki gerçek hikâye karanfillerden çok daha güçlü: bu tarih, sokağa çıkanların tarihi.",
        minutes: 2,
      },
      {
        id: "talk-0308-3",
        category: "Bilim",
        hook: "Kepler bugün üçüncü yasayı buldu — ama sevinemedi",
        body: "8 Mart 1618'de Kepler, gezegenlerin dansının son kuralını yazdı: Dönemin karesi, uzaklığın küpüyle orantılı. İlginç detay: aynı günlerde Avrupa'da Otuz Yıl Savaşları patladı. Kepler'in hayatı savaş, sürgün ve annesinin cadılıkla yargılanması arasında geçti; yasaları ise Newton'a giden yolu döşedi.",
        minutes: 2,
      },
      {
        id: "talk-0308-4",
        category: "Havacılık",
        hook: "İlk kadın pilot: sahne adını bırakıp gökyüzünü seçti",
        body: "Raymonde de Laroche, 1910'da dünyada lisans alan ilk kadın pilot oldu. Ertesi yıl bir fuarda uçağıyla kaza geçirdi, iki yıl hastanede yattı, sonra yine uçtu. 1919'da bir test uçuşunda hayatını kaybetti. Gökyüzü o günden beri biraz onun.",
        minutes: 1,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "04-23": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Ankara'da bir meclis açıldı",
      text: "23 Nisan 1920'de TBMM ilk oturumunu yaptı. Savaşın ortasında toplanan meclis, dört yıl sonra bir cumhuriyet ilan edecekti.",
    },
    events: [
      {
        id: "ev-0423-tbmm",
        year: 1920,
        text: "Türkiye Büyük Millet Meclisi, Ankara'da ilk oturumunu yaptı; en yaşlı üye sıfatıyla Şerif Bey başkanlık etti.",
        detail:
          "İstanbul'un işgali ve ülkenin paylaşılması karşısında toplanan meclisin ilk oturumu Hacı Bayram Camii'ndeki cuma namazının ardından başladı. İlk gün 115 milletvekili hazırdı. Meclis, 'egemenlik kayıtsız şartsız milletindir' ilkesini hayata geçiren kurum olarak Kurtuluş Savaşı'nı yönetti.",
        category: "siyaset",
        matchKeys: ["tbmm", "büyük millet meclisi", "ankara'da"],
      },
      {
        id: "ev-0423-edebiyat",
        year: 1616,
        text: "İngiliz oyun yazarı William Shakespeare ile 'Don Kişot'un yazarı Miguel de Cervantes aynı gün hayata veda etti.",
        detail:
          "İki dev aynı tarihte öldü ama tam olarak 'aynı gün' değil: İngiltere Jülyen, İspanya Gregoryen takvim kullanıyordu; Cervantes aslında Shakespeare'den 10 gün önce ölmüştü. Yine de 23 Nisan, bu tesadüfün hatırına Dünya Kitap Günü ilan edildi.",
        category: "kultur",
        matchKeys: ["shakespeare", "cervantes"],
      },
    ],
    cases: [],
    science: [
      {
        id: "sci-0423-youtube",
        year: 2005,
        field: "İnternet",
        title: "İlk YouTube videosu yüklendi: 'Me at the zoo'",
        summary:
          "Kuruculardan Jawed Karim, San Diego Hayvanat Bahçesi'nde 19 saniyelik bir video yükledi: 'Bunların gerçekten uzun hortumları var.' Video bugün milyarlarca izlenmeyi aşan bir platformun ilk tuğlasıydı.",
      },
    ],
    talk: [
      {
        id: "talk-0423-1",
        category: "Tarih",
        hook: "Bir meclis nasıl kurulur? Ankara, 1920",
        body: "İstanbul işgal altında, ülke parçalanıyor. Ankara'da, yeni bitmiş bir kulüp binasında milletvekilleri toplanıyor: sıralar bir okuldan getirilmiş, kürsü marangoz işi. 23 Nisan 1920, cuma namazından sonra meclis açılıyor. Savaşın ortasında 'egemenlik milletindir' diyen bir meclis, dört yıl sonra cumhuriyeti ilan edecek. Kuruluş hikâyeleri hep böyle başlar: imkânsızlıkla.",
        minutes: 3,
      },
      {
        id: "talk-0423-2",
        category: "Edebiyat",
        hook: "İki dev, aynı tarih: Shakespeare ve Cervantes",
        body: "Edebiyatın en güzel tesadüfü: Don Kişot'un yazarı ile Hamlet'in yazarı 23 Nisan 1616'da öldü. Küçük bir numara var; iki ülke farklı takvim kullanıyordu, Cervantes aslında 10 gün önce vefat etmişti. Ama UNESCO bu tesadüfü sevdi: 23 Nisan artık Dünya Kitap Günü. Bugün bir kitap hediye etmek, 400 yıllık bir geleneğe selam durmaktır.",
        minutes: 2,
      },
      {
        id: "talk-0423-3",
        category: "Teknoloji",
        hook: "İnternetin ilk videosu 19 saniyeydi",
        body: "23 Nisan 2005'te Jawed Karim, San Diego Hayvanat Bahçesi'nde kameraya döndü: 'Şu fillerin gerçekten uzun hortumları var.' 'Me at the zoo' adlı bu 19 saniyelik video, YouTube'un ilk yüklemesiydi. Bugün platforma her dakika yüzlerce saatlik video yükleniyor. Her devrim, küçük ve biraz tuhaf bir adımla başlar.",
        minutes: 2,
      },
      {
        id: "talk-0423-4",
        category: "Kültür",
        hook: "Dünyada çocuklara adanmış tek bayram",
        body: "23 Nisan 1920'de açılan meclis, Türkiye'de bir geleneğe dönüştü: Atatürk bu günü çocuklara armağan etti. Bugün dünya takviminde çocuklara adanmış, resmî tatil olan başka bir gün yok. Bir devletin doğum gününü çocuklara emanet etmek, başlı başına bir siyaset felsefesi.",
        minutes: 1,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "04-25": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Hayatın şifresi: DNA",
      text: "25 Nisan 1953'te Nature dergisi, Watson ve Crick'in 900 kelimelik makalesini yayımladı. 'Gizli yapı' çözülmüş, biyoloji sonsuza dek değişmişti.",
    },
    events: [
      {
        id: "ev-0425-dna",
        year: 1953,
        text: "Watson ve Crick'in DNA'nın çift sarmal yapısını açıklayan makalesi Nature dergisinde yayımlandı.",
        detail:
          "'Yaşamın gizli yapısına yaklaşmış olabiliriz' cümlesiyle başlayan makale, yalnızca bir sayfaydı. Rosalind Franklin'in çektiği 'Fotoğraf 51' adlı kırınım görüntüsü, sarmalın anahtar kanıtıydı. Watson, Crick ve Wilkins 1962'de Nobel aldı; 1958'de hayatını kaybeden Franklin ödüle yetişemedi — Nobel, ölümden sonra verilmiyor.",
        category: "bilim",
        matchKeys: ["dna", "watson", "crick", "nature"],
      },
    ],
    cases: [
      {
        id: "case-0425-nepal",
        year: 2015,
        type: "felaket",
        title: "Nepal Depremi",
        location: "Gorkha, Nepal — Katmandu Vadisi",
        status: "KAPANDI",
        summary:
          "7,8 büyüklüğündeki depremde yaklaşık 9.000 kişi öldü, yarım milyon ev yıkıldı; Katmandu'nun tarihî meydanları dakikalar içinde yerle bir oldu.",
        detail:
          "Deprem, Hint levhasının Avrasya levhasının altına daldığı fay hattında biriktiği bilinen gerilimin boşalmasıyla oluştu. Bilim insanları on yıllardır Katmandu için 'büyük deprem' uyarısı yapıyordu. Artçı şoklar haftalarca sürdü; Everest'te çığ düşmesi ana kamptan 22 kişiyi aldı. Nepal, modern tarihinin en büyük arama-kurtarma operasyonlarından birine sahne oldu.",
        tags: ["deprem", "Himalaya", "9.000 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0425-hubble",
        year: 1990,
        field: "Astronomi",
        title: "Hubble Uzay Teleskobu yörüngeye yerleştirildi",
        summary:
          "Discovery uzay mekiği, Hubble'ı yörüngeye bıraktı. İlk fotoğraflar bulanıktı — aynasında üretim hatası vardı. 1993'te astronotlar yörüngede 'gözlük' taktı ve Hubble, evrenin en derin görüntülerini çekmeye başladı. 35 yılı aşkın süredir hâlâ çalışıyor.",
      },
      {
        id: "sci-0425-robins",
        year: 1719,
        field: "Edebiyat",
        title: "Robinson Crusoe yayımlandı",
        summary:
          "Daniel Defoe'nun ıssız adada 28 yıl yaşayan denizcisinin hikâyesi basıldı ve kısa sürede yılın en çok satan kitabı oldu. Gerçek bir denizcinin, Alexander Selkirk'ün dört yıllık ada sürgününden esinlenen roman, 'hayatta kalma' türünün atası sayılır.",
      },
    ],
    talk: [
      {
        id: "talk-0425-1",
        category: "Bilim",
        hook: "900 kelimeyle çözülen sır: DNA",
        body: "1953'te Nature'da bir sayfalık bir makale çıktı: Watson ve Crick, DNA'nın çift sarmalını açıklıyordu. Arka planda görünmeyen kahraman vardı: Rosalind Franklin. Onun çektiği 'Fotoğraf 51' olmadan sarmal çözülmezdi. Franklin 1958'de öldü, Nobel 1962'de verildi ve Nobel ölümden sonra verilmiyor. Bilim tarihinin en büyük 'keşke'lerinden biri.",
        minutes: 3,
      },
      {
        id: "talk-0425-2",
        category: "Uzay",
        hook: "Bozuk gözle doğdu, gözlükle efsane oldu: Hubble",
        body: "1990'da yörüngeye konan Hubble'ın ilk fotoğrafları bulanıktı — ana aynası fabrikada yanlış öğütülmüştü. NASA pes etmedi: 1993'te astronotlar uzay yürüyüşleriyle teleskoba düzeltici optik taktı. Sonrası tarihe geçti: 'Yaratılış Sütunları', 'Hubble Derin Alanı'... Bugün Hubble 35 yaşını geçti ve hâlâ evreni izliyor.",
        minutes: 2,
      },
      {
        id: "talk-0425-3",
        category: "Edebiyat",
        hook: "Issız adanın 300 yılı: Robinson Crusoe",
        body: "25 Nisan 1719'da yayımlanan Robinson Crusoe, yayımlandığı yıl dört baskı yaptı. Gerçek hikâye daha da ilginç: İskoç denizci Alexander Selkirk, kaptanla kavga edip 'beni bu adada bırakın' demiş, dört yıl tek başına yaşamıştı. Defoe bu hikâyeyi aldı, 28 yıla çıkardı ve modern romanın atalarından birini yazdı.",
        minutes: 2,
      },
      {
        id: "talk-0425-4",
        category: "Dünya",
        hook: "Bilinen depremin geldiği gün",
        body: "Nepal'de 2015 depremi aslında sürpriz değildi: jeologlar on yıllardır Katmandu'nun altında enerji biriktiğini yazıyordu. 7,8'lik sarsıntı geldiğinde tarihî meydanlar dakikalar içinde toz oldu, 9.000 kişi hayatını kaybetti. Depremin kendisi önlenemez; ama hangi şehirlerin sırada olduğunu biliyoruz. Soru şu: hazırlanıyor muyuz?",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "05-19": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Bandırma Vapuru Samsun'da",
      text: "16 Mayıs'ta İstanbul'dan ayrılan eski bir vapur, 19 Mayıs 1919 sabahı Samsun'a yanaştı. Güvertedeki asker, bir ulusun kaderini değiştirecek yolculuğu yeni bitirmişti.",
    },
    events: [
      {
        id: "ev-0519-samsun",
        year: 1919,
        text: "Mustafa Kemal, Bandırma Vapuru ile Samsun'a çıktı; Kurtuluş Savaşı'nın fiilen başladığı gün kabul edilir.",
        detail:
          "16 Mayıs'ta Galata rıhtımından kalkan Bandırma, Karadeniz'de fırtınalı bir yolculuğun ardından 19 Mayıs sabahı Samsun'a ulaştı. Gemi eskiydi, pusulası bile sorunluydu; Kaptan İsmail Hakkı (Durusu) rotayı kıyıyı izleyerek çizdi. Yolcular arasında İngiliz vizesiyle seyahat eden Mustafa Kemal ve karargâh subayları vardı.",
        category: "siyaset",
        matchKeys: ["samsun", "bandırma", "mustafa kemal"],
      },
    ],
    cases: [
      {
        id: "case-0519-halley",
        year: 1910,
        type: "skandal",
        title: "Halley Kuyrukluyıldızı Paniği",
        location: "Dünya geneli",
        status: "KAPANDI",
        summary:
          "Dünya, Halley'in kuyruğundan geçerken gazeteler 'zehirli gaz' korkusu yaydı; sahte 'kuyrukluyıldız hapları' ve gaz maskeleri satıldı.",
        detail:
          "Gökbilimciler kuyrukta siyanojen gazı tespit edince manşetler kıyamet senaryoları yazdı. Şarlatanlar 'koruyucu hap' sattı, bazıları evlerini havalandırmamak için pencerelerini battaniyelerle kapladı. Dünya kuyruktan geçti, hiçbir şey olmadı. Medya paniğinin gücünü gösteren ilk küresel örneklerden biridir.",
        tags: ["medya", "kitlesel panik", "astronomi"],
      },
    ],
    science: [
      {
        id: "sci-0519-halley",
        year: 1910,
        field: "Astronomi",
        title: "Dünya, Halley'in kuyruğundan geçti",
        summary:
          "19 Mayıs 1910'da Dünya, Halley Kuyrukluyıldızı'nın kuyruğunun içinden geçti — insanlık tarihinin en sıra dışı gök olaylarından biri. Kuyrukta siyanojen molekülü bulunduğu için panik çıktıysa da gaz o kadar seyrekti ki ölçülebilir hiçbir etki olmadı.",
      },
      {
        id: "sci-0519-lawrence",
        year: 1935,
        field: "Tıp & Güvenlik",
        title: "Lawrence'ın ölümü motosiklet kaskı araştırmalarını başlattı",
        summary:
          "'Arabistanlı Lawrence' T. E. Lawrence, motosiklet kazasında aldığı yaralarla 19 Mayıs'ta öldü. Kazaya müdahale eden cerrah Hugh Cairns, bu ölümden sonra motosikletlilerde kafa travmasını araştırmaya başladı; çalışmaları modern kask standartlarının temelini attı.",
      },
    ],
    talk: [
      {
        id: "talk-0519-1",
        category: "Tarih",
        hook: "Üç günlük yolculuk, bir ulusun rotası",
        body: "16 Mayıs 1919'da İstanbul'dan kalkan Bandırma Vapuru eski bir gemiydi; fırtınalı Karadeniz'de üç gün yol aldı ve 19 Mayıs sabahı Samsun'a ulaştı. Güvertede, resmî görevle 'bölgedeki asayişi denetlemeye' giden bir Osmanlı generali vardı: Mustafa Kemal. O 'denetim gezisi' dört yıl sonra bir cumhuriyetle bitti. Bazen tarihin en büyük olayları, küçük ve eski bir gemide başlar.",
        minutes: 3,
      },
      {
        id: "talk-0519-2",
        category: "Gökyüzü",
        hook: "Kıyamet hapı satanlar: 1910 Halley paniği",
        body: "Bilim insanları Halley'in kuyruğunda siyanojen gazı bulunca gazeteler 'Dünya zehirlenecek' manşetleri attı. Şarlatanlar hap sattı, insanlar pencerelerini mühürledi. 19 Mayıs'ta Dünya kuyruktan geçti... ve kimse fark etmedi bile. Sosyal medyadan 100 yıl önce de panik aynı şekilde yayılıyordu: korku, gerçekten hızlı seyahat eder.",
        minutes: 2,
      },
      {
        id: "talk-0519-3",
        category: "Kültür",
        hook: "'Happy Birthday Mr. President': bir şarkının bedeli",
        body: "19 Mayıs 1962'de Marilyn Monroe, Madison Square Garden'da 15.000 kişinin önünde Kennedy'ye şarkı söyledi. O gece giydiği elbise, yıllar sonra açık artırmada milyonlarca dolara satıldı. Şarkı, 36 saniyeydi; ama Amerikan siyaseti ve popüler kültürü o sahnede birbirine karıştı.",
        minutes: 2,
      },
      {
        id: "talk-0519-4",
        category: "Bilim",
        hook: "Bir efsanenin ölümü binlerce hayat kurtardı",
        body: "T. E. Lawrence — 'Arabistanlı Lawrence' — 1935'te bir motosiklet kazasında öldü. Kazayı inceleyen cerrah Hugh Cairns 'kask takılsaydı ölmezdi' dedi ve kafa travması üzerine çalışmaya başladı. Bulguları, önce orduda sonra her yerde kask zorunluluğunun bilimsel temelini oluşturdu. Bir ölüm, binlerce hayat: bilimin sessiz matematiği.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "07-20": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Kartal indi",
      text: "20 Temmuz 1969, saat 20:17 UTC. Apollo 11'in iniş modülü Eagle, Ay'ın Sükûnet Denizi'ne kondu. Yerde 25 saniyelik yakıt kalmıştı.",
    },
    events: [
      {
        id: "ev-0720-apollo",
        year: 1969,
        text: "Apollo 11'in Eagle modülü Ay'a indi; Neil Armstrong ve Buzz Aldrin, insanlık tarihinde Ay yüzeyine ayak basan ilk insanlar oldu.",
        detail:
          "İniş sırasında bilgisayar '1202' program alarmı verdi ve otomatik pilot, Eagle'ı kaya dolu bir kratere doğru götürüyordu. Armstrong manuel kontrolü aldı; motor durduğunda tankta yaklaşık 25 saniyelik yakıt kalmıştı. Michael Collins ise komuta modülünde, Ay'ın arkasında tek başına tur atıyordu.",
        category: "kesif",
        matchKeys: ["apollo", "ay'a", "armstrong", "eagle"],
      },
    ],
    cases: [
      {
        id: "case-0720-valkyrie",
        year: 1944,
        type: "suikast",
        title: "Valkür Operasyonu: Hitler'e Bomba",
        location: "Rastenburg, Doğu Prusya — 'Kurt İni' karargâhı",
        status: "KAPANDI",
        summary:
          "Albay Stauffenberg, Hitler'in brifing salonuna çanta içinde bomba bıraktı. Hitler, çantanın masa ayağının arkasına itilmesi sayesinde kurtuldu.",
        detail:
          "20 Temmuz 1944'te Yarbay Claus von Stauffenberg, içinde patlayıcı olan çantayı toplantı masasının altına bırakıp odadan çıktı. Patlama dört kişiyi öldürdü ama Hitler hafif yaralı kurtuldu; ağır meşe masa ve açık pencere şoku emmişti. Darbe planı aynı gece çöktü. Stauffenberg ve üç subay gece yarısı kurşuna dizildi; takip eden aylarda 200'den fazla kişi idam edildi. Savaş iki yıl daha sürdü.",
        tags: ["II. Dünya Savaşı", "direniş", "Stauffenberg", "darbe"],
      },
      {
        id: "case-0720-aurora",
        year: 2012,
        type: "katliam",
        title: "Aurora Sinema Saldırısı",
        location: "Aurora, Colorado, ABD",
        status: "ÇÖZÜLDÜ",
        summary:
          "Gece yarısı seansında bir saldırgan, 'Kara Şövalye Yükseliyor' gösterimi sırasında ateş açtı: 12 ölü, 70 yaralı.",
        detail:
          "James Holmes, sinema salonuna gaz maskesi ve zırhla girdi, önce göz yaşartıcı gaz attı, sonra ateş açtı. Kurbanların en küçüğü 6 yaşındaydı. Holmes, müebbet hapse mahkûm edildi. Olay, ABD'de silah tartışmasının dönüm noktalarından biri olarak hafızaya kazındı.",
        tags: ["sinema", "ABD", "12 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0720-apollo",
        year: 1969,
        field: "Uzay",
        title: "İnsan, başka bir gök cisminde yürüdü",
        summary:
          "Apollo 11 ile Ay'a iniş, mühendislik tarihinin zirvelerinden: 400.000 kişinin çalıştığı program, 1960'ların bilgisayar gücüyle — bugünkü bir hesap makinesinden zayıf — başarıldı. Ay'dan getirilen 21,5 kg kaya ve toprak, Güneş Sistemi'nin tarihini yeniden yazdırdı.",
      },
      {
        id: "sci-0720-viking",
        year: 1976,
        field: "Uzay",
        title: "Viking 1, Mars yüzeyine başarılı iniş yaptı",
        summary:
          "Tam yedi yıl sonra, yine 20 Temmuz'da: Viking 1, ABD'nin Mars'a ilk başarılı inişini gerçekleştirdi ve yüzeyden ilk net fotoğrafları gönderdi. Üzerindeki deneyler 'yaşam izi' aradı; sonuçlar bugün bile tartışılıyor.",
      },
    ],
    talk: [
      {
        id: "talk-0720-1",
        category: "Uzay",
        hook: "25 saniyelik yakıtla Ay'a indiler",
        body: "Eagle alçalırken bilgisayar '1202' alarmı verdi — işlemci dolmuştu. Otomatik pilot aracı kaya dolu bir kratere götürüyordu. Armstrong direksiyonu devraldı, düz bir alan aradı ve Eagle'ı indirdiğinde tankta 25 saniyelik yakıt vardı. 'Kartal indi' anonsu geldiğinde Houston'da kimsenin nefes almadığı söylenir. İnsanlığın en büyük maceraları hep son dakikada kazanılır.",
        minutes: 3,
      },
      {
        id: "talk-0720-2",
        category: "Karanlık Tarih",
        hook: "Hitler'i bir masa ayağı mı kurtardı?",
        body: "20 Temmuz 1944'te Stauffenberg bombayı masanın altına bırakıp çıktı. Bir subay, çantayı fark etmeden masa ayağının arkasına itti. Patlama odayı parçaladı, dört kişi öldü — Hitler hafif yaralı çıktı. Aynı gece darbe çöktü, 200'den fazla kişi idam edildi. Tarihin en ünlü 'birkaç santimetre' hikâyesi. Ya çanta o tarafta kalsaydı?",
        minutes: 3,
      },
      {
        id: "talk-0720-3",
        category: "Uzay",
        hook: "Ay'ın arkasındaki en yalnız insan",
        body: "Armstrong ve Aldrin Ay'dayken Michael Collins komuta modülünde yalnızdı. Her turda Ay'ın arkasına geçtiğinde telsiz kesiliyor, kimseyle konuşamıyordu. Ona 'Âdem'den beri en yalnız insan' dendi. Collins yıllar sonra yazdı: 'Yalnızlık hissetmedim, görevin parçasıydım.' Görünmeyen kahramanların günü.",
        minutes: 2,
      },
      {
        id: "talk-0720-4",
        category: "Uzay",
        hook: "20 Temmuz, Mars'ın da günü",
        body: "1976'da, Ay'a inişten tam 7 yıl sonra Viking 1 Mars'a indi ve kızıl gezegenden ilk net fotoğrafları gönderdi. Üzerindeki deneyler yaşam aradı: biri 'belki' dedi, diğerleri 'hayır'. Bilim hâlâ o 'belki'nin peşinde. Bugün Mars'ta çalışan araçların hepsi, Viking'in torunları.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-20": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Buz Baltası",
      text: "20 Ağustos 1940'ta Mexico City'de Ramón Mercader, Troçki'nin kafasına buz baltasıyla vurdu. Devrimin sürgündeki mimarı, ertesi gün öldü.",
    },
    events: [
      {
        id: "ev-0820-prag",
        year: 1968,
        text: "Varşova Paktı orduları, 'Prag Baharı'nı ezmek için Çekoslovakya'yı işgal etmeye başladı; 200 bini aşkın asker ülkeye girdi.",
        detail:
          "Alexander Dubček'in 'insancıl yüzü olan sosyalizm' reformları Moskova'yı rahatsız etmişti. 20 Ağustos gecesi başlayan işgalde silahlı direniş neredeyse hiç olmadı; Praglılar işgalcilerin önüne barikat değil, sokak tabelalarını sökerek karşı koydu. Reformlar donduruldu, ülke 21 yıl daha 'normalleşme' adı altında yaşadı.",
        category: "savas",
        matchKeys: ["çekoslovakya", "prag baharı", "varşova paktı"],
      },
      {
        id: "ev-0820-bruksel",
        year: 1914,
        text: "Alman orduları I. Dünya Savaşı'nın başında Belçika'nın başkenti Brüksel'e girdi.",
        detail:
          "Belçika'nın tarafsızlığını hiçe sayan Almanya, Schlieffen Planı gereği Fransa'ya ulaşmak için Belçika'dan geçiyordu. Brüksel'in işgali, İngiltere'nin savaşa girmesinin gerekçelerinden biri oldu ve savaşın cephesini büyüttü.",
        category: "savas",
        matchKeys: ["brüksel", "belçika"],
      },
    ],
    cases: [
      {
        id: "case-0820-trotsky",
        year: 1940,
        type: "suikast",
        title: "Buz Baltası: Troçki Suikastı",
        location: "Mexico City, Coyoacán — Troçki'nin villası",
        status: "ÇÖZÜLDÜ",
        summary:
          "NKVD ajanı Ramón Mercader, 'Jacques Mornard' kimliğiyle girdiği çalışma odasında Troçki'nin kafasına buz baltasıyla vurdu. Troçki ertesi gün öldü.",
        detail:
          "Stalin'in en büyük rakibi, sürgündeki devrimci Lev Troçki yıllardır ölüm listesindeydi. İlk girişim — ressam Siqueiros'un makineli tüfekli baskını — başarısız olmuştu. Mercader ise Troçki'nin sekreteriyle ilişki kurarak iki yılda içeriye sızdı. Baltaya rağmen Troçki saldırganın elini ısırdı ve korumalar yetişti. Mercader 20 yıl hapis yattı; çıkınca KGB tarafından 'Sovyetler Birliği Kahramanı' ilan edildi. 1978'de Havana'da öldü.",
        tags: ["NKVD", "Stalin", "Meksika", "soğuk savaş öncesi"],
      },
      {
        id: "case-0820-edmond",
        year: 1986,
        type: "katliam",
        title: "'Going Postal': Edmond Postanesi Katliamı",
        location: "Edmond, Oklahoma, ABD",
        status: "KAPANDI",
        summary:
          "Görevden çıkarılan posta işçisi Patrick Sherrill, eski iş yerine girip 14 kişiyi öldürdü, ardından intihar etti.",
        detail:
          "Sherrill sabah 07:00'de dağıtım toplantısı sırasında üç tabancayla ateş açtı. Olay, İngilizceye 'going postal' (çıldırmak) deyimini soktu ve ABD'de iş yeri şiddeti tartışmasını başlattı. Soruşturma, posta idaresindeki baskı kültürünü ve Sherrill'ın uyarı işaretlerinin görmezden gelindiğini ortaya koydu.",
        tags: ["iş yeri şiddeti", "ABD", "14 kayıp"],
      },
      {
        id: "case-0820-marchioness",
        year: 1989,
        type: "felaket",
        title: "Marchioness Faciası",
        location: "Londra, Thames Nehri",
        status: "KAPANDI",
        summary:
          "Gece yarısı eğlence teknesi Marchioness, kum gemisi Bowbelle ile çarpıştı; tekne 30 saniyede battı, 51 kişi öldü.",
        detail:
          "Doğum günü partisi için kiralanan teknede çoğu 20'li yaşlarında 131 kişi vardı. Çarpışma sonrası tekne iki kez döndü ve battı; karanlıkta nehirde kalanları kurtarmak için dakikalar kritiktü. Kimlik tespiti aylar sürdü. Soruşturma, Thames'te gözcü ve ışık eksikliğini belgeledi; facia nehir güvenliği kurallarını kökten değiştirdi.",
        tags: ["Londra", "denizcilik", "51 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0820-voyager",
        year: 1977,
        field: "Uzay",
        title: "Voyager 2, Cape Canaveral'dan fırlatıldı",
        summary:
          "İnsanlığın en uzak elçisi yolculuğuna başladı. Jüpiter, Satürn, Uranüs ve Neptün'ü yakından gören tek araç olan Voyager 2, bugün Güneş Sistemi'nin dışına çıktı ve hâlâ Dünya'ya veri gönderiyor.",
      },
      {
        id: "sci-0820-belka",
        year: 1960,
        field: "Uzay",
        title: "Belka ve Strelka, yörüngeden sağ dönen ilk canlılar oldu",
        summary:
          "Önceki gün fırlatılan Sovyet uydusu Korabl-Sputnik 2, köpekler Belka ve Strelka ile 20 Ağustos'ta Dünya'ya döndü. Yörüngeye çıkıp canlı dönen ilk memelilerdi; bir yıl sonra Yuri Gagarin'in yolunu açtılar.",
      },
    ],
    talk: [
      {
        id: "talk-0820-1",
        category: "Karanlık Tarih",
        hook: "Bir suikastın 26 saati: Troçki ve buz baltası",
        body: "1940 Mexico City. Ramón Mercader iki yıl boyunca Troçki'nin çevresine sızdı — sekreteriyle sevgili olarak. 20 Ağustos'ta çalışma odasına girdi, paltoşunun altındaki buz baltasını çıkardı ve vurdu. Troçki ölmedi; saldırganın elini ısırdı, bağırdı, 26 saat direndi. Mercader 20 yıl hapis yattı, çıkınca KGB kahramanı oldu. İdeolojilerin gölgesinde bir casusluk romanı gibi ama gerçek.",
        minutes: 3,
      },
      {
        id: "talk-0820-2",
        category: "Uzay",
        hook: "49 yıldır yolculukta: Voyager 2 bugün fırlatıldı",
        body: "1977'de bugün fırlayan Voyager 2, dört gezegeni ziyaret eden tek araç. Üzerinde bir 'Altın Plak' taşıyor: Beethoven, bir Türk halk türküsü, 55 dilde selam — insanlığın şişeye koyduğu mektup. Bugün Güneş Sistemi'nin dışında ve hâlâ sinyal gönderiyor; sinyalinin Dünya'ya ulaşması 19 saatten uzun sürüyor. Yalnızlığın en asil hâli.",
        minutes: 3,
      },
      {
        id: "talk-0820-3",
        category: "Uzay",
        hook: "İlk astronotlar iki köpekti — ve sağ döndüler",
        body: "1960'ta Belka ve Strelka, yörüngeden canlı dönen ilk memeliler oldu. Strelka'nın yavrularından Puşinka, Kennedy'lere hediye edildi — Soğuk Savaş'ın en tatlı diplomasisi. İnsanlar uzaya çıkmadan önce kapıyı köpekler açtı; çoğu geri dönemedi. Laika'yı da bugün anmış olalım.",
        minutes: 2,
      },
      {
        id: "talk-0820-4",
        category: "Karanlık Tarih",
        hook: "'Going postal' deyimi nereden geliyor?",
        body: "1986'da Oklahoma'da işten çıkarılan bir posta işçisi, eski iş yerinde 14 kişiyi öldürdü. Olay ABD'de 'going postal' deyimini doğurdu — 'çıldırma noktasına gelmek'. Ama asıl ders başka: soruşturma, adamın aylarca verdiği uyarı işaretlerinin görmezden gelindiğini gösterdi. Şiddet çoğu zaman bağıra bağıra gelir; duyan azdır.",
        minutes: 2,
      },
      {
        id: "talk-0820-5",
        category: "Kültür",
        hook: "Gerçek toplarla prömiyer: 1812 Uvertürü",
        body: "Çaykovski'nin 1812 Uvertürü, 1882'de bugün Moskova'da ilk kez çalındı. Eser, Napolyon'un Rusya'dan bozgununu anlatır ve finalinde gerçek top atışları yazılıdır. İlk yıllarda toplar şehirde zor çalındı; bugün havai fişek gösterilerinin vazgeçilmez müziği. Bir beste düşünün: kendi enstrümanı, savaşın kendisi.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "10-29": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "İki cumhuriyet, iki hikâye",
      text: "29 Ekim: 1923'te Ankara'da cumhuriyet ilan edildi; 1929'da New York borsası çöktü ve dünya Büyük Buhran'a sürüklendi.",
    },
    events: [
      {
        id: "ev-1029-cumhuriyet",
        year: 1923,
        text: "Türkiye'de cumhuriyet ilan edildi; Mustafa Kemal, Türkiye Cumhuriyeti'nin ilk cumhurbaşkanı seçildi.",
        detail:
          "Bir gün önce Çankaya'da akşam yemeğinde 'Efendiler, yarın cumhuriyeti ilan edeceğiz' diyen Mustafa Kemal, 29 Ekim gecesi TBMM'de yapılan oylamada 158 oyla cumhurbaşkanı seçildi. Karar, 101 pare top atışıyla duyuruldu. 29 Ekim ertesi yıl 'Cumhuriyet Bayramı' olarak resmî tatil ilan edildi.",
        category: "siyaset",
        matchKeys: ["cumhuriyet ilan", "cumhurbaşkanı seçil"],
      },
      {
        id: "ev-1029-borsa",
        year: 1929,
        text: "Wall Street'te 'Kara Salı': borsa çöküşünün en sert gününde milyarlarca dolar buharlaştı, Büyük Buhran'ın kapısı açıldı.",
        detail:
          "24 Ekim'deki 'Kara Perşembe'nin ardından 29 Ekim Salı günü 16 milyondan fazla hisse el değiştirdi; endeks tek günde yüzde 12'ye yakın düştü. Bankalar battı, işsizlik fırladı; buhran 1930'ların dünyasını ve siyasetini şekillendirdi. Kimi tarihçiler, bu çöküşün yükselen faşizmin zeminini hazırladığını savunur.",
        category: "felaket",
        matchKeys: ["borsa", "wall street", "buhran", "kara salı"],
      },
    ],
    cases: [
      {
        id: "case-1029-lionair",
        year: 2018,
        type: "felaket",
        title: "Lion Air 610: 737 MAX'in İlk Kazası",
        location: "Cava Denizi, Endonezya",
        status: "ÇÖZÜLDÜ",
        summary:
          "Yeni teslim edilen Boeing 737 MAX, kalkıştan 13 dakika sonra denize çakıldı: 189 kişi hayatını kaybetti.",
        detail:
          "Soruşturma, uçağın yeni MCAS sisteminin hatalı bir sensör verisiyle burnu defalarca aşağı bastırdığını ve pilotların sistemle boğuştuğunu ortaya koydu. Beş ay sonra Etiyopya'da aynı model bir uçak daha düştü; toplam 346 can gitti. 737 MAX dünya çapında 20 ay yere indirildi — havacılık tarihinin en büyük güven krizlerinden biri.",
        tags: ["havacılık", "737 MAX", "189 kayıp"],
      },
      {
        id: "case-1029-crash",
        year: 1929,
        type: "skandal",
        title: "Kara Salı: Bir Günde 14 Milyar Dolar",
        location: "New York Borsası, ABD",
        status: "KAPANDI",
        summary:
          "Spekülasyon balonu 29 Ekim 1929'da patladı; tek günde 14 milyar dolar (bugünkü karşılığı trilyonlarca) silindi.",
        detail:
          "1920'lerin 'kükreyen' ekonomisinde herkes borsadaydı; berber bile tüyo veriyordu. Bankalar krediyle hisse aldırıyordu. Balon patladığında panik satışları birbirini besledi; binlerce banka battı, işsizlik ABD'de yüzde 25'e çıktı. Buhran, sosyal devlet anlayışını ve modern finans düzenlemelerini doğurdu. Her 'bu sefer farklı' cümlesi, bir gün fatura çıkarır.",
        tags: ["ekonomi", "Büyük Buhran", "spekülasyon"],
      },
    ],
    science: [
      {
        id: "sci-1029-arpanet",
        year: 1969,
        field: "İnternet",
        title: "İlk ARPANET mesajı gönderildi: 'LO'",
        summary:
          "UCLA'den Stanford'a gönderilmek istenen mesaj 'LOGIN' olacaktı; sistem 'L' ve 'O' harflerinden sonra çöktü. İnternetin ilk kelimesi yarım kaldı: 'LO'. İki saat sonra tam mesaj iletildi. Bugün okuduğunuz her şey, o iki harfin torunu.",
      },
    ],
    talk: [
      {
        id: "talk-1029-1",
        category: "Teknoloji",
        hook: "İnternetin ilk mesajı: 'LO'",
        body: "29 Ekim 1969, gece 22:30. UCLA'de bir öğrenci, Stanford'daki bilgisayara 'LOGIN' yazmaya başladı: 'L' gitti, 'O' gitti... ve sistem çöktü. İnsanlığın ilk ağ mesajı 'LO' olarak kaldı. İki saat sonra denediler, oldu. Bugün günde 300 milyar mesaj atan tür, yolculuğuna iki harfle başladı. Sabırlı olun: her büyük şey, yarım kalan bir deneyle başlar.",
        minutes: 2,
      },
      {
        id: "talk-1029-2",
        category: "Ekonomi",
        hook: "Bir günde 14 milyar dolar buharlaşırsa",
        body: "1929'da bugün, New York borsasında panik zirve yaptı: 16 milyon hisse, tek günde yüzde 12 düşüş. Bankalar battı, kuyruklar uzadı, işsizlik dört kişiden birine çıktı. Berberin tüyo verdiği piyasa, bir neslin rüyasını yuttu. Ekonomi derslerinde hâlâ aynı soru sorulur: Balonu balonken kimse göremez mi? Görür de inanmak istemez.",
        minutes: 2,
      },
      {
        id: "talk-1029-3",
        category: "Tarih",
        hook: "'Yarın cumhuriyeti ilan edeceğiz'",
        body: "28 Ekim 1929 değil — 1928'de, Çankaya'da akşam yemeğinde Mustafa Kemal bu cümleyi kurdu. Ertesi gece TBMM oyladı; 158 oyun tamamı 'evet' dedi. Gece yarısına doğru 101 pare top atışı Ankara'yı inletti. Bir devletin yönetim biçimi, bir akşam yemeği cümlesiyle değişebiliyor. Kuruluş anları hep böyle: önce bir cümle, sonra bir ülke.",
        minutes: 2,
      },
      {
        id: "talk-1029-4",
        category: "Havacılık",
        hook: "Aynı uçağın iki kazası: 737 MAX dosyası",
        body: "29 Ekim 2018'de Lion Air 610, kalkıştan 13 dakika sonra Cava Denizi'ne düştü. Beş ay sonra Etiyopya'da birebir aynı senaryo yaşandı. Ortak nokta: MCAS adlı bir yazılımın, pilotlara haber vermeden uçağın burnunu bastırmasıydı. 346 can, 'sertifikasyon acelesi'nin faturası oldu. Teknolojide hız, bazen en pahalı maliyettir.",
        minutes: 3,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "11-10": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Dolmabahçe'de saat 09.05",
      text: "10 Kasım 1938, perşembe sabahı. Türkiye Cumhuriyeti'nin kurucusu Mustafa Kemal Atatürk, Dolmabahçe Sarayı'nda 57 yaşında hayata veda etti.",
    },
    events: [
      {
        id: "ev-1110-ataturk",
        year: 1938,
        text: "Mustafa Kemal Atatürk, Dolmabahçe Sarayı'nda saat 09.05'te yaşamını yitirdi; Türkiye ve dünya basını haberi manşetlerden duyurdu.",
        detail:
          "Aylardır siroz tedavisi gören Atatürk'ün ölümü, resmî tebliğle tüm yurtta ve dünyada yankılandı. Dolmabahçe'deki 71 numaralı odanın saati, sembolik olarak 9'u 5 geçeye ayarlandı. Naaşı önce Ankara'da Etnografya Müzesi'ne, 1953'te Anıtkabir'e nakledildi.",
        category: "siyaset",
        matchKeys: ["atatürk", "dolmabahçe"],
      },
    ],
    cases: [
      {
        id: "case-1110-fitzgerald",
        year: 1975,
        type: "kayıp",
        title: "Edmund Fitzgerald'ın Sessiz Batışı",
        location: "Superior Gölü, ABD-Kanada sınırı",
        status: "KAPANDI",
        summary:
          "226 metrelik maden cevheri gemisi, saatte 100 km'yi bulan rüzgârda telsiz çağrısı bile yapamadan battı; 29 kişilik mürettebattan kurtulan olmadı.",
        detail:
          "Gölde o gece dalgalar 10 metreyi aşıyordu. Fitzgerald son mesajında 'idare ediyoruz' demişti; saatler sonra radardan silindi. Gemi iki parça hâlinde 160 metre derinlikte bulundu. Batış nedeni —dev dalga mı, kapak arızası mı, sığlık teması mı— hâlâ tartışılıyor. Gordon Lightfoot'ın 'The Wreck of the Edmund Fitzgerald' şarkısı, olayı efsaneye dönüştürdü.",
        tags: ["denizcilik", "göl fırtınası", "29 kayıp", "gizem"],
      },
    ],
    science: [
      {
        id: "sci-1110-livingstone",
        year: 1871,
        field: "Keşif",
        title: "Stanley, Livingstone'u buldu",
        summary:
          "Gazeteci Henry Morton Stanley, iki yıldır haber alınamayan kâşif David Livingstone'u Tanganika Gölü kıyısındaki Ujiji kasabasında buldu. Rivayete göre sözü şuydu: 'Dr. Livingstone, sanırım?' 19. yüzyıl keşif çağının en ünlü karşılaşması.",
      },
    ],
    talk: [
      {
        id: "talk-1110-1",
        category: "Tarih",
        hook: "Saat 09.05'te duran şehir",
        body: "10 Kasım 1938, perşembe. Dolmabahçe Sarayı'nın 71 numaralı odasında saatler 9'u 5 geçiyordu. Türkiye'nin kurucusu 57 yaşında öldü. O gün radyolar yayını kesti, gazeteler siyah çıktı. Bugün hâlâ saat 09.05'te bir ülke aynı anda durur — trafikte, okulda, meydanda. Bir ulusun hafızasının en sessiz ve en güçlü ritüeli.",
        minutes: 3,
      },
      {
        id: "talk-1110-2",
        category: "Keşif",
        hook: "'Dr. Livingstone, sanırım?' — tarihin en ünlü iki kelimesi",
        body: "1871'de gazeteci Stanley, Afrika'nın içlerinde kaybolan kâşif Livingstone'u bulmak için binlerce kilometre yol yürüdü. Ujiji kasabasında karşısına çıkan yaşlı adama söylediği rivayet edilen cümle, keşif çağının simgesi oldu. Stanley bir muhabirdi; patronu ona 'git ve bul' demişti. Habercilik tarihinin en pahalı ve en başarılı görev emri.",
        minutes: 2,
      },
      {
        id: "talk-1110-3",
        category: "Gizem",
        hook: "İmdat çağrısı bile yapamadan batan gemi",
        body: "1975'te Superior Gölü'nde Edmund Fitzgerald, 29 kişilik mürettebatıyla dalgaların arasında kayboldu. Son telsiz mesajı: 'İdare ediyoruz.' Saatler sonra radardan silindi. Göl, kurbanlarını hiç geri vermedi — yasal olarak dalgıçlar hâlâ batığa giremiyor. Gordon Lightfoot'ın şarkısı olmasa belki kimse hatırlamayacaktı. Büyük göller, okyanuslardan daha çok can alır; kimse inanmaz ama öyle.",
        minutes: 3,
      },
      {
        id: "talk-1110-4",
        category: "Tarih",
        hook: "Aynı tarih, iki büyük hayat: 1483 ve 1938",
        body: "10 Kasım, takvimlerin ilginç kesişimi: Reform'un mimarı Martin Luther 1483'te bugün doğdu; Mustafa Kemal Atatürk 1938'de bugün öldü. Biri bir imparatorluğun dinî düzenini sarstı, diğeri bir imparatorluğun küllerinden cumhuriyet kurdu. Tarih bazen aynı yaprağa iki imza atar.",
        minutes: 1,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-31": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Geceyi tren seferleriyle aydınlatan adam",
      text: "31 Aralık 1879'da Edison, Menlo Park'taki laboratuvarında ampulünü halka gösterdi; ziyaretçiler için özel tren seferleri kondu.",
    },
    events: [
      {
        id: "ev-1231-yeltsin",
        year: 1999,
        text: "Rusya Devlet Başkanı Boris Yeltsin görevinden istifa etti; başbakan Vladimir Putin geçici devlet başkanı oldu.",
        detail:
          "Yılbaşı konuşmasında 'Rusya'dan özür diliyorum' diyerek istifa eden Yeltsin, koltuğu başbakanı Putin'e bıraktı. Üç ay sonraki seçimi kazanan Putin, o günden beri Rusya siyasetinin merkezinde. Bir istifa konuşması, 21. yüzyılın en uzun iktidar hikâyelerinden birini başlattı.",
        category: "siyaset",
        matchKeys: ["yeltsin", "istifa"],
      },
    ],
    cases: [
      {
        id: "case-1231-shanghai",
        year: 2014,
        type: "felaket",
        title: "Şanghay Yılbaşı İzdihamı",
        location: "Şanghay, Çin — Chen Yi Meydanı",
        status: "KAPANDI",
        summary:
          "Yılbaşı kutlaması için toplanan kalabalıkta çıkan izdihamda 36 kişi öldü, 49 kişi yaralandı; kurbanların çoğu 20'li yaşlarındaydı.",
        detail:
          "Bund kıyısındaki kutlamaya beklenenden çok daha büyük bir kalabalık gelmişti; merdivenlerde başlayan sıkışma dalga dalga büyüdü. Soruşturma, yetersiz güvenlik planlamasını ve kalabalık yönetimi eksikliğini belgeledi. Dünya, kalabalık izdihamlarının saniyeler içinde ölümcüle dönebildiğini bir kez daha gördü.",
        tags: ["izdiham", "yılbaşı", "36 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-1231-edison",
        year: 1879,
        field: "Teknoloji",
        title: "Edison, ampulü halka tanıttı",
        summary:
          "Thomas Edison, Menlo Park'taki laboratuvarının bahçesini yüzlerce ampulle donatıp kapılarını açtı. Ziyaretçi akını öyle büyüktü ki demiryolu şirketi özel tren seferleri koydu. Ampulün kendisi ekimden beri çalışıyordu; 31 Aralık, elektrik çağının halkla buluştuğu geceydi.",
      },
      {
        id: "sci-1231-times",
        year: 1904,
        field: "Kültür",
        title: "Times Meydanı'nda ilk yılbaşı gecesi",
        summary:
          "New York Times'ın yeni binasının önünde düzenlenen ilk yılbaşı kutlaması, bugün milyonların izlediği geleneği başlattı. Meşhur 'ball drop' — ışıklı topun direkten indirilmesi — üç yıl sonra, 1907'de eklendi.",
      },
    ],
    talk: [
      {
        id: "talk-1231-1",
        category: "Teknoloji",
        hook: "Geceyi aydınlatan tren seferleri",
        body: "1879'un son gecesinde New York'lular Menlo Park'a akın etti: Edison laboratuvarının bahçesini ampullerle donatmıştı. O kadar insan geldi ki demiryolu özel sefer koydu. İnsanlar ilk kez 'geceyi yenen ışığı' çıplak gözle gördü. Gaz lambası çağı o gece fiilen bitti. Bir teknolojinin kalabalıkları trenlerle taşıdığı anlar nadirdir — iPhone lansmanını düşünün, aynı his.",
        minutes: 2,
      },
      {
        id: "talk-1231-2",
        category: "Kültür",
        hook: "Yılbaşının başkenti nasıl doğdu?",
        body: "Times Meydanı'ndaki ilk yılbaşı kutlaması 1904'te yapıldı — gazete binasının taşınması bahanesiyle. Işıklı top 1907'de eklendi; o yıl top, demir ve ampullerden yapılmıştı, 320 kiloydu. Bugün kristal kaplı, 5.600 kiloluk bir top iniyor ve 1 milyar kişi izliyor. Bir PR fikri, 120 yılda gezegenin ritüeline dönüşebilir.",
        minutes: 2,
      },
      {
        id: "talk-1231-3",
        category: "Teknoloji",
        hook: "Y2K: dünyanın sonu gelmedi ama fatura geldi",
        body: "2000'e girerken bilgisayarların iki haneli yıl kaydı yüzünden medeniyetin çökeceğine inanılıyordu. Uçaklar düşecek, bankalar sıfırlanacaktı. Dünya 300 milyar dolar harcadı, gece yarısı... hiçbir şey olmadı. Başarı mı, gereksiz panik mi? Tartışma hâlâ sürüyor — çünkü hiçbir şey olmamasının nedeni, o paranın harcanmasıydı. 2038 problemi ise gerçekten kapıda.",
        minutes: 2,
      },
      {
        id: "talk-1231-4",
        category: "Dünya",
        hook: "Üç saatlik istifa: Yeltsin ve Putin'e kalan koltuk",
        body: "31 Aralık 1999, öğle saatlerinde Yeltsin kameraya çıktı: 'Ben gidiyorum... Rusya'dan özür diliyorum.' Koltuğu başbakanı Putin'e bıraktı. Üç ay sonraki seçimi Putin kazandı; o günden beri Rusya'nın lideri. Bir yılbaşı konuşması, 21. yüzyılın en uzun iktidar hikâyelerinden birinin ilk cümlesiydi. İstifalar bazen son değil, başlangıçtır.",
        minutes: 2,
      },
    ],
  },
};

export function curatedKey(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
