import { PromoCardSmall, PromoCardSmallData } from "./Parse";
import { secondaryCTA } from "../../CTA/Render";
import { sanitize, federateUrl } from "../../../Utils/Utils";

export const promoCardSmall = ({ card }: PromoCardSmall): HTML =>
  renderCard(card);

const renderCard = ({
  title,
  titleHtml,
  body,
  cta,
  ctaHtml,
  bgImageAlt,
  bgImageSrc,
}: PromoCardSmallData): HTML => `
  <article class="promo-card-small" daa-lh="promo-card-small">
  ${
    bgImageSrc
      ? `<picture class="promo-card__bg">
            <img
            loading="lazy"
            src="${federateUrl(bgImageSrc)}"
            alt="${bgImageAlt}"
            class="promo-card__bg-image"
          >
          </picture>`
      : ""
  }
  <div class="promo-card-small__content">
      <div class="promo-card-small__text">
        <h2 id="title-${sanitize(title)}" class="promo-card-small__title" role="heading" aria-level="2">
          ${titleHtml}
        </h2>
        ${body ? `<p class="promo-card-small__body">${body}</p>` : ""}
      </div>
      ${renderCta({ cta, ctaHtml, title })}
    </div>
  </article>
`.trim();

const renderCta = ({
  cta,
  ctaHtml,
  title,
}: Pick<PromoCardSmallData, "cta" | "ctaHtml" | "title">): HTML => {
  if (ctaHtml !== null) {
    return `<div class="promo-card-small__cta promo-card-small__cta--merch">${ctaHtml}</div>`;
  }
  if (cta === null) return "";
  return `<div class="promo-card-small__cta">
             ${secondaryCTA({ ...cta, ariaAttrs: { 'aria-describedby': `title-${sanitize(title)}` } })}
           </div>`;
};
