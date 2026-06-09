import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { alternative } from "../../Utils/Utils";
import { Link, parseLink } from "../Link/Parse";

export type ProductCardHeader = {
  type: "ProductCardHeader";
  title: string;
  classes: string[];
  daaLl: string | null;
  daaLh: string | null;
};

type ProductCardIcons = {
  iconHref: string | null;
  iconAlt: string | null;
};

export type ProductCardLink = {
  type: "ProductCardLink";
  icons: ProductCardIcons[];
  title: string;
  href: string;
  subtitle: string;
  badges?: {
    text: string;
    isFilled: boolean;
  }[];
  daaLl: string | null;
  daaLh: string | null;
}

export type ProductCardBlue = {
  type: "ProductCardBlue";
  link: Link;
  daaLl: string | null;
  daaLh: string | null;
};

export type ProductCard
  = ProductCardHeader
  | ProductCardLink
  | ProductCardBlue;


export const parseProductCard = (
  element: Element | null
): Parsed<ProductCard, RecoverableError> => {
  if (!element)
    throw new IrrecoverableError(ERRORS.elementNull);

  if (!element.classList.contains('product-card'))
    throw new IrrecoverableError(ERRORS.notAProductCard);

  return alternative(parseProductCardHeader)
    .or(parseProductCardLink)
    .or(parseProductCardBlue)
    .eval(element);
}

/* example structure of a product card
*
* <div class="product-card">
*   <div>
*     <div><a href="/federal/assets/svgs/creative-cloud-40.svg">https://main--federal--adobecom.hlx.page/federal/assets/svgs/creative-cloud-40.svg | Adobe Creative Cloud</a></div>
*     <div>
*       <p><a href="https://www.adobe.com/creativecloud.html">What is Creative Cloud?</a></p>
*       <p>Creative apps and services for everyone</p>
*     </div>
*   </div>
* </div>
*
* Sometimes it's slightly different
* <div class="product-card gray-gradient bold header">
    <div>
      <div></div>
      <div>
        <h5 id="document-productivity"><a href="bookmark://_document-productivity">Document productivity</a></h5>
      </div>
    </div>
  </div>
*
*/

const ERRORS = {
  elementNull: "Element not found",
  noTitleAnchor: "Title anchor not found",
  noHref: "Title Anchor has no href",
  noTitle: "Title text not found",
  noSubtitleP: "Subtitle <p> not found",
  noSubtitle: "Subtitle text not found",
  notAHeader: "Expected a Header class",
  notAProductCard: "Expected a product-card class",
};

const parseProductCardLink = (
  element: Element | null
): Parsed<ProductCard, RecoverableError> => {
  const errors = new Set<RecoverableError>();
  if (!element)
    throw new IrrecoverableError(ERRORS.elementNull);

  const titleElement
    = element.querySelector('p a:not([href$=".svg"])')
    ?? element.querySelector('div ~ div > a:not([href$=".svg"])');
  if (!titleElement)
    throw new IrrecoverableError(ERRORS.noTitleAnchor);

  const title = titleElement.textContent ?? '';
  if (title === '')
    errors.add(new RecoverableError(ERRORS.noTitle));

  const href = titleElement.getAttribute("href") ?? '';
  if (href === '')
    errors.add(new RecoverableError(ERRORS.noHref));
  const daaLl = titleElement.getAttribute("daa-ll");
  const daaLh = titleElement.getAttribute("daa-lh");

  const subtitleElement = titleElement
    ?.closest("p")
    ?.nextElementSibling;
  if (!subtitleElement)
    errors.add(new RecoverableError(ERRORS.noSubtitleP));

  const subtitle = subtitleElement?.textContent ?? '';
  if (subtitle === '')
    errors.add(new RecoverableError(ERRORS.noSubtitle));

  const badgePs = element.querySelectorAll(':scope > div:nth-child(2) > :first-child p') ?? [];
  const badges = Array.from(badgePs).map((p) => {
    const isFilled = p.querySelector('strong') !== null;
    return {
      text: p?.textContent?.trim() ?? '',
      isFilled,
    };
  });

  const iconAnchors = element.querySelectorAll('a[href$=".svg"]');
  const icons: ProductCardIcons[] = Array.from(iconAnchors).map((a) => {
    const [iconHref = null, iconAlt = null] = (a.textContent ?? "")
      .split("|")
      .map((x) => x.trim());
    return { iconHref, iconAlt };
  });

  return [
    {
      type: "ProductCardLink",
      icons,
      title,
      href,
      subtitle,
      badges,
      daaLl,
      daaLh
    },
    [...errors]
  ]
}

const parseProductCardHeader = (
  element: Element | null
): Parsed<ProductCard, RecoverableError> => {
  if (!element)
    throw new IrrecoverableError(ERRORS.elementNull);

  const classes = [...element.classList];

  if(!classes.includes('header'))
    throw new IrrecoverableError(ERRORS.notAHeader);

  const title = element.querySelector('a')?.textContent ?? "";
  const daaLl = element.querySelector('a')?.getAttribute('daa-ll') ?? null;
  const daaLh = element.querySelector('a')?.getAttribute('daa-lh') ?? null;
  if(title === "")
    throw new IrrecoverableError(ERRORS.noTitle);

  return [
    {
      type: "ProductCardHeader",
      title,
      classes,
      daaLl,
      daaLh,
    },
    []
  ];
};

const parseProductCardBlue = (
  element: Element | null
): Parsed<ProductCard, RecoverableError> => {
  if (!element)
    throw new IrrecoverableError(ERRORS.elementNull);

  if (!element.classList.contains('blue'))
    throw new Error('Not a Blue Product Card');

  const a = element.querySelector('a');
  const [link, es] = parseLink(a);
  const daaLl = a?.getAttribute('daa-ll') ?? null;
  const daaLh = a?.getAttribute('daa-lh') ?? null;

  return [
    {
      type: "ProductCardBlue",
      link,
      daaLl,
      daaLh,
    },
    es
  ];
};
