import { link } from "../Link/Render";
import { Card, FeaturedCard } from "./Parse";
import { secondaryCTA } from "../CTA/Render";
import { icons, getAnalyticsAttrs, sanitize } from "../../Utils/Utils";

export const featuredcards = ({
  card
}: FeaturedCard, megaMenuTitle: string): HTML =>
  renderCard(card, megaMenuTitle);

const renderCard = ({
  title,
  subtitle,
  eyeBrow,
  footerCTA,
  bodyLink,
}: Card, megaMenuTitle: string): HTML => {
  const eyeBrowId = `featured-eyebrow-${sanitize(eyeBrow)}`;
  
  return `
  <div class="featured-card" tabindex="0" aria-label="${eyeBrow} ${megaMenuTitle}" ${getAnalyticsAttrs(eyeBrow, '')} role="group">
    <div>
      <div id="${eyeBrowId}" class="featured-eyebrow">${eyeBrow}</div>
      <h2>${title}</h2>
      <div class="featured-subtitle">${subtitle}</div>
      <span>${link({ ...bodyLink, ariaAttrs: { 'aria-describedby': eyeBrowId }, svgIcon: icons.chevronRight })}</span>
    </div>
    <div class="footer-container">
      ${secondaryCTA({ ...footerCTA, ariaAttrs: { 'aria-describedby': eyeBrowId } })}
    </div>
  </div>
`.trim();
};
