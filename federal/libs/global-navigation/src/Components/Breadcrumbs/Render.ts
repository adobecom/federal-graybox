import { localizeHref } from "../../Utils/Utils";
import { Breadcrumbs } from "./Parse";

export const breadcrumbs = ({ items }: Breadcrumbs): HTML => `
<ul class="feds-breadcrumbs">
  ${items.map((item) =>
    typeof item === 'string'
      ? `<li><span>${item}</span></li>`
      : `<li><a href="${localizeHref(item.href)}">${item.text}</a></li>`
  ).join('')}
</ul>
`.trim();
