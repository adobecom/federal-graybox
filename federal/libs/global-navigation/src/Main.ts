import { breadcrumbs as renderBreadcrumbs } from "./Components/Breadcrumbs/Render";
import { component } from "./Components/Component";
import { productEntryCTA } from "./Components/CTA/Render";
import { IrrecoverableError, RecoverableError } from "./Error/Error";
import { GlobalNavigationData, parseNavigation } from "./Parse/Parse";
import { initClickListeners } from "./PostRendering/ClickListeners";
import { wirePopups, initLightDismiss } from "./PostRendering/PopupWiring";
import { initKeyboardNav } from "./PostRendering/Keyboard";
import { initMerchLinks } from "./PostRendering/MerchLinks";
import { loadUnav } from "./PostRendering/Unav/Unav";
import { getInitialHTML } from "./PreRendering/FetchAssets";
import { sanitize, setMiloConfig, MiloConfig, setPersonalizationConfig, PersonalizationConfig, setLocalizeLink, LocalizeLink, isDesktop, closePopovers, getExperienceName } from "./Utils/Utils";
import { IS_OPEN_CLASS, isPopupOpen } from "./PostRendering/PopupWiring";
import './styles/styles.css';
import { combineWithFederalPlaceholders, setPlaceholders, getPlaceholders } from "./Utils/Placeholders";
import { lanaLog } from "./Utils/Log";
import { popup } from "./Components/MegaMenu/Render";
import { smallMenuPopup } from "./Components/SmallMenu/Render";
import { MegaMenuExtraData } from "./Components/MegaMenu/Parse";

type GlobalNavigation = {
  closeEverything: () => void;
  reloadUnav: () => void;
  getGnavTopPosition: () => number;
  setGnavTopPosition: (_: number) => void;
  getGnavHeight: () => number;
  errors: Set<RecoverableError>;
};

export type Input = {
  gnavSource: URL;
  asideSource: URL | null;
  gnavTop?: number;
  mepMartech?: string;
  isLocalNav: boolean;
  mountpoint: HTMLElement;
  unavEnabled: boolean;
  placeholders: Promise<Map<string, string>>;
  miloConfig?: MiloConfig;
  getStageDomainMap: (domainmap: unknown[], env: string) =>
    { [key: string]: string }
  // for now we only support inBlock commands.
  // Since MEP on gnav is relatively rare we'll
  // keep it at this and see if any problems crop up.
  // The Milo gnav MEP implementation is a little
  // more entangled than what we have here.
  // For example we're not dealing with adding manifestId to the body
  // and so on. But the whole idea behind this refactor is
  // that we want to reduce coupling.
  // So we'll keep it at this for now and re-evaluate at a
  // later date.
  personalization: PersonalizationConfig;
  localizeLink?: LocalizeLink;
};

export const main = async (
  input: Input
): Promise<GlobalNavigation | IrrecoverableError> => {
  // TODO: implement a function that verifies that Input
  // is the correct type up front.

  const {
    gnavSource,
    mountpoint,
    unavEnabled,
    miloConfig,
    personalization
  } = input;

  if (!(gnavSource instanceof URL)) {
    lanaLog(`gnavSource is invalid: ${gnavSource}`)
    throw new IrrecoverableError("gnavSource needs to be a URL object");
  }

  try {
    setMiloConfig(miloConfig);
  } catch (error) {
    lanaLog(`Failed to initialize MiloConfig: ${error}`);
    throw new IrrecoverableError(`Failed to initialize MiloConfig: ${error}`);
  }

  setPersonalizationConfig(personalization);
  setLocalizeLink(input.localizeLink ?? ((link: string): string => link));

  // We kick off the request for the federal placeholders in parallel
  setPlaceholders(combineWithFederalPlaceholders(input));

  const initial = await getInitialHTML(input)
  if (initial instanceof IrrecoverableError) {
    lanaLog(initial.message);
    throw initial;
  }
  const { mainNav, aside: _aside } = initial;
  if (mainNav instanceof IrrecoverableError) {
    lanaLog(mainNav.message);
    throw mainNav;
  }

  const gnavData = parseNavigation(
    mainNav,
    unavEnabled,
    await getPlaceholders()
  );
  if (gnavData instanceof IrrecoverableError) {
    lanaLog(gnavData.message);
    throw gnavData;
  }

  // TODO: Implement Aside
  await renderGnav(gnavData)(mountpoint);

  return postRenderingTasks(input);
};


export const renderGnav = (
  data: GlobalNavigationData
) => async (
mountpoint: HTMLElement
): Promise<HTMLElement> => {
  const navHTML = renderGnavString(data);
  document.querySelector('main')?.setAttribute('id', 'main-content');
  mountpoint.innerHTML = navHTML;
  if (data.darkFont) mountpoint.classList.add('dark-font');
  const megaMenus = [
    ...mountpoint.querySelectorAll('.mega-menu ~ .feds-popup')
  ]
  megaMenus.forEach(mm => {
    mm.innerHTML = '';
  });
  const megaMenuComponents = data.components.filter(com => com.type === "MegaMenu");
  const mmPromises = megaMenuComponents.map(com => com.content);
  const _errors_ = await Promise.all(mmPromises.map(async (mmPromise, idx) => {
    try {
      const [content, errors] = await mmPromise;
      const extraData: MegaMenuExtraData = { type: "MegaMenuExtraData", breadcrumbs: data.breadcrumbs };
      megaMenus[idx].innerHTML = popup(content, megaMenus[idx].id, extraData);
      return errors;
    } catch (error) {
      return [error];
    }
  }).flat());

  const smallMenus = [
    ...mountpoint.querySelectorAll('button.small-menu ~ .feds-popup')
  ];
  const smallMenuComponents = data.components.filter(com => com.type === "SmallMenu");
  smallMenuComponents.forEach((com, idx) => {
    const [content] = com.content;
    smallMenus[idx].innerHTML = smallMenuPopup(content, smallMenus[idx].id);
  });

  return mountpoint;
};


export const renderGnavString = ({
  components,
  breadcrumbs,
  productCTA,
  unavEnabled,
  placeholders,
  localnav,
}: GlobalNavigationData
): string => {
  // In localnav mobile, the menu-wrapper is repurposed as the localnav bar
  // (a thin clickable strip below the main nav row that expands inline to
  // reveal the remaining mega-menu entries). Its label mirrors the last
  // breadcrumb crumb so it reads as the current section.
  const lastBreadcrumb = localnav && breadcrumbs !== null &&
    breadcrumbs.items.length > 0
      ? breadcrumbs.items[breadcrumbs.items.length - 1]
      : null;
  const localnavBarLabel = lastBreadcrumb === null
    ? ''
    : typeof lastBreadcrumb === 'string'
      ? lastBreadcrumb
      : lastBreadcrumb.text;
  return `
<nav data-lenis-prevent class="${localnav ? "localnav" : ""}">
  <div class="feds-backdrop" aria-hidden="true"></div>
  <a href="#main-content" class="feds-skip-link">${placeholders.get('skip-to-main') ?? 'Skip to main content'}</a>
  <ul role="presentation">
    ${((): string => {
      const brandComponent = components.find((c) =>
        c.type === "Brand"
      ) ?? null;
      const menuComponents = components.filter((c) => c.type !== "Brand");
      // In localnav mode the hamburger should open the first mega menu's
      // popup directly rather than the menu wrapper / gnav-items list.
      const firstMegaMenu = localnav
        ? menuComponents.find((c) => c.type === "MegaMenu") ?? null
        : null;
      const toggleControlsId = firstMegaMenu !== null
        ? sanitize(firstMegaMenu.title)
        : 'feds-menu-wrapper';
      const toggleButton = `
        <button
          class="feds-nav-toggle"
          type="button"
          aria-label="Navigation menu"
          daa-ll="hamburgermenu|open"
          aria-expanded="false"
          aria-controls="${toggleControlsId}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7" fill="currentColor" aria-hidden="true">
            <path d="M13.25 5.5H0.75C0.33594 5.5 0 5.83594 0 6.25C0 6.66406 0.33594 7 0.75 7H13.25C13.6641 7 14 6.66406 14 6.25C14 5.83594 13.6641 5.5 13.25 5.5Z"/>
            <path d="M0.75 1.5H13.25C13.6641 1.5 14 1.16406 14 0.75C14 0.33594 13.6641 0 13.25 0H0.75C0.33594 0 0 0.33594 0 0.75C0 1.16406 0.33594 1.5 0.75 1.5Z"/>
          </svg>
        </button>
      `.trim();

      const brandHTML = brandComponent ? component(brandComponent) : "";

      const menuItemsHTMLList = ((): HTML[] => {
        const lis = menuComponents
                       .map((c, index) => `<li>${component(c, index)}</li>`);
        const [first, ...rest] = lis;
        return localnav ? [first, '<li class="divider"></li>', ...rest] : lis;
      })();
      const menuItemsHTML = menuItemsHTMLList.join('');

      return `
        <li class="feds-brand-wrapper">
          ${brandHTML}
          ${toggleButton}
        </li>
        <li
          id="feds-menu-wrapper"
          class="feds-menu-wrapper"
        >
          ${localnav ? `
            <button
              class="feds-localnav-bar"
              type="button"
              aria-controls="feds-menu-wrapper"
              aria-expanded="false"
              daa-ll="localnav-bar|Open"
            ><span class="feds-localnav-bar-label">${localnavBarLabel}</span></button>
          ` : ''}
          <ul class="feds-gnav-items">
            ${menuItemsHTML}
          </ul>
        </li>
      `.trim();
    })()}
  </ul>
  ${productCTA === null ? '' : productEntryCTA(productCTA)}
  ${unavEnabled ? '<div class="feds-utilities"></div>' : ''}
  ${breadcrumbs === null ? '' : renderBreadcrumbs(breadcrumbs)}
  <a href="#" class="trap-focus-gnav">.</a>
</nav>
`;
};

export const postRenderingTasks = async (
  input: Input,
): Promise<GlobalNavigation | IrrecoverableError> => {
  const errors = new Set<RecoverableError>();
  const unav = await loadUnav(input.mountpoint);
  if (unav instanceof RecoverableError) {
    errors.add(unav);
    lanaLog(unav.message);
  }
  else
    unav.errors.forEach((error: RecoverableError) => errors.add(error));

  const activeLink = findActiveLink(input.mountpoint);
  const activeDropDown = activeLink?.closest('ul.feds-gnav-items > li');
  activeDropDown?.classList.add('active-element');
  initGnavItemsStaggerIndex(input.mountpoint);
  initActiveTopLevelLinkClosesLocalnav(input.mountpoint);
  initClickListeners(input.mountpoint);
  wirePopups(input.mountpoint);
  initLightDismiss(input.mountpoint);
  initKeyboardNav(input.mountpoint);
  initAriaToggleListeners(input.mountpoint);
  initPopoverCloseOnResize(input.mountpoint);
  initPopoverCloseOnUnavInteraction(input.mountpoint);
  initHeaderScrollState(input.mountpoint);
  initHeaderAnalytics(input.mountpoint, input.mepMartech ?? '');
  initCompactOverflow(input.mountpoint);
  const merchLinkErrors = await initMerchLinks(input.mountpoint);
  merchLinkErrors.forEach((error: RecoverableError) => {
    errors.add(error);
    lanaLog(error.message);
  });

  const reloadUnav
    = unav instanceof RecoverableError
    ? (): void => {}
    : unav.reloadUnav;

  const localnavMarginTop = 8;
  const breadcrumbs = input.mountpoint.querySelector('nav > ul.feds-breadcrumbs');
  const mobileLocalnav = input.mountpoint.querySelector('li.feds-menu-wrapper');
  type NavType = "Default" | "DefaultCompact" | "Localnav" | "LocalnavCompact";
  const getGnavHeight = (): number => {
    const nav = input.mountpoint.firstElementChild;
    if (!nav) return 0;
    const navType = ((): NavType => {
      const isCompact = input.mountpoint.classList.contains('is-compact') || !isDesktop.matches;
      const defaultOrLocalnav = nav.classList.contains('localnav')
        ? "Localnav"
        : "Default";
      return `${defaultOrLocalnav}${isCompact ? "Compact" : ""}`;
    })();
    const breadcrumbsHeight = breadcrumbs
      ? (breadcrumbs as HTMLElement).offsetHeight
      : 0;
    const navHeight = (nav as HTMLElement).offsetHeight;
    const mobileLocalnavHeight = mobileLocalnav
      ? (mobileLocalnav as HTMLElement).offsetHeight
      : 0;
    switch (navType) {
      case "Default":
      case "DefaultCompact":
      case "Localnav": return navHeight + breadcrumbsHeight + localnavMarginTop;
      case "LocalnavCompact": return navHeight + mobileLocalnavHeight + localnavMarginTop;
      default: navType satisfies never;
    }
    return 0;
  };

  return {
    closeEverything: () => closePopovers(input.mountpoint),
    reloadUnav,
    errors,
    setGnavTopPosition: (_): void => {},
    getGnavTopPosition: (): number => 0,
    getGnavHeight,
  };
};

const initAriaToggleListeners = (mountpoint: HTMLElement): void => {
  const menuWrapper = mountpoint.querySelector<HTMLElement>('#feds-menu-wrapper');
  const navToggle = mountpoint.querySelector<HTMLElement>('.feds-nav-toggle');

  menuWrapper?.addEventListener('toggle', () => {
    const isOpen = menuWrapper.classList.contains(IS_OPEN_CLASS);
    // Only reflect open-state on the hamburger when it actually controls the
    // menu-wrapper. In localnav the hamburger's aria-controls points at the
    // first mega-menu's popup (the menu-wrapper is opened via the localnav
    // bar instead), so reflecting menu-wrapper state on the hamburger here
    // would be incorrect.
    if (navToggle?.getAttribute('aria-controls') === 'feds-menu-wrapper') {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute(
        'daa-ll',
        isOpen ? 'hamburgermenu|close' : 'hamburgermenu|open'
      );
    }
    if (isOpen) menuWrapper.classList.add('feds-menu-active');
  });

  menuWrapper?.addEventListener('transitionend', () => {
    if (!menuWrapper.classList.contains(IS_OPEN_CLASS)) {
      menuWrapper.classList.remove('feds-menu-active');
    }
  });

  const megaMenuPopovers = mountpoint.querySelectorAll<HTMLElement>('.feds-popup');
  megaMenuPopovers.forEach(popup => {
    popup.addEventListener('toggle', () => {
      const trigger = mountpoint.querySelector<HTMLElement>(
        `[aria-controls="${popup.id}"]`
      );
      const isOpen = popup.classList.contains(IS_OPEN_CLASS);
      trigger?.setAttribute('aria-expanded', String(isOpen));
      trigger?.setAttribute('daa-ll', isOpen ? 'header|Close' : 'header|Open');
    });
  });
};

const initPopoverCloseOnResize = (mountpoint: HTMLElement): void => {
  isDesktop.addEventListener('change', () => {
    closePopovers(mountpoint);
  });
};

const initPopoverCloseOnUnavInteraction = (mountpoint: HTMLElement): void => {
  [...mountpoint.querySelector('.feds-utilities #universal-nav')?.children ?? []].forEach(child => {
    child.addEventListener('click', () => closePopovers(mountpoint));
    child.addEventListener('keydown', (event) => {
      if ((event as KeyboardEvent).key === 'Enter')
        closePopovers(mountpoint);
    });
  });
};

const initHeaderScrollState = (mountpoint: HTMLElement): void => {
  const header = mountpoint.closest("header");
  if (!header) {
    return;
  }

  const menuWrapper = mountpoint.querySelector<HTMLElement>("#feds-menu-wrapper");
  const isMenuOpen = (): boolean => isPopupOpen(menuWrapper);

  const nav = mountpoint.querySelector<HTMLElement>("nav");
  const isLocalnav = (): boolean => nav?.classList.contains("localnav") ?? false;

  // Track the most recent "queued add" so a subsequent toggle can cancel it.
  // Prevents a race where the user re-opens the bar mid-slide-down and the
  // deferred add still fires, applying `feds-header-scrolled` over an
  // already-open menu.
  let pendingAddCleanup: (() => void) | null = null;
  const cancelPendingAdd = (): void => {
    if (pendingAddCleanup !== null) {
      pendingAddCleanup();
      pendingAddCleanup = null;
    }
  };

  const updateHeaderState = (
    scrolledPast: boolean,
    fromToggle: boolean = false
  ): void => {
    cancelPendingAdd();
    if (isMenuOpen() || !scrolledPast) {
      header.classList.remove("feds-header-scrolled");
      header.classList.remove("feds-localnav-closing");
      return;
    }
    header.classList.add("feds-header-scrolled");
    // Closing the localnav bar in scrolled state: the header's `top` animates
    // from -64px back to 0 over 0.3s. The `feds-header-scrolled` class is
    // needed immediately for color (the bar title would otherwise flash from
    // dark back to its default light shade during the slide-down). But the
    // same class pulls `inset: xs xs 0 xs` onto `nav` via
    // `header.feds-header-scrolled nav`, which would instantly pin nav to
    // `top: xs` and kill the slide (nav holds the visible content). The
    // `feds-localnav-closing` marker class is added in tandem and consumed by
    // a CSS rule that suppresses that inset for the duration of the
    // transition; we remove the marker on `transitionend`.
    if (fromToggle && isLocalnav()) {
      header.classList.add("feds-localnav-closing");
      const onTransitionEnd = (event: TransitionEvent): void => {
        if (event.target !== header || event.propertyName !== "top") return;
        header.removeEventListener("transitionend", onTransitionEnd);
        pendingAddCleanup = null;
        header.classList.remove("feds-localnav-closing");
      };
      header.addEventListener("transitionend", onTransitionEnd);
      pendingAddCleanup = (): void => {
        header.removeEventListener("transitionend", onTransitionEnd);
        header.classList.remove("feds-localnav-closing");
      };
    }
  };

  const SCROLL_THRESHOLD = 20;
  let scrolledPast = window.scrollY > SCROLL_THRESHOLD;
  let scrollRafId: number | null = null;

  // Set the initial state synchronously before the first paint.
  updateHeaderState(scrolledPast);

  const onScroll = (): void => {
    if (scrollRafId !== null) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      const next = window.scrollY > SCROLL_THRESHOLD;
      if (next === scrolledPast) return;
      scrolledPast = next;
      updateHeaderState(scrolledPast);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  menuWrapper?.addEventListener("toggle", () =>
    updateHeaderState(scrolledPast, true)
  );
};

const initHeaderAnalytics = (
  mountpoint: HTMLElement,
  mepMartech: string
): void => {
  const header = mountpoint.closest("header");
  if (header === null) return;
  header.setAttribute('daa-lh', `gnav|${getExperienceName()}${mepMartech}`);
};

const initCompactOverflow = (mountpoint: HTMLElement): void => {
  const header = mountpoint.closest<HTMLElement>('header.global-navigation');
  if (!header) return;

  const brandWrapper = mountpoint.querySelector<HTMLElement>('.feds-brand-wrapper');
  const gnavItems = mountpoint.querySelector<HTMLElement>('.feds-gnav-items');
  const utilities = mountpoint.querySelector<HTMLElement>('.feds-utilities');
  const productCta = mountpoint.querySelector<HTMLElement>('.feds-product-entry-cta');

  const check = (): void => {
    if (!isDesktop.matches) {
      header.classList.remove('is-compact');
      return;
    }
    // Temporarily strip is-compact so we measure the natural desktop widths,
    // then restore via toggle at the end.
    header.classList.remove('is-compact');

    // Sum individual li widths inside gnav-items — these are not flex-grow so
    // their offsetWidth reflects their true content width. Brand and utilities
    // are fixed-size flex items so offsetWidth is correct for them too.
    const brandWidth = brandWrapper?.offsetWidth ?? 0;
    const itemsWidth = gnavItems?.offsetWidth ?? 0;
    const utilitiesWidth = utilities?.offsetWidth ?? 0;
    const ctaWidth = productCta?.offsetWidth ?? 0;
    const contentWidth = brandWidth + itemsWidth +
      utilitiesWidth + ctaWidth + 40;

    header.classList.toggle('is-compact', contentWidth > header.clientWidth);
  };

  const observer = new ResizeObserver(check);
  observer.observe(header);
  isDesktop.addEventListener('change', check);
  check();
};

const isCurrentPageHref = (href: string): boolean => {
  const url = `${window.location.origin}${window.location.pathname}`;
  return href === url
      || href.startsWith(`${url}?`)
      || href.startsWith(`${url}#`);
};

const findActiveLink = (
  mountpoint: HTMLElement
): HTMLAnchorElement | null => {
  return [...mountpoint.querySelectorAll<HTMLAnchorElement>('a:not(.feds-skip-link)')]
    .filter(a => !a.closest('.feds-breadcrumbs'))
    .find(a => isCurrentPageHref(a.href)) ?? null;
};

/**
 * Sets a `--i` CSS custom property on each top-level `<li>` inside every
 * `ul.feds-gnav-items`, indexed from 0. This drives the staggered
 * open/close animations in `styles.css` via
 * `animation-delay: calc(var(--i) * ...)`, removing the need for a
 * hand-maintained `nth-child` table that must be extended every time the
 * menu grows.
 */
const initGnavItemsStaggerIndex = (mountpoint: HTMLElement): void => {
  const lists = mountpoint.querySelectorAll<HTMLUListElement>('ul.feds-gnav-items');
  lists.forEach(list => {
    const items = list.querySelectorAll<HTMLLIElement>(':scope > li');
    items.forEach((li, index) => {
      li.style.setProperty('--i', String(index));
    });
  });
};

/**
 * In localnav mode, clicking a TOP-LEVEL localnav link whose href points to
 * the current page (the very same URL, with optional ?query) is redundant —
 * the page is already loaded. Instead of triggering a no-op navigation, we
 * suppress the default and close the localnav so the user sees the page
 * they're already on. Scope is strictly limited to
 * `nav.localnav ul.feds-gnav-items > li > a`; nested links (mega-menu
 * popups, links-card, CTAs, breadcrumbs, etc.) are left untouched and
 * continue to navigate normally. Hash-only same-page links also navigate
 * normally (so in-page anchor jumps still work) while still closing the
 * localnav.
 */
// eslint-disable-next-line max-len
const initActiveTopLevelLinkClosesLocalnav = (mountpoint: HTMLElement): void => {
  const localnav = mountpoint.querySelector('nav.localnav');
  if (localnav === null) return;
  const topLevelAnchors = localnav.querySelectorAll<HTMLAnchorElement>(
    'ul.feds-gnav-items > li > a'
  );
  topLevelAnchors.forEach(anchor => {
    if (!isCurrentPageHref(anchor.href)) return;
    anchor.addEventListener('click', (event) => {
      // Defensive: ensure DOM still matches the structural contract at
      // click-time (guards against late mutations broadening scope).
      const target = event.currentTarget as HTMLAnchorElement;
      if (!target.matches('ul.feds-gnav-items > li > a')) return;
      if (target.closest('nav')?.classList.contains('localnav') !== true) return;

      const href = target.href;
      const url = `${window.location.origin}${window.location.pathname}`;
      const isHashOnly = href.startsWith(`${url}#`);
      if (!isHashOnly) {
        event.preventDefault();
        event.stopPropagation();
      }
      closePopovers(mountpoint);
      const focusTarget
        = mountpoint.querySelector<HTMLElement>('.feds-localnav-bar')
        ?? mountpoint.querySelector<HTMLElement>('.feds-nav-toggle');
      focusTarget?.focus();
    });
  });
};
