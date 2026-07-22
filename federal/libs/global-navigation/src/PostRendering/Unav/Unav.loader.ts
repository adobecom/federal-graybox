/**
 * UNAV Loader - Initialization and lifecycle management
 * Orchestrates UNAV initialization lifecycle.
 */

import { RecoverableError } from '../../Error/Error';
import { lanaLog } from '../../Utils/Log';
import {
  loadScript,
  loadStyles,
  isDesktop,
  getMiloConfig,
  getMiloLocaleSettings,
  getLingoLocaleConfig,
  isBEEnabled,
  MiloConfig
} from '../../Utils/Utils';
import type {
  UnavConfig,
  UnavChildren,
  WindowWithAdobeId,
} from './Unav.types';
import {
  getUnavWidthCSS,
  getVisibleUnavComponents,
  getVisitorGuid,
  getDevice,
  getUniversalNavLocale,
  showAupDialog,
} from './Unav.utils';
import { getUnavComponents } from './Unav.config';

// ============================================================================
// Constants
// ============================================================================

const AUP_SDK_VERSION = '1.0.756';

// ============================================================================
// AUP SDK eager initialization
// ============================================================================

/**
 * Module-scoped single-flight promise for AUP SDK readiness.
 *
 * Kicked off from main() at IMS-ready time so script load + preloadSDK +
 * updateConfig run in parallel with gnav fetch/parse/render and the
 * UniversalNav.js download, instead of blocking inside Unav-Time.
 */
let aupSdkPromise: Promise<unknown> | undefined;

/**
 * Starts AUP SDK initialization if it hasn't been started yet.
 *
 * Safe to call multiple times. Intentionally bails (without setting the
 * promise) when prerequisites aren't met — signed-out, MiloConfig not ready,
 * or ARP disabled — so a later call can retry. The defensive call inside
 * loadUnav() covers the late-IMS case.
 */
export const preloadAupSdk = (): void => {
  if (aupSdkPromise) return;

  if (window.adobeIMS?.isSignedInUser() !== true) return;

  let config: MiloConfig;
  try {
    config = getMiloConfig();
  } catch (_error) {
    return;
  }

  const isArpEnabled = config?.unav?.isArpEnabled ?? true;
  if (!isArpEnabled) return;

  const environment = config.env.name === 'prod' ? 'prod' : 'stage';
  const clientId = (window as WindowWithAdobeId)?.adobeid?.client_id;
  const beEnabled = isBEEnabled();

  const aupHost = environment === 'prod'
  ? 'shared-components.adobe.com'
  : `shared-components.${environment}.adobe.com`;

  aupSdkPromise = loadScript(
    `https://${aupHost}/aup-sdk/${AUP_SDK_VERSION}/main.js`,
    undefined,
    { mode: 'async' },
  ).then(async (): Promise<unknown> => {
    window.aupsdk = window.aupsdk ?? await window.AUPSDK?.preloadSDK('adobe-com-stable', {
      appId: 'adobe_com',
      apiKey: clientId,
      getAccessToken: (): Promise<string | undefined> =>
        Promise.resolve(window.adobeIMS?.getAccessToken()?.token),
      getProfile: () => Promise.resolve(window.adobeIMS?.getProfile()),
      environment,
      cdnEnvironment: environment,
      locale: getLingoLocaleConfig()?.ietf
        ?? config?.locale?.ietf
        ?? 'en-US',
      appName: 'adobecom',
      appVersion: '1.0',
      colorScheme: 'light',
      ...(beEnabled && { showDialog: showAupDialog }),
    });
    if (beEnabled) {
      await window.aupsdk?.updateConfig({ miniAppContext: { features: ['useToasts'] } });
    }
    return window.aupsdk;
  });

  // Suppress unhandled-rejection noise without losing the rejection for the
  // real consumer (fetchAUPSDKInstance → UNav). Attaching a no-op .catch
  // marks the rejection handled while leaving aupSdkPromise itself rejected.
  aupSdkPromise.catch((): void => {});
};

/** Returns the in-flight or resolved AUP SDK promise, if any. */
export const getAupSdkInstance = (): Promise<unknown> | undefined =>
  aupSdkPromise;

/** Test-only: resets cached promise and window state. */
export const __resetAupSdkForTests = (): void => {
  aupSdkPromise = undefined;
  delete window.aupsdk;
};

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for successful UNAV initialization
 */
export type Unav = {
  reloadUnav: (_?: UnavConfig) => void;
  errors: Set<RecoverableError>;
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sets the isSignUpRequired flag on the profile component
 * @param children - Array of UNAV components with profile as first element
 * @param value - Boolean value to set for isSignUpRequired
 */
const setProfileSignUpRequired = (
  children: UnavChildren,
  value: boolean
): void => {
  const profileChild = children[0];
  if (profileChild === undefined) {
    return;
  }
  if (!('attributes' in profileChild)) {
    return;
  }
  const { attributes } = profileChild;
  if (attributes === undefined || attributes === null) {
    return;
  }
  if (typeof attributes !== 'object' || !('isSignUpRequired' in attributes)) {
    return;
  }
  (attributes as { isSignUpRequired: boolean }).isSignUpRequired = value;
};

// ============================================================================
// UNAV Loader
// ============================================================================

/**
 * Loads and initializes Universal Navigation
 * 
 * This is the main orchestration function that:
 * 1. Validates the container element exists
 * 2. Parses configuration from meta tags
 * 3. Loads external UNAV assets from CDN
 * 4. Builds component configuration
 * 5. Initializes UNAV with proper context
 * 6. Sets up responsive listeners
 * 
 * @param nav - Navigation element containing .feds-utilities container
 * @param _config - Optional partial configuration override (not currently used)
 * @returns Promise resolving to Unav object or RecoverableError
 */
export const loadUnav = async (
  nav: HTMLElement,
  _config?: Partial<UnavConfig>
): Promise<Unav | RecoverableError> => {
  try {
    // ========================================================================
    // Step 1: Validate container exists
    // ========================================================================
    const utilitiesContainer = nav.querySelector('.feds-utilities');
    if (!(utilitiesContainer instanceof HTMLElement)) {
      return new RecoverableError('missing ".feds-utilities" container');
    }

    const errors = new Set<RecoverableError>();

    // ========================================================================
    // Step 2: Parse meta tag configuration
    // ========================================================================
    const meta = document.head.querySelector('meta[name="universal-nav"]');
    const rawValue = meta instanceof HTMLMetaElement ? meta.content ?? '' : '';

    if (!(meta instanceof HTMLMetaElement)) {
      errors.add(new RecoverableError('metadata "universal-nav" is missing'));
    }

    const trimmedValue = rawValue.trim();
    if (meta instanceof HTMLMetaElement && trimmedValue.length === 0) {
      errors.add(new RecoverableError('metadata "universal-nav" has no value'));
    }

    // ========================================================================
    // Step 3: Check user authentication state
    // ========================================================================
    const signedOut = window.adobeIMS?.isSignedInUser() !== true;

    // Parse component list from meta tag
    const unavComponents = trimmedValue
      .split(',')
      .map((option) => option.trim())
      .filter(
        (component) =>
          Object.keys(getUnavComponents()).includes(component) ||
          component === 'signup'
      );

    // Apply visibility rules (uc_carts cookie + signed-out icon allowlist)
    // so the children array we pass to UniversalNav matches what gets rendered
    // and matches the width reserved for CLS prevention.
    const visibleComponents = getVisibleUnavComponents(
      unavComponents,
      signedOut
    );

    // Pre-calculate width for BOTH states to prevent layout shift while
    // UniversalNav boots. For signed-in users the constraint is removed
    // after init (Step 8) so the profile pill can size to the user's name;
    // for signed-out users it stays applied to anchor the sign-in CTA layout.
    const width = getUnavWidthCSS(unavComponents, signedOut);
    utilitiesContainer.style.setProperty('min-width', width);

    // ========================================================================
    // Step 4: Gather analytics and environment data
    // ========================================================================
    
    // Get configuration with error handling
    let config: MiloConfig;
    try {
      config = getMiloConfig();
    } catch (_error) {
      throw new Error('MiloConfig not available for UNAV initialization');
    }

    // Lingo ietf (e.g. 'fr-LU') overrides milo locale when provided.
    // UNav expects underscore form ('fr_LU'), so convert hyphens.
    const locale = getLingoLocaleConfig()?.ietf?.replace('-', '_')
      ?? getUniversalNavLocale(config.locale);
    const environment = config.env.name === 'prod' ? 'prod' : 'stage';

    // Fetch visitor GUID for analytics
    const visitorGuid = await getVisitorGuid();
    const isArpEnabled = config?.unav?.isArpEnabled ?? true;

    // ========================================================================
    // Step 5: Load UNAV assets from CDN
    // ========================================================================
    
    // Get version from URL parameter or use default
    let unavVersion: string | null = new URLSearchParams(
      window.location.search
    ).get('unavVersion');

    // Validate version format (e.g., '1.5' or '2')
    if (!/^\d+(\.\d+)?$/.test(unavVersion ?? '')) {
      unavVersion = '1.6';
    }

    // Defensive: covers the late-IMS case where main() bailed because
    // adobeIMS wasn't signed-in yet. Called before Promise.all so the AUP
    // script still races UniversalNav.js even in the fallback path.
    preloadAupSdk();

    // Load JS and CSS in parallel. AUP SDK was already kicked off above
    // (or from main() at IMS-ready time); see preloadAupSdk above.
    await Promise.all([
      loadScript(
        `https://${environment}.adobeccstatic.com/unav/${unavVersion}/UniversalNav.js`
      ),
      loadStyles(
        `https://${environment}.adobeccstatic.com/unav/${unavVersion}/UniversalNav.css`,
        true
      ),
    ]);

    // ========================================================================
    // Step 6: Build component children array
    // ========================================================================
    
    /**
     * Dynamically assembles child components based on meta tag configuration
     * Special handling for profile (always first) and signup
     * (which modifies profile).
     */
    const getChildren = (): UnavChildren => {
      const unavComponentsConfig = getUnavComponents();
      const children: UnavChildren = [unavComponentsConfig.profile];

      // Reset isSignUpRequired flag
      setProfileSignUpRequired(children, false);

      // Process each visible component (already filtered for uc_carts cookie
      // and, when signed-out, restricted to SIGNED_OUT_ICONS + signup modifier)
      visibleComponents.forEach((component: string) => {
        if (component === 'profile') return; // Already added

        if (component === 'signup') {
          // 'signup' modifies profile component instead of adding new one
          setProfileSignUpRequired(children, true);
          return;
        }

        // Add component if it exists in configuration
        const unavComponent = unavComponentsConfig[component];
        if (unavComponent !== undefined) {
          children.push(unavComponent);
        }
      });

      return children;
    };

    // ========================================================================
    // Step 7: Build UNAV configuration object
    // ========================================================================
    
    const getConfiguration = (): UnavConfig => ({
      target: utilitiesContainer,
      env: environment,
      locale,
      countryCode: getMiloLocaleSettings(config?.locale)?.country || 'US',
      imsClientId: (window as WindowWithAdobeId)?.adobeid?.client_id,
      theme: 'light', // TODO: Add toggle based on site theme
      analyticsContext: {
        consumer: {
          name: 'adobecom',
          version: '1.0',
          platform: 'Web',
          device: getDevice(),
          os_version: navigator.platform,
        },
        event: { visitor_guid: visitorGuid },
      },
      children: getChildren(),
      isSectionDividerRequired: config?.unav?.showSectionDivider === true,
      showTrayExperience: !isDesktop.matches,
      isArpEnabled,
      ...(isArpEnabled && {
        arpConfig: Promise.resolve({
          sessionId: visitorGuid,
          tokenCallback: (token: string): void => {
            window.adobeArp = window.adobeArp ?? {};
            window.adobeArp.sessionToken = token;
            window.dispatchEvent(new CustomEvent('arp:tokenReady', { detail: { token } }));
            const existingCustom =
              window.alloy_all?.data?._adobe_corpnew?.digitalData?.custom;
            window.alloy_all = {
              ...window.alloy_all,
              data: {
                ...window.alloy_all?.data,
                _adobe_corpnew: {
                  ...window.alloy_all?.data?._adobe_corpnew,
                  digitalData: {
                    ...window.alloy_all?.data?._adobe_corpnew?.digitalData,
                    custom: {
                      ...existingCustom,
                      arp_token: token,
                    },
                  },
                },
              },
            };
          },
          successCallback: (): void => {},
          errorCallback: (error: unknown): void => {
            lanaLog(`ARP error: ${String(error)}`, 'universalnav');
          },
          ...config?.unav?.arpConfig,
          metadata: {
            source: 'universal-navigation',
            version: unavVersion ?? '1.6',
            ...config?.unav?.arpConfig?.metadata,
          },
        }),
        ...(!signedOut && {
          fetchAUPSDKInstance: (): Promise<unknown> =>
            getAupSdkInstance() ?? Promise.resolve(undefined),
        }),
      }),
    });

    // ========================================================================
    // Step 8: Initialize UNAV
    // ========================================================================
    
    await window?.UniversalNav?.(getConfiguration());

    if (!signedOut) {
      // Remove min-width constraint for signed-in users (allow natural sizing)
      utilitiesContainer?.style.removeProperty('min-width');
    } else {
      // The pre-calculated min-width uses a fixed English button width and will
      // be too narrow for other locales. Override it once UNAV has injected its
      // DOM and the container has reached its true rendered width.
      const mo = new MutationObserver((_mutations, observer) => {
        if (!utilitiesContainer.querySelector('button, a[role="button"]')) return;
        observer.disconnect();
        requestAnimationFrame(() => {
          utilitiesContainer.style.removeProperty('min-width');
        });
      });
      mo.observe(utilitiesContainer, { childList: true, subtree: true });
    }

    // ========================================================================
    // Step 9: Setup responsive listeners
    // ========================================================================

    // Store reload function for responsive changes
    const reloadUnav = (_?: UnavConfig): void => {
      window?.UniversalNav?.reload(
        getConfiguration()
      );
    };
    
    // Reinitialize UNAV when viewport changes (desktop/mobile switch)
    isDesktop.addEventListener('change', () => {
      reloadUnav();
    });

    // ========================================================================
    // Return success with accumulated errors
    // ========================================================================
    
    return {
      reloadUnav,
      errors,
    };
  } catch (error) {
    // Catch any unexpected errors and return as RecoverableError
    const message =
      error instanceof Error ? error.message : 'failed to load universal nav';
    return new RecoverableError(message);
  }
};
