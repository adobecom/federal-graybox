// Shared icon-fetching logic used across PromoBar, ProductCard, and PromoCard.
// An icon is authored in one of two formats:
//   1. <a href="....svg">https://absolute-url.svg | Alt Text</a>
//      The href attribute is often a relative in-page path; the resolvable
//      absolute icon URL lives in the link text, before the " | Alt Text".
//   2. A bare <picture><img src="..." alt="..."></picture>, with no anchor.
const ICON_EXTENSION = /\.(svg|png|jpg|jpeg|webp)(\?.*)?$/i;

export type SvgIcon = {
  src: string | null;
  alt: string | null;
  element: Element;
};

const isIconAnchor = (a: Element): boolean =>
  ICON_EXTENSION.test(a.getAttribute('href') ?? '');

const parseAnchorIcon = (a: Element): SvgIcon => {
  const [src = null, alt = null] = (a.textContent ?? '')
    .split('|')
    .map((x) => x.trim());
  return { src, alt, element: a };
};

const parsePictureIcon = (picture: Element): SvgIcon | null => {
  const img = picture.querySelector('img');
  if (img === null) return null;
  const alt = img.getAttribute('alt')?.trim() ?? '';
  return {
    src: img.getAttribute('src'),
    alt: alt.length > 0 ? alt : null,
    element: picture,
  };
};

// All icons authored within `scope`, link-authored ones first (in document
// order), followed by any bare-picture icons not already consumed by one of
// those anchors.
export const parseSvgIcons = (scope: Element): SvgIcon[] => {
  const iconAnchors = [...scope.querySelectorAll('a')].filter(isIconAnchor);
  const iconPictures = [...scope.querySelectorAll('picture')].filter(
    (picture) => !iconAnchors.some((a) => a.contains(picture)),
  );

  return [
    ...iconAnchors.map(parseAnchorIcon),
    ...iconPictures
      .map(parsePictureIcon)
      .filter((icon): icon is SvgIcon => icon !== null),
  ];
};

// The first icon authored within `scope`.
export const parseSvgIcon = (scope: Element): SvgIcon | null =>
  parseSvgIcons(scope)[0] ?? null;
