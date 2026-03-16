import { getAnalyticsAttrs, localizeHref } from "../../Utils/Utils";
import { PrimaryCTA, ProductEntryCTA, SecondaryCTA } from "./Parse";

export const primaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
}: PrimaryCTA): HTML => `
<a href="${localizeHref(href)}"
  class="feds-primary-cta"
  ${ariaLabel !== null && ariaLabel !== '' ? `aria-label="${ariaLabel}"` : ''}
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
}: SecondaryCTA): HTML => `
<a href="${localizeHref(href)}" 
  class="feds-secondary-cta" 
  ${ariaLabel !== null && ariaLabel !== '' ? `aria-label="${ariaLabel}"` : ''}
  ${getAnalyticsAttrs(null, daaLl ?? text)}
>
  ${text}
</a>
`;

export const productEntryCTA = (
  cta: ProductEntryCTA
): HTML => {
  if (cta.type === "PrimaryCTA")
    return primaryCTA(cta);
  return secondaryCTA(cta);
}

