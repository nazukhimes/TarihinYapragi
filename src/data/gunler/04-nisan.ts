import type { CuratedDay } from "../types";

export const NISAN: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "04-12": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "108 dakikada bir tur, sonsuza bir sıçrama",
      text: "12 Nisan 1961'de Yuri Gagarin, Vostok 1 kapsülüyle Dünya'nın etrafında tek bir tur attı. 108 dakika sürdü — insanlığın uzaya çıkan ilk temsilcisiydi.",
    },
    events: [
      {
        id: "ev-0412-gagarin",
        year: 1961,
        text: "Sovyet kozmonot Yuri Gagarin, Vostok 1 aracıyla uzaya çıkan ilk insan oldu; Dünya'yı 108 dakikada bir kez turladı.",
        detail:
          "Baykonur Kozmodromu'ndan fırlatılan Gagarin, saatte 28.000 km hıza ulaşıp 327 km yüksekliğe çıktı. İniş sırasında kapsülden fırlayıp paraşütle Sovyet topraklarına indi. Uçuş öncesi söylediği rivayet edilen 'Haydi gidelim!' sözü, uzay çağının açılış cümlesi olarak tarihe geçti. 2011'de Birleşmiş Milletler, 12 Nisan'ı Uluslararası İnsanlı Uzay Uçuşu Günü ilan etti.",
        category: "kesif",
        matchKeys: ["gagarin", "vostok 1"],
      },
    ],
    cases: [
      {
        id: "case-0412-rocksprings",
        year: 1927,
        type: "felaket",
        title: "Rocksprings Kasırgası",
        location: "Rocksprings, Teksas, ABD",
        status: "KAPANDI",
        summary:
          "F5 şiddetinde bir kasırga, küçük bir Teksas kasabasının neredeyse tamamını yerle bir etti; nüfusun onda birinden fazlası hayatını kaybetti.",
        detail:
          "Kasırga, kasabadaki 247 binadan 235'ini yıktı veya ağır hasara uğrattı; okul, tam ders saatinde çökünce çocuklar arasında da can kaybı yaşandı. 74 kişi öldü, 200'den fazla kişi yaralandı — küçük kasabanın nüfusu düşünüldüğünde ölüm oranı, ABD kasırga tarihinin en yıkıcılarından biri sayılır. Kasaba, kayıtlı meteorolojik uyarı sistemlerinin henüz kurulmadığı bir dönemde, hiçbir hazırlık yapamadan kasırgayla karşılaştı.",
        tags: ["Teksas", "kasırga", "74 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0412-salk",
        year: 1955,
        field: "Tıp",
        title: "Çocuk felci aşısı güvenli ilan edildi",
        summary:
          "Dr. Jonas Salk'ın geliştirdiği çocuk felci (polio) aşısının geniş çaplı denemelerde güvenli ve etkili olduğu bugün duyuruldu. Salk, aşının patentini almayı reddederek 'Güneşi patentleyebilir misiniz?' demişti; karşılıksız paylaşılan aşı, dünya çapında milyonlarca çocuğu felçten kurtardı.",
      },
    ],
    talk: [
      {
        id: "talk-0412-1",
        category: "Uzay",
        hook: "108 dakika, bir tur, bir çağın başlangıcı",
        body: "12 Nisan 1961'de Gagarin, Vostok 1'e bindiğinde kimse dönüşünün nasıl olacağını tam bilmiyordu — bazı mühendisler kapsülün havada parçalanmasından korkuyordu. Saatte 28.000 km hızla Dünya'yı bir kez turladı, sonra kapsülden fırlayıp paraşütle indi. Bir tarlada onu karşılayan köylü kadın, uzay giysili adamı görünce önce korkup kaçtı. Tarihin en büyük anlarından biri, bir tarlada bir yanlış anlaşılmayla noktalandı.",
        minutes: 3,
      },
      {
        id: "talk-0412-2",
        category: "Karanlık Tarih",
        hook: "Ders saatinde çöken bir okul",
        body: "1927'de Teksas'ın küçük kasabası Rocksprings'e uyarısız bir F5 kasırga çarptı; 247 binadan 235'i yıkıldı. Okul tam ders saatinde çöktü, çocuklar enkaz altında kaldı. Kasabanın nüfusunun onda birinden fazlası tek bir öğleden sonrada öldü. Bugün meteoroloji uydularının dakikalar önceden verdiği uyarı, o gün hiç yoktu — gökyüzü sessizce en kötüsünü hazırlıyordu.",
        minutes: 2,
      },
      {
        id: "talk-0412-3",
        category: "Bilim",
        hook: "'Güneşi patentleyebilir misiniz?'",
        body: "1955'te bugün, çocuk felci aşısının güvenli olduğu açıklandığında Amerika sokaklara döküldü — kiliseler çan çaldı. Aşıyı geliştiren Jonas Salk, patent almayı reddetti; gazeteciye 'Aşının patenti kimde?' sorusuna 'Güneşi patentleyebilir misiniz?' diye cevap verdi. O kararı, tahminen milyarlarca dolarlık bir geliri feda etti ama aşıyı dünyanın her yerine karşılıksız ulaştırdı.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "04-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Batmaz denilen gemi",
      text: "14 Nisan 1912 gecesi saat 23.40'ta Titanic bir buzdağına çarptı. İki saat kırk dakika sonra, 'batmaz' denilen gemi Kuzey Atlantik'in buzlu sularında kayboldu.",
    },
    events: [
      {
        id: "ev-0414-titanic",
        year: 1912,
        text: "RMS Titanic, Southampton'dan New York'a ilk seferinde bir buzdağına çarptı; gemi birkaç saat içinde batacaktı.",
        detail:
          "Gemi, o gün altı ayrı buzdağı uyarısı almıştı ama saatte 22 knot hızla seyretmeye devam ediyordu. Çarpma, geminin sancak tarafını yırtıp altı su geçirmez bölmeden altısını birden su almaya başlattı — tasarım yalnızca dört bölmenin aynı anda dolmasına dayanacak şekildeydi. Can filikaları toplam yolcu sayısının yarısını bile taşıyamayacak kapasitedeydi.",
        category: "felaket",
        matchKeys: ["titanic", "buzdağı"],
      },
    ],
    cases: [
      {
        id: "case-0414-titanic",
        year: 1912,
        type: "felaket",
        title: "Titanic'in Batışı",
        location: "Kuzey Atlantik, Newfoundland açıkları",
        status: "KAPANDI",
        summary:
          "2.224 yolcu ve mürettebattan 1.500'ü aşkını hayatını kaybetti; kayıp can filikası kapasitesi ve düzensiz tahliye, felaketin ölçeğini büyüttü.",
        detail:
          "Gemi 15 Nisan sabahı saat 02.20'de tamamen sulara gömüldü. Can filikalarının çoğu yarı dolu indirildi; ilk sınıf yolcuların büyük bölümü kurtulurken güvertesi geç açılan alt sınıf yolcuların ölüm oranı çok daha yüksekti. Enkaz, 1985'te derin deniz robotlarıyla bulunana kadar 73 yıl boyunca kayıptı. Facia, denizcilikte can filikası kapasitesi, 24 saat telsiz nöbeti ve buzdağı devriyesi gibi kalıcı güvenlik kurallarını doğurdu.",
        tags: ["denizcilik", "buzdağı", "1.500 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0414-genom",
        year: 2003,
        field: "Genetik",
        title: "İnsan Genom Projesi tamamlandı",
        summary:
          "13 yıl süren uluslararası bir çabanın ardından insan DNA'sının tamamına yakını haritalandı. Proje, insan hastalıklarının genetik kökenini anlamaktan kişiye özel tıbba kadar uzanan bir alanın kapısını açtı; 3 milyar 'harf'lik bu haritanın çıkarılması, başlangıçta 15 yıl sürmesi beklenirken hedeflenenden erken bitirildi.",
      },
    ],
    talk: [
      {
        id: "talk-0414-1",
        category: "Karanlık Tarih",
        hook: "Altı uyarı, bir çarpışma, iki saat kırk dakika",
        body: "14 Nisan 1912'de Titanic o gün altı ayrı buzdağı uyarısı aldı ama hızını düşürmedi. Gece 23.40'ta çarpma anında kaptan köşkü sadece birkaç saniye önce buzdağını fark etti. Gemi iki saat kırk dakikada battı; can filikaları yarısı bile dolu değildi. 1.500'den fazla insan Kuzey Atlantik'in buzlu sularında can verdi. 'Batmaz' sıfatı, tarihin en pahalı yanılgılarından biri oldu.",
        minutes: 3,
      },
      {
        id: "talk-0414-2",
        category: "Gizem",
        hook: "73 yıl kayıp kalan enkaz",
        body: "Titanic'in enkazı, 1985'te derin deniz robotlarıyla bulunana kadar tam 73 yıl okyanusun 3.800 metre altında kayıptı. Bulununca gemi ikiye ayrılmış hâldeydi — çoğu kişinin sandığı gibi tek parça batmamıştı. Facia, denizcilikte can filikası zorunluluğunu ve 24 saat telsiz nöbetini doğurdu. Bir trajedi, bazen ancak onu tekrarlamamak için kural hâline gelir.",
        minutes: 2,
      },
      {
        id: "talk-0414-3",
        category: "Bilim",
        hook: "3 milyar harflik bir kitap okundu",
        body: "2003'te bugün, insan DNA'sının neredeyse tamamı okunmuş oldu — 3 milyar 'harf'lik bir kod. Proje başlarken 15 yıl sürmesi bekleniyordu, erken bitti. Bugün bir hastalığın genetik kökenini araştırmak, kişiye özel ilaç geliştirmek, hatta soy ağacı çıkarmak bu haritaya dayanıyor. İnsanlık kendi talimat kitabını ilk kez baştan sona okumuş oldu.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "04-15": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "800 yıllık çatı, bir öğleden sonra kül oldu",
      text: "15 Nisan 2019 akşamı Notre-Dame Katedrali'nin çatısı alevler içinde çöktü. Paris, sekiz asırlık bir simgenin gözlerinin önünde yanışını izledi.",
    },
    events: [
      {
        id: "ev-0415-notredame",
        year: 2019,
        text: "Paris'teki Notre-Dame Katedrali'nde çıkan yangın, tarihi kilisenin ahşap çatısını ve ünlü sivri kulesini yok etti; bina restorasyon çalışması sırasında alev almıştı.",
        detail:
          "Yangın, akşam saatlerinde restorasyon iskelesinin bulunduğu çatı katından başladı; 850 yıllık ahşap kirişlerden oluşan çatı — 'orman' lakaplı bölüm — hızla alev aldı. İtfaiyeciler, taş duvarların ve kule çanlarının çökmesini önlemek için saatlerce mücadele etti; kulenin kendisi gözler önünde çökerken görüntü dünya çapında canlı yayınlandı. Fransa, yeniden inşa için milyarlarca euro bağış topladı; katedral beş yıl sonra, 2024'te yeniden ibadete açıldı.",
        category: "felaket",
        matchKeys: ["notre-dame", "paris", "yangın"],
      },
    ],
    cases: [
      {
        id: "case-0415-notredame",
        year: 2019,
        type: "felaket",
        title: "Notre-Dame Yangını",
        location: "Paris, Fransa",
        status: "ÇÖZÜLDÜ",
        summary:
          "850 yıllık katedralin çatısı ve sivri kulesi yangında tamamen yok oldu; içindeki paha biçilmez sanat eserlerinin çoğu itfaiyecilerin fedakârlığıyla kurtarıldı.",
        detail:
          "Soruşturma, yangının kaza sonucu — muhtemelen elektrik kontağı ya da söndürülmemiş bir sigara — çıktığı sonucuna vardı; kundaklama ihtimali dışlandı. Katedralin dikenli taç ve tunik gibi kutsal emanetleri, itfaiyecilerin alevlerin içinden çıkardığı eserler arasındaydı. Facia, dünya çapında tarihi yapıların yangın güvenliği standartlarının yeniden gözden geçirilmesine yol açtı; restorasyon, orijinal ortaçağ tekniklerini kullanan zanaatkârlarla beş yıl sürdü.",
        tags: ["Paris", "kültürel miras", "yangın"],
      },
    ],
    science: [
      {
        id: "sci-0415-davinci",
        year: 1452,
        field: "Sanat ve Bilim",
        title: "Leonardo da Vinci doğdu",
        summary:
          "Ressam, mühendis, anatomist ve mucit — da Vinci, sanat ile bilimi ayırmayan bir zihniyetin en büyük örneğiydi. Defterlerinde uçan makineler, zırhlı araçlar ve su çarkları tasarladı; insan vücudunu anlamak için gizlice cesetler kesip inceledi. Yaşadığı dönemde çoğu fikri hiç üretilmedi, ama yüzyıllar sonra mühendisler onun taslaklarının işe yaradığını doğruladı.",
      },
    ],
    talk: [
      {
        id: "talk-0415-1",
        category: "Karanlık Tarih",
        hook: "Paris, sekiz asırlık bir çatının çöküşünü izledi",
        body: "2019'da bugün, restorasyon iskelesinden başladığı düşünülen bir kıvılcım, Notre-Dame'ın 850 yıllık ahşap çatısını sardı. Kalabalık, kulenin alevler içinde çökmesini sokaklarda ağlayarak izledi. İtfaiyeciler saatlerce mücadele edip taş yapıyı ve içindeki eserleri kurtardı. Fransa milyarlarca euro toplayıp beş yılda yeniden inşa etti. Bazı yapılar, yıkılışlarıyla bile bir milletin neyi önemsediğini gösterir.",
        minutes: 3,
      },
      {
        id: "talk-0415-2",
        category: "Bilim",
        hook: "Sanat ile bilimi hiç ayırmayan bir zihin",
        body: "Bugün doğan Leonardo da Vinci, defterlerine hem Mona Lisa'nın taslaklarını hem uçan makine tasarımlarını çiziyordu. İnsan anatomisini anlamak için cesetleri gizlice kesip inceledi — kilisenin izin vermediği bir araştırmaydı bu. Fikirlerinin çoğu kendi zamanında hiç üretilmedi; yüzyıllar sonra mühendisler taslaklarını test edip çoğunun gerçekten çalıştığını kanıtladı.",
        minutes: 2,
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
    cases: [
      {
        id: "case-0423-soyuz1",
        year: 1967,
        type: "felaket",
        title: "Soyuz 1: 'Bu Şeytan Gemisi'",
        location: "Orenburg yakınları, SSCB",
        status: "ÇÖZÜLDÜ",
        summary:
          "Sovyet kozmonot Vladimir Komarov, teknik arızalarla dolu yeni Soyuz kapsülüyle uzaya çıktı; dönüş sırasında paraşütün açılmaması sonucu hayatını kaybetti — uzayda ölen ilk insan oldu.",
        detail:
          "Kapsül fırlatılır fırlatılmaz güneş panellerinden biri açılmadı, enerji sorunları başladı; mühendislerin görevi erken sonlandırma çağrısına rağmen iniş de sorunsuz geçmedi. Ana paraşüt açılmayınca Komarov yedek paraşütü devreye soktu, ama halatlar birbirine dolanıp o da açılmadı. Kapsül, saatte yüzlerce kilometre hızla yere çakıldı. Sovyet mühendislerinin aceleye getirilen tasarımı bildiği, ama siyasi baskı yüzünden görevi erteleyemediği sonradan ortaya çıktı.",
        tags: ["SSCB", "uzay programı", "Komarov"],
      },
    ],
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
      {
        id: "talk-0423-5",
        category: "Karanlık Tarih",
        hook: "Mühendisler biliyordu, kimse görevi durduramadı",
        body: "1967'de bugün fırlatılan Soyuz 1, daha yörüngeye çıkar çıkmaz arıza vermeye başladı. Kozmonot Komarov'un iniş şansı, ana paraşütün açılmamasıyla yedek paraşüte kaldı — o da halatların dolanmasıyla işe yaramadı. Sovyet mühendislerinin aracın hazır olmadığını bildiği, ama siyasi takvimin ertelemeye izin vermediği sonradan anlaşıldı. Uzayda ölen ilk insan, bir mühendislik hatasından değil, bir zamanlama baskısından gitti.",
        minutes: 3,
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
        matchKeys: ["hubble"],
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
  "04-26": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "4. reaktör",
      text: "26 Nisan 1986 gece yarısından sonra Çernobil'in 4. reaktörü patladı. Sovyet yetkilileri günlerce sessiz kaldı; radyoaktif bulut o sırada çoktan Avrupa'nın üzerindeydi.",
    },
    events: [
      {
        id: "ev-0426-cernobil",
        year: 1986,
        text: "Ukrayna'daki Çernobil Nükleer Santrali'nin 4 numaralı reaktörü, güvenlik testi sırasında yaşanan tasarım ve insan hatası zinciri sonucu patladı.",
        detail:
          "Ekip, olası bir elektrik kesintisinde soğutma pompalarının ne kadar süre çalışabileceğini test ediyordu; güvenlik sistemleri bu test için devre dışı bırakılmıştı. Patlama, Hiroşima'ya atılan bombanın tahminen 50 katı radyoaktif madde saçtı. Uluslararası Nükleer Olay Ölçeği'nde en yüksek seviye olan 7 ile derecelendirilen tek iki kazadan biridir (diğeri Fukuşima). 1986-87'de 200.000 kişi temizlik çalışmasına katıldı.",
        category: "felaket",
        matchKeys: ["çernobil", "reaktör"],
      },
    ],
    cases: [
      {
        id: "case-0426-tashkent",
        year: 1966,
        type: "felaket",
        title: "Taşkent Depremi",
        location: "Taşkent, Özbekistan SSC",
        status: "KAPANDI",
        summary:
          "7,5 büyüklüğündeki deprem, Orta Asya'nın en büyük şehirlerinden Taşkent'in büyük bölümünü haritadan sildi; can kaybı görece az olsa da 300.000 kişi evsiz kaldı.",
        detail:
          "Depremin merkez üssü şehir merkezinin tam altındaydı; kerpiç ve tuğla yapılardan oluşan eski şehir neredeyse tamamen çöktü. Resmî can kaybı rakamları düşük gösterilse de (SSCB yetkilileri felaketleri hafifletme eğilimindeydi) yüz binlerce kişi evsiz kaldı. Sovyet hükümeti şehri, birlik cumhuriyetlerinden gelen işçilerle hızla yeniden inşa etti; bugünkü Taşkent'in geniş caddeleri ve Sovyet mimarisi büyük ölçüde bu yeniden yapılanmanın izlerini taşıyor.",
        tags: ["deprem", "Özbekistan", "Sovyetler Birliği"],
      },
    ],
    science: [
      {
        id: "sci-0426-audubon",
        year: 1785,
        field: "Doğa Bilimi",
        title: "John James Audubon doğdu",
        summary:
          "Amerika'nın kuşlarını gerçek boyutlarında, doğal ortamlarında resmeden Audubon, 'Amerika Kuşları' adlı devasa eseriyle doğa illüstrasyonunu bilimsel bir disipline dönüştürdü. Onlarca yıl süren gözlem ve avcılık gezileriyle o dönem bilinmeyen onlarca türü belgeledi; adı bugün hâlâ dünyanın en büyük kuş koruma örgütlerinden birine verilir.",
      },
    ],
    talk: [
      {
        id: "talk-0426-1",
        category: "Karanlık Tarih",
        hook: "Bir test, bir kıtayı radyasyona buladı",
        body: "1986'da bugün, Çernobil'in 4. reaktöründe basit bir güvenlik testi felakete dönüştü. Güvenlik sistemleri kapalıyken yaşanan patlama, Hiroşima bombasının 50 katı radyoaktif madde saçtı. Sovyet yetkilileri günlerce açıklama yapmadı; radyasyon bulutu İsveç'te bir santralde alarm çaldırınca dünya gerçeği öğrendi. 200.000 kişi temizlik için bölgeye gönderildi — hangi bedeli ödediklerini çoğu yıllar sonra anladı.",
        minutes: 3,
      },
      {
        id: "talk-0426-2",
        category: "Karanlık Tarih",
        hook: "Bir şehrin altı, gece yarısı çöktü",
        body: "1966'da Taşkent'in altında sarsılan toprak, kerpiç evlerden oluşan koca bir şehri dakikalar içinde yıktı. Resmî can kaybı rakamları düşük tutuldu ama 300.000 kişi evsiz kaldı. Sovyet hükümeti şehri baştan inşa etti — bugünkü geniş bulvarlar ve beton bloklar o depremin mirası. Bazı şehirlerin bugünkü yüzü, geçirdikleri felaketin doğrudan izidir.",
        minutes: 2,
      },
      {
        id: "talk-0426-3",
        category: "Bilim",
        hook: "Kuşları resmetmek için ormanda yıllarca yaşayan adam",
        body: "John James Audubon, Amerika'nın kuşlarını gerçek boyutunda resmetmek için yıllarca ormanlarda dolaştı, binlerce kilometre yol yürüdü. Ortaya çıkan 'Amerika Kuşları' kitabı, sanat ile bilimi birleştiren bir başyapıt oldu. Bugün adı, kıtanın en büyük kuş koruma derneklerinden birinde yaşıyor — bir ressamın tuvali, iki asır sonra hâlâ doğayı koruyor.",
        minutes: 2,
      },
    ],
  },
};
