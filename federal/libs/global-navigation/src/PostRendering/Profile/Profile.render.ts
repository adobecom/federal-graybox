/**
 * HTML-string builders for the legacy profile (federal render idiom).
 * The dropdown menu itself is assembled in Profile.loader.ts because it may
 * splice in a live, authored "local menu" DOM node.
 */

import type { ProfileLabels } from './Profile.types';
import { decorateProfileLink, decorateEmail } from './Profile.utils';

/** Signed-in avatar button that toggles the dropdown. */
export const profileButton = (avatar: string, labels: ProfileLabels): HTML => `
  <button
    data-cs-mask
    class="feds-profile-new-button"
    aria-expanded="false"
    aria-controls="feds-profile-new-menu"
    aria-label="${labels.profileButton}"
    daa-ll="Account"
    aria-haspopup="true"
  >
    <img data-cs-mask class="feds-profile-new-img" src="${avatar}" alt="${labels.profileAvatar}" />
  </button>
`.trim();

/** Plain "Sign in" button (no authored dropdown). */
export const signInButton = (label: string): HTML =>
  `<button daa-ll="${label}" class="feds-signIn">${label}</button>`;

/** "Sign in" button that toggles an authored sign-in dropdown. */
export const signInDropdownButton = (label: string): HTML =>
  `<button daa-ll="${label}" class="feds-signIn" aria-expanded="false" aria-haspopup="true">${label}</button>`;

/** The account header link at the top of the dropdown. */
export const profileHeaderHTML = (opts: {
  avatar: string;
  displayName: string;
  email: string;
  labels: ProfileLabels;
  lang: string;
}): HTML => `
  <a
    href="${decorateProfileLink('account', `?lang=${opts.lang}`)}"
    class="feds-profile-new-header"
    daa-ll="${opts.labels.viewAccount}"
    aria-label="${opts.labels.viewAccount}"
  >
    <img
      data-cs-mask
      class="feds-profile-new-img"
      src="${opts.avatar}"
      tabindex="0"
      alt="${opts.labels.profileAvatar}"
      data-url="${decorateProfileLink('account', `profile?lang=${opts.lang}`)}"
    />
    <div class="feds-profile-new-details">
      <p data-cs-mask class="feds-profile-new-name">${opts.displayName}</p>
      <p data-cs-mask class="feds-profile-new-email">${decorateEmail(opts.email)}</p>
      <p class="feds-profile-new-account">${opts.labels.viewAccount}</p>
    </div>
  </a>
`.trim();

/** The action items (optional admin console + sign out) list contents. */
export const profileActionsHTML = (opts: {
  labels: ProfileLabels;
  hasOrgs: boolean;
}): HTML => `
  ${opts.hasOrgs
    ? `<li><a class="feds-profile-new-action" href="${decorateProfileLink('adminconsole')}">${opts.labels.goToAdminConsole}</a></li>`
    : ''}
  <li><a href="#" class="feds-profile-new-action feds-profile-new-signout" daa-ll="${opts.labels.signOut}">${opts.labels.signOut}</a></li>
`.trim();
