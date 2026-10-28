/**
 * Pure helpers for the legacy profile, ported 1:1 from milo's
 * global-navigation.js / features/profile/dropdown.js.
 */

import { getMiloConfig } from '../../Utils/Utils';
import { lanaLog } from '../../Utils/Log';
import type { ProfileLabels, Organizations } from './Profile.types';

/** IMS sign-in context, read from MiloConfig (matches Unav.config). */
export const getSignInContext = (): object => {
  try {
    return getMiloConfig().signInContext ?? {};
  } catch {
    return {};
  }
};

/** Kicks off IMS sign-in, no-op with a warning if IMS isn't present. */
export const signIn = (options: object = {}): void => {
  if (typeof window.adobeIMS?.signIn !== 'function') {
    lanaLog('IMS signIn method not available', 'gnav-profile', 'i');
    return;
  }
  window.adobeIMS.signIn(options);
};

/** ietf locale -> language code, with milo's `no-NO` -> `nb` special case. */
export const getLanguage = (ietfLocale = ''): string => {
  if (ietfLocale.length === 0) return 'en';
  const nonStandardLocaleMap: Record<string, string> = { 'no-NO': 'nb' };
  return nonStandardLocaleMap[ietfLocale] ?? ietfLocale.split('-')[0];
};

const DEFAULT_SERVICE_URLS: Record<string, string> = {
  adminconsole: 'https://adminconsole.adobe.com',
  account: 'https://account.adobe.com',
};

/**
 * Builds an account / adminconsole URL, overriding the hostname from
 * `MiloConfig.env` when present. Faithful to milo's `decorateProfileLink`.
 */
export const decorateProfileLink = (
  service: 'account' | 'adminconsole',
  path = '',
): string => {
  const base = DEFAULT_SERVICE_URLS[service];
  if (base === undefined) return '';

  let host: string | undefined;
  try {
    host = getMiloConfig().env?.[service];
  } catch {
    host = undefined;
  }

  if (host === undefined || host === '') return `${base}${path}`;

  const url = new URL(base);
  url.hostname = host;
  return `${url.toString()}${path}`;
};

/** Truncates the username/domain of an email to 12 chars, preserving TLD. */
export const decorateEmail = (email = ''): string => {
  const maxCharacters = 12;
  const emailParts = email.split('@');
  const localPart = emailParts[0] ?? '';
  const username = localPart.length <= maxCharacters
    ? localPart
    : `${localPart.slice(0, maxCharacters)}…`;
  const domainArr = (emailParts[1] ?? '').split('.');
  const tld = domainArr.pop() ?? '';
  const domainName = domainArr.join('.');
  const domain = domainName.length <= maxCharacters
    ? domainName
    : `${domainName.slice(0, maxCharacters)}…`;
  return `${username}@${domain}.${tld}`;
};

/**
 * Clears the domain-scoped account cookies that must not outlive sign-out.
 * Scoped to adobe.com like milo's implementation.
 */
export const clearSignOutCookies = (): void => {
  const { host } = window.location;
  if (host !== 'adobe.com' && !host.endsWith('.adobe.com')) return;
  const labels = host.split('.');
  ['ims_country_code', 'acomsis', 'acomsis_stage'].forEach((name) => {
    const base = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    for (let i = 0; i < labels.length - 1; i += 1) {
      document.cookie = `${base}domain=${labels.slice(i).join('.')};`;
    }
  });
};

/** Whether the user administers any relevant org (shows "Admin Console"). */
export const getOrgFlags = (
  organizations: Organizations | null | undefined,
): { hasOrgs: boolean } => {
  const ORG_TYPE_CCT = 'DIRECT';
  const ORG_TYPE_CCE = 'Enterprise';
  const ORG_TYPE_CCE_DEPR = 'INDIRECT';
  const ROLE_ADMIN = 'GRP_ADMIN';

  const orgs = organizations?.organizations ?? [];
  const relevantOrgs = orgs.filter(
    (org) => org.orgType === ORG_TYPE_CCT
      || org.orgType === ORG_TYPE_CCE
      || org.orgType === ORG_TYPE_CCE_DEPR,
  );
  const showTeam = relevantOrgs.some(
    (org) => org.orgType === ORG_TYPE_CCT
      && (org.groups?.some((g) => g.role === ROLE_ADMIN) ?? false),
  );
  const showEnterprise = relevantOrgs.some(
    (org) => (org.orgType === ORG_TYPE_CCE || org.orgType === ORG_TYPE_CCE_DEPR)
      && (org.groups?.some((g) => g.role === ROLE_ADMIN) ?? false),
  );
  return { hasOrgs: showTeam || showEnterprise };
};

/** Resolves profile labels from the placeholders map (federal reads sync). */
export const getProfileLabels = (
  placeholders: Map<string, string>,
): ProfileLabels => ({
  signIn: placeholders.get('sign-in') ?? 'Sign in',
  profileButton: placeholders.get('profile-button') ?? 'Profile',
  profileAvatar: placeholders.get('profile-avatar') ?? 'Profile avatar',
  signOut: placeholders.get('sign-out') ?? 'Sign out',
  viewAccount: placeholders.get('view-account') ?? 'View account',
  goToAdminConsole: placeholders.get('go-to-admin-console') ?? 'Go to Admin Console',
});
