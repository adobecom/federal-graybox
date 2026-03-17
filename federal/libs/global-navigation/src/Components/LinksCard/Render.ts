import { secondaryCTA } from "../CTA/Render";
import { link } from "../Link/Render";
import { LinksCard, LinksCardItem } from "./Parse";
import { getAnalyticsAttrs } from "../../Utils/Utils";

export const linkscard = ({
  card
}: LinksCard): HTML => renderCard(card);

const renderCard = ({
  title,
  links,
  footerCTA
}: LinksCardItem): HTML => `
  <article class="links-card" ${getAnalyticsAttrs(title, '')}>
    <div>
      <p class="links-card-title" role="heading" aria-level="2">${title}</p>
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
