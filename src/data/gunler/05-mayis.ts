import type { CuratedDay } from "../types";

export const MAYIS: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "05-06": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "'Ah, insanlık!'",
      text: "6 Mayıs 1937'de dünyanın en büyük zeplini Hindenburg, New Jersey'de inişe geçerken alev aldı. Radyo spikeri Herbert Morrison'ın canlı yayındaki çığlığı, o günden beri felaketin sesi oldu.",
    },
    events: [
      {
        id: "ev-0506-hindenburg",
        year: 1937,
        text: "Alman hidrojen zeplini Hindenburg, Lakehurst Deniz Hava Üssü'ne inişe geçerken alev aldı; 36 saniye içinde tamamen yanıp yere çakıldı.",
        detail:
          "245 metre uzunluğundaki zeplin, Atlantik'i düzenli olarak aşan bir yolcu taşımacılığı aracıydı; o gün gemide 97 kişi vardı. Statik elektrik kıvılcımının, sızan hidrojen gazını tutuşturduğu düşünülüyor. Radyo muhabiri Herbert Morrison'ın olayı anlatırken sesinin kırılıp 'Ah, insanlık!' diye haykırması, canlı yayında kaydedilen felaketin sembolü oldu. Facia, 97 kişiden 35'inin ve yerdeki bir görevlinin ölümüne yol açtı; ticari zeplin çağını fiilen bitirdi.",
        category: "felaket",
        matchKeys: ["hindenburg", "lakehurst", "zeplin"],
      },
    ],
    cases: [
      {
        id: "case-0506-hindenburg",
        year: 1937,
        type: "felaket",
        title: "Hindenburg Faciası",
        location: "Lakehurst, New Jersey, ABD",
        status: "KAPANDI",
        summary:
          "Dünyanın en büyük hava aracı, inişe geçtiği anda alev alıp 36 saniyede küle döndü; görüntüler, o güne dek çekilmiş en çarpıcı felaket kayıtlarından biri oldu.",
        detail:
          "Zeplin, ucuz ve bol bulunan ama yanıcı hidrojen yerine güvenli helyum kullanabilirdi; ancak dönemin ABD ambargosu, askerî amaçlı kullanılabileceği gerekçesiyle Almanya'ya helyum satışını yasaklamıştı. Kazanın kesin nedeni — statik kıvılcım mı, sabotaj mı — tartışmalı kalsa da çoğu uzman kazayı kabul ediyor. Facia, o dönem gelişmekte olan uçak yolculuğunun zeplinlere karşı kesin üstünlük kazanmasının dönüm noktası oldu; ticari yolcu zeplinleri bir daha hiç eski itibarına kavuşamadı.",
        tags: ["Almanya", "havacılık", "35 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0506-freud",
        year: 1856,
        field: "Psikoloji",
        title: "Sigmund Freud doğdu",
        summary:
          "Nörologluktan psikanalize geçen Freud, bilinçaltı kavramını, rüya analizini ve terapi olarak 'konuşma tedavisini' bilime kazandırdı. Fikirlerinin çoğu sonradan bilimsel olarak sorgulandı veya çürütüldü, ama zihni anlama biçimimizi — ve gündelik dile 'Freudyen dil sürçmesi' gibi kavramları — kalıcı olarak değiştirdi.",
      },
    ],
    talk: [
      {
        id: "talk-0506-1",
        category: "Karanlık Tarih",
        hook: "'Ah, insanlık!' — canlı yayında kaydedilen bir çığlık",
        body: "1937'de bugün, radyo muhabiri Herbert Morrison Hindenburg'un inişini sakin bir sesle anlatırken zeplin aniden alev aldı. 36 saniyede her şey bitti. Morrison'ın sesi kırıldı, 'Ah, insanlık!' diye haykırdı — bu kayıt, tarihin ilk canlı felaket anonslarından biri oldu. Zeplin çağı, o 36 saniyede fiilen sona erdi.",
        minutes: 3,
      },
      {
        id: "talk-0506-2",
        category: "Karanlık Tarih",
        hook: "Güvenli gaz vardı ama satılmasına izin verilmedi",
        body: "Hindenburg, yanıcı hidrojen yerine güvenli helyum kullanabilirdi — ama ABD, askerî kaygılarla Almanya'ya helyum satışını yasaklamıştı. Zeplin bu yüzden en ucuz ve en tehlikeli gazla dolduruldu. Bir siyasi kararın, otuz beş hayata mal olan bir facianın arka planında durması, tarihin acı tesadüflerinden biri.",
        minutes: 2,
      },
      {
        id: "talk-0506-3",
        category: "Bilim",
        hook: "Dile 'sürçme' kavramını kazandıran adam",
        body: "Bugün doğan Freud, insan zihnini bilinçaltı, rüyalar ve bastırılmış arzular üzerinden okumaya çalıştı. Bilimsel yöntemleri sonradan çokça eleştirildi ama günlük konuşmamıza 'Freudyen dil sürçmesi' gibi kavramlar bıraktı. Bir düşünürün mirası bazen laboratuvarda değil, günlük dilde yaşamaya devam eder.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "05-18": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Geçmişin saklandığı gün",
      text: "18 Mayıs, dünyanın dört bir yanındaki müzelerin kapılarını ücretsiz açtığı gün. Uluslararası Müzeler Konseyi'nin 1977'de belirlediği bu tarih, artık 150'den fazla ülkede kutlanıyor.",
    },
    events: [
      {
        id: "ev-0518-muzelergunu",
        year: 1977,
        text: "Uluslararası Müzeler Konseyi (ICOM), toplumların müzelerle kurduğu bağı güçlendirmek amacıyla 18 Mayıs'ı Uluslararası Müzeler Günü ilan etti.",
        detail:
          "1946'da Paris'te kurulan ICOM, müzeciliği meslekî bir standarda kavuşturan ilk küresel örgüttü. Müzeler Günü, her yıl farklı bir tema etrafında kutlanır; birçok ülkede müzeler o gün ücretsiz ziyarete açılır, gece müze etkinlikleri düzenlenir. Türkiye'de kutlamalar 1982'den beri yapılıyor.",
        category: "kultur",
        matchKeys: ["müzeler günü", "icom"],
      },
      {
        id: "ev-0518-apollo10",
        year: 1969,
        text: "Apollo 10, iki ay sonraki asıl Ay inişinin 'genel provası' olarak fırlatıldı; mürettebat Ay yüzeyine 15 kilometreye kadar yaklaştı ama inmeden geri döndü.",
        detail:
          "Görev, iniş modülünün Ay yörüngesinde tüm manevraları güvenle yapabildiğini kanıtladı — yalnızca gerçek inişi yapmadılar. Mürettebattan Thomas Stafford, yıllar sonra 'inebilirdik ama yakıtımız dönüş için yetmezdi, NASA bilerek bizi ayarladı' diye şaka yapmıştı.",
        category: "kesif",
        matchKeys: ["apollo 10", "stafford"],
      },
    ],
    cases: [
      {
        id: "case-0518-tatar",
        year: 1944,
        type: "katliam",
        title: "Kırım Tatarlarının Sürgünü",
        location: "Kırım Yarımadası, SSCB",
        status: "KAPANDI",
        summary:
          "Stalin'in emriyle Kırım'daki tüm Tatar nüfus, birkaç saat içinde topluca trenlere bindirilip Orta Asya'ya sürüldü; yolculuk sırasında ve ilk yıllarda on binlercesi öldü.",
        detail:
          "NKVD birlikleri, Almanlarla iş birliği yaptıkları gerekçesiyle — ki bu suçlama nüfusun tamamı için toptan uygulandı — Kırım Tatarlarını evlerinden aldı, kapalı hayvan vagonlarına doldurup haftalarca süren bir yolculukla Özbekistan ve çevresine sürdü. Yolculukta su, yiyecek ve tıbbi bakım yoktu; tahminlere göre sürülenlerin yüzde 20'ye yakını ilk birkaç yıl içinde açlık ve hastalıktan öldü. Sürgün, 2004'te Ukrayna, 2015'te de Avrupa Parlamentosu tarafından soykırım olarak tanındı.",
        tags: ["Kırım", "Stalin", "sürgün"],
      },
    ],
    science: [
      {
        id: "sci-0518-hayyam",
        year: 1048,
        field: "Matematik ve Astronomi",
        title: "Ömer Hayyam doğdu",
        summary:
          "Bugün şairliğiyle tanınan Hayyam, aslında döneminin en önemli matematikçi ve astronomlarından biriydi: küp denklemlerin geometrik çözümünü geliştirdi, Miladi takvimden bile daha hassas bir güneş takvimi hazırladı. Rubaileri Batı'da yüzyıllar sonra tanındığında, bilim insanı kimliği şair kimliğinin gölgesinde kaldı.",
      },
    ],
    talk: [
      {
        id: "talk-0518-1",
        category: "Kültür",
        hook: "Dünyanın kapıları bir günlüğüne ücretsiz açılıyor",
        body: "1977'de belirlenen bu tarih, bugün 150'den fazla ülkede kutlanıyor: müzeler kapılarını ücretsiz açıyor, bazıları gece yarısına kadar ışıklarını söndürmüyor. Fikir basit: geçmişi saklayan yerler, herkese açık olmalı. Türkiye'de kutlamalar 1982'den beri sürüyor — kırk yılı aşkın bir gelenek.",
        minutes: 1,
      },
      {
        id: "talk-0518-2",
        category: "Karanlık Tarih",
        hook: "Bir halk, birkaç saatte evinden koparıldı",
        body: "1944'te bugün, Kırım'daki her Tatar aile, NKVD askerlerince aynı anda kapıları çalınıp birkaç saat içinde toplanıp trenlere bindirildi. Hayvan vagonlarında haftalarca süren yolculukta su ve yiyecek yoktu; sürülenlerin beşte biri ilk yıllarda öldü. Yıllar sonra bu olay soykırım olarak tanındı. Bir halkın tüm tarihi, tek bir gecede bir vagonun içine sıkıştırılabiliyor.",
        minutes: 3,
      },
      {
        id: "talk-0518-3",
        category: "Bilim",
        hook: "Rubaileri ünlü, ama asıl mesleği matematikti",
        body: "Ömer Hayyam denince akla dörtlükleri gelir ama o, döneminin en iyi matematikçilerinden biriydi — küp denklemleri geometriyle çözdü, kullandığımız takvimden bile daha hassas bir güneş takvimi tasarladı. Şiirleri Batı'da asırlar sonra keşfedildiğinde, bilimsel mirası gölgede kaldı. Bazı dehalar, tarihe yanlış kimlikle geçer.",
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
  "05-25": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "'Kolay olduğu için değil, zor olduğu için'",
      text: "25 Mayıs 1961'de Kennedy, Kongre'nin karşısına çıkıp on yıl içinde bir insanı Ay'a göndermeyi hedeflediklerini açıkladı. O gün ABD'nin toplam uzayda geçirdiği süre, henüz 15 dakikaydı.",
    },
    events: [
      {
        id: "ev-0525-kennedy",
        year: 1961,
        text: "Başkan John F. Kennedy, Kongre'nin özel ortak oturumunda 'bu on yıl bitmeden bir insanı Ay'a indirip güvenle Dünya'ya döndürme' hedefini açıkladı.",
        detail:
          "Konuşma, Sovyetler'in Gagarin'i uzaya göndermesinden altı hafta, ABD'nin başarısız Domuzlar Körfezi çıkarmasından bir ay sonra yapıldı. O ana kadar ABD'nin uzaydaki toplam deneyimi, Alan Shepard'ın 15 dakikalık alt-yörünge uçuşundan ibaretti. Hedef, NASA bütçesini kısa sürede kat kat artırdı; sekiz yıl sonra, 1969'da Apollo 11 ile gerçekleşti.",
        category: "kesif",
        matchKeys: ["kennedy", "ay'a", "kongre"],
      },
    ],
    cases: [
      {
        id: "case-0525-coventry",
        year: 1982,
        type: "felaket",
        title: "HMS Coventry'nin Batışı",
        location: "Falkland Adaları açıkları, Güney Atlantik",
        status: "KAPANDI",
        summary:
          "Falkland Savaşı sırasında Arjantin savaş uçaklarının attığı bombalarla vurulan İngiliz muhribi HMS Coventry, dakikalar içinde alabora olup battı; 19 denizci hayatını kaybetti.",
        detail:
          "Coventry, yanındaki gemiyi hava saldırılarından korumak için manevra yaparken kendisi hedef oldu; üç bomba teknenin su hattının altına isabet etti. Gemi 20 dakikadan kısa sürede yan yattı ve battı; soğuk sularda saatlerce bekleyen mürettebat komşu gemilerce kurtarıldı. Savaşın en ağır İngiliz deniz kayıplarından biri olan bu batış, modern savaş gemilerinin bile hava saldırılarına karşı ne kadar savunmasız olabileceğini gösterdi.",
        tags: ["Falkland Savaşı", "Royal Navy", "19 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0525-kennedy",
        year: 1961,
        field: "Uzay Politikası",
        title: "Bir konuşma, bir bütçeyi 500 kat artırdı",
        summary:
          "Kennedy'nin Ay hedefi, yalnızca bir söylemden ibaret değildi — NASA'nın bütçesini birkaç yıl içinde defalarca katladı, zirvede federal bütçenin yaklaşık yüzde 4'üne ulaştı. 400.000'i aşkın kişi programda çalıştı. Tarihte nadiren bir siyasi konuşma, bu denli somut ve ölçülebilir bir mühendislik hedefine dönüştü.",
        matchKeys: ["kennedy"],
      },
    ],
    talk: [
      {
        id: "talk-0525-1",
        category: "Uzay",
        hook: "15 dakikalık deneyimle, 10 yıllık bir söz",
        body: "1961'de Kennedy Kongre'ye çıktığında, ABD'nin toplam insanlı uzay deneyimi 15 dakikaydı — Alan Shepard'ın kısa alt-yörünge sıçraması. Buna rağmen başkan, on yıl içinde bir insanı Ay'a indirmeyi vaat etti. Sekiz yıl sonra, 1969'da söz tutuldu. Bazen en cüretkâr hedefler, en mütevazı başlangıç noktalarından doğar.",
        minutes: 2,
      },
      {
        id: "talk-0525-2",
        category: "Karanlık Tarih",
        hook: "Yirmi dakikada batan bir muhrip",
        body: "1982'de Falkland Savaşı'nda HMS Coventry, başka bir gemiyi korumaya çalışırken kendisi hedef oldu. Üç bomba su hattının altına isabet etti, gemi yirmi dakikadan kısa sürede alabora oldu. On dokuz denizci hayatını kaybetti, soğuk sularda bekleyenler komşu gemilerce kurtarıldı. Modern bir savaş gemisinin bu kadar hızlı batabilmesi, donanmalara sert bir ders oldu.",
        minutes: 2,
      },
    ],
  },
};
