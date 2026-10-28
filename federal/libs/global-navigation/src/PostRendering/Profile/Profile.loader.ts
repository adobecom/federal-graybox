/**
 * Profile loader - the legacy (non-UniversalNav) self-hosted profile.
 *
 * Federal port of milo's `decorateProfile` + `ProfileDropdown`. Renders into
 * the `.feds-profile-new` container that renderGnavString emits when
 * `profileEnabled` is set.
 *
 * IMS readiness is host-driven (option A): auth state is read live from
 * `window.adobeIMS` at decorate time, and `reloadProfile` is returned so the
 * host can re-decorate after an external login/logout. Federal does not own
 * the IMS lifecycle (matching how `loadUnav` reads IMS state live).
 */

import { RecoverableError } from '../../Error/Error';
import { lanaLog } from '../../Utils/Log';
import { getMiloConfig } from '../../Utils/Utils';
import { getPlaceholders } from '../../Utils/Placeholders';
import { setUserProfile } from '../Unav/Unav.utils';
import {
  getSignInContext,
  signIn,
  getOrgFlags,
  clearSignOutCookies,
  getLanguage,
  getProfileLabels,
} from './Profile.utils';
import {
  profileButton,
  signInButton,
  signInDropdownButton,
  profileHeaderHTML,
  profileActionsHTML,
} from './Profile.render';
import type {
  ProfileLabels,
  IMSProfile,
  Organizations,
  ProfileApiResponse,
  Profile,
} from './Profile.types';

const PROFILE_MENU_ID = 'feds-profile-new-menu';

/** Reads IMS signed-in state defensively (IMS may not be present yet). */
const isSignedIn = (): boolean => {
  try {
    return window.adobeIMS?.isSignedInUser() === true;
  } catch {
    return false;
  }
};

/**
 * Closes any open dropdown inside `root` on outside-click or Escape. Attached
 * once per load against the stable container so reloads don't stack handlers.
 */
const wireGlobalDismiss = (root: HTMLElement): void => {
  const closeAll = (): void => {
    root
      .querySelectorAll<HTMLElement>('[aria-expanded="true"]')
      .forEach((el) => el.setAttribute('aria-expanded', 'false'));
  };
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node)) return;
    if (root.contains(event.target)) return;
    closeAll();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeAll();
  });
};

/** Wires a trigger's own click (toggle) and Escape (close) behaviour. */
const wireTriggerToggle = (trigger: HTMLElement): void => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
  });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') trigger.setAttribute('aria-expanded', 'false');
  });
};

/** Signed-out: plain sign-in button, or one toggling an authored dropdown. */
const decorateSignedOut = (
  container: HTMLElement,
  rawProfileElem: Element | null,
  labels: ProfileLabels,
): void => {
  const authoredDropdown = rawProfileElem?.querySelector(
    ':scope > div:nth-child(2)',
  );

  if (!authoredDropdown) {
    container.insertAdjacentHTML('afterbegin', signInButton(labels.signIn));
    const button = container.querySelector<HTMLElement>('.feds-signIn');
    button?.addEventListener('click', (event) => {
      event.preventDefault();
      signIn(getSignInContext());
    });
    return;
  }

  // Authored dropdown present: button toggles it, and the in-dropdown
  // `?sign-in=true` anchor becomes a real sign-in button (milo parity).
  authoredDropdown.classList.add('feds-signIn-dropdown');
  const dropdownSignInAnchor = authoredDropdown.querySelector(
    '[href$="?sign-in=true"]',
  );
  if (dropdownSignInAnchor) {
    const anchorButton = document.createElement('button');
    anchorButton.className = 'feds-signIn';
    anchorButton.textContent = dropdownSignInAnchor.textContent;
    anchorButton.addEventListener('click', (event) => {
      event.preventDefault();
      signIn(getSignInContext());
    });
    dropdownSignInAnchor.replaceWith(anchorButton);
  } else {
    lanaLog('Sign in link not found in dropdown.', 'gnav-profile', 'i');
  }

  container.append(authoredDropdown);
  container.insertAdjacentHTML('afterbegin', signInDropdownButton(labels.signIn));
  const button = container.querySelector<HTMLElement>('.feds-signIn');
  if (button) wireTriggerToggle(button);
};

/**
 * Signed-in: fetch the avatar, render the button + dropdown, wire behaviour.
 * Faithful port of milo's `decorateProfile` (signed-in) + ProfileDropdown.
 */
const decorateSignedIn = async (
  container: HTMLElement,
  rawProfileElem: Element | null,
  labels: ProfileLabels,
): Promise<void> => {
  const ims = window.adobeIMS;
  if (ims === undefined) return;

  const accessToken = ims.getAccessToken();
  let env: { adobeIO?: string } | undefined;
  try {
    ({ env } = getMiloConfig());
  } catch {
    env = undefined;
  }

  let profile: IMSProfile = {};
  let hasOrgs = false;
  try {
    const [profileData, organizations] = await Promise.all([
      ims.getProfile(),
      ims.getOrganizations(),
    ]);
    profile = (profileData as IMSProfile) ?? {};
    hasOrgs = getOrgFlags(organizations as Organizations).hasOrgs;
  } catch (error) {
    profile = {};
    hasOrgs = false;
    lanaLog(
      `GNAV: decorateProfile failed to fetch profile or organizations data: ${String(error)}`,
      'gnav-profile',
      'i',
    );
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken?.token ?? ''}`,
    'x-account-id': profile.userId ?? '',
    'x-api-key': window.adobeid?.client_id ?? '',
  });

  let avatar = '';
  try {
    const response = await fetch(`https://${env?.adobeIO ?? ''}/api/profile`, {
      headers,
    });
    if (!response.ok) {
      lanaLog(
        `GNAV: decorateProfile failed to fetch profile data: ${response.statusText} url: ${response.url}`,
        'gnav-profile',
        'i',
      );
      return;
    }
    const json = (await response.json()) as ProfileApiResponse;
    avatar = json?.images?.['138'] ?? '';
  } catch (error) {
    lanaLog(
      `GNAV: decorateProfile failed to fetch profile data: ${String(error)}`,
      'gnav-profile',
      'i',
    );
    return;
  }

  // Button first, then the menu (CSS reveals the menu via the adjacent
  // sibling selector `.feds-profile-new-button[aria-expanded="true"] + .menu`).
  container.insertAdjacentHTML('afterbegin', profileButton(avatar, labels));
  const button = container.querySelector<HTMLElement>('.feds-profile-new-button');
  if (button && (profile.displayName ?? '') !== '') {
    button.setAttribute('aria-label', profile.displayName ?? '');
  }

  const lang = getLanguage((getMiloConfig().locale.ietf ?? ''));

  const menu = document.createElement('div');
  menu.id = PROFILE_MENU_ID;
  menu.className = 'feds-profile-new-menu';
  menu.innerHTML = profileHeaderHTML({
    avatar,
    displayName: profile.displayName ?? '',
    email: profile.email ?? '',
    labels,
    lang,
  });

  // Splice in the authored "local menu" (the <h5>'s parent), preserving its
  // live anchors, between the header and the actions.
  const localMenu = rawProfileElem?.querySelector('h5')?.parentElement ?? null;
  if (localMenu) {
    localMenu.classList.add('feds-local-menu');
    menu.append(localMenu);
  }

  const actions = document.createElement('ul');
  actions.className = 'feds-profile-new-actions';
  actions.innerHTML = profileActionsHTML({ labels, hasOrgs });
  menu.append(actions);

  container.append(menu);

  if (button) wireTriggerToggle(button);

  // Avatar in the header navigates to the account profile page.
  const avatarElem = menu.querySelector<HTMLElement>('.feds-profile-new-header .feds-profile-new-img');
  avatarElem?.addEventListener('click', (event) => {
    event.preventDefault();
    const url = avatarElem.dataset.url;
    if (url !== undefined && url !== '') window.location.assign(url);
  });

  // Sign out: clear cookies, notify listeners, then IMS sign-out.
  const signOutLink = menu.querySelector<HTMLElement>('.feds-profile-new-signout');
  signOutLink?.addEventListener('click', (event) => {
    event.preventDefault();
    clearSignOutCookies();
    window.dispatchEvent(new Event('feds:signOut'));
    window.adobeIMS?.signOut({ redirect_uri: window.location.href });
  });
};

/**
 * Loads and decorates the legacy profile into the `.feds-profile-new`
 * container.
 *
 * @param nav - Navigation element containing the `.feds-profile-new` container
 * @param rawProfileElem - The authored `.profile` block captured pre-parse
 *   (source of the sign-in dropdown and local menu); null if none authored
 * @returns Promise resolving to a Profile handle or a RecoverableError
 */
export const loadProfile = async (
  nav: HTMLElement,
  rawProfileElem: Element | null,
): Promise<Profile | RecoverableError> => {
  const container = nav.querySelector('.feds-profile-new');
  if (!(container instanceof HTMLElement)) {
    return new RecoverableError('missing ".feds-profile-new" container');
  }

  // Legacy profile is a non-UNAV path; resolve the shared profile state to an
  // empty object so features awaiting getUserProfile() don't hang (milo sets
  // setUserProfile({}) on the non-universal-nav path).
  setUserProfile({});

  const placeholders = await getPlaceholders();
  const labels = getProfileLabels(placeholders);

  wireGlobalDismiss(container);

  const decorate = async (): Promise<void> => {
    if (!isSignedIn()) {
      decorateSignedOut(container, rawProfileElem, labels);
      return;
    }
    await decorateSignedIn(container, rawProfileElem, labels);
  };

  await decorate();

  const reloadProfile = async (): Promise<void> => {
    container.replaceChildren();
    await decorate();
  };

  return { reloadProfile };
};
