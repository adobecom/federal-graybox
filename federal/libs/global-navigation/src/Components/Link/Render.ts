import { getAnalyticsAttrs, localizeHref } from "../../Utils/Utils";
import { Link } from "./Parse";

export const link = ({
  text,
  href,
  daaLl,
}: Link): HTML => `<a class="feds-link" href="${localizeHref(href)}"${getAnalyticsAttrs(null, daaLl ?? text)}>${text}</a>`;
