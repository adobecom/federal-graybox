/**
 * Type definitions for Universal Navigation (UNAV) implementation
 * Consolidates all UNAV-related types and interfaces
 * 
 * NOTE: Window augmentations moved to src/types/adobe-window.d.ts
 * for cross-module access (theme switching, analytics, etc.)
 */

// ============================================================================
// Window Type Helpers
// ============================================================================

export type WindowWithAdobeId = Window & {
  adobeid: {
    client_id: string;
  };
};

export type WindowWithUniversalNav = Window & {
  UniversalNav: {
    (config: UnavConfig): Promise<void>;
    reload: (config: UnavConfig) => void;
  };
};

export type WindowWithAlloy = Window & {
  alloy: (command: string) => Promise<AlloyIdentityData>;
};

// ============================================================================
// User Profile Types
// ============================================================================

export type UserProfile = {
  [key: string]: unknown;
};

// ============================================================================
// Alloy Identity Types
// ============================================================================

export type AlloyIdentityData = {
  identity?: {
    ECID?: string;
  };
};

// ============================================================================
// UNAV Configuration Types
// ============================================================================

export type UnavConfig = {
  target: HTMLElement;
  env: 'stage' | 'prod';
  analyticsContext: AnalyticsContext;
  theme: 'light' | 'dark';
  locale: string;
  countryCode: string;
  children: UnavChildren;
  imsClientId: string | undefined;
  isSectionDividerRequired?: boolean;
  clientAppName?: string;
  mode?: string;
  showTrayExperience?: boolean;
};

export type UnavChildren = UnavComponent[];

// ============================================================================
// Component Types
// ============================================================================

export type UnavComponent
  = AppSwitcher
  | Help
  | Profile
  | Notifications
  | Cart
  | Jarvis;

export type AppSwitcher = {
  name: 'app-switcher';
  attributes?: unknown;
};

export type Profile = {
  name: 'profile';
  attributes: {
    accountMenuContext: {
      sharedContextConfig: {
        enableLocalSection: boolean;
        enableProfileSwitcher: boolean;
        miniAppContext: {
          logger: {
            trace: (_: string) => void;
            debug: (_: string) => void;
            info: (_: string) => void;
            warn: (_: string) => void;
            error: (_: string) => void;
          };
        };
        complexConfig: Record<string, any> | null;
      };
      messageEventListener: (_: CustomEvent<AccountMenuEventDetail>) => void;
    };
    isSignUpRequired: boolean;
    signInCtaStyle?: SignInCtaStyle;
    callbacks: {
      onSignIn: () => void;
      onSignUp: () => void;
    };
  };
};

export type SignInCtaStyle = 'primary' | 'secondary';

export type AccountMenuEventDetail = {
  name: string;
  payload: { subType: 'AppInitiated' | 'SignOut' | 'ProfileSwitch' };
  executeDefaultAction: () => Promise<unknown>;
};

export type Notifications = {
  name: 'notifications';
  attributes: {
    notificationsConfig: {
      applicationContext: {
        appID: string;
        hostCallBackFn?: () => void;
      };
    };
  };
};

export type Help = {
  name: 'help';
  attributes: {
    children: HelpItem[];
  };
};

export type HelpItem
  = { type: 'Support' }
  | { type: 'Community' }
  | { type: 'Jarvis' }
  | { type: string }
  | {
      title: string;
      onAction?: () => void;
      analyticsIdentifier: string;
    };

export type Cart = {
  name: 'cart';
};

export type Jarvis = {
  name: 'jarvis';
  attributes?: {
    appid: string | undefined;
    callbacks: unknown;
  };
};

// ============================================================================
// Analytics Types
// ============================================================================

export type AnalyticsContext = {
  disableEvents?: boolean;
  consumer: {
    name: string;
    version: string;
    platform: 'Web' | 'Desktop' | 'Mobile';
    app_store_id?: string;
    device: 'macOS' | 'windows' | 'linux' | 'chromeOS' | 'android' | 'iOS' | 'iPadOS' | 'na';
    os_version: string;
  };
  event: {
    visitor_guid: string | undefined;
  };
};

// ============================================================================
// Component Configuration Types
// ============================================================================

export type UnavComponents = {
  [key: string]: UnavComponent;
};
