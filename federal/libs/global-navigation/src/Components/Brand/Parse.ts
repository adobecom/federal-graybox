import { IrrecoverableError, RecoverableError } from "../../Error/Error";
import { icons, isDarkMode } from "../../Utils/Utils";

type ImageData =
  | { type: 'inline-svg'; svgContent: string; alt: string }
  | { type: 'image'; src: string; alt: string };

export type Brand = {
  type: 'Brand';
  data: { type: 'LabelledBrand'; href: string; label: string; image: ImageData }
  | { type: 'BrandImageOnly'; href: string; image: ImageData; alt: string }
  | { type: 'ImageOnlyBrand'; href: string; image: ImageData; alt: string }
  | { type: 'BrandLabelOnly'; href: string; label: string }
  | { type: 'NoRender' };
};
const ERRORS = {
  elementNull: "Error when parsing Brand. Element is null",
  noLinks: "Error when parsing Brand. No links found",
  noPrimaryLink: "Error when parsing Brand. No primary link found",
};

const IMG_REGEX = /(\.png|\.jpg|\.jpeg|\.svg)/i;

/**
 * Extracts image source from a link element or picture element
 */
const extractImageSource = (element: Element): string | null => {
  const imgSrc = element.querySelector('picture img')?.getAttribute('src') ?? null;
  if (imgSrc !== null && imgSrc !== '') return imgSrc;

  const text = element.textContent?.trim();
  if (text !== undefined && text !== '' && IMG_REGEX.test(text)) {
    const source = text.split('|')[0]?.trim();
    if (source !== undefined && source !== '') return source;
  }

  const href = element.getAttribute('href');
  return href !== null && href !== '' && IMG_REGEX.test(href) ? href : null;
};

/**
 * Extracts alt text from image content
 */
const extractAltText = (element: Element): string => {
  const text = element.textContent?.trim();

  if (text?.includes('|') === true) {
    const alt = text.split('|')[1]?.trim();
    if (alt) return alt;
  }

  const altAttr = element.querySelector('img')?.getAttribute('alt');
  return altAttr ?? '';
};

export const parseBrand = (
  element: Element | null,
): Parsed<Brand, RecoverableError> => {
  if (element === null) {
    throw new IrrecoverableError(ERRORS.elementNull);
  }

  const rawBlock = element.querySelector('.gnav-brand');
  if (rawBlock === null) {
    throw new IrrecoverableError(ERRORS.elementNull);
  }

  const blockLinks = [...rawBlock.querySelectorAll('a')] as HTMLAnchorElement[];
  if (blockLinks.length === 0) {
    throw new IrrecoverableError(ERRORS.noLinks);
  }

  // Find the primary (non-image) link
  const primaryLink = blockLinks.find((link) => {
    const textContent = link.textContent ?? '';
    return !IMG_REGEX.test(link.href) && !IMG_REGEX.test(textContent);
  });

  if (!primaryLink) {
    throw new IrrecoverableError(ERRORS.noPrimaryLink);
  }

  // Determine rendering flags based on CSS classes
  const isBrandImageOnly = rawBlock.matches('.brand-image-only');
  const noLogo = rawBlock.matches('.no-logo');
  const imageOnly = rawBlock.matches('.image-only');
  const renderImage = !noLogo;
  const renderLabel = !isBrandImageOnly && !imageOnly;

  // Get image links for extracting image sources and alt text
  const imageLinks = blockLinks.filter((link) => {
    const textContent = link.textContent ?? '';
    return IMG_REGEX.test(link.href) || IMG_REGEX.test(textContent);
  });

  // Extract image sources (light and dark mode) and alt text
  const [imgSrc, imgSrcDark, altText] = ((): [
    string, 
    string | null, 
    string
  ] => {
    const defaultImgSrc = isBrandImageOnly ? icons.brand : icons.company;
  
    const [svgImgSrc = null, svgDarkImgSrc = null] = ([...rawBlock.querySelectorAll('picture img[src$=".svg"]')] as HTMLImageElement[])
      .map((img) => img?.src)
      .filter((src) => src?.length > 0);
  
    const [imgSrc = null, imgSrcDark = null] = 
      imageLinks.map(extractImageSource);
    const altText = imageLinks[0] instanceof Element
                  ? extractAltText(imageLinks[0])
                  : primaryLink.textContent?.trim() ?? '';
  
    return [
      imgSrc ?? svgImgSrc ?? defaultImgSrc,
      imgSrcDark ?? svgDarkImgSrc,
      altText
    ];
  })();

  const label = primaryLink.textContent?.trim() ?? '';
  const href = primaryLink.href;

  if (!renderImage && !renderLabel) return [{ type: 'Brand', data: { type: 'NoRender' } }, []];

  const selectSource = (light: string, dark: string | null): string => {
    const hasDark = dark !== null && dark !== undefined && dark !== '';
    return isDarkMode() && hasDark ? dark : light;
  };

  const imageData: ImageData = imgSrc.startsWith('<svg')
    ? { type: 'inline-svg', svgContent: selectSource(imgSrc, imgSrcDark), alt: altText }
    : { type: 'image', src: selectSource(imgSrc, imgSrcDark), alt: altText };

  if (renderImage && renderLabel) {
    return [{ type: 'Brand', data: { type: 'LabelledBrand', href, label, image: imageData } }, []];
  }

  if (renderImage && isBrandImageOnly) {
    return [{ type: 'Brand', data: { type: 'BrandImageOnly', href, image: imageData, alt: altText } }, []];
  }

  if (renderImage && imageOnly) {
    return [{ type: 'Brand', data: { type: 'ImageOnlyBrand', href, image: imageData, alt: altText } }, []];
  }

  return [{ type: 'Brand', data: { type: 'BrandLabelOnly', href, label } }, []];
};
