import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { parseSecondaryCTA, SecondaryCTA } from "../CTA/Parse";
import { isMerchLink } from "../../Utils/Utils";

export type PromoCard = {
  type: "PromoCard";
  card: PromoCardData;
};

export type PromoCardData = {
  bgImageAlt: string;
  bgImageSrc: string;
  iconAlt: string;
  iconSrc: string;
  title: string;
  cta: SecondaryCTA | null;
  priceText: string;
  priceHref: string;
  isPriceMerchLink: boolean;
};

const ERRORS = {
  MissingBackgroundImageSection: "Promo card is missing background image section",
  MissingBackgroundImage: "Promo card is missing background image",
  MissingBackgroundImageAlt: "Promo card background image is missing alt text",
  MissingBackgroundImageSrc: "Promo card background image is missing src",
  MissingContentSection: "Promo card is missing card details section",
  MissingIcon: "Promo card is missing icon",
  MissingIconSrc: "Promo card icon is missing src",
  MissingIconAlt: "Promo card icon is missing alt text",
  MissingTitleElement: "Promo card is missing title element",
  MissingTitleText: "Promo card is missing title text",
  MissingSecondaryCtaAnchor: "Promo card is missing secondary CTA anchor",
  MissingPriceLink: "Promo card is missing price link",
};

export const parsePromoCard = (
  element: Element
): Parsed<PromoCard, RecoverableError> => {
    const [bgImageSection, contentSection] = element.querySelectorAll(':scope > div');
    const errors = new Set<RecoverableError>();
    if (bgImageSection === undefined)
      throw new IrrecoverableError(ERRORS.MissingBackgroundImageSection);

    const bgImageElement: HTMLImageElement | null = bgImageSection.querySelector(':scope picture:not(:scope p picture) img') ?? null;
    if (bgImageElement === null)
      errors.add(new RecoverableError(ERRORS.MissingBackgroundImage));

    const bgImageAlt = bgImageElement?.getAttribute('alt') ?? "";
    if (bgImageAlt === "")
      errors.add(new RecoverableError(ERRORS.MissingBackgroundImageAlt));

    const bgImageSrc = bgImageElement?.getAttribute('src') ?? "";
    if (bgImageSrc === "")
      errors.add(new RecoverableError(ERRORS.MissingBackgroundImageSrc));

    if (contentSection === undefined)
      throw new IrrecoverableError(ERRORS.MissingContentSection);

    const icon: HTMLAnchorElement | null = contentSection.querySelector('a[href$=".svg"]') ?? null;
    if (icon === null)
      errors.add(new RecoverableError(ERRORS.MissingIcon));

    const [iconSrc, iconAlt] = (icon?.textContent?.split("|") ?? ["", ""]).map(s => s.trim());
    if (iconSrc === "")
      errors.add(new RecoverableError(ERRORS.MissingIconSrc));

    if (iconAlt === "")
      errors.add(new RecoverableError(ERRORS.MissingIconAlt));

    const priceLink = contentSection.querySelector('p > a:not([href$=".svg"])') ?? null;
    const priceText = priceLink?.textContent?.trim() ?? "";
    const priceHref = priceLink?.getAttribute('href') ?? "";
    const isPriceMerchLink = priceHref ? isMerchLink(priceHref) : false;
    
    if (priceLink === null)
      errors.add(new RecoverableError(ERRORS.MissingPriceLink));

    const titleElement = contentSection.querySelector('p > strong') ?? null;
    if (titleElement === null)
      throw new IrrecoverableError(ERRORS.MissingTitleElement);

    const title = titleElement?.textContent ?? "";
    if (title === "")
      errors.add(new RecoverableError(ERRORS.MissingTitleText));

    const secondaryCtaAnchor = contentSection.querySelector('em > a');
    if (secondaryCtaAnchor === null)
      errors.add(new RecoverableError(ERRORS.MissingSecondaryCtaAnchor));


    const [cta, ctaErrors]
      = (() : Parsed<SecondaryCTA | null, RecoverableError> => {
        try {
          return parseSecondaryCTA(element) as Parsed<
            SecondaryCTA,
            RecoverableError
          >;
        } catch (_error) {
          return [null, []];
        }
      })();
    ctaErrors.forEach(e => errors.add(e));
    if (cta) {
      cta.daaLl = `${title} - ${cta?.daaLl}`;
    }
    return [
      {
        type: "PromoCard",
        card: {
          bgImageAlt,
          bgImageSrc,
          iconAlt,
          iconSrc,
          title,
          cta,
          priceText,
          priceHref,
          isPriceMerchLink,
        },
      },
      [...errors]
    ];
};