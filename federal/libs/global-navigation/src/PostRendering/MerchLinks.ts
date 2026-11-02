import {
  getMiloConfig,
  isMerchLink,
  isMasLink,
  isMasFieldLink,
  getMerchDecorators,
} from '../Utils/Utils';
import { RecoverableError } from '../Error/Error';
import { lanaLog } from '../Utils/Log';

type MerchModule = {
  default?: (link: HTMLAnchorElement) => unknown;
};

export const MERCH_RESOLVED_EVENT = 'feds:merch-resolved';

const PENDING_MERCH_ATTR = 'data-feds-merch-pending';
const MILO_VISUAL_CLASS = /^(?:con-button|outline|button-.+)$/;
const FEDERAL_LINK_CLASSES = new Set([
  'feds-link',
  'feds-link--highlight',
  'feds-primary-cta',
  'feds-secondary-cta',
]);

const notifyMerchResolved = (mountpoint: HTMLElement): void => {
  mountpoint.dispatchEvent(new CustomEvent(MERCH_RESOLVED_EVENT));
};

const getFederalLinkClasses = (link: HTMLAnchorElement): string[] =>
  [...link.classList].filter((className) =>
    FEDERAL_LINK_CLASSES.has(className)
  );

const applyAnalyticsLabel = (
  authoredLink: HTMLAnchorElement,
  resolvedLink: HTMLElement,
): void => {
  const authoredLabel = authoredLink.getAttribute('daa-ll')?.trim() ?? '';
  const authoredText = authoredLink.textContent?.trim() ?? '';
  const resolvedLabel = resolvedLink.textContent?.trim() ?? '';
  if (authoredLabel !== '' && authoredLabel !== authoredText) {
    resolvedLink.setAttribute('daa-ll', authoredLabel);
  }
  else if (resolvedLabel !== '') {
    resolvedLink.setAttribute('daa-ll', resolvedLabel);
  } else {
    resolvedLink.removeAttribute('daa-ll');
  }
};

const removeFailedMerchItems = (
  mountpoint: HTMLElement,
  links: Iterable<HTMLAnchorElement>,
): void => {
  let removed = false;
  for (const link of links) {
    if (!link.isConnected || !link.hasAttribute(PENDING_MERCH_ATTR)) continue;
    const item = link.parentElement;
    if (
      !(item instanceof HTMLLIElement)
      || !item.matches('ul.feds-gnav-items > li')
    ) continue;
    item.remove();
    removed = true;
  }
  if (removed) notifyMerchResolved(mountpoint);
};

const preserveFederalLinkClasses = (
  link: HTMLAnchorElement,
  decorate: (link: HTMLAnchorElement) => unknown,
): Promise<void> => {
  const federalClasses = getFederalLinkClasses(link);
  return Promise.resolve(decorate(link)).then((result) => {
    if (federalClasses.length === 0 || !(result instanceof HTMLElement)) return;
    const resolvedLink = result instanceof HTMLAnchorElement
      ? result
      : result.querySelector<HTMLAnchorElement>('a');
    (resolvedLink ?? result).classList.add(...federalClasses);
  });
};

/** Resolve top-level MAS fields in their authored paragraph context. */
const decorateTopLevelMasField = async (
  link: HTMLAnchorElement,
  decorate: (link: HTMLAnchorElement) => unknown,
  mountpoint: HTMLElement,
): Promise<void> => {
  const federalClasses = getFederalLinkClasses(link);
  const originalAttrs = [...link.attributes]
    .filter(({ name }) =>
      name === 'daa-ll'
      || name === 'target'
      || name.startsWith('aria-')
      || name.startsWith('data-feds-')
    );

  link.setAttribute(PENDING_MERCH_ATTR, '');

  // Copy the authored link into hidden paragraph/CTA markup so Milo can
  // decorate the MAS field without replacing the visible navigation link.
  const masFieldStagingContainer = document.createElement('div');
  masFieldStagingContainer.hidden = true;
  const paragraph = document.createElement('p');
  const stagedMasFieldLink = link.cloneNode(true) as HTMLAnchorElement;
  stagedMasFieldLink.removeAttribute(PENDING_MERCH_ATTR);

  // A wrapper also keeps plain top-level links in Milo's late CTA path.
  const masFieldCtaWrapper = link.classList.contains('feds-primary-cta')
    ? document.createElement('strong')
    : document.createElement('em');
  masFieldCtaWrapper.append(stagedMasFieldLink);
  paragraph.append(masFieldCtaWrapper);
  masFieldStagingContainer.append(paragraph);
  document.body.append(masFieldStagingContainer);

  let isResolutionComplete = false;
  let stagingObserver: MutationObserver | null = null;
  // Remove the temporary markup and its late MAS resolution listener after
  // decoration finishes or fails.
  const removeMasFieldStaging = (): void => {
    document.removeEventListener('mas:ready', onMasReady);
    document.removeEventListener('aem:error', onStagedMasFieldError);
    stagingObserver?.disconnect();
    masFieldStagingContainer.remove();
  };
  const finalizeResolvedLink = (resolvedCandidate: unknown): boolean => {
    if (isResolutionComplete) return true;
    const resolvedLink = resolvedCandidate instanceof HTMLAnchorElement
      ? resolvedCandidate
      : resolvedCandidate instanceof Element
        ? resolvedCandidate.querySelector<HTMLAnchorElement>('a')
        : masFieldStagingContainer.querySelector<HTMLAnchorElement>('a');
    if (resolvedLink === null || resolvedLink === stagedMasFieldLink) {
      return false;
    }
    if (resolvedLink.closest('[data-role="mas-field-content"]') !== null) {
      return false;
    }

    [...resolvedLink.classList].forEach((className) => {
      if (MILO_VISUAL_CLASS.test(className) || className === 'merch') {
        resolvedLink.classList.remove(className);
      }
    });
    resolvedLink.classList.add(...federalClasses);
    originalAttrs.forEach(({ name, value }) => {
      resolvedLink.setAttribute(name, value);
    });
    applyAnalyticsLabel(link, resolvedLink);
    resolvedLink.removeAttribute(PENDING_MERCH_ATTR);

    isResolutionComplete = true;
    link.replaceWith(resolvedLink);
    removeMasFieldStaging();
    notifyMerchResolved(mountpoint);
    return true;
  };
  function onMasReady(event: Event): void {
    const target = event.target;
    if (
      !(target instanceof Element)
      || !masFieldStagingContainer.contains(target)
    ) return;
    if (finalizeResolvedLink(target)) return;
    if (target.querySelector('a') === null) {
      isResolutionComplete = true;
      removeMasFieldStaging();
      removeFailedMerchItems(mountpoint, [link]);
    }
  }
  // Fallback: if staged content fails to load.
  function onStagedMasFieldError(event: Event): void {
    const target = event.target;
    if (
      isResolutionComplete
      || !(target instanceof Node)
      || !masFieldStagingContainer.contains(target)
    ) return;
    isResolutionComplete = true;
    removeMasFieldStaging();
    removeFailedMerchItems(mountpoint, [link]);
  }
  stagingObserver = new MutationObserver(() => {
    finalizeResolvedLink(masFieldStagingContainer);
  });
  stagingObserver.observe(masFieldStagingContainer, {
    childList: true,
    subtree: true,
  });
  document.addEventListener('mas:ready', onMasReady);
  document.addEventListener('aem:error', onStagedMasFieldError);

  try {
    const result = await Promise.resolve(decorate(stagedMasFieldLink));
    if (finalizeResolvedLink(result)) return;
    // Keep late mas-field results connected until mas:ready.
    if (masFieldStagingContainer.querySelector('mas-field') !== null) return;
    removeMasFieldStaging();
    removeFailedMerchItems(mountpoint, [link]);
  } catch (error) {
    removeMasFieldStaging();
    throw error;
  }
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

  // Product-card commerce links (price/discount) are authored inside the card's
  // single <a>, where a nested <a> is invalid. Parse leaves them as non-anchor
  // placeholders; convert them back to anchors so the resolution below handles
  // them in place.
  mountpoint.querySelectorAll<HTMLElement>('.feds-commerce-placeholder')
    .forEach((placeholder) => {
      const href = placeholder.getAttribute('data-commerce-href') ?? '';
      if (href === '') return;
      const link = document.createElement('a');
      link.href = href;
      link.innerHTML = placeholder.innerHTML;
      if (isMerchLink(href)) link.classList.add('merch');
      placeholder.replaceWith(link);
    });

  // Tag OST and inline M@S field links so the `a.merch` path resolves them to
  // an inline value (mirrors Milo's `decorateAutoBlock` downgrade). Lets cards
  // preserve a price/field anchor without re-implementing the tagging.
  mountpoint.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    if (isMerchLink(link.href) || isMasFieldLink(link.href)) {
      link.classList.add('merch');
    }
  });

  const merchLinks = mountpoint.querySelectorAll<HTMLAnchorElement>('a.merch');
  // Match C1 by resolving every top-level MAS field in authored context.
  const stagedMasFieldLinks = [...merchLinks]
    .filter((link) =>
      isMasFieldLink(link.href)
      && link.matches('ul.feds-gnav-items > li > a')
    );
  // Keep authored labels out of the initial compact measurement.
  stagedMasFieldLinks.forEach((link) => {
    link.setAttribute(PENDING_MERCH_ATTR, '');
  });
  // Full M@S cards only; field links (tagged above) never build a merch-card.
  const masLinks = [...mountpoint.querySelectorAll<HTMLAnchorElement>('a[href]')]
    .filter((link) => isMasLink(link.href) && !isMasFieldLink(link.href));

  if (merchLinks.length === 0 && masLinks.length === 0) return errors;

  try {
    const injectedDecorators = getMerchDecorators();
    // base is only needed for the fallback import; injected decorators skip it.
    const needsBase = (merchLinks.length > 0 && !injectedDecorators.merch)
      || (masLinks.length > 0 && !injectedDecorators.masCard);
    const base = needsBase ? getMiloConfig().base : '';

    if (needsBase && base === '') {
      removeFailedMerchItems(mountpoint, stagedMasFieldLinks);
      errors.add(
        new RecoverableError(
          'base not found in config, cannot initialize merch links'
        )
      );
      return errors;
    }

    // OST / miniplans + inline M@S field links: Milo `merch` block
    if (merchLinks.length > 0) {
      const decorateMerchLink = injectedDecorators.merch
        ?? (await import(`${base}/blocks/merch/merch.js`) as MerchModule).default;
      if (decorateMerchLink === undefined) {
        removeFailedMerchItems(mountpoint, stagedMasFieldLinks);
        errors.add(new RecoverableError('decorateMerchLink not found in merch module'));
      } else {
        merchLinks.forEach((link) => {
          let merchLinkDecorationTask: Promise<void>;
          try {
            merchLinkDecorationTask = stagedMasFieldLinks.includes(link)
              ? decorateTopLevelMasField(link, decorateMerchLink, mountpoint)
              : preserveFederalLinkClasses(link, decorateMerchLink);
          } catch (error) {
            merchLinkDecorationTask = Promise.reject(error);
          }
          void merchLinkDecorationTask.catch((error) => {
            removeFailedMerchItems(mountpoint, [link]);
            lanaLog(`Failed to decorate merch link: ${String(error)}`);
          });
        });
      }
    }

    // Full M@S cards: Milo `merch-card-autoblock` block
    if (masLinks.length > 0) {
      try {
        const decorateMasLink = injectedDecorators.masCard
          ?? (await import(
            `${base}/blocks/merch-card-autoblock/merch-card-autoblock.js`
          ) as MerchModule).default;
        if (decorateMasLink === undefined) {
          errors.add(new RecoverableError('default export not found in merch-card-autoblock module'));
        } else {
          masLinks.forEach((link) => {
            try {
              void Promise.resolve(decorateMasLink(link)).catch((error) => {
                lanaLog(`Failed to decorate M@S card: ${String(error)}`);
              });
            } catch (error) {
              lanaLog(`Failed to decorate M@S card: ${String(error)}`);
            }
          });
        }
      } catch (error) {
        errors.add(
          new RecoverableError(`Error initializing M@S cards: ${error}`)
        );
      }
    }
  } catch (error) {
    removeFailedMerchItems(mountpoint, stagedMasFieldLinks);
    errors.add(new RecoverableError(`Error initializing merch links: ${error}`));
  }

  return errors;
};
