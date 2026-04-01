import { ProductCard, ProductCardBlue, ProductCardHeader, ProductCardLink } from "./Parse";
import { getAnalyticsAttrs, localizeHref, federateUrl } from "../../Utils/Utils";

export const productCard = (card: ProductCard): HTML => {
  switch (card.type) {
    case "ProductCardHeader": return productCardHeader(card);
    case "ProductCardLink": return productCardLink(card);
    case "ProductCardBlue": return productCardBlue(card);
    default: {
      const exhaustivenessCheck: never = card;
      console.error(exhaustivenessCheck);
      return "";
    }
  }
};

const productCardHeader = ({
  title,
  classes,
  daaLl,
  daaLh
}: ProductCardHeader): HTML => {
  const classNames = classes.slice(1).map(cls => `feds-product-card--${cls}`).join(' ');
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  return `
    <div role="heading" class="feds-product-card ${classNames}"${analyticsAttrs}>
      <div class="feds-product-card__content">
        <div class="feds-product-card__title">${title}</div>
      </div>
    </div>
  `;
};

const productCardLink = ({
  iconHref,
  iconAlt: _,
  title,
  href,
  subtitle,
  badges = [],
  daaLl,
  daaLh
}: ProductCardLink): HTML => {
  const hasIcon = iconHref !== null;
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  const icon = !hasIcon
    ? ""
    : `
      <picture class="feds-product-card__icon">
        <img
          loading="lazy"
          src="${federateUrl(iconHref)}"
          class="feds-product-card__icon-img"
        >
      </picture>
    `;
  const badgesMarkup = badges.length === 0
    ? ""
    : `
      <div class="feds-product-card__badges">
        ${badges.map(({ text, isFilled }) => `
          <span class="feds-product-card__badge${isFilled ? " feds-product-card__badge--filled" : ""}">
            ${text}
          </span>
        `).join("")}
      </div>
    `;
  const subtitleMarkup = subtitle === ""
    ? ""
    : `<div class="feds-product-card__subtitle">${subtitle}</div>`;

  return `
    <a class="feds-product-card" href="${localizeHref(href)}"${analyticsAttrs}>
      <div class="feds-product-card-header">
        ${icon}
        ${badgesMarkup}
      </div>
      <div class="feds-product-card__content">
       
        <div class="feds-product-card__title">${title}</div>
        ${subtitleMarkup}
      </div>
    </a>
  `
}

const productCardBlue = ({
  link,
  daaLl,
  daaLh
}: ProductCardBlue): HTML => {
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? link.text);
  return `
  <a href="${localizeHref(link.href)}" class="feds-product-card feds-product-card--blue"${analyticsAttrs}>
    <div class="feds-product-card__content">
        <div class="feds-product-card__title">${link.text}</div>
      </div>
  </a>
`;
};

