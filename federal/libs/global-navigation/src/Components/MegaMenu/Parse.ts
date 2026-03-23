import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import {
  fetchAndProcessPlainHTML,
  inlineNestedFragments,
  parseListAndAccumulateErrors,
  replaceDotMedia,
} from "../../Utils/Utils";
import { LinksCard, parseLinksCard } from "../LinksCard/Parse";
import { parseProductList, ProductList } from "../ProductList/Parse";
import { parseFeaturedCard, FeaturedCard } from "../FeaturedCard/Parse";
import { parsePromoCard, PromoCard } from "../PromoCard/Parse";

export type MegaMenu = {
  type: "MegaMenu";
  title: string;
  content: Promise<Parsed<MegaMenuContent, RecoverableError>>;
};

export type MegaMenuContent = ProductList
                            | GnavCards;

export type GnavColumn = {
  type: "GnavColumn";
  cards: List<FeaturedCard | LinksCard | PromoCard>;
};

export type GnavCards = {
  type: "GnavCards";
  sections: List<GnavColumn>;
};

export const parseMegaMenu = (
  element: Element | null
): Parsed<MegaMenu, RecoverableError> => {
  const errors = new Set<RecoverableError>();
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  const title = element.querySelector('h2')?.textContent ?? "";
  if (title === "")
    errors.add(new RecoverableError(ERRORS.noTitle))

  const content = (async (): 
                   Promise<Parsed<MegaMenuContent, RecoverableError>> => {
    try {
      const fragment: HTMLAnchorElement | null = element.querySelector('a');
      const fragmentURL = new URL(fragment?.href ?? "");
      const initialFragment =
        await fetchAndProcessPlainHTML(fragmentURL);
      if (initialFragment instanceof IrrecoverableError)
        throw new Error(initialFragment.message);
      const megaMenuFragment = await inlineNestedFragments(initialFragment);
      if (megaMenuFragment instanceof IrrecoverableError)
        throw new Error(megaMenuFragment.message);
      replaceDotMedia(fragmentURL.href, megaMenuFragment);
      if (element.classList.contains('product-list'))
        return parseProductList(megaMenuFragment);
      return parseGnavCards(megaMenuFragment);
    } catch (e) {
        // @ts-expect-error errors usually have a message
        throw new IrrecoverableError(e?.message);
    }
  })();

  if (content instanceof IrrecoverableError)
    throw content;

  return [
    {
      type: "MegaMenu",
      title,
      content,
    },
    [
      ...errors
    ]
  ]
};

const ERRORS = {
  elementNull: "Element is null",
  noTitle: "Large Menu has no Title",
};

const parseGnavCards = (
  fragment: Element | HTMLElement
): Parsed<GnavCards, RecoverableError> => {
  // Get direct children divs - these represent columns
  const columnDivs = [...fragment.children];
  if (columnDivs.length === 0) {
    throw new IrrecoverableError(
      "No mega menu items found (did you forget to add them correctly?)"
    );
  }

  // Parse each column div and its child cards
  const [sections, errors]
    = parseListAndAccumulateErrors(columnDivs, 
      (columnDiv) => parseGnavColumn(columnDiv));
  if (sections.length === 0) {
    throw new IrrecoverableError("Failed to parse gnav cards sections");
  }
  return [
    {
      type: "GnavCards",
      sections,
    },
    errors
  ];
};

const parseGnavColumn = (
  columnDiv: Element
): Parsed<GnavColumn, RecoverableError> => {
  // Find cards within this specific column div
  const cardElements = [...columnDiv.querySelectorAll('.featured-card, .links-card, .promo-card')];
  if (cardElements.length === 0) {
    throw new IrrecoverableError(
      "Column contains no cards (did you forget to label them correctly?)"
    );
  }
  
  const [cards, errors]
    = parseListAndAccumulateErrors(cardElements,
      (card) => parseGnavCardSection(card));
  if (cards.length === 0) {
    throw new IrrecoverableError("Failed to parse cards in column");
  }
  
  return [
    {
      type: "GnavColumn",
      cards,
    },
    errors
  ];
};

const parseGnavCardSection = (
  section: Element
): Parsed<FeaturedCard | LinksCard | PromoCard, RecoverableError> => {
  if (section.classList.contains('featured-card')) {
    return parseFeaturedCard(section);
  }
  if (section.classList.contains('links-card')) {
    return parseLinksCard(section);
  }
  if (section.classList.contains('promo-card')) {
    return parsePromoCard(section);
  }
  throw new IrrecoverableError("Unsupported gnav cards section");
};
