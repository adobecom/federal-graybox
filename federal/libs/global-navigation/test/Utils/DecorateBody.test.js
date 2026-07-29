import { expect } from '@esm-bundle/chai';
import {
  setDecorateBody,
  getDecorateBody,
  setLocalizeLink,
  setPersonalizationConfig,
  fetchAndProcessPlainHTML,
} from '../../src/Utils/Utils';
import { setPlaceholders } from '../../src/Utils/Placeholders';

/**
 * DecorateBody hook unit + integration tests.
 *
 * SCOPE: The `decorateBody` hook is milo's async, whole-body link-decoration
 * pass (lingo regionalization + mep-lingo prefix). It is the async companion to
 * the synchronous `localizeLink`. Federal calls it pre-parse in
 * `fetchAndProcessPlainHTML`, after personalization, on the raw fetched body so
 * `localizeLinkAsync` can resolve regional prefixes before the gnav is parsed.
 *
 * These tests validate:
 *  - the setDecorateBody/getDecorateBody singleton (default no-op, replacement)
 *  - fetchAndProcessPlainHTML awaits decorateBody with the parsed body
 *  - decorateBody runs AFTER handleCommands (ordering)
 *  - async mutations complete before the returned promise resolves
 *
 * SINGLETON NOTE: setPersonalizationConfig and setPlaceholders are one-time
 * initializers; run this file in isolation for deterministic results.
 */
describe('DecorateBody hook', () => {
  describe('setDecorateBody / getDecorateBody singleton', () => {
    it('defaults to a no-op that resolves', async () => {
      const result = getDecorateBody()(document.createElement('div'));
      expect(result).to.be.a('promise');
      const resolved = await result;
      expect(resolved).to.be.undefined;
    });

    it('is replaced by setDecorateBody and receives the body', async () => {
      let received = null;
      setDecorateBody(async (body) => { received = body; });
      const body = document.createElement('div');
      await getDecorateBody()(body);
      expect(received).to.equal(body);
    });

    it('awaits async decoration before resolving', async () => {
      setDecorateBody(async (body) => {
        await Promise.resolve();
        body.querySelector('a')?.setAttribute('href', '/de/products/photoshop.html');
      });
      const body = document.createElement('div');
      body.innerHTML = '<a href="/products/photoshop.html">Photoshop</a>';
      await getDecorateBody()(body);
      expect(body.querySelector('a').getAttribute('href')).to.equal('/de/products/photoshop.html');
    });
  });

  describe('integration: fetchAndProcessPlainHTML', () => {
    let originalFetch;
    let callOrder;

    before(() => {
      setPlaceholders(Promise.resolve(new Map()));
      setLocalizeLink((link) => link);
    });

    beforeEach(() => {
      callOrder = [];
      originalFetch = window.fetch;
      window.fetch = async () => ({
        ok: true,
        text: async () => '<a href="/products/photoshop.html">Photoshop</a>',
      });
    });

    afterEach(() => {
      window.fetch = originalFetch;
    });

    it('invokes decorateBody with the parsed body, after handleCommands', async () => {
      let decoratedBody = null;
      // one-time init — this file must run in isolation
      setPersonalizationConfig({
        commands: [],
        handleCommands: async () => { callOrder.push('handleCommands'); },
      });
      setDecorateBody(async (body) => {
        callOrder.push('decorateBody');
        decoratedBody = body;
      });

      const source = new URL('https://main--federal--adobecom.aem.page/federal/site-redesign/gnav');
      const body = await fetchAndProcessPlainHTML(source);

      expect(callOrder).to.deep.equal(['handleCommands', 'decorateBody']);
      expect(decoratedBody).to.equal(body);
      expect(decoratedBody.querySelector('a')).to.exist;
    });

    it('lets decorateBody mutation persist on the returned body', async () => {
      setDecorateBody(async (bodyEl) => {
        bodyEl.querySelectorAll('a').forEach((a) => {
          a.setAttribute('href', `/de${a.getAttribute('href')}`);
        });
      });

      const source = new URL('https://main--federal--adobecom.aem.page/federal/site-redesign/gnav');
      const body = await fetchAndProcessPlainHTML(source);

      expect(body.querySelector('a').getAttribute('href')).to.equal('/de/products/photoshop.html');
    });
  });
});
