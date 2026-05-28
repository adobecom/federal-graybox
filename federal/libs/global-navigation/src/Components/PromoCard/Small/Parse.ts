import { IrrecoverableError, RecoverableError } from "../../../Error/Error";
import { parseSecondaryCTA, SecondaryCTA } from "../../CTA/Parse";

export type PromoCardSmall = {
  type: "PromoCardSmall";
  card: PromoCardSmallData;
};

export type PromoCardSmallData = {
  title: string;
  body: string;
  cta: SecondaryCTA | null;
  bgImageAlt: string;
  bgImageSrc: string;
};

const ERRORS = {
  MissingContentSection: "Promo card small is missing content section",
  MissingTitleElement: "Promo card small is missing title element",
  MissingTitleText: "Promo card small is missing title text",
  MissingBackgroundImageSection: "Promo card is missing background image section",
  MissingBackgroundImage: "Promo card is missing background image",
  MissingBackgroundImageAlt: "Promo card background image is missing alt text",
  MissingBackgroundImageSrc: "Promo card background image is missing src",
};

export const parsePromoCardSmall = (
  element: Element
): Parsed<PromoCardSmall, RecoverableError> => {
  const errors = new Set<RecoverableError>();
  const [bgImageSection, contentSection] = element.querySelectorAll(':scope > div');

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

  const titleElement = contentSection.querySelector('p:not(:has(strong > a, em > a))') ?? null;
  if (titleElement === null)
    throw new IrrecoverableError(ERRORS.MissingTitleElement);

  const title = titleElement.textContent?.trim() ?? "";
  if (title === "")
    errors.add(new RecoverableError(ERRORS.MissingTitleText));

  const bodyElement = contentSection.querySelectorAll('p:not(:has(strong > a, em > a))')[1] ?? null;
  const body = bodyElement?.textContent?.trim() ?? "";

  const [cta, ctaErrors] =
  (() : Parsed<SecondaryCTA | null, RecoverableError> => {
    try {
      return parseSecondaryCTA(contentSection) as
        Parsed<SecondaryCTA, RecoverableError>;
    } catch (_error) {
      return [null, []];
    }
  })();
  ctaErrors.forEach(e => errors.add(e));
  if (cta) {
    cta.daaLl = `${title} - ${cta.daaLl}`;
  }

  return [
    {
      type: "PromoCardSmall",
      card: {
        title,
        body,
        cta,
        bgImageAlt,
        bgImageSrc,
      },
    },
    [...errors],
  ];
};
