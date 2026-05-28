import { localizeHref } from "../../Utils/Utils";
import { Breadcrumbs } from "./Parse";

export const breadcrumbs = ({ items }: Breadcrumbs): HTML => `
<ul class="feds-breadcrumbs">
  ${items.map(({ text, href }) =>
    `<li><a href="${localizeHref(href)}">${text}</a></li>`
  ).join('')}
</ul>
`.trim();
