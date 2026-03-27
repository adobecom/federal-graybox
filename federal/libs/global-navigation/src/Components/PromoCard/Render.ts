import { PromoCard, PromoCardData } from "./Parse";
import { secondaryCTA } from "../CTA/Render";
import { localizeHref, sanitize } from "../../Utils/Utils";

export const promoCard = ({ card }: PromoCard): HTML => renderCard(card);

const renderCard = ({
  bgImageAlt,
  bgImageSrc,
  iconAlt,
  iconSrc,
  title,
  cta,
  priceText,
  priceHref,
  isPriceMerchLink,
}: PromoCardData): HTML => `
  <article class="promo-card" daa-lh="promo-card">
    ${
      bgImageSrc
        ? `<picture class="promo-card__bg">
             <img src="${bgImageSrc}" alt="${bgImageAlt}" class="promo-card__bg-image">
           </picture>`
        : ""
    }

    <div class="promo-card__content">
      ${
        iconSrc
          ? `<picture class="promo-card__icon">
               <img src="${iconSrc}" alt="${iconAlt}" class="promo-card__icon-image">
             </picture>`
          : ""
      }
      <div class="promo-card__text-content">
        ${priceHref && isPriceMerchLink ? `<p id="price-${sanitize(title)}" class="promo-card__price">
          <a href="${localizeHref(priceHref)}" class="merch">${priceText}</a>
        </p>` : ''}
        <p id="title-${sanitize(title)}" class="promo-card__title" role="heading" aria-level="2">
          ${title}
        </p>
        ${
          cta === null
            ? ""
            : `<div class="promo-card__cta">
                 ${secondaryCTA({...cta, ariaAttrs: { 'aria-describedby': `title-${sanitize(title)}${isPriceMerchLink ? ` price-${sanitize(title)}` : ''}` }})}
               </div>`
        }
      </div>
    </div>
  </article>
`.trim();

