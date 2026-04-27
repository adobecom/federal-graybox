import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { Link, parseLink } from "../Link/Parse";
import { parseSecondaryCTA, SecondaryCTA } from "../CTA/Parse";

export type FeaturedCard = {
  type: "FeaturedCard";
  card: Card;
};

export type Card = {
  type: "Card";
  title: string;
  subtitle: string;
  eyeBrow: string;
  bodyLink: Link;
  footerCTA: SecondaryCTA;
};

export const parseFeaturedCard = (
  element: HTMLElement | Element
): Parsed<FeaturedCard, RecoverableError> => {
  const [card, errors] = parseCard(element);
  return [
    {
      type: "FeaturedCard",
      card,
    },
    errors
  ];
};

const parseCard = (
  element: Element
): Parsed<Card, RecoverableError> => {
  const eyeBrowElement = element.querySelector('h5') || null;
  if (!eyeBrowElement)
    throw new RecoverableError("Eye brow element not found");
  const titleElement = element.querySelector('h4') || null;
  const subtitleElement = titleElement?.nextElementSibling || null;
  if (!titleElement)
    throw new IrrecoverableError("Expected title");
  if (!subtitleElement)
    throw new IrrecoverableError("Expected subtitle");
  const linkElement
    = subtitleElement.nextElementSibling?.firstElementChild || null;
  if (!linkElement) {
    throw new IrrecoverableError("Expected card link after subtitle");
  }

  const [cardLink, linkErrors] = parseLink(linkElement);

  const [
    footerCTA,
    ctaErrors
  ] = parseSecondaryCTA(element) as Parsed<SecondaryCTA, RecoverableError>;

  return [
    {
      type: "Card",
      title: titleElement.textContent ?? '',
      subtitle: subtitleElement.textContent ?? '',
      bodyLink: cardLink,
      footerCTA,
      eyeBrow: eyeBrowElement.textContent ?? '',
    },
    [...ctaErrors, ...linkErrors]
  ];
};

