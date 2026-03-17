import { IrrecoverableError, Link, parseLink, RecoverableError } from "../../test-exports";
import { parseListAndAccumulateErrors } from "../../Utils/Utils";

export type Panels = {
  type: "Panels";
  layout: PanelsLayout;
  panels: List<Panel>;
};

export type PanelsLayout = {
  type: "PanelsLayout";
  gridColumns: List<string>;
  gridRows: List<string>;
};

export type PanelPosition = {
  type: "PanelPosition";
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type Panel = LinkPanel | ListWithImagePanel | ImagePanel;

export type FooterLink = {
  type: "FooterLink";
  link: Link;
  isCta: boolean;
};

export type LinkPanel = {
  type: "LinkPanel";
  position: PanelPosition;
  title: string;
  links: List<Link>;
  footer: FooterLink | null;
};

export type ListWithImagePanel = {
  type: "ListWithImagePanel";
  position: PanelPosition;
  title: string;
  links: List<Link>;
  imageHref: string;
  footer: FooterLink | null;
};

export type ImagePanel = {
  type: "ImagePanel";
  position: PanelPosition;
  iconHref: string;
  iconAlt: string;
  imageHref: string;
  price: string;
  title: string;
  ctaText: string;
  ctaHref: string;
};

export const parsePanels = (
  element: Element
): Parsed<Panels, RecoverableError> => {
  const [layout, layoutErrors] = parsePanelsLayout(element);

  const panelElements = [...element.children].filter(
    child => child.querySelector(".panel-metadata") !== null
  );

  const [panels, panelErrors] = parseListAndAccumulateErrors(
    panelElements,
    (el) => parsePanel(el, layout)
  );

  console.log(panels);

  return [
    {
      type: "Panels",
      layout,
      panels,
    },
    [...layoutErrors, ...panelErrors]
  ];
};

const parsePanel = (
  panelEl: Element,
  layout: PanelsLayout
): Parsed<Panel, RecoverableError> => {
  const metadataEl = panelEl.querySelector(".panel-metadata");
  if (!metadataEl)
    throw new IrrecoverableError(ERRORS.noPanelMetadata);

  const [position, positionErrors] = parsePanelPosition(metadataEl, layout);

  const imagePanelEl = panelEl.querySelector(".image-panel");
  if (imagePanelEl)
    return parseImagePanel(imagePanelEl, position, positionErrors);

  const useImageWithList =
    readMetadataValue(metadataEl, "use-image-with-list")?.toLowerCase() === "true";

  if (useImageWithList)
    return parseListWithImagePanel(panelEl, position, positionErrors);

  return parseLinkPanel(panelEl, position, positionErrors);
};


const ERRORS = {
  noLayoutMetadata: "panels-layout-metadata block not found",
  noGridColumns: "Grid columns not specified in layout metadata",
  noGridRows: "Grid rows not specified in layout metadata",
  invalidGridTrack: (value: string): string => `Invalid grid track value: "${value}"`,
  noPanelMetadata: "panel-metadata block not found on panel",
  invalidSpan: (label: string, value: string): string =>
    `Invalid ${label} value: "${value}". Expected two comma-separated integers`,
  columnOutOfBounds: (col: number, max: number): string =>
    `Column position ${col} exceeds grid column count ${max}`,
  rowOutOfBounds: (row: number, max: number): string =>
    `Row position ${row} exceeds grid row count ${max}`,
  spanStartAfterEnd: (label: string, start: number, end: number): string =>
    `${label} start (${start}) is greater than end (${end})`,
  noPanelTitle: "Panel is missing an <h2> title",
  noLinks: "Panel has no <ul> with links",
  listWithImageMissingImage: "List-with-image panel is missing the image link",
  imagePanelMissingIcon: "Image panel is missing the icon link",
  imagePanelMissingIconHref: "Image panel icon link has no href",
  imagePanelMissingImage: "Image panel is missing the image link",
  imagePanelMissingImageHref: "Image panel image link has no href",
  imagePanelMissingPrice: "Image panel is missing a price",
  imagePanelMissingTitle: "Image panel is missing a title",
  imagePanelMissingCtaText: "Image panel is missing CTA text",
  imagePanelMissingCtaHref: "Image panel is missing CTA href",
};

const readMetadataValue = (
  metadataEl: Element,
  key: string
): string | null => {
  const rows = [...metadataEl.children];
  for (const row of rows) {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const label = cells[0].textContent?.trim().toLowerCase() ?? "";
      if (label === key.toLowerCase())
        return cells[1].textContent?.trim() ?? null;
    }
  }
  return null;
};

const VALID_TRACK = /^\d+(\.\d+)?fr$/;

const parseGridTracks = (
  raw: string,
  _label: string
): Parsed<List<string>, RecoverableError> => {
  const errors: RecoverableError[] = [];
  const tracks = raw.split(",").map(s => s.trim()).filter(Boolean);
  for (const track of tracks) {
    if (!VALID_TRACK.test(track))
      errors.push(new RecoverableError(ERRORS.invalidGridTrack(track)));
  }
  return [tracks, errors];
};

const parseSpan = (
  raw: string,
  label: string
): [number, number] => {
  const parts = raw.split(",").map(s => s.trim());
  if (parts.length !== 2)
    throw new IrrecoverableError(ERRORS.invalidSpan(label, raw));
  const start = Number(parts[0]);
  const end = Number(parts[1]);
  if (!Number.isInteger(start)
    || !Number.isInteger(end)
    || start < 1
    || end < 1
    )
    throw new IrrecoverableError(ERRORS.invalidSpan(label, raw));
  if (start > end)
    throw new IrrecoverableError(ERRORS.spanStartAfterEnd(label, start, end));
  return [start, end];
};

const parsePanelsLayout = (
  element: Element
): Parsed<PanelsLayout, RecoverableError> => {
  const layoutEl = element.querySelector(".panels-layout-metadata");
  if (!layoutEl)
    throw new IrrecoverableError(ERRORS.noLayoutMetadata);

  const rawColumns = readMetadataValue(layoutEl, "grid columns");
  if (rawColumns === null)
    throw new IrrecoverableError(ERRORS.noGridColumns);

  const rawRows = readMetadataValue(layoutEl, "grid rows");
  if (rawRows === null)
    throw new IrrecoverableError(ERRORS.noGridRows);

  const [gridColumns, colErrors] = parseGridTracks(rawColumns, "grid columns");
  const [gridRows, rowErrors] = parseGridTracks(rawRows, "grid rows");

  return [
    {
      type: "PanelsLayout",
      gridColumns,
      gridRows,
    },
    [...colErrors, ...rowErrors]
  ];
};

const parsePanelPosition = (
  metadataEl: Element,
  layout: PanelsLayout
): Parsed<PanelPosition, RecoverableError> => {
  const errors: RecoverableError[] = [];

  const rawColSpan = readMetadataValue(metadataEl, "column span");
  if (rawColSpan === null)
    throw new IrrecoverableError(ERRORS.invalidSpan("column span", ""));

  const rawRowSpan = readMetadataValue(metadataEl, "row span");
  if (rawRowSpan === null)
    throw new IrrecoverableError(ERRORS.invalidSpan("row span", ""));

  const [columnStart, columnEnd] = parseSpan(rawColSpan, "column span");
  const [rowStart, rowEnd] = parseSpan(rawRowSpan, "row span");

  if (columnEnd > layout.gridColumns.length)
    errors.push(new RecoverableError(
      ERRORS.columnOutOfBounds(columnEnd, layout.gridColumns.length)
    ));

  if (rowEnd > layout.gridRows.length)
    errors.push(new RecoverableError(
      ERRORS.rowOutOfBounds(rowEnd, layout.gridRows.length)
    ));

  return [
    {
      type: "PanelPosition",
      columnStart,
      columnEnd,
      rowStart,
      rowEnd,
    },
    errors
  ];
};

const parseFooterLink = (
  panelEl: Element
): Parsed<FooterLink | null, RecoverableError> => {
  const footerEl = panelEl.querySelector(".panel-footer-link");
  if (!footerEl)
    return [null, []];

  const anchor = footerEl.querySelector("a");
  const [link, linkErrors] = parseLink(anchor);
  const isCta = footerEl.classList.contains("cta");

  return [
    {
      type: "FooterLink",
      link,
      isCta,
    },
    linkErrors
  ];
};

const parseImagePanel = (
  imagePanelEl: Element,
  position: PanelPosition,
  positionErrors: RecoverableError[]
): Parsed<ImagePanel, RecoverableError> => {
  const errors: RecoverableError[] = [...positionErrors];
  const rows = [...imagePanelEl.children];

  // The image-panel has a fixed structure:
  // row 0: icon <a> (text: "url | alt"), row 1: image <a>,
  // row 2: price, row 3: title, row 4: cta text, row 5: cta href
  const getAnchor = (index: number): Element | null =>
    rows[index]?.querySelector("a") ?? null;

  const getText = (index: number): string =>
    rows[index]?.querySelector("div")?.textContent?.trim() ?? "";

  // Icon: <a href="/path/to/icon.svg">url | Alt Text</a>
  const iconAnchor = getAnchor(0);
  if (!iconAnchor)
    errors.push(new RecoverableError(ERRORS.imagePanelMissingIcon));
  const iconHref = iconAnchor?.getAttribute("href") ?? "";
  if (iconAnchor && iconHref === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingIconHref));
  const [, iconAlt = ""] = (iconAnchor?.textContent ?? "")
    .split("|")
    .map(s => s.trim());

  // Image: <a href="/path/to/image.png">url</a>
  const imageAnchor = getAnchor(1);
  if (!imageAnchor)
    errors.push(new RecoverableError(ERRORS.imagePanelMissingImage));
  const imageHref = imageAnchor?.getAttribute("href") ?? "";
  if (imageAnchor && imageHref === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingImageHref));

  const price = getText(2);
  if (price === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingPrice));

  const title = getText(3);
  if (title === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingTitle));

  const ctaText = getText(4);
  if (ctaText === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingCtaText));

  const ctaHref = getText(5);
  if (ctaHref === "")
    errors.push(new RecoverableError(ERRORS.imagePanelMissingCtaHref));

  return [
    {
      type: "ImagePanel",
      position,
      iconHref,
      iconAlt,
      imageHref,
      price,
      title,
      ctaText,
      ctaHref,
    },
    errors
  ];
};

const parseLinkPanel = (
  panelEl: Element,
  position: PanelPosition,
  positionErrors: RecoverableError[]
): Parsed<LinkPanel, RecoverableError> => {
  const errors: RecoverableError[] = [...positionErrors];

  const h2 = panelEl.querySelector("h2");
  if (!h2) throw new IrrecoverableError(ERRORS.noPanelTitle);
  const title = h2.textContent ?? "";

  const ul = panelEl.querySelector("ul");
  if (!ul) throw new IrrecoverableError(ERRORS.noLinks);
  const anchors = [...ul.querySelectorAll("li > a")];
  const [links, linkErrors] = parseListAndAccumulateErrors(anchors, parseLink);
  errors.push(...linkErrors);

  const [footer, footerErrors] = parseFooterLink(panelEl);
  errors.push(...footerErrors);

  return [
    {
      type: "LinkPanel",
      position,
      title,
      links,
      footer,
    },
    errors
  ];
};

const parseListWithImagePanel = (
  panelEl: Element,
  position: PanelPosition,
  positionErrors: RecoverableError[]
): Parsed<ListWithImagePanel, RecoverableError> => {
  const errors: RecoverableError[] = [...positionErrors];

  const listWithImage = panelEl.querySelector(".list-with-image");
  const contentRoot = listWithImage ?? panelEl;

  const h2 = contentRoot.querySelector("h2");
  if (!h2) throw new IrrecoverableError(ERRORS.noPanelTitle);
  const title = h2.textContent ?? "";

  const ul = contentRoot.querySelector("ul");
  if (!ul) throw new IrrecoverableError(ERRORS.noLinks);
  const anchors = [...ul.querySelectorAll("li > a")];
  const [links, linkErrors] = parseListAndAccumulateErrors(anchors, parseLink);
  errors.push(...linkErrors);

  // .list-with-image > div has two children:
  //   div:first-child  → h2 + ul
  //   div:last-child   → <a href="/path/to/image.png">url</a>
  const imageAnchor = listWithImage
    ?.querySelector(":scope > div > div:last-child a");
  const imageHref = imageAnchor?.getAttribute("href") ?? "";
  if (imageHref === "")
    errors.push(new RecoverableError(ERRORS.listWithImageMissingImage));

  const [footer, footerErrors] = parseFooterLink(panelEl);
  errors.push(...footerErrors);

  return [
    {
      type: "ListWithImagePanel",
      position,
      title,
      links,
      imageHref,
      footer,
    },
    errors
  ];
};

