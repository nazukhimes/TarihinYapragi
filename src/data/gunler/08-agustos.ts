import type { CuratedDay } from "../types";

export const AGUSTOS: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "08-06": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Saat 08.15",
      text: "6 Ağustos 1945 sabahı saat 08.15'te Hiroşima'nın üzerinde bir bomba patladı. Şehir dakikalar içinde kül oldu; savaş tarihinde bir şehrin tek bir silahla yok edildiği ilk andı.",
    },
    events: [
      {
        id: "ev-0806-hirosima",
        year: 1945,
        text: "ABD'ye ait B-29 bombardıman uçağı Enola Gay, 'Little Boy' adlı atom bombasını Hiroşima'ya bıraktı; kent, tarihte nükleer silahla vurulan ilk şehir oldu.",
        detail:
          "Bomba, şehrin 580 metre üzerinde patladı ve 12 kilometrekarelik alanı anında yok etti. Patlama anında tahmini 80.000 kişi öldü; yıl sonuna kadar yanık, radyasyon hastalığı ve enkaz altında kalma nedeniyle bu sayı 140.000'e ulaştı. ABD, Japonya'yı koşulsuz teslime zorlamak amacıyla bombayı kullandığını açıkladı; üç gün sonra Nagazaki'ye ikinci bomba atıldı.",
        category: "felaket",
        matchKeys: ["hiroşima", "enola gay", "little boy"],
      },
    ],
    cases: [
      {
        id: "case-0806-hirosima",
        year: 1945,
        type: "katliam",
        title: "Hiroşima: Nükleer Çağın İlk Kurbanı",
        location: "Hiroşima, Japonya",
        status: "KAPANDI",
        summary:
          "İnsanlık tarihinde bir şehre karşı kullanılan ilk nükleer silah, saniyeler içinde on binlerce sivili öldürdü; hayatta kalanlar yıllarca radyasyonun geç etkileriyle boğuştu.",
        detail:
          "Patlama merkezindeki insanların çoğu buharlaşarak yalnızca duvarlara 'gölge' izleri bıraktı. Hayatta kalan 'hibakusha' (bomba mağdurları) yıllarca lösemi ve kanser oranlarındaki artışla, bazıları da toplumsal dışlanmayla mücadele etti. Şehir bugün bir barış anıtı ve müzesiyle o günü anıyor; saat her gün 08.15'te çalan bir zil, patlama anını hatırlatıyor. Tartışma — bombalamanın savaşı kısaltıp kısaltmadığı — 80 yılı aşkın süredir tarihçiler arasında sürüyor.",
        tags: ["nükleer silah", "Japonya", "II. Dünya Savaşı"],
      },
    ],
    science: [
      {
        id: "sci-0806-www",
        year: 1991,
        field: "Bilişim",
        title: "World Wide Web halka açıldı",
        summary:
          "İngiliz bilim insanı Tim Berners-Lee, CERN'de geliştirdiği World Wide Web projesini tanıtan ilk web sitesini (info.cern.ch) dış dünyanın erişimine açtı. Basit bir metin sayfasıydı; bugün milyarlarca sitenin ve internetin kendisinin temelini oluşturan protokoller, o sayfadan filizlendi.",
      },
    ],
    talk: [
      {
        id: "talk-0806-1",
        category: "Karanlık Tarih",
        hook: "Saat 08.15'te duran bir şehir",
        body: "6 Ağustos 1945 sabahı Hiroşima'da insanlar işe gidiyor, çocuklar okula yürüyordu. Saat 08.15'te gökyüzünde bir parlama oldu, ardından şehir yok oldu. Patlama merkezindeki bazı insanlardan geriye yalnızca duvarlara yansıyan gölgeleri kaldı. Yıl sonuna kadar 140.000 kişi hayatını kaybetti. Bugün şehirde her sabah aynı saatte çalan bir zil, o anı hâlâ hatırlatıyor.",
        minutes: 3,
      },
      {
        id: "talk-0806-2",
        category: "Bilim",
        hook: "Tek bir sayfa, bugünkü interneti doğurdu",
        body: "1991'de bugün, bir CERN bilim insanı basit bir metin sayfasını dünyaya açtı: World Wide Web'in ne olduğunu anlatan bir açıklama. O sayfa, bugün milyarlarca web sitesinin atası. Hiroşima'nın yıkımıyla aynı takvim yaprağını paylaşan bu icat, insanlığın aynı yüzyılda hem en yıkıcı hem en bağlayıcı teknolojilerini ürettiğinin garip bir hatırlatıcısı.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-09": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "İkinci ve son",
      text: "9 Ağustos 1945'te Nagazaki, tarihte nükleer silahla vurulan ikinci — ve şimdiye dek son — şehir oldu. Asıl hedef başka bir kentti; bulutlar kaderini değiştirdi.",
    },
    events: [
      {
        id: "ev-0809-nagazaki",
        year: 1945,
        text: "ABD'ye ait Bockscar bombardıman uçağı, 'Fat Man' adlı plütonyum bombasını Nagazaki'ye bıraktı; altı gün sonra Japonya teslim oldu.",
        detail:
          "Uçağın asıl hedefi Kokura kentiydi ama yoğun bulut örtüsü görüşü kapatınca yedek hedef Nagazaki'ye yönelindi. Bomba, şehrin sivil yerleşim ve hastanelerinin bulunduğu Urakami Vadisi üzerinde patladı. Japonya İmparatoru Hirohito, 15 Ağustos'ta radyodan koşulsuz teslimiyeti duyurdu — II. Dünya Savaşı'nın Pasifik cephesi böylece sona erdi.",
        category: "felaket",
        matchKeys: ["nagazaki", "bockscar", "fat man"],
      },
    ],
    cases: [
      {
        id: "case-0809-nagazaki",
        year: 1945,
        type: "katliam",
        title: "Nagazaki: Bulutların Değiştirdiği Hedef",
        location: "Nagazaki, Japonya",
        status: "KAPANDI",
        summary:
          "Patlama şehrin yaklaşık yüzde 44'ünü yok etti; yıl sonuna kadar tahminen 70.000'e yakın kişi hayatını kaybetti.",
        detail:
          "Nagazaki'nin dağlık coğrafyası patlamanın etkisini Hiroşima'ya kıyasla bir miktar sınırladı, yine de şehrin sanayi bölgesi ve yerleşim alanları tamamen silindi. Hayatta kalanlar arasında hem Hiroşima hem Nagazaki bombalamalarından sağ çıkan az sayıda kişi bile vardı — bu kişiler 'nijuu hibakusha' (çifte bomba mağduru) olarak anılır. Nagazaki, bugüne dek bir şehre atılan son nükleer silahın hedefi olarak kaldı; bu 'son'un kalıcı olup olmayacağı, nükleer silahsızlanma tartışmalarının merkezinde duruyor.",
        tags: ["nükleer silah", "Japonya", "II. Dünya Savaşı"],
      },
    ],
    science: [
      {
        id: "sci-0809-avogadro",
        year: 1776,
        field: "Kimya",
        title: "Amedeo Avogadro doğdu",
        summary:
          "İtalyan fizikçi ve kimyager Avogadro, eşit hacimdeki gazların eşit sayıda molekül içerdiğini öne süren hipotezle moleküler kimyanın temelini attı. Adını taşıyan 'Avogadro sayısı' (bir moldeki tanecik sayısı, 6,022×10²³), kendisi hayattayken kanıtlanamadı; bilim dünyası fikrinin doğruluğunu ancak ölümünden yıllar sonra kabul etti.",
      },
    ],
    talk: [
      {
        id: "talk-0809-1",
        category: "Karanlık Tarih",
        hook: "Bulutlar, bir şehrin kaderini değiştirdi",
        body: "9 Ağustos 1945'te Bockscar uçağının asıl hedefi Kokura'ydı. Şehrin üzerinde yoğun bulut ve duman görüşü kapatınca pilot rotayı yedek hedefe, Nagazaki'ye çevirdi. Bir hava koşulu, hangi şehrin o gün yok olacağını belirledi. Altı gün sonra Japonya teslim oldu, savaş bitti. Tarihin en ağır kararlarından biri, kısmen gökyüzünün o günkü haline bağlıydı.",
        minutes: 3,
      },
      {
        id: "talk-0809-2",
        category: "Bilim",
        hook: "Kendi hayatında kanıtlanamayan bir sayı",
        body: "Avogadro, 1811'de eşit hacimdeki gazların eşit sayıda molekül taşıdığını öne sürdüğünde, çağdaşları bu fikri neredeyse görmezden geldi. Kendi adını taşıyan sayı — bir moldeki tanecik sayısı — ancak onun ölümünden sonra deneysel olarak doğrulandı. Bugün her kimya dersinde öğretilen bu sayı, bir bilim insanının fikrinin zamanının çok ötesinde olabileceğinin kanıtı.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-12": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Bir yıl önce yoktu, bir yılda milyon sattı",
      text: "12 Ağustos 1981'de IBM, New York'ta bir basın toplantısıyla ilk kişisel bilgisayarını tanıttı. Beş yılda 250 bin satış bekleniyordu; ilk yılda bir milyonu geçti.",
    },
    events: [
      {
        id: "ev-0812-ibmpc",
        year: 1981,
        text: "IBM, 4,77 MHz işlemcili, 16 kilobayt bellekli ilk kişisel bilgisayarı IBM PC'yi piyasaya sürdü.",
        detail:
          "IBM, o güne dek büyük şirketlere dev 'ana bilgisayar' (mainframe) satan bir devdi; kişisel bilgisayar pazarına girmek için 12 mühendisten oluşan küçük bir ekibi bir yıldan kısa sürede projeyi tamamlamakla görevlendirdi. Ekip, hız kazanmak için IBM'in her zamanki alışkanlığının aksine dışarıdan hazır parçalar kullandı — işletim sistemini de küçük bir şirketten, Microsoft'tan aldı. Bu karar, on yıllar sonra 'uyumlu PC' pazarının ve Microsoft'un yükselişinin de kapısını araladı.",
        category: "bilim",
        matchKeys: ["ibm pc", "kişisel bilgisayar"],
      },
    ],
    cases: [
      {
        id: "case-0812-kursk",
        year: 2000,
        type: "kayıp",
        title: "Kursk Denizaltısı Faciası",
        location: "Barents Denizi, Rusya",
        status: "KAPANDI",
        summary:
          "Rus nükleer denizaltısı Kursk, tatbikat sırasında bir torpido patlaması sonucu battı; 118 kişilik mürettebattan kimse kurtarılamadı.",
        detail:
          "İlk patlama, denizaltının burnundaki hatalı bir torpidodan kaynaklandı; iki dakika sonra kalan torpidoların patlamasıyla gelen ikinci ve çok daha büyük infilak, gemiyi deniz tabanına gömdü. Bazı denizciler arka bölmede saatlerce hayatta kaldı; bir denizcinin son notu bulundu. Rus donanmasının yardım tekliflerini geç kabul etmesi, kurtarma operasyonunun günler gecikmesine ve büyük bir kamuoyu öfkesine yol açtı — trajedi, Rusya'nın askerî şeffaflığı hakkında kalıcı bir güvensizlik bıraktı.",
        tags: ["Rusya", "denizaltı", "118 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0812-deimos",
        year: 1877,
        field: "Astronomi",
        title: "Mars'ın uydusu Deimos keşfedildi",
        summary:
          "Amerikalı gökbilimci Asaph Hall, Washington Deniz Gözlemevi'nde Mars'ı günlerce tararken gezegenin küçük uydusu Deimos'u buldu; altı gün sonra da diğer uydu Phobos'u keşfetti. Hall, aramayı neredeyse bırakacaktı — eşi Angelina Stickney, onu bir gece daha denemesi için ikna etmişti.",
      },
    ],
    talk: [
      {
        id: "talk-0812-1",
        category: "Bilim",
        hook: "Dev bir şirket, küçük bir ekiple devrim yaptı",
        body: "1981'de bugün tanıtılan IBM PC, dışarıdan alınan parçalar ve küçük bir şirketten (Microsoft) alınan işletim sistemiyle bir yılda hazırlandı — IBM'in alışıldık yavaş, her şeyi kendi üreten kültürüne aykırı bir karardı. Beş yılda 250 bin satış bekleniyordu; ilk yıl bir milyonu geçti. O aceleci kararlardan biri, kişisel bilgisayar çağının kapısını açtı.",
        minutes: 2,
      },
      {
        id: "talk-0812-2",
        category: "Karanlık Tarih",
        hook: "Bir denizcinin son notu, deniz tabanında bulundu",
        body: "2000'de Kursk denizaltısı bir tatbikatta patlayıp battı. Bazı denizciler arka bölmede saatlerce hayattaydı; birinin cebinden karanlıkta karısına yazdığı bir not çıktı. Rus donanması dış yardımı günlerce reddetti — ta ki kurtarma imkansız hale gelene kadar. 118 kişiden kimse sağ çıkmadı. Trajedi, bir devletin gururunun bazen insan hayatının önüne geçebildiğinin acı bir örneği oldu.",
        minutes: 3,
      },
      {
        id: "talk-0812-3",
        category: "Uzay",
        hook: "Eşinin ısrarı olmasa bulunmayacaktı",
        body: "1877'de Mars'ı günlerce tarayan gökbilimci Asaph Hall, hiçbir şey bulamayınca pes etmek üzereydi. Eşi Angelina, 'bir gece daha dene' diye ısrar etti. O gece Hall, Mars'ın küçük uydusu Deimos'u buldu; altı gün sonra ikinci uydu Phobos'u da keşfetti. Bilim tarihinin bazı büyük anları, laboratuvarda değil, bir eşin sabırsız teşvikinde saklıdır.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-16": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Kralın son günü",
      text: "16 Ağustos 1977'de Elvis Presley, Graceland'deki banyosunda hayatını kaybetti. Kalp yetmezliği resmî ölüm nedeniydi; asıl neden, yıllarca süren reçeteli ilaç bağımlılığıydı.",
    },
    events: [
      {
        id: "ev-0816-elvis",
        year: 1977,
        text: "Rock'n roll'un en tanınmış ismi Elvis Presley, 42 yaşında Graceland malikânesindeki banyosunda ölü bulundu.",
        detail:
          "Sevgilisi Ginger Alden, öğleden sonra onu banyo zemininde bilinçsiz hâlde buldu; hastaneye kaldırıldığında kurtarılamadı. Resmî ölüm nedeni kalp yetmezliğiydi ama otopside kanında çok sayıda reçeteli ilacın kalıntısına rastlandı. Ertesi gün Graceland'de düzenlenen cenaze törenine 100.000'i aşkın hayran akın etti; Presley'nin ölümü, rock'n roll çağının bir döneminin simgesel kapanışı sayıldı.",
        category: "kultur",
        matchKeys: ["elvis presley", "graceland"],
      },
    ],
    cases: [
      {
        id: "case-0816-elvis",
        year: 1977,
        type: "skandal",
        title: "Elvis'i Kim Öldürdü: Doktor mu, Sistem mi?",
        location: "Memphis, Tennessee, ABD",
        status: "KAPANDI",
        summary:
          "Presley'nin kişisel doktoru George Nichopoulos, ölümünden önceki yirmi ayda ona on binlerce doz reçeteli ilaç yazmakla suçlandı; yargılandı ama beraat etti.",
        detail:
          "Soruşturma, Presley'nin uykusuzluk, ağrı ve kilo sorunlarıyla başa çıkmak için yıllarca çoklu reçeteli ilaç kullandığını, doktorunun da bu bağımlılığı beslediğini ortaya koydu. 'Dr. Nick' lakaplı Nichopoulos, tıp kurulu tarafından aşırı reçeteleme nedeniyle soruşturuldu, lisansı geçici olarak askıya alındı ama hiçbir zaman suçlu bulunmadı. Olay, ünlülere yönelik reçeteli ilaç bağımlılığının ve 'kolaylaştırıcı doktorların' tıp camiasında tartışılmasının erken örneklerinden biri oldu.",
        tags: ["Memphis", "ilaç bağımlılığı", "ünlü ölümü"],
      },
    ],
    science: [
      {
        id: "sci-0816-kittinger",
        year: 1960,
        field: "Havacılık",
        title: "31 kilometre yükseklikten serbest düşüş",
        summary:
          "ABD Hava Kuvvetleri pilotu Joseph Kittinger, bir helyum balonuyla stratosfere çıkıp oradan serbest düşüşe geçti; saatte 988 kilometreye varan hızla, ses hızına yakın bir düşüş gerçekleştirdi. Deney, yüksek irtifada mürettebatın güvenle tahliye edilebilmesi için kritik veriler sağladı; rekoru 52 yıl sonra, 2012'de Felix Baumgartner kırdı.",
      },
    ],
    talk: [
      {
        id: "talk-0816-1",
        category: "Kültür",
        hook: "42 yaşında, bir banyo zemininde bulundu",
        body: "1977'de bugün, rock'n roll'un kralı Graceland'deki banyosunda ölü bulundu. Resmî neden kalp yetmezliğiydi ama otopsi, yıllarca süren çoklu reçeteli ilaç kullanımının izlerini taşıyordu. Ertesi gün cenazesine 100.000'den fazla hayran akın etti. Presley'nin ölümü, şöhretin bedelinin bazen sahne ışıklarının çok ötesinde ödendiğinin hatırlatıcısı oldu.",
        minutes: 2,
      },
      {
        id: "talk-0816-2",
        category: "Karanlık Tarih",
        hook: "Bir doktor, yıllarca reçete yazdı — hiç suçlu bulunmadı",
        body: "Presley'nin ölümünün ardından ortaya çıkan soruşturma, kişisel doktorunun son yirmi ayda ona on binlerce doz ilaç yazdığını gösterdi. 'Dr. Nick' yargılandı ama beraat etti. Olay, ünlülerin çevresindeki 'kolaylaştırıcı' doktorlar sorununu ilk kez geniş kitlelere duyurdu — bir tartışma ki onlarca yıl sonra hâlâ benzer skandallarla gündeme geliyor.",
        minutes: 2,
      },
      {
        id: "talk-0816-3",
        category: "Bilim",
        hook: "Ses hızına yakın bir düşüş, şemsiye bile açmadan",
        body: "1960'ta Kittinger, stratosferden atlayıp saatte neredeyse 1.000 kilometre hıza ulaştı — paraşütünü açmadan önce dakikalarca serbest düştü. Deneyin amacı eğlence değildi: yüksek irtifada uçaktan atlayan pilotların nasıl hayatta kalabileceğini öğrenmekti. Rekoru elli iki yıl kimse kıramadı.",
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
  "08-26": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "İki zafer, 851 yıl arayla, aynı gün",
      text: "26 Ağustos önce 1071'de Anadolu'nun kapılarını Türklere açtı, sonra 1922'de Kurtuluş Savaşı'nın son perdesini başlattı. Aynı takvim yaprağı, bir milletin iki dönüm noktasını taşıyor.",
    },
    events: [
      {
        id: "ev-0826-malazgirt",
        year: 1071,
        text: "Büyük Selçuklu hükümdarı Alparslan, Malazgirt Ovası'nda Bizans İmparatoru Romen Diyojen'i yenilgiye uğrattı ve esir aldı.",
        detail:
          "Sayıca üstün Bizans ordusu karşısında Alparslan, 'Turan taktiği' denen sahte ricat ve çevirme manevrasıyla üstünlük sağladı. Cuma namazından akşam namazına kadar süren savaş, Bizans'ın ağır yenilgisiyle bitti; Romen Diyojen bizzat esir düştü. Yenilgi Bizans'ta iç çatışmaları körükledi ve imparatorluğun doğu sınırındaki savunmasını çökertti — Anadolu'nun Türkleşmesinin önü bu savaşla açıldı.",
        category: "savas",
        matchKeys: ["malazgirt", "alparslan", "diyojen"],
      },
      {
        id: "ev-0826-taarruz",
        year: 1922,
        text: "Başkomutan Mustafa Kemal Paşa'nın Afyon Kocatepe'den bizzat yönettiği Büyük Taarruz, sabaha karşı açılan topçu ateşiyle başladı.",
        detail:
          "05.30'da başlayan bombardımanın ardından piyade birlikleri Yunan mevzilerine saldırdı; ilk gün Tınaztepe ele geçirildi. Taarruz, dört gün sonra Dumlupınar'daki Başkomutanlık Meydan Muharebesi'yle taçlanacak ve 9 Eylül'de İzmir'in kurtuluşuyla sonuçlanacaktı. Kurtuluş Savaşı'nın son ve belirleyici cephesi bu sabahla açıldı.",
        category: "savas",
        matchKeys: ["büyük taarruz", "kocatepe"],
      },
    ],
    cases: [
      {
        id: "case-0826-krakatoa",
        year: 1883,
        type: "felaket",
        title: "Krakatoa: Tarihin En Gürültülü Patlaması",
        location: "Sunda Boğazı, Hollanda Doğu Hint Adaları (bugünkü Endonezya)",
        status: "KAPANDI",
        summary:
          "Krakatoa Yanardağı'nın patlama serisi 36.000'den fazla insanın ölümüne yol açtı; sesi 4.800 km öteden duyuldu ve dünyayı dört kez dolaştı.",
        detail:
          "26 Ağustos öğleden sonra başlayan patlamalar, ertesi sabah saat 10'da adayı büyük ölçüde yok eden son büyük patlamayla zirveye ulaştı. 40 metreye varan tsunami dalgaları kıyı köylerini sildi; küle bulanan gökyüzü aylarca dünya genelinde renkli gün batımlarına yol açtı. Ses, kaydedilmiş tarihin en yüksek sesi kabul edilir — Avustralya'nın Perth kentinden bile duyulmuştu. Felaket, modern volkanoloji ve erken uyarı sistemlerinin gelişmesinde dönüm noktası oldu.",
        tags: ["yanardağ", "Endonezya", "tsunami", "36.000 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0826-lavoisier",
        year: 1743,
        field: "Kimya",
        title: "Modern kimyanın babası doğdu: Antoine Lavoisier",
        summary:
          "Paris'te doğan Lavoisier, yanmanın gizemini çözüp 'oksijen' kavramını bilime kazandırdı, kütlenin korunumu yasasını deneylerle kanıtladı ve kimyasal adlandırma sistemini kurdu. Fransız Devrimi sırasında giyotinle idam edildi; matematikçi Lagrange'ın dediği gibi, 'o kafayı kesmek bir an sürdü, ama bir yüzyıl aynısını üretemeyebilir.'",
      },
    ],
    talk: [
      {
        id: "talk-0826-1",
        category: "Tarih",
        hook: "Bir cuma namazı ile akşam namazı arasında değişen harita",
        body: "1071'de Malazgirt Ovası'nda Alparslan, sayıca üstün bir Bizans ordusunu sahte bir geri çekilme taktiğiyle çember içine aldı. Savaş cuma namazından akşam namazına kadar sürdü; sonunda İmparator Romen Diyojen esir düştü. Bizans'ın doğu sınırındaki savunması bir daha toparlanamadı. Anadolu'nun bugün 'Türkiye' denen toprak olmasının hikâyesi, bu tek günle başlar.",
        minutes: 3,
      },
      {
        id: "talk-0826-2",
        category: "Tarih",
        hook: "851 yıl sonra aynı takvim yaprağı, yeni bir taarruz",
        body: "1922'de bugün, sabahın 05.30'unda Kocatepe'den açılan top ateşiyle Büyük Taarruz başladı. Mustafa Kemal Paşa, savaşı bizzat cepheden yönetti. Dört gün sonra Dumlupınar'da kesin zafer, iki hafta sonra İzmir'in kurtuluşu gelecekti. Malazgirt'in Anadolu'yu açtığı gün, sekiz asır sonra Anadolu'yu bir kez daha kurtaran taarruzun da günü oldu — tesadüf mü, tarihin cilvesi mi?",
        minutes: 2,
      },
      {
        id: "talk-0826-3",
        category: "Karanlık Tarih",
        hook: "Dünyanın duyduğu en yüksek ses",
        body: "1883'te Krakatoa patladığında çıkan ses, 4.800 kilometre öteden, Hint Okyanusu'ndaki bir adadan duyuldu ve gezegeni dört kez dolaştı. Kırk metrelik tsunami dalgaları kıyı köylerini sildi, 36 binden fazla insan öldü. Gökyüzü aylarca kızıl kaldı; ressamların o dönem gün batımlarını neden bu kadar alevli resmettiği hâlâ bu patlamaya bağlanır. Doğa bazen tarihin en sessiz sayfasını en gürültülü şekilde yazar.",
        minutes: 2,
      },
      {
        id: "talk-0826-4",
        category: "Bilim",
        hook: "Kimyanın kurucusu, giyotinle susturuldu",
        body: "Antoine Lavoisier, yanmanın sırrını çözüp modern kimyayı kurdu — oksijeni tanımladı, kütlenin korunumu yasasını kanıtladı. Fransız Devrimi'nde vergi toplayıcılığı geçmişi yüzünden giyotine gönderildi. Yargıç, af talebine 'Cumhuriyetin bilim insanına ihtiyacı yok' dediği rivayet edilir. Bir matematikçi dostu yıllar sonra özetledi: O kafayı kesmek bir saniye sürdü, bir yenisini yetiştirmek belki yüz yıl.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-30": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Başkomutanın bizzat yönettiği son meydan savaşı",
      text: "30 Ağustos 1922'de Dumlupınar'da kazanılan zafer, üç yıllık Kurtuluş Savaşı'nı fiilen bitirdi. Türkiye'de bu tarih hâlâ 'Zafer Bayramı' olarak kutlanıyor.",
    },
    events: [
      {
        id: "ev-0830-baskomutanlik",
        year: 1922,
        text: "Başkomutanlık Meydan Muharebesi, Dumlupınar'da Türk ordusunun kesin zaferiyle sonuçlandı; Yunan ordusunun büyük bölümü kuşatılıp etkisiz hâle getirildi.",
        detail:
          "26 Ağustos'ta Kocatepe'den başlayan taarruz, dört gün süren çarpışmaların ardından Dumlupınar'da doruğa ulaştı. Savaşı bizzat cephede yöneten Mustafa Kemal Paşa'nın adı, muharebeye sonradan 'Başkomutanlık Meydan Muharebesi' olarak verildi. Yunan ordusunun geri çekilişi bozguna dönüştü; 9 Eylül'de Türk kuvvetleri İzmir'e girdi. Bu tarih, Türkiye'de 'Zafer Bayramı' adıyla resmî bayram olarak kutlanır.",
        category: "savas",
        matchKeys: ["dumlupınar", "başkomutanlık", "zafer bayramı"],
      },
    ],
    cases: [
      {
        id: "case-0830-lenin",
        year: 1918,
        type: "suikast",
        title: "Lenin Suikast Girişimi",
        location: "Moskova, Michelson Fabrikası önü",
        status: "ÇÖZÜLDÜ",
        summary:
          "Bir fabrika konuşmasından çıkan Lenin, Fanny Kaplan adlı bir kadın tarafından üç el ateş edilerek ağır yaralandı; suikastten sağ kurtuldu.",
        detail:
          "Kaplan, kurşunlardan ikisiyle Lenin'i omzundan ve boynundan yaraladı; kurşunlardan biri hayatı boyunca vücudunda kaldı. Kaplan yakalandı, sorguya çekildi ve dört gün sonra kurşuna dizildi — yargılanmadan. Suikast girişimi, Bolşevikler'in 'Kızıl Terör' adını verdiği geniş çaplı bir tasfiye dalgasının doğrudan gerekçesi oldu; binlerce kişi bu dönemde tutuklandı veya idam edildi. Lenin, yaraların etkisiyle sağlığından hiçbir zaman tam olarak kurtulamadı.",
        tags: ["Bolşevik", "Moskova", "Kızıl Terör"],
      },
    ],
    science: [
      {
        id: "sci-0830-gokcen",
        year: 1937,
        field: "Havacılık",
        title: "Sabiha Gökçen'e tayyareci diploması verildi",
        summary:
          "Atatürk'ün manevi kızı Sabiha Gökçen, Eskişehir Hava Okulu'ndaki eğitiminin ardından pilot diplomasını aldı; kısa süre sonra dünyanın ilk kadın savaş pilotlarından biri oldu. Türkiye, kadın havacılıkta Avrupa'nın önünde bir örnek sundu — İstanbul'un ikinci havalimanı bugün onun adını taşıyor.",
      },
    ],
    talk: [
      {
        id: "talk-0830-1",
        category: "Tarih",
        hook: "Bir savaşı bizzat cepheden yöneten başkomutan",
        body: "30 Ağustos 1922'de Dumlupınar'da kazanılan zafer, Kurtuluş Savaşı'nın fiilen sonu oldu. Mustafa Kemal Paşa, muharebeyi haritalar üzerinden değil, cephenin içinden yönetti — savaş sonradan onun adına 'Başkomutanlık Meydan Muharebesi' diye anıldı. Dokuz gün sonra ordu İzmir'deydi. Bugün hâlâ 'Zafer Bayramı' olarak kutlanan bu tarih, bir subayın savaş masasından değil, siperin içinden verdiği kararların hikâyesi.",
        minutes: 3,
      },
      {
        id: "talk-0830-2",
        category: "Karanlık Tarih",
        hook: "Üç kurşun, bir imparatorluğun terör dönemini başlattı",
        body: "1918'de bir fabrika çıkışında Lenin'e üç el ateş edildi; iki kurşun onu ağır yaraladı ama öldürmedi. Saldırgan Fanny Kaplan dört gün içinde, yargılanmadan kurşuna dizildi. Bolşevikler bu suikastı bahane ederek 'Kızıl Terör' denen geniş bir tasfiyeye giriştiler — binlerce kişi tutuklandı, çoğu idam edildi. Bir kurşun bazen bir rejimin ne kadar sert olabileceğinin de işaretidir.",
        minutes: 2,
      },
      {
        id: "talk-0830-3",
        category: "Bilim",
        hook: "Dünyanın ilk kadın savaş pilotu, bir okul diplomasıyla başladı",
        body: "1937'de bugün diplomasını alan Sabiha Gökçen, kısa sürede dünyanın ilk kadın savaş pilotlarından biri oldu. Atatürk'ün manevi evlatlığı olarak büyüyen Gökçen, döneminin çoğu ülkesinde kadınlara kapalı olan bir mesleğe adım attı. Bugün İstanbul'un bir havalimanı onun adını taşıyor — bir diploma, bir kentin gökyüzüyle ilişkisini adlandıracak kadar kalıcı olabiliyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "08-31": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Pont de l'Alma'daki son üç dakika",
      text: "31 Ağustos 1997 gece yarısını geçe, paparazzi motosikletlerinden kaçan bir araç Paris'te bir tünel direğine çarptı. Prenses Diana, saatler sonra hastanede hayatını kaybetti.",
    },
    events: [
      {
        id: "ev-0831-diana",
        year: 1997,
        text: "Galler Prensesi Diana, bindiği araç Paris'teki Pont de l'Alma tünelinde bir direğe çarpınca hayatını kaybetti; sürücü Henri Paul ve yanındaki Dodi Fayed da öldü.",
        detail:
          "Otelden ayrılırken paparazzi motosikletlerince takip edilen araç, tünele yaklaşık 100 km/sa hızla girdi ve kontrolden çıktı. Sürücünün alkollü olduğu ve hız sınırının çok üzerinde araç kullandığı belirlendi; koruma Trevor Rees-Jones emniyet kemeri takan tek kişi olarak ağır yaralı kurtuldu. Diana, saatler süren ameliyata rağmen kurtarılamadı. Ölümü, dünya çapında eşi görülmemiş bir yas dalgası yarattı; Londra sokaklarında bırakılan çiçekler haftalarca kaldırılamadı.",
        category: "felaket",
        matchKeys: ["prenses diana", "pont de l'alma", "paparazzi"],
      },
    ],
    cases: [
      {
        id: "case-0831-diana",
        year: 1997,
        type: "felaket",
        title: "Prenses Diana'nın Ölümü",
        location: "Paris, Fransa — Pont de l'Alma Tüneli",
        status: "ÇÖZÜLDÜ",
        summary:
          "Yıllarca süren komplo teorilerine rağmen resmî İngiliz-Fransız soruşturmaları, ölümün sürücü hatası ve aşırı hızdan kaynaklanan bir trafik kazası olduğu sonucuna vardı.",
        detail:
          "2008'de tamamlanan İngiliz adli soruşturması, kazanın 'sürücünün pervasız araç kullanımı ve paparazzi takibinin' bir sonucu olduğuna, 'yasa dışı öldürme' bulgusuna hükmetti. Onlarca yıl süren komplo iddiaları — kraliyet ailesinin kazayı organize ettiğinden istihbarat servislerinin karıştığına kadar — hiçbirinde somut kanıt bulunamadı. Facia, medyanın ünlüleri takip etme sınırlarının ve paparazzi etiğinin küresel çapta sorgulanmasına yol açtı.",
        tags: ["Paris", "kraliyet ailesi", "paparazzi"],
      },
    ],
    science: [
      {
        id: "sci-0831-helmholtz",
        year: 1821,
        field: "Fizik",
        title: "Hermann von Helmholtz doğdu",
        summary:
          "Fizikçi ve hekim Helmholtz, enerjinin korunumu yasasının modern formülasyonuna öncülük etti; göz ve kulağın nasıl çalıştığını inceleyen çalışmalarıyla fizyolojiyi de dönüştürdü. Görme üzerine icat ettiği oftalmoskop, gözün iç yapısını doktorların ilk kez canlı bir hastada görmesini sağladı — bugün hâlâ her göz muayenesinde kullanılan bir alet.",
      },
    ],
    talk: [
      {
        id: "talk-0831-1",
        category: "Karanlık Tarih",
        hook: "Üç dakikalık bir takip, bir prensesin hayatına mal oldu",
        body: "1997'de bugün, oteldeki kapıdan kaçmaya çalışan Diana'nın aracı, motosikletli paparazzilerden kurtulmaya çalışırken bir tünelde kontrolden çıktı. Sürücü alkollüydü, hız sınırının çok üzerindeydi. Emniyet kemeri takan tek kişi hayatta kaldı. On yıllarca süren komplo teorilerine rağmen resmî soruşturma basit ama acı bir gerçeğe vardı: pervasız hız ve bir takip. Bazen en büyük trajediler, en sıradan nedenlerden doğar.",
        minutes: 3,
      },
      {
        id: "talk-0831-2",
        category: "Bilim",
        hook: "Gözün içini görmemizi sağlayan alet, bugün doğan bir adamın icadı",
        body: "Helmholtz, enerjinin yoktan var olmadığı, sadece biçim değiştirdiği yasasının modern hâlini formülleştirdi. Ama günlük hayata en somut mirası başka bir icadı: oftalmoskop. Bu basit alet, doktorların ilk kez bir hastanın gözünün içine canlı canlı bakabilmesini sağladı. Bugün her göz muayenesinde kullanılan bu cihaz, 200 yıl önce doğan bir fizikçinin mirası.",
        minutes: 2,
      },
    ],
  },
};
