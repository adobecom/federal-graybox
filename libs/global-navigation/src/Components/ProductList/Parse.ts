import { IrrecoverableError, RecoverableError } from "../../test-exports";
import { getNextSiblings, parseListAndAccumulateErrors } from "../../Utils/Utils";
import { LinkGroup, parseLinkGroup } from "../LinkGroup/Parse";
import { Link, parseLink } from "../Link/Parse";

export type ProductList = {
  type: "ProductList";
  categories: List<ProductCategory>;
  links: List<Link>;
};

export type ProductCategory = {
  type: "ProductCategory";
  name: string;
  daaLh: string | null;
  links: List<LinkGroup>;
}

export const parseProductList = (
  element: HTMLElement | Element,
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
      categories,
      links,
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
  const daaLh = h2.textContent ?? '';
  const linkGroups = getNextSiblings(h2);
  const [
    links,
    errors
  ] = parseListAndAccumulateErrors(linkGroups, parseLinkGroup);
  return [
    {
      type: "ProductCategory",
      name,
      daaLh,
      links,
    },
    errors
  ]
};
