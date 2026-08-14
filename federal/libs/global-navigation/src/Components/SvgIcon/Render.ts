import { federateUrl } from "../../Utils/Utils";

export type SvgIconRenderOptions = {
  imgClass: string;
  pictureClass?: string;
  width?: number;
  height?: number;
};

export const svgIcon = (
  icon: { src: string | null; alt: string | null } | null,
  { imgClass, pictureClass, width, height }: SvgIconRenderOptions,
): HTML => {
  if (icon?.src === null || icon?.src === undefined || icon.src === '') return '';

  const sizeAttrs = width !== undefined && height !== undefined
    ? ` width="${width}" height="${height}"`
    : '';
  const img =
    `<img loading="lazy" src="${federateUrl(icon.src)}" alt="${icon.alt ?? ''}" class="${imgClass}"${sizeAttrs}>`;

  return pictureClass !== undefined
    ? `<picture class="${pictureClass}">${img}</picture>`
    : img;
};
