import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import {
  PrimaryCTA,
  SecondaryCTA,
  parsePrimaryCTA,
  parseSecondaryCTA,
} from "../CTA/Parse";
import {
  getTargetAttrs,
  isMasFieldLink,
  isMerchLink,
  localizeHref,
} from "../../Utils/Utils";
import { parseSvgIcon } from "../SvgIcon/Parse";

export type PromoBarVariant = 'minimized' | 'maximized' | 'maximized-release';

export type PromoBarContent = {
  icon: string | null;
  iconAlt: string | null;
  productName: string | null;
  headline: string | null;
  body: string | null;
  primaryCta: PrimaryCTA | null;
  secondaryCta: SecondaryCTA | null;
  // outerHTML of the <picture> element (source variants + fallback img),
  // not a bare URL.
  bgImage: string | null;
};

export type PromoBarViewport = 'mobile' | 'tablet' | 'desktop';

export type PromoBarSlot = {
  viewports: PromoBarViewport[];
  content: PromoBarContent;
};

export type PromoBar = {
  type: 'PromoBar';
  variant: PromoBarVariant;
  theme: 'light' | 'dark';
  bgColor: string | null;
  slots: PromoBarSlot[];
};

const ERRORS = {
  elementNull: "Error when parsing PromoBar. Element is null",
};

const VARIANTS: readonly PromoBarVariant[] = ['maximized-release', 'maximized'];

const parseVariant = (classList: DOMTokenList): PromoBarVariant =>
  VARIANTS.find((v) => classList.contains(v)) ?? 'minimized';

// Image fields (e.g. backgroundImage) never render as copy text.
const isMasImageFieldLink = (href: string): boolean => {
  if (!isMasFieldLink(href)) return false;
  let hash = href;
  try { hash = new URL(href).hash; } catch { /* keep raw href */ }
  const field = /field=([^&]+)/.exec(hash)?.[1] ?? '';
  return /image/i.test(decodeURIComponent(field));
};

// A headless copy field link (M@S text field or OST/merch link) that stands in
// for prominent promo text, so the parser accepts it without authored bold.
const hasCopyFieldLink = (p: Element): boolean =>
  [...p.querySelectorAll('a[href]')].some((a) => {
    const href = a.getAttribute('href') ?? '';
    return (isMasFieldLink(href) || isMerchLink(href))
      && !isMasImageFieldLink(href);
  });

const parseContent = (cell: Element): PromoBarContent => {
  const pictures = [...cell.querySelectorAll('picture')];

  // Any picture(s) left over after the icon (e.g. the maximized-release
  // promo image) are bg-image candidates; the last of those is the bg image.
  const iconMatch = parseSvgIcon(cell);
  const icon = iconMatch?.src ?? null;
  const iconAlt = iconMatch?.alt ?? null;

  const bgPictures = pictures.filter((p) => p !== iconMatch?.element);
  const [lastBgPicture] = bgPictures.slice(-1);
  const bgPicture = lastBgPicture ?? null;
  // Keep the full <picture> markup (all <source> variants + fallback <img>)
  // so responsive/format switching survives into the rendered output. By
  // this point replaceDotMedia has already rewritten src/srcset to absolute
  // federated URLs, so no further URL processing is needed here. The class
  // is added directly to the <picture> so Render doesn't need a wrapper div.
  bgPicture?.classList.add('feds-promo-bar-bg');
  const bgImage = bgPicture?.outerHTML ?? null;
  const productName = cell.querySelector('h5')?.textContent?.trim() ?? null;

  const paragraphs = [...cell.querySelectorAll(':scope > p')];

  // Headline: the prominent promo line. Cells carry no labels, so a paragraph's
  // role is inferred from formatting. An authored bold headline always wins; a
  // plain M@S/merch copy field link is the headless fallback, so the headline
  // survives even when its bold resolves only at runtime.
  const isBoldHeadline = (p: Element): boolean => {
    if (p.querySelector('em > a') !== null) return false;
    const strong = p.querySelector('strong');
    if (strong === null) return false;
    // Exclude pure-CTA rows: <strong> wraps only an <a> and no other text.
    const isCtaRow = strong.querySelector('a') !== null
      && (strong.textContent ?? '').trim()
        === (strong.querySelector('a')?.textContent ?? '').trim();
    return !isCtaRow;
  };
  const isHeadlessHeadline = (p: Element): boolean =>
    p.querySelector('em > a') === null
    && p.querySelector('strong') === null
    && hasCopyFieldLink(p);

  const headlineEl = paragraphs.find(isBoldHeadline)
    ?? paragraphs.find(isHeadlessHeadline)
    ?? null;

  // Body: the first copy paragraph after the headline that isn't a CTA.
  const headlineIdx = headlineEl !== null ? paragraphs.indexOf(headlineEl) : -1;
  const bodyEl = paragraphs.slice(headlineIdx + 1).find((p) => {
    if (p.querySelector('strong') !== null) return false;
    if (p.querySelector('em > a') !== null) return false;
    return (p.textContent?.trim() ?? '').length > 0;
  }) ?? null;

  // Decorate merch, #_blank, and localize links within
  // headline/body before serializing.
  [headlineEl, bodyEl].forEach((el) => {
    if (el === null) return;
    el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      const href = a.getAttribute('href') ?? '';
      if (isMerchLink(href)) a.classList.add('merch');

      const { href: strippedHref, target } = getTargetAttrs(href);
      if (target !== '') a.setAttribute('target', target);
      a.setAttribute('href', localizeHref(strippedHref));
    });
  });

  const headline = headlineEl?.innerHTML?.trim() ?? null;
  const body = bodyEl?.innerHTML?.trim() ?? null;

  // CTA rows: <strong><a> = primary, <em><a> = secondary.
  const primaryCtaP = paragraphs.find(
    (p) => p.querySelector('strong > a') !== null,
  ) ?? null;
  const secondaryCtaP = paragraphs.find(
    (p) => p.querySelector('em > a') !== null,
  ) ?? null;

  let primaryCta: PrimaryCTA | null = null;
  try {
    [primaryCta] = parsePrimaryCTA(primaryCtaP) as Parsed<PrimaryCTA, unknown>;
  } catch (_) { primaryCta = null; }

  let secondaryCta: SecondaryCTA | null = null;
  try {
    [secondaryCta] = parseSecondaryCTA(secondaryCtaP) as
      Parsed<SecondaryCTA, unknown>;
  } catch (_) { secondaryCta = null; }

  return {
    icon, iconAlt, productName, headline, body,
    primaryCta, secondaryCta, bgImage,
  };
};

export const parsePromoBar = (
  element: Element | null,
): Parsed<PromoBar, RecoverableError> => {
  if (element === null)
    throw new IrrecoverableError(ERRORS.elementNull);

  const variant = parseVariant(element.classList);
  const theme: 'light' | 'dark' = element.classList.contains('dark')
    ? 'dark'
    : 'light';

  const bgColor = element
    .querySelector(':scope > div:first-child > div')
    ?.textContent?.trim() ?? null;

  const contentCells = [
    ...element.querySelectorAll(':scope > div + div > div'),
  ];
  const parsed = contentCells.map(parseContent);

  // Map parsed cells to viewport slots based on count:
  // 1 cell  → all viewports
  // 2 cells → [0] mobile+tablet, [1] desktop
  // 3 cells → [0] mobile, [1] tablet, [2] desktop
  const ALL: PromoBarViewport[] = ['mobile', 'tablet', 'desktop'];
  let viewportGroups: PromoBarViewport[][];
  if (parsed.length === 3) {
    viewportGroups = [['mobile'], ['tablet'], ['desktop']];
  } else if (parsed.length === 2) {
    viewportGroups = [['mobile', 'tablet'], ['desktop']];
  } else {
    viewportGroups = parsed.map(() => ALL);
  }
  const slots: PromoBarSlot[] = parsed.map((content, i) => ({
    viewports: viewportGroups[i],
    content,
  }));

  return [
    { type: 'PromoBar', variant, theme, bgColor, slots },
    [],
  ];
};
