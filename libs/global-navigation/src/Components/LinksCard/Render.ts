import { secondaryCTA } from "../CTA/Render";
import { link } from "../Link/Render";
import { LinksCard, LinksCardItem } from "./Parse";

export const linkscard = ({
  card
}: LinksCard): HTML => renderCard(card);

const renderCard = ({
  title,
  links,
  footerCTA
}: LinksCardItem): HTML => `
  <article class="links-card">
    <div>
      <h4 class="links-card-title">${title}</h4>
      <ul class="links-card-links">
        ${links.map(item => `<li>${link(item)}</li>`).join("")}
      </ul>
    </div>
    ${footerCTA === null
      ? ""
      : `
    <div class="links-card-footer">
      ${secondaryCTA(footerCTA)}
    </div>`}
  </article>
`.trim();
