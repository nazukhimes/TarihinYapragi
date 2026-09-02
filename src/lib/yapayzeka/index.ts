/**
 * YAPAY ZEKÂ KATMANI — dışa açılan yüz (T-20)
 *
 * Panel yalnızca burayı içe aktarır. Sağlayıcı değişirse değişen tek satır
 * aşağıdaki atamadır; `YapayZekaBolumu` hiçbir sağlayıcının adını bilmez.
 *
 * ## Politika notu — `ICERIK-SABLONU.md` §0 yürürlükte
 *
 * §0 "yapay zekâ ile toplu içerik üretimi"ni yasaklar ve bu katman o yasağı
 * **kaldırmaz**: burada üretilen hiçbir metin depoya yazılmaz, `src/data/gunler/*`
 * dosyalarına dokunulmaz, çıktı editör içeriği gibi görünmez. Üretim geçicidir,
 * isteğe bağlıdır, kullanıcının kendi anahtarıyla ve kendi tıklamasıyla olur;
 * ekranda "YZ ÜRETİMİ" rozetiyle ve kaynağıyla birlikte durur.
 */

import { gemini } from "./gemini";
import type { YzSaglayici } from "./tipler";

/** Aktif sağlayıcı. */
export const saglayici: YzSaglayici = gemini;

export { ADAY_MODELLER, modelleriGetir } from "./gemini";
export {
  ANAHTAR_ADI,
  anahtarOku,
  anahtarSil,
  anahtarTemizle,
  anahtarYaz,
  MODEL_ADI,
  modelOku,
  modelSil,
  modelYaz,
  useYzAnahtari,
} from "./anahtar";
export { SORU_IPUCU, VARSAYILAN_ISTEM, baglamiKirp, istemBirlestir } from "./istem";
export { YZ_MESAJ, YzHatasi, yzDurumMesaji, type YzSaglayici } from "./tipler";
