/**
 * Component configuration factory for Universal Navigation (UNAV)
 * Defines the structure and behavior of UNAV components
 */

import type {
  UnavComponents,
  AccountMenuEventDetail,
  UserProfile,
  HelpItem,
} from './Unav.types';
import { setUserProfile } from './Unav.utils';
import { getMiloConfig, getMetadata, isBEEnabled } from '../../Utils/Utils';

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Context identifier for Adobe IMS sign-in
 * Retrieved from MiloConfig if provided, otherwise empty object
 */
const getSignInContext = (): object => {
  try {
    const config = getMiloConfig();
    return config.signInContext || {};
  } catch {
    return {};
  }
};

/**
 * Determines the sign-in CTA button style (primary or secondary)
 * Checks metadata tag first, then falls back to config
 * @returns 'primary' or 'secondary' button style
 */
const getSignInCtaStyle = (): 'primary' | 'secondary' => {
  const config = getMiloConfig();
  const isPrimary = (
    getMetadata('signin-cta-style') === 'primary'
    || config?.unav?.profile?.signInCtaStyle === 'primary'
  );
  return isPrimary ? 'primary' : 'secondary';
};

/**
 * Returns message event listener for profile component
 * Uses custom listener from config if provided,
 * otherwise returns default listener.
 * 
 * Default listener handles:
 * - AppInitiated: Fetches and sets user profile data
 * - SignOut: Executes default sign-out action
 * - ProfileSwitch: Reloads page after profile switch
 * 
 * @returns Event listener function for CustomEvent<AccountMenuEventDetail>
 */
const getMessageEventListener = (): ((
  event: CustomEvent<AccountMenuEventDetail>
) => void) => {
  const config = getMiloConfig();
  const configListener = config?.unav?.profile?.messageEventListener;
  if (configListener) return configListener;

  return (event: CustomEvent<AccountMenuEventDetail>) => {
    const { name, payload, executeDefaultAction } = event.detail;
    if (name !== 'System' || typeof executeDefaultAction !== 'function') return;
    switch (payload.subType) {
      case 'AppInitiated':
        window.adobeProfile?.getUserProfile()
          .then((data) => { setUserProfile(data as UserProfile); })
          .catch(() => { setUserProfile({}); });
        break;
      case 'SignOut':
        executeDefaultAction();
        break;
      case 'ProfileSwitch':
        Promise.resolve(executeDefaultAction()).then((profile) => {
          if (profile !== null && profile !== undefined) {
            window.location.reload();
          }
        });
        break;
      default:
        break;
    }
  };
};

/**
 * Returns help component children from config or default fallback
 * @returns Array of help items (Support and Community by default)
 */
function getHelpChildren(): HelpItem[] {
  const { unav } = getMiloConfig();
  return unav?.unavHelpChildren || ([
    { type: 'Support' },
    { type: 'Community' },
  ] as HelpItem[]);
}

// ============================================================================
// Component Configuration
// ============================================================================

/**
 * Factory function that returns UNAV component configurations
 * Each component is configured with its attributes and behaviors
 * 
 * @returns Object mapping component names to their configurations
 */
export const getUnavComponents = (): UnavComponents => {
  const config = getMiloConfig();
  const beEnabled = isBEEnabled();
  const uncAppId = config?.unav?.uncAppId;
  return {
    profile: {
      name: 'profile',
      attributes: {
        accountMenuContext: {
          sharedContextConfig: {
            enableLocalSection: true,
            enableProfileSwitcher: true,
            miniAppContext: {
              ...(beEnabled && {
                enableManagePeople:
                  config?.unav?.profile?.enableManagePeople ?? true,
              }),
              logger: {
                trace: (): void => {},
                debug: (): void => {},
                info: (): void => {},
                // TODO: Integrate with lanaLog for proper logging
                // warn: (e) => lanaLog({
                //   message: 'Profile Menu warning',
                //   e,
                //   tags: 'universalnav,warn',
                // }),
                // error: (e) => lanaLog({
                //   message: 'Profile Menu error',
                //   e,
                //   tags: 'universalnav',
                //   errorType: 'e',
                // }),
                warn: (): void => {},
                error: (): void => {},
              },
            },
            ...(beEnabled && {
              managePeopleConfig: {
                enableWorkflow: true,
                params: {
                  enableinlineoverlay: 's2-compat',
                },
                ...config?.unav?.profile?.managePeopleConfig,
              },
            }),
            complexConfig: config?.unav?.profile?.complexConfig || null,
            ...config?.unav?.profile?.config,
          },
          messageEventListener: getMessageEventListener(),
        },
        // UNav 1.5 supports primary/secondary signIn CTA styles.
        // 'primary' means signIn is primary and signUp is secondary.
        signInCtaStyle: getSignInCtaStyle(),
        isSignUpRequired: false,
        callbacks: {
          onSignIn: (): void => {
            window.adobeIMS?.signIn(getSignInContext());
          },
          onSignUp: (): void => {
            window.adobeIMS?.signIn(getSignInContext());
          },
        },
      },
    },

    appswitcher: {
      name: 'app-switcher',
    },

    notifications: {
      name: 'notifications',
      attributes: {
        notificationsConfig: {
          applicationContext: {
            appID: uncAppId !== undefined && uncAppId !== ''
              ? uncAppId
              : 'adobecom',
            ...config?.unav?.uncConfig,
          },
        },
      },
    },

    help: {
      name: 'help',
      attributes: {
        children: getHelpChildren(),
      },
    },

    jarvis: {
      name: 'jarvis',
      attributes: {
        appid: config?.jarvis?.id,
        callbacks: config?.jarvis?.callbacks,
      },
    },

    cart: {
      name: 'cart',
    },
  };
};
