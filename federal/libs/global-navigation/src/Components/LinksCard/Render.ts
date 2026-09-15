import { primaryCTA, secondaryCTA } from "../CTA/Render";
import { link } from "../Link/Render";
import { LinksCard, LinksCardItem } from "./Parse";
import { getAnalyticsAttrs, sanitize, icons, localizeHref } from "../../Utils/Utils";

export const linkscard = ({
  card
}: LinksCard): HTML => renderCard(card);

const renderCard = ({
  title,
  links,
  footerCTA,
  footerLink,
}: LinksCardItem): HTML => `
  <article class="links-card" ${getAnalyticsAttrs(title, '')}>
    <div>
      <div class="links-card-title-container" daa-ll="Close">
        <h2 id="links-card-${sanitize(title)}" class="links-card-title" role="heading" aria-level="2">${title}</h2>
        <span class="links-card-chevron" aria-hidden="true">${icons.chevronDown}</span>
      </div>
      <ul class="links-card-links" aria-labelledby="links-card-${sanitize(title)}">
        ${links.map(item => item.description !== undefined && item.description !== ''
          ? `<li class="links-card-links__item--has-description">
               <a class="feds-link links-card-links__item-link ${item.highlight ?? false ? 'feds-link--highlight' : ''}" href="${localizeHref(item.href)}" daa-ll="${item.text}">
                 <span class="links-card-links__item-title">${item.text}</span>
                 <span class="links-card-links__item-description">${item.description}</span>
               </a>
             </li>`
          : `<li>${link(item)}</li>`
        ).join("")}
      </ul>
    </div>
    ${footerCTA === null
      ? ""
      : `
    <div class="links-card-footer${footerLink !== null ? ' links-card-footer--has-link' : ''}">
      ${footerLink === null ? '' : `<div class="links-card-footer-link">${link({ ...footerLink, highlight: true})}</div>`}
      ${footerCTA.type === 'PrimaryCTA'
        ? primaryCTA({ ...footerCTA, ariaAttrs: { 'aria-describedby': `links-card-${sanitize(title)}` } })
        : secondaryCTA({ ...footerCTA, ariaAttrs: { 'aria-describedby': `links-card-${sanitize(title)}` } })}
    </div>`}
  </article>
`.trim();

