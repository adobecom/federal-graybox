import { getMiloConfig, isMerchLink, isMasLink, isMasFieldLink, getMerchDecorators } from '../Utils/Utils';
import { RecoverableError } from '../Error/Error';

type MerchModule = {
  default?: (link: HTMLAnchorElement) => unknown;
};

/**
 * Milo's merch block replaces the authored `<a>` outright with its own
 * checkout-link/price element (`el.replaceWith(merch)`), which drops
 * whatever classes the original anchor had. CTA-authored merch links rely on
 * `feds-primary-cta`/`feds-secondary-cta` for gnav button styling, so those
 * need to survive onto the replacement element.
 */
const preserveCtaClasses = (
  link: HTMLAnchorElement,
  decorate: (link: HTMLAnchorElement) => unknown,
): void => {
  const ctaClasses = [...link.classList]
    .filter((c) => c === 'feds-primary-cta' || c === 'feds-secondary-cta');
  void Promise.resolve(decorate(link)).then((result) => {
    if (ctaClasses.length === 0) return;
    if (result instanceof HTMLElement) result.classList.add(...ctaClasses);
  });
};

/**
 * Loads the relevant Milo commerce block for each link in the nav:
 * - `a.merch` (OST / miniplans): Milo `merch` block
 * - `mas.adobe.com` studio links: Milo `merch-card-autoblock` block
 * @param mountpoint - The global navigation container element
 * @returns Set of RecoverableErrors encountered during initialization
 */
export const initMerchLinks = async (
  mountpoint: HTMLElement
): Promise<Set<RecoverableError>> => {
  const errors = new Set<RecoverableError>();

  // Product-card commerce links (price/discount) are authored inside the card's
  // single <a>, where a nested <a> is invalid. Parse leaves them as non-anchor
  // placeholders; convert them back to anchors so the resolution below handles
  // them in place.
  mountpoint.querySelectorAll<HTMLElement>('.feds-commerce-placeholder')
    .forEach((placeholder) => {
      const href = placeholder.getAttribute('data-commerce-href') ?? '';
      if (href === '') return;
      const link = document.createElement('a');
      link.href = href;
      link.innerHTML = placeholder.innerHTML;
      if (isMerchLink(href)) link.classList.add('merch');
      placeholder.replaceWith(link);
    });

  // Tag OST and inline M@S field links so the `a.merch` path resolves them to
  // an inline value (mirrors Milo's `decorateAutoBlock` downgrade). Lets cards
  // preserve a price/field anchor without re-implementing the tagging.
  mountpoint.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    if (isMerchLink(link.href) || isMasFieldLink(link.href)) {
      link.classList.add('merch');
    }
  });

  const merchLinks = mountpoint.querySelectorAll<HTMLAnchorElement>('a.merch');
  // Full M@S cards only; field links (tagged above) never build a merch-card.
  const masLinks = [...mountpoint.querySelectorAll<HTMLAnchorElement>('a[href]')]
    .filter((link) => isMasLink(link.href) && !isMasFieldLink(link.href));

  if (merchLinks.length === 0 && masLinks.length === 0) return errors;

  try {
    const injected = getMerchDecorators();
    // base is only needed for the fallback import; injected decorators skip it.
    const needsBase = (merchLinks.length > 0 && !injected.merch)
      || (masLinks.length > 0 && !injected.masCard);
    const base = needsBase ? getMiloConfig().base : '';

    if (needsBase && base === '') {
      errors.add(
        new RecoverableError(
          'base not found in config, cannot initialize merch links'
        )
      );
      return errors;
    }

    // OST / miniplans + inline M@S field links: Milo `merch` block
    if (merchLinks.length > 0) {
      const decorateMerchLink = injected.merch
        ?? (await import(`${base}/blocks/merch/merch.js`) as MerchModule).default;
      if (decorateMerchLink === undefined) {
        errors.add(new RecoverableError('decorateMerchLink not found in merch module'));
      } else {
        merchLinks.forEach((link) => {
          preserveCtaClasses(link, decorateMerchLink);
        });
      }
    }

    // Full M@S cards: Milo `merch-card-autoblock` block
    if (masLinks.length > 0) {
      const decorateMasLink = injected.masCard
        ?? (await import(
          `${base}/blocks/merch-card-autoblock/merch-card-autoblock.js`
        ) as MerchModule).default;
      if (decorateMasLink === undefined) {
        errors.add(new RecoverableError('default export not found in merch-card-autoblock module'));
      } else {
        masLinks.forEach((link) => { decorateMasLink(link); });
      }
    }
  } catch (error) {
    errors.add(new RecoverableError(`Error initializing merch links: ${error}`));
  }

  return errors;
};
