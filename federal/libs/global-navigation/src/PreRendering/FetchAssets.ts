import { IrrecoverableError } from "../Error/Error";
import { Input } from "../Main";
import {
  fetchAndProcessPlainHTML,
  federateUrl,
  getMetadata,
  inlineNestedFragments,
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
    : fetchAndProcessPlainHTML(promoUrl).then(async promoResult => {
        if (promoResult instanceof IrrecoverableError)
          return null;
        const inlined = await inlineNestedFragments(promoResult);
        const el = inlined instanceof IrrecoverableError ? null : inlined;
        const promoBar = el?.querySelector<HTMLElement>('.gnav-promo') ?? null;
        if (promoBar !== null) {
          const fetchedFrom = federateUrl(
            `${promoUrl.origin}${promoUrl.pathname.replace(/(\.html$|$)/, '.plain.html')}`,
          );
          replaceDotMedia(fetchedFrom, promoBar);
        }
        return promoBar;
      });

  const rawMainNav = await fetchAndProcessPlainHTML(gnavSource);
  if (rawMainNav instanceof IrrecoverableError)
    return rawMainNav;

  const mainNav = await inlineNestedFragments(rawMainNav);
  if (mainNav instanceof IrrecoverableError)
    return mainNav;

  return { mainNav, promoBarEl };
}

