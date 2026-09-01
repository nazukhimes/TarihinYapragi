import type { CuratedDay } from "../types";

export const OCAK: Record<string, CuratedDay> = {
  /* ------------------------------------------------------------------ */
  "01-01": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Takvim sıfırlandı",
      text: "1 Ocak 1926 sabahı Türkiye, yüzyıllardır kullandığı Rumi ve Hicri takvimleri bırakıp dünyanın geri kalanıyla aynı günü saymaya başladı. Bir gecede, ülkenin tarihe düştüğü tarih değişti.",
    },
    events: [
      {
        id: "ev-0101-takvim",
        year: 1926,
        text: "Türkiye, 26 Aralık 1925'te kabul edilen kanunla Rumi ve Hicri takvimleri bırakıp Miladi takvime geçti; bu, ülkenin ilk 'modern' 1 Ocak'ıydı.",
        detail:
          "Kanun yalnızca yıl sayımını değil, günün başlangıcını ve resmî tatil düzenini de değiştirdi. Amaç, Avrupa ile ticaret ve bütçe hesaplarındaki karışıklığı gidermekti; Osmanlı döneminden kalan üç takvimin (Hicri, Rumi, kısmen Miladi) bir arada kullanılması alışkanlığı bu kanunla resmen sona erdi.",
        category: "genel",
        matchKeys: ["miladi takvim", "rumi takvim"],
      },
      {
        id: "ev-0101-arpanet",
        year: 1983,
        text: "ARPANET, tüm ağı tek günde eski protokolden TCP/IP'ye geçiren 'bayrak günü'nü (flag day) yaşadı — bugün internetin doğum günü sayılır.",
        detail:
          "O gün ağa bağlı yalnızca yaklaşık 400 bilgisayar vardı ama geçiş yine de risk taşıyordu: güncellemeyen her makine ağdan düşecekti. Yıllarca planlanan bu senkronize geçiş, birbirinden bağımsız ağların tek bir sistemmiş gibi konuşabilmesinin — yani 'internetwork'ün — önünü açtı.",
        category: "bilim",
        matchKeys: ["arpanet", "tcp/ip"],
      },
    ],
    cases: [
      {
        id: "case-0101-adamair",
        year: 2007,
        type: "felaket",
        title: "Adam Air 574: Cava Denizi'nde Kaybolan Uçak",
        location: "Sulawesi açıkları, Makassar Boğazı, Endonezya",
        status: "ÇÖZÜLDÜ",
        summary:
          "Surabaya'dan Manado'ya giden Boeing 737, fırtınalı havada radardan kayboldu; gemideki 102 kişiden kimse sağ kurtulamadı.",
        detail:
          "Soruşturma, pilotların bir seyrüsefer sistemi arızasıyla uğraşırken otomatik pilotu fark etmeden devre dışı bıraktığını ve uçağın kimse anlamadan yan yatıp dalışa geçtiğini ortaya koydu. Enkaz, aylar süren aramanın ardından derin sularda bulundu — Endonezya tarihinin en büyük arama kurtarma operasyonlarından biriydi. Kaza, ülkenin havayolu denetim sistemini kökten değiştiren reformları tetikledi.",
        tags: ["havacılık", "Endonezya", "102 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0101-hubble",
        year: 1925,
        field: "Astronomi",
        title: "Hubble: Samanyolu evrenin tamamı değilmiş",
        summary:
          "Edwin Hubble'ın bir bilim toplantısında okunan bildirisi, Andromeda'nın Samanyolu içinde bir bulutsu değil, milyonlarca ışıkyılı uzaktaki ayrı bir galaksi olduğunu duyurdu. Evrenin tek bir galaksiden ibaret olmadığı ilk kez kanıtlanmıştı — kozmolojinin ölçeği bir gecede katrilyonlarca kat büyüdü.",
        matchKeys: ["edwin hubble"],
      },
    ],
    talk: [
      {
        id: "talk-0101-1",
        category: "Tarih",
        hook: "Bir kanunla bir gecede 'hangi gündeyiz' sorusu değişti",
        body: "26 Aralık 1925'te çıkan bir kanun, Türkiye'nin yıllardır alışık olduğu Rumi takvimi rafa kaldırdı. 1 Ocak 1926 sabahı ülke, dünyanın geri kalanıyla aynı günü saymaya başladı. Basit bir idari karar gibi görünse de asıl amaç, Avrupa ile ticarette ve bütçe hesaplarında yaşanan kronik karışıklığı bitirmekti. Bir takvim değişse, bir ülkenin dünyayla saati de değişir.",
        minutes: 2,
      },
      {
        id: "talk-0101-2",
        category: "Teknoloji",
        hook: "İnternetin doğum günü aslında 1 Ocak",
        body: "1983'te bugün, ARPANET'e bağlı 400 kadar bilgisayar tek bir günde eski protokolden TCP/IP'ye geçti — planı yıllar önce yapılmış, adı 'bayrak günü' olan bir senkronize operasyon. Güncellenmeyen her makine ağdan düşecekti. O gün atılan temel, bugün milyarlarca cihazı birbirine bağlayan internetin hâlâ üzerinde çalıştığı protokol. Büyük devrimler bazen kimsenin fark etmediği bir Cumartesi sabahı olur.",
        minutes: 2,
      },
      {
        id: "talk-0101-3",
        category: "Uzay",
        hook: "Samanyolu'nun tek galaksi olmadığını öğrendiğimiz gün",
        body: "1925'in ilk günü, bir bilim toplantısında okunan kısa bir bildiri astronomiyi kökünden değiştirdi: Edwin Hubble, gökyüzündeki 'Andromeda bulutsusu'nun aslında Samanyolu'nun dışında, milyonlarca ışıkyılı uzakta ayrı bir galaksi olduğunu kanıtlamıştı. O güne kadar evren tek bir galaksiden ibaret sanılıyordu. Bir gecede, evrenin büyüklüğü hayal edilemeyecek katlara çıktı.",
        minutes: 2,
      },
      {
        id: "talk-0101-4",
        category: "Karanlık Tarih",
        hook: "Yeni yılın ilk saatlerinde düşen uçak",
        body: "2007'nin ilk günü, Endonezya'da 102 kişiyi taşıyan bir yolcu uçağı fırtınalı havada radardan silindi. Soruşturma yıllar sonra basit ama ölümcül bir zinciri ortaya çıkardı: pilotlar küçük bir arızayla uğraşırken otomatik pilotu istemeden kapatmışlardı, uçak fark edilmeden yan yattı. Enkaz aylar sonra derin sularda bulundu. Bazı felaketlerin kaynağı bir komplo değil, dikkatin bir anlık kaymasıdır.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "01-08": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Aynı gün doğan iki yıldız",
      text: "8 Ocak, Elvis Presley'in 1935'te ve David Bowie'nin 1947'de doğduğu gün. On iki yıl arayla dünyaya gelen iki müzik devrimcisi, aynı takvim yaprağını paylaşıyor.",
    },
    events: [
      {
        id: "ev-0108-elvisbowie",
        year: 1947,
        text: "David Bowie, Elvis Presley'in on iki yaşındaki doğum gününde Londra'da dünyaya geldi; ikisi de aynı 8 Ocak'ı paylaşan iki müzik efsanesi oldu.",
        detail:
          "Bowie, kariyeri boyunca Elvis'e defalarca göndermede bulundu; son albümü 'Blackstar'ın kapağındaki siyah yıldız motifinin, Elvis'in 'Black Star' adlı bir şarkısına ve ikisinin paylaştığı doğum gününe bir selam olduğu yorumlanır. Presley, rock'n roll'u ana akıma taşırken; Bowie, sahne kimliğini sürekli yeniden icat ederek popüler müziğin sınırlarını genişletti.",
        category: "kultur",
        matchKeys: ["elvis presley", "david bowie"],
      },
    ],
    cases: [
      {
        id: "case-0108-thydiyarbakir",
        year: 2003,
        type: "felaket",
        title: "THY Diyarbakır Kazası",
        location: "Diyarbakır, Türkiye",
        status: "ÇÖZÜLDÜ",
        summary:
          "Ankara'dan Diyarbakır'a inişe geçen THY uçağı, sisli havada pistin dışına çıkarak parçalandı; 80 kişiden 75'i hayatını kaybetti.",
        detail:
          "Soruşturma, pilotların sisli havada görüş mesafesinin altında inişe devam etme kararı aldığını ve inişin son anlarında dengeyi kaybettiğini ortaya koydu. Kaza, Türkiye'de iç hat uçuş güvenliği denetimlerinin ve pilot eğitim standartlarının sıkılaştırılmasına yol açtı. Kazada hayatını kaybedenler arasında çok sayıda asker ve öğrenci de vardı; facia, ülke gündemini günlerce meşgul etti.",
        tags: ["havacılık", "Diyarbakır", "75 kayıp"],
      },
    ],
    science: [
      {
        id: "sci-0108-hawking",
        year: 1942,
        field: "Fizik",
        title: "Stephen Hawking doğdu",
        summary:
          "Kara delikler ve evrenin başlangıcı üzerine çalışan Hawking, 21 yaşında amyotrofik lateral skleroz (ALS) teşhisi konup 'birkaç yıl ömrü kaldığı' söylenmesine rağmen 76 yaşına kadar yaşadı ve fiziğe kritik katkılar yaptı. 'Zamanın Kısa Tarihi' kitabı, bir bilim kitabı için görülmemiş bir satış rakamına ulaşarak kozmolojiyi milyonlarca eve taşıdı.",
      },
    ],
    talk: [
      {
        id: "talk-0108-1",
        category: "Kültür",
        hook: "İki müzik devrimcisi, aynı günü paylaşıyor",
        body: "8 Ocak 1935'te Elvis, 8 Ocak 1947'de Bowie doğdu — aralarında tam on iki yıl var. Bowie, kariyerinin sonuna kadar bu tesadüfe göz kırptı; son albümünün kapağındaki siyah yıldız, hem kendi soyadına hem Elvis'e bir selamdı. İki isim de müziği bulduğu hâlde bırakmadı, sürekli yeniden icat etti. Bazı takvim yaprakları, birden fazla efsaneyi taşıyacak kadar şanslıdır.",
        minutes: 2,
      },
      {
        id: "talk-0108-2",
        category: "Karanlık Tarih",
        hook: "Sis, bir uçağı pistin dışına sürükledi",
        body: "2003'te bugün, Diyarbakır'a inişe geçen bir yolcu uçağı sisli havada pistin dışına çıkıp parçalandı. 80 kişiden yalnızca 5'i hayatta kaldı. Soruşturma, pilotların görüş mesafesinin çok altında inişe devam ettiğini ortaya çıkardı. Facia, Türkiye'nin iç hat uçuş denetimlerini kökten değiştiren reformları tetikledi — geç gelen ama kalıcı bir ders.",
        minutes: 2,
      },
      {
        id: "talk-0108-3",
        category: "Bilim",
        hook: "'Birkaç yıl' denen hasta, 55 yıl daha yaşadı",
        body: "Bugün doğan Stephen Hawking, 21 yaşında ALS teşhisi konduğunda doktorlar birkaç yıl ömrü kaldığını söylemişti. Hawking 76 yaşına kadar yaşadı, tekerlekli sandalyeden konuşan bir sesle kara delikleri ve evrenin başlangıcını anlattı. 'Zamanın Kısa Tarihi' kitabı milyonlarca satarak kozmolojiyi sokaktaki insana taşıdı. Bazen en karamsar tahminler bile yanılır.",
        minutes: 2,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  "01-27": {
    spotlight: {
      kicker: "Günün dosyası",
      title: "Kapılar açıldığında",
      text: "27 Ocak 1945'te Sovyet askerleri Auschwitz'in kapılarından girdi. Karşılarında yalnızca yaklaşık 7.000 hayatta kalan vardı — geri kalanı ya öldürülmüş ya da günler önce 'ölüm yürüyüşü'yle batıya sürülmüştü.",
    },
    events: [
      {
        id: "ev-0127-auschwitz",
        year: 1945,
        text: "Sovyet Kızıl Ordusu birlikleri Auschwitz-Birkenau toplama ve imha kampını kurtardı; kampta yalnızca yaklaşık 7.000 zayıf ve hasta mahkûm kalmıştı.",
        detail:
          "Sovyet ordusunun yaklaştığını fark eden SS, iki hafta önce 56.000'i aşkın mahkûmu kış şartlarında batıya doğru yürümeye zorlamıştı; bu 'ölüm yürüyüşü'nde tahminen 15.000 kişi soğuktan, açlıktan veya kurşunlanarak öldü. Geride kalanlar arasında yürüyemeyecek kadar hasta olanlar vardı. 27 Ocak, 2005'te Birleşmiş Milletler tarafından Uluslararası Holokost Kurbanlarını Anma Günü ilan edildi.",
        category: "genel",
        matchKeys: ["auschwitz", "kızıl ordu", "holokost"],
      },
    ],
    cases: [
      {
        id: "case-0127-apollo1",
        year: 1967,
        type: "felaket",
        title: "Apollo 1: Fırlatmadan Önce Kapanda Ölüm",
        location: "Cape Kennedy, Florida, ABD — 34 No'lu Fırlatma Rampası",
        status: "ÇÖZÜLDÜ",
        summary:
          "Ay'a giden ilk mürettebatlı uçuşun provası sırasında kapsülde çıkan yangında astronotlar Gus Grissom, Ed White ve Roger Chaffee hayatını kaybetti; uçuş hiç fırlatılmamıştı.",
        detail:
          "Kapsül, yer testinde saf oksijenle basınçlandırılmıştı; bir kablo kısa devresi saniyeler içinde alevin kapsülü sarmasına yol açtı. Kapının içe değil dışa doğru ve karmaşık bir mekanizmayla açılması astronotların kaçmasını imkânsız kıldı — tüm mürettebat 17 saniye içinde öldü. Soruşturma NASA'nın güvenlik kültüründeki ciddi eksiklikleri ortaya çıkardı; kapsül tasarımı, oksijen oranı ve kapı mekanizması baştan değiştirildi. Program ismini değiştirmeden 'Apollo 1' olarak anıldı; iki yıl sonra Apollo 11 Ay'a indi.",
        tags: ["NASA", "uzay programı", "3 astronot"],
      },
    ],
    science: [
      {
        id: "sci-0127-antarktika",
        year: 1820,
        field: "Coğrafya",
        title: "Antarktika ilk kez görüldü",
        summary:
          "Rus kaşifler Bellingshausen ve Lazarev komutasındaki Vostok ve Mirny gemileri, güney kutup dairesini aşarak Antarktika kıtasını gören ilk insanlar oldu. O güne kadar efsanevi bir 'güney kıtası' olarak konuşulan Antarktika, bu keşifle haritaya gerçek bir kıta olarak girdi — insanlığın son kıtayı bulduğu gündü.",
      },
    ],
    talk: [
      {
        id: "talk-0127-1",
        category: "Karanlık Tarih",
        hook: "Kapılar açıldığında geriye 7.000 kişi kalmıştı",
        body: "1945'te bugün Sovyet askerleri Auschwitz'e girdiğinde, kampta yürüyemeyecek kadar zayıf yaklaşık 7.000 mahkûm buldular. İki hafta önce SS, 56.000'den fazla insanı kar altında batıya yürütmüştü — 15.000'i yolda öldü. Bugün bu tarih, dünyanın Holokost'u anma günü. Bir kapının açılması bazen kurtuluş, bazen de geride kalanın büyüklüğünü gösteren bir an olur.",
        minutes: 3,
      },
      {
        id: "talk-0127-2",
        category: "Karanlık Tarih",
        hook: "17 saniyede biten bir Ay yolculuğu provası",
        body: "1967'de bugün, üç astronot Apollo 1'in yer provasında kapsüle oturdu — gerçek fırlatmaya haftalar vardı. Bir kablo kıvılcımı, saf oksijenle dolu kapinde saniyeler içinde alev topuna dönüştü. Kapı içe açılmıyordu; astronotlar kaçamadı. NASA'nın en acı derslerinden biri buydu: hız bazen güvenliğin önüne geçer. İki yıl sonra Apollo 11 Ay'a indiğinde, o üç ismin öğrettikleri kapsülün her cıvatasındaydı.",
        minutes: 3,
      },
      {
        id: "talk-0127-3",
        category: "Keşif",
        hook: "Dünyanın son kıtası bugün görüldü",
        body: "1820'ye kadar Antarktika bir efsaneydi — haritalarda 'olabilir' diye çizilen bir gölge. Bugün, iki Rus gemisi buzların arasından geçip kıtayı gözleriyle gördü. Ne indiler, ne bayrak diktiler; sadece baktılar ve haritaya bir kıta daha eklediler. Bazen en büyük keşifler bir ayak izi değil, sadece bir bakıştır.",
        minutes: 2,
      },
    ],
  },
};
