import { link } from "../Link/Render";
import { getAnalyticsAttrs, sanitize, icons } from "../../Utils/Utils";
import { SingleDropdown } from "./Parse";

export const singleDropdown = (
  { title }: SingleDropdown,
  index = 0
): HTML => `
  <button type="button"
          aria-controls="single-dropdown-${sanitize(title)}"
          aria-haspopup="true"
          aria-expanded="false"
          class="single-dropdown feds-link"
          ${getAnalyticsAttrs(`${title}-${index + 1}`, "header|Open")}
  >
    ${title}${icons.chevronDown}
  </button>
  <div id="single-dropdown-${sanitize(title)}" class="feds-popup single-dropdown-popup" daa-lh="${title}">
  </div>
`.trim();

export const singleDropdownPopup = ({
  title,
  links,
}: SingleDropdown): HTML => `
  <ul class="single-dropdown-list" ${getAnalyticsAttrs(title, "")} aria-label="${title}">
    ${links.map((item) => `<li class="single-dropdown-item">${link(item)}</li>`).join("")}
  </ul>
`.trim();
