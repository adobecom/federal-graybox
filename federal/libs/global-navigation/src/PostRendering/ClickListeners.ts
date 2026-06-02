import { getMetadata, isDesktop, isNavDesktop } from "../Utils/Utils";
import { IS_OPEN_CLASS, closePopup, triggersForPopupId } from "./PopupWiring";

type CleanupFunction = () => void

/** Height in px added to the popover background pseudo-element
 *  to cover the nav bar */
const POPOVER_BG_HEIGHT_OFFSET_PX = 72;
const TOP_OFFSET = 64; // extra offset because when the localnav opens
                       // the whole nav slides up to hide the main nav

/**
 * Drive the height of `nav::after` (the rounded backdrop frame) by
 * setting the `--feds-popup-bg-height` custom property on the host
 * <header>. The CSS rule at `styles/styles.css` consumes the variable
 * via `height: var(--feds-popup-bg-height)`. This sidesteps the
 * CSSOM-walk approach that used to inspect `document.adoptedStyleSheets`
 * and break the moment the CSS selector text was refactored.
 *
 * Falls back to writing on the gnav element itself when the gnav is
 * not wrapped in a <header> (e.g. test harnesses), since custom
 * properties inherit through the DOM tree.
 */
const setPopoverBgHeight = (gnav: HTMLElement, value: string): void => {
  const header = gnav.closest('header');
  (header ?? gnav).style.setProperty('--feds-popup-bg-height', value);
};

export const initClickListeners = (
  gnav: HTMLElement
): CleanupFunction => {
  const skipLink = gnav.querySelector<HTMLAnchorElement>('.feds-skip-link');
  const onSkipLinkClick = (e: MouseEvent): void => {
    const mainContent = document.querySelector('#main-content');
    if (mainContent instanceof HTMLElement) {
      e.preventDefault();
      if (!mainContent.hasAttribute('tabindex')) {
        mainContent.setAttribute('tabindex', '-1');
      }
      setTimeout(() => {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
  skipLink?.addEventListener('click', onSkipLinkClick);

  const tabButtons = [...gnav.querySelectorAll<HTMLButtonElement>('.tabs button[role="tab"]')];
  const tabPanels = [...gnav.querySelectorAll('.tab-content ul')];
  const tabButtonClickCallbacks = tabButtons.map((button, i) => (): void => {

      const popup = tabPanels[i].closest(`.feds-popup.${IS_OPEN_CLASS}`);

      tabButtons.forEach(tabButton => {
        tabButton.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(tabPanel => {
        tabPanel.setAttribute('hidden', 'true');
      });
      tabPanels[i]?.removeAttribute('hidden');
      button.setAttribute('aria-selected', 'true');

      if (!popup) return;
      if (!isNavDesktop()) return;

      const newHeight = popup?.clientHeight ?? 0;
      setPopoverBgHeight(gnav, `${newHeight + POPOVER_BG_HEIGHT_OFFSET_PX}px`);
    }
  );

  const tabButtonFocusCallbacks = tabButtons.map((button) => (): void => {
    if (isNavDesktop()) return;
    if (!button.matches(':focus-visible')) return;
    const firstTabOffsetLeft = tabButtons[0]?.offsetLeft ?? 0;
    requestAnimationFrame(() => {
      const container = button.closest<HTMLElement>('.tabs');
      if (container) {
        container.scrollLeft = button.offsetLeft - firstTabOffsetLeft;
      }
    });
  });

  tabButtons.forEach((button, i) => {
    button.addEventListener('click', tabButtonClickCallbacks[i]);
    button.addEventListener('focus', tabButtonFocusCallbacks[i]);
  });

  const tabList = gnav.querySelector<HTMLElement>('.tabs[role="tablist"]');
  const updateTablistOrientation = (): void => {
    if (!tabList) return;
    if (isNavDesktop()) {
      tabList.setAttribute('aria-orientation', 'vertical');
    } else {
      tabList.removeAttribute('aria-orientation');
    }
  };
  updateTablistOrientation();
  isDesktop.addEventListener('change', updateTablistOrientation);

  animations(gnav);

  // TODO: Organize this files so that all the components click
  // listeners aren't in one file
  linksCardListeners(gnav);

  return () => {
    skipLink?.removeEventListener('click', onSkipLinkClick);
    tabButtons.forEach((button, i) => {
      button.removeEventListener('click', tabButtonClickCallbacks[i]);
      button.removeEventListener('focus', tabButtonFocusCallbacks[i]);
    });
    isDesktop.removeEventListener('change', updateTablistOrientation);
  };
};

const animations = (gnav: HTMLElement): void => {
  const mainMenuButtons = [...gnav.querySelectorAll<HTMLElement>('.feds-gnav-items > li > button')];
  const fedsGnavItems = gnav.querySelector('.feds-gnav-items');
  const isLocalNav = getMetadata('localnav') === 'true';

  const popupHeightObserverCallback = (
    popupSelector: string,
    offset: number = 0
  ): void => {
    const openPopup = gnav.querySelector(popupSelector);
    const localnav = gnav.querySelector('.feds-menu-wrapper.is-open .feds-gnav-items');
    const openLocalnav = isLocalNav && !!localnav;
    if (openLocalnav && !openPopup) {
      const resetPopoverHeight = localnav.clientHeight < 1;
      const height = resetPopoverHeight
        ? '100%'
        : `${localnav.clientHeight + offset}px`;
      setPopoverBgHeight(gnav, height);
      return;
    }
    if (!openPopup) {
      setPopoverBgHeight(gnav, '100%');
      return;
    }
    const resetPopoverHeight = openPopup.clientHeight < 1;
    const height = resetPopoverHeight
      ? '100%'
      : `${openPopup.clientHeight + offset}px`;
    setPopoverBgHeight(gnav, height);
  }
  const resizeObserver = new ResizeObserver(entries => {
    if (entries.length < 1) return;
    const offset = isLocalNav && !isNavDesktop()
                 ? POPOVER_BG_HEIGHT_OFFSET_PX + TOP_OFFSET
                 : POPOVER_BG_HEIGHT_OFFSET_PX;
    popupHeightObserverCallback(`.feds-popup.${IS_OPEN_CLASS}`, offset);
  });

  mainMenuButtons.forEach(button => {
    const popup = button.nextElementSibling;
    if (!popup) return;
    resizeObserver.observe(popup);
    popup.addEventListener('toggle', (event: Event) => {
      const newState = (event as ToggleEvent).newState;
      if (newState !== 'open' && !gnav.querySelector(`.feds-popup.${IS_OPEN_CLASS}`)) {
        // setPopoverBgHeight(gnav, '100%');
        if (isNavDesktop()) return;
        // Bandaid for using escape for closing the popup in mobile
        fedsGnavItems?.classList.remove('subscreen-opening');
        fedsGnavItems?.classList.add('subscreen-closing');
      } else {
        // in case the resize observer fails
        setPopoverBgHeight(gnav, `${popup.clientHeight + POPOVER_BG_HEIGHT_OFFSET_PX}px`);
        // On mobile (horizontal tabs), scroll active tab to the left edge
        if (!isNavDesktop()) {
          const tabsList = popup.querySelector<HTMLElement>('.tabs');
          const activeTab = popup.querySelector<HTMLElement>('button[role="tab"][aria-selected="true"]');
          const firstTab = tabsList?.querySelector<HTMLElement>('button[role="tab"]');
          if (tabsList && activeTab && firstTab) {
            tabsList.scrollLeft = activeTab.offsetLeft
              - tabsList.offsetLeft
              - firstTab.offsetLeft;
          }
        }
      }
    });
    // Localnav stuff
    if (!isLocalNav) return;

    if (!fedsGnavItems) return;

    const localnavResizeObserver = new ResizeObserver(entries => {
      if (entries.length < 1) return;
      if (isNavDesktop()) return;
      popupHeightObserverCallback(
        `.feds-menu-wrapper.${IS_OPEN_CLASS} .feds-gnav-items`,
        POPOVER_BG_HEIGHT_OFFSET_PX + TOP_OFFSET
      );
    });
    localnavResizeObserver.observe(fedsGnavItems);
  });

  // Mobile subscreen animations
  //
  // We attach the subscreen-opening handler to every trigger of the popup,
  // not just the inline `<button>`. In localnav mode the hamburger is also
  // an aria-controls trigger for the first mega-menu popup, so it needs to
  // toggle the same `subscreen-opening` class to drive the delayed entrance
  // animations on `.feds-popup-header`, `.tabs`, `.feds-gnav-cards`, etc.
  mainMenuButtons.forEach(button => {
    const popup = button.nextElementSibling;
    if (!(popup instanceof HTMLElement)) return;
    const triggers = triggersForPopupId(gnav, popup.id);
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        if (isNavDesktop()) return;
        if (!fedsGnavItems) return;
        fedsGnavItems.classList.remove('subscreen-closing');
        fedsGnavItems.classList.add('subscreen-opening');
        popup.querySelector('.feds-popup-back-button')?.addEventListener('click', () => {
          fedsGnavItems.classList.remove('subscreen-opening');
          fedsGnavItems.classList.add('subscreen-closing');
          setTimeout(() => closePopup(popup), 240);
        });
      });
    });
  });
  isDesktop.addEventListener('change', () => {
    fedsGnavItems?.classList.remove('subscreen-opening');
    fedsGnavItems?.classList.remove('subscreen-closing');
  });
  // In non-localnav, the hamburger opens the menu-wrapper / gnav-items list
  // (no subscreen), so we reset subscreen state on hamburger click. In
  // localnav the hamburger directly opens a subscreen and the handler above
  // already set `subscreen-opening` on the same click — clearing it would
  // defeat the animation, so skip clearing when the hamburger's aria-controls
  // points at anything other than the menu-wrapper.
  const hamburger = gnav.querySelector<HTMLElement>('.feds-nav-toggle');
  if (hamburger?.getAttribute('aria-controls') === 'feds-menu-wrapper') {
    hamburger.addEventListener('click', () => {
      fedsGnavItems?.classList.remove('subscreen-opening');
      fedsGnavItems?.classList.remove('subscreen-closing');
    });
  }
}

const linksCardListeners = (mountpoint: HTMLElement): void => {
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
        } else {
          articleTitle.setAttribute('tabindex', '0');
          articleTitle.setAttribute('role', 'button');
          updateExpanded();
        }
      };
      syncMobileAttrs();
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
    })
};
