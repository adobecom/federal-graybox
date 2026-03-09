import { secondaryCTA } from "../CTA/Render";
import { Link } from "../Link/Parse";
import { link } from "../Link/Render";
import { Panels, FooterLink, LinkPanel, PanelPosition, Panel, ListWithImagePanel, ImagePanel } from "./Parse";

export const panels = ({ layout, panels }: Panels): HTML => {
  const gridCSS = `
    display: grid;
    grid-template-rows: ${layout.gridRows.join(' ')};
    grid-template-columns: ${layout.gridColumns.join(' ')};
  `;
  return `
    <ul class="panels" style="${gridCSS}">
      ${panels.map(p => `<li style="${positionCSS(p.position)}">${panel(p)}</li>`).join('')}
    </ul>
  `.trim();
};

const panel = (p: Panel): HTML => {
  switch (p.type) {
    case "LinkPanel": return linkpanel(p);
    case "ListWithImagePanel": return listwithimagepanel(p);
    case "ImagePanel": return imagepanel(p);
  }
};

const linkpanel = ({
  title,
  links,
  footer
}: LinkPanel): HTML => `
  <h4>${title}</h4>
  <ul class="link-panel">
    ${links.map((l: Link) => `<li>${link(l)}</li>`).join('')}
  </ul>
  ${footer === null ? '' : footerlink(footer)}
`.trim();

const listwithimagepanel = ({
  title,
  links,
  imageHref,
  footer
}: ListWithImagePanel): HTML => `
  <div class="list-image-panel">
    <div class="link-panel-container">
      <h4>${title}</h4>
      <ul class="link-panel">
        ${links.map((l: Link) => `<li>${link(l)}</li>`).join('')}
      </ul>
      ${footer === null ? '' : footerlink(footer)}
    </div>
    <picture>
      <img src="https://main--federal--adobecom.aem.page${imageHref}">
    </picture>
  </div>
`.trim();

const imagepanel = ({
  iconHref,
  iconAlt,
  imageHref,
  price,
  title,
  ctaText,
  ctaHref,
}:ImagePanel): HTML => `
  <div class="image-panel">
    <picture>
      <img src="https://main--federal--adobecom.aem.page${imageHref}">
    </picture>
    <div class="overlay">
      <picture class="icon">
        <img src="https://main--federal--adobecom.aem.page${iconHref}" alt="${iconAlt}">
      </picture>
      <div class="text">
        <span>$${price}</span>
        <span>${title}</span>
      </div>
      <a class="image-panel-button" href="${ctaHref}">
        ${ctaText}
      </a>
    </div>
  </div>
`;

const positionCSS = ({
  columnStart,
  columnEnd,
  rowStart,
  rowEnd,
}: PanelPosition): string => `
  grid-area: ${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}
`.trim();

const footerlink = (flink: FooterLink): HTML => {
  if (flink.isCta) {
    return secondaryCTA({ type: 'SecondaryCTA', text: flink.link.text, href: flink.link.href });
  }
  return link(flink.link);
};
