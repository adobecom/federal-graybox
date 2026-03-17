import {
  IrrecoverableError,
  Link,
  parseLink,
  RecoverableError
} from "../../test-exports";
import { parseListAndAccumulateErrors } from "../../Utils/Utils";
import { parseSecondaryCTA, SecondaryCTA } from "../CTA/Parse";

export type LinksCard = {
  type: "LinksCard";
  card: LinksCardItem;
};

export type LinksCardItem = {
  type: "LinksCardItem";
  title: string;
  links: List<Link>;
  footerCTA: SecondaryCTA | null;
};

export const parseLinksCard = (
  element: HTMLElement | Element
): Parsed<LinksCard, RecoverableError> => {
  const [card, errors] = parseCard(element);
  return [
    {
      type: "LinksCard",
      card,
    },
    errors
  ];
};

const parseCard = (
  element: Element
): Parsed<LinksCardItem, RecoverableError> => {
  const titleElement = element.querySelector('h2, h3, h4') || null;
  if (!titleElement) {
    throw new IrrecoverableError("Expected links card title");
  }

  const footerCtaAnchor = element.querySelector('em > a');
  const linkElements = [...element.querySelectorAll('a')]
    .filter((anchor) => anchor !== footerCtaAnchor);
  if (linkElements.length === 0) {
    throw new IrrecoverableError("Expected at least one link");
  }
  const [links, linkErrors] = parseListAndAccumulateErrors(
    linkElements,
    parseLink
  );

  const [footerCTA, ctaErrors]
    = (() : Parsed<SecondaryCTA | null, RecoverableError> => {
      try {
        return parseSecondaryCTA(element) as Parsed<
          SecondaryCTA,
          RecoverableError
        >;
      } catch (_error) {
        return [null, []];
      }
    })();
  if (footerCTA) {
    footerCTA.daaLl = `${titleElement.textContent ?? ''} - ${footerCTA?.daaLl}`;
  }
  return [
    {
      type: "LinksCardItem",
      title: titleElement.textContent ?? "",
      links,
      footerCTA,
    },
    [...linkErrors, ...ctaErrors]
  ];
};

