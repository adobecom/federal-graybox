import { expect } from '@esm-bundle/chai';
import {
  setPersonalizationConfig,
  setLocalizeLink,
  fetchAndProcessPlainHTML,
} from '../../src/Utils/Utils';
import { setPlaceholders } from '../../src/Utils/Placeholders';
import { parseProductList } from '../../src/Components/ProductList/Parse';

/**
 * There is no host wiring in this workspace that connects the federal
 * global-navigation lib to milo's real MEP engine (setPersonalizationConfig
 * is only ever called from Main.ts by a consuming app), so a MEP `replace`
 * targeting a product card can't be exercised in a live browser here.
 * This test instead drives the exact production path
 * (fetchAndProcessPlainHTML -> handleCommands -> parseProductList) with a
 * handleCommands mock that mirrors milo's real `replace` action (see
 * libs/features/personalization/personalization.js `createContent` /
 * `deleteMarkedEls`): it matches a manifest-supplied selector in the fetched
 * body and swaps the matched element for fetched fragment markup. Real
 * Franklin/EDS fragment exports wrap their block content in a section <div>,
 * so the mock mirrors that wrapped shape too.
 *
 * SINGLETON NOTE: setPersonalizationConfig is a one-time initializer, so run
 * this file in isolation for deterministic results.
 */
describe('MEP replace command feeding an inline product-card fragment', () => {
  before(() => {
    setPlaceholders(Promise.resolve(new Map()));
    setLocalizeLink((link) => link);

    setPersonalizationConfig({
      commands: [
        { action: 'replace', selector: '.product-card-slot', content: '/fragments/photoshop-card' },
      ],
      handleCommands: async (commands, rootEl) => {
        commands.forEach(({ action, selector }) => {
          if (action !== 'replace') return;
          const target = rootEl.querySelector(selector);
          if (!target) return;
          const fragment = document.createElement('div');
          fragment.innerHTML = `
            <div>
              <div class="product-card">
                <div>
                  <div></div>
                  <div>
                    <p><a href="https://www.adobe.com/photoshop.html">Adobe Photoshop</a></p>
                    <p>Photo and design editing</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          target.replaceWith(...fragment.children);
        });
      },
    });
  });

  it('resolves the MEP-replaced fragment as a ProductCardLink', async () => {
    const originalFetch = window.fetch;
    window.fetch = async () => ({
      ok: true,
      text: async () => `
        <ul>
          <li>
            <div>
              <h2>Creativity & Design</h2>
              <div class="product-card-slot"></div>
            </div>
          </li>
        </ul>
      `,
    });

    try {
      const source = new URL('https://main--federal--adobecom.aem.page/federal/site-redesign/gnav');
      const body = await fetchAndProcessPlainHTML(source);
      const [result, errors] = parseProductList(body);

      expect(errors).to.have.lengthOf(0);
      expect(result.categories).to.have.lengthOf(1);
      expect(result.categories[0].links).to.have.lengthOf(1);
      expect(result.categories[0].links[0].type).to.equal('ProductCardLink');
      expect(result.categories[0].links[0].title).to.equal('Adobe Photoshop');
    } finally {
      window.fetch = originalFetch;
    }
  });
});
