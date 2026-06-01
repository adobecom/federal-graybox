const MENU_WRAPPER_ID = 'feds-menu-wrapper';

// Open-state class used in compound selectors (`.feds-popup.is-open`,
// `.feds-menu-wrapper.is-open`). Replaces the HTML popover API so the gnav
// stays out of the browser top layer.
export const IS_OPEN_CLASS = 'is-open';

export const triggerForPopupId = (
  root: ParentNode,
  id: string,
): HTMLElement | null => {
  if (id === '') return null;
  return root.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(id)}"]`);
};

export const triggersForPopupId = (
  root: ParentNode,
  id: string,
): HTMLElement[] => {
  if (id === '') return [];
  return [
    ...root.querySelectorAll<HTMLElement>(`[aria-controls="${CSS.escape(id)}"]`)
  ];
};

const dispatchToggle = (el: HTMLElement, opening: boolean): void => {
  const init = {
    newState: opening ? 'open' : 'closed',
    oldState: opening ? 'closed' : 'open',
    bubbles: false,
    cancelable: false,
  } as const;
  // Fall back to a shaped Event for runtimes without ToggleEvent (older jsdom).
  const ToggleEventCtor = (window as unknown as {
    ToggleEvent?: typeof ToggleEvent
  }).ToggleEvent;
  const event = ToggleEventCtor !== undefined
    ? new ToggleEventCtor('toggle', init)
    : Object.assign(new Event('toggle', init), {
      newState: init.newState,
      oldState: init.oldState,
    });
  el.dispatchEvent(event);
};

export const isPopupOpen = (el: HTMLElement | null | undefined): boolean =>
  el !== null && el !== undefined && el.classList.contains(IS_OPEN_CLASS);

const openPopup = (el: HTMLElement | null | undefined): void => {
  if (el === null || el === undefined) return;
  if (el.classList.contains(IS_OPEN_CLASS)) return;
  el.classList.add(IS_OPEN_CLASS);
  dispatchToggle(el, true);
};

export const closePopup = (el: HTMLElement | null | undefined): void => {
  if (el === null || el === undefined) return;
  if (!el.classList.contains(IS_OPEN_CLASS)) return;
  el.classList.remove(IS_OPEN_CLASS);
  dispatchToggle(el, false);
};

export const togglePopup = (el: HTMLElement | null | undefined): void => {
  if (el === null || el === undefined) return;
  if (el.classList.contains(IS_OPEN_CLASS)) closePopup(el);
  else openPopup(el);
};

// Click-to-toggle + aria reflection for every popup. Mutual exclusion only
// applies between mega-menu popups; the hamburger does NOT close them
// (light-dismiss owns that, matching original popover behaviour).
// A single popup may have multiple triggers (e.g. in localnav the hamburger
// and the mega-menu button both point at the same popup via aria-controls).
export const wirePopups = (mountpoint: HTMLElement): void => {
  const popups = mountpoint
    .querySelectorAll<HTMLElement>(`.feds-popup, #${MENU_WRAPPER_ID}`);

  popups.forEach(popup => {
    const triggers = triggersForPopupId(mountpoint, popup.id);
    if (triggers.length === 0) return;
    const isMenuWrapper = popup.id === MENU_WRAPPER_ID;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const willOpen = !isPopupOpen(popup);
        if (willOpen && !isMenuWrapper) {
          mountpoint
            .querySelectorAll<HTMLElement>(`.feds-popup.${IS_OPEN_CLASS}`)
            .forEach(other => {
              if (other !== popup) closePopup(other);
            });
        }
        togglePopup(popup);
      });
    });

    popup.addEventListener('toggle', () => {
      const open = isPopupOpen(popup);
      triggers.forEach(trigger => {
        const isHamburger = trigger.classList.contains('feds-nav-toggle');
        const isLocalnavBar = trigger.classList.contains('feds-localnav-bar');
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute(
          'daa-ll',
          isHamburger
            ? (open ? 'hamburgermenu|close' : 'hamburgermenu|open')
            : isLocalnavBar
              ? (open ? 'localnav-bar|Close' : 'localnav-bar|Open')
              : (open ? 'header|Close' : 'header|Open'),
        );
      });
      popup.classList.toggle('feds-menu-active');
    });

    if (isMenuWrapper) {
      popup.addEventListener('transitionend', (event) => {
        // Ignore bubbled transitionend from descendants (e.g. .feds-link).
        if (event.target !== popup) return;
        if (!isPopupOpen(popup)) popup.classList.remove('feds-menu-active');
      });
    }
  });
};

export const initLightDismiss = (mountpoint: HTMLElement): void => {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (mountpoint.querySelector(`.${IS_OPEN_CLASS}`) === null) return;
    const openPopups = mountpoint.querySelectorAll<HTMLElement>(`.${IS_OPEN_CLASS}`);
    if ([...openPopups].some(open => open.contains(target))) return;
    openPopups.forEach(popup => {
      // A popup can have multiple triggers (e.g. in localnav the hamburger
      // and the mega-menu inline button both have aria-controls pointing at
      // the first mega-menu's popup). We must check ALL of them — using only
      // the first match would mis-classify clicks on the other trigger(s)
      // as outside-clicks and immediately close the popup the click was
      // trying to open.
      const triggers = triggersForPopupId(mountpoint, popup.id);
      if (triggers.some(trigger => trigger.contains(target))) return;
      closePopup(popup);
    });
  });
};
