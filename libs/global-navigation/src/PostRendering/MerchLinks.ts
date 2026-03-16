import { getMiloConfig } from '../Utils/Utils';
import { RecoverableError } from '../Error/Error';

/**
 * Initializes merch links by dynamically loading and applying the Milo merch block
 * to all anchor tags with the 'merch' class
 * @param mountpoint - The global navigation container element
 * @returns Set of RecoverableErrors encountered during initialization
 */
export const initMerchLinks = async (mountpoint: HTMLElement): Promise<Set<RecoverableError>> => {
  const errors = new Set<RecoverableError>();
  const merchLinks = mountpoint.querySelectorAll('a.merch');
  
  if (merchLinks.length === 0) return errors;

  try {
    const config = getMiloConfig();
    const { base } = config;
    
    if (!base) {
      errors.add(new RecoverableError('base not found in config, cannot initialize merch links'));
      return errors;
    }

    // Dynamically import the merch module from Milo
    const merchModule = await import(`${base}/blocks/merch/merch.js`);
    const { default: decorateMerchLink } = merchModule;

    if (!decorateMerchLink) {
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
