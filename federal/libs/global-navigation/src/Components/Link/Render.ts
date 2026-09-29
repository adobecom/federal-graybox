import {
  getAnalyticsAttrs,
  getAriaAttrs,
  isMasFieldLink,
  localizeHref,
} from "../../Utils/Utils";
import { Link } from "./Parse";

export const link = ({
  text,
  mobileText,
  href,
  daaLl,
  highlight,
  ariaLabel,
  ariaAttrs,
  svgIcon = '',
}: Link): HTML => {
  const textHTML = mobileText !== undefined
    ? `<span class="feds-link__desktop-text">${text}</span><span class="feds-link__mobile-text">${mobileText}</span>`
    : text;
  const pendingMerchAttr = isMasFieldLink(href)
    ? ' data-feds-merch-pending'
    : '';
  return `<a class="feds-link ${highlight ?? false ? 'feds-link--highlight' : ''}" href="${localizeHref(href)}"${pendingMerchAttr}${getAriaAttrs(ariaAttrs, ariaLabel)}${getAnalyticsAttrs(null, daaLl ?? text)}>${textHTML}${svgIcon}</a>`;
};
