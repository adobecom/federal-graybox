import { getMetadata, isDesktop, isNavDesktop } from "../../Utils/Utils";
import { IS_OPEN_CLASS, closePopup, triggersForPopupId } from "../PopupWiring";

/** Height in px added to the popover background pseudo-element
 *  to cover the nav bar */
export const POPOVER_BG_HEIGHT_OFFSET_PX = 72;
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
export const setPopoverBgHeight = (gnav: HTMLElement, value: string): void => {
  const header = gnav.closest('header');
  (header ?? gnav).style.setProperty('--feds-popup-bg-height', value);
};

export const initAnimations = (gnav: HTMLElement): void => {
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
  for (const button of mainMenuButtons) {
    const popup = button.nextElementSibling;
    if (!(popup instanceof HTMLElement)) continue;
    const triggers = triggersForPopupId(gnav, popup.id);
    for (const trigger of triggers) {
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
    }
  }
  isDesktop.addEventListener('change', () => {
    fedsGnavItems?.classList.remove('subscreen-opening', 'subscreen-closing');
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
      fedsGnavItems?.classList.remove('subscreen-opening', 'subscreen-closing');
    });
  }
}
