import { expect } from '@esm-bundle/chai';
import {
  setPersonalizationConfig,
  setLocalizeLink,
  inlineNestedFragments,
} from '../../src/Utils/Utils';
import { setPlaceholders } from '../../src/Utils/Placeholders';

/**
 * SINGLETON NOTE: setPersonalizationConfig is a one-time initializer, so run
 * this file in isolation for deterministic results.
 */
describe('resolveFragmentHref hook', () => {
  before(() => {
    setPlaceholders(Promise.resolve(new Map()));
    setLocalizeLink((link) => link);

    setPersonalizationConfig({
      commands: [],
      handleCommands: async () => {},
      // Mimics a host wiring milo's `config.mep.fragments` override + the
      // `#_inline`-preserving behavior of `handleFragmentCommand`.
      resolveFragmentHref: (href) => href.includes('/fragments/photoshop-card')
        ? href.replace('/fragments/photoshop-card', '/fragments/premiere-card')
        : href,
    });
  });

  it('fetches the resolved href instead of the authored one', async () => {
    const originalFetch = window.fetch;
    const requestedUrls = [];
    window.fetch = async (url) => {
      requestedUrls.push(url);
      return {
        ok: true,
        text: async () => '<div class="product-card"><div><div></div><div><p><a href="https://www.adobe.com/premiere.html">Adobe Premiere Pro</a></p><p>Video editing</p></div></div></div>',
      };
    };

    try {
      const container = document.createElement('div');
      container.innerHTML = '<a href="https://main--federal--adobecom.aem.page/fragments/photoshop-card#_inline">placeholder</a>';

      const result = await inlineNestedFragments(container);

      expect(result).to.equal(container);
      expect(requestedUrls).to.have.lengthOf(1);
      expect(requestedUrls[0]).to.include('/fragments/premiere-card');
      expect(container.querySelector('a')?.textContent).to.equal('Adobe Premiere Pro');
    } finally {
      window.fetch = originalFetch;
    }
  });
});
