import { isDesktop } from '../Utils/Utils';
import { MERCH_RESOLVED_EVENT } from './MerchLinks';

export const getIntrinsicItemsWidth = (list: HTMLElement | null): number => {
  if (list === null) return 0;

  const items = [...list.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLLIElement
      && getComputedStyle(child).display !== 'none'
      && Math.max(child.offsetWidth, child.scrollWidth) > 0,
  );
  const width = items.reduce((total, item) => {
    const style = getComputedStyle(item);
    const marginLeft = Number.parseFloat(style.marginLeft) || 0;
    const marginRight = Number.parseFloat(style.marginRight) || 0;
    return total + Math.max(item.offsetWidth, item.scrollWidth)
      + marginLeft + marginRight;
  }, 0);
  const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;

  return width + Math.max(items.length - 1, 0) * gap;
};

// Min gap (px) between the brand/hamburger and the trailing CTA group.
const CTA_OVERFLOW_GAP = 32;

export const initCompactOverflow = (mountpoint: HTMLElement): void => {
  const header = mountpoint.closest<HTMLElement>('header.global-navigation');
  if (!header) return;

  const nav = mountpoint.querySelector<HTMLElement>('nav');
  const brandWrapper = mountpoint.querySelector<HTMLElement>('.feds-brand-wrapper');
  const gnavItems = mountpoint.querySelector<HTMLElement>('.feds-gnav-items');
  const utilities = mountpoint.querySelector<HTMLElement>('.feds-utilities');
  const bcWrapper = mountpoint.querySelector<HTMLElement>('.feds-bc-wrapper, .feds-profile-new');
  const pinnedCta = mountpoint.querySelector<HTMLElement>('.feds-pinned-cta');
  const productCta = mountpoint.querySelector<HTMLElement>('.feds-product-entry-cta');
  const pinnedTel = mountpoint.querySelector<HTMLElement>('.feds-pinned-tel');

  const check = (): void => {
    // Stripping compact state while a menu is open drops its scroll lock,
    // changing header width and retriggering ResizeObserver indefinitely.
    if (header.querySelector('.feds-menu-wrapper.is-open, .feds-popup.is-open')) return;

    const mobile = !isDesktop.matches;
    // Read natural (all-shown) widths before restoring the final layout.
    header.classList.remove('is-compact', 'feds-cta-overflow');

    if (!mobile) {
      const brandWidth = brandWrapper === null
        ? 0
        : Math.max(brandWrapper.offsetWidth, brandWrapper.scrollWidth);
      const itemsWidth = getIntrinsicItemsWidth(gnavItems);
      const utilitiesWidth = utilities === null
        ? 0
        : Math.max(utilities.offsetWidth, utilities.scrollWidth);
      const ctaWidth = productCta === null
        ? 0
        : Math.max(productCta.offsetWidth, productCta.scrollWidth);
      const bcWidth = bcWrapper === null
        ? 0
        : Math.max(bcWrapper.offsetWidth, bcWrapper.scrollWidth);
      const contentWidth = brandWidth + itemsWidth +
        utilitiesWidth + ctaWidth + bcWidth + 40;
      header.classList.toggle('is-compact', contentWidth > header.clientWidth);
    }

    // Hide colliding toolbar CTAs; originals stay reachable in the drawer.
    const collapsed = mobile || header.classList.contains('is-compact');
    if (!collapsed || (!pinnedCta && !productCta && !pinnedTel)) return;
    const needed = (brandWrapper?.offsetWidth ?? 0)
      + (bcWrapper?.offsetWidth ?? 0)
      + (pinnedCta?.offsetWidth ?? 0)
      + (pinnedTel?.offsetWidth ?? 0)
      + (productCta?.offsetWidth ?? 0)
      + (utilities?.offsetWidth ?? 0) + CTA_OVERFLOW_GAP;
    const available = nav?.clientWidth ?? header.clientWidth;
    header.classList.toggle('feds-cta-overflow', needed > available);
  };

  const observer = new ResizeObserver(check);
  observer.observe(header);
  // UNAV can resize without changing the header's border box.
  if (utilities !== null) observer.observe(utilities);
  if (bcWrapper !== null) observer.observe(bcWrapper);
  isDesktop.addEventListener('change', check);
  mountpoint.addEventListener(MERCH_RESOLVED_EVENT, check);
  // Font swaps change text width without resizing the header.
  document.fonts?.addEventListener('loadingdone', check);

  check();

  // Fallback fonts are narrower than Adobe Clean, so an overflowing row can
  // measure as "fits" until the webfont loads; hide it until fonts settle so
  // only the final layout paints. No-op when fonts are already loaded.
  if (nav !== null && document.fonts.status !== 'loaded') {
    nav.style.visibility = 'hidden';
    let revealed = false;
    const reveal = (): void => {
      if (revealed) return;
      revealed = true;
      check();
      nav.style.visibility = '';
    };
    document.fonts.ready.then(reveal).catch(reveal);
    // Never keep the row hidden if font loading stalls.
    setTimeout(reveal, 300);
  }
};
