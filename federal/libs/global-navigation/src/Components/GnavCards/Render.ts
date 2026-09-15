import { featuredcards } from "../FeaturedCard/Render";
import { linkscard } from "../LinksCard/Render";
import { promoCard } from "../PromoCard/Standard/Render";
import { promoCardSmall } from "../PromoCard/Small/Render";
import { GnavCards, GnavColumn } from "../MegaMenu/Parse";

const renderCard = (card: GnavColumn["cards"][number], megaMenuTitle: string): HTML => {
  switch (card.type) {
    case "FeaturedCard":
      return featuredcards(card, megaMenuTitle);
    case "LinksCard":
      return linkscard(card);
    case "PromoCard":
      return promoCard(card);
    case "PromoCardSmall":
      return promoCardSmall(card);
    default: card satisfies never;
  }
  return "";
};

// A standard promo card relies on the per-column layout: the CSS width rules
// (calc(50% - 4px), calc(25% - 6px)) target direct <li> children of
// .feds-gnav-cards. Flattening every card into a single grid group would bury
// the promo card and break those rules.
const hasPromoCard = (cards: GnavColumn["cards"]): boolean =>
  cards.some((card) => card.type === "PromoCard");

const renderColumn = (
  column: GnavColumn,
  megaMenuTitle: string,
): HTML =>
  `<li>${column.cards.map((card) => renderCard(card, megaMenuTitle)).join("")}</li>`;

export const gnavCards = ({
  sections,
  megaMenuTitle,
}: GnavCards): HTML => {
  // Every card across all columns is laid out together in a single grid group.
  const cards = sections.flatMap((column) => column.cards);

  // When a standard promo card is amongst the cards, skip the "five cards in a
  // row" feature and render each column as its own <li> so the promo layout
  // width rules apply.
  if (hasPromoCard(cards)) {
    const renderedColumns = sections
      .map((column) => renderColumn(column, megaMenuTitle))
      .join("");
    return `
  <div class="feds-gnav-cards">
    ${renderedColumns}
  </div>
`;
  }

  // Up to five cards sit in a single row; beyond that they split across two
  // balanced rows (columns = half the cards, rounded up).
  const columns = cards.length > 5
    ? Math.ceil(cards.length / 2)
    : cards.length;
  const renderedCards = cards
    .map((card) => renderCard(card, megaMenuTitle))
    .join("");

  return `
  <div class="feds-gnav-cards">
    <li class="feds-gnav-column--links-grid" style="--links-grid-columns: ${columns}">${renderedCards}</li>
  </div>
`;
};
