import { isDesktop } from "../../Utils/Utils";

function $$(root: Element, selector: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(selector)];
}

function setTabindex(root: Element, selector: string, enabled: boolean): void {
  $$(root, selector).forEach((el) =>
    enabled ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'),
  );
}

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
  const cleanups: (() => void)[] = [];
  $$(gnav, '.feds-popup[popover]').forEach((popup) => {
    const onToggle = (): void => {
      if (!popup.matches(':popover-open')) setTabindex(popup, '[role="tabpanel"] a', false);
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

    // Auto-close popup when focus leaves it via Tab key (not Shift+Tab)
    const onFocusOut = (event: FocusEvent): void => {
      if (tabPressed && !popup.contains(event.relatedTarget as Node)) {
        (popup as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
        if (!isDesktop.matches) {
          const gnavItems = popup.closest('.feds-gnav-items');
          gnavItems?.classList.remove('subscreen-opening');
          gnavItems?.classList.add('subscreen-closing');
        }
        tabPressed = false;
      }
    };
    popup.addEventListener('focusout', onFocusOut);
    cleanups.push(() => popup.removeEventListener('focusout', onFocusOut));
  });

  const focusAndPrevent = (target: HTMLElement, event: KeyboardEvent): void => {
    target.focus(); event.preventDefault();
  };
  const openPopup = (): HTMLElement | null => gnav.querySelector<HTMLElement>('.feds-popup:popover-open');
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

    const popover = popup ?? (menuWrapper?.matches(':popover-open') ? menuWrapper : null);
    if (!popover) return false;
    (popover as HTMLElement & { hidePopover?: () => void }).hidePopover?.();
    const trigger = popup
      ? `[popovertarget="${popover.id}"]`
      : '.feds-nav-toggle';
    gnav.querySelector<HTMLElement>(trigger)?.focus();
    event.preventDefault();
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
    const tabArrowDelta: Record<string, 1 | -1 | 0> = isDesktop.matches
      ? { ArrowLeft: 0, ArrowRight: 0, ArrowUp: -1, ArrowDown: 1 }
      : { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };

    if (tabArrowDelta[key]) {
      const next = items[wrapIndex(index, tabArrowDelta[key], items.length)];
      if (next.matches('[role="tab"]')) {
        next.click();
        if (!isDesktop.matches) {
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

  function onKeydown(event: KeyboardEvent): void {
    const el = (document.activeElement ?? event.target) as HTMLElement;
    if (event.key === 'Escape') { handleEscape(event); return; }

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
