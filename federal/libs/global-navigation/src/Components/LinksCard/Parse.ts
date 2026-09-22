import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { Link, parseLink } from "../Link/Parse";
import { isMerchLink, isMasLink, parseListAndAccumulateErrors } from "../../Utils/Utils";
import { parsePrimaryCTA, parseSecondaryCTA, PrimaryCTA, SecondaryCTA } from "../CTA/Parse";

// True for OST/miniplans and M@S studio links (prices/fields).
const isCommerceHref = (href: string): boolean =>
  isMerchLink(href) || isMasLink(href);

export type LinksCard = {
  type: "LinksCard";
  card: LinksCardItem;
};

export type LinksCardItem = {
  type: "LinksCardItem";
  title: string;
  links: Array<Link & { highlight?: boolean; description?: string }>;
  footerCTA: PrimaryCTA | SecondaryCTA | null;
  footerLink: Link | null;
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
  const footerCtaAnchor = element.querySelector('em > a')
    || element.querySelector(':not(h6) > strong > a')
    || null;
  const footerCtaParentP = footerCtaAnchor?.closest('p') ?? null;
  const footerLinkAnchor = footerCtaParentP
    ? [...footerCtaParentP.querySelectorAll('a')]
      .find((anchor) => anchor !== footerCtaAnchor) ?? null
    : null;
  // A commerce link in the <p> right after another link is that link's price/
  // field description, not a standalone link — keep it out of the link list.
  const commerceDescriptionAnchors = new Set<Element>();
  [...element.querySelectorAll('a')].forEach((anchor) => {
    if (!isCommerceHref(anchor.getAttribute('href') ?? '')) return;
    const prev = anchor.closest('p')?.previousElementSibling ?? null;
    const prevAnchor = prev?.tagName === 'P' ? prev.querySelector('a') : null;
    if (prevAnchor && !isCommerceHref(prevAnchor.getAttribute('href') ?? '')) {
      commerceDescriptionAnchors.add(anchor);
    }
  });

  const linkElements = [...element.querySelectorAll('a')]
    .filter((anchor) =>
      anchor !== footerCtaAnchor
      && anchor !== footerLinkAnchor
      && !commerceDescriptionAnchors.has(anchor));
  if (linkElements.length === 0) {
    throw new IrrecoverableError("Expected at least one link");
  }
  const [links, linkErrors] = parseListAndAccumulateErrors(
    linkElements,
    (anchor) => {
      const [parsedLink, errors] = parseLink(anchor);
      const link: Link & { highlight?: boolean; description?: string }
        = parsedLink;
      link.highlight = anchor.parentElement?.tagName === 'STRONG'
        && anchor.parentElement?.parentElement?.tagName === 'H6';
      const anchorParentP = anchor.closest('p');
      const nextSibling = anchorParentP?.nextElementSibling;
      if (nextSibling?.tagName === 'P') {
        const descAnchors = [...nextSibling.querySelectorAll('a')]
          .filter((descAnchor) => commerceDescriptionAnchors.has(descAnchor));
        if (nextSibling.querySelector('a') === null) {
          link.description = nextSibling.textContent?.trim() ?? undefined;
        } else if (descAnchors.length > 0) {
          // Swap every commerce anchor for a non-anchor placeholder so none
          // stays a nested <a> in the card link; MerchLinks resolves each.
          descAnchors.forEach((descAnchor) => {
            const href = descAnchor.getAttribute('href') ?? '';
            const placeholder = document.createElement('span');
            placeholder.className = 'feds-commerce-placeholder';
            placeholder.setAttribute('data-commerce-href', href);
            placeholder.innerHTML = descAnchor.innerHTML;
            descAnchor.replaceWith(placeholder);
          });
          link.description = nextSibling.innerHTML.trim();
        }
      }
      return [link, errors];
    }
  );

  const isPrimary = footerCtaAnchor?.parentElement?.tagName === 'STRONG';
  const [footerCTA, ctaErrors]
    = (() : Parsed<PrimaryCTA | SecondaryCTA | null, RecoverableError> => {
      try {
        return isPrimary
          ? parsePrimaryCTA(footerCtaParentP) as Parsed<
              PrimaryCTA,
              RecoverableError
            >
          : parseSecondaryCTA(footerCtaParentP) as Parsed<
              SecondaryCTA, RecoverableError
            >;
      } catch (_error) {
        return [null, []];
      }
    })();
  if (footerCTA) {
    footerCTA.daaLl = `${titleElement?.textContent ?? ''} - ${footerCTA?.daaLl}`;
  }
  const [footerLink, footerLinkErrors]: Parsed<Link | null, RecoverableError>
    = footerLinkAnchor ? parseLink(footerLinkAnchor) : [null, []];
  return [
    {
      type: "LinksCardItem",
      title: titleElement?.textContent ?? "",
      links,
      footerCTA,
      footerLink,
    },
    [...linkErrors, ...ctaErrors, ...footerLinkErrors]
  ];
};

