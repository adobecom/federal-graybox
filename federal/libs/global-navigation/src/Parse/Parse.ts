import { Breadcrumbs, parseBreadcrumbs } from "../Components/Breadcrumbs/Parse";
import { Component, parseComponent } from "../Components/Component";
import { ProductEntryCTA } from "../Components/CTA/Parse";
import { PromoBar, parsePromoBar } from "../Components/PromoBar/Parse";
import { IrrecoverableError, RecoverableError } from "../Error/Error";
import { getMetadata, isTelephoneLink, parseListAndAccumulateErrors } from "../Utils/Utils";

// Components that carry a navigable href and can therefore be a telephone link.
export type HrefComponent = Extract<Component, { href: string }>;

export type GlobalNavigationData = {
  breadcrumbs: Breadcrumbs | null;
  components: Array<Component>;
  productCTA: ProductEntryCTA | null;
  telephone: HrefComponent | null;
  promoBar: Promise<PromoBar | null>;
  localnav: boolean;
  darkFont: boolean;
  errors: Array<RecoverableError>;
  unavEnabled: boolean;
  profileEnabled: boolean;
  placeholders: Map<string, string>;
  brandConciergeEnabled: boolean;
  notificationsEnabled: boolean;
};

export const parseNavigation = (
  mainNav: HTMLElement,
  unavEnabled: boolean,
  profileEnabled: boolean,
  placeholders: Map<string, string> = new Map(),
  promoBarEl: Promise<HTMLElement | null> = Promise.resolve(null),
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

  const promoBar: Promise<PromoBar | null> = promoBarEl.then(el => {
    if (el === null) return null;
    const [parsed] = parsePromoBar(el);
    return parsed;
  });

  const [parsedComponents, componentErrors]
    = parseListAndAccumulateErrors(
      [...mainNav.children],
      parseComponent
    );
  // The product entry CTA is parsed via parseComponent but should be
  // rendered to the right of the gnav (immediately to the left of the
  // unav) rather than inside the menu list, so we lift the first
  // ProductEntryCTA out of the components array.
  const productEntryCtaEnabled = getMetadata('product-entry-cta')?.toLowerCase() === 'on';
  const productCTA = productEntryCtaEnabled
    ? parsedComponents.find(
      (c): c is ProductEntryCTA => c.type === "ProductEntryCTA"
    ) ?? null
    : null;
  const components = parsedComponents.filter(
    (c) => c.type !== "ProductEntryCTA"
      && (c.type !== "Text" || c.content.trim() !== "")
  );
  // Surfaced for the pinned toolbar slot; also kept in the menu list (drawer).
  const telephone = components.find(
    (c): c is HrefComponent => "href" in c && isTelephoneLink(c.href)
  ) ?? null;
  const localnav = getMetadata('localnav') === 'true';
  const darkFont = getMetadata('gnav-dark-font') === 'true';
  const brandConciergeEnabled = getMetadata('gnav-brand-concierge') === 'on';
  const notificationsEnabled = getMetadata('gnav-notifications') === 'on';
  const errors = [
    breadcrumbErrors,
    componentErrors,
  ].flat();

  return {
    breadcrumbs,
    components,
    productCTA,
    telephone,
    promoBar,
    localnav,
    darkFont,
    errors,
    unavEnabled,
    profileEnabled,
    placeholders,
    brandConciergeEnabled,
    notificationsEnabled,
  }
};
