import { getAnalyticsAttrs, getAriaAttrs, localizeHref } from "../../Utils/Utils";
import { PrimaryCTA, ProductEntryCTA, SecondaryCTA } from "./Parse";

export const primaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: PrimaryCTA): HTML => `
<a href="${localizeHref(href)}"
  class="feds-primary-cta"${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>
  ${text}
</a>
`;

export const secondaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
}: SecondaryCTA): HTML => `
<a href="${localizeHref(href)}" 
  class="feds-secondary-cta"${getAriaAttrs(ariaAttrs, ariaLabel)}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>
  ${text}
</a>
`;

export const productEntryCTA = (
  { cta }: ProductEntryCTA
): HTML => `<div class="feds-product-entry-cta">${
  cta.type === "PrimaryCTA" ? primaryCTA(cta) : secondaryCTA(cta)
}</div>`;

