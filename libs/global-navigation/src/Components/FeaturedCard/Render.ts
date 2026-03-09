import { link } from "../Link/Render";
import { Card, FeaturedCard } from "./Parse";
import { secondaryCTA } from "../CTA/Render";
import { icons } from "../../Utils/Utils";

export const featuredcards = ({
  card
}: FeaturedCard): HTML => renderCard(card);


const renderCard = ({
  title,
  subtitle,
  eyeBrow,
  footerCTA,
  bodyLink,
}: Card): HTML => `
  <article class="featured-card">
    <div>
      <div class="featured-eyebrow">${eyeBrow}</div>
      <h4>${title}</h4>
      <div class="featured-subtitle">${subtitle}</div>
      <span>${link(bodyLink)}${icons.chevronRight}</span>
    </div>
    <div class="footer-container">
      ${secondaryCTA(footerCTA)}
    </div>
  </article>
`.trim();
