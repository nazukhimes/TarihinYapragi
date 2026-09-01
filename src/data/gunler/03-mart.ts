import type { CuratedDay } from "../types";

export const MART: Record<string, CuratedDay> = {
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
  "03-10": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "'Bay Watson, buraya gelin'",
      text: "10 Mart 1876'da Alexander Graham Bell, komşu odadaki yardımcısına bir cümle söyledi ve telle iletti. İnsan sesi ilk kez tel üzerinden bir odadan diğerine taşındı.",
    },
    events: [
      {
        id: "ev-0310-telefon",
        year: 1876,
        text: "Alexander Graham Bell, patentini üç gün önce aldığı telefon cihazıyla yardımcısı Thomas Watson'a tarihin ilk anlaşılır telefon cümlesini söyledi: 'Bay Watson, buraya gelin, sizi görmek istiyorum.'",
        detail:
          "Bell, deney sırasında asit dökülmesi sonucu cümleyi aslında yardım istemek için söylemişti; yine de bu, sesin bir telle net biçimde iletildiği ilk an olarak tarihe geçti. Watson, bitişik odadan koşarak geldi. Patent başvurusu Bell'e, benzer bir tasarımla saatler farkla başvuran Elisha Gray'e karşı verilmişti; tartışma on yıllarca sürdü.",
        category: "bilim",
        matchKeys: ["bell", "telefon", "watson"],
      },
    ],
    cases: [
      {
        id: "case-0310-tokyo",
        year: 1945,
        type: "katliam",
        title: "Tokyo'nun Bombalanması",
        location: "Tokyo, Japonya",
        status: "KAPANDI",
        summary:
          "334 B-29 bombardıman uçağının düşük irtifadan attığı yangın bombaları, Tokyo'nun ahşap ağırlıklı mahallelerini birkaç saatte küle çevirdi; tek gecede tahminen 100.000 kişi öldü.",
        detail:
          "ABD komutanlığı, geleneksel yüksek irtifa bombardımanının etkisiz kaldığını görünce taktik değiştirdi: uçaklar 1.500-2.700 metre gibi düşük irtifadan, napalm bazlı yangın bombalarıyla saldırdı. Şehrin çoğunlukla ahşap ve kâğıttan yapılan konutları saatler içinde devasa bir yangın fırtınasına dönüştü; nehre atlayanlar bile kaynayan suda yaşamını yitirdi. Tek gecede ölen insan sayısı bakımından Hiroşima ve Nagazaki'yi de aşan bu baskın, II. Dünya Savaşı'nın en ölümcül tek bombardımanı sayılır.",
        tags: ["II. Dünya Savaşı", "Japonya", "100.000 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0310-telefon",
        year: 1876,
        field: "İletişim",
        title: "Ses ilk kez telle taşındı",
        summary:
          "Bell'in 'Bay Watson, buraya gelin' cümlesi, insan sesinin bir telle anlaşılır biçimde iletildiği ilk andı. Buluş, önce iş dünyasında şüpheyle karşılandı — Western Union şirketi patenti 100.000 dolara satın almayı reddetti, 'oyuncaktan öteye gitmez' dedi. On yıl içinde telefon, kıtaları değil ama şehirleri birbirine bağlayan bir ağa dönüştü.",
      },
    ],
    talk: [
      {
        id: "talk-0310-1",
        category: "Bilim",
        hook: "Bir yardım çığlığı, iletişim çağını başlattı",
        body: "10 Mart 1876'da Bell, deney sırasında üzerine asit dökülünce yan odadaki Watson'a seslendi: 'Buraya gelin, sizi görmek istiyorum.' Watson bu cümleyi telden duyup koşarak geldi — insan sesi ilk kez bir telle net biçimde taşınmıştı. Bir kaza anında söylenen sıradan bir cümle, tarihin en çok alıntılanan ilk sözlerinden biri oldu.",
        minutes: 2,
      },
      {
        id: "talk-0310-2",
        category: "Karanlık Tarih",
        hook: "Hiroşima'dan daha ölümcül bir gece",
        body: "1945'te bugün, Tokyo üzerine düşük irtifadan atılan yangın bombaları, şehrin ahşap mahallelerini saatler içinde bir ateş fırtınasına çevirdi. Tek gecede yaklaşık 100.000 kişi öldü — bu sayı, Hiroşima'daki ilk günün kaybını bile aşıyor. Nehre sığınanlar bile kaynayan suda can verdi. Bu baskın, atom bombaları kadar konuşulmasa da II. Dünya Savaşı'nın en ölümcül gecelerinden biriydi.",
        minutes: 3,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "03-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Sayının ve fizikçinin günü",
      text: "14 Mart, Amerikan tarih yazımıyla 3.14 — yani π'ye denk gelir. Aynı gün 1879'da Albert Einstein doğdu; tesadüf öyle güçlüydü ki dünya artık bu günü hem sayıyı hem fizikçiyi anarak kutluyor.",
    },
    events: [
      {
        id: "ev-0314-einstein",
        year: 1879,
        text: "Albert Einstein, Almanya'nın Ulm kentinde doğdu; büyüyünce görelilik kuramıyla fiziğin temellerini yeniden yazacaktı.",
        detail:
          "Einstein'ın doğduğu gün, ABD'deki tarih yazım biçimiyle (ay/gün) 3/14 — yani π sayısının ilk üç hanesiyle aynıdır. Bu tesadüf, 1988'de fizikçi Larry Shaw'un San Francisco'da başlattığı 'Pi Günü' kutlamalarına Einstein'ın doğum günü kutlamasının da eklenmesine yol açtı. 2018'de bir başka fizikçi, Stephen Hawking, aynı 14 Mart'ta hayatını kaybetti.",
        category: "bilim",
        matchKeys: ["einstein", "pi günü"],
      },
    ],
    cases: [
      {
        id: "case-0314-iran",
        year: 1998,
        type: "felaket",
        title: "Kerman Depremi",
        location: "Fandoqa, Kerman eyaleti, İran",
        status: "KAPANDI",
        summary:
          "Güneydoğu İran'da 6,6 büyüklüğünde bir deprem, 1981'de kırılan aynı fay hattını yeniden harekete geçirdi; çok sayıda köy zarar gördü.",
        detail:
          "Depremin merkez üssü Kerman kentinin güneydoğusundaydı ve bilim insanları için özel bir öneme sahipti: fay, 17 yıl önceki 1981 Sirch depreminde kırılan hattın devamıydı, bu da bölgedeki fay sisteminin nasıl 'zincirleme' kırıldığını gösteren nadir bir örnek sundu. İlk raporlar can kaybını sınırlı gösterse de 15'i aşkın köyde ağır hasar bildirildi. Deprem, İran'ın aktif fay hatlarının yoğunluğunu bir kez daha hatırlattı.",
        tags: ["deprem", "İran", "fay hattı"],
      },
    ],
    science: [
      {
        id: "sci-0314-pi",
        year: 1988,
        field: "Matematik",
        title: "Pi Günü ilk kez kutlandı",
        summary:
          "San Francisco'daki bir bilim müzesinde fizikçi Larry Shaw, 3,14159... diye sonsuza uzayan π sayısını kutlamak için çalışanlarını turtayla bir araya getirdi. Fikir yıllar içinde küresel bir matematik kutlamasına dönüştü; π, bir çemberin çevresinin çapına oranı olarak matematiğin en temel ve en gizemli sabitlerinden biridir — ondalıkları hiç tekrar etmeden sonsuza uzar.",
      },
    ],
    talk: [
      {
        id: "talk-0314-1",
        category: "Bilim",
        hook: "Bir sayı ve bir fizikçi, aynı günü paylaşıyor",
        body: "14 Mart, matematikte π'nin (3,14) günü. Aynı gün 1879'da doğan Albert Einstein, büyüyünce evrenin zaman ve uzayla ilgili kurallarını yeniden yazdı. Tesadüf o kadar güçlü ki bugün dünya hem bir sayıyı hem bir dehayı kutluyor. 2018'de bir başka fizik devi, Stephen Hawking, yine bu günde aramızdan ayrıldı — bilim tarihi bazen aynı tarihe üç kez imza atıyor.",
        minutes: 2,
      },
      {
        id: "talk-0314-2",
        category: "Bilim",
        hook: "Sonsuza uzayan ama hiç tekrar etmeyen bir sayı",
        body: "π, bir çemberin çevresinin çapına oranı — ama ondalıkları hiçbir düzene uymadan sonsuza uzar. 1988'de bir fizikçi bu tuhaflığı kutlamak için meslektaşlarına turta ikram etti; bugün milyonlarca insan aynı günü kutluyor. Basit bir geometrik oran, nasıl olur da yüzyıllardır matematikçileri büyülemeye devam eder? Cevap kısmen şu: çünkü hiç bitmiyor.",
        minutes: 2,
      },
      {
        id: "talk-0314-3",
        category: "Karanlık Tarih",
        hook: "Aynı fay hattı, 17 yıl sonra yeniden kırıldı",
        body: "1998'de İran'ın Kerman bölgesinde sarsan deprem, jeologlar için bir alarm ziliydi: kırılan fay, 1981'de zaten bir kez kırılmıştı. Bilim insanları bunu bir fay sisteminin 'domino etkisiyle' nasıl zincirleme kırılabileceğinin kanıtı olarak okudu. Bir bölge bir kez sarsıldıysa, hikâyenin bittiği anlamına gelmiyor — bazen yalnızca bir sonraki sarsıntının provası oluyor.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "03-15": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "'Sen de mi Brütüs?'",
      text: "MÖ 44'ün Mart Idus'unda (15 Mart) Roma Senatosu'na giren Jül Sezar, en güvendiği adamların da arasında bulunduğu bir grup senatör tarafından 23 kez bıçaklanarak öldürüldü.",
    },
    events: [
      {
        id: "ev-0315-caesar",
        year: -44,
        text: "Roma diktatörü Jül Sezar, aralarında yakın müttefiki Marcus Brutus'un da bulunduğu 60 kadar senatör tarafından Senato binasında bıçaklanarak öldürüldü.",
        detail:
          "Suikastçılar, Sezar'ın 'ömür boyu diktatör' ilan edilmesinden rahatsız olan ve Roma Cumhuriyeti'ni geri getirmek isteyen senatörlerdi. Sezar'a önceden bir kâhin 'Mart Idus'undan sakın' diye uyarmıştı; Sezar bu uyarıyı görmezden gelip her zamanki gibi Senato'ya gitti. Suikast, cumhuriyeti kurtarmayı hedeflese de tam tersi bir sonuç doğurdu: takip eden iç savaşlar, Sezar'ın evlatlığı Octavianus'un (sonraki adıyla Augustus) tek adam yönetimindeki Roma İmparatorluğu'nu kurmasıyla sonuçlandı.",
        category: "siyaset",
        matchKeys: ["jül sezar", "brutus", "senato"],
      },
    ],
    cases: [
      {
        id: "case-0315-caesar",
        year: -44,
        type: "suikast",
        title: "Jül Sezar Suikastı",
        location: "Roma, Pompeius Tiyatrosu'na bitişik Senato salonu",
        status: "ÇÖZÜLDÜ",
        summary:
          "60 kadar senatörün katıldığı komplo, tarihin en simgesel suikastlerinden birine dönüştü; Sezar'ın son sözleri olduğu iddia edilen 'Sen de mi Brütüs, oğlum?' cümlesi bugün hâlâ ihanetin simgesi olarak kullanılıyor.",
        detail:
          "Antik kaynaklara göre suikastçılar, dikkat çekmemek için hançerlerini toga altında sakladı; ilk darbeyi Casca vurdu, ardından hepsi sırayla bıçakladı. Otopsi kaydı niteliğindeki dönem kaynakları, 23 yaradan yalnızca birinin (göğsündeki) ölümcül olduğunu belirtir. Brutus ve suikastin diğer liderleri, iki yıl içinde Octavianus ve Marcus Antonius'un ordularınca yenilip intihar etti. Sezar'ın ölümü, tam da önlemeye çalıştıkları şeyi hızlandırdı: Roma bir daha hiç cumhuriyete dönemedi.",
        tags: ["Roma", "antik tarih", "suikast"],
      },
    ],
    science: [
      {
        id: "sci-0315-com",
        year: 1985,
        field: "Bilişim",
        title: "İlk '.com' alan adı kaydedildi",
        summary:
          "Symbolics.com, internetin ilk ticari alan adı olarak kaydedildi — bir bilgisayar şirketinin adıydı. Sonraki dokuz yıl boyunca yalnızca 100 kadar '.com' adı kaydedilecekti; bugün 150 milyonu aşkın '.com' uzantılı alan adı var. Kimse o gün, birkaç harfin bu kadar değerli hâle geleceğini tahmin edememişti.",
      },
    ],
    talk: [
      {
        id: "talk-0315-1",
        category: "Karanlık Tarih",
        hook: "Bir kâhinin uyarısını görmezden gelen adam",
        body: "MÖ 44'te bugün, bir kâhin Sezar'ı 'Mart Idus'undan sakın' diye uyarmıştı. Sezar bu uyarıyı ciddiye almadı, her zamanki gibi Senato'ya gitti. En güvendiği adamlardan Brutus'un da arasında olduğu 60 kişilik bir grup, onu 23 kez bıçakladı. İroni acıydı: cumhuriyeti kurtarmak isteyen suikastçılar, tam tersini başardı — Roma bir daha asla cumhuriyete dönmedi.",
        minutes: 3,
      },
      {
        id: "talk-0315-2",
        category: "Bilim",
        hook: "Birkaç harf, milyonlarca dolarlık bir pazar doğurdu",
        body: "1985'te bugün kaydedilen 'Symbolics.com', internetin ilk '.com' adresiydi — sıradan bir bilgisayar şirketinin adı. Dokuz yıl boyunca yalnızca bir avuç şirket bu uzantıyı fark etti. Bugün 150 milyondan fazla '.com' adresi var, bazıları milyonlarca dolara alınıp satılıyor. Bazı devrimler, kimsenin fark etmediği sessiz bir kayıt işlemiyle başlar.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "03-18": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Bir mayın gemisi bir donanmayı durdurdu",
      text: "18 Mart 1915 sabahı, dönemin en güçlü donanmalarından biri Çanakkale Boğazı'na girdi. Akşama kadar üç zırhlı battı, dördü ağır hasar aldı — küçük bir mayın gemisinin bir gece önce döşediği mayınlar yüzünden.",
    },
    events: [
      {
        id: "ev-0318-canakkale",
        year: 1915,
        text: "İngiliz-Fransız Birleşik Donanması, Çanakkale Boğazı'nı zorladı; Nusret mayın gemisinin döşediği mayınlara çarpan üç zırhlı battı, donanma boğazdan çekildi.",
        detail:
          "Sabah 10 sularında başlayan taarruz akşama kadar sürdü. Bouvet, Irresistible ve Ocean zırhlıları mayınlara çarpıp battı; Inflexible, Gaulois, Suffren ve Agamemnon ağır hasar aldı. Boğazın kıyı bataryalarının isabetli atışları da donanmayı yıprattı. Winston Churchill'in sonradan 'kaderin eli' diye andığı bu yenilgi, deniz yoluyla geçme planını çökertti ve müttefikleri kara çıkarmasına — Gelibolu Cephesi'ne — yöneltti.",
        category: "savas",
        matchKeys: ["çanakkale", "nusret", "boğaz"],
      },
    ],
    cases: [
      {
        id: "case-0318-gardner",
        year: 1990,
        type: "kayıp",
        title: "Isabella Stewart Gardner Müzesi Soygunu",
        location: "Boston, ABD",
        status: "SÜRÜYOR",
        summary:
          "Polis kılığına giren iki hırsız, geceyarısından sonra müzeye girip aralarında bir Vermeer ve üç Rembrandt'ın da bulunduğu 13 eseri çaldı; hiçbiri geri dönmedi.",
        detail:
          "Sahte polisler, 'ihbar var' diyerek güvenlik görevlilerini kandırdı, onları bağlayıp bodruma kilitledi ve 81 dakika boyunca müzede dolaştı. Çalınan eserlerin bugünkü değeri 500 milyon doları aşıyor — tarihin en büyük sanat hırsızlığı. FBI 2013'te failleri bildiğini ama isim veremediğini açıkladı; müze hâlâ eserlerin sağ salim iadesi için 10 milyon dolar ödül teklif ediyor. Duvarlardaki boş çerçeveler, kural gereği hâlâ asılı duruyor.",
        tags: ["sanat hırsızlığı", "Boston", "FBI", "500 milyon dolar"],
      },
    ],
    science: [
      {
        id: "sci-0318-leonov",
        year: 1965,
        field: "Uzay",
        title: "Alexei Leonov uzayda yürüyen ilk insan oldu",
        summary:
          "Voskhod 2 görevinde kapsülden dışarı çıkan Sovyet kozmonot Leonov, boşlukta yaklaşık 12 dakika geçirdi. Uzay giysisi boşlukta beklenmedik şekilde şişince kapsüle geri girmekte zorlandı; giysisinden bir valfle havayı boşaltarak son anda içeri sığabildi — uzay tarihinin anlatılmayan ilk kriz anlarından biri.",
        matchKeys: ["leonov"],
      },
    ],
    talk: [
      {
        id: "talk-0318-1",
        category: "Savaş",
        hook: "Küçük bir gemi, koca bir donanmayı durdurdu",
        body: "18 Mart 1915'te dönemin en güçlü donanmalarından biri Çanakkale Boğazı'na girdi. Bir gece önce sessizce mayın döşeyen küçük Nusret gemisi, kimsenin beklemediği bir hatta mayın bırakmıştı. Akşama kadar üç zırhlı battı, dördü ağır hasarla geri çekildi. Churchill yıllar sonra bunu 'kaderin eli' diye anacaktı. Bazen savaşın kaderini en büyük gemi değil, en sessiz olan belirler.",
        minutes: 3,
      },
      {
        id: "talk-0318-2",
        category: "Karanlık Tarih",
        hook: "Dünyanın en büyük sanat hırsızlığı hâlâ çözülmedi",
        body: "1990'da iki adam polis kılığında Boston'daki bir müzeye girdi, görevlileri bodruma kilitledi ve 81 dakikada 13 eseri duvardan söktü — aralarında bir Vermeer de vardı. Bugünkü değeri 500 milyon doları aşan eserlerden hiçbiri bulunamadı. FBI failleri bildiğini söylüyor ama isim vermiyor. Müzede boş çerçeveler hâlâ duvarda asılı; vasiyet gereği, eserler dönene kadar yerleri boş kalacak.",
        minutes: 2,
      },
      {
        id: "talk-0318-3",
        category: "Uzay",
        hook: "Boşlukta şişen bir elbise, dönüşü imkânsız kılıyordu",
        body: "1965'te Leonov, kapsülden çıkıp boşluğa adım atan ilk insan oldu — 12 dakika sürdü. Asıl drama dönüşteydi: uzay giysisi vakumda öyle şişmişti ki kapsülün kapısından sığamadı. Kimseye haber vermeden giysisinden havayı boşalttı, hayatını riske atarak içeri girdi. Dünya bunu yıllarca bilmedi; ilk uzay yürüyüşü, ilk gizlenen uzay krizi de oldu.",
        minutes: 2,
      },
      {
        id: "talk-0318-4",
        category: "Tarih",
        hook: "Bir yenilgi, bir cepheyi doğurdu",
        body: "Çanakkale'de denizden geçemeyen müttefikler planı değiştirdi: kara çıkarması. Birkaç hafta sonra Gelibolu'da başlayacak cephe, on binlerce insanın hayatına mal olacaktı. 18 Mart'taki deniz zaferi, savaşın en kanlı cephelerinden birinin de kapısını araladı. Tarihte bir zafer, çoğu zaman bir sonraki felaketin ilk perdesidir.",
        minutes: 2,
      },
    ],
  },
};
