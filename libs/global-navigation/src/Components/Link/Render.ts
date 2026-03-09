import { getAnalyticsAttrs } from "../../Utils/Utils";
import { Link } from "./Parse";

export const link = ({
  text,
  href,
  daaLl,
}: Link): HTML => `<a class="feds-link" href="${href}"${getAnalyticsAttrs(null, daaLl ?? text)}>${text}</a>`;
