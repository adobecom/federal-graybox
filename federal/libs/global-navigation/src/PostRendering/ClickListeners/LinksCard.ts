import { isDesktop, isNavDesktop } from "../../Utils/Utils";

export const initLinksCardListeners = (mountpoint: HTMLElement): void => {
  const header = mountpoint.closest<HTMLElement>('header.global-navigation');
  const syncFns: (() => void)[] = [];

  mountpoint.querySelectorAll<HTMLElement>('.feds-popup:not(.small-menu) article.links-card')
    .forEach(article => {
      const articleTitle = article.querySelector<HTMLElement>('div.links-card-title-container');
      if (articleTitle === null) return;
      // The title-container acts as a collapse/expand toggle on mobile only
      // (the chevron is hidden and the click handler short-circuits on
      // desktop). To make it keyboard-reachable we expose it as a button
      // in the tab order while in the mobile viewport, with a matching
      // `aria-expanded` reflecting the `.closed` class on the article.
      // On desktop we strip these attributes so the heading reads as a
      // plain heading (no spurious button role).
      const updateExpanded = (): void => {
        const isClosed = !isNavDesktop() && article.classList.contains('closed');
        article.querySelectorAll<HTMLElement>('.links-card-links, .links-card-footer')
          .forEach(content => { content.inert = isClosed; });
        articleTitle.setAttribute(
          'aria-expanded',
          String(!article.classList.contains('closed')),
        );
      };

      const syncMobileAttrs = (): void => {
        if (isNavDesktop()) {
          articleTitle.removeAttribute('tabindex');
          articleTitle.removeAttribute('role');
          articleTitle.removeAttribute('aria-expanded');
          article.querySelectorAll<HTMLElement>('.links-card-links, .links-card-footer')
            .forEach(content => { content.inert = false; });
        } else {
          articleTitle.setAttribute('tabindex', '0');
          articleTitle.setAttribute('role', 'button');
          updateExpanded();
        }
      };
      syncMobileAttrs();
      syncFns.push(syncMobileAttrs);
      isDesktop.addEventListener('change', syncMobileAttrs);

      const toggle = (): void => {
        if (isNavDesktop()) return;
        const wasClosed = article.classList.contains('closed');
        article.classList.toggle('closed');
        if (wasClosed) {
          // Card is being opened. Add a transient `.opening` class so the
          // CSS keyframe animations on the list items + footer (a staggered
          // slide-in mirroring the subscreen entrance) only fire when the
          // user explicitly expands a previously-collapsed card, never on
          // initial render. Cleared after the longest delay + duration so
          // the animation runs to its `forwards` resting state and the
          // class doesn't accumulate between toggles.
          article.classList.add('opening');
          window.setTimeout(() => {
            article.classList.remove('opening');
          }, 900);
        }
        updateExpanded();
        articleTitle.setAttribute('daa-ll', article.classList.contains('closed') ? 'Open' : 'Close');
      };

      articleTitle.addEventListener('click', toggle);
      articleTitle.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (isNavDesktop()) return;
        event.preventDefault();
        toggle();
      });
    });

  // `is-compact` is toggled on the header by a ResizeObserver (see
  // `initCompactOverflow` in Main.ts) independently of the `isDesktop`
  // media query, so entering/leaving compact mode at a desktop viewport
  // width wouldn't otherwise resync these mobile-only attrs.
  if (header !== null && syncFns.length > 0) {
    new MutationObserver(() => syncFns.forEach(sync => sync()))
      .observe(header, { attributes: true, attributeFilter: ['class'] });
  }
};
