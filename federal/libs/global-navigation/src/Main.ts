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
import { renderListItems, setMiloConfig, MiloConfig, setPersonalizationConfig, PersonalizationConfig, setLocalizeLink, LocalizeLink, isDesktop, closePopovers, getExperienceName } from "./Utils/Utils";
import { IS_OPEN_CLASS, isPopupOpen } from "./PostRendering/PopupWiring";
import './styles/styles.css';
import { combineWithFederalPlaceholders, setPlaceholders, getPlaceholders } from "./Utils/Placeholders";
import { lanaLog } from "./Utils/Log";
import { popup } from "./Components/MegaMenu/Render";

type GlobalNavigation = {
  closeEverything: () => void;
  reloadUnav: () => void;
  getGnavTopPosition: () => number;
  setGnavTopPosition: (_: number) => void;
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
  mountpoint.classList.add('site-pivot');
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
      megaMenus[idx].innerHTML = popup(content, megaMenus[idx].id);
      return errors;
    } catch (error) {
      return [error];
    }
  }).flat());

  return mountpoint;
};

export const renderGnavString = ({
  components,
  productCTA,
  unavEnabled,
  placeholders,
}: GlobalNavigationData
): string => {
  return `
<nav data-lenis-prevent>
  <div class="feds-backdrop" aria-hidden="true"></div>
  <a href="#main-content" class="feds-skip-link">${placeholders.get('skip-to-main') ?? 'Skip to main content'}</a>
  <ul role="presentation">
    ${((): string => {
      const brandComponent = components.find((c) =>
        c.type === "Brand"
      ) ?? null;
      const menuComponents = components.filter((c) => c.type !== "Brand");
      const toggleButton = `
        <button
          class="feds-nav-toggle"
          type="button"
          aria-label="Navigation menu"
          daa-ll="hamburgermenu|open"
          aria-expanded="false"
          aria-controls="feds-menu-wrapper"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7" fill="currentColor" aria-hidden="true">
            <path d="M13.25 5.5H0.75C0.33594 5.5 0 5.83594 0 6.25C0 6.66406 0.33594 7 0.75 7H13.25C13.6641 7 14 6.66406 14 6.25C14 5.83594 13.6641 5.5 13.25 5.5Z"/>
            <path d="M0.75 1.5H13.25C13.6641 1.5 14 1.16406 14 0.75C14 0.33594 13.6641 0 13.25 0H0.75C0.33594 0 0 0.33594 0 0.75C0 1.16406 0.33594 1.5 0.75 1.5Z"/>
          </svg>
        </button>
      `.trim();

      const brandHTML = brandComponent ? component(brandComponent) : "";
      const menuItemsHTML = renderListItems(menuComponents, component);

      return `
        <li class="feds-brand-wrapper">
          ${brandHTML}
          ${toggleButton}
        </li>
        <li
          id="feds-menu-wrapper"
          class="feds-menu-wrapper"
        >
          <ul class="feds-gnav-items">
            ${menuItemsHTML}
          </ul>
        </li>
      `.trim();
    })()}
  </ul>
  ${productCTA === null ? '' : productEntryCTA(productCTA)}
  ${unavEnabled ? '<div class="feds-utilities"></div>' : ''}
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

  initClickListeners(input.mountpoint);
  wirePopups(input.mountpoint);
  initLightDismiss(input.mountpoint);
  initKeyboardNav(input.mountpoint);
  initAriaToggleListeners(input.mountpoint);
  initPopoverCloseOnResize(input.mountpoint);
  initPopoverCloseOnUnavInteraction(input.mountpoint);
  initHeaderScrollState(input.mountpoint);
  initHeaderAnalytics(input.mountpoint, input.mepMartech ?? '');
  const merchLinkErrors = await initMerchLinks(input.mountpoint);
  merchLinkErrors.forEach((error: RecoverableError) => {
    errors.add(error);
    lanaLog(error.message);
  });

  const reloadUnav
    = unav instanceof RecoverableError
    ? (): void => {}
    : unav.reloadUnav;

  return {
    closeEverything: () => closePopovers(input.mountpoint),
    reloadUnav,
    errors,
    setGnavTopPosition: (_): void => {},
    getGnavTopPosition: (): number => 0,
  };
};

const initAriaToggleListeners = (mountpoint: HTMLElement): void => {
  const menuWrapper = mountpoint.querySelector<HTMLElement>('#feds-menu-wrapper');
  const navToggle = mountpoint.querySelector<HTMLElement>('.feds-nav-toggle');

  menuWrapper?.addEventListener('toggle', () => {
    const isOpen = menuWrapper.classList.contains(IS_OPEN_CLASS);
    navToggle?.setAttribute('aria-expanded', String(isOpen));
    navToggle?.setAttribute(
      'daa-ll',
      isOpen ? 'hamburgermenu|close' : 'hamburgermenu|open'
    );
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

  const updateHeaderState = (scrolledPast: boolean): void => {
    if (isMenuOpen() || !scrolledPast) {
      header.classList.remove("feds-header-scrolled");
      return;
    }
    header.classList.add("feds-header-scrolled");
  };

  // A 20px sentinel placed at the top of the document body. When it scrolls
  // out of the viewport the page has passed the threshold.
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:20px;height:1px;width:1px;pointer-events:none;visibility:hidden;";
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.setAttribute("tabindex", "-1");
  document.body.prepend(sentinel);

  let scrolledPast = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      scrolledPast = !entry.isIntersecting;
      updateHeaderState(scrolledPast);
    },
    { threshold: 0 }
  );
  observer.observe(sentinel);

  menuWrapper?.addEventListener("toggle", () =>
    updateHeaderState(scrolledPast)
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


