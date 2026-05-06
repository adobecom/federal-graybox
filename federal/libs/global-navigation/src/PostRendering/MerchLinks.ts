import { getMiloConfig } from '../Utils/Utils';
import { RecoverableError } from '../Error/Error';

/**
 * Initializes merch links by loading/applying the Milo merch block
 * to all anchor tags with the `merch` class.
 * @param mountpoint - The global navigation container element
 * @returns Set of RecoverableErrors encountered during initialization
 */
export const initMerchLinks = async (
  mountpoint: HTMLElement
): Promise<Set<RecoverableError>> => {
  const errors = new Set<RecoverableError>();
  const merchLinks = mountpoint.querySelectorAll<HTMLAnchorElement>('a.merch');
  
  if (merchLinks.length === 0) return errors;

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

    // Dynamically import the merch module from Milo
    type MerchModule = {
      default?: (link: HTMLAnchorElement) => void;
    };
    const merchModule = await import(
      `${base}/blocks/merch/merch.js`
    ) as MerchModule;
    const decorateMerchLink = merchModule.default;

    if (decorateMerchLink === undefined) {
      errors.add(new RecoverableError('decorateMerchLink not found in merch module'));
      return errors;
    }

    // Apply merch decoration to each merch link
    merchLinks.forEach((link) => {
      decorateMerchLink(link);
    });
    
  } catch (error) {
    errors.add(new RecoverableError(`Error initializing merch links: ${error}`));
  }

  return errors;
};
