import type { CuratedDay } from "../types";

export const ARALIK: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "12-08": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Dakota'nın önünde beş kurşun",
      text: "8 Aralık 1980 akşamı John Lennon, birkaç saat önce plağını imzaladığı bir hayranı tarafından evinin önünde vuruldu. Bir Beatle'ın sesi, kendi hayranının silahıyla sustu.",
    },
    events: [
      {
        id: "ev-1208-lennon",
        year: 1980,
        text: "John Lennon, New York'taki Dakota binasının önünde eşi Yoko Ono ile eve dönerken Mark David Chapman tarafından dört kez vuruldu ve hastaneye kaldırılırken hayatını kaybetti.",
        detail:
          "Chapman, aynı gün öğleden önce Lennon'dan bir albüm kapağını imzalatmış, saatlerce bina önünde beklemişti. Lennon vurulduktan sonra güvenlik kulübesine kadar birkaç basamak çıkıp 'Vuruldum' diyebildi. Chapman, olay yerinden kaçmadı; polis gelene kadar kitap okuyarak bekledi. Cinayet, dünya çapında müzik tarihinin en travmatik anlarından biri olarak anıldı; Central Park'ta 'Strawberry Fields' anıtı bugün hâlâ hayranların uğrak yeri.",
        category: "kultur",
        matchKeys: ["john lennon", "dakota", "chapman"],
      },
      {
        id: "ev-1208-bdt",
        year: 1991,
        text: "Rusya, Ukrayna ve Belarus liderleri, Belovej Ormanı'nda imzaladıkları anlaşmayla SSCB'nin dağıldığını ve yerine Bağımsız Devletler Topluluğu'nun kurulduğunu ilan etti.",
        detail:
          "Anlaşma, Gorbaçov'un hâlâ SSCB devlet başkanı olduğu bir sırada, onun haberi bile olmadan imzalandı; üç cumhuriyet lideri fiilen birliği ortadan kaldırdı. Gorbaçov, on yedi gün sonra istifa etmek zorunda kalacaktı.",
        category: "siyaset",
        matchKeys: ["bağımsız devletler topluluğu", "belovej"],
      },
    ],
    cases: [
      {
        id: "case-1208-lennon",
        year: 1980,
        type: "cinayet",
        title: "John Lennon Cinayeti",
        location: "New York, ABD — The Dakota önü",
        status: "ÇÖZÜLDÜ",
        summary:
          "25 yaşındaki Mark David Chapman, günlerce takip ettiği Lennon'ı beş el ateş ederek öldürdü; polise teslim olurken bir kitap okuyordu.",
        detail:
          "Chapman, mahkemede suçunu kabul etti ve akıl hastalığı savunmasını reddederek 20 yıldan ömür boyuna kadar hapis cezası aldı. Cinayet sebebini hiçbir zaman net biçimde açıklamadı; Lennon'ın yıllar önceki 'Beatles İsa'dan daha popüler' sözünden duyduğu öfkeyle ünlülük saplantısının karıştığı öne sürüldü. Chapman, 2000'den bu yana düzenli aralıklarla şartlı tahliye başvurusunda bulunuyor, hiçbiri kabul edilmedi.",
        tags: ["New York", "müzik", "Beatles"],
      },
    ],
    science: [
      {
        id: "sci-1208-whitney",
        year: 1765,
        field: "Mühendislik",
        title: "Eli Whitney doğdu",
        summary:
          "Whitney'nin icat ettiği çırçır makinesi, pamuktan çekirdek ayıklama hızını elli kata çıkararak pamuğu ABD'nin en kârlı ürünü hâline getirdi. Ama icat, ironik bir şekilde köleliği azaltmak yerine büyüttü — artan pamuk talebi, güney eyaletlerinde köle emeğine olan ihtiyacı katladı. Whitney'nin kendisi patent davalarında parasının çoğunu kaybetti; makinesinin tarihe bıraktığı iz, hem teknolojik hem karanlık.",
      },
    ],
    talk: [
      {
        id: "talk-1208-1",
        category: "Karanlık Tarih",
        hook: "Saatlerce önce imza attığı hayranı, onu öldürdü",
        body: "1980'de bugün, Lennon öğleden önce bir hayranının albüm kapağını imzalamıştı. Aynı hayran, akşam eve dönüşünde onu beş el ateşle vurdu. Lennon, güvenlik kulübesine kadar birkaç adım atıp 'Vuruldum' diyebildi. Katil, kaçmak yerine polis gelene kadar kitap okuyarak bekledi. Bir imzanın verildiği an ile bir hayatın bittiği an arasında yalnızca birkaç saat vardı.",
        minutes: 3,
      },
      {
        id: "talk-1208-2",
        category: "Tarih",
        hook: "Bir imza, bir devletin sonunu ilan etti",
        body: "1991'de bugün, üç cumhuriyet lideri bir ormanda buluşup Sovyetler Birliği'nin artık var olmadığını ilan etti — hâlâ görevdeki devlet başkanı Gorbaçov'un haberi bile yoktu. On yedi gün sonra o da istifa etmek zorunda kaldı. Bazen bir imparatorluk, savaş meydanında değil, bir ormanlık alanda imzalanan bir kâğıtla biter.",
        minutes: 2,
      },
      {
        id: "talk-1208-3",
        category: "Bilim",
        hook: "Bir icat, hem ekonomiyi büyüttü hem köleliği",
        body: "Bugün doğan Eli Whitney'nin çırçır makinesi, pamuk üretimini elli kat hızlandırdı — ama bu 'ilerleme', güney eyaletlerinde köle emeğine olan talebi de katladı. Whitney'nin niyeti bu değildi; makinesinin patent haklarını korumaya çalışırken parasının çoğunu davalarda kaybetti. Bazı icatların mirası, mucidinin hayal ettiğinden çok daha karmaşık ve karanlık olabiliyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-10": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Paris'te 30 madde",
      text: "10 Aralık 1948'de Birleşmiş Milletler, Paris'te 30 maddelik bir bildirge kabul etti: İnsan Hakları Evrensel Beyannamesi. Savaşın enkazından, herkesin hakkı olan bir liste çıktı.",
    },
    events: [
      {
        id: "ev-1210-ihei",
        year: 1948,
        text: "Birleşmiş Milletler Genel Kurulu, Paris'te İnsan Hakları Evrensel Beyannamesi'ni kabul etti; 58 üyeden 48'i evet oyu verdi, karşı oy çıkmadı.",
        detail:
          "Komiteye Eleanor Roosevelt başkanlık etti; metin, II. Dünya Savaşı'nın vahşetinin ardından 'bir daha asla' fikriyle kaleme alındı. Sekiz ülke çekimser kaldı, iki ülke oylamaya katılmadı ama hiçbir devlet açıkça karşı çıkmadı. Bağlayıcı bir antlaşma değildi ama zamanla 500'den fazla dile çevrildi ve pek çok ulusal anayasaya, uluslararası sözleşmeye temel oluşturdu.",
        category: "siyaset",
        matchKeys: ["insan hakları evrensel beyannamesi", "birleşmiş milletler"],
      },
    ],
    cases: [
      {
        id: "case-1210-pinochet",
        year: 2006,
        type: "skandal",
        title: "Pinochet: Yargılanmadan Ölen Diktatör",
        location: "Santiago, Şili",
        status: "KAPANDI",
        summary:
          "Şili'yi 17 yıl demir yumrukla yöneten Augusto Pinochet, hakkında yaklaşık 300 suç duyurusu sürerken, tam da İnsan Hakları Günü'nde kalp krizinden öldü.",
        detail:
          "Pinochet döneminde resmî rakamlara göre en az 3.095 kişi öldürüldü veya kayboldu, on binlerce kişi işkence gördü ya da siyasi nedenlerle tutuklandı. 1998'de Londra'da tutuklanması uluslararası insan hakları hukukunda dönüm noktası sayıldı, ama sağlık gerekçesiyle serbest bırakıldı. Şili'ye döndüğünde yeniden açılan davalar hiçbir zaman sonuçlanmadan, 10 Aralık 2006'da öldü — dünyanın İnsan Hakları Günü'nü kutladığı gün. Ölümü, uluslararası hukukun diktatörleri gerçekten hesaba çekip çekemediği tartışmasını yeniden alevlendirdi.",
        tags: ["Şili", "diktatörlük", "insan hakları", "cezasızlık"],
      },
    ],
    science: [
      {
        id: "sci-1210-nobel",
        year: 1901,
        field: "Bilim ödülleri",
        title: "İlk Nobel Ödülleri sahiplerini buldu",
        summary:
          "Alfred Nobel'in 1896'daki ölümünün yıl dönümünde verilmeye başlanan Nobel Ödülleri, ilk kez 10 Aralık 1901'de fizik, kimya, tıp, edebiyat ve barış dallarında sahiplerini buldu. Nobel, vasiyetinde servetinin 'insanlığa en büyük faydayı sağlayanlara' bırakılmasını istemişti; o günden beri tören her yıl aynı tarihte, onun ölüm yıl dönümünde yapılıyor.",
      },
    ],
    talk: [
      {
        id: "talk-1210-1",
        category: "Tarih",
        hook: "Savaşın enkazından çıkan 30 madde",
        body: "1948'de bugün, Paris'te 58 ülkeden 48'i bir listeye evet dedi: herkesin, nerede doğduğuna bakılmaksızın sahip olduğu haklar. İnsan Hakları Evrensel Beyannamesi bağlayıcı bir antlaşma değildi ama 500'den fazla dile çevrildi, onlarca anayasaya girdi. İki dünya savaşının ardından insanlığın kendine yazdığı bir hatırlatma notuydu: bir daha asla.",
        minutes: 2,
      },
      {
        id: "talk-1210-2",
        category: "Karanlık Tarih",
        hook: "İnsan Hakları Günü'nde ölen diktatör",
        body: "Şili'yi 17 yıl yöneten Pinochet, döneminde binlerce kişinin öldürülmesinden veya kaybolmasından sorumlu tutuluyordu. Hakkında yüzlerce dava sürerken, hiçbirinin sonucunu görmeden 10 Aralık 2006'da öldü — dünyanın tam da İnsan Hakları Günü'nü kutladığı gün. Bu tesadüf, adaletin bazen kağıt üzerinde kalabildiğinin en çarpıcı hatırlatıcılarından biri oldu.",
        minutes: 2,
      },
      {
        id: "talk-1210-3",
        category: "Bilim",
        hook: "Bir ölüm yıl dönümü, dünyanın en prestijli ödülü oldu",
        body: "Alfred Nobel, dinamitin mucidi olarak hatırlanmak istemedi; vasiyetinde servetini 'insanlığa en büyük faydayı sağlayanlara' bıraktı. 1901'de bugün, ölümünün beşinci yıl dönümünde ilk Nobel Ödülleri verildi. O günden beri tören hep aynı tarihte yapılıyor — bir insanın ölüm günü, yüz yılı aşkın süredir bilimin ve barışın kutlandığı gün oldu.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "56 gün, dört kişi, bir kutup",
      text: "14 Aralık 1911'de Roald Amundsen ve dört arkadaşı, köpek kızaklarıyla Güney Kutbu'na ulaşan ilk insanlar oldu — rakip İngiliz ekibinden tam 35 gün önce.",
    },
    events: [
      {
        id: "ev-1214-amundsen",
        year: 1911,
        text: "Norveçli kâşif Roald Amundsen ve dört arkadaşı, 56 günlük bir yolculuğun ardından Güney Kutbu'na ulaştı; oraya Norveç bayrağını dikti.",
        detail:
          "Amundsen, dört kızak ve 52 köpekle 19 Ekim'de yola çıkmış, dik bir buzulu tırmanarak Antarktika Platosu'na ulaşmıştı. Rakip İngiliz kâşif Robert Falcon Scott'ın ekibi kutba 35 gün sonra vardı ve dönüş yolunda tamamı hayatını kaybetti. Amundsen'in başarısı, ancak aylar sonra Avustralya'ya döndüğünde bir telgrafla dünyaya duyurulabildi — o dönemde kutup bölgelerinden anlık haber almak mümkün değildi.",
        category: "kesif",
        matchKeys: ["amundsen", "güney kutbu"],
      },
    ],
    cases: [
      {
        id: "case-1214-konstantinopolis",
        year: 557,
        type: "felaket",
        title: "Konstantinopolis Depremi",
        location: "Konstantinopolis (İstanbul), Bizans İmparatorluğu",
        status: "KAPANDI",
        summary:
          "Dönemin tarihçisi Prokopius'un kroniklerine göre şehri neredeyse tümüyle yıkan büyük bir deprem, Ayasofya'nın kubbesinde de çatlaklara yol açtı; kubbe ertesi yıl çöktü.",
        detail:
          "İmparator Justinianus döneminde inşa edilen Ayasofya, henüz yirmi yaşındaydı. Depremin oluşturduğu çatlaklar zamanla büyüdü ve 558'de bir artçı sarsıntıyla kubbenin bir bölümü çöktü; mimar Genç İsidoros, kubbeyi daha hafif malzemeyle ve daha dik bir açıyla yeniden inşa etti — bugün gördüğümüz kubbe, o onarımın ürünü. Depremin şehir surlarında açtığı gedikler, sonraki yıllarda Hun akınlarının kolaylaşmasına da yol açtı. Antik kaynaklara dayanan bu olayların kesin ölçeği bilinmese de dönemin kroniklerinde 'şehir neredeyse tümüyle yıkıldı' diye anlatılır.",
        tags: ["Bizans", "Ayasofya", "İstanbul"],
      },
    ],
    science: [
      {
        id: "sci-1214-mariner2",
        year: 1962,
        field: "Uzay",
        title: "Mariner 2, Venüs'ün yanından geçti",
        summary:
          "NASA'nın Mariner 2 uzay aracı, başka bir gezegenin yanından başarıyla geçen ilk araç oldu; Venüs'ün yüzey sıcaklığının önceki tahminlerin çok üzerinde, kurşunu eritecek kadar yüksek olduğunu ölçtü. Görev, 'ikiz gezegen' sanılan Venüs'ün aslında Dünya'dan ne kadar farklı, yaşama elverişsiz bir dünya olduğunu ilk kez kanıtladı.",
        matchKeys: ["mariner-2", "mariner 2"],
      },
    ],
    talk: [
      {
        id: "talk-1214-1",
        category: "Keşif",
        hook: "35 gün fark, tarihin kaydettiği tek isim",
        body: "1911'de bugün Amundsen ve dört arkadaşı Güney Kutbu'na ulaştı. Rakip İngiliz kâşif Scott'ın ekibi kutba 35 gün sonra vardı — ve dönüş yolunda hepsi dondu. Amundsen'in başarısı aylar sonra bir telgrafla duyulabildi. Keşif tarihinin en acımasız kuralı budur: ikinci olmak, bazen hayatınıza mal olur.",
        minutes: 2,
      },
      {
        id: "talk-1214-2",
        category: "Karanlık Tarih",
        hook: "Bir depremin izi, bugünkü kubbede hâlâ duruyor",
        body: "557'de bugün yaşandığı aktarılan büyük deprem, henüz yirmi yaşındaki Ayasofya'nın kubbesinde çatlaklar açtı; ertesi yıl kubbe çöktü. Mimar, yeniden inşa ederken kubbeyi daha hafif ve daha dik yaptı. Bugün Ayasofya'ya girip yukarı baktığınızda gördüğünüz kubbe, aslında 1500 yıl önceki bir depremin dolaylı eseri.",
        minutes: 2,
      },
      {
        id: "talk-1214-3",
        category: "Uzay",
        hook: "'İkiz gezegen' aslında bir cehennemmiş",
        body: "1962'de Venüs'ün yanından geçen Mariner 2, boyut olarak Dünya'ya en çok benzeyen komşumuzun yüzeyinin kurşunu eritecek kadar sıcak olduğunu ölçtü. O güne kadar bazı bilim insanları Venüs'te bataklıklar, hatta dinozorlar olabileceğini hayal ediyordu. Tek bir uçuş, yüzyıllık bir hayali kesin olarak bitirdi.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-17": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "12 saniye, 36 metre",
      text: "17 Aralık 1903'te Kitty Hawk'ın rüzgârlı kumsalında bir tahta ve kumaş makine, 12 saniye havada kaldı. İnsanlık, motorlu uçuşu o gün öğrendi.",
    },
    events: [
      {
        id: "ev-1217-wright",
        year: 1903,
        text: "Wright Kardeşler'in yaptığı Flyer I uçağı, Kuzey Karolina'daki Kitty Hawk'ta Orville Wright'ın kumandasında ilk motorlu, kontrollü uçuşunu gerçekleştirdi.",
        detail:
          "İlk uçuş yalnızca 12 saniye sürdü ve 36 metre mesafe kat etti — bir yolcu uçağının kanat açıklığından bile kısa. Aynı gün kardeşler dört uçuş daha denedi; sonuncusu 59 saniye sürüp 260 metreye ulaştı. O sabah rüzgâr o kadar soğuktu ki tanıklık eden birkaç kişiden biri bile olay yerinde donuyordu. Kardeşler, uçuşu doğrulamak için yanlarında bir fotoğraf makinesi bulundurmuştu; çekilen kare, havacılık tarihinin en ünlü fotoğraflarından biri oldu.",
        category: "kesif",
        matchKeys: ["wright kardeşler", "kitty hawk", "flyer"],
      },
    ],
    cases: [
      {
        id: "case-1217-bouazizi",
        year: 2010,
        type: "skandal",
        title: "Bir Seyyar Satıcının Protestosu, Bir Bölgeyi Değiştirdi",
        location: "Sidi Bouzid, Tunus",
        status: "KAPANDI",
        summary:
          "Belediye görevlilerince malı haksız yere el konulan seyyar sebze satıcısı Muhammed Bouazizi, valilik binası önünde kendini ateşe verdi; olay haftalar içinde bölgesel bir isyan dalgasına dönüştü.",
        detail:
          "Bouazizi, tezgâhına ve tartısına haksız yere el konulmasını protesto etmek için valiliğe gitmiş, kimse onu dinlememişti. Umutsuzluğu, kendini ateşe vermesiyle sonuçlandı; üç hafta sonra yaralarından öldü. Olay, Tunus'ta uzun süredir biriken işsizlik ve yolsuzluk öfkesini ateşledi; günler içinde protestolar tüm ülkeye, ardından Mısır, Libya, Suriye gibi ülkelere yayılarak 'Arap Baharı' denen isyan dalgasını başlattı. Bir bireyin çaresizliği, bölgesel bir tarihin akışını değiştirdi.",
        tags: ["Tunus", "Arap Baharı", "protesto"],
      },
    ],
    science: [
      {
        id: "sci-1217-dc3",
        year: 1935,
        field: "Havacılık",
        title: "Douglas DC-3 ilk uçuşunu yaptı",
        summary:
          "Wright Kardeşler'in ilk uçuşundan yalnızca 32 yıl sonra gökyüzüne çıkan DC-3, yolcu havacılığını kâr edebilir bir iş koluna dönüştüren ilk uçak oldu. Güvenilirliği ve dayanıklılığıyla tanınan DC-3'ler, üretiminin üzerinden 90 yılı aşkın süre geçmesine rağmen dünyanın bazı bölgelerinde hâlâ uçuyor.",
        matchKeys: ["dc-3"],
      },
    ],
    talk: [
      {
        id: "talk-1217-1",
        category: "Keşif",
        hook: "12 saniyelik uçuş, gökyüzünü insana açtı",
        body: "1903'te bugün Orville Wright, rüzgârlı bir kumsalda 12 saniye havada kaldı — 36 metre, bir yolcu uçağının kanadından bile kısa bir mesafe. Aynı gün denedikleri dördüncü uçuş 260 metreye ulaştı. Kardeşler, kimse inanmasın diye yanlarına bir fotoğraf makinesi almışlardı — iyi ki almışlar. Bugün gökyüzünde uçan her uçak, o soğuk sabahki 12 saniyenin torunu.",
        minutes: 3,
      },
      {
        id: "talk-1217-2",
        category: "Karanlık Tarih",
        hook: "Bir tezgâhın el konulması, bir bölgeyi ayaklandırdı",
        body: "2010'da bugün, tezgâhına haksızca el konulan bir seyyar satıcı, kimse onu dinlemeyince valilik önünde kendini ateşe verdi. Üç hafta sonra öldü. Öfkesi, günler içinde Tunus'u, sonra Mısır'ı, Libya'yı, Suriye'yi saracak bir isyan dalgasına dönüştü — tarih buna 'Arap Baharı' dedi. Bazen tek bir insanın çaresizliği, milyonlarca insanın sesi olur.",
        minutes: 3,
      },
      {
        id: "talk-1217-3",
        category: "Bilim",
        hook: "90 yıldır uçan bir uçak",
        body: "1935'te ilk uçuşunu yapan DC-3, o kadar sağlam ve verimli tasarlandı ki bazı örnekleri bugün hâlâ, 90 yılı aşkın süre sonra gökyüzünde. Wright Kardeşler'in 12 saniyelik uçuşundan yalnızca 32 yıl sonra, havacılık zaten kâr eden bir sektöre dönüşmüştü. Teknoloji bazen tahmin edilenden çok daha hızlı olgunlaşır.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-23": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Noel hediyesi denen küçük cihaz",
      text: "23 Aralık 1947'de Bell Labs'te iki fizikçi, bir devreyi anlık olarak güçlendiren küçük bir aygıt gösterdi. Shockley bunu 'muhteşem bir Noel hediyesi' diye tanımladı — transistör, elektronik çağını başlattı.",
    },
    events: [
      {
        id: "ev-1223-transistor",
        year: 1947,
        text: "Bell Laboratuvarları'nda John Bardeen ve Walter Brattain, laboratuvar yöneticilerine ilk katı hal transistörünü gösterdi; cihaz, vakum tüplerinin aksine anında ve ısınmadan çalışıyordu.",
        detail:
          "Ekip, bir hafta önce (16 Aralık) sinyali ilk kez başarıyla yükseltmiş, 23 Aralık'ta üst düzey yöneticilere canlı gösterim yapmıştı — bir ses devresini cihaza bağlayıp izleyicilerin sesin yükseltildiğini duymasını sağladılar. Buluş, altı ay sonra basına duyuruldu ama önce fazla ilgi görmedi; gazeteler haberi iç sayfalara gömdü. Bardeen, Brattain ve ekip lideri Shockley, 1956'da Nobel Fizik Ödülü'nü paylaştı.",
        category: "bilim",
        matchKeys: ["transistör", "bell labs", "bardeen"],
      },
    ],
    cases: [
      {
        id: "case-1223-menemen",
        year: 1930,
        type: "cinayet",
        title: "Menemen Olayı",
        location: "Menemen, İzmir",
        status: "ÇÖZÜLDÜ",
        summary:
          "Bir grup dinî motivasyonlu isyancı Menemen'de ayaklanınca, olayı bastırmaya çalışan yedek subay Mustafa Fehmi Kubilay, isyancılarca yakalanıp öldürüldü.",
        detail:
          "İsyancılar, kasabada şeriat düzeni ilan ettiklerini duyurup halkı ayaklanmaya çağırdı. Olayı haber alıp müdahale eden Kubilay, isyancılarca yakalandı, boynu testereyle kesilerek öldürüldü ve başı bir sırığa geçirilerek sokaklarda dolaştırıldı. Olay, genç cumhuriyetin laik düzenine yönelik ilk ciddi silahlı meydan okuma olarak algılandı; hükümet sıkıyönetim ilan etti, isyanla ilişkilendirilen çok sayıda kişi yargılanıp bir kısmı idam edildi. Kubilay, Türkiye'de laikliğin sembol isimlerinden biri olarak anılmaya devam ediyor.",
        tags: ["Menemen", "erken cumhuriyet", "isyan"],
      },
    ],
    science: [
      {
        id: "sci-1223-bobrek",
        year: 1954,
        field: "Tıp",
        title: "İlk başarılı böbrek nakli yapıldı",
        summary:
          "Cerrah Joseph Murray, Boston'da bir hastaya, tek yumurta ikizi kardeşinden aldığı böbreği başarıyla nakletti — bağışıklık sisteminin organı reddetme sorunu, ikizler arasındaki genetik özdeşlik sayesinde aşılmıştı. Ameliyat, organ nakli çağını başlattı; Murray, 1990'da bu başarısı nedeniyle Nobel Tıp Ödülü'nü kazandı.",
      },
    ],
    talk: [
      {
        id: "talk-1223-1",
        category: "Bilim",
        hook: "'Muhteşem bir Noel hediyesi' dedi, kimse anlamadı",
        body: "1947'de bugün iki fizikçi, Bell Labs'in yöneticilerine bir devreyi ısınmadan, anında güçlendiren küçük bir cihaz gösterdi. Ekip lideri Shockley bunu 'muhteşem bir Noel hediyesi' diye tanımladı. Basına duyurulduğunda gazeteler haberi iç sayfalara gömdü — kimse bunun bilgisayarları, telefonları, bugünün dijital dünyasını doğuracağını tahmin etmemişti.",
        minutes: 3,
      },
      {
        id: "talk-1223-2",
        category: "Karanlık Tarih",
        hook: "Bir subayın başı, bir sırıkta dolaştırıldı",
        body: "1930'da bugün Menemen'de bir grup isyancı, müdahale eden genç subay Kubilay'ı yakalayıp öldürdü. Olay, henüz yedi yaşındaki cumhuriyetin en sert sınavlarından biriydi; hükümet sert bir karşılıkla yanıt verdi. Kubilay'ın adı bugün hâlâ Türkiye'de laiklik tartışmalarının merkezinde bir sembol olarak anılıyor — bir olay, bir asır sonra bile hâlâ konuşuluyor.",
        minutes: 2,
      },
      {
        id: "talk-1223-3",
        category: "Bilim",
        hook: "Bir ikiz kardeş, organ nakli çağını açtı",
        body: "1954'te bir cerrah, bir hastaya ikiz kardeşinin böbreğini naklederek tıp tarihinde bir ilki başardı. Genetik özdeşlik sayesinde vücut organı reddetmedi — bu, o dönem çözülemeyen bir sorundu. Ameliyat, bugün her yıl binlerce hayat kurtaran organ nakli alanının ilk taşıydı. Bir ikiz bağı, tıbba yepyeni bir kapı açtı.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-25": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Kremlin'de inen son bayrak",
      text: "25 Aralık 1991 akşamı Gorbaçov istifasını açıkladı; gece yarısı Kremlin'in üzerindeki orak-çekiçli kızıl bayrak indirildi. 74 yıllık Sovyetler Birliği, ertesi gün resmen tarihe karıştı.",
    },
    events: [
      {
        id: "ev-1225-sscb",
        year: 1991,
        text: "SSCB Devlet Başkanı Mihail Gorbaçov, televizyondan yayımlanan bir konuşmayla istifasını açıkladı; gece Kremlin'deki kızıl bayrak indirilip yerine Rusya'nın üç renkli bayrağı çekildi.",
        detail:
          "Boris Yeltsin'in baskısıyla istifa eden Gorbaçov, nükleer silahların kontrolünü Rusya'ya devretti. Ertesi gün, 26 Aralık'ta Yüksek Sovyet, birliğin dağıldığını resmen ilan etti — Bolşevik Devrimi'nden 74 yıl, II. Dünya Savaşı sonrası kurulan iki kutuplu dünya düzeninden yaklaşık 45 yıl sonra. On beş cumhuriyet bağımsızlığını ilan etti; Soğuk Savaş, silah kullanılmadan bitmiş oldu.",
        category: "siyaset",
        matchKeys: ["gorbaçov", "sscb", "kızıl bayrak"],
      },
    ],
    cases: [
      {
        id: "case-1225-ceausescu",
        year: 1989,
        type: "idam",
        title: "Ceauşescu Çifti: Noel Günü İnfazı",
        location: "Târgovişte, Romanya",
        status: "KAPANDI",
        summary:
          "Romanya'yı 24 yıl demir yumrukla yöneten Nicolae Ceauşescu ve eşi Elena, birkaç saat süren gizli bir askerî mahkemenin ardından kurşuna dizildi.",
        detail:
          "Halk ayaklanmasının büyümesiyle iktidarı kaybeden çift, kaçmaya çalışırken yakalandı. 'Mahkeme', suçlamaları okuyup savunmayı dinledikten sonra dakikalar içinde idam kararı verdi; infaz aynı gün, Noel günü bir askerî kışlanın avlusunda gerçekleştirildi. Karar ve infazın görüntüleri televizyonda yayımlandı — Doğu Bloku'nun 1989'daki çöküşü sırasında bir liderin bu denli hızlı ve açık şekilde cezalandırıldığı tek örnekti. Romanya, o günden sonra çok partili sisteme geçti.",
        tags: ["Romanya", "diktatörlük", "Doğu Bloku"],
      },
    ],
    science: [
      {
        id: "sci-1225-webb",
        year: 2021,
        field: "Uzay",
        title: "James Webb Uzay Teleskobu fırlatıldı",
        summary:
          "Hubble'ın halefi olarak tasarlanan James Webb Uzay Teleskobu, bir Ariane 5 roketiyle Fransız Guyanası'ndan fırlatıldı. Kızılötesi ışıkta gözlem yapan dev aynası, katlanarak fırlatılıp uzayda otomatik açıldı; teleskop, evrenin ilk galaksilerinden bazılarının ışığını yakalayarak Big Bang'den yalnızca birkaç yüz milyon yıl sonrasına kadar geriye bakabiliyor.",
        matchKeys: ["james webb"],
      },
    ],
    talk: [
      {
        id: "talk-1225-1",
        category: "Tarih",
        hook: "Bir imparatorluk, silah atılmadan bitti",
        body: "25 Aralık 1991 akşamı Gorbaçov televizyondan istifasını okudu. Saatler sonra Kremlin'in üzerindeki kızıl bayrak indirildi, yerine üç renkli Rus bayrağı çekildi. 74 yıllık Sovyetler Birliği, bir savaşla değil, bir imzayla ve bir bayrak değişimiyle tarihe karıştı. Bazı imparatorluklar gürültüyle çöker; bu, sessizce söndü.",
        minutes: 3,
      },
      {
        id: "talk-1225-2",
        category: "Karanlık Tarih",
        hook: "Noel günü verilen bir idam kararı",
        body: "1989'da Ceauşescu çifti, birkaç saat süren gizli bir mahkemenin ardından Noel günü kurşuna dizildi. Kararın ve infazın görüntüleri televizyonda yayımlandı — Doğu Bloku'nun çöküşünde bir liderin bu kadar hızlı yargılandığı başka örnek yok. 24 yıllık bir iktidar, birkaç saatte sona erdi.",
        minutes: 2,
      },
      {
        id: "talk-1225-3",
        category: "Uzay",
        hook: "Katlanan bir ayna, evrenin başlangıcına bakıyor",
        body: "2021'de bugün fırlatılan James Webb Teleskobu, uzayda kendi kendine açılan dev bir aynaya sahip. Kızılötesi gözlemleriyle, Big Bang'den yalnızca birkaç yüz milyon yıl sonra oluşan ilk galaksilerin ışığını yakalıyor — geçmişe, gökyüzüne bakarak yolculuk yapıyor. Bazı Noel hediyeleri, evrenin kendisi kadar büyük olabiliyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "12-27": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Dokuz günlük yolculuğun sonu",
      text: "27 Aralık 1919'da Mustafa Kemal, dokuz günlük bir yolculuğun ardından Ankara'ya ulaştı. Hiçbir resmi unvanı yoktu; Ankaralılar onu yine de meydanlarda coşkuyla karşıladı.",
    },
    events: [
      {
        id: "ev-1227-ankara",
        year: 1919,
        text: "Mustafa Kemal Paşa ve Heyet-i Temsiliye üyeleri, dokuz günlük yolculuğun ardından Ankara'ya ulaştı; halk onu seğmenlerle ve büyük bir coşkuyla karşıladı.",
        detail:
          "Dikmen sırtlarında Vali Vekili Yahya Galip Bey başkanlığındaki bir heyetçe karşılanan Mustafa Kemal, şehre girişte halka kısa bir teşekkür konuşması yaptı. Saat 15.00'te Hükümet Konağı'na girildi. Hiçbir resmî sıfatı olmayan bir askerin bu şekilde karşılanması, Ankara'nın Kurtuluş Savaşı'nın fiilî merkezi hâline gelişinin de başlangıcıydı; şehir dört yıl sonra başkent ilan edilecekti.",
        category: "siyaset",
        matchKeys: ["mustafa kemal'in ankara'ya gelişi", "heyet-i temsiliye"],
      },
    ],
    cases: [
      {
        id: "case-1227-bhutto",
        year: 2007,
        type: "suikast",
        title: "Benazir Butto Suikastı",
        location: "Rawalpindi, Pakistan",
        status: "ÇÖZÜLDÜ",
        summary:
          "Pakistan'ın eski başbakanı Benazir Butto, bir seçim mitinginden sonra aracına doğru silahlı saldırı ve intihar bombacısı saldırısına uğrayarak hayatını kaybetti.",
        detail:
          "Mitingden sonra aracın camından halkı selamlarken önce ateş açıldı, ardından bir bomba patladı; patlamada Butto dâhil en az 20 kişi öldü, yüzden fazla kişi yaralandı. Saldırıyı, Pakistan Talibanı'nın yönlendirdiği 15 yaşında bir intihar bombacısının gerçekleştirdiği belirlendi. Ölüm nedeni tartışmalı kaldı — İngiliz Scotland Yard patlamanın etkisiyle oluşan kafa travmasını işaret ederken, partisi silah yarasından öldüğünü savundu. Butto, ülkesine iki kez başbakanlık yapmış, İslam dünyasının ilk kadın hükümet başkanıydı.",
        tags: ["Pakistan", "suikast", "seçim"],
      },
    ],
    science: [
      {
        id: "sci-1227-kepler",
        year: 1571,
        field: "Astronomi",
        title: "Johannes Kepler doğdu",
        summary:
          "Almanya'da doğan Kepler, gezegenlerin dairesel değil eliptik yörüngelerde hareket ettiğini kanıtlayarak Kopernik'in modelini kesinleştirdi. Gezegen hareketi yasaları Newton'un kütleçekim kuramına giden yolu açtı; ayrıca gözün nasıl gördüğünü — görüntünün retinaya nasıl düştüğünü — ilk doğru açıklayan da oydu.",
      },
    ],
    talk: [
      {
        id: "talk-1227-1",
        category: "Tarih",
        hook: "Rütbesiz bir adamı meydanlarda karşılayan şehir",
        body: "1919'da bugün, dokuz günlük yorucu bir yolculuğun ardından Ankara'ya ulaşan Mustafa Kemal'in hiçbir resmî unvanı yoktu. Şehir onu yine de seğmenlerle, büyük bir coşkuyla karşıladı. O gün girdiği Hükümet Konağı, dört yıl sonra bir cumhuriyetin başkentindeki ilk meclis binası olacaktı. Bazı şehirler, bir insanı unvanına değil, taşıdığı umuda bakarak seçer.",
        minutes: 2,
      },
      {
        id: "talk-1227-2",
        category: "Karanlık Tarih",
        hook: "15 yaşında bir bombacı, bir ülkenin siyasetini değiştirdi",
        body: "2007'de bugün, seçim kampanyası yürüten Benazir Butto bir mitingden dönerken önce kurşunlandı, sonra bombalandı. Saldırgan, Pakistan Talibanı'nın yönlendirdiği 15 yaşında bir çocuktu. Butto'nun ölüm nedeni bugün bile tartışmalı — kurşun mu, patlamanın darbesi mi? İki kez başbakanlık yapmış, İslam dünyasının ilk kadın hükümet başkanı, seçimlere girmeden üç hafta önce öldürüldü.",
        minutes: 3,
      },
      {
        id: "talk-1227-3",
        category: "Bilim",
        hook: "Gökyüzünü daireden kurtaran adam bugün doğdu",
        body: "1571'de doğan Kepler, gezegenlerin daire değil elips çizdiğini kanıtlayana kadar astronomlar yüzyıllarca yanlış bir şekle inanmıştı. Küçük bir düzeltme gibi görünse de bu, Kopernik'in modelini kurtardı ve Newton'un kütleçekim yasasına giden yolu açtı. Kepler ayrıca gözün nasıl gördüğünü ilk doğru açıklayan kişiydi. Bazen bilim, yanlış bir şekli düzeltmekle ilerler.",
        minutes: 2,
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
