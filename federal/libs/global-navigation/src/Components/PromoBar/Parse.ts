import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import {
  PrimaryCTA,
  SecondaryCTA,
  parsePrimaryCTA,
  parseSecondaryCTA,
} from "../CTA/Parse";
import { getTargetAttrs, isMerchLink, localizeHref } from "../../Utils/Utils";

export type PromoBarVariant = 'minimized' | 'maximized' | 'maximized-release';

export type PromoBarContent = {
  icon: string | null;
  iconAlt: string | null;
  productName: string | null;
  headline: string | null;
  body: string | null;
  primaryCta: PrimaryCTA | null;
  secondaryCta: SecondaryCTA | null;
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

type PromoBarIcon = {
  icon: string | null;
  iconAlt: string | null;
};

const ERRORS = {
  elementNull: "Error when parsing PromoBar. Element is null",
};

const VARIANTS: readonly PromoBarVariant[] = ['maximized-release', 'maximized'];

const parseVariant = (classList: DOMTokenList): PromoBarVariant =>
  VARIANTS.find((v) => classList.contains(v)) ?? 'minimized';

// Icon authored as <p><a href="...svg">https://...svg | Alt Text</a></p>
const parseIconAnchor = (cell: Element): PromoBarIcon | null => {
  const iconAnchor = [...cell.querySelectorAll(':scope > p > a')].find((a) => {
    const href = a.getAttribute('href') ?? '';
    return /\.(svg|png|jpg|jpeg|webp)(\?.*)?$/i.test(href);
  }) ?? null;
  if (iconAnchor === null) return null;

  const href = iconAnchor.getAttribute('href') ?? null;
  const linkText = iconAnchor.textContent ?? '';
  const pipeIdx = linkText.indexOf(' | ');
  const iconAlt = pipeIdx !== -1 ? linkText.slice(pipeIdx + 3).trim() : null;
  return { icon: href, iconAlt };
};

// Icon authored directly as <p><picture><img src="..." alt="..."></picture></p>
const parseIconPicture = (picture: Element | null): PromoBarIcon | null => {
  const img = picture?.querySelector('img') ?? null;
  if (img === null) return null;
  const alt = img.getAttribute('alt')?.trim() ?? '';
  return { icon: img.getAttribute('src'), iconAlt: alt.length > 0 ? alt : null };
};

const parseContent = (cell: Element): PromoBarContent => {
  const pictures = [...cell.querySelectorAll('picture')];

  // Icon is either a link to an image, or — when no such link is authored —
  // the first <picture> in the cell. Any picture(s) left over (e.g. the
  // maximized-release promo image) are bg-image candidates; the last of
  // those is the bg image.
  const linkIcon = parseIconAnchor(cell);
  const iconPicture = linkIcon === null ? pictures[0] ?? null : null;
  const pictureIcon = linkIcon === null ? parseIconPicture(iconPicture) : null;
  const { icon, iconAlt } = linkIcon
    ?? pictureIcon
    ?? { icon: null, iconAlt: null };

  const bgPictures = pictures.filter((p) => p !== iconPicture);
  const bgPicture = bgPictures[bgPictures.length - 1] ?? null;
  const bgImg = bgPicture?.querySelector('img') ?? null;
  const bgImage = bgImg?.getAttribute('src') ?? bgImg?.getAttribute('srcset')?.split('?')[0] ?? null;
  const productName = cell.querySelector('h5')?.textContent?.trim() ?? null;

  // Headline: first <p> with a <strong> that isn't a pure CTA row.
  // Pure CTA: <p><strong><a>…</a></strong></p> with no surrounding text.
  const headlineEl = [...cell.querySelectorAll(':scope > p')].find((p) => {
    if (p.querySelector('strong') === null) return false;
    if (p.querySelector('em > a') !== null) return false;
    // Exclude pure-CTA rows: <strong> contains only an <a> and no other text.
    const strong = p.querySelector('strong');
    const isCtaRow = strong !== null
      && strong.querySelector('a') !== null
      && (strong.textContent ?? '').trim()
        === (strong.querySelector('a')?.textContent ?? '').trim();
    return !isCtaRow;
  }) ?? null;

  // Body: the first <p> after the headline that has no <strong>.
  const allPs = [...cell.querySelectorAll(':scope > p')];
  const headlineIdx = headlineEl !== null ? allPs.indexOf(headlineEl) : -1;
  const bodyEl = allPs.slice(headlineIdx + 1).find((p) => {
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
  const primaryCtaP = allPs.find(
    (p) => p.querySelector('strong > a') !== null,
  ) ?? null;
  const secondaryCtaP = allPs.find(
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
  const viewportGroups: PromoBarViewport[][] =
    parsed.length === 3 ? [['mobile'], ['tablet'], ['desktop']]
    : parsed.length === 2 ? [['mobile', 'tablet'], ['desktop']]
    : parsed.map(() => ALL);
  const slots: PromoBarSlot[] = parsed.map((content, i) => ({
    viewports: viewportGroups[i],
    content,
  }));

  return [
    { type: 'PromoBar', variant, theme, bgColor, slots },
    [],
  ];
};
