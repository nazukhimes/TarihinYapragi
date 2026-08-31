import type { WorldRecord } from "./types";

/**
 * REKORLAR KASASI — editör havuzu.
 *
 * Bu dosya `src/data/gunler/*.ts` ile aynı kurala tabidir: her kayıt elle yazılır,
 * her rakam en az bir bağımsız kaynakla doğrulanır (bkz. `Dokumanlar/ICERIK-SABLONU.md` §0).
 * Yapay zekâ ile toplu içerik üretimi bu dosya için de yasaktır — `npm run rekor-avi`
 * yalnızca **aday** üretir, kaydı editör yazar.
 *
 * ## Doğrulama kuralı
 *
 * `value` alanına yalnızca kaynağında **açıkça geçen** rakam yazılır. Yaygın olarak
 * bilinen ama kaynakta doğrulanamayan bir sayı `value`'ya konmaz; gerekiyorsa
 * `story` içinde "yaklaşık" diye geçer. Sebebi basit: `value` ekranda büyük puntoyla
 * çıkıyor ve yayında doğrudan okunuyor.
 *
 * `official: true` yalnızca Guinness World Records'ın resmen onayladığı unvanlar
 * içindir. "En"i tartışmalı olanlar (birden fazla adayı olan başlıklar) `false` alır
 * ve ekranda ayrı rozetle gösterilir.
 *
 * ## Gün eşleşmesi
 *
 * `date` (`"MM-DD"`) **isteğe bağlıdır** ve yalnızca rekorun kırıldığı gün kesin
 * doğrulandıysa yazılır. Verilenler o güne sabitlenir; verilmeyenler yıl boyunca
 * dönen rotasyona girer (bkz. `src/lib/rekor.ts`). Havuzu 365 güne tamamlamak
 * gerekmez — rotasyon her gün dolu bir kasa gösterir.
 */
export const REKORLAR: WorldRecord[] = [
  /* ==================== TÜRKİYE ==================== */
  {
    id: "rek-ozyurek-burun",
    title: "Dünyanın en uzun burnu",
    holder: "Mehmet Özyürek",
    value: "8,8 cm",
    year: 2010,
    place: "Artvin, Türkiye",
    scope: "turkiye",
    status: "GÜNCEL",
    summary:
      "Mart 2010'da yapılan ölçümde burun ucundan köküne 8,8 santimetre çıktı; unvan o gün Türkiye'ye geçti.",
    story:
      "Özyürek unvanı bir yarışmaya başvurarak değil, İtalyan bir televizyon programının ölçüm çekimiyle aldı. Rekor onaylandıktan sonra Artvin'de tanınan bir sima oldu; kendisiyle yapılan söyleşilerde burnuyla dalga geçenlere yıllarca alıştığını, unvanın bunu bir anda tersine çevirdiğini anlattı. 18 Mayıs 2023'te Rize'de geçirdiği kalp krizi sonucu 73 yaşında hayatını kaybetti. Rekoru hâlâ onun adına kayıtlı.",
    compare: "Ortalama bir insan burnunun yaklaşık iki katı.",
    opener: "Dünyanın en uzun burnu bir Artvinliye ait ve rakam sandığından büyük",
    question: "Bir bedensel özellik rekora dönüşünce insanın kendine bakışı değişir mi?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Mehmet_%C3%96zy%C3%BCrek",
    tags: ["Türkiye", "insan bedeni", "Artvin"],
  },
  {
    id: "rek-karabay-sualti",
    title: "Su altında en uzun süre kalma",
    holder: "Cem Karabay",
    value: "192 saat 19 dakika 19 saniye",
    year: 2016,
    place: "Türkiye",
    scope: "turkiye",
    status: "GÜNCEL",
    summary:
      "Sekiz günden uzun süre sudan çıkmadan kaldı; unvanı 'kâinatta suyun altında en uzun süre yaşayan insan' olarak kayda geçti.",
    story:
      "Karabay bir dalgıç olduğu kadar müzisyen ve besteci; rekor denemesi sırasında en zorlandığı şeyin nefes değil uyku düzeni ve cilt tahribatı olduğunu anlattı. Su altında geçen sekiz gün boyunca beslenme, uyku ve tıbbi takip kesintisiz sürdürüldü. Bugün Türkiye Sualtı Sporları Federasyonu'nda kurul üyesi ve Beylikdüzü'nde dünya rekortmenlerini bir araya getiren bir dernek yönetiyor.",
    compare: "Sekiz günden fazla — yani tam bir haftalık tatil, tamamı su altında.",
    opener: "Bir Türk dalgıç sekiz gün boyunca sudan hiç çıkmadı",
    question: "Sekiz gün su altında kalmak fizyolojik bir başarı mı, psikolojik bir başarı mı?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Cem_Karabay",
    tags: ["Türkiye", "dayanıklılık", "dalış"],
  },
  {
    id: "rek-safa-onal-senaryo",
    title: "Senaryosu en çok filme çekilen yazar",
    holder: "Safa Önal",
    value: "395 senaryo",
    year: 2010,
    date: "08-04",
    place: "Türkiye",
    scope: "turkiye",
    status: "GÜNCEL",
    summary:
      "Yeşilçam'ın en üretken kalemi; filme çekilmiş 395 senaryosuyla Guinness Rekorlar Kitabı'na girdi.",
    story:
      "Önal senarist, yönetmen ve yazar olarak çalıştı; rekoru sadece yazdığı değil, gerçekten çekilip vizyona giren senaryoların sayısıyla aldı. Yeşilçam'ın hızlı üretim döneminde bir senaryonun günler içinde yazılıp haftalar içinde çekildiği düşünülürse rakam o dönemin çalışma temposunun da kaydı sayılır. Türkiye'den çıkan, sinema alanındaki en dikkat çekici rekorlardan biri — ve alanında hâlâ kırılmadı.",
    compare: "Yılda on film çekseniz, bu rakama ulaşmanız kırk yıl sürer.",
    opener: "Yeşilçam'ın bir yazarı, dünya rekoru kıracak kadar çok senaryo yazdı",
    question: "Bu kadar hızlı üretim, kaliteyi zorunlu olarak düşürür mü?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Safa_%C3%96nal",
    tags: ["Türkiye", "sinema", "Yeşilçam"],
  },

  /* ==================== İNSAN BEDENİ ==================== */
  {
    id: "rek-calment-yas",
    title: "Kayıtlara geçmiş en uzun insan ömrü",
    holder: "Jeanne Calment",
    value: "122 yıl 164 gün",
    year: 1997,
    place: "Arles, Fransa",
    scope: "insan",
    status: "GÜNCEL",
    summary: "Yaşı belgeleriyle doğrulanabilen tek 120+ insan. Rekor 1997'den beri kırılmadı.",
    story:
      "Calment'ın yaşı, doğum kaydından ölüm gününe kadar kesintisiz belgelerle doğrulandığı için bilim çevrelerinde ayrı bir yere sahip — uzun ömür iddialarının çoğu tam da bu noktada çöker. Gençliğinde Arles'ta Van Gogh'u gördüğünü anlatırdı. Doksanlı yaşlarındayken evini, ölümünden sonra devretmek şartıyla bir avukata sattı; avukat ondan önce öldü ve aile ödemeleri sürdürmek zorunda kaldı. 122 yaşına ulaşan tarihte doğrulanmış tek insan olarak kaldı.",
    compare: "Bir insanın iki kuşağı birden görmesi demek — torununun torununu.",
    opener: "Bir Fransız kadın 122 yıl yaşadı ve bu rekor otuz yıldır kırılamadı",
    question: "Uzun ömür şans mı, genetik mi, yoksa yaşam biçimi mi?",
    official: true,
    sourceUrl: "https://en.wikipedia.org/wiki/Jeanne_Calment",
    tags: ["insan bedeni", "uzun ömür", "Fransa"],
  },
  {
    id: "rek-wadlow-boy",
    title: "Tarihin en uzun boylu insanı",
    holder: "Robert Wadlow",
    value: "2,72 m",
    year: 1940,
    place: "Alton, Illinois, ABD",
    scope: "insan",
    status: "GÜNCEL",
    summary:
      "'Alton Devi' olarak anıldı. Boyu tartışmasız kanıtlarla belgelenmiş tek 2,7 metre üzeri insan.",
    story:
      "Wadlow'un boyu bir hipofiz bezi rahatsızlığından kaynaklanıyordu ve büyümesi hiç durmadı — öldüğü gün hâlâ uzuyordu. Ayakkabı firmasının sponsorluğunda ülkeyi dolaştı, gittiği her yerde kalabalık topladı. Ayak bileklerindeki desteklerden birinin açtığı yara enfeksiyona dönüştü ve 22 yaşında hayatını kaybetti. Cenazesi memleketi Alton'da binlerce kişi tarafından uğurlandı; rekoru seksen yılı aşkın süredir duruyor.",
    compare: "Standart bir kapı boşluğundan yaklaşık yarım metre uzun.",
    opener: "Tarihin en uzun insanı öldüğü gün hâlâ büyümeye devam ediyordu",
    question: "Kontrol edilemeyen bir bedensel özellik, insana ün mü getirir yük mü?",
    official: true,
    sourceUrl: "https://en.wikipedia.org/wiki/Robert_Wadlow",
    tags: ["insan bedeni", "ABD", "1940"],
  },
  {
    id: "rek-amge-kisa",
    title: "Yaşayan en kısa boylu kadın",
    holder: "Jyoti Amge",
    value: "Yaklaşık 63 cm",
    year: 2011,
    place: "Nagpur, Hindistan",
    scope: "insan",
    status: "GÜNCEL",
    summary:
      "18. doğum gününde resmen ölçüldü ve unvanı aldı; sonrasında oyunculuk kariyeri kurdu.",
    story:
      "Amge'nin boyu akondroplazi adı verilen bir büyüme bozukluğundan kaynaklanıyor. Rekoru aldıktan sonra unvanını bir merak nesnesi olmaktan çıkarıp kariyere çevirdi — Hindistan'da ve ABD'de televizyon dizilerinde rol aldı, oyuncu olarak tanındı. Röportajlarında en çok rahatsız olduğu şeyin bakışlar değil, insanların onunla çocukmuş gibi konuşması olduğunu söylüyor.",
    compare: "Ortalama bir iki yaşındaki çocuktan daha kısa.",
    opener: "Dünyanın en kısa kadını, unvanını bir oyunculuk kariyerine çevirdi",
    question: "Rekor unvanları insanları görünür mü kılıyor, yoksa tek bir özelliğe mi indirgiyor?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Jyoti_Amge",
    tags: ["insan bedeni", "Hindistan", "oyunculuk"],
  },
  {
    id: "rek-balawing-kisa",
    title: "En kısa boylu erkek",
    holder: "Junrey Balawing",
    value: "Yaklaşık 60 cm",
    year: 2011,
    place: "Sindangan, Filipinler",
    scope: "insan",
    status: "GÜNCEL",
    summary: "Unvanı 18. doğum gününde aldı; ölçüm için Guinness ekibi köyüne kadar gitti.",
    story:
      "Balawing bir yaşından sonra neredeyse hiç büyümedi ve nedeni tam olarak teşhis edilemedi. Ailesi geçimini zor sağlayan bir çiftçi ailesiydi; rekor haberi köye ilgi ve maddi destek getirdi. Ayakta uzun süre duramadığı için ölçümlerin bir bölümü yatarak yapıldı. 2020'de, 28 yaşında hayatını kaybetti.",
    compare: "Bir buçuk yaşındaki bir çocuk boyunda bir yetişkin.",
    opener: "Guinness ekibi bir rekoru ölçmek için Filipinler'de bir köye kadar gitti",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Junrey_Balawing",
    tags: ["insan bedeni", "Filipinler"],
  },

  /* ==================== DOĞA ==================== */
  {
    id: "rek-mavi-balina",
    title: "Yaşamış en büyük hayvan",
    holder: "Mavi balina",
    value: "30 metre / 190-200 ton",
    year: 1947,
    scope: "doga",
    status: "GÜNCEL",
    summary:
      "Dinozorlar dahil, dünyada yaşadığı bilinen tüm canlıların en büyüğü. Rekor bir türe ait.",
    story:
      "Doğrulanmış en uzun mavi balina ölçümü 30 metreye yaklaşır; ağırlık tahminleri 190-200 tona kadar çıkar. Kalbi bir otomobil büyüklüğünde, atardamarı içinden bir insanın sürünerek geçebileceği genişlikte. Yirminci yüzyılın balina avcılığı türü yok olmanın eşiğine getirdi; 1966'daki uluslararası koruma kararından sonra nüfus yavaş yavaş toparlanıyor. Bugün yeryüzündeki en büyük canlı, aynı zamanda en kırılganlarından biri.",
    compare: "Uç uca dizilmiş üç şehir otobüsü uzunluğunda.",
    opener: "Yaşamış en büyük hayvan bir dinozor değil ve şu anda hayatta",
    question: "En büyük canlının aynı zamanda en tehdit altındaki canlılardan olması ne anlatıyor?",
    official: true,
    sourceUrl: "https://en.wikipedia.org/wiki/Blue_whale",
    tags: ["doğa", "hayvanlar", "okyanus"],
  },
  {
    id: "rek-lambert-buzul",
    title: "Dünyanın en büyük buzulu",
    holder: "Lambert Buzulu",
    value: "400 km uzunluk, 100 km genişlik",
    year: 1957,
    place: "Antarktika",
    scope: "doga",
    status: "GÜNCEL",
    summary:
      "Antarktika'nın doğusunda, kıtanın iç buz tabakasını denize taşıyan dev bir buz nehri.",
    story:
      "Lambert Buzulu bir buz kütlesinden çok bir buz nehri gibi davranır: Doğu Antarktika buz tabakasının yaklaşık beşte birini denize doğru akıtır. 1950'lerde havadan yapılan haritalama çalışmalarıyla tam boyutu anlaşıldı. Akış hızı yılda birkaç yüz metreyi bulur — buzun bir ucundan diğerine yolculuğu binlerce yıl sürer. İklim araştırmalarında Antarktika'nın 'nabzını ölçen' noktalardan biri sayılıyor.",
    compare: "İstanbul'dan Ankara'ya kadar uzanan, yüz kilometre eninde bir buz nehri.",
    opener: "Antarktika'da dört yüz kilometre uzunluğunda bir buz nehri var",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Lambert_Buzulu",
    tags: ["doğa", "Antarktika", "buzul"],
  },
  {
    id: "rek-carolina-reaper",
    title: "Dünyanın en acı biberi",
    holder: "Carolina Reaper",
    value: "Ortalama ~1,6 milyon Scoville",
    year: 2013,
    place: "Güney Karolina, ABD",
    scope: "doga",
    status: "KIRILDI",
    brokenBy: "Pepper X (2023)",
    summary: "Orijinal adı HP22BNH7 olan bir melez. On yıl boyunca unvanı elinde tuttu.",
    story:
      "Carolina Reaper, aynı yetiştiricinin seralarında yıllar süren melezleme çalışmasıyla üretildi; adı kadar görüntüsü de kayda değer — kuyruk gibi uzayan sivri bir ucu var. Acılık ölçümü Scoville birimiyle yapılır ve laboratuvar analizine dayanır, yani rekor bir tadım değil bir kimya sonucudur. 2023'te aynı yetiştiricinin ürettiği Pepper X unvanı devraldı. Yani rekoru kıran, rekoru elinde tutan kişinin kendisiydi.",
    compare: "Sıradan bir jalapeño biberinden yaklaşık iki yüz kat acı.",
    opener: "Dünyanın en acı biberinin rekorunu kıran kişi, önceki rekorun da sahibiydi",
    question: "Acı yarışının bir sınırı olmalı mı?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Carolina_Reaper",
    tags: ["doğa", "yiyecek", "ABD"],
  },

  /* ==================== YAPILAR ==================== */
  {
    id: "rek-baldwin-sokak",
    title: "Dünyanın en dik sokağı",
    holder: "Baldwin Sokağı",
    value: "Yaklaşık %35 eğim",
    year: 2020,
    date: "04-08",
    place: "Dunedin, Yeni Zelanda",
    scope: "yapi",
    status: "GÜNCEL",
    summary: "Unvanı 2019'da Galler'e kaptırdı, 8 Nisan 2020'de ölçüm yöntemi değişince geri aldı.",
    story:
      "Baldwin Sokağı yıllarca tartışmasız rekortmendi; 2019'da Galler'deki Ffordd Pen Llech ölçümlerle unvanı aldı ve Dunedin sakinleri buna itiraz etti. İtirazın merkezinde teknik bir soru vardı: eğim sokağın orta çizgisinden mi, yoksa en dik kenarından mı ölçülmeli? Guinness kuralı orta çizgi lehine netleştirdi ve 8 Nisan 2020'de unvan Baldwin Sokağı'na geri döndü. Yeni Zelanda'da bu bir kasaba meselesi değil, ulusal haber olarak kutlandı.",
    compare: "Her üç metrede bir metre yükseliyor — arabayla çıkarken vites düşürmek şart.",
    opener: "Bir sokak dünya rekorunu kaybetti, sekiz ay sonra ölçüm kuralı değişince geri aldı",
    question: "Bir rekoru kaybetmek mi daha zor, geri kazanmak mı?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Baldwin_Soka%C4%9F%C4%B1",
    tags: ["yapılar", "Yeni Zelanda", "ölçüm tartışması"],
  },
  {
    id: "rek-ffordd-pen-llech",
    title: "Sekiz ay süren rekor",
    holder: "Ffordd Pen Llech",
    value: "2019-2020 arası unvan sahibi",
    year: 2019,
    place: "Harlech, Galler",
    scope: "tuhaf",
    status: "KIRILDI",
    brokenBy: "Baldwin Sokağı (8 Nisan 2020)",
    summary:
      "Dünyanın en dik sokağı unvanını aldı, ölçüm yöntemi tartışılınca sekiz ay sonra kaybetti.",
    story:
      "Harlech kasabası unvanı aldığında bunu turizm için ciddi bir kazanç saydı; tabelalar asıldı, ziyaretçi arttı. Ama Yeni Zelanda'daki eski rekortmen ölçümün sokağın en dik kenarından yapıldığını, orta çizgiden ölçülmesi gerektiğini savundu. Guinness itirazı inceledi ve kuralı netleştirerek unvanı geri verdi. Ffordd Pen Llech, rekorlar tarihinde 'ölçüm yöntemi yüzünden kaybedilen unvan' örneği olarak kaldı.",
    compare: "Rekor, bir kasabanın tabelalarını değiştirmesine yetecek kadar sürdü — sekiz ay.",
    opener:
      "Galler'de bir kasaba dünya rekorunu kutladı, sekiz ay sonra tabelaları indirmek zorunda kaldı",
    question: "Ölçüm yöntemi değişince kırılan bir rekor, gerçekten kırılmış sayılır mı?",
    official: true,
    sourceUrl: "https://en.wikipedia.org/wiki/Ffordd_Pen_Llech",
    tags: ["tuhaf", "Galler", "ölçüm tartışması"],
  },
  {
    id: "rek-taipei-101",
    title: "Dünyanın en yüksek binası (2004-2010)",
    holder: "Taipei 101",
    value: "508 metre",
    year: 2004,
    place: "Taipei, Tayvan",
    scope: "yapi",
    status: "KIRILDI",
    brokenBy: "Burj Khalifa (2010)",
    summary: "Altı yıl boyunca dünyanın en yüksek binasıydı; unvanı Dubai'ye kaptırdı.",
    story:
      "Taipei 101 sadece yüksekliğiyle değil, tepesindeki 660 tonluk sarkaçla da tanınır — deprem ve tayfun kuşağındaki bir gökdelenin salınımını dengeleyen bu dev kütle ziyarete açıktır ve binanın simgesi olmuştur. Tasarımı bambu gövdesinden esinlenir, sekiz katlı bölümler üst üste dizilir. 2010'da Burj Khalifa açıldığında unvanı 300 metreden fazla farkla kaybetti. Bugün hâlâ dünyanın en yüksek binalarından biri ve Tayvan'ın simgesi.",
    compare:
      "Burj Khalifa açıldığında farkı kapatmak için Taipei 101'in üstüne bir Eyfel Kulesi koymak gerekirdi.",
    opener: "Bir gökdelenin tepesinde, binayı fırtınada dengeleyen 660 tonluk bir sarkaç asılı",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Taipei_101",
    tags: ["yapılar", "Tayvan", "gökdelen"],
  },

  /* ==================== HIZ ==================== */
  {
    id: "rek-bolt-100m",
    title: "100 metre dünya rekoru",
    holder: "Usain Bolt",
    value: "9,58 saniye",
    year: 2009,
    place: "Berlin, Almanya",
    scope: "hiz",
    status: "GÜNCEL",
    summary: "2009 Dünya Şampiyonası'nda koştu. On beş yılı aşkın süredir kimse yaklaşamadı.",
    story:
      "Bolt'un 9,58'i sadece bir rekor değil, atletizmde bir kopuş sayılır: önceki rekoru kendi elindeydi ve onu yüzde birlik dilimlerle değil, tam bir buçuk salise birden kırdı. Sprintte bu ölçekte bir sıçrama neredeyse görülmez. Yarıştan sonra bilim insanları koşuyu kare kare inceledi; boyunun uzunluğuna rağmen adım frekansını koruyabilmesi olağandışı bulundu. Bolt 100, 200 ve 4x100 bayrak rekorlarını birlikte elinde tutuyor.",
    compare: "Saatte yaklaşık 44 kilometre — şehir içi trafikteki bir arabayla aynı hız.",
    opener: "Bir insan yüz metreyi dokuz buçuk saniyede koştu ve on beş yıldır kimse yaklaşamadı",
    question:
      "İnsan hızının fizyolojik bir üst sınırı var mı, yoksa rekor kırılmaya devam mı edecek?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Usain_Bolt",
    tags: ["hız", "atletizm", "Berlin"],
  },
  {
    id: "rek-duplantis-sirik",
    title: "Sırıkla atlama dünya rekoru",
    holder: "Armand Duplantis",
    value: "6,25 m",
    year: 2024,
    date: "08-05",
    place: "Paris, Fransa",
    scope: "hiz",
    // Rekor Duplantis'in kendisinde ama bu ÖLÇÜM aşıldı: Wikidata'daki P1000
    // kayıtları 2024 Ağustos'tan sonra da sürüyor. Kaydı "GÜNCEL" bırakmak
    // bayat bir rakamı geçerliymiş gibi göstermek olurdu.
    status: "KIRILDI",
    brokenBy: "Yine kendisi — rekoru düzenli olarak bir santim artırıyor",
    summary:
      "5 Ağustos 2024'te Paris Olimpiyat finalinde altın madalyayı aldıktan sonra çıtayı 6,25'e koydurup rekoru da kırdı.",
    story:
      "Duplantis kendi dünya rekorunu defalarca kırmasıyla tanınıyor — her seferinde bir santimetre artırarak. Paris'te olimpiyat şampiyonluğunu garantiledikten sonra çıtayı kendi rekorunun üzerine koydurdu ve stadyum ayakta bekledi. Atlayışı tutturduğunda rekor 6,25 metreye çıkmıştı. O tarihten sonra da durmadı: rekoru santim santim yükseltmeye devam ediyor, yani buradaki rakam onun en iyisi değil, o akşamki hâli.",
    compare: "İki katlı bir binanın çatısına sırıkla çıkmak gibi.",
    opener: "Altın madalyayı kazandıktan sonra çıtayı kendi dünya rekorunun üstüne koydurdu",
    question: "Rekoru santim santim kırmak bir strateji mi, yoksa sporun sınırına gelmiş olmak mı?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Armand_Duplantis",
    tags: ["hız", "atletizm", "olimpiyat", "Paris 2024"],
  },

  /* ==================== KÜLTÜR ==================== */
  {
    id: "rek-vikipedi-ansiklopedi",
    title: "En büyük çevrimiçi ansiklopedi",
    holder: "Vikipedi",
    value: "60+ milyon madde, 300'den fazla dil",
    year: 2001,
    scope: "kultur",
    status: "GÜNCEL",
    summary:
      "Gönüllülerin yazdığı, hiçbir editör kadrosu olmayan ansiklopedi rekoru elinde tutuyor.",
    story:
      "Vikipedi kurulduğunda ciddiye alınmadı: herkesin yazabildiği bir ansiklopedinin güvenilir olamayacağı düşünülüyordu. Bugün Guinness'in onayladığı en büyük çevrimiçi ansiklopedi ve dünyanın en çok ziyaret edilen sitelerinden biri. Hiçbir maddesi para karşılığı yazılmaz, sunucuları bağışlarla döner. Bu uygulamanın gördüğünüz tarih verisi de aynı kaynaktan geliyor — yani ekranınızdaki rekorların bir kısmını bir rekor besliyor.",
    compare: "Basılı bir ansiklopedi olsaydı, rafları kilometrelerce uzunlukta olurdu.",
    opener: "Şu anda baktığınız tarih bilgilerinin kaynağı, kendisi de bir dünya rekortmeni",
    question: "Kimsenin sahibi olmadığı bir bilgi kaynağı neden bu kadar iyi çalışıyor?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Vikipedi",
    tags: ["kültür", "internet", "bilgi"],
  },
  {
    id: "rek-stratan-sarkici",
    title: "En genç profesyonel şarkıcı",
    holder: "Cleopatra Stratan",
    value: "3 yaşında sahne aldı",
    year: 2006,
    place: "Moldova",
    scope: "kultur",
    status: "GÜNCEL",
    summary: "Üç yaşındayken ücretli konser verdi; albümü Moldova ve Romanya'da listeye girdi.",
    story:
      "Stratan'ın babası da şarkıcıydı ve stüdyoda oynarken kaydedilen sesi bir albüme dönüştü. Üç yaşında, iki saat süren bir konserde sahne aldı ve bu, profesyonel bir şarkıcı olarak ücret aldığı ilk performans sayıldı. Çocuk yıldızların çoğunun aksine müzikten kopmadı; büyüdükten sonra da şarkı söylemeye devam etti. Rekor, 'profesyonel' tanımının nasıl yapıldığına dair tartışmaları da beraberinde getirdi.",
    compare: "Çoğu çocuğun daha tam cümle kuramadığı yaşta, iki saatlik konser.",
    opener: "Üç yaşında sahneye çıkıp iki saat konser veren bir şarkıcı var",
    question: "Bu yaşta profesyonel kariyer, yetenek mi yoksa ailenin tercihi mi?",
    official: true,
    sourceUrl: "https://tr.wikipedia.org/wiki/Cleopatra_Stratan",
    tags: ["kültür", "müzik", "Moldova"],
  },
];

/** Havuzdaki rekorların id'leri — test ve rotasyon için. */
export const REKOR_IDLER = REKORLAR.map((r) => r.id);
