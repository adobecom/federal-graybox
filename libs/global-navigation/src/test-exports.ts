// Test exports - exports components and utilities for testing
export { parseLinkGroup } from './Components/LinkGroup/Parse';
export { linkGroup } from './Components/LinkGroup/Render';
export { IrrecoverableError, RecoverableError } from './Error/Error';
export { parseLink } from './Components/Link/Parse';
export type { LinkGroup, LinkGroupHeader, LinkGroupLink, LinkGroupBlue } from './Components/LinkGroup/Parse';
export type { Link } from './Components/Link/Parse';
export { parseBrand } from './Components/Brand/Parse';
export { brand } from './Components/Brand/Render';

// Utils exports for testing
export { setMiloConfig, getMiloConfig, getMetadata, loadScript, loadStyles } from './Utils/Utils';
export type { MiloConfig } from './Utils/Utils';

// UNAV test exports
export {
  getUnavWidthCSS,
  getUniversalNavLocale,
  getDevice,
  getVisitorGuid,
  setUserProfile,
  getUserProfile,
  SIGNED_OUT_ICONS,
  LANGMAP,
} from './PostRendering/Unav/Unav.utils';
export { getUnavComponents } from './PostRendering/Unav/Unav.config';
export { loadUnav } from './PostRendering/Unav/Unav.loader';
export type { Unav } from './PostRendering/Unav/Unav.loader';

// Keyboard navigation
export { initKeyboardNav } from './PostRendering/Keyboard';
