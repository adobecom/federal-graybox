import { getAnalyticsAttrs } from "../../Utils/Utils";
import { PrimaryCTA, ProductEntryCTA, SecondaryCTA } from "./Parse";

export const primaryCTA = ({
  text,
  href,
  daaLl,
  ariaLabel,
}: PrimaryCTA): HTML => `
<a href="${href}"
  class="feds-primary-cta"
  ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}
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
<a href="${href}" 
  class="feds-secondary-cta" 
  ${ariaLabel ? `aria-label="${ariaLabel}"` : ''}
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

