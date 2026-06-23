/**
 * UNAV Loader - Initialization and lifecycle management
 * Orchestrates UNAV initialization lifecycle.
 */

import { RecoverableError } from '../../Error/Error';
import {
  loadScript,
  loadStyles,
  isDesktop,
  getMiloConfig,
  getMiloLocaleSettings,
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
} from './Unav.utils';
import { getUnavComponents } from './Unav.config';

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

    const locale = getUniversalNavLocale(config.locale);
    const environment = config.env.name === 'prod' ? 'prod' : 'stage';

    // Fetch visitor GUID for analytics
    const visitorGuid = await getVisitorGuid();

    // ========================================================================
    // Step 5: Load UNAV assets from CDN
    // ========================================================================
    
    // Get version from URL parameter or use default
    let unavVersion: string | null = new URLSearchParams(
      window.location.search
    ).get('unavVersion');

    // Validate version format (e.g., '1.5' or '2')
    if (!/^\d+(\.\d+)?$/.test(unavVersion ?? '')) {
      unavVersion = '1.5';
    }

    // Load JS and CSS in parallel
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
