import { secondaryCTA } from "../CTA/Render";
import { link } from "../Link/Render";
import { LinksCard, LinksCardItem } from "./Parse";
import { getAnalyticsAttrs, sanitize } from "../../Utils/Utils";

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
      <h2 id="links-card-${sanitize(title)}" class="links-card-title" role="heading" aria-level="2">${title}</h2>
      <ul class="links-card-links" aria-labelledby="links-card-${sanitize(title)}">
        ${links.map(item => `<li>${link(item)}</li>`).join("")}
      </ul>
    </div>
    ${footerCTA === null
      ? ""
      : `
    <div class="links-card-footer">
      ${secondaryCTA({ ...footerCTA, ariaAttrs: { 'aria-describedby': `links-card-${sanitize(title)}` } })}
    </div>`}
  </article>
`.trim();
