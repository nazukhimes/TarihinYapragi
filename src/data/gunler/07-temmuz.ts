import type { CuratedDay } from "../types";

export const TEMMUZ: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "07-04": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Tanrı parçacığı bulundu",
      text: "4 Temmuz 2012'de CERN, kütlenin kaynağı sayılan Higgs bozonuna karşılık gelen bir parçacık bulduğunu duyurdu. Elli yıl önce yalnızca kâğıt üzerinde var olan bir tahmin, koca bir dedektörde ışığa çıktı.",
    },
    events: [
      {
        id: "ev-0704-higgs",
        year: 2012,
        text: "CERN'deki Büyük Hadron Çarpıştırıcısı'nın ATLAS ve CMS deneyleri, Higgs bozonuyla uyumlu yeni bir parçacık keşfedildiğini duyurdu.",
        detail:
          "1964'te Peter Higgs ve birkaç fizikçinin bağımsız olarak öne sürdüğü teoriye göre, evrendeki parçacıklar kütlelerini görünmez bir alanla etkileşerek kazanıyordu; bu alanın kendi parçacığı hiç gözlemlenmemişti. Çarpıştırıcı, protonları ışık hızına yakın hızlarda çarpıştırıp trilyonlarca veri noktasını taradı. Ölçüm, sonucun rastgele çıkma ihtimalinin 3,5 milyonda bir olduğu 'beş sigma' güven eşiğine ulaştı.",
        category: "bilim",
        matchKeys: ["higgs bozonu", "cern"],
      },
      {
        id: "ev-0704-pathfinder",
        year: 1997,
        text: "NASA'nın Mars Pathfinder aracı, gezegene hava yastıklarıyla sekerek indi; beraberindeki küçük Sojourner robotu, Mars yüzeyinde hareket eden ilk araç oldu.",
        detail:
          "Pathfinder, pahalı roket motorlu iniş yerine ucuz ve riskli bir yöntem denedi: hava yastıklarıyla sarılıp yüzeye seke seke indi. Görev, NASA'nın 'daha hızlı, daha ucuz, daha iyi' felsefesinin ilk büyük başarısı oldu ve sonraki tüm Mars gezici programlarının yolunu açtı.",
        category: "kesif",
        matchKeys: ["pathfinder", "mars", "sojourner"],
      },
    ],
    cases: [
      {
        id: "case-0704-bourgogne",
        year: 1898,
        type: "felaket",
        title: "La Bourgogne Faciası",
        location: "Sable Adası açıkları, Kuzey Atlantik",
        status: "KAPANDI",
        summary:
          "Fransız transatlantik La Bourgogne, sisli bir sabah İngiliz yelkenli Cromartyshire ile çarpışıp battı; yolcular arasında efsanevi Türk güreşçi Koca Yusuf da vardı.",
        detail:
          "Çarpışmanın ardından gemi yarım saat içinde battı; can filikalarına hücum sırasında yaşanan panik, kazayı daha da ölümcül hale getirdi — hayatta kalanlar arasında filikalara ulaşmak için çıkan boğuşmaları anlatanlar oldu. Koca Yusuf'un ölümüyle ilgili anlatılar çelişkilidir: kimileri filikayı batıracağı endişesiyle suya bırakıldığını, kimileri boğulanlar arasında olduğunu söyler. Facia, o dönemin en ölümcül transatlantik kazalarından biri olarak deniz güvenliği kurallarının sıkılaştırılmasına yol açtı.",
        tags: ["denizcilik", "Koca Yusuf", "Kuzey Atlantik"],
      },
    ],
    science: [
      {
        id: "sci-0704-higgs",
        year: 2012,
        field: "Parçacık Fiziği",
        title: "50 yıllık bir tahmin doğrulandı",
        summary:
          "Higgs bozonu, Standart Model'in son eksik parçasıydı; keşfi parçacık fiziğinde onlarca yıllık bir arayışı kapattı. Peter Higgs, teorisini ortaya attığında 34 yaşındaydı; parçacığın bulunduğu duyurunun yapıldığı salonda, 83 yaşında gözyaşlarını tutamadı.",
      },
    ],
    talk: [
      {
        id: "talk-0704-1",
        category: "Bilim",
        hook: "83 yaşında, kendi adını taşıyan parçacığı gördü",
        body: "1964'te 34 yaşındaki bir fizikçi, parçacıkların nasıl kütle kazandığını açıklayan bir teori önerdi. Kimse ona inanmadı, makalesi bile ilk başta reddedildi. 2012'de, 83 yaşında, CERN'in duyuru salonunda oturuyordu; deneyler onun adını taşıyan parçacığı bulduklarını açıkladığında gözyaşlarını tutamadı. Bilimde bazı sorular, cevaplarını görmek için ömür boyu beklemeyi gerektirir.",
        minutes: 3,
      },
      {
        id: "talk-0704-2",
        category: "Uzay",
        hook: "Hava yastığıyla Mars'a inen robot",
        body: "1997'de Pathfinder, pahalı roket motorları yerine dev hava yastıklarına sarılıp Mars yüzeyine sekerek indi — riskli ama ucuz bir kumar. İçindeki küçük Sojourner robotu, kızıl gezegende hareket eden ilk araç oldu. Bugün Mars'ta gezen her modern robotun soy kütüğü, o gün sekerek inen küçük hava yastığına dayanıyor.",
        minutes: 2,
      },
      {
        id: "talk-0704-3",
        category: "Karanlık Tarih",
        hook: "Bir güreş efsanesi, Atlantik'in dibinde kaldı",
        body: "Amerika'da 'Korkunç Türk' diye anılan güreşçi Koca Yusuf, 1898'de bugün yurda dönerken bindiği gemi sisli bir sabah başka bir gemiyle çarpıştı. Yarım saat içinde batan gemide can filikalarına hücum, kazayı daha da öldürücü kıldı. Onun ölümüyle ilgili anlatılar bugün bile çelişkili — bazıları kahramanca, bazıları trajik bir kaza olarak aktarır. Efsaneler bazen ölümün ayrıntısını değil, hikâyesini korur.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "07-13": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "16 saatte 1,9 milyar dolar",
      text: "13 Temmuz 1985'te Londra ve Philadelphia'daki iki stadyum, uydu bağlantısıyla birbirine ve 150'den fazla ülkeye bağlandı. Live Aid, açlığa karşı tarihin en büyük konser maratonuydu.",
    },
    events: [
      {
        id: "ev-0713-liveaid",
        year: 1985,
        text: "Müzisyen Bob Geldof'un örgütlediği Live Aid konseri, Etiyopya'daki kıtlığa yardım toplamak için Londra ve Philadelphia'da eşzamanlı düzenlendi; dünya çapında 1,5 milyar kişi izledi.",
        detail:
          "Queen'in performansı, festivalin en unutulmaz anı olarak tarihe geçti — Freddie Mercury'nin 72.000 kişilik Wembley Stadyumu'nu tek bir 'eyoh' nidasıyla yönettiği görüntüler bugün hâlâ paylaşılıyor. Konser 16 saat sürdü, aralarında Queen, U2, David Bowie, Elton John ve Paul McCartney'in de olduğu düzinelerce sanatçı sahne aldı. Etkinlik, dünya çapında 1,9 milyar dolar bağış topladı.",
        category: "kultur",
        matchKeys: ["live aid", "bob geldof", "wembley"],
      },
    ],
    cases: [
      {
        id: "case-0713-senirkent",
        year: 1995,
        type: "felaket",
        title: "Senirkent Sel Faciası",
        location: "Senirkent, Isparta",
        status: "KAPANDI",
        summary:
          "Şiddetli yağış sonucu dağdan kopan çamur ve su kütlesi Senirkent ilçesini vurdu; resmî rakamlara göre 74 kişi hayatını kaybetti.",
        detail:
          "Saatler süren şiddetli yağmurun ardından yamaçlardan kopan sel, çamur ve kaya karışımı hâlde ilçe merkezine aniden ulaştı; birçok ev ve iş yeri saniyeler içinde sular altında kaldı. Facia, Türkiye'de dere yataklarına yakın yerleşimlerin taşkın riskine karşı yeniden değerlendirilmesi gerektiğini gösteren acı örneklerden biri oldu; bölgede sonraki yıllarda taşkın önleme çalışmaları hızlandırıldı.",
        tags: ["Isparta", "sel", "74 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0713-dee",
        year: 1527,
        field: "Matematik",
        title: "John Dee doğdu",
        summary:
          "Kraliçe I. Elizabeth'in danışmanı olan Dee, matematik ve navigasyon bilgisini İngiliz denizcilerin dünya çapında keşif seferlerine yol göstermek için kullandı; Öklid'in eserlerinin İngilizce çevirisine yazdığı önsöz, matematiği sıradan zanaatkârlara tanıttı. Aynı zamanda simya ve gizemcilikle de ilgilenmesi, dönemin bilim ile büyünün henüz net biçimde ayrılmadığını gösteren bir örnektir.",
      },
    ],
    talk: [
      {
        id: "talk-0713-1",
        category: "Kültür",
        hook: "Bir 'eyoh' nidası, 72.000 kişiyi tek ağız yaptı",
        body: "1985'te bugün Wembley'de sahneye çıkan Freddie Mercury, tek bir uzun nota söyleyip stadyumun tamamını aynı sesi tekrarlamaya davet etti. O anlık görüntü, Live Aid'in simgesi oldu. 16 saat süren konser, iki kıtada eşzamanlı yayınlandı, 1,9 milyar dolar topladı. Müzik, o gün açlığa karşı en büyük silahlardan biri olduğunu kanıtladı.",
        minutes: 2,
      },
      {
        id: "talk-0713-2",
        category: "Karanlık Tarih",
        hook: "Bir dağ, bir ilçenin üzerine çöktü",
        body: "1995'te bugün, saatler süren yağmurun ardından dağdan kopan sel ve çamur, Senirkent'i aniden bastı. Evler saniyeler içinde sular altında kaldı, 74 kişi hayatını kaybetti. Facia, dere yataklarına yakın yerleşimlerin ne kadar kırılgan olabileceğini acı biçimde gösterdi — sonraki yıllarda bölgede taşkın önleme çalışmaları hızlandırıldı.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "07-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Bir kalenin düşüşü, bir devrimin doğuşu",
      text: "14 Temmuz 1789'da Paris halkı, kraliyet baskısının simgesi Bastille zindanını bastı. İçeride yalnızca yedi mahkûm vardı ama olay, Fransız Devrimi'nin başlangıç anı olarak tarihe geçti.",
    },
    events: [
      {
        id: "ev-0714-bastille",
        year: 1789,
        text: "Paris halkı, silah ve barut aramak amacıyla kraliyet zindanı Bastille'i bastı; dört saatlik çatışmanın ardından kaleyi ele geçirip komutanını öldürdü.",
        detail:
          "Bastille, o dönemde çoğunlukla sembolik bir hedefti — içinde yalnızca yedi mahkûm vardı — ama kraliyetin keyfi tutuklama yetkisinin simgesiydi. Baskın sırasında yaklaşık 94 kişi öldü, çoğu saldırgan taraftan. Olay, birkaç hafta içinde tüm Fransa'ya yayılan bir ayaklanma dalgasını tetikledi; altı hafta sonra kabul edilen İnsan ve Yurttaş Hakları Bildirgesi, modern insan hakları anlayışının temel taşlarından biri oldu. 14 Temmuz, bugün Fransa'nın ulusal bayramı.",
        category: "siyaset",
        matchKeys: ["bastille", "fransız devrimi", "paris"],
      },
    ],
    cases: [
      {
        id: "case-0714-bastille",
        year: 1789,
        type: "felaket",
        title: "Bastille Baskınının Bedeli",
        location: "Paris, Fransa",
        status: "KAPANDI",
        summary:
          "Sembolik önemi devasa olan baskında yaklaşık 94 kişi öldü; kalenin komutanı teslim olduktan sonra bile linç edilerek öldürüldü, başı bir sopaya geçirilip sokaklarda dolaştırıldı.",
        detail:
          "Kalabalık, silah ve barut deposu olan Bastille'e ulaşmak için önce müzakere etmeye çalıştı; ateşin açılmasıyla çatışma büyüdü. Komutan de Launay teslim olmayı kabul ettiğinde bile kalabalığın öfkesini dindiremedi; işkence görüp öldürüldü. Bu şiddet, devrimin ilk günlerinden itibaren hem özgürleştirici hem de vahşi bir yüzü olduğunu gösterdi — bir yıl içinde 'Terör Dönemi' olarak anılacak çok daha büyük bir şiddet dalgasının habercisiydi.",
        tags: ["Paris", "Fransız Devrimi", "linç"],
      },
    ],
    science: [
      {
        id: "sci-0714-newhorizons",
        year: 2015,
        field: "Uzay",
        title: "New Horizons, Plüton'a ulaştı",
        summary:
          "Dokuz buçuk yıllık bir yolculuğun ardından NASA'nın New Horizons aracı, Plüton'un yanından geçerek cüce gezegenin ilk yakın çekim fotoğraflarını gönderdi. Görüntüler, Plüton'un buzdan kalp şeklinde devasa bir ovaya sahip olduğunu ve o güne dek sanılandan çok daha karmaşık, jeolojik olarak 'canlı' bir dünya olduğunu ortaya çıkardı.",
      },
    ],
    talk: [
      {
        id: "talk-0714-1",
        category: "Tarih",
        hook: "Yedi mahkûm için basılan bir kale, bir devrimi başlattı",
        body: "1789'da bugün Paris halkı, silah aramak için Bastille'e saldırdığında içeride yalnızca yedi mahkûm vardı — sembolik önemi askerî değerinden çok daha büyüktü. Dört saatlik çatışmanın ardından kale düştü, komutanı linç edildi. Birkaç hafta içinde tüm Fransa ayaklandı. Bazen bir sembolün yıkılışı, gerçek gücünden çok daha fazla insanı harekete geçirir.",
        minutes: 3,
      },
      {
        id: "talk-0714-2",
        category: "Uzay",
        hook: "9,5 yıllık yolculuğun sonunda buzdan bir kalp",
        body: "2015'te bugün, dokuz buçuk yıl önce fırlatılan New Horizons, Plüton'un yanından geçti. Gönderdiği fotoğraflar, herkesi şaşırttı: donmuş, ölü bir kaya sanılan cüce gezegen, buzdan devasa bir kalp desenine ve aktif jeolojik süreçlere sahipti. Güneş Sistemi'nin en uzak köşelerinden biri bile, insanlığı şaşırtmaya devam ediyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "07-15": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Köprüde tanklara karşı yürüyen kalabalık",
      text: "15 Temmuz 2016 gecesi, bir grup asker F-16'larla meclisi bombaladı, köprüleri kapattı. Sabaha kadar 251 kişi hayatını kaybetti; darbe girişimi, meydanlara inen halk tarafından durduruldu.",
    },
    events: [
      {
        id: "ev-0715-darbe",
        year: 2016,
        text: "Türk Silahlı Kuvvetleri içindeki bir grup, saat 22.00 civarında darbe girişiminde bulundu; TBMM ve cumhurbaşkanlığı külliyesi F-16'larca bombalandı, İstanbul'da iki köprü askerlerce kapatıldı.",
        detail:
          "Cumhurbaşkanı Erdoğan, gece yarısına doğru bir televizyon kanalına cep telefonuyla bağlanarak halkı meydanlara ve havalimanlarına davet etti. Sabaha karşı darbeciler teslim olmaya başladı. Resmî rakamlara göre 251 kişi hayatını kaybetti, binlerce kişi yaralandı. Girişim, Türkiye'nin yakın tarihindeki en ağır sivil kayıplı gecelerden biri olarak anılıyor.",
        category: "siyaset",
        matchKeys: ["darbe girişimi", "15 temmuz"],
      },
    ],
    cases: [
      {
        id: "case-0715-moskovametro",
        year: 2014,
        type: "felaket",
        title: "Moskova Metrosu Kazası",
        location: "Moskova, Rusya — Arbatsko-Pokrovskaya hattı",
        status: "ÇÖZÜLDÜ",
        summary:
          "Tünelde aşırı hızlı seyreden bir tren raydan çıktı; kaza 24 kişinin ölümüne, yaklaşık 160 kişinin yaralanmasına yol açtı.",
        detail:
          "Soruşturma, kazanın hatalı monte edilmiş bir ray anahtarından kaynaklandığını ortaya koydu; tren saatte 70 km'ye varan hızla bu arızalı noktaya girdi. Vagonlar tünel duvarına çarpıp devrildi, yolcular karanlıkta dumanla dolu vagonlardan tahliye edilmeye çalışıldı. Moskova metrosunun 80 yılı aşkın tarihindeki en ölümcül kazalardan biri; olay sonrası hat bakım protokolleri baştan yazıldı.",
        tags: ["Moskova", "metro", "24 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0715-astp",
        year: 1975,
        field: "Uzay",
        title: "Apollo-Soyuz: Soğuk Savaş'ta uzayda el sıkışma",
        summary:
          "ABD'nin Apollo'su ile SSCB'nin Soyuz'u aynı gün fırlatıldı; iki gün sonra yörüngede kenetlenip mürettebat kapsüller arasında el sıkıştı. Uzay yarışının rekabetle başladığı iki ülke, bu görevle ilk ortak insanlı uzay uçuşunu gerçekleştirdi — sembolik olarak Soğuk Savaş'ın uzaydaki ateşkesiydi.",
      },
    ],
    talk: [
      {
        id: "talk-0715-1",
        category: "Karanlık Tarih",
        hook: "Bir gece yarısı telefon görüşmesi bir darbeyi durdurdu",
        body: "15 Temmuz 2016 gecesi tanklar sokaklara indi, meclis bombalandı, köprüler kapatıldı. Gece yarısına doğru Cumhurbaşkanı, bir haber kanalına cep telefonuyla bağlanıp halkı sokağa çağırdı. Binlerce kişi meydanlara, köprülere, havalimanlarına aktı — silahsız, tanklara karşı. Sabaha kadar 251 kişi hayatını kaybetti. O gece, bir ülkenin yakın tarihindeki en karanlık ve en çok tartışılan gecelerinden biri oldu.",
        minutes: 3,
      },
      {
        id: "talk-0715-2",
        category: "Uzay",
        hook: "Rakip iki ülke, yörüngede el sıkıştı",
        body: "1975'te bugün, ABD'nin Apollo'su ile SSCB'nin Soyuz'u aynı gün fırlatıldı. İki gün sonra yörüngede kenetlendiler; mürettebat kapsüller arasında geçip el sıkıştı, hediye takas etti. Uzay yarışını başlatan rekabetin iki tarafı, aynı görevde buluştu. Bazen en büyük rakipler, gökyüzünde ortak bir kapı aralayabiliyor.",
        minutes: 2,
      },
      {
        id: "talk-0715-3",
        category: "Karanlık Tarih",
        hook: "Bir ray anahtarı, 24 hayata mal oldu",
        body: "2014'te Moskova metrosunda bir tren, hatalı monte edilmiş bir ray anahtarına saatte 70 km hızla girdi. Vagonlar tünel duvarına çarpıp devrildi; 24 kişi öldü, yüzlerce kişi karanlık, dumanlı tünelden tahliye edildi. Doksan yılı aşkın tarihi olan bir metro sistemi için görülmemiş bir felaketti. Bazen bir milimetrelik bir montaj hatası, bir şehrin güven duygusunu sarsmaya yeter.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "07-16": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Şafak vakti bir güneş daha doğdu",
      text: "16 Temmuz 1945, sabah 05.29. Yeni Meksika çölünde, insan eliyle üretilmiş ilk nükleer patlama gökyüzünü güneşten daha parlak bir ışıkla doldurdu. Oppenheimer, o an aklına geleni yıllar sonra söyledi: 'Şimdi ben ölüm oldum, dünyaların yok edicisi.'",
    },
    events: [
      {
        id: "ev-0716-trinity",
        year: 1945,
        text: "Manhattan Projesi'nin Trinity testinde, insanlık tarihinin ilk nükleer patlaması Alamogordo bombalama sahasında gerçekleştirildi.",
        detail:
          "'Gadget' kod adlı bomba, 30 metrelik bir çelik kuleden patlatıldı; patlama 21.000 ton TNT'ye eşdeğer enerji açığa çıkardı, çapı 600 metreyi bulan bir ateş topu oluşturdu. Işık, yüzlerce kilometre öteden görüldü. Test adını, fizikçi Oppenheimer'ın okuduğu bir John Donne şiirinden aldı. Üç hafta sonra aynı teknoloji Hiroşima ve Nagazaki'de kullanılacaktı.",
        category: "bilim",
        matchKeys: ["trinity", "oppenheimer", "manhattan projesi"],
      },
    ],
    cases: [
      {
        id: "case-0716-jfkjr",
        year: 1999,
        type: "felaket",
        title: "JFK Jr.'ın Kaybolan Uçağı",
        location: "Atlantik Okyanusu, Martha's Vineyard açıkları",
        status: "ÇÖZÜLDÜ",
        summary:
          "Eski Başkan Kennedy'nin oğlu John F. Kennedy Jr., kullandığı küçük uçakla karısı ve baldızıyla birlikte sisli bir gecede denize düştü; üçü de hayatını kaybetti.",
        detail:
          "Henüz deneyimsiz bir pilot olan Kennedy, alacakaranlıkta görüş hattı olmadan uçarken yönelim bozukluğu yaşadığı ve uçağı fark etmeden dalışa geçirdiği belirlendi. Uçak beş gün boyunca bulunamadı; arama, ülke çapında canlı yayınlarla izlendi. Enkaz ve cesetler deniz dibinde, tahmini düşüş noktasının yakınında bulundu. Facia, Kennedy ailesinin trajedilerle dolu tarihine bir yenisini daha ekledi.",
        tags: ["Kennedy ailesi", "havacılık", "3 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0716-shoemaker",
        year: 1994,
        field: "Astronomi",
        title: "Bir kuyrukluyıldız Jüpiter'e çarpmaya başladı",
        summary:
          "Shoemaker-Levy 9 kuyrukluyıldızının parçaları, bir hafta boyunca art arda Jüpiter'in atmosferine çarptı — insanlığın gerçek zamanlı izlediği ilk gezegenler arası çarpışma dizisiydi. Bazı parçaların bıraktığı izler Dünya'dan bile büyüktü; olay, gezegenimizin de benzer bir çarpışmaya açık olduğunu çarpıcı biçimde hatırlattı.",
      },
    ],
    talk: [
      {
        id: "talk-0716-1",
        category: "Bilim",
        hook: "'Şimdi ben ölüm oldum, dünyaların yok edicisi'",
        body: "16 Temmuz 1945 sabahı, çölde bir kule üzerinde patlatılan bomba, güneşten daha parlak bir ışık saçtı. Fizikçi Oppenheimer, yıllar sonra o anda aklından geçeni bir Hindu kutsal metninden alıntılayarak özetledi. Üç hafta sonra aynı teknoloji Japonya'da kullanıldı. Bir laboratuvar denemesi, birkaç hafta içinde bir çağın nasıl sona erip yenisinin başladığını gösterdi.",
        minutes: 3,
      },
      {
        id: "talk-0716-2",
        category: "Karanlık Tarih",
        hook: "Beş gün süren bir arama, ülkeyi ekrana kilitledi",
        body: "1999'da bugün, eski başkanın oğlu JFK Jr.'ın küçük uçağı sisli bir gecede radardan kayboldu. Beş gün süren arama, canlı yayınlarla izlendi; sonunda enkaz deniz dibinde bulundu. Deneyimsiz bir pilotun karanlıkta yön kaybetmesi yeterliydi. Kennedy ailesinin tarihine bir trajedi daha eklendi — bazı aileler, tarihin aynı sayfasına defalarca yazılır.",
        minutes: 2,
      },
      {
        id: "talk-0716-3",
        category: "Uzay",
        hook: "Bir gezegenin yediği kuyrukluyıldız, canlı yayında izlendi",
        body: "1994'te bilim insanları ilk kez bir gök cismi çarpışmasını gerçek zamanlı izledi: parçalanmış bir kuyrukluyıldız, bir hafta boyunca art arda Jüpiter'e çarptı. Bazı çarpma izleri Dünya'dan bile büyüktü. Olay basit ama ürpertici bir soruyu akla getirdi: Jüpiter bu kadar büyük bir 'kalkan' olmasaydı, sıradaki hedef biz olabilir miydik?",
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
};
