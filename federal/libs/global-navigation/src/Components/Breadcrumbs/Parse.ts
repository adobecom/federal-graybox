import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { Link, parseLink } from "../Link/Parse";
import { parseListAndAccumulateErrors } from "../../Utils/Utils";

export type Breadcrumbs = {
  type: 'Breadcrumbs';
  items: Array<Link>;
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

  // The breadcrumbs block is authored as one <ul> per crumb, each
  // containing a single <li><a>. Collect every anchor in document
  // order and parse it as a Link.
  const anchors = [...element.querySelectorAll('ul > li > a')];
  if (anchors.length === 0)
    throw new IrrecoverableError(ERRORS.noItems);

  const [items, errors] = parseListAndAccumulateErrors(anchors, parseLink);

  return [
    {
      type: 'Breadcrumbs',
      items,
    },
    errors,
  ];
};
