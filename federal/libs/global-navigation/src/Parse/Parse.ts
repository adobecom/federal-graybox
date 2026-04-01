import { Component, parseComponent } from "../Components/Component";
import { parseProductEntryCTA, ProductEntryCTA } from "../Components/CTA/Parse";
import { Link, parseLink } from "../Components/Link/Parse";
import { IrrecoverableError, RecoverableError } from "../Error/Error";
import { parseListAndAccumulateErrors } from "../Utils/Utils";

export type GlobalNavigationData = {
  breadcrumbs: List<Link>;
  components: List<Component>;
  productCTA: ProductEntryCTA | null;
  localnav: boolean;
  errors: List<RecoverableError>;
  unavEnabled: boolean;
  placeholders: Map<string, string>;
};

export const parseNavigation = (
  mainNav: HTMLElement,
  unavEnabled: boolean,
  placeholders: Map<string, string> = new Map(),
): GlobalNavigationData | IrrecoverableError => {
  const [breadcrumbs, breadcrumbErrors]
    = parseListAndAccumulateErrors(
      [...document.querySelectorAll('.breadcrumbs ul > li > a') ?? []],
      parseLink
    );
  const [components, componentErrors] 
    = parseListAndAccumulateErrors(
      [...mainNav.children],
      parseComponent
    ); 
  const productEntryElement = mainNav.querySelector('.product-entry-cta');
  const [productCTA, productCtaErrors]
    = (
  (): Parsed<ProductEntryCTA | null, RecoverableError> => {
    try {
      return parseProductEntryCTA(productEntryElement);
    } catch (_) {
      return [null, []];
    }
  })();
  // const localnav = components
  //   .filter((component): boolean =>
  //           component.type === "MegaMenu" &&
  //           component.isSection).length === 1;
  const localnav = false;
  const errors = [
    breadcrumbErrors,
    componentErrors,
    productCtaErrors,
  ].flat();

  return {
    breadcrumbs,
    components,
    productCTA,
    localnav,
    errors,
    unavEnabled,
    placeholders,
  }
};
