import { IrrecoverableError } from "../Error/Error";
import { Input } from "../Main";
import {
  fetchAndProcessPlainHTML,
  federateUrl,
  getMetadata,
  replaceDotMedia,
} from "../Utils/Utils";

type Initial = {
  mainNav: HTMLElement;
  promoBarEl: Promise<HTMLElement | null>;
};

export const getInitialHTML = async ({
  gnavSource,
}: Input): Promise<Initial | IrrecoverableError> => {
  const promoSource = getMetadata('gnav-promo-source');
  const promoUrl = promoSource !== null
    ? new URL(promoSource, window.location.href)
    : null;

  const promoBarEl: Promise<HTMLElement | null> = promoUrl === null
    ? Promise.resolve(null)
    : fetchAndProcessPlainHTML(promoUrl).then(promoResult => {
        const el = promoResult instanceof IrrecoverableError
          ? null : promoResult;
        const promoBar = el?.querySelector<HTMLElement>('.gnav-promo') ?? null;
        if (promoBar !== null) {
          const fetchedFrom = federateUrl(
            `${promoUrl.origin}${promoUrl.pathname.replace(/(\.html$|$)/, '.plain.html')}`,
          );
          replaceDotMedia(fetchedFrom, promoBar);
        }
        return promoBar;
      });

  const mainNav = await fetchAndProcessPlainHTML(gnavSource);
  if (mainNav instanceof IrrecoverableError)
    return mainNav;

  return { mainNav, promoBarEl };
}

