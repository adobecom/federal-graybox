import { closePopovers } from '../Utils/Utils';
import { isPopupOpen, triggersForPopupId } from './PopupWiring';

export type ModalLinkDecorator = (root: HTMLElement) => Promise<void>;

export const initModalLinks = async (
  mountpoint: HTMLElement,
  decorate?: ModalLinkDecorator,
): Promise<void> => {
  if (decorate === undefined) return;

  let trigger: HTMLAnchorElement | null = null;
  let returnFocus: HTMLElement | null = null;
  const visibleTrigger = (id: string): HTMLElement | null =>
    triggersForPopupId(mountpoint, id)
      .find(element => element.getClientRects().length > 0) ?? null;
  mountpoint.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey
      || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-modal-hash]');
    if (link === null) return;
    trigger = link;
    const popup = link.closest<HTMLElement>('.feds-popup');
    const menu = mountpoint.querySelector<HTMLElement>('#feds-menu-wrapper');
    returnFocus = popup === null ? null : visibleTrigger(popup.id);
    if (menu !== null && isPopupOpen(menu)
      && menu.contains(returnFocus ?? link)) {
      returnFocus = visibleTrigger(menu.id);
    }
    closePopovers(mountpoint);
  });
  window.addEventListener('milo:modal:closed', (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    if (typeof detail !== 'object' || detail === null
      || !('hash' in detail) || trigger?.dataset.modalHash !== detail.hash) return;
    const focusTarget = returnFocus;
    if (focusTarget !== null) {
      // Run after Milo restores its anchor, which may now be in a closed menu.
      queueMicrotask(() => {
        if (focusTarget.isConnected) focusTarget.focus({ preventScroll: true });
      });
    }
    trigger = null;
    returnFocus = null;
  });

  await decorate(mountpoint);
};
