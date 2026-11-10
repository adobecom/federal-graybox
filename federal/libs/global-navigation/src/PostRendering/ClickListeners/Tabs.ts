import { isDesktop, isNavDesktop } from "../../Utils/Utils";
import { IS_OPEN_CLASS } from "../PopupWiring";
import { POPOVER_BG_HEIGHT_OFFSET_PX, setPopoverBgHeight } from "./Animations";

export const initTabListeners = (gnav: HTMLElement): (() => void) => {
  const tabButtons = [...gnav.querySelectorAll<HTMLButtonElement>('.tabs button[role="tab"]')];
  const tabPanels = [...gnav.querySelectorAll('.tab-content [role="tabpanel"], .tab-content > li > ul:not([role="tabpanel"])')];
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
  });

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

  return () => {
    tabButtons.forEach((button, i) => {
      button.removeEventListener('click', tabButtonClickCallbacks[i]);
      button.removeEventListener('focus', tabButtonFocusCallbacks[i]);
    });
    isDesktop.removeEventListener('change', updateTablistOrientation);
  };
};
