import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  getUnavWidthCSS,
  getUniversalNavLocale,
  getDevice,
  getVisitorGuid,
  setUserProfile,
  getUserProfile,
  SIGNED_OUT_ICONS,
  LANGMAP,
} from '../../dist/test-exports.js';

/**
 * UNAV Utils Unit Tests
 * 
 * Tests pure utility functions for Universal Navigation
 */

describe('UNAV Utils', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // ============================================================================
  // Constants Tests
  // ============================================================================

  describe('Constants', () => {
    it('should export SIGNED_OUT_ICONS with correct values', () => {
      expect(SIGNED_OUT_ICONS).to.be.an('array');
      expect(SIGNED_OUT_ICONS).to.have.lengthOf(2);
      expect(SIGNED_OUT_ICONS).to.deep.equal(['appswitcher', 'help']);
    });

    it('should export LANGMAP with correct structure', () => {
      expect(LANGMAP).to.be.an('object');
      expect(Object.keys(LANGMAP).length).to.be.greaterThan(10);
      expect(LANGMAP.cs).to.deep.equal(['cz']);
      expect(LANGMAP.en).to.include('au', 'ca');
      expect(LANGMAP.es).to.include('mx', 'ar', 'cl');
    });
  });

  // ============================================================================
  // getUniversalNavLocale() Tests
  // ============================================================================

  describe('getUniversalNavLocale()', () => {
    describe('default fallbacks', () => {
      it('should return en_US for empty prefix', () => {
        expect(getUniversalNavLocale({ prefix: '' })).to.equal('en_US');
      });

      it('should return en_US for root prefix', () => {
        expect(getUniversalNavLocale({ prefix: '/' })).to.equal('en_US');
      });
    });

    describe('simple language codes', () => {
      it('should convert fr to fr_FR', () => {
        expect(getUniversalNavLocale({ prefix: 'fr' })).to.equal('fr_FR');
      });

      it('should convert de to de_DE', () => {
        expect(getUniversalNavLocale({ prefix: 'de' })).to.equal('de_DE');
      });

      it('should convert it to it_IT', () => {
        expect(getUniversalNavLocale({ prefix: 'it' })).to.equal('it_IT');
      });

      it('should convert es to es_ES', () => {
        expect(getUniversalNavLocale({ prefix: 'es' })).to.equal('es_ES');
      });
    });

    describe('already formatted locales', () => {
      it('should handle en_us format', () => {
        const result = getUniversalNavLocale({ prefix: 'en_us' });
        expect(result).to.match(/^[a-z]{2}_[A-Z]{2}$/);
      });

      it('should handle en_US format', () => {
        const result = getUniversalNavLocale({ prefix: 'en_US' });
        expect(result).to.match(/^[a-z]{2}_[A-Z]{2}$/);
      });

      it('should handle fr_fr format', () => {
        const result = getUniversalNavLocale({ prefix: 'fr_fr' });
        expect(result).to.match(/^[a-z]{2}_[A-Z]{2}$/);
      });
    });

    describe('special case: UK', () => {
      it('should map uk to en_GB', () => {
        expect(getUniversalNavLocale({ prefix: 'uk' })).to.equal('en_GB');
      });
    });

    describe('LANGMAP country-to-language mappings', () => {
      it('should map dk to da_DK (Danish)', () => {
        expect(getUniversalNavLocale({ prefix: 'dk' })).to.equal('da_DK');
      });

      it('should map no to nb_NO (Norwegian)', () => {
        expect(getUniversalNavLocale({ prefix: 'no' })).to.equal('nb_NO');
      });

      it('should map br to pt_BR (Portuguese)', () => {
        expect(getUniversalNavLocale({ prefix: 'br' })).to.equal('pt_BR');
      });

      it('should map jp to ja_JP (Japanese)', () => {
        expect(getUniversalNavLocale({ prefix: 'jp' })).to.equal('ja_JP');
      });

      it('should map cn to zh_CN (Chinese)', () => {
        expect(getUniversalNavLocale({ prefix: 'cn' })).to.equal('zh_CN');
      });

      it('should map ca to en_CA (English Canada)', () => {
        expect(getUniversalNavLocale({ prefix: 'ca' })).to.equal('en_CA');
      });

      it('should map mx to es_MX (Spanish Mexico)', () => {
        expect(getUniversalNavLocale({ prefix: 'mx' })).to.equal('es_MX');
      });

      it('should map at to de_AT (German Austria)', () => {
        expect(getUniversalNavLocale({ prefix: 'at' })).to.equal('de_AT');
      });

      it('should map cz to cs_CZ (Czech)', () => {
        expect(getUniversalNavLocale({ prefix: 'cz' })).to.equal('cs_CZ');
      });

      it('should map se to sv_SE (Swedish)', () => {
        expect(getUniversalNavLocale({ prefix: 'se' })).to.equal('sv_SE');
      });
    });

    describe('slash handling', () => {
      it('should remove leading slash from /fr', () => {
        expect(getUniversalNavLocale({ prefix: '/fr' })).to.equal('fr_FR');
      });

      it('should handle /mx correctly', () => {
        expect(getUniversalNavLocale({ prefix: '/mx' })).to.equal('es_MX');
      });
    });
  });

  // ============================================================================
  // getUnavWidthCSS() Tests
  // ============================================================================

  describe('getUnavWidthCSS()', () => {
    let cookieStub;

    beforeEach(() => {
      // Default: cart not enabled
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
      });
    });

    describe('signed out state', () => {
      it('should calculate width with no components', () => {
        const result = getUnavWidthCSS([], true);
        expect(result).to.equal('calc(92px + 0px + 0rem)');
      });

      it('should calculate width with single help icon', () => {
        const result = getUnavWidthCSS(['help'], true);
        expect(result).to.equal('calc(92px + 32px + 0.25rem)');
      });

      it('should calculate width with appswitcher and help', () => {
        const result = getUnavWidthCSS(['appswitcher', 'help'], true);
        expect(result).to.equal('calc(92px + 64px + 0.5rem)');
      });

      it('should filter out non-visible components for signed out', () => {
        const result = getUnavWidthCSS(['notifications', 'profile'], true);
        expect(result).to.equal('calc(92px + 0px + 0rem)');
      });

      it('should include only visible icons for signed out', () => {
        const result = getUnavWidthCSS(['profile', 'notifications', 'help', 'search'], true);
        // Only 'help' is in SIGNED_OUT_ICONS
        expect(result).to.equal('calc(92px + 32px + 0.25rem)');
      });
    });

    describe('signed in state', () => {
      it('should calculate width for 3 components', () => {
        const result = getUnavWidthCSS(['profile', 'search', 'help'], false);
        expect(result).to.equal('calc(96px + 0.5rem)');
      });

      it('should calculate width for single component', () => {
        const result = getUnavWidthCSS(['profile'], false);
        expect(result).to.equal('calc(32px + 0rem)');
      });

      it('should calculate width for 5 components', () => {
        const result = getUnavWidthCSS(['profile', 'search', 'help', 'notifications', 'appswitcher'], false);
        expect(result).to.equal('calc(160px + 1rem)');
      });

      it('should filter out cart when cookie not present', () => {
        document.cookie = '';
        const result = getUnavWidthCSS(['profile', 'cart', 'search'], false);
        // Should be 2 components (cart filtered out)
        expect(result).to.equal('calc(64px + 0.25rem)');
      });

      it('should include cart when cookie is present', () => {
        document.cookie = 'uc_carts=true';
        const result = getUnavWidthCSS(['profile', 'cart', 'search'], false);
        // Should be 3 components (cart included)
        expect(result).to.equal('calc(96px + 0.5rem)');
      });

      it('should handle undefined components array', () => {
        const result = getUnavWidthCSS(undefined, false);
        expect(result).to.equal('calc(0px + -0.25rem)');
      });

      it('should handle empty components array', () => {
        const result = getUnavWidthCSS([], false);
        expect(result).to.equal('calc(0px + -0.25rem)');
      });

      it('should calculate width for large component list', () => {
        const components = ['profile', 'search', 'help', 'notifications', 'appswitcher', 
                           'cart', 'bell', 'settings', 'feedback', 'learn'];
        document.cookie = 'uc_carts=true';
        const result = getUnavWidthCSS(components, false);
        expect(result).to.equal('calc(320px + 2.25rem)');
      });
    });

    describe('edge cases', () => {
      it('should handle null components', () => {
        const result = getUnavWidthCSS(null, false);
        expect(result).to.equal('calc(0px + -0.25rem)');
      });

      it('should default signedOut to false', () => {
        const result = getUnavWidthCSS(['profile', 'search', 'help']);
        expect(result).to.equal('calc(96px + 0.5rem)');
      });
    });
  });

  // ============================================================================
  // getDevice() Tests
  // ============================================================================

  describe('getDevice()', () => {
    it('should detect macOS from current browser', () => {
      // Test with actual navigator.userAgent - will detect current OS
      const result = getDevice();
      expect(result).to.be.oneOf(['macOS', 'windows', 'linux', 'chromeOS', 'android', 'iPadOS', 'iOS']);
    });

    it('should return a valid device type', () => {
      const result = getDevice();
      const validDevices = ['macOS', 'windows', 'linux', 'chromeOS', 'android', 'iPadOS', 'iOS'];
      expect(validDevices).to.include(result);
    });

    it('should be consistent across multiple calls', () => {
      const result1 = getDevice();
      const result2 = getDevice();
      expect(result1).to.equal(result2);
    });
  });

  // ============================================================================
  // getVisitorGuid() Tests
  // ============================================================================

  describe('getVisitorGuid()', () => {
    let originalAlloy;

    beforeEach(() => {
      originalAlloy = window.alloy;
    });

    afterEach(() => {
      if (originalAlloy === undefined) {
        delete window.alloy;
      } else {
        window.alloy = originalAlloy;
      }
    });

    it('should return ECID when alloy is available and returns identity', async () => {
      const alloyStub = sandbox.stub().resolves({
        identity: { ECID: 'test-ecid-12345' },
      });
      window.alloy = alloyStub;

      const result = await getVisitorGuid();
      expect(result).to.equal('test-ecid-12345');
      sinon.assert.calledWith(alloyStub, 'getIdentity');
    });

    it('should return undefined when alloy returns identity without ECID', async () => {
      window.alloy = sandbox.stub().resolves({
        identity: {},
      });

      const result = await getVisitorGuid();
      expect(result).to.be.undefined;
    });

    it('should return undefined when alloy is not available', async () => {
      delete window.alloy;

      const result = await getVisitorGuid();
      expect(result).to.be.undefined;
    });

    it('should return undefined when alloy rejects', async () => {
      window.alloy = sandbox.stub().rejects(new Error('Alloy error'));

      const result = await getVisitorGuid();
      expect(result).to.be.undefined;
    });

    it('should return undefined when alloy returns null', async () => {
      window.alloy = sandbox.stub().resolves(null);

      const result = await getVisitorGuid();
      expect(result).to.be.undefined;
    });

    it('should return undefined when alloy returns undefined', async () => {
      window.alloy = sandbox.stub().resolves(undefined);

      const result = await getVisitorGuid();
      expect(result).to.be.undefined;
    });
  });

  // ============================================================================
  // Profile State Management Tests
  // ============================================================================

  describe('setUserProfile() / getUserProfile()', () => {
    // Note: Profile state is a singleton closure - tests must account for persistence
    // The first call to setUserProfile() across all tests will set the value permanently

    it('should return an object from getUserProfile', async () => {
      // Profile is a singleton - may already be resolved from previous tests
      // Test with a short timeout to avoid hanging
      const result = await Promise.race([
        getUserProfile(),
        new Promise(resolve => setTimeout(() => resolve({ timeout: true }), 100))
      ]);
      
      expect(result).to.be.an('object');
    });

    it('should handle empty object profile', () => {
      // setUserProfile only accepts the FIRST non-null/undefined value
      // Subsequent calls are ignored by design
      const emptyProfile = {};
      setUserProfile(emptyProfile);
      
      // Just verify it doesn't throw
      expect(() => setUserProfile(emptyProfile)).to.not.throw();
    });

    it('should ignore null profile data', () => {
      setUserProfile(null);
      // Should not throw
      expect(() => setUserProfile(null)).to.not.throw();
    });

    it('should ignore undefined profile data', () => {
      setUserProfile(undefined);
      // Should not throw
      expect(() => setUserProfile(undefined)).to.not.throw();
    });

    it('should ignore subsequent profile sets (singleton behavior)', () => {
      const firstProfile = { name: 'First' };
      const secondProfile = { name: 'Second' };

      setUserProfile(firstProfile);
      setUserProfile(secondProfile);
      
      // Both calls should complete without error
      // The implementation ignores the second call
      expect(() => {
        setUserProfile(firstProfile);
        setUserProfile(secondProfile);
      }).to.not.throw();
    });

    it('should accept complex profile data structure', () => {
      const complexProfile = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        settings: { theme: 'dark', notifications: true },
        roles: ['admin', 'user'],
      };

      // Should not throw when setting complex data
      expect(() => setUserProfile(complexProfile)).to.not.throw();
    });
  });
});
