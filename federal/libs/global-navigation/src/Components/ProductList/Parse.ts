import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { getNextSiblings, parseListAndAccumulateErrors } from "../../Utils/Utils";
import { ProductCard, parseProductCard } from "../ProductCard/Parse";
import { Link, parseLink } from "../Link/Parse";

export type ProductList = {
  type: "ProductList";
  megaMenuTitle: string;
  categories: Array<ProductCategory>;
  links: Array<Link>;
  placeholders: Map<string, string>;
};

export type ProductCategory = {
  type: "ProductCategory";
  name: string;
  daaLl: string | null;
  links: Array<ProductCard>;
}

export const parseProductList = (
  element: HTMLElement | Element,
  megaMenuTitle = '',
  placeholders: Map<string, string> = new Map(),
): Parsed<ProductList, RecoverableError> => {
  const unparsedCategories = [...element.querySelectorAll('li > div')];
  const unparsedLinks = [...element.querySelectorAll('li > a')];
  const [
    categories,
    categoryErrors
  ] = parseListAndAccumulateErrors(unparsedCategories, parseProductCategory);
  const [
    links,
    linkErrors
  ] = parseListAndAccumulateErrors(unparsedLinks, parseLink);
  return [
    {
      type: "ProductList",
      megaMenuTitle,
      categories,
      links,
      placeholders,
    },
    [...categoryErrors, ...linkErrors]
  ]
};

const parseProductCategory = (
  element: Element
): Parsed<ProductCategory, RecoverableError> => {
  const h2 = element.firstElementChild;
  if (h2?.nodeName !== 'H2')
    throw new IrrecoverableError("Expected H2");

  const name = h2.textContent ?? '';
  const daaLl = h2.textContent ?? '';
  // Authors can link to a fragment (href ending in `#_inline`) in place of a
  // product-card div; MegaMenu/Parse.ts already fetches and splices that
  // fragment's markup in before we get here. Franklin/EDS fragments wrap
  // their block content in a section <div>, so the spliced-in element is
  // often that wrapper rather than the `.product-card` div itself — resolve
  // to the nested product-card when present.
  const linkGroups = getNextSiblings(h2).map((sibling) =>
    sibling.classList.contains('product-card')
      ? sibling
      : sibling.querySelector('.product-card') ?? sibling
  );
  const [
    links,
    errors
  ] = parseListAndAccumulateErrors(linkGroups, parseProductCard);
  return [
    {
      type: "ProductCategory",
      name,
      daaLl,
      links,
    },
    errors
  ]
};
