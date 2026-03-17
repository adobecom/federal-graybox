import { isDesktop } from "../Utils/Utils";

type CleanupFunction = () => void

export const initClickListeners = (
  gnav: HTMLElement
): CleanupFunction => {
  const tabButtons = [...gnav.querySelectorAll('.tabs button[role="tab"]')];
  const tabPanels = [...gnav.querySelectorAll('.tab-content ul')];
  const tabButtonClickCallbacks = tabButtons.map((button, i) => (): void => {

      const popover = tabPanels[i].closest(':popover-open');
      const oldHeight = popover?.clientHeight ?? 0;

      tabButtons.forEach(tabButton => {
        tabButton.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(tabPanel => {
        tabPanel.setAttribute('hidden', 'true');
      });
      tabPanels[i]?.removeAttribute('hidden');
      button.setAttribute('aria-selected', 'true');
      
      if (!isDesktop.matches) return;
      const newHeight = popover?.clientHeight ?? 0;

      popover?.animate([
        { height: `${oldHeight}px` },
        { height: `${newHeight}px` }
      ],
      {
        duration: 350,
        iterations: 1,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      });
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


const animations = (gnav: HTMLElement): void => {
  const mainMenuButtons = [...gnav.querySelectorAll('.feds-gnav-items > li > button')];
  const fedsGnavItems = gnav.querySelector('.feds-gnav-items');
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
