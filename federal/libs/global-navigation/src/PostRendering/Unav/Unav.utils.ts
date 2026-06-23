/**
 * Utility functions for Universal Navigation (UNAV)
 * Contains pure functions and state management for UNAV functionality
 */

import { getMiloConfig } from '../../Utils/Utils';
import type {
  UserProfile,
  UnavConfig,
  AlloyIdentityData,
  WindowWithAlloy,
} from './Unav.types';

// ============================================================================
// Constants
// ============================================================================

/**
 * Components visible to signed-out users
 */
export const SIGNED_OUT_ICONS = ['appswitcher', 'help'];

/** Timeout in ms before profile resolution falls back to an empty profile */
const PROFILE_RESOLUTION_TIMEOUT_MS = 5000;

/** Width in px of the sign-in button used for UNAV
 *  container min-width calculation */
const SIGN_IN_BUTTON_WIDTH_PX = 92;

/**
 * Language to country code mapping for locale normalization
 */
export const LANGMAP = {
  cs: ['cz'],
  da: ['dk'],
  de: ['at'],
  en: ['africa', 'au', 'ca', 'ie', 'in', 'mt', 'ng', 'nz', 'sg', 'za'],
  es: ['ar', 'cl', 'co', 'cr', 'ec', 'gt', 'la', 'mx', 'pe', 'pr'],
  et: ['ee'],
  ja: ['jp'],
  ko: ['kr'],
  nb: ['no'],
  pt: ['br'],
  sl: ['si'],
  sv: ['se'],
  uk: ['ua'],
  zh: ['cn', 'tw'],
};

// ============================================================================
// Profile State Management
// ============================================================================

/**
 * Profile state management using closure pattern
 * Provides async access to user profile with 5-second timeout fallback
 * @returns Tuple of [setter, getter] functions
 */
export const [setUserProfile, getUserProfile] = ((): [
  (data: UserProfile) => void,
  () => Promise<UserProfile>
] => {
  let profileData: UserProfile | undefined;
  let profileResolve: ((value: UserProfile) => void) | undefined;
  let profileTimeout: ReturnType<typeof setTimeout> | undefined;

  const profilePromise = new Promise<UserProfile>((resolve) => {
    profileResolve = resolve;

    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, PROFILE_RESOLUTION_TIMEOUT_MS);
  });

  return [
    (data: UserProfile): void => {
      if (profileData === undefined) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve?.(profileData);
      }
    },
    (): Promise<UserProfile> => profilePromise,
  ];
})();

// ============================================================================
// Component Visibility
// ============================================================================

/**
 * Returns true when the `uc_carts` cookie is present, gating the cart icon.
 */
export const isCartEnabled = (): boolean => /uc_carts=/.test(document.cookie);

/**
 * Filters the meta-tag component list down to the entries that UNAV will
 * actually render, applying the same rules used for the CLS width calc:
 *
 *  - `cart` is removed unless the `uc_carts` cookie is set. When the cookie
 *    is set, `cart` is visible in BOTH signed-in and signed-out states.
 *  - when signed out, every other icon is replaced by the sign-in CTA except
 *    the icons in {@link SIGNED_OUT_ICONS} and the `signup` profile-modifier
 *    flag, which are kept.
 *
 * Profile is intentionally NOT in this list: it is always rendered (as the
 * profile menu when signed-in or as the sign-in CTA when signed-out) and is
 * added unconditionally by the loader.
 *
 * @param unavComponents - Raw component names parsed from the meta tag
 * @param signedOut - Whether the user is signed out
 * @returns The filtered list of components that should be rendered
 */
export const getVisibleUnavComponents = (
  unavComponents: string[] | null | undefined,
  signedOut: boolean
): string[] => {
  const list = unavComponents ?? [];
  const cartFiltered = isCartEnabled()
    ? list
    : list.filter((c) => c !== 'cart');
  if (signedOut) {
    // Note: `cart` survives this filter when uc_carts is set because the cart
    // is available in both signed-in and signed-out states.
    return cartFiltered.filter(
      (c) => SIGNED_OUT_ICONS.includes(c) || c === 'cart' || c === 'signup'
    );
  }
  return cartFiltered;
};

// ============================================================================
// Width Calculation
// ============================================================================

/**
 * Calculates minimum width CSS value for UNAV container
 * Prevents layout shift during initialization by pre-calculating required space
 *
 * @param unavComponents - Array of component names to display
 * @param signedOut - Whether user is signed out (affects button display)
 * @returns CSS calc() string for min-width property
 */
export function getUnavWidthCSS(
  unavComponents: string[],
  signedOut: boolean = false
): string {
  const iconWidth = 32; // px
  const flexGap = 0.25; // rem
  const sectionDividerMargin = 4; // px (left and right margins)

  // Read section divider preference from MiloConfig, gracefully tolerating
  // the case where the config has not been initialised yet (e.g. in tests).
  let sectionDivider = false;
  try {
    sectionDivider = getMiloConfig()?.unav?.showSectionDivider === true;
  } catch {
    sectionDivider = false;
  }

  const dividerCss = sectionDivider
    ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem`
    : '';

  if (signedOut) {
    // Signed-out: every visible icon contributes one slot (appswitcher, help,
    // and cart when uc_carts is set). Profile becomes the sign-in CTA whose
    // width is accounted for separately via SIGN_IN_BUTTON_WIDTH_PX. `signup`
    // is a profile-modifier flag — not a rendered icon — so it's excluded.
    const l = getVisibleUnavComponents(unavComponents, true)
      .filter((c) => c !== 'signup')
      .length;
    return `calc(${SIGN_IN_BUTTON_WIDTH_PX}px + ${l * iconWidth}px + ${l * flexGap}rem${dividerCss})`;
  }

  // Signed-in: every visible component contributes one icon slot
  const n = getVisibleUnavComponents(unavComponents, false).length;
  return `calc(${n * iconWidth}px + ${(n - 1) * flexGap}rem${dividerCss})`;
}

// ============================================================================
// Locale Handling
// ============================================================================

/**
 * Normalizes locale prefix to Universal Nav format (lang_COUNTRY)
 * Handles special cases and country-to-language mappings
 *
 * @param locale - Locale object with prefix property
 * @returns Normalized locale string (e.g., 'en_US', 'fr_FR')
 */
export const getUniversalNavLocale = (locale: { prefix: string }): string => {
  if (!locale.prefix || locale.prefix === '/') return 'en_US';

  const prefix = locale.prefix.replace('/', '');

  // Handle already formatted locales (e.g., 'en_us' or 'en_US')
  if (prefix.includes('_')) {
    const [lang, country] = prefix.split('_').reverse();
    return `${lang.toLowerCase()}_${country.toUpperCase()}`;
  }

  // Special case: UK should map to en_GB
  if (prefix === 'uk') return 'en_GB';

  // Check if country code needs language mapping (e.g., 'dk' -> 'da_DK')
  const customLang = (Object.keys(LANGMAP) as Array<keyof typeof LANGMAP>).find(
    (key) => LANGMAP[key].includes(prefix as never)
  );
  if (customLang) return `${customLang.toLowerCase()}_${prefix.toUpperCase()}`;

  // Default: use prefix as both language and country (e.g., 'fr' -> 'fr_FR')
  return `${prefix.toLowerCase()}_${prefix.toUpperCase()}`;
};

// ============================================================================
// Device Detection
// ============================================================================

/**
 * OS detection mapping for user agent strings
 */
const OS_MAP = {
  Mac: 'macOS',
  Win: 'windows',
  Linux: 'linux',
  CrOS: 'chromeOS',
  Android: 'android',
  iPad: 'iPadOS',
  iPhone: 'iOS',
};

/**
 * Detects device OS from user agent string
 * @returns OS identifier for analytics context
 */
export const getDevice = (): UnavConfig['analyticsContext']['consumer']['device'] => {
  const agent = navigator.userAgent;
  for (const [os, osName] of Object.entries(OS_MAP)) {
    if (agent.includes(os)) {
      return osName as UnavConfig['analyticsContext']['consumer']['device'];
    }
  }
  return 'linux';
};

// ============================================================================
// Analytics Integration
// ============================================================================

/**
 * Retrieves visitor GUID from Adobe Alloy SDK
 * Used for analytics tracking and user identification
 *
 * @returns Promise resolving to ECID or undefined if unavailable
 */
export const getVisitorGuid = async (): Promise<string | undefined> => {
  const windowWithAlloy = window as WindowWithAlloy;
  if (typeof windowWithAlloy.alloy !== 'function') {
    return undefined;
  }
  return windowWithAlloy.alloy('getIdentity')
    .then((data: AlloyIdentityData) => data?.identity?.ECID)
    .catch(() => undefined);
};
