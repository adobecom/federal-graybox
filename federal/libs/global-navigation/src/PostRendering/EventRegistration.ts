import { getMetadata } from "../Utils/Utils";
import { lanaLog } from "../Utils/Log";

const REGISTRATION_RESOLVED_EVENT = 'registration:resolved';

const REGISTRATION_PENDING_ATTR = 'data-feds-registration-pending';

// Fallback reveal if status never resolves, so the CTA is never stuck hidden.
// Generous so a slow-but-real resolve doesn't reveal a registered CTA early.
const REGISTRATION_TIMEOUT = 5000;

type RegistrationStatus = {
  isRegistered: boolean;
  inPersonAttendee?: boolean;
};

/**
 * Removes CTAs authored with `#_hide-when-registered` once the visitor is
 * confirmed registered. Gated on `event-code`, and fire-and-forget so it never
 * blocks render.
 *
 * The CTA is pre-hidden and only revealed once status resolves, so a registered
 * visitor never sees it flash in then get removed. IMS timing is left to
 * da-events' `getRegistrationStatus()`, which returns quickly for signed-out
 * visitors, keeping the hidden window imperceptible.
 *
 * da-events dispatches `registration:resolved` before it assigns
 * `window.events`, so GNAV can render on either side: if `window.events` exists
 * we ask it directly, otherwise we listen once for the event. The check and
 * `addEventListener` are synchronous, so the event can't slip between them.
 */
export const initEventRegistrationGating = (mountpoint: HTMLElement): void => {
  const eventCode = getMetadata('event-code');
  if (eventCode === null || eventCode === '') return;

  const gatedLinks = mountpoint.querySelectorAll<HTMLElement>('[data-feds-hide-when-registered]');
  if (gatedLinks.length === 0) return;

  const reveal = (): void =>
    gatedLinks.forEach(link => link.removeAttribute(REGISTRATION_PENDING_ATTR));

  // Hide up front; reveal or remove once status resolves.
  gatedLinks.forEach(link => link.setAttribute(REGISTRATION_PENDING_ATTR, ''));
  const safetyTimer = setTimeout(reveal, REGISTRATION_TIMEOUT);

  const applyGate = (status: RegistrationStatus | undefined): void => {
    clearTimeout(safetyTimer);
    if (status?.isRegistered === true) {
      // Remove the CTA's wrapper (nav-item `<li>` or Product Entry CTA),
      // falling back to the link so an unexpected wrapper never no-ops.
      gatedLinks.forEach(link => {
        (link.closest('li, .feds-product-entry-cta') ?? link).remove();
      });
    } else {
      reveal();
    }
  };

  const onError = (error: unknown): void => {
    clearTimeout(safetyTimer);
    reveal();
    lanaLog(`Failed to resolve event registration status: ${String(error)}`);
  };

  if (window.events?.getRegistrationStatus) {
    window.events.getRegistrationStatus().then(applyGate).catch(onError);
    return;
  }

  window.addEventListener(
    REGISTRATION_RESOLVED_EVENT,
    (event) => applyGate((event as CustomEvent<RegistrationStatus>).detail),
    { once: true },
  );
};
