import { megaMenu, popup } from "../MegaMenu/Render";
import { SmallMenu } from "./Parse";
import { MegaMenuContent } from "../MegaMenu/Parse";

export const smallMenu = (data: SmallMenu, index = 0): HTML =>
  megaMenu({ ...data, type: "MegaMenu", content: Promise.resolve(data.content) }, index)
    .replace('class="mega-menu feds-link"', 'class="mega-menu small-menu feds-link"')
    .replace('class="feds-popup"', 'class="feds-popup small-menu"');

export const smallMenuPopup = (
  data: MegaMenuContent,
  popupId: string,
): HTML => popup(data, popupId);
