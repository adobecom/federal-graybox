import { getAnalyticsAttrs, sanitize, icons } from "../../Utils/Utils";
import { gnavCards } from "../GnavCards/Render";
import { productlist } from "../ProductList/Render";
import { MegaMenu, MegaMenuContent } from "./Parse";

export const megaMenu = ({
  title,
}: MegaMenu): HTML => `
  <button type="button"
          aria-controls="${sanitize(title)}"
          aria-haspopup="true"
          class="mega-menu feds-link"
          popovertarget="${sanitize(title)}"
          ${getAnalyticsAttrs(null, title)}
  >
    ${title}${icons.chevronDown}
  </button>
  <div id="${sanitize(title)}" popover class="feds-popup">
  </div>
`;

export const popup = (
  data: MegaMenuContent,
  popupId: string,
  title: string,
): HTML => {
  const headerContent = `
        <button
          type="button"
          class="feds-popup-back-button"
          popovertarget="${sanitize(popupId)}"
          popovertargetaction="hide"
          aria-label="Back"
        >
          ${icons.chevronLeft}
        </button>
        <span class="feds-popup-title">${title}</span>
  `
  const productLink = data.type === "ProductList" && data.links.length > 0
    ? data.links[data.links.length - 1]
    : null;
  const popupHeader = `
    <div class="feds-popup-header">
      <div class="feds-popup-header-left">${headerContent}</div>
      ${productLink
          ? `<div class="product-links"><a class="feds-link" href="${productLink.href}"${getAnalyticsAttrs(null, productLink.daaLl ?? productLink.text)}>${productLink.text}${icons.chevronRight}</a></div>`
          : ''}
    </div>
  `.trim();

  let popupContent: HTML = '';
  switch (data.type) {
    case "ProductList":
      popupContent = productlist(data);
      break;
    case "GnavCards":
      popupContent = gnavCards(data);
      break;
    default: data satisfies never;
  }
  return `${popupHeader}${popupContent}`;
}
