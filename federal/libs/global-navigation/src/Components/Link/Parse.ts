import { IrrecoverableError, RecoverableError } from "../../Error/Error";

export type Link = {
  type: 'Link';
  text: string;
  mobileText?: string;
  href: string;
  daaLl?: string | null;
  ariaLabel?: string;
  ariaAttrs?: Record<string, string>;
  svgIcon?: string;
  highlight?: boolean;
};

const ERRORS = {
  elementNull: "Error when parsing Link. Element is null",
  notAnchor: "Cannot parse non-anchor as Link",
  textContentNotFound: "Error when parsing Link. Element has no textContent",
  hrefNotFound: "Element has no href",
}

export const parseLink = (
  anchor: Element | null
): Parsed<Link, RecoverableError> => {
  if (anchor === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  if (anchor.tagName !== 'A')
    throw new IrrecoverableError(ERRORS.notAnchor);

  const [rawText, ariaLabel] = anchor?.textContent?.split('|').map(s => s.trim()) ?? ['', ''];
  if (rawText === '')
    throw new IrrecoverableError(ERRORS.textContentNotFound)

  const [text, mobileText] = rawText.split('::').map(s => s.trim());

  const href = anchor?.getAttribute("href") ?? '';
  if (href === '')
    throw new IrrecoverableError(ERRORS.hrefNotFound);
  const daaLl = anchor.getAttribute("daa-ll");

  return [
    {
      type: "Link",
      text,
      ...(mobileText !== undefined && { mobileText }),
      href,
      daaLl,
      ariaLabel
    },
    []
  ];
};
