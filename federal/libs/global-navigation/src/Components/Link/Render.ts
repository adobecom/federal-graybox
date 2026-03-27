import { getAnalyticsAttrs, getAriaAttrs, localizeHref } from "../../Utils/Utils";
import { Link } from "./Parse";

export const link = ({
  text,
  href,
  daaLl,
  ariaLabel,
  ariaAttrs,
  svgIcon = '',
}: Link): HTML => `<a class="feds-link" href="${localizeHref(href)}"${getAriaAttrs(ariaAttrs, ariaLabel)}${getAnalyticsAttrs(null, daaLl ?? text)}>${text}${svgIcon}</a>`;
