/**
 * Window augmentations for Adobe ecosystem APIs
 * 
 * These Window properties are set by Adobe's CDN-loaded libraries:
 * - adobeIMS: Identity Management System
 * - adobeid: IMS client configuration
 * - adobeProfile: User profile service
 * - alloy: Adobe Experience Platform Web SDK
 * - UniversalNav: Universal Navigation component
 * 
 * Used across: UNAV, Profile, Theme management, Analytics
 */

import type { AlloyIdentityData, UnavConfig } from '../PostRendering/Unav/Unav.types';
import { Lana } from '../Utils/Log';

declare global {
  interface Window {
    /** User Profile Service */
    adobeProfile?: {
      getUserProfile: () => Promise<unknown>;
    };
    
    /** Adobe Identity Management System */
    adobeIMS?: {
      signIn: (context: object) => void;
      isSignedInUser: () => boolean;
    };
    
    /** IMS Client Configuration */
    adobeid?: {
      client_id?: string;
    };
    
    /** Adobe Experience Platform Web SDK (Alloy) */
    alloy?: (command: string) => Promise<AlloyIdentityData>;

    lana?: Lana;
    
    /** Universal Navigation Component */
    UniversalNav?: {
      (config: UnavConfig): Promise<void>;
      reload: (config: UnavConfig) => void;
      changeTheme?: (theme: 'light' | 'dark') => void;
    };
  }
}

export {};
