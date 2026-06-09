import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { Link, parseLink } from "../Link/Parse";
import { parseListAndAccumulateErrors } from "../../Utils/Utils";

export type Breadcrumbs = {
  type: 'Breadcrumbs';
  items: Array<Link | string>;
};

const ERRORS = {
  elementNull: "Error when parsing Breadcrumbs. Element is null",
  noItems: "Error when parsing Breadcrumbs. No items found",
};

export const parseBreadcrumbs = (
  element: Element | null,
): Parsed<Breadcrumbs, RecoverableError> => {
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  // The breadcrumbs block is authored as <ul> with one <li> per crumb.
  // Most <li>s wrap an <a> (a navigable
  // crumb), but the final crumb is typically a raw text node
  // representing the current page. Collect every <li> in document
  // order and parse it either as a Link or as a plain string.
  const listItems = [...element.querySelectorAll('ul > li')];
  if (listItems.length === 0)
    throw new IrrecoverableError(ERRORS.noItems);

  const parseItem = (li: Element): Parsed<Link | string, RecoverableError> => {
    const anchor = li.querySelector(':scope > a');
    if (anchor !== null) return parseLink(anchor);
    const text = li.textContent?.trim() ?? '';
    return [text, []];
  };

  const [items, errors] = parseListAndAccumulateErrors(listItems, parseItem);

  return [
    {
      type: 'Breadcrumbs',
      items,
    },
    errors,
  ];
};
