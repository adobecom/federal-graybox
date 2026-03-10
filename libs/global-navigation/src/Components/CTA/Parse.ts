import { RecoverableError } from "../../Error/Error";
import { alternative } from "../../Utils/Utils";
import { parseLink } from "../Link/Parse";

export type PrimaryCTA = {
  type: "PrimaryCTA";
  text: string;
  href: string;
  ariaLabel?: string;
  daaLl?: string | null;
};

export type SecondaryCTA = {
  type: "SecondaryCTA";
  text: string;
  href: string;
  ariaLabel?: string;
  daaLl?: string | null;
};

export type ProductEntryCTA = PrimaryCTA | SecondaryCTA;

const parseCTA = (
  type: Pick<CTA, 'type'>
) => (
  element: Element | null
): Parsed<CTA, RecoverableError> => {
  if (element === null)
    throw new Error('');

  const anchor = element.querySelector(getSelector(type));
  if (!anchor)
    throw new Error('');

  const [{ text, href, daaLl, ariaLabel }, es] = parseLink(anchor);
  return [
    {
      type: type.type,
      text,
      href,
      ariaLabel,
      daaLl: typeof daaLl === 'string' && daaLl.trim() !== '' ? daaLl : text,
    },
    es
  ]
}

export const parsePrimaryCTA = parseCTA({ type: "PrimaryCTA" });

export const parseSecondaryCTA = parseCTA({ type: "SecondaryCTA" });

export const parseProductEntryCTA = (
  element: Element | null
): Parsed<ProductEntryCTA, RecoverableError> => alternative(parsePrimaryCTA)
  .or(parseSecondaryCTA)
  .eval(element);

type CTA
  = PrimaryCTA
  | SecondaryCTA;

const getSelector = ({ type }: Pick<CTA, 'type'>): string => {
  switch (type) {
    case "PrimaryCTA": return 'strong > a';
    case "SecondaryCTA": return 'em > a';
    default: throw new Error('');
  }
}

