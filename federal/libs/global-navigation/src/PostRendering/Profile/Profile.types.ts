/**
 * Types for the legacy (non-UniversalNav) self-hosted profile.
 *
 * This is the federal port of milo's `feds-profile-new`: a standalone avatar
 * button + dropdown used in environments where the external UniversalNav
 * bundle isn't available. It depends only on `window.adobeIMS` and a single
 * `adobe.io/api/profile` fetch.
 */

/** Labels resolved from the placeholders sheet. */
export type ProfileLabels = {
  signIn: string;
  profileButton: string;
  profileAvatar: string;
  signOut: string;
  viewAccount: string;
  goToAdminConsole: string;
};

/** Shape of the IMS profile fields we consume. */
export type IMSProfile = {
  userId?: string;
  displayName?: string;
  email?: string;
};

/** Shape of the IMS organizations payload we inspect for admin roles. */
export type Organizations = {
  organizations?: Array<{
    orgType?: string;
    groups?: Array<{ role?: string }>;
  }>;
};

/** Shape of the `adobe.io/api/profile` response we read the avatar from. */
export type ProfileApiResponse = {
  images?: Record<string, string>;
};

/**
 * Return type for a successful profile load. `reloadProfile` lets the host
 * re-decorate after an external IMS state change (e.g. post-login), mirroring
 * how UNAV exposes `reloadUnav` — federal deliberately does not own the IMS
 * lifecycle.
 */
export type Profile = {
  reloadProfile: () => Promise<void>;
};
