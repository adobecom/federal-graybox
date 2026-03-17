import { expect } from '@esm-bundle/chai';
import { getUnavComponents, setMiloConfig, getMetadata } from '../../dist/test-exports.js';

describe('UNAV Config', () => {
  let originalAdobeIMS;
  let originalAdobeProfile;
  let createdMetaTags = [];

  before(() => {
    // Initialize MiloConfig once for all tests (singleton pattern)
    const config = {
      env: { name: 'stage' },
      locale: { prefix: '' },
    };
    try {
      setMiloConfig(config);
    } catch (e) {
      // Already initialized, that's okay
    }
  });

  beforeEach(() => {
    // Store originals
    originalAdobeIMS = window.adobeIMS;
    originalAdobeProfile = window.adobeProfile;
    
    // Mock window objects
    window.adobeIMS = {
      signIn: () => {},
    };

    window.adobeProfile = {
      getUserProfile: () => Promise.resolve({ name: 'Test User' }),
    };

    // Track created meta tags for cleanup
    createdMetaTags = [];
  });

  afterEach(() => {
    // Restore originals
    window.adobeIMS = originalAdobeIMS;
    window.adobeProfile = originalAdobeProfile;

    // Clean up all created meta tags
    createdMetaTags.forEach(meta => {
      if (meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    });
    createdMetaTags = [];
  });

  // Helper function to create and track meta tags
  const createMetaTag = (name, content) => {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
    createdMetaTags.push(meta);
    return meta;
  };

  describe('getUnavComponents', () => {
    describe('basic structure', () => {
      it('should return an object', () => {
        const result = getUnavComponents();
        expect(result).to.be.an('object');
      });

      it('should have all required components', () => {
        const result = getUnavComponents();
        expect(result).to.have.property('profile');
        expect(result).to.have.property('appswitcher');
        expect(result).to.have.property('notifications');
        expect(result).to.have.property('help');
        expect(result).to.have.property('jarvis');
        expect(result).to.have.property('cart');
      });
    });

    describe('profile component', () => {
      it('should have name "profile"', () => {
        const result = getUnavComponents();
        expect(result.profile.name).to.equal('profile');
      });

      it('should have attributes object', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes).to.be.an('object');
      });

      it('should have accountMenuContext', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.accountMenuContext).to.be.an('object');
      });

      it('should have sharedContextConfig', () => {
        const result = getUnavComponents();
        const config = result.profile.attributes.accountMenuContext.sharedContextConfig;
        expect(config).to.be.an('object');
      });

      it('should have enableLocalSection set to true', () => {
        const result = getUnavComponents();
        const config = result.profile.attributes.accountMenuContext.sharedContextConfig;
        expect(config.enableLocalSection).to.be.true;
      });

      it('should have enableProfileSwitcher set to true', () => {
        const result = getUnavComponents();
        const config = result.profile.attributes.accountMenuContext.sharedContextConfig;
        expect(config.enableProfileSwitcher).to.be.true;
      });

      it('should have miniAppContext with logger', () => {
        const result = getUnavComponents();
        const config = result.profile.attributes.accountMenuContext.sharedContextConfig;
        expect(config.miniAppContext.logger).to.be.an('object');
      });

      it('should have all logger methods (trace, debug, info, warn, error)', () => {
        const result = getUnavComponents();
        const logger = result.profile.attributes.accountMenuContext.sharedContextConfig.miniAppContext.logger;
        expect(logger.trace).to.be.a('function');
        expect(logger.debug).to.be.a('function');
        expect(logger.info).to.be.a('function');
        expect(logger.warn).to.be.a('function');
        expect(logger.error).to.be.a('function');
      });

      it('should have logger methods that do not throw', () => {
        const result = getUnavComponents();
        const logger = result.profile.attributes.accountMenuContext.sharedContextConfig.miniAppContext.logger;
        expect(() => logger.trace('test')).to.not.throw();
        expect(() => logger.debug('test')).to.not.throw();
        expect(() => logger.info('test')).to.not.throw();
        expect(() => logger.warn('test')).to.not.throw();
        expect(() => logger.error('test')).to.not.throw();
      });

      it('should have complexConfig defaulting to null', () => {
        const result = getUnavComponents();
        const config = result.profile.attributes.accountMenuContext.sharedContextConfig;
        expect(config.complexConfig).to.be.null;
      });

      it('should have messageEventListener as a function', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        expect(listener).to.be.a('function');
      });

      it('should have signInCtaStyle defaulting to "secondary"', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.signInCtaStyle).to.equal('secondary');
      });

      it('should have isSignUpRequired defaulting to false', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.isSignUpRequired).to.be.false;
      });

      it('should have callbacks object', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.callbacks).to.be.an('object');
      });

      it('should have onSignIn callback as a function', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.callbacks.onSignIn).to.be.a('function');
      });

      it('should have onSignUp callback as a function', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.callbacks.onSignUp).to.be.a('function');
      });
    });

    describe('signInCtaStyle helper', () => {
      it('should return "primary" when metadata tag is set to primary', () => {
        createMetaTag('signin-cta-style', 'primary');
        const result = getUnavComponents();
        expect(result.profile.attributes.signInCtaStyle).to.equal('primary');
      });

      it('should return "secondary" by default when no metadata tag', () => {
        const result = getUnavComponents();
        expect(result.profile.attributes.signInCtaStyle).to.equal('secondary');
      });

      it('should return "secondary" when metadata tag has invalid value', () => {
        createMetaTag('signin-cta-style', 'invalid');
        const result = getUnavComponents();
        expect(result.profile.attributes.signInCtaStyle).to.equal('secondary');
      });
    });

    describe('messageEventListener helper', () => {
      it('should return default listener that handles SignOut event', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        
        let executed = false;
        const event = new CustomEvent('test', {
          detail: {
            name: 'System',
            payload: { subType: 'SignOut' },
            executeDefaultAction: () => { executed = true; },
          },
        });
        
        listener(event);
        expect(executed).to.be.true;
      });

      it('should ignore non-System events', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        
        let executed = false;
        const event = new CustomEvent('test', {
          detail: {
            name: 'CustomEvent',
            payload: { subType: 'SignOut' },
            executeDefaultAction: () => { executed = true; },
          },
        });
        
        listener(event);
        expect(executed).to.be.false;
      });

      it('should ignore events without executeDefaultAction function', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        
        const event = new CustomEvent('test', {
          detail: {
            name: 'System',
            payload: { subType: 'SignOut' },
          },
        });
        
        expect(() => listener(event)).to.not.throw();
      });

      it('should ignore events without name property', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        
        let executed = false;
        const event = new CustomEvent('test', {
          detail: {
            payload: { subType: 'SignOut' },
            executeDefaultAction: () => { executed = true; },
          },
        });
        
        listener(event);
        expect(executed).to.be.false;
      });

      it('should handle unknown event subTypes gracefully (default case)', () => {
        const result = getUnavComponents();
        const listener = result.profile.attributes.accountMenuContext.messageEventListener;
        
        let executed = false;
        const event = new CustomEvent('test', {
          detail: {
            name: 'System',
            payload: { subType: 'UnknownEvent' },
            executeDefaultAction: () => { executed = true; },
          },
        });
        
        listener(event);
        expect(executed).to.be.false;
      });
    });

    describe('help children helper', () => {
      it('should return default array with Support and Community', () => {
        const result = getUnavComponents();
        const children = result.help.attributes.children;
        expect(children).to.deep.equal([
          { type: 'Support' },
          { type: 'Community' },
        ]);
      });
    });

    describe('callbacks', () => {
      it('should call adobeIMS.signIn when onSignIn is invoked', () => {
        let signInCalled = false;
        window.adobeIMS = {
          signIn: () => { signInCalled = true; },
        };

        const result = getUnavComponents();
        result.profile.attributes.callbacks.onSignIn();
        
        expect(signInCalled).to.be.true;
      });

      it('should call adobeIMS.signIn when onSignUp is invoked', () => {
        let signUpCalled = false;
        window.adobeIMS = {
          signIn: () => { signUpCalled = true; },
        };

        const result = getUnavComponents();
        result.profile.attributes.callbacks.onSignUp();
        
        expect(signUpCalled).to.be.true;
      });

      it('should handle missing adobeIMS gracefully in onSignIn', () => {
        window.adobeIMS = undefined;
        
        const result = getUnavComponents();
        expect(() => result.profile.attributes.callbacks.onSignIn()).to.not.throw();
      });

      it('should handle missing adobeIMS gracefully in onSignUp', () => {
        window.adobeIMS = undefined;
        
        const result = getUnavComponents();
        expect(() => result.profile.attributes.callbacks.onSignUp()).to.not.throw();
      });
    });

    describe('appswitcher component', () => {
      it('should have name "app-switcher"', () => {
        const result = getUnavComponents();
        expect(result.appswitcher.name).to.equal('app-switcher');
      });

      it('should not have attributes', () => {
        const result = getUnavComponents();
        expect(result.appswitcher.attributes).to.be.undefined;
      });
    });

    describe('notifications component', () => {
      it('should have name "notifications"', () => {
        const result = getUnavComponents();
        expect(result.notifications.name).to.equal('notifications');
      });

      it('should have notificationsConfig', () => {
        const result = getUnavComponents();
        expect(result.notifications.attributes.notificationsConfig).to.be.an('object');
      });

      it('should have applicationContext', () => {
        const result = getUnavComponents();
        const context = result.notifications.attributes.notificationsConfig.applicationContext;
        expect(context).to.be.an('object');
      });

      it('should have appID defaulting to "adobecom"', () => {
        const result = getUnavComponents();
        const context = result.notifications.attributes.notificationsConfig.applicationContext;
        expect(context.appID).to.equal('adobecom');
      });
    });

    describe('help component', () => {
      it('should have name "help"', () => {
        const result = getUnavComponents();
        expect(result.help.name).to.equal('help');
      });

      it('should have attributes with children array', () => {
        const result = getUnavComponents();
        expect(result.help.attributes.children).to.be.an('array');
      });

      it('should have default children as Support and Community', () => {
        const result = getUnavComponents();
        const children = result.help.attributes.children;
        expect(children).to.have.lengthOf(2);
        expect(children[0].type).to.equal('Support');
        expect(children[1].type).to.equal('Community');
      });
    });

    describe('jarvis component', () => {
      it('should have name "jarvis"', () => {
        const result = getUnavComponents();
        expect(result.jarvis.name).to.equal('jarvis');
      });

      it('should have attributes object', () => {
        const result = getUnavComponents();
        expect(result.jarvis.attributes).to.be.an('object');
      });

      it('should have appid property', () => {
        const result = getUnavComponents();
        expect(result.jarvis.attributes).to.have.property('appid');
      });

      it('should have callbacks property', () => {
        const result = getUnavComponents();
        expect(result.jarvis.attributes).to.have.property('callbacks');
      });
    });

    describe('cart component', () => {
      it('should have name "cart"', () => {
        const result = getUnavComponents();
        expect(result.cart.name).to.equal('cart');
      });

      it('should not have attributes', () => {
        const result = getUnavComponents();
        expect(result.cart.attributes).to.be.undefined;
      });
    });

    describe('immutability', () => {
      it('should return fresh configuration each time', () => {
        const result1 = getUnavComponents();
        const result2 = getUnavComponents();
        
        // Should be different objects
        expect(result1).to.not.equal(result2);
        expect(result1.profile).to.not.equal(result2.profile);
      });

      it('should allow modification without affecting future calls', () => {
        const result1 = getUnavComponents();
        result1.profile.attributes.isSignUpRequired = true;
        result1.profile.name = 'modified';
        
        const result2 = getUnavComponents();
        expect(result2.profile.attributes.isSignUpRequired).to.be.false;
        expect(result2.profile.name).to.equal('profile');
      });
    });
  });
});
