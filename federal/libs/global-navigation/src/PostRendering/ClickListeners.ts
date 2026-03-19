import { isDesktop } from "../Utils/Utils";

type CleanupFunction = () => void

export const initClickListeners = (
  gnav: HTMLElement
): CleanupFunction => {
  const tabButtons = [...gnav.querySelectorAll('.tabs button[role="tab"]')];
  const tabPanels = [...gnav.querySelectorAll('.tab-content ul')];
  const tabButtonClickCallbacks = tabButtons.map((button, i) => (): void => {

      const popover = tabPanels[i].closest(':popover-open');

      tabButtons.forEach(tabButton => {
        tabButton.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(tabPanel => {
        tabPanel.setAttribute('hidden', 'true');
      });
      tabPanels[i]?.removeAttribute('hidden');
      button.setAttribute('aria-selected', 'true');
      
      if (!popover) return;
      if (!isDesktop.matches) return;
      const popoverBackgroundRule = getPopoverBackgroundRule()
      if (!popoverBackgroundRule) return;

      const newHeight = popover?.clientHeight ?? 0;
      (popoverBackgroundRule as CSSStyleRule).style.height = `${newHeight + 72}px`;

    }
  );

  tabButtons.forEach((button, i) => {
    button.addEventListener('click', tabButtonClickCallbacks[i]);
  });

  animations(gnav);

  return () => {
    tabButtons.forEach((button, i) => {
      button.removeEventListener('click', tabButtonClickCallbacks[i]);
    });
  };
};

const getPopoverBackgroundRule = () =>
  [...document.adoptedStyleSheets.flatMap(sheet => [...sheet.cssRules])]
    .find(rule => 
          (rule as CSSStyleRule)?.selectorText === 'header.global-navigation nav::after');


const animations = (gnav: HTMLElement): void => {
  const mainMenuButtons = [...gnav.querySelectorAll('.feds-gnav-items > li > button')];
  const fedsGnavItems = gnav.querySelector('.feds-gnav-items');

  // popover height animations
  const popoverBackgroundRule = getPopoverBackgroundRule();
  const resizeObserver = new ResizeObserver(entries => {
    if (entries.length < 1) return;
    const openPopover = gnav.querySelector('.feds-popup:popover-open');
    if (!openPopover) {
      (popoverBackgroundRule as CSSStyleRule).style.height = '100%';
      return;
    }
    const resetPopoverHeight = openPopover.clientHeight < 1;
    const height = resetPopoverHeight ? '100%' : `${openPopover.clientHeight + 72}px`;
    (popoverBackgroundRule as CSSStyleRule).style.height = height;
  });

  mainMenuButtons.forEach(button => {
    if (!popoverBackgroundRule) return;
    const popup = button.nextElementSibling;
    if (!popup) return;
    resizeObserver.observe(popup);
    // @ts-expect-error popup is a popover with a toggle event
    popup.addEventListener('toggle', (event: ToggleEvent) => {
      if (event.newState !== 'open' && !gnav.querySelector('.feds-popup:popover-open')) {
        (popoverBackgroundRule as CSSStyleRule).style.height = '100%';
      } else {
        // in case the resize observer fails
        (popoverBackgroundRule as CSSStyleRule).style.height = `${popup.clientHeight + 72}px`;
      }
    });
  });

  // Mobile subscreen animations

  mainMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (isDesktop.matches) return;
      if (!fedsGnavItems) return;
      const popup = button.nextElementSibling;
      if (!popup) return;
      fedsGnavItems.classList.remove('subscreen-closing');
      fedsGnavItems.classList.add('subscreen-opening');
      popup.querySelector('.feds-popup-back-button')?.addEventListener('click', () => {
        fedsGnavItems.classList.remove('subscreen-opening');
        fedsGnavItems.classList.add('subscreen-closing');
        setTimeout(() => (popup as HTMLElement).hidePopover(), 240);
      });
    });
  });
  isDesktop.addEventListener('change', () => {
    fedsGnavItems?.classList.remove('subscreen-opening');
    fedsGnavItems?.classList.remove('subscreen-closing');
  });
  gnav.querySelector('.feds-nav-toggle')?.addEventListener('click', () => {
    fedsGnavItems?.classList.remove('subscreen-opening');
    fedsGnavItems?.classList.remove('subscreen-closing');
  });
}
