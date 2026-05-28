import { Breadcrumbs, parseBreadcrumbs } from "../Components/Breadcrumbs/Parse";
import { Component, parseComponent } from "../Components/Component";
import { ProductEntryCTA } from "../Components/CTA/Parse";
import { IrrecoverableError, RecoverableError } from "../Error/Error";
import { getMetadata, parseListAndAccumulateErrors } from "../Utils/Utils";

export type GlobalNavigationData = {
  breadcrumbs: Breadcrumbs | null;
  components: Array<Component>;
  productCTA: ProductEntryCTA | null;
  localnav: boolean;
  darkFont: boolean;
  errors: Array<RecoverableError>;
  unavEnabled: boolean;
  placeholders: Map<string, string>;
};

export const parseNavigation = (
  mainNav: HTMLElement,
  unavEnabled: boolean,
  placeholders: Map<string, string> = new Map(),
): GlobalNavigationData | IrrecoverableError => {
  // Breadcrumbs are authored in the page body, not in the gnav source,
  // and they're optional. If the block is missing we silently skip
  // them rather than surfacing an error.
  const breadcrumbsEl = document.querySelector('.breadcrumbs');
  const [breadcrumbs, breadcrumbErrors]: [
    Breadcrumbs | null,
    Array<RecoverableError>
  ] = breadcrumbsEl === null
    ? [null, []]
    : parseBreadcrumbs(breadcrumbsEl);
  const [parsedComponents, componentErrors]
    = parseListAndAccumulateErrors(
      [...mainNav.children],
      parseComponent
    );
  // The product entry CTA is parsed via parseComponent but should be
  // rendered to the right of the gnav (immediately to the left of the
  // unav) rather than inside the menu list, so we lift the first
  // ProductEntryCTA out of the components array.
  const productCTA = parsedComponents.find(
    (c): c is ProductEntryCTA => c.type === "ProductEntryCTA"
  ) ?? null;
  const components = parsedComponents.filter(
    (c) => c.type !== "ProductEntryCTA"
  );
  // const localnav = components
  //   .filter((component): boolean =>
  //           component.type === "MegaMenu" &&
  //           component.isSection).length === 1;
  const localnav = getMetadata('localnav') === 'true';
  const darkFont = getMetadata('gnav-dark-font') === 'true';

  const errors = [
    breadcrumbErrors,
    componentErrors,
  ].flat();

  return {
    breadcrumbs,
    components,
    productCTA,
    localnav,
    darkFont,
    errors,
    unavEnabled,
    placeholders,
  }
};
