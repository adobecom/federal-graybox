export const isCurrentPageHref = (href: string): boolean => {
  const url = `${window.location.origin}${window.location.pathname}`;
  return href === url
      || href.startsWith(`${url}?`)
      || href.startsWith(`${url}#`);
};

const findActiveLink = (
  mountpoint: HTMLElement
): HTMLAnchorElement | null => {
  // The first localnav item represents the section, not a sibling page.
  const isLocalnav = mountpoint.querySelector('nav.localnav') !== null;
  return [...mountpoint.querySelectorAll<HTMLAnchorElement>(
    'a:not(.feds-skip-link):not([data-modal-hash])'
  )]
    .filter(a => !a.closest('.feds-breadcrumbs'))
    // Like C1, nested CTA links can activate their containing menu.
    .filter(a => a.closest('.feds-popup') !== null || !a.closest([
      '.feds-primary-cta',
      '.feds-secondary-cta',
      '.feds-pinned-cta',
      '.feds-product-entry-cta',
    ].join(', ')))
    .filter(a => !isLocalnav
      || a.closest('ul.feds-gnav-items > li:first-child') === null)
    .find(a => isCurrentPageHref(a.href)) ?? null;
};

export const initActiveLink = (
  mountpoint: HTMLElement,
  gnavSource: URL,
): void => {
  if (gnavSource.hash === '#_noActiveItem') return;
  const activeLink = findActiveLink(mountpoint);
  const activeDropDown = activeLink?.closest('ul.feds-gnav-items > li');
  activeDropDown?.classList.add('active-element');
};
