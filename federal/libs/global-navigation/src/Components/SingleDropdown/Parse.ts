import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { Link, parseLink } from "../Link/Parse";
import { parseListAndAccumulateErrors } from "../../Utils/Utils";

export type SingleDropdown = {
  type: "SingleDropdown";
  title: string;
  links: Array<Link>;
};

export const parseSingleDropdown = (
  element: Element | null
): Parsed<SingleDropdown, RecoverableError> => {
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  const titleElement = element.querySelector("h5");
  if (!titleElement)
    throw new IrrecoverableError(ERRORS.noTitle);
  const title = titleElement.textContent ?? "";

  const anchors = [...element.querySelectorAll("ul li a")];
  if (anchors.length === 0)
    throw new IrrecoverableError(ERRORS.noLinks);

  const [links, linkErrors] = parseListAndAccumulateErrors(anchors, parseLink);

  return [
    {
      type: "SingleDropdown",
      title,
      links,
    },
    linkErrors,
  ];
};

const ERRORS = {
  elementNull: "Element is null",
  noTitle: "SingleDropdown is missing an <h5> title",
  noLinks: "SingleDropdown has no links in <ul>",
};
