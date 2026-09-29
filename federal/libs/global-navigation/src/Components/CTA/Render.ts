import {
  getAnalyticsAttrs,
  getAriaAttrs,
  getTargetAttrs,
  getRegistrationGateAttrs,
  isMasFieldLink,
  localizeHref,
} from "../../Utils/Utils";
import { PrimaryCTA, ProductEntryCTA, SecondaryCTA } from "./Parse";

export const primaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: PrimaryCTA): HTML => {
  const { href: unblankedHref, target } = getTargetAttrs(href);
  const { href: strippedHref, hideWhenRegistered } =
    getRegistrationGateAttrs(unblankedHref);
  const pendingMerchAttr = isMasFieldLink(strippedHref)
    ? ' data-feds-merch-pending'
    : '';
  return `
<a href="${localizeHref(strippedHref)}"
  class="feds-primary-cta"${pendingMerchAttr}${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${target !== '' ? ` target="${target}"` : ''}
  ${hideWhenRegistered ? ' data-feds-hide-when-registered' : ''}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>${text}</a>
`;
};

export const secondaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: SecondaryCTA): HTML => {
  const { href: unblankedHref, target } = getTargetAttrs(href);
  const { href: strippedHref, hideWhenRegistered } =
    getRegistrationGateAttrs(unblankedHref);
  const pendingMerchAttr = isMasFieldLink(strippedHref)
    ? ' data-feds-merch-pending'
    : '';
  return `
<a href="${localizeHref(strippedHref)}"
  class="feds-secondary-cta"${pendingMerchAttr}${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${target !== '' ? ` target="${target}"` : ''}
  ${hideWhenRegistered ? ' data-feds-hide-when-registered' : ''}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>${text}</a>
`;
};

export const productEntryCTA = (
  { cta }: ProductEntryCTA
): HTML => `<div class="feds-product-entry-cta">${
  cta.type === "PrimaryCTA" ? primaryCTA(cta) : secondaryCTA(cta)
}</div>`;
