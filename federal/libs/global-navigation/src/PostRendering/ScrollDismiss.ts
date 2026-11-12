import { closePopovers } from "../Utils/Utils";

export const initScrollDismiss = (mountpoint: HTMLElement): (() => void) => {
  const onScroll = (event: Event): void => {
    // Element scrolling must not dismiss a scrollable menu or drawer.
    if (event.target !== document && event.target !== window) return;
    closePopovers(mountpoint);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
};
