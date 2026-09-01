import type { CuratedDay } from "../types";

export const EKIM: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "10-04": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "'Bip bip bip' diyen küçük bir küre",
      text: "4 Ekim 1957'de Sovyetler, 58 santimetrelik metal bir küreyi yörüngeye fırlattı. Sputnik'in radyo sinyali, amatör telsizcilerin bile duyabildiği bir 'bip' sesiydi — ve uzay çağını başlattı.",
    },
    events: [
      {
        id: "ev-1004-sputnik",
        year: 1957,
        text: "Sovyetler Birliği, dünyanın ilk yapay uydusu Sputnik 1'i yörüngeye yerleştirdi; ABD'de 'Sputnik krizi' denen bir teknoloji ve güvenlik paniği başladı.",
        detail:
          "Uydu, dört anteninden düzenli 'bip' sinyalleri gönderiyordu; sinyal, dünya genelinde amatör radyo operatörlerince bile yakalanabiliyordu. Üç hafta boyunca yayın yapıp Dünya'yı çevreleyen atmosferde yanarak yok oldu. ABD'de Sovyetler'in bu teknolojik üstünlüğü, eğitim reformlarından NASA'nın kurulmasına kadar uzanan geniş bir tepkiyi tetikledi; uzay yarışı resmen başlamış oldu.",
        category: "kesif",
        matchKeys: ["sputnik", "uzay yarışı"],
      },
      {
        id: "ev-1004-takvim",
        year: 1582,
        text: "Papa XIII. Gregory'nin emriyle Katolik Avrupa, Jülyen takviminden Gregoryen takvime geçti; 4 Ekim'i 15 Ekim izledi, aradaki 10 gün takvimden silindi.",
        detail:
          "Jülyen takvimi, güneş yılını fazla hesaplayarak yüzyıllar içinde mevsimlerle takvim arasında birikmiş bir sapmaya yol açmıştı. Geçiş, ilkbahar ekinoksunu doğru tarihe geri getirmek için 10 günün doğrudan atlanmasını gerektirdi; bazı ülkeler bu değişikliği yüzyıllar sonra, kimileri 20. yüzyılda benimsedi. Bugün dünyanın büyük bölümünün kullandığı takvim, o geçişin mirasıdır.",
        category: "genel",
        matchKeys: ["gregoryen takvim", "jülyen takvim"],
      },
    ],
    cases: [
      {
        id: "case-1004-moskova",
        year: 1993,
        type: "skandal",
        title: "Moskova'da Parlamentoya Top Ateşi",
        location: "Moskova, Rusya",
        status: "KAPANDI",
        summary:
          "Devlet Başkanı Boris Yeltsin'e bağlı ordu birlikleri, kendisine karşı direnen parlamentoyu barındıran binayı tanklarla topa tuttu; çatışmalarda resmî rakamlara göre 187 kişi öldü.",
        detail:
          "Kriz, Yeltsin'in anayasayı ihlal ederek parlamentoyu feshetmesi ve karşı çıkan milletvekillerinin binada direnmesiyle başlamıştı. Günler süren gerilimin ardından ordu birlikleri 4 Ekim sabahı binayı doğrudan top ateşine tuttu; görüntüler dünya çapında canlı yayınlandı. Olay, Sovyetler sonrası Rusya'da güçler ayrılığı krizinin en şiddetli anı olarak kaldı ve Yeltsin'in yetkilerini büyük ölçüde genişleten yeni bir anayasanın kabulüyle sonuçlandı.",
        tags: ["Rusya", "Yeltsin", "anayasa krizi"],
      },
    ],
    science: [
      {
        id: "sci-1004-sputnik",
        year: 1957,
        field: "Uzay",
        title: "İnsanlık, Dünya'nın dışına ilk nesnesini gönderdi",
        summary:
          "Sputnik'in fırlatılması, ondan dört yıl sonra ilk insanlı uçuşa, on iki yıl sonra Ay'a inişe uzanan bir yarışın startıydı. Uydunun kendisi bilimsel açıdan mütevazıydı — yalnızca sıcaklık ve basınç ölçen bir radyo vericisiydi — ama 'insan yapımı bir nesne Dünya'nın dışına çıkabilir' fikrini ilk kez kanıtladı.",
        matchKeys: ["sputnik"],
      },
    ],
    talk: [
      {
        id: "talk-1004-1",
        category: "Uzay",
        hook: "58 santimetrelik bir küre, bir ülkeyi paniğe soktu",
        body: "1957'de bugün fırlatılan Sputnik, plaj topu büyüklüğünde metal bir küreydi. Gönderdiği tek şey düzenli bir 'bip' sesiydi ama bu ses, ABD'de derin bir güvenlik korkusu yarattı: Sovyetler uzaya çıkabiliyorsa, füzeleri de her yere ulaşabilirdi. Panik, NASA'nın kurulmasına ve eğitim sisteminin baştan yazılmasına yol açtı. Bazen en büyük değişimi, en küçük nesneler tetikler.",
        minutes: 2,
      },
      {
        id: "talk-1004-2",
        category: "Tarih",
        hook: "Bir hafta hiç yaşanmadı",
        body: "1582'de bugün, Avrupa'nın büyük bölümü takvimden 10 günü sildi — 4 Ekim'i 15 Ekim izledi. Jülyen takviminin yüzyıllar içinde biriken hatası, mevsimlerle takvimi birbirinden koparmıştı. İnsanlar o gece yattı, ertesi sabah takvimde 11 gün ileride uyandılar. Zamanın kendisi bile, bazen bir kalemle düzeltilebilir.",
        minutes: 2,
      },
      {
        id: "talk-1004-3",
        category: "Karanlık Tarih",
        hook: "Bir başkan, kendi parlamentosunu topa tuttu",
        body: "1993'te Moskova'da bir anayasa krizi, tankların parlamentoyu doğrudan topa tutmasıyla sonuçlandı. Görüntüler dünya çapında canlı yayınlandı; resmî rakamlara göre 187 kişi öldü. Sovyetler'in çöküşünden yalnızca iki yıl sonra, yeni Rusya'nın ilk büyük iç krizi, demokrasinin ne kadar kırılgan olabileceğini gösterdi.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "10-14": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Gökyüzünde bir gök gürültüsü",
      text: "14 Ekim 1947'de turuncu bir uçak, sesten daha hızlı uçtu. Yerdekiler, tarihte ilk kez insan yapımı bir 'sonik patlama' duydu — kimse ne olduğunu ilk anda anlamadı.",
    },
    events: [
      {
        id: "ev-1014-yeager",
        year: 1947,
        text: "Test pilotu Chuck Yeager, Bell X-1 uçağıyla ses hızını aşan ilk insan oldu; Mach 1,06 hıza ulaştı.",
        detail:
          "Yeager, uçuştan iki gün önce at binerken kaburgalarını kırmıştı ama görevi kaçırmamak için kimseye söylemedi; kapıyı kendi başına kapatamadığı için yardımcı pilottan bir süpürge sapı kesip kaldıraç yapmasını istedi. X-1, bir B-29 bombardıman uçağının gövdesinden havada fırlatıldı, roket motorlarıyla hızlanıp o güne dek hiçbir uçağın dayanamadığı titreşim bölgesini aştı. Uçuş, aylarca gizli tutuldu; kamuoyu başarıyı ancak bir yıl sonra öğrendi.",
        category: "kesif",
        matchKeys: ["chuck yeager", "ses duvarı", "bell x-1"],
      },
    ],
    cases: [
      {
        id: "case-1014-senghenydd",
        year: 1913,
        type: "felaket",
        title: "Senghenydd Maden Faciası",
        location: "Senghenydd, Galler, Birleşik Krallık",
        status: "KAPANDI",
        summary:
          "Bir kömür madeninde meydana gelen grizu patlaması, İngiltere tarihinin en ölümcül maden kazasına yol açtı; 439 madenci hayatını kaybetti.",
        detail:
          "Patlama, madenin derinliklerinde birikmiş metan gazının bir kıvılcımla tutuşmasıyla gerçekleşti; ardından çıkan yangın ve zehirli gazlar, kaçamayan işçilerin çoğunu birkaç dakika içinde öldürdü. Aynı maden, yedi yıl önce de daha küçük ölçekli bir patlama yaşamıştı; iki kazanın da havalandırma ve güvenlik denetimindeki eksikliklerden kaynaklandığı belirlendi. Facia, İngiliz maden güvenliği yasalarının sıkılaştırılmasına yol açtı ama madenciliğin en tehlikeli mesleklerden biri olma özelliği yıllarca sürdü.",
        tags: ["Galler", "maden kazası", "439 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-1014-yeager",
        year: 1947,
        field: "Havacılık",
        title: "'Aşılamaz' denilen duvar aşıldı",
        summary:
          "Ses duvarı, o döneme kadar birçok mühendis tarafından fiziksel bir sınır sanılıyordu — hıza yaklaşan uçaklar şiddetli titreşimlerle parçalanıyordu. Yeager'ın uçuşu bu korkunun asılsız olduğunu kanıtladı ve modern askerî ile sonradan sivil süpersonik havacılığın önünü açtı. Yeager, 2020'lere kadar yaşadı ve havacılık tarihinin en saygın isimlerinden biri olarak anıldı.",
      },
    ],
    talk: [
      {
        id: "talk-1014-1",
        category: "Keşif",
        hook: "Kırık kaburgayla, süpürge sapıyla kapatılan bir kapı",
        body: "1947'de bugün Yeager, iki gün önce at binerken kırdığı kaburgalarını kimseye söylemeden kokpite girdi. Kapıyı tek başına kapatamayınca bir arkadaşından kestiği süpürge sapını ona verdi. Dakikalar sonra Bell X-1, sesten hızlı uçan ilk uçak oldu — yerdekiler, tarihin ilk insan yapımı sonik patlamasını duydu. Bazı tarihi anlar, kırık bir kaburganın bile durduramadığı bir inatla yazılır.",
        minutes: 3,
      },
      {
        id: "talk-1014-2",
        category: "Karanlık Tarih",
        hook: "Aynı maden, ikinci kez patladı",
        body: "1913'te bugün, Galler'de bir kömür madeninde metan gazı patladı; 439 madenci öldü — İngiltere tarihinin en ölümcül maden faciası. Aynı maden, yedi yıl önce de benzer bir patlama yaşamıştı ama dersler tam alınmamıştı. Facia, madencilik güvenlik yasalarını değiştirdi ama bedeli, bir kasabanın neredeyse tüm erkek nüfusu oldu.",
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
};
