import { isDesktop, isNavDesktop } from "../../Utils/Utils";
import { IS_OPEN_CLASS, triggerForPopupId, closePopup, isPopupOpen } from "../PopupWiring";

function $$(root: Element, selector: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(selector)];
}

function setTabindex(root: Element, selector: string, enabled: boolean): void {
  $$(root, selector).forEach((el) =>
    enabled ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'),
  );
}

// Predicates for the localnav-mobile tab focus trap.
//
// `isLocalnavMobile` is true only for the mobile-shape localnav UX (≤1023px,
// matching the breakpoint used by the Localnav CSS rules). The trap is a no-op
// on desktop and on the non-localnav mobile drawer.
const isLocalnavMobile = (gnav: HTMLElement): boolean => {
  const hasLocalnav
    = gnav.querySelector('nav.localnav') !== null
    || gnav.matches('nav.localnav');
  return hasLocalnav && !isNavDesktop();
};

const localnavBar = (gnav: HTMLElement): HTMLElement | null =>
  gnav.querySelector<HTMLElement>('.feds-localnav-bar');

const menuWrapperEl = (gnav: HTMLElement): HTMLElement | null =>
  gnav.querySelector<HTMLElement>('#feds-menu-wrapper');

const gnavItemsList = (gnav: HTMLElement): HTMLElement | null =>
  gnav.querySelector<HTMLElement>('#feds-menu-wrapper .feds-gnav-items');

/** Visible (CSS-displayed) menu items inside the open bar, excluding the
 *  bar button. Used for the "focus first item on open" path. */
const barItemStops = (gnav: HTMLElement): HTMLElement[] => {
  const list = gnavItemsList(gnav);
  if (!list) return [];
  const selector
    = ':scope > li > .feds-link,'
    + ':scope > li > .feds-primary-cta,'
    + ':scope > li > .feds-secondary-cta';
  return [...list.querySelectorAll<HTMLElement>(selector)]
    .filter((el) => el.offsetParent !== null);
};

/** All Tab-stops inside the open bar, including the localnav bar button.
 *  The bar button is prepended so it participates in the trap cycle:
 *  bar button -> first item -> ... -> last item -> wrap to bar button. */
const barTabStops = (gnav: HTMLElement): HTMLElement[] => {
  const items = barItemStops(gnav);
  const bar = localnavBar(gnav);
  return bar ? [bar, ...items] : items;
};

/**
 * Toggle Tab-stop participation for every menu trigger / CTA inside the
 * localnav bar. When the bar is closed (and we are in localnav-mobile),
 * Tab should skip the entire localnav region; we achieve that by setting
 * tabindex="-1" on each focusable child. We deliberately do not touch the
 * sibling `.feds-popup` elements: the first li's popup is opened directly
 * by the hamburger and must remain interactive.
 */
const applyBarTabIndex = (gnav: HTMLElement, open: boolean): void => {
  const list = gnavItemsList(gnav);
  if (!list) return;
  const selector
    = ':scope > li > .feds-link,'
    + ':scope > li > .feds-primary-cta,'
    + ':scope > li > .feds-secondary-cta';
  list.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (open) el.removeAttribute('tabindex');
    else el.setAttribute('tabindex', '-1');
  });
};

/** Focusable elements inside an open popup, in DOM order. */
const popupFocusables = (popup: HTMLElement): HTMLElement[] => {
  const selector
    = 'a[href], button:not([disabled]),'
    + ' [tabindex]:not([tabindex="-1"]),'
    + ' input:not([disabled]), [role="tab"]';
  return [...popup.querySelectorAll<HTMLElement>(selector)]
    .filter((el) => el.offsetParent !== null);
};

const ARROW_DELTA: Record<string, 1 | -1> = {
  ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1,
};
const HORIZONTAL = new Set(['ArrowLeft', 'ArrowRight']);
const VERTICAL = new Set(['ArrowUp', 'ArrowDown']);
const SELECTED_TAB = '.tabs [role="tab"][aria-selected="true"]';

function wrapIndex(index: number, delta: number, length: number): number {
  return (index + delta + length) % length;
}

function gridNextIndex(
  items: HTMLElement[], index: number, key: string, grid: HTMLElement,
): number | null {
  const delta = ARROW_DELTA[key];
  if (HORIZONTAL.has(key)) {
    const next = index + delta;
    return next >= 0 && next < items.length ? next : null;
  }
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const children = [...grid.children];
  const cellOf = (i: number): number => {
    const parent = items[i].parentElement;
    return parent ? children.indexOf(parent) : -1;
  };
  const currentCol = cellOf(index) % cols;
  const targetRow = Math.floor(cellOf(index) / cols) + (key === 'ArrowDown' ? 1 : -1);
  const maxRow = Math.floor((children.length - 1) / cols);
  if (targetRow < 0 || targetRow > maxRow) return null;
  let best: number | null = null;
  let bestDist = Infinity;
  for (let j = 0; j < items.length; j++) {
    const dist = Math.abs(cellOf(j) % cols - currentCol);
    if (Math.floor(cellOf(j) / cols) === targetRow && dist < bestDist) {
      bestDist = dist;
      best = j;
    }
  }
  return best;
}

export function initKeyboardNav(gnav: HTMLElement): () => void {
  setTabindex(gnav, '.tab-content [role="tabpanel"] a', false);
  // Initial state: bar is closed, so make its items non-Tab-stops in
  // localnav-mobile. On desktop the items must remain focusable.
  if (isLocalnavMobile(gnav)) applyBarTabIndex(gnav, false);
  const cleanups: (() => void)[] = [];
  $$(gnav, '.feds-popup').forEach((popup) => {
    const onToggle = (): void => {
      const open = isPopupOpen(popup);
      if (!open) {
        setTabindex(popup, '[role="tabpanel"] a', false);
        // When a bar-opened subscreen closes, return focus to its trigger
        // so the user picks back up where they were inside the bar's
        // items trap. Only do this when focus was inside the popup at
        // the moment of close, otherwise we'd steal focus from wherever
        // the user (or browser) moved it.
        if (
          isLocalnavMobile(gnav)
          && isPopupOpen(menuWrapperEl(gnav))
          && popup.contains(document.activeElement)
        ) {
          triggerForPopupId(gnav, popup.id)?.focus();
        }
        return;
      }
      // Open branch: move focus into the popup, but only for the
      // bar-opened subscreen flow. The hamburger flow (menu-wrapper
      // closed) is intentionally left untouched per the plan's scope.
      // The class change (display:none -> block) is already in effect
      // by the time this listener fires (PopupWiring adds the class
      // before dispatching), so a synchronous focus() works.
      if (!isLocalnavMobile(gnav)) return;
      if (!isPopupOpen(menuWrapperEl(gnav))) return;
      const target = popup.querySelector<HTMLElement>('.feds-popup-back-button')
        ?? popup.querySelector<HTMLElement>('a, button');
      target?.focus();
    };
    popup.addEventListener('toggle', onToggle);
    cleanups.push(() => popup.removeEventListener('toggle', onToggle));

    // Track if Tab key was pressed (without Shift)
    let tabPressed = false;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Tab' && !event.shiftKey) {
        tabPressed = true;
      }
    };
    popup.addEventListener('keydown', onKeyDown);
    cleanups.push(() => popup.removeEventListener('keydown', onKeyDown));

    // Auto-close popup when focus leaves it via Tab key (not Shift+Tab).
    // Skipped in the bar-opened subscreen flow: the explicit popup trap
    // (handlePopupTrap) owns Tab there, and transient focusouts during
    // wrap-around must not collapse the popup.
    const onFocusOut = (event: FocusEvent): void => {
      if (!tabPressed) return;
      if (popup.contains(event.relatedTarget as Node)) return;
      if (
        isLocalnavMobile(gnav)
        && isPopupOpen(menuWrapperEl(gnav))
      ) {
        tabPressed = false;
        return;
      }
      closePopup(popup);
      if (!isNavDesktop()) {
        const gnavItems = popup.closest('.feds-gnav-items');
        gnavItems?.classList.remove('subscreen-opening');
        gnavItems?.classList.add('subscreen-closing');
      }
      tabPressed = false;
    };
    popup.addEventListener('focusout', onFocusOut);
    cleanups.push(() => popup.removeEventListener('focusout', onFocusOut));
  });

  // Localnav bar: drive tabindex on its items via the menu-wrapper's
  // toggle event and return focus to the bar button on close. All scoped
  // to localnav-mobile. We deliberately do NOT move focus into the bar on
  // open — focus stays on the bar button so the user can either Tab into
  // the now-revealed items or Shift+Tab/Esc out the way they came.
  const wrap = menuWrapperEl(gnav);
  if (wrap) {
    const onWrapToggle = (): void => {
      const open = isPopupOpen(wrap);
      if (isLocalnavMobile(gnav)) {
        applyBarTabIndex(gnav, open);
      }
      if (!open && isLocalnavMobile(gnav)) {
        if (wrap.contains(document.activeElement)) {
          localnavBar(gnav)?.focus();
        }
      }
    };
    wrap.addEventListener('toggle', onWrapToggle);
    cleanups.push(() => wrap.removeEventListener('toggle', onWrapToggle));
  }

  // Breakpoint changes: when the viewport crosses 1024px, re-evaluate
  // whether the items should carry tabindex="-1". On desktop the items
  // must always be tab-stops.
  const onBreakpointChange = (): void => {
    if (!gnavItemsList(gnav)) return;
    if (isNavDesktop()) {
      applyBarTabIndex(gnav, true);
      return;
    }
    const open = isPopupOpen(menuWrapperEl(gnav));
    applyBarTabIndex(gnav, open);
  };
  isDesktop.addEventListener('change', onBreakpointChange);
  cleanups.push(() => isDesktop.removeEventListener('change', onBreakpointChange));

  const focusAndPrevent = (target: HTMLElement, event: KeyboardEvent): void => {
    target.focus(); event.preventDefault();
  };
  const openPopup = (): HTMLElement | null => gnav.querySelector<HTMLElement>(`.feds-popup.${IS_OPEN_CLASS}`);
  const selectedTab = (
    scope: Element
  ): HTMLElement | null => scope.querySelector<HTMLElement>(SELECTED_TAB);
  const visiblePanel = (scope: Element): HTMLElement | null =>
    scope.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');

  function handleEscape(event: KeyboardEvent): boolean {
    const popup = openPopup();
    const menuWrapper = gnav.querySelector<HTMLElement>('#feds-menu-wrapper');
    if (!menuWrapper) return false;

    // On mobile subscreen, Esc should behave like clicking "Back".
    const gnavItems = menuWrapper.querySelector<HTMLElement>('.feds-gnav-items');
    const backButton = popup
      ? popup.querySelector<HTMLElement>('.feds-popup-back-button')
      : null;
    const isSubscreenOpening = gnavItems?.classList.contains('subscreen-opening') === true;
    if (popup !== null && isSubscreenOpening && backButton !== null) {
      backButton.click();
      event.preventDefault();
      return true;
    }

    const target = popup ?? (isPopupOpen(menuWrapper) ? menuWrapper : null);
    if (!target) return false;
    closePopup(target);
    // When the menu-wrapper closes via the localnav bar flow, focus should
    // return to the bar button (not the hamburger). The hamburger remains
    // the right target for the non-localnav mobile drawer.
    const trigger = popup
      ? triggerForPopupId(gnav, target.id)
      : (
          isLocalnavMobile(gnav)
            ? gnav.querySelector<HTMLElement>('.feds-localnav-bar')
            : gnav.querySelector<HTMLElement>('.feds-nav-toggle')
        );
    trigger?.focus();
    event.preventDefault();
    return true;
  }

  // Trap Tab inside the open localnav bar. When the bar is open and no
  // subscreen popup is open, Tab/Shift+Tab cycle through the visible
  // mega-menu triggers and CTAs.
  function handleBarTrap(
    el: HTMLElement, key: string, shift: boolean, event: KeyboardEvent,
  ): boolean {
    if (key !== 'Tab') return false;
    if (!isLocalnavMobile(gnav)) return false;
    const wrap = menuWrapperEl(gnav);
    if (!wrap || !isPopupOpen(wrap)) return false;
    // If a subscreen popup is open, the popup trap owns Tab.
    if (openPopup() !== null) return false;
    const stops = barTabStops(gnav);
    if (stops.length === 0) return false;
    const index = stops.indexOf(el);
    if (index < 0) return false;
    const nextIndex = wrapIndex(index, shift ? -1 : 1, stops.length);
    focusAndPrevent(stops[nextIndex], event);
    return true;
  }

  // Arrow-key navigation across the open localnav bar's items. The bar
  // lays its items out vertically on mobile, so Up/Down feel as natural
  // as Left/Right. Cycles through all visible bar items (mega-menu
  // triggers + CTAs), excluding the bar button itself. Scoped to
  // localnav-mobile with the bar open and no subscreen popup open, so
  // desktop's `handleTopBar` (horizontal-only) is preserved.
  function handleBarArrows(
    el: HTMLElement, key: string, event: KeyboardEvent,
  ): boolean {
    if (!ARROW_DELTA[key]) return false;
    if (!isLocalnavMobile(gnav)) return false;
    const wrap = menuWrapperEl(gnav);
    if (!wrap || !isPopupOpen(wrap)) return false;
    if (openPopup() !== null) return false;
    const items = barItemStops(gnav);
    if (items.length === 0) return false;
    const index = items.indexOf(el);
    if (index < 0) return false;
    focusAndPrevent(
      items[wrapIndex(index, ARROW_DELTA[key], items.length)], event,
    );
    return true;
  }

  // Trap Tab inside a bar-opened subscreen popup. Wraps focus within
  // the popup's focusables. Deliberately scoped to the bar flow so the
  // hamburger-opened first-mega-menu popup keeps its existing
  // close-on-Tab-out behaviour.
  function handlePopupTrap(
    el: HTMLElement, key: string, shift: boolean, event: KeyboardEvent,
  ): boolean {
    if (key !== 'Tab') return false;
    if (!isLocalnavMobile(gnav)) return false;
    const popup = openPopup();
    if (!popup) return false;
    const wrap = menuWrapperEl(gnav);
    if (!wrap || !isPopupOpen(wrap)) return false;
    const items = popupFocusables(popup);
    if (items.length === 0) return false;
    const index = items.indexOf(el);
    if (index < 0) return false;
    const nextIndex = wrapIndex(index, shift ? -1 : 1, items.length);
    focusAndPrevent(items[nextIndex], event);
    return true;
  }

  function handleTopBar(
    el: HTMLElement,
    key: string,
    event: KeyboardEvent
  ): boolean {
    if (!HORIZONTAL.has(key)) return false;
    const items = $$(gnav, '.feds-gnav-items > li > .feds-link');
    const index = items.indexOf(el);
    if (index < 0) return false;
    focusAndPrevent(
      items[wrapIndex(index, ARROW_DELTA[key], items.length)], event
    );
    return true;
  }

  function handleTabs(
    el: HTMLElement, popup: HTMLElement, key: string, event: KeyboardEvent,
  ): boolean {
    const items = $$(popup, '.tabs :is([role="tab"], .product-links a)');
    const firstTabOffsetLeft = items[0]?.offsetLeft ?? 0;
    const index = items.indexOf(el);
    if (index < 0) return false;

    /** 1->Next, -1->Previous, 0->No movement */
    const tabArrowDelta: Record<string, 1 | -1 | 0> = isNavDesktop()
      ? { ArrowLeft: 0, ArrowRight: 0, ArrowUp: -1, ArrowDown: 1 }
      : { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };

    if (tabArrowDelta[key]) {
      const next = items[wrapIndex(index, tabArrowDelta[key], items.length)];
      if (next.matches('[role="tab"]')) {
        next.click();
        if (!isNavDesktop()) {
          requestAnimationFrame(() => {
            const container = next.closest<HTMLElement>('.tabs');
            if (container !== null) {
              container.scrollLeft = next.offsetLeft - firstTabOffsetLeft;
            }
          });
        }
      }
      focusAndPrevent(next, event);
      return true;
    }

    if (key in tabArrowDelta) {
      event.preventDefault();
      return true;
    }

    if (key === 'Tab' && !event.shiftKey && el.matches('[aria-selected="true"]')) {
      const panel = visiblePanel(popup);
      if (!panel) return false;
      setTabindex(panel, 'a', true);
      const firstLink = panel.querySelector<HTMLElement>('a');
      if (firstLink) focusAndPrevent(firstLink, event);
      return true;
    }

    return false;
  }

  function handlePanel(
    el: HTMLElement, popup: HTMLElement, key: string, event: KeyboardEvent,
  ): boolean {
    const panel = visiblePanel(popup);
    if (!panel) return false;
    const items = $$(panel, 'a');
    const index = items.indexOf(el);
    if (index < 0) return false;

    if (ARROW_DELTA[key]) {
      const nextIndex = gridNextIndex(items, index, key, panel);
      if (nextIndex !== null) {
        focusAndPrevent(items[nextIndex], event);
        return true;
      }
      if (key === 'ArrowUp') {
        setTabindex(panel, 'a', false);
        focusAndPrevent(selectedTab(popup) ?? items[0], event);
        return true;
      }
      return false;
    }

    if (key === 'Tab' && !event.shiftKey) {
      if (index + 1 < items.length) {
        focusAndPrevent(items[index + 1], event);
      } else return false;
      return true;
    }

    if (key === 'Tab' && event.shiftKey) {
      if (index > 0) {
        focusAndPrevent(items[index - 1], event);
      } else {
        setTabindex(panel, 'a', false);
        const target = selectedTab(popup)
          ?? $$(popup, '.tabs :is([role="tab"], .product-links a)')[0];
        // eslint is disabled because it complains that nextTarget
        // is always true, but it could be nullish sometimes
        // eslint-disable-next-line
        if (target) focusAndPrevent(target, event);
      }
      return true;
    }

    return false;
  }

  function handleCards(
    el: HTMLElement, popup: HTMLElement, key: string, event: KeyboardEvent,
  ): boolean {
    if (!VERTICAL.has(key)) return false;
    const items = $$(popup, '.feds-gnav-cards a');
    const index = items.indexOf(el);
    if (index < 0) return false;
    focusAndPrevent(
      items[wrapIndex(index, ARROW_DELTA[key], items.length)], event
    );
    return true;
  }

  function handleCtaSpace(
    el: HTMLElement, key: string, event: KeyboardEvent,
  ): boolean {
    if (key !== ' ') return false;
    if (!el.matches('.feds-primary-cta, .feds-secondary-cta, .feds-link')) return false;
    event.preventDefault();
    el.click();
    return true;
  }

  function onKeydown(event: KeyboardEvent): void {
    const el = (document.activeElement ?? event.target) as HTMLElement;
    if (event.key === 'Escape') { handleEscape(event); return; }
    if (handleCtaSpace(el, event.key, event)) return;

    // Localnav-mobile traps run first so they take precedence over the
    // intra-popup tab/panel navigation, which has its own Tab semantics.
    if (handlePopupTrap(el, event.key, event.shiftKey, event)) return;
    if (handleBarTrap(el, event.key, event.shiftKey, event)) return;
    if (handleBarArrows(el, event.key, event)) return;

    const popup = openPopup();
    if (popup) {
      if (popup.matches(':has(.product-list)')) {
        if (handleTabs(el, popup, event.key, event)) return;
        if (handlePanel(el, popup, event.key, event)) return;
      }
      if (popup.matches(':has(.feds-gnav-cards)')) {
        if (handleCards(el, popup, event.key, event)) return;
      }
    }
    handleTopBar(el, event.key, event);
  }

  const trapLink = gnav.querySelector<HTMLAnchorElement>('.trap-focus-gnav');
  const onTrapFocus = (e: FocusEvent): void => {
    if (!gnav.querySelector('.feds-menu-active')) return;
    e.preventDefault();
    gnav.querySelector<HTMLElement>('.feds-nav-toggle')?.focus();
  };
  trapLink?.addEventListener('focus', onTrapFocus);
  cleanups.push(() => trapLink?.removeEventListener('focus', onTrapFocus));

  gnav.addEventListener('keydown', onKeydown);
  cleanups.push(() => gnav.removeEventListener('keydown', onKeydown));
  return () => cleanups.forEach((fn) => fn());
}
