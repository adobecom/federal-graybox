import { getAnalyticsAttrs, getAriaAttrs, getTargetAttrs, localizeHref } from "../../Utils/Utils";
import { PrimaryCTA, ProductEntryCTA, SecondaryCTA } from "./Parse";

export const primaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: PrimaryCTA): HTML => {
  const { href: strippedHref, target } = getTargetAttrs(href);
  return `
<a href="${localizeHref(strippedHref)}"
  class="feds-primary-cta"${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${target !== '' ? ` target="${target}"` : ''}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>
  ${text}
</a>
`;
};

export const secondaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: SecondaryCTA): HTML => {
  const { href: strippedHref, target } = getTargetAttrs(href);
  return `
<a href="${localizeHref(strippedHref)}"
  class="feds-secondary-cta"${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${target !== '' ? ` target="${target}"` : ''}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>
  ${text}
</a>
`;
};

export const productEntryCTA = (
  { cta }: ProductEntryCTA
): HTML => `<div class="feds-product-entry-cta">${
  cta.type === "PrimaryCTA" ? primaryCTA(cta) : secondaryCTA(cta)
}</div>`;

