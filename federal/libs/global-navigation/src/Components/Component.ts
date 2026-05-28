import { IrrecoverableError, RecoverableError } from "../Error/Error";
import { Brand, parseBrand } from "./Brand/Parse";
import { brand } from "./Brand/Render";
import {
  parsePrimaryCTA,
  parseProductEntryCTA,
  parseSecondaryCTA,
  PrimaryCTA,
  ProductEntryCTA,
  SecondaryCTA,
} from "./CTA/Parse";
import { primaryCTA, productEntryCTA, secondaryCTA } from "./CTA/Render";
import { Link, parseLink } from "./Link/Parse";
import { link } from "./Link/Render";
import { MegaMenu, parseMegaMenu } from "./MegaMenu/Parse";
import { megaMenu } from "./MegaMenu/Render";
import { SmallMenu, parseSmallMenu } from "./SmallMenu/Parse";
import { smallMenu } from "./SmallMenu/Render";
import { parseText, Text } from "./Text/Parse";
import { text } from "./Text/Render";

export type Component
  = Text
  | Link
  | SecondaryCTA
  | PrimaryCTA
  | ProductEntryCTA
  | Brand
  | MegaMenu
  | SmallMenu;

export const parseComponent = (
  element: Element
): Parsed<Component, RecoverableError> => {
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  const brandElem = element.querySelector('.gnav-brand');
  if (brandElem !== null)
    return parseBrand(brandElem);

  const largeMenu = element.querySelector('.large-menu');
  if (largeMenu !== null)
    return parseMegaMenu(largeMenu);

  if (element.querySelector('h5') !== null && element.querySelector('.links-card') !== null)
    return parseSmallMenu(element);

  if (element.querySelector('.product-entry-cta') !== null)
    return parseProductEntryCTA(element);

  if (element.querySelector('strong') !== null)
    return parsePrimaryCTA(element);

  if (element.querySelector('em') !== null)
    return parseSecondaryCTA(element);

  if (element.querySelector('a') === null)
    return parseText(element);

  return parseLink(element.querySelector('a'));
};

export const component = (
  c: Component,
  index?: number
): HTML => {
  switch (c.type) {
    case "Text": return text(c);
    case "Link": return link(c);
    case "SecondaryCTA": return secondaryCTA(c);
    case "PrimaryCTA": return primaryCTA(c);
    case "ProductEntryCTA": return productEntryCTA(c);
    case "Brand": return brand(c);
    case "MegaMenu": return megaMenu(c, index);
    case "SmallMenu": return smallMenu(c, index);
    default: {
      const exhaustive : never = c;
      console.error(`Failed to recognize component: ${exhaustive}`);
      return '';
    }
  }
};

const ERRORS = {
  elementNull: "Element is null",
};

