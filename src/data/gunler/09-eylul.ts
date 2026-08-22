import type { CuratedDay } from "../types";

export const EYLUL: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "09-04": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Bir garajda kurulan arama motoru",
      text: "4 Eylül 1998'de iki Stanford doktora öğrencisi, bir arkadaşlarının garajında Google'ı kurdu. Şirketin ilk adı 'BackRub'dı — bugün dünyanın en çok kullanılan kelimelerinden biri.",
    },
    events: [
      {
        id: "ev-0904-google",
        year: 1998,
        text: "Larry Page ve Sergey Brin, web sayfalarını birbirine bağlayan linkleri analiz eden arama algoritmaları üzerine kurdukları şirketi resmen kaydettirdi: Google.",
        detail:
          "İkili, Stanford'da doktora tez konusu olarak başladıkları projeye önce 'BackRub' adını vermişti; sonra sonsuzu ifade eden matematik terimi 'googol'dan esinlenerek adı değiştirdiler. İlk ofisleri, arkadaşları Susan Wojcicki'nin Menlo Park'taki garajıydı — Wojcicki daha sonra şirketin üst düzey yöneticilerinden biri oldu. Şirket 2004'te halka arz edildiğinde değeri milyarlarca doları buldu.",
        category: "bilim",
        matchKeys: ["google", "larry page", "sergey brin"],
      },
      {
        id: "ev-0904-sivas",
        year: 1919,
        text: "Mustafa Kemal başkanlığında toplanan Sivas Kongresi, Erzurum Kongresi'nin kararlarını tüm yurdu kapsayacak şekilde genişletti ve 'manda ve himaye kabul olunamaz' ilkesini benimsedi.",
        detail:
          "Kongre, İstanbul hükümetinin baskılarına ve delegelerin şehre ulaşmasını engelleme girişimlerine rağmen toplandı; 'Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti' bu kongrede kuruldu. Kararlar, birkaç ay sonra toplanacak son Osmanlı Meclis-i Mebusanı'nda kabul edilecek Misak-ı Millî'nin temelini oluşturdu.",
        category: "siyaset",
        matchKeys: ["sivas kongresi", "mustafa kemal"],
      },
    ],
    cases: [
      {
        id: "case-0904-farc",
        year: 1996,
        type: "katliam",
        title: "Las Delicias Baskını",
        location: "Guaviare bölgesi, Kolombiya",
        status: "KAPANDI",
        summary:
          "FARC gerillaları, Kolombiya ordusuna ait bir askerî üsse baskın düzenledi; üç hafta süren çatışmalarda en az 130 kişi hayatını kaybetti, onlarca asker rehin alındı.",
        detail:
          "Baskın, o zamana dek FARC'ın ordu birliklerine karşı düzenlediği en büyük ve en iyi koordine edilmiş saldırılardan biriydi; üs, gerillaların ele geçirdiği ağır silahlarla günlerce kuşatma altında kaldı. Rehin alınan askerler, aylar süren müzakerelerin ardından serbest bırakıldı. Baskın, Kolombiya'nın onlarca yıl süren iç savaşının en kanlı dönemlerinden birinin başlangıç noktalarından sayılır.",
        tags: ["Kolombiya", "FARC", "iç savaş"],
      },
    ],
    science: [
      {
        id: "sci-0904-roma",
        year: 476,
        field: "Tarih",
        title: "Batı Roma İmparatorluğu'nun sonu",
        summary:
          "Cermen komutan Odoacer, son Batı Roma imparatoru — henüz bir çocuk olan Romulus Augustulus'u — tahttan indirdi. İmparator öldürülmedi, bir emekli maaşıyla sürgüne gönderildi. 1000 yılı aşkın süredir Akdeniz dünyasını yöneten bir devlet, dramatik bir savaşla değil, sessiz bir tahttan indirmeyle sona ermiş oldu.",
      },
    ],
    talk: [
      {
        id: "talk-0904-1",
        category: "Bilim",
        hook: "Bir garaj kirası, bir imparatorluğun başlangıcıydı",
        body: "1998'de iki Stanford öğrencisi, bir arkadaşlarının garajında bir şirket kurdu. İlk adları 'BackRub'dı; sonradan sonsuzu ifade eden bir matematik teriminden esinlenip 'Google' dediler. O garaj kirası, bugün trilyon dolarlık bir şirketin ilk adresiydi. Bazı devrimler, ofis kirasını bile karşılayamayan iki öğrenciyle başlar.",
        minutes: 2,
      },
      {
        id: "talk-0904-2",
        category: "Tarih",
        hook: "'Manda ve himaye kabul olunamaz'",
        body: "1919'da Sivas'ta toplanan kongre, İstanbul hükümetinin engellemelerine rağmen bir araya geldi ve tam bağımsızlık ilkesini benimsedi: hiçbir devletin himayesi veya mandası kabul edilmeyecekti. Bu karar, birkaç yıl sonra kurulacak cumhuriyetin temel taşlarından biri oldu. Bazen bir taşra kentindeki küçük bir salon, bir ülkenin geleceğini belirler.",
        minutes: 2,
      },
      {
        id: "talk-0904-3",
        category: "Tarih",
        hook: "Bir imparatorluk, gürültüsüzce bitti",
        body: "MS 476'da bugün, Batı Roma'nın son imparatoru — henüz bir çocuk — tahttan indirildi. Ne büyük bir savaş oldu, ne de imparator öldürüldü; sadece bir emekli maaşıyla kenara çekildi. 1000 yılı aşkın süredir dünyayı şekillendiren bir devlet, bir savaş meydanında değil, sessiz bir el değiştirmeyle tarihe karıştı. Bazı sonlar, gürültüyle değil sessizce gelir.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "09-09": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Rıhtımda çekilen bayrak",
      text: "9 Eylül 1922 sabahı Türk ordusu İzmir'e girdi; üç yıl üç aydır süren Yunan işgali dakikalar içinde sona erdi. Kurtuluş Savaşı, fiilen bu sabah bitti.",
    },
    events: [
      {
        id: "ev-0909-izmir",
        year: 1922,
        text: "Türk ordusu İzmir'e girdi; Yüzbaşı Şerafettin Bey'in birliği Hükümet Konağı'na ulaşıp alay bayrağını göndere çekti, üç yılı aşkın Yunan işgali sona erdi.",
        detail:
          "26 Ağustos'ta Kocatepe'den başlayan Büyük Taarruz, Dumlupınar'daki Başkomutanlık Meydan Muharebesi'nin ardından on üç gün içinde İzmir'e ulaştı. 15 Mayıs 1919'da başlayan işgal tam olarak üç yıl üç ay yirmi dört gün sürmüştü. Şehre ilk giren birliklerin başında Yüzbaşı Şerafettin Bey vardı; Teğmen Ali Rıza Akıncı, Teğmen Hamdi Yurteri ve Çavuş Mehmet Raşit ile birlikte Hükümet Konağı'na bayrağı çekti. Bu giriş, Mudanya Mütarekesi ve ardından Lozan'a giden sürecin fiilen başlangıcı sayılır.",
        category: "savas",
        matchKeys: ["izmir'in kurtuluşu", "hükümet konağı"],
      },
      {
        id: "ev-0909-chp",
        year: 1923,
        text: "Mustafa Kemal, İzmir'in kurtuluşunun birinci yıl dönümünde Ankara'da Halk Fırkası'nı (bugünkü Cumhuriyet Halk Partisi'nin çekirdeği) kurdu.",
        detail:
          "Cumhuriyetin ilanından altı hafta önce kurulan parti, tek dereceli seçim ve halk egemenliği ilkelerini savunuyordu. Kuruluş tarihinin bilinçli olarak İzmir'in kurtuluş yıl dönümüne denk getirildiği kabul edilir. Parti, birkaç ay içinde adını Cumhuriyet Halk Fırkası'na, sonra Cumhuriyet Halk Partisi'ne çevirecekti.",
        category: "siyaset",
        matchKeys: ["halk fırkası", "cumhuriyet halk"],
      },
    ],
    cases: [
      {
        id: "case-0909-treznea",
        year: 1940,
        type: "katliam",
        title: "Treznea Katliamı",
        location: "Treznea, Erdel (bugünkü Romanya)",
        status: "KAPANDI",
        summary:
          "Kuzey Erdel'in Macaristan'a bırakılmasının hemen ardından, Macar ordusu köye baskın yaptı; onlarca Romen ve Yahudi köylü öldürüldü.",
        detail:
          "II. Viyana Hakemliği'yle bölge Macaristan'a devredilince, giren Macar birlikleri köyde bir olayı bahane ederek sivillere yöneldi. Baskında 80'i aşkın Romen köylü ve bir grup Yahudi öldürüldü; köyün kilisesi yakıldı, kaçmaya çalışan onlarca kişi bir uçurumdan aşağı sürüldü. Katliam, II. Dünya Savaşı sırasında Kuzey Erdel'de yaşanan etnik şiddetin en çok belgelenen örneklerinden biri olarak tarihe geçti; savaş sonrası bölge yeniden Romanya'ya bağlandı.",
        tags: ["II. Dünya Savaşı", "Erdel", "etnik şiddet"],
      },
    ],
    science: [
      {
        id: "sci-0909-amalthea",
        year: 1892,
        field: "Astronomi",
        title: "Jüpiter'in beşinci uydusu Amalthea keşfedildi",
        summary:
          "Edward Emerson Barnard, Kaliforniya'daki Lick Gözlemevi'nde 36 inçlik bir teleskopla Jüpiter'i incelerken küçük bir uydu fark etti. Amalthea, 1609'da Galileo'dan bu yana yalnızca gözle (fotoğraf olmadan) keşfedilen son gezegen uydusu oldu — ondan sonraki tüm keşifler fotoğraf plakalarıyla yapıldı.",
      },
    ],
    talk: [
      {
        id: "talk-0909-1",
        category: "Tarih",
        hook: "Bir bayrak direği, üç yıllık işgali bitirdi",
        body: "9 Eylül 1922 sabahı, İzmir Hükümet Konağı'na koşan bir yüzbaşı ve üç arkadaşı alay bayrağını göndere çekti. Üç yıl üç ay süren Yunan işgali dakikalar içinde sona ermişti. Büyük Taarruz'un başladığı Kocatepe'den buraya sadece on üç gün geçmişti. Bir ordunun üç yılda yapamadığını, on üç günde tamamlayan taarruzun son sahnesiydi bu.",
        minutes: 3,
      },
      {
        id: "talk-0909-2",
        category: "Tarih",
        hook: "Bir parti, bilerek zaferin yıl dönümünde kuruldu",
        body: "1923'te bugün, İzmir'in kurtuluşunun tam bir yıl sonrasında Mustafa Kemal Ankara'da yeni bir parti kurdu — bugünkü Cumhuriyet Halk Partisi'nin çekirdeği. Tarihin rastgele seçilmediği açıktı: zaferin yıl dönümü, yeni bir siyasi düzenin de başlangıcı olsun istenmişti. Altı hafta sonra cumhuriyet ilan edilecekti. Semboller, bazen kanunlardan daha kalıcı mesajlar taşır.",
        minutes: 2,
      },
      {
        id: "talk-0909-3",
        category: "Karanlık Tarih",
        hook: "Bir sınır değişince, bir köy hedef oldu",
        body: "1940'ta Kuzey Erdel Macaristan'a bırakılınca, giren ordu bir köyde sivillere yöneldi. Seksenden fazla Romen köylü ve bir grup Yahudi öldürüldü, kilise yakıldı. II. Dünya Savaşı'nın gölgesinde kalan bu katliam, savaş tarihinin en az anlatılan sayfalarından biri. Sınırlar kâğıt üzerinde çizilir ama bedelini her zaman sıradan insanlar öder.",
        minutes: 2,
      },
      {
        id: "talk-0909-4",
        category: "Uzay",
        hook: "Galileo'dan 283 yıl sonra, gözle görülen son keşif",
        body: "1892'de bir gözlemci, teleskopla Jüpiter'e bakarken küçük bir ışık noktası fark etti: Amalthea, gezegenin beşinci uydusu. Galileo'nun 1609'da dört uydu bulmasından bu yana geçen 283 yılda kimse çıplak gözle yeni bir Jüpiter uydusu bulamamıştı. Ondan sonraki her keşif fotoğraf makinesiyle yapıldı — Amalthea, insan gözünün evrende bulduğu son şey oldu.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "09-11": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "İki saatte çöken kuleler",
      text: "11 Eylül 2001 sabahı, dört yolcu uçağı kaçırıldı. İkisi New York'taki İkiz Kuleler'e çarptı; iki saatten kısa sürede, 110 katlı iki gökdelen büyük bir toz bulutuna dönüştü.",
    },
    events: [
      {
        id: "ev-0911-attacks",
        year: 2001,
        text: "El Kaide'ye bağlı 19 kişi dört yolcu uçağını kaçırdı; ikisi New York'taki Dünya Ticaret Merkezi kulelerine, biri Pentagon'a çarptı, dördüncüsü yolcuların müdahalesiyle Pennsylvania'da düştü.",
        detail:
          "İlk uçak yerel saatle 08.46'da Kuzey Kulesi'ne, ikincisi 09.03'te Güney Kulesi'ne çarptı; canlı yayında izleyen dünya, ikinci çarpmanın bir kaza olmadığını o an anladı. 09.37'de üçüncü uçak Pentagon'u vurdu. Dördüncü uçaktaki yolcular, kokpite ulaşmaya çalışan kaçıranlara karşı direnince uçak boş bir alana düştü. Saldırılarda toplam 2.977 kişi hayatını kaybetti; olay, ABD'nin dış politikasını ve küresel güvenlik anlayışını kalıcı olarak değiştirdi.",
        category: "felaket",
        matchKeys: ["11 eylül", "dünya ticaret merkezi", "el kaide"],
      },
    ],
    cases: [
      {
        id: "case-0911-attacks",
        year: 2001,
        type: "katliam",
        title: "11 Eylül Saldırıları",
        location: "New York, Washington D.C. ve Pennsylvania, ABD",
        status: "ÇÖZÜLDÜ",
        summary:
          "Tarihin en ölümcül terör saldırısında dört uçak kaçırıldı; İkiz Kuleler çöktü, Pentagon hasar gördü, toplam 2.977 kişi hayatını kaybetti.",
        detail:
          "Soruşturma, saldırıları El Kaide lideri Usame bin Ladin'in planladığını ortaya koydu; bin Ladin, saldırıdan neredeyse on yıl sonra, 2011'de Pakistan'da düzenlenen bir ABD operasyonunda öldürüldü. Kurtarma çalışmalarına katılan binlerce itfaiyeci ve gönüllü, enkazdaki toksik tozun yol açtığı solunum hastalıkları ve kanserlerle yıllarca mücadele etti. Saldırılar, ABD'nin Afganistan ve Irak'a müdahalesinin, havaalanı güvenlik önlemlerinin ve küresel istihbarat işbirliğinin doğrudan tetikleyicisi oldu.",
        tags: ["terör", "New York", "2.977 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0911-mgs",
        year: 1997,
        field: "Uzay",
        title: "Mars Global Surveyor, Mars yörüngesine girdi",
        summary:
          "NASA'nın Mars Global Surveyor uydusu, ana motorunu 22 dakika çalıştırarak Mars yörüngesine yerleşti. Sonraki dokuz yıl boyunca gezegenin 240.000'den fazla fotoğrafını Dünya'ya gönderdi; bu görüntüler, Mars'ın yüzeyinde bir zamanlar suyun aktığına dair en güçlü kanıtları sağladı.",
      },
    ],
    talk: [
      {
        id: "talk-0911-1",
        category: "Karanlık Tarih",
        hook: "İki saatten kısa sürede çöken 110 kat",
        body: "11 Eylül 2001 sabahı, milyonlarca insan televizyon başında ikinci uçağın kuleye çarpışını canlı izledi. 08.46'dan 10.28'e kadar geçen sürede, iki 110 katlı gökdelen büyük bir toz bulutuna dönüştü. 2.977 kişi hayatını kaybetti. O sabah, havaalanı güvenliğinden dış politikaya kadar dünyanın pek çok şeyi kalıcı olarak değişti — tek bir sabahın bu kadar çok şeyi değiştirdiği az örnek vardır.",
        minutes: 3,
      },
      {
        id: "talk-0911-2",
        category: "Uzay",
        hook: "Aynı gün, Mars'ta sessiz bir başarı",
        body: "1997'de bugün, Dünya'dan 190 milyon kilometre uzakta bir uydu, motorunu 22 dakika ateşleyip Mars yörüngesine yerleşti. Sonraki yıllarda gönderdiği 240.000 fotoğraf, kızıl gezegende bir zamanlar suyun aktığını kanıtladı. Aynı takvim yaprağı, insanlığın hem en karanlık hem en meraklı yüzünü taşıyabiliyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "09-30": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Belh'ten Konya'ya bir yolculuk",
      text: "30 Eylül 1207'de Horasan'ın Belh şehrinde bir çocuk doğdu. Ailesi onu küçük yaşta Anadolu'ya götürecek, dünya onu yüzyıllar sonra Mevlana diye anacaktı.",
    },
    events: [
      {
        id: "ev-0930-mevlana",
        year: 1207,
        text: "Celaleddin Muhammed, sonradan 'Mevlana' (efendimiz) unvanıyla anılacağı, bugünkü Afganistan sınırları içindeki Belh şehrinde doğdu.",
        detail:
          "Ailesi, Moğol istilası tehdidi büyürken doğduğu şehri terk edip uzun bir göç yoluyla Anadolu'ya, sonunda Konya'ya yerleşti. Mevlana, babasının ölümünün ardından onun yerine geçip ders vermeye başladı; gezgin derviş Tebrizli Şems ile tanışması, onu klasik bir din âliminden 'Mesnevi' ve 'Divan-ı Kebir' gibi eserlerin yazarı bir mutasavvıf şaire dönüştürdü. Öğretileri, 'sevgi ve hoşgörü' vurgusuyla yüzyıllar sonra dünya çapında okunmaya devam ediyor.",
        category: "kultur",
        matchKeys: ["mevlana", "celaleddin", "konya"],
      },
    ],
    cases: [
      {
        id: "case-0930-jamesdean",
        year: 1955,
        type: "felaket",
        title: "James Dean'in Ölümcül Kazası",
        location: "Cholame yakınları, Kaliforniya, ABD",
        status: "KAPANDI",
        summary:
          "24 yaşındaki oyuncu James Dean, kendi kullandığı spor otomobille bir kavşakta karşı yönden gelen araçla çarpıştı ve olay yerinde hayatını kaybetti.",
        detail:
          "Dean, henüz üç filmiyle Hollywood'un en parlak yeni yıldızlarından biri olmuştu; kaza sırasında 'Dev' filminin gösterime girmesini bile göremedi. Karşı yöndeki sürücü, alacakaranlıkta Dean'in gümüş rengi arabasını fark edemediğini söyledi. Ölümü, genç yaşta giden bir 'efsane' imajını pekiştirdi ve onu popüler kültürde asla yaşlanmayan bir gençlik simgesine dönüştürdü.",
        tags: ["Hollywood", "trafik kazası", "Kaliforniya"],
      },
    ],
    science: [
      {
        id: "sci-0930-eter",
        year: 1846,
        field: "Tıp",
        title: "Anestezinin ilk sessiz denemesi",
        summary:
          "Diş hekimi William Morton, hastası Eben Frost'a eter koklatıp ağrısız bir diş çekimi gerçekleştirdi — anestezinin ilk başarılı kullanımlarından biriydi. Bu sessiz deneme, iki hafta sonra Massachusetts General Hospital'da halka açık ve ünlenen bir ameliyatla ('Ether Day') dünyaya duyurulacak, cerrahiyi acıyla eş anlamlı olmaktan çıkaracaktı.",
      },
    ],
    talk: [
      {
        id: "talk-0930-1",
        category: "Kültür",
        hook: "Bir istiladan kaçan aile, bir mutasavvıfı doğurdu",
        body: "1207'de Belh'te doğan çocuk, Moğol istilası tehdidiyle ailesiyle göç etmek zorunda kaldı; yıllar sonra Konya'ya yerleşti. Bir gezgin dervişle karşılaşması, onu klasik bir din âliminden dünya çapında okunan bir şaire dönüştürdü. Bugün doğduğu şehir bile artık ayrı bir ülkede, ama öğretileri hâlâ sınır tanımıyor.",
        minutes: 2,
      },
      {
        id: "talk-0930-2",
        category: "Karanlık Tarih",
        hook: "Bir filmi göremeden giden genç yıldız",
        body: "1955'te bugün, henüz 24 yaşındaki James Dean, kendi kullandığı arabayla bir kavşakta çarpıştı. O sıra çekimleri süren 'Dev' filmini hiç göremeden öldü. Kazası, onu sinema tarihinin hiç yaşlanmayan simgelerinden birine dönüştürdü — bazı efsaneler, tam da erken bitişleriyle ölümsüzleşir.",
        minutes: 2,
      },
      {
        id: "talk-0930-3",
        category: "Bilim",
        hook: "Halka açıklanmadan önce, sessizce test edilen bir devrim",
        body: "1846'da bugün bir diş hekimi, hastasına eter koklatıp acısız bir diş çekimi yaptı — kimse bunu henüz bilmiyordu. İki hafta sonra aynı yöntem, büyük bir hastanede halka açık şekilde gösterildi ve 'Ether Day' olarak tarihe geçti. Ama gerçek ilk adım, sessiz bir muayenehanede, kimsenin alkışlamadığı bir günde atılmıştı.",
        minutes: 2,
      },
    ],
  },
};
