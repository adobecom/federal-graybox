import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { parseLinksCard } from "../LinksCard/Parse";
import { GnavCards, GnavColumn } from "../MegaMenu/Parse";

export type SmallMenu = {
  type: "SmallMenu";
  title: string;
  content: Parsed<GnavCards, RecoverableError>;
};

export const parseSmallMenu = (
  element: Element | null
): Parsed<SmallMenu, RecoverableError> => {
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  const title = element.querySelector('h5')?.textContent ?? "";

  const linksCardEl = element.querySelector('.links-card');
  if (linksCardEl === null)
    throw new IrrecoverableError(ERRORS.noLinksCard);

  const [linksCard, cardErrors] = parseLinksCard(linksCardEl);

  const column: GnavColumn = {
    type: "GnavColumn",
    cards: [{ type: "LinksCard", card: linksCard.card }],
  };

  const content: Parsed<GnavCards, RecoverableError> = [
    {
      type: "GnavCards",
      megaMenuTitle: title,
      sections: [column],
    },
    cardErrors,
  ];

  return [
    {
      type: "SmallMenu",
      title,
      content,
    },
    cardErrors,
  ];
};

const ERRORS = {
  elementNull: "Element is null",
  noLinksCard: "Small Menu has no links-card",
};
