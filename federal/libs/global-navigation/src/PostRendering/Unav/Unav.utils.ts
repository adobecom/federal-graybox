/**
 * Utility functions for Universal Navigation (UNAV)
 * Contains pure functions and state management for UNAV functionality
 */

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
export const [setUserProfile, getUserProfile] = (() => {
  let profileData: UserProfile | undefined;
  let profileResolve: ((value: UserProfile) => void) | undefined;
  let profileTimeout: ReturnType<typeof setTimeout> | undefined;

  const profilePromise = new Promise<UserProfile>((resolve) => {
    profileResolve = resolve;

    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, 5000);
  });

  return [
    (data: UserProfile): void => {
      if (data && !profileData) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve?.(profileData);
      }
    },
    (): Promise<UserProfile> => profilePromise,
  ];
})();

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
  const sectionDivider = false; // hardcoded for now
  const sectionDividerMargin = 4; // px (left and right margins)
  const cartEnabled = /uc_carts=/.test(document.cookie);
  
  // Filter out cart if not enabled via cookie
  const components = (!cartEnabled 
    ? unavComponents?.filter((x) => x !== 'cart') 
    : unavComponents) ?? [];
  const n = components.length ?? 3;

  if (signedOut) {
    // Calculate width for signed-out state (fewer icons + sign-in button)
    const l = components.filter((c: string) => SIGNED_OUT_ICONS.includes(c)).length;
    const signInButton = 92; // px
    return `calc(${signInButton}px + ${l * iconWidth}px + ${l * flexGap}rem${
      sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ''
    })`;
  }

  // Calculate width for signed-in state (all icons)
  return `calc(${n * iconWidth}px + ${(n - 1) * flexGap}rem${
    sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ''
  })`;
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
  return windowWithAlloy.alloy
    ? await windowWithAlloy.alloy('getIdentity')
        .then((data: AlloyIdentityData) => data?.identity?.ECID)
        .catch(() => undefined)
    : undefined;
};
