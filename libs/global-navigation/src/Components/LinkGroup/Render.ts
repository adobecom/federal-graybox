import { LinkGroup, LinkGroupBlue, LinkGroupHeader, LinkGroupLink } from "./Parse";
import { getAnalyticsAttrs } from "../../Utils/Utils";

export const linkGroup = (lg: LinkGroup): HTML => {
  switch (lg.type) {
    case "LinkGroupHeader": return linkGroupHeader(lg);
    case "LinkGroupLink": return linkGroupLink(lg);
    case "LinkGroupBlue": return linkGroupBlue(lg);
    default: {
      const exhaustivenessCheck: never = lg;
      console.error(exhaustivenessCheck);
      return "";
    }
  }
};

const linkGroupHeader = ({
  title,
  classes,
  daaLl,
  daaLh
}: LinkGroupHeader): HTML => {
  const classNames = classes.slice(1).map(cls => `feds-link-group--${cls}`).join(' ');
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  return `
    <div role="heading" class="feds-link-group ${classNames}"${analyticsAttrs}>
      <div class="feds-link-group__content">
        <div class="feds-link-group__title">${title}</div>
      </div>
    </div>
  `;
};

const linkGroupLink = ({
  iconHref,
  iconAlt,
  title,
  href,
  subtitle,
  badges = [],
  daaLl,
  daaLh
}: LinkGroupLink): HTML => {
  const hasIcon = iconAlt !== null && iconHref !== null;
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  const icon = !hasIcon
    ? ""
    : `
      <picture class="feds-link-group__icon">
        <img
          loading="lazy"
          src="${iconHref}"
          alt="${iconAlt}"
          class="feds-link-group__icon-img"
        >
      </picture>
    `;
  const badgesMarkup = badges.length === 0
    ? ""
    : `
      <div class="feds-link-group__badges">
        ${badges.map((badge, index) => `
          <span class="feds-link-group__badge${index > 0 ? " feds-link-group__badge--filled" : ""}">
            ${badge}
          </span>
        `).join("")}
      </div>
    `;
  const subtitleMarkup = subtitle === ""
    ? ""
    : `<div class="feds-link-group__subtitle">${subtitle}</div>`;

  return `
    <a class="feds-link-group" href="${href}"${analyticsAttrs}>
      <div class="feds-link-header">
        ${icon}
        ${badgesMarkup}
      </div>
      <div class="feds-link-group__content">
       
        <div class="feds-link-group__title">${title}</div>
        ${subtitleMarkup}
      </div>
    </a>
  `
}

const linkGroupBlue = ({
  link,
  daaLl,
  daaLh
}: LinkGroupBlue): HTML => {
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? link.text);
  return `
  <a href="${link.href}" class="feds-link-group feds-link-group--blue"${analyticsAttrs}>
    <div class="feds-link-group__content">
        <div class="feds-link-group__title">${link.text}</div>
      </div>
  </a>
`;
};

