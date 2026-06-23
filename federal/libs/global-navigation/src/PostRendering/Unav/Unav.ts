/**
 * Universal Navigation (UNAV) - Barrel Export
 * Public API for UNAV functionality
 * 
 * This module serves as the single entry point for all UNAV-related imports.
 * It re-exports types, utilities, configuration, and loader functions.
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Configuration types
  UnavConfig,
  UnavChildren,
  UnavComponent,
  UnavComponents,
  
  // Component types
  AppSwitcher,
  Profile,
  Notifications,
  Help,
  Cart,
  Jarvis,
  HelpItem,
  
  // Analytics types
  AnalyticsContext,
  
  // Window augmentation types
  WindowWithAdobeId,
  WindowWithUniversalNav,
  WindowWithAlloy,
  AlloyIdentityData,
  
  // User types
  UserProfile,
  SignInCtaStyle,
  AccountMenuEventDetail,
} from './Unav.types';

// ============================================================================
// Utility Exports
// ============================================================================

export {
  // State management
  setUserProfile,
  getUserProfile,
  
  // Width calculation
  getUnavWidthCSS,
  
  // Locale handling
  getUniversalNavLocale,
  
  // Device detection
  getDevice,
  
  // Analytics
  getVisitorGuid,
  
  // Constants
  SIGNED_OUT_ICONS,
  LANGMAP,
} from './Unav.utils';

// ============================================================================
// Configuration Exports
// ============================================================================

export { getUnavComponents } from './Unav.config';

// ============================================================================
// Loader Exports
// ============================================================================

export { loadUnav } from './Unav.loader';
export type { Unav } from './Unav.loader';


