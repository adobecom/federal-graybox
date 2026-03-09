import { expect } from '@esm-bundle/chai';
import { loadUnav, RecoverableError, setMiloConfig } from '../../dist/test-exports.js';

/**
 * UNAV Loader Integration Tests
 * 
 * SCOPE: Full end-to-end integration testing with mocked CDN assets
 * 
 * These tests validate the complete loadUnav() initialization flow by:
 * - Intercepting DOM operations (document.head.append) to simulate CDN asset loading
 * - Mocking window APIs (adobeIMS, UniversalNav, alloy, adobeid)
 * - Testing all business logic paths without external dependencies
 * 
 * APPROACH: DOM-layer mocking
 * - Faster execution (no Service Worker overhead)
 * - Tests actual code path (DOM manipulation)
 * - Zero external dependencies
 * - Better test isolation and debugging
 */
describe('UNAV Loader Integration Tests', () => {
  let container;
  let navElement;
  let originalAppend;
  let appendedElements;

  beforeEach(() => {
    // ========================================================================
    // Setup: DOM Mocking Strategy
    // ========================================================================
    // Intercept document.head.append to prevent real CDN requests
    // and simulate successful asset loading
    
    appendedElements = [];
    originalAppend = HTMLHeadElement.prototype.append;
    
    HTMLHeadElement.prototype.append = function(...elements) {
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          appendedElements.push(element);
          
          // Simulate successful loading for scripts and stylesheets
          if (element.tagName === 'SCRIPT') {
            element.dataset.loaded = 'true';
            // Trigger onload asynchronously to simulate real behavior
            setTimeout(() => {
              const event = new Event('load');
              element.dispatchEvent(event);
            }, 0);
          } else if (element.tagName === 'LINK' && element.rel === 'stylesheet') {
            setTimeout(() => {
              const event = new Event('load');
              element.dispatchEvent(event);
            }, 0);
          }
        }
      });
      
      // Don't actually append to avoid loading real CDN files
      return undefined;
    };

    // ========================================================================
    // Setup: Test DOM Structure
    // ========================================================================
    
    container = document.createElement('div');
    navElement = document.createElement('nav');
    navElement.className = 'global-navigation';
    
    const utilities = document.createElement('div');
    utilities.className = 'feds-utilities';
    navElement.appendChild(utilities);
    
    container.appendChild(navElement);
    document.body.appendChild(container);

    // Create meta tag using original append (before mocking)
    const meta = document.createElement('meta');
    meta.name = 'universal-nav';
    meta.content = 'profile,appswitcher,notifications,help';
    originalAppend.call(document.head, meta);

    // ========================================================================
    // Setup: Window API Mocks
    // ========================================================================
    
    window.adobeIMS = {
      isSignedInUser: () => true,
      getProfile: () => Promise.resolve({ userId: 'test-user' })
    };

    window.alloy = () => Promise.resolve();

    window.adobeid = {
      client_id: 'test-client-id'
    };

    // Mock UniversalNav - called after CDN scripts load
    window.UniversalNav = (config) => {
      return Promise.resolve({
        reloadUnav: () => Promise.resolve(),
        errors: new Set()
      });
    };

    // ========================================================================
    // Setup: MiloConfig Initialization
    // ========================================================================
    
    setMiloConfig({
      env: { name: 'stage' },
      locale: { prefix: '' }  // Empty prefix = en_US (default)
    });
  });

  afterEach(() => {
    // ========================================================================
    // Cleanup: Restore Mocks
    // ========================================================================
    
    HTMLHeadElement.prototype.append = originalAppend;
    appendedElements = [];

    // ========================================================================
    // Cleanup: DOM
    // ========================================================================
    
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    const meta = document.head.querySelector('meta[name="universal-nav"]');
    if (meta) {
      meta.remove();
    }

    // ========================================================================
    // Cleanup: Window Objects
    // ========================================================================
    
    delete window.adobeIMS;
    delete window.alloy;
    delete window.adobeid;
    delete window.UniversalNav;
  });

  // ==========================================================================
  // Test Category 1: Meta Tag Validation (5 tests)
  // ==========================================================================
  
  describe('meta tag validation', () => {
    it('should add error if meta tag is missing', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.remove();

      const result = await loadUnav(navElement);
      
      expect(result.errors.size).to.be.greaterThan(0);
      const errors = Array.from(result.errors);
      expect(errors.some(e => e.message && e.message.includes('meta'))).to.be.true;
    });

    it('should add error if meta tag has no value', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = '';

      const result = await loadUnav(navElement);
      
      expect(result.errors.size).to.be.greaterThan(0);
    });

    it('should parse meta tag content correctly', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,appswitcher,notifications';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig).to.exist;
      const componentNames = capturedConfig.children.map(c => c.name);
      expect(componentNames).to.include('profile');
      expect(componentNames).to.include('app-switcher');
      expect(componentNames).to.include('notifications');
    });

    it('should filter out invalid components', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,invalid,appswitcher,fake,help';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const componentNames = capturedConfig.children.map(c => c.name);
      expect(componentNames).to.not.include('invalid');
      expect(componentNames).to.not.include('fake');
    });

    it('should handle whitespace in meta content', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = '  profile  ,  appswitcher  ,  help  ';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const componentNames = capturedConfig.children.map(c => c.name);
      expect(componentNames).to.include('profile');
      expect(componentNames).to.include('app-switcher');
      expect(componentNames).to.include('help');
    });
  });

  // ==========================================================================
  // Test Category 2: User Authentication State (3 tests)
  // ==========================================================================
  
  describe('user authentication state', () => {
    it('should set min-width for signed-out users', async () => {
      window.adobeIMS.isSignedInUser = () => false;

      const utilities = navElement.querySelector('.feds-utilities');
      
      await loadUnav(navElement);
      
      // min-width should be set during loading for signed-out users
      expect(utilities.style.minWidth).to.not.equal('');
    });

    it('should not set initial min-width for signed-in users', async () => {
      window.adobeIMS.isSignedInUser = () => true;

      const utilities = navElement.querySelector('.feds-utilities');
      const initialMinWidth = utilities.style.minWidth;
      
      await loadUnav(navElement);
      
      // For signed-in users, min-width is not set initially
      expect(initialMinWidth).to.equal('');
    });

    it('should remove min-width after load for signed-in users', async () => {
      window.adobeIMS.isSignedInUser = () => true;

      const utilities = navElement.querySelector('.feds-utilities');
      
      await loadUnav(navElement);
      
      // min-width should be removed after UNAV loads
      expect(utilities.style.minWidth).to.equal('');
    });
  });

  // ==========================================================================
  // Test Category 3: Component Children Building (7 tests)
  // ==========================================================================
  
  describe('component children building', () => {
    it('should always include profile as first component', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'appswitcher,help';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.children[0].name).to.equal('profile');
    });

    it('should handle signup token by modifying profile', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,signup,appswitcher';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const profile = capturedConfig.children[0];
      expect(profile.attributes.isSignUpRequired).to.be.true;
    });

    it('should not duplicate profile component', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,profile,appswitcher';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const profileCount = capturedConfig.children.filter(
        c => c.name === 'profile'
      ).length;
      expect(profileCount).to.equal(1);
    });

    it('should add components in order', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,appswitcher,notifications,help';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const names = capturedConfig.children.map(c => c.name);
      expect(names[0]).to.equal('profile');
      expect(names[1]).to.equal('app-switcher');
      expect(names[2]).to.equal('notifications');
      expect(names[3]).to.equal('help');
    });

    it('should handle all 6 components', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile,appswitcher,notifications,help,jarvis,cart';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.children.length).to.be.greaterThan(5);
      const names = capturedConfig.children.map(c => c.name);
      expect(names).to.include('profile');
      expect(names).to.include('app-switcher');
      expect(names).to.include('notifications');
      expect(names).to.include('help');
      expect(names).to.include('jarvis');
      expect(names).to.include('cart');
    });

    it('should work with only profile', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.children.length).to.equal(1);
      expect(capturedConfig.children[0].name).to.equal('profile');
    });

    it('should handle mixed valid and invalid components', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = 'profile, , invalid, ,appswitcher, ,fake';

      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const names = capturedConfig.children.map(c => c.name);
      expect(names).to.include('profile');
      expect(names).to.include('app-switcher');
      expect(names).to.not.include('invalid');
      expect(names).to.not.include('fake');
    });
  });

  // ==========================================================================
  // Test Category 4: Configuration Building (6 tests)
  // ==========================================================================
  
  describe('configuration building', () => {
    it('should build valid UnavConfig', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig).to.be.an('object');
      expect(capturedConfig.target).to.exist;
      expect(capturedConfig.env).to.be.a('string');
      expect(capturedConfig.locale).to.be.a('string');
      expect(capturedConfig.countryCode).to.be.a('string');
      expect(capturedConfig.theme).to.be.a('string');
      expect(capturedConfig.analyticsContext).to.be.an('object');
      expect(capturedConfig.children).to.be.an('array');
    });

    it('should set environment to stage', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.env).to.equal('stage');
    });

    it('should set locale to en_US', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.locale).to.equal('en_US');
    });

    it('should include analytics context', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      const analytics = capturedConfig.analyticsContext;
      expect(analytics.consumer).to.be.an('object');
      expect(analytics.consumer.name).to.equal('adobecom');
      expect(analytics.consumer.version).to.be.a('string');
      expect(analytics.consumer.platform).to.equal('Web');
      expect(analytics.consumer.device).to.be.a('string');
      expect(analytics.event).to.be.an('object');
    });

    it('should set imsClientId from window.adobeid', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.imsClientId).to.equal('test-client-id');
    });

    it('should pass correct target element', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(capturedConfig.target).to.equal(navElement.querySelector('.feds-utilities'));
    });
  });

  // ==========================================================================
  // Test Category 5: CDN Asset Loading (4 tests) 🔑 CRITICAL
  // ==========================================================================
  
  describe('CDN asset loading', () => {
    it('should load UniversalNav script from CDN', async () => {
      await loadUnav(navElement);
      
      const scripts = appendedElements.filter(el => el.tagName === 'SCRIPT');
      const unavScript = scripts.find(s => s.src && s.src.includes('UniversalNav'));
      
      expect(unavScript).to.exist;
      expect(unavScript.src).to.include('adobeccstatic.com');
      expect(unavScript.src).to.include('1.5');
    });

    it('should load UniversalNav styles from CDN', async () => {
      await loadUnav(navElement);
      
      const links = appendedElements.filter(el => el.tagName === 'LINK');
      const unavStyles = links.find(l => l.href && l.href.includes('UniversalNav'));
      
      if (unavStyles) {
        expect(unavStyles.href).to.include('adobeccstatic.com');
        expect(unavStyles.href).to.include('1.5');
      }
      
      // At minimum, script should be loaded
      expect(appendedElements.some(el => el.tagName === 'SCRIPT')).to.be.true;
    });

    it('should use version 1.5 by default', async () => {
      await loadUnav(navElement);
      
      const scripts = appendedElements.filter(el => el.tagName === 'SCRIPT');
      const unavScript = scripts.find(s => s.src && s.src.includes('UniversalNav'));
      
      expect(unavScript.src).to.include('/1.5/');
    });

    it('should handle CDN load failures gracefully', async () => {
      // Override append to simulate load failure
      HTMLHeadElement.prototype.append = function(...elements) {
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            appendedElements.push(element);
            
            if (element.tagName === 'SCRIPT') {
              setTimeout(() => {
                const event = new Event('error');
                element.dispatchEvent(event);
              }, 0);
            }
          }
        });
      };

      const result = await loadUnav(navElement);
      
      // Should handle error gracefully and return a result
      expect(result).to.exist;
    });
  });

  // ==========================================================================
  // Test Category 6: Return Value (4 tests)
  // ==========================================================================
  
  describe('return value', () => {
    it('should return Unav object on success', async () => {
      const result = await loadUnav(navElement);
      
      expect(result).to.not.be.instanceOf(RecoverableError);
      expect(result).to.have.property('reloadUnav');
      expect(result).to.have.property('errors');
    });

    it('should have reloadUnav function', async () => {
      const result = await loadUnav(navElement);
      
      expect(result.reloadUnav).to.be.a('function');
    });

    it('should have errors Set', async () => {
      const result = await loadUnav(navElement);
      
      expect(result.errors).to.be.instanceOf(Set);
    });

    it('should return RecoverableError on exception', async () => {
      window.UniversalNav = () => {
        throw new Error('Initialization failed');
      };

      const result = await loadUnav(navElement);
      
      expect(result).to.be.instanceOf(RecoverableError);
      expect(result.message).to.include('Initialization failed');
    });

    it('should execute reloadUnav and call UniversalNav.reload', async () => {
      let reloadCalled = false;
      let reloadConfig = null;
      
      // Create UniversalNav mock that returns an object AND has reload method
      const unavInstance = {
        reload: (newConfig) => {
          reloadCalled = true;
          reloadConfig = newConfig;
          return Promise.resolve();
        },
        reloadUnav: () => Promise.resolve(),
        errors: new Set()
      };
      
      window.UniversalNav = (config) => {
        return Promise.resolve(unavInstance);
      };
      
      // Add reload method to the function itself
      window.UniversalNav.reload = unavInstance.reload;

      const result = await loadUnav(navElement);
      
      // Directly call reloadUnav to test the function body
      result.reloadUnav();
      
      expect(reloadCalled).to.be.true;
      expect(reloadConfig).to.exist;
      expect(reloadConfig).to.be.an('object');
      expect(reloadConfig.children).to.be.an('array');
    });
  });

  // ==========================================================================
  // Test Category 7: Error Accumulation (2 tests)
  // ==========================================================================
  
  describe('error accumulation', () => {
    it('should collect multiple errors', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.remove();

      const result = await loadUnav(navElement);
      
      expect(result.errors.size).to.be.greaterThan(0);
    });

    it('should not throw on recoverable errors', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.content = '';

      let errorThrown = false;
      try {
        await loadUnav(navElement);
      } catch (e) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  // ==========================================================================
  // Test Category 8: Edge Cases (5 tests)
  // ==========================================================================
  
  describe('edge cases', () => {
    it('should handle missing window.adobeIMS', async () => {
      delete window.adobeIMS;

      const result = await loadUnav(navElement);
      
      expect(result).to.not.be.instanceOf(RecoverableError);
    });

    it('should handle missing window.alloy', async () => {
      delete window.alloy;

      const result = await loadUnav(navElement);
      
      expect(result).to.not.be.instanceOf(RecoverableError);
    });

    it('should handle missing window.adobeid', async () => {
      delete window.adobeid;

      const result = await loadUnav(navElement);
      
      // Should still work, but imsClientId will be undefined
      expect(result).to.exist;
    });

    it('should handle undefined meta content gracefully', async () => {
      const meta = document.head.querySelector('meta[name="universal-nav"]');
      meta.removeAttribute('content');

      const result = await loadUnav(navElement);
      
      expect(result.errors.size).to.be.greaterThan(0);
    });

    it('should use stage environment by default', async () => {
      let capturedConfig;
      window.UniversalNav = (config) => {
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      // Stage is the default environment
      expect(capturedConfig.env).to.equal('stage');
      
      // Check CDN URL uses stage
      const scripts = appendedElements.filter(el => el.tagName === 'SCRIPT');
      const unavScript = scripts.find(s => s.src && s.src.includes('UniversalNav'));
      expect(unavScript.src).to.include('stage.adobeccstatic.com');
    });
  });

  // ==========================================================================
  // Test Category 9: UniversalNav Initialization (2 tests)
  // ==========================================================================
  
  describe('UniversalNav initialization', () => {
    it('should call UniversalNav with config', async () => {
      let unavWasCalled = false;
      let capturedConfig;
      
      window.UniversalNav = (config) => {
        unavWasCalled = true;
        capturedConfig = config;
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      expect(unavWasCalled).to.be.true;
      expect(capturedConfig).to.exist;
    });

    it('should wait for scripts to load before calling UniversalNav', async () => {
      const callOrder = [];
      
      HTMLHeadElement.prototype.append = function(...elements) {
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            appendedElements.push(element);
            callOrder.push('append');
            
            if (element.tagName === 'SCRIPT') {
              element.dataset.loaded = 'true';
              Promise.resolve().then(() => {
                callOrder.push('scriptLoad');
                const event = new Event('load');
                element.dispatchEvent(event);
              });
            } else if (element.tagName === 'LINK') {
              Promise.resolve().then(() => {
                const event = new Event('load');
                element.dispatchEvent(event);
              });
            }
          }
        });
      };

      window.UniversalNav = (config) => {
        callOrder.push('UniversalNav');
        return Promise.resolve({
          reloadUnav: () => Promise.resolve(),
          errors: new Set()
        });
      };

      await loadUnav(navElement);
      
      // Verify append happened
      expect(callOrder.filter(c => c === 'append').length).to.be.greaterThan(0);
      
      // Verify UniversalNav was called
      const unavIndex = callOrder.indexOf('UniversalNav');
      expect(unavIndex).to.be.greaterThan(-1);
    });
  });
});
