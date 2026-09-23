import { IrrecoverableError, RecoverableError } from "../../../Error/Error";
import { parseSecondaryCTA, SecondaryCTA } from "../../CTA/Parse";
import { isMerchLink, isMasLink } from "../../../Utils/Utils";

export type PromoCardSmall = {
  type: "PromoCardSmall";
  card: PromoCardSmallData;
};

export type PromoCardSmallData = {
  title: string;
  titleHtml: string;
  body: string;
  cta: SecondaryCTA | null;
  ctaHtml: string | null;
  bgImageAlt: string;
  bgImageSrc: string;
};

const isCommerceHref = (href: string): boolean =>
  isMerchLink(href) || isMasLink(href);

// An OST/M@S price/field link must survive parse as a live anchor so
// PostRendering/MerchLinks can resolve it in place; textContent dropped it.
const hasCommerceAnchor = (element: Element | null): boolean =>
  element !== null
  && [...element.querySelectorAll('a[href]')].some(
    (anchor) => isCommerceHref(anchor.getAttribute('href') ?? ''),
  );

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

  // A section may contain more than one <picture> (e.g. a decorative one
  // alongside the actual background image); the last is the bg image.
  const bgPictures = [...bgImageSection.querySelectorAll(':scope picture:not(:scope p picture)')];
  const bgImageElement: HTMLImageElement | null = bgPictures[bgPictures.length - 1]?.querySelector('img') ?? null;
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
  // Keep plain text as-is; preserve HTML only for a price/field anchor.
  const titleHtml = hasCommerceAnchor(titleElement)
    ? titleElement.innerHTML.trim()
    : title;

  // body is only used for the presence check + render, so a single field holds
  // HTML for a commerce anchor and plain text otherwise (unlike title, whose
  // plain-text form is still needed for the id/aria seed).
  const bodyElement = contentSection.querySelectorAll('p:not(:has(strong > a, em > a))')[1] ?? null;
  const body = hasCommerceAnchor(bodyElement)
    ? (bodyElement?.innerHTML.trim() ?? "")
    : (bodyElement?.textContent?.trim() ?? "");

  // A M@S/OST CTA is a strong/em-wrapped commerce anchor; the wrapper implies
  // the button style once Milo resolves it. Preserve that wrapper and skip the
  // typed CTA; ordinary (non-commerce) links keep the typed secondary path.
  const ctaAnchor = contentSection.querySelector('strong > a[href], em > a[href]');
  const ctaWrapper = ctaAnchor
    && isCommerceHref(ctaAnchor.getAttribute('href') ?? '')
    ? ctaAnchor.closest('strong, em')
    : null;
  const ctaHtml = ctaWrapper?.outerHTML.trim() ?? null;

  const [cta, ctaErrors] = ctaHtml !== null
    ? [null, []] as Parsed<SecondaryCTA | null, RecoverableError>
    : (() : Parsed<SecondaryCTA | null, RecoverableError> => {
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
        titleHtml,
        body,
        cta,
        ctaHtml,
        bgImageAlt,
        bgImageSrc,
      },
    },
    [...errors],
  ];
};
