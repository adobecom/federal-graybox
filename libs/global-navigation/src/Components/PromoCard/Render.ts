import { PromoCard, PromoCardData } from "./Parse";
import { secondaryCTA } from "../CTA/Render";
export const promoCard = ({ card }: PromoCard): HTML => renderCard(card);

const renderCard = ({
  bgImageAlt,
  bgImageSrc,
  iconAlt,
  iconSrc,
  title,
  cta,
  price,
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
        <p class="promo-card__price">${price}</p>
        <p class="promo-card__title" role="heading" aria-level="2">
          ${title}
        </p>
        ${
          cta === null
            ? ""
            : `<div class="promo-card__cta">
                 ${secondaryCTA(cta)}
               </div>`
        }
      </div>
    </div>
  </article>
`.trim();

