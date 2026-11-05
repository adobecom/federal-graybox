import { expect } from '@esm-bundle/chai';
import { loadUnav, reserveUnavWidth } from '../../src/PostRendering/Unav/Unav.loader';
import { setMiloConfig } from '../../src/Utils/Utils';

/**
 * UNAV Loader Unit Tests
 * 
 * SCOPE: Tests entry/exit points and error handling for orchestration function.
 * 
 * ARCHITECTURE NOTE:
 * The UNAV loader is an orchestration function that loads CDN assets and initializes
 * third-party libraries. Async operations (CDN loading, external API calls) are
 * covered by integration tests.
 */

describe('UNAV Loader', () => {
  let createdElements = [];

  before(() => {
    // Initialize MiloConfig once (singleton pattern)
    try {
      setMiloConfig({
        env: { name: 'stage' },
        locale: { prefix: '' },
      });
    } catch (e) {
      // Already initialized
    }
  });

  afterEach(() => {
    // Clean up created DOM elements
    createdElements.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createdElements = [];
  });

  // ============================================================================
  // Container Validation Tests
  // ============================================================================

  describe('container validation', () => {
    it('should return error when .feds-utilities container is missing', async () => {
      const nav = document.createElement('nav');
      createdElements.push(nav);

      const result = await loadUnav(nav);

      expect(result.message).to.equal('missing ".feds-utilities" container');
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('error handling', () => {
    it('should catch and return RecoverableError on exception', async () => {
      const nav = document.createElement('nav');
      createdElements.push(nav);

      const result = await loadUnav(nav);

      expect(result.message).to.be.a('string');
      expect(result.message).to.include('container');
    });

    it('should handle errors without throwing', async () => {
      const nav = document.createElement('nav');
      createdElements.push(nav);

      let errorThrown = false;
      try {
        await loadUnav(nav);
      } catch (e) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  // ============================================================================
  // Width reservation (MWPW-210874)
  // ============================================================================

  describe('reserveUnavWidth', () => {
    let meta;

    afterEach(() => {
      meta?.remove();
      meta = undefined;
    });

    const addMeta = (content) => {
      meta = document.createElement('meta');
      meta.name = 'universal-nav';
      meta.content = content;
      document.head.append(meta);
    };

    it('reserves a min-width on .feds-utilities before UNAV loads', () => {
      addMeta('appswitcher, help, profile');
      const nav = document.createElement('nav');
      nav.innerHTML = '<div class="feds-utilities"></div>';
      createdElements.push(nav);
      document.body.append(nav);

      reserveUnavWidth(nav);

      const utilities = nav.querySelector('.feds-utilities');
      expect(utilities.style.minWidth).to.match(/^calc\(/);
    });

    it('no-ops when the .feds-utilities container is absent', () => {
      addMeta('appswitcher, help');
      const nav = document.createElement('nav');
      createdElements.push(nav);

      expect(() => reserveUnavWidth(nav)).to.not.throw();
    });
  });
});
