import { getMiloConfig, isMasLink } from '../Utils/Utils';
import { RecoverableError } from '../Error/Error';

type MerchModule = {
  default?: (link: HTMLAnchorElement) => void;
};

/**
 * Loads the relevant Milo commerce block for each link in the nav:
 * - `a.merch` (OST / miniplans): Milo `merch` block
 * - `mas.adobe.com` studio links: Milo `merch-card-autoblock` block
 * @param mountpoint - The global navigation container element
 * @returns Set of RecoverableErrors encountered during initialization
 */
export const initMerchLinks = async (
  mountpoint: HTMLElement
): Promise<Set<RecoverableError>> => {
  const errors = new Set<RecoverableError>();
  const merchLinks = mountpoint.querySelectorAll<HTMLAnchorElement>('a.merch');
  const masLinks = [...mountpoint.querySelectorAll<HTMLAnchorElement>('a[href]')]
    .filter((link) => isMasLink(link.href));

  if (merchLinks.length === 0 && masLinks.length === 0) return errors;

  try {
    const config = getMiloConfig();
    const { base } = config;

    if (base === '') {
      errors.add(
        new RecoverableError(
          'base not found in config, cannot initialize merch links'
        )
      );
      return errors;
    }

    // OST / miniplans links: Milo `merch` block
    if (merchLinks.length > 0) {
      const merchModule = await import(
        `${base}/blocks/merch/merch.js`
      ) as MerchModule;
      const decorateMerchLink = merchModule.default;
      if (decorateMerchLink === undefined) {
        errors.add(new RecoverableError('decorateMerchLink not found in merch module'));
      } else {
        merchLinks.forEach((link) => { decorateMerchLink(link); });
      }
    }

    // mas.adobe.com studio links: Milo `merch-card-autoblock` block
    if (masLinks.length > 0) {
      const masModule = await import(
        `${base}/blocks/merch-card-autoblock/merch-card-autoblock.js`
      ) as MerchModule;
      const decorateMasLink = masModule.default;
      if (decorateMasLink === undefined) {
        errors.add(new RecoverableError('default export not found in merch-card-autoblock module'));
      } else {
        masLinks.forEach((link) => { decorateMasLink(link); });
      }
    }
  } catch (error) {
    errors.add(new RecoverableError(`Error initializing merch links: ${error}`));
  }

  return errors;
};