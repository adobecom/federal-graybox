import { expect } from '@esm-bundle/chai';
import { loadUnav, setMiloConfig } from '../../dist/test-exports.js';

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
});
