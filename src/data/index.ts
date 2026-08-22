import { OCAK } from "./gunler/01-ocak";
import { SUBAT } from "./gunler/02-subat";
import { MART } from "./gunler/03-mart";
import { NISAN } from "./gunler/04-nisan";
import { MAYIS } from "./gunler/05-mayis";
import { HAZIRAN } from "./gunler/06-haziran";
import { TEMMUZ } from "./gunler/07-temmuz";
import { AGUSTOS } from "./gunler/08-agustos";
import { EYLUL } from "./gunler/09-eylul";
import { EKIM } from "./gunler/10-ekim";
import { KASIM } from "./gunler/11-kasim";
import { ARALIK } from "./gunler/12-aralik";
import type { CuratedDay } from "./types";

export * from "./types";

export const CURATED: Record<string, CuratedDay> = {
  ...OCAK,
  ...SUBAT,
  ...MART,
  ...NISAN,
  ...MAYIS,
  ...HAZIRAN,
  ...TEMMUZ,
  ...AGUSTOS,
  ...EYLUL,
  ...EKIM,
  ...KASIM,
  ...ARALIK,
};
