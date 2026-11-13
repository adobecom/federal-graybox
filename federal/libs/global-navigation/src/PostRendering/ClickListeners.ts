import { initAnimations } from "./ClickListeners/Animations";
import { initLinksCardListeners } from "./ClickListeners/LinksCard";
import { initSkipLinkListener } from "./ClickListeners/SkipLink";
import { initTabListeners } from "./ClickListeners/Tabs";

type CleanupFunction = () => void;

export const initClickListeners = (gnav: HTMLElement): CleanupFunction => {
  const cleanupSkipLink = initSkipLinkListener(gnav);
  const cleanupTabs = initTabListeners(gnav);
  initAnimations(gnav);
  initLinksCardListeners(gnav);

  return () => {
    cleanupSkipLink();
    cleanupTabs();
  };
};
