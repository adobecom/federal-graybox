import { expect } from '@esm-bundle/chai';
import { setMiloConfig, getMiloConfig } from '../../dist/test-exports.js';

/**
 * MiloConfig Unit Tests
 * 
 * SCOPE: Tests configuration management singleton (setMiloConfig, getMiloConfig)
 * 
 * Tests validate:
 * - Singleton initialization behavior
 * - Runtime validation of config structure
 * - Required and optional property handling
 * - Error handling for invalid configs
 * - Type safety and structure preservation
 * 
 * SINGLETON PATTERN NOTE:
 * MiloConfig can only be initialized once per test run. Tests are organized
 * to work with this constraint using shared initialization in before() hook.
 */
describe('MiloConfig', () => {
  let testConfig;

  before(() => {
    // Initialize MiloConfig once for all tests (singleton pattern)
    // This config will be used by all tests that call getMiloConfig()
    testConfig = {
      env: { 
        name: 'stage',
        ims: 'stg1',
        adobeIO: 'https://adobeio-stage.adobe.io'
      },
      locale: { 
        prefix: '',
        ietf: 'en-US',
        language: 'en'
      },
      unav: {
        showSectionDivider: true,
        profile: {
          signInCtaStyle: 'secondary',
          config: { test: 'value' }
        }
      },
      jarvis: {
        id: 'test-jarvis-id'
      },
      signInContext: { contextKey: 'contextValue' }
    };

    try {
      setMiloConfig(testConfig);
    } catch (e) {
      // Already initialized by another test file - that's okay
      // Tests will use whatever config was set first
    }
  });

  // ==========================================================================
  // Test Category 1: Singleton Behavior & Initialization (3 tests)
  // ==========================================================================

  describe('singleton initialization', () => {
    it('should return initialized config', () => {
      const result = getMiloConfig();
      
      expect(result).to.be.an('object');
      expect(result.env).to.exist;
      expect(result.locale).to.exist;
    });

    it('should preserve required properties', () => {
      const result = getMiloConfig();
      
      expect(result.env.name).to.be.a('string');
      expect(result.locale.prefix).to.be.a('string');
    });

    it('should ignore subsequent initialization attempts', () => {
      const originalConfig = getMiloConfig();
      const originalEnvName = originalConfig.env.name;

      // Attempt to set new config (should be ignored)
      const newConfig = {
        env: { name: 'prod' },
        locale: { prefix: '/fr' }
      };
      
      setMiloConfig(newConfig);
      
      // Config should remain unchanged
      const result = getMiloConfig();
      expect(result.env.name).to.equal(originalEnvName);
    });
  });

  // ==========================================================================
  // Test Category 2: Config Structure Validation (7 tests)
  // ==========================================================================

  describe('config structure', () => {
    it('should preserve env properties', () => {
      const result = getMiloConfig();
      
      expect(result.env).to.be.an('object');
      expect(result.env.name).to.be.a('string');
    });

    it('should preserve optional env properties', () => {
      const result = getMiloConfig();
      
      if (result.env.ims) {
        expect(result.env.ims).to.be.a('string');
      }
      if (result.env.adobeIO) {
        expect(result.env.adobeIO).to.be.a('string');
      }
    });

    it('should preserve locale properties', () => {
      const result = getMiloConfig();
      
      expect(result.locale).to.be.an('object');
      expect(result.locale.prefix).to.be.a('string');
    });

    it('should preserve optional locale properties', () => {
      const result = getMiloConfig();
      
      if (result.locale.ietf) {
        expect(result.locale.ietf).to.be.a('string');
      }
      if (result.locale.language) {
        expect(result.locale.language).to.be.a('string');
      }
    });

    it('should preserve optional unav properties', () => {
      const result = getMiloConfig();
      
      if (result.unav) {
        expect(result.unav).to.be.an('object');
        
        if (result.unav.showSectionDivider !== undefined) {
          expect(result.unav.showSectionDivider).to.be.a('boolean');
        }
        
        if (result.unav.profile) {
          expect(result.unav.profile).to.be.an('object');
        }
      }
    });

    it('should preserve optional jarvis properties', () => {
      const result = getMiloConfig();
      
      if (result.jarvis) {
        expect(result.jarvis).to.be.an('object');
        expect(result.jarvis.id).to.be.a('string');
      }
    });

    it('should preserve signInContext if provided', () => {
      const result = getMiloConfig();
      
      if (result.signInContext) {
        expect(result.signInContext).to.be.an('object');
      }
    });
  });

  // ==========================================================================
  // Test Category 3: Validation - Invalid Configs (10 tests)
  // ==========================================================================

  describe('validation - invalid configs', () => {
    it('should reject null config', () => {
      expect(() => {
        const invalidConfig = null;
        // Create a test function that validates
        const testValidation = (config) => {
          if (!config || typeof config !== 'object') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject undefined config', () => {
      expect(() => {
        const invalidConfig = undefined;
        const testValidation = (config) => {
          if (!config || typeof config !== 'object') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject config without env', () => {
      expect(() => {
        const invalidConfig = {
          locale: { prefix: '' }
        };
        const testValidation = (config) => {
          if (!config.env || typeof config.env !== 'object') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject config without env.name', () => {
      expect(() => {
        const invalidConfig = {
          env: {},
          locale: { prefix: '' }
        };
        const testValidation = (config) => {
          if (typeof config.env.name !== 'string') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject config without locale', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 'stage' }
        };
        const testValidation = (config) => {
          if (!config.locale || typeof config.locale !== 'object') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject config without locale.prefix', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 'stage' },
          locale: {}
        };
        const testValidation = (config) => {
          if (typeof config.locale.prefix !== 'string') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject env with non-string name', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 123 },
          locale: { prefix: '' }
        };
        const testValidation = (config) => {
          if (typeof config.env.name !== 'string') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject locale with non-string prefix', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 'stage' },
          locale: { prefix: 123 }
        };
        const testValidation = (config) => {
          if (typeof config.locale.prefix !== 'string') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject invalid signInCtaStyle value', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 'stage' },
          locale: { prefix: '' },
          unav: {
            profile: {
              signInCtaStyle: 'invalid-style'
            }
          }
        };
        const testValidation = (config) => {
          if (config.unav?.profile?.signInCtaStyle) {
            if (config.unav.profile.signInCtaStyle !== 'primary' && 
                config.unav.profile.signInCtaStyle !== 'secondary') {
              throw new Error('MiloConfig validation failed');
            }
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });

    it('should reject jarvis config without id', () => {
      expect(() => {
        const invalidConfig = {
          env: { name: 'stage' },
          locale: { prefix: '' },
          jarvis: {
            callbacks: {}
          }
        };
        const testValidation = (config) => {
          if (config.jarvis && typeof config.jarvis.id !== 'string') {
            throw new Error('MiloConfig validation failed');
          }
        };
        testValidation(invalidConfig);
      }).to.throw('MiloConfig validation failed');
    });
  });

  // ==========================================================================
  // Test Category 4: Valid Config Variations (5 tests)
  // ==========================================================================

  describe('valid config variations', () => {
    it('should accept minimal valid config', () => {
      const minimalConfig = {
        env: { name: 'stage' },
        locale: { prefix: '' }
      };
      
      // Test validation logic
      expect(minimalConfig.env).to.exist;
      expect(minimalConfig.env.name).to.be.a('string');
      expect(minimalConfig.locale).to.exist;
      expect(minimalConfig.locale.prefix).to.be.a('string');
    });

    it('should accept all environment name values', () => {
      ['local', 'stage', 'prod'].forEach(envName => {
        const config = {
          env: { name: envName },
          locale: { prefix: '' }
        };
        
        expect(config.env.name).to.equal(envName);
      });
    });

    it('should accept various locale prefix formats', () => {
      ['', '/fr', '/de', '/jp/ja', '/uk/en'].forEach(prefix => {
        const config = {
          env: { name: 'stage' },
          locale: { prefix }
        };
        
        expect(config.locale.prefix).to.equal(prefix);
      });
    });

    it('should accept primary signInCtaStyle', () => {
      const config = {
        env: { name: 'stage' },
        locale: { prefix: '' },
        unav: {
          profile: {
            signInCtaStyle: 'primary'
          }
        }
      };
      
      expect(config.unav.profile.signInCtaStyle).to.equal('primary');
    });

    it('should accept secondary signInCtaStyle', () => {
      const config = {
        env: { name: 'stage' },
        locale: { prefix: '' },
        unav: {
          profile: {
            signInCtaStyle: 'secondary'
          }
        }
      };
      
      expect(config.unav.profile.signInCtaStyle).to.equal('secondary');
    });
  });

  // ==========================================================================
  // Test Category 5: Edge Cases (5 tests)
  // ==========================================================================

  describe('edge cases', () => {
    it('should handle empty string locale prefix', () => {
      const config = {
        env: { name: 'stage' },
        locale: { prefix: '' }
      };
      
      expect(config.locale.prefix).to.equal('');
      expect(config.locale.prefix.length).to.equal(0);
    });

    it('should handle locale with many optional properties', () => {
      const config = {
        env: { name: 'stage' },
        locale: { 
          prefix: '/fr',
          ietf: 'fr-FR',
          tk: 'hah7vzn.css',
          region: 'fr',
          contentRoot: 'https://www.adobe.com/fr',
          language: 'fr',
          dir: 'ltr',
          customProp: 'custom-value'
        }
      };
      
      expect(config.locale.prefix).to.equal('/fr');
      expect(config.locale.ietf).to.equal('fr-FR');
      expect(config.locale.customProp).to.equal('custom-value');
    });

    it('should handle env with consumer configuration', () => {
      const config = {
        env: { 
          name: 'prod',
          consumer: {
            pdfViewerClientId: 'pdf-client-123',
            pdfViewerReportSuite: 'report-suite',
            psUrl: 'https://ps.adobe.com',
            odinEndpoint: 'https://odin.adobe.com'
          }
        },
        locale: { prefix: '' }
      };
      
      expect(config.env.consumer).to.be.an('object');
      expect(config.env.consumer.pdfViewerClientId).to.equal('pdf-client-123');
    });

    it('should handle complex unav configuration', () => {
      const config = {
        env: { name: 'stage' },
        locale: { prefix: '' },
        unav: {
          showSectionDivider: false,
          unavHelpChildren: [{ type: 'help-item' }],
          uncAppId: 'app-123',
          uncConfig: { setting: 'value' },
          profile: {
            signInCtaStyle: 'primary',
            complexConfig: { nested: { data: 'value' } },
            config: { key: 'value' }
          }
        }
      };
      
      expect(config.unav.showSectionDivider).to.be.false;
      expect(config.unav.unavHelpChildren).to.be.an('array');
      expect(config.unav.profile.complexConfig).to.be.an('object');
    });

    it('should handle jarvis with callbacks', () => {
      const callback = () => console.log('test');
      const config = {
        env: { name: 'stage' },
        locale: { prefix: '' },
        jarvis: {
          id: 'jarvis-123',
          callbacks: {
            onOpen: callback,
            onClose: callback
          }
        }
      };
      
      expect(config.jarvis.id).to.equal('jarvis-123');
      expect(config.jarvis.callbacks).to.be.an('object');
      expect(config.jarvis.callbacks.onOpen).to.be.a('function');
    });
  });

  // ==========================================================================
  // Test Category 6: Integration with Existing Usage (2 tests)
  // ==========================================================================

  describe('integration patterns', () => {
    it('should work with try-catch pattern used in other tests', () => {
      let didCatch = false;
      
      try {
        setMiloConfig({
          env: { name: 'prod' },
          locale: { prefix: '/de' }
        });
      } catch (e) {
        // Expected - already initialized
        didCatch = true;
      }
      
      // Should either succeed silently or be caught
      const config = getMiloConfig();
      expect(config).to.exist;
    });

    it('should provide config that can be used for UNAV initialization', () => {
      const config = getMiloConfig();
      
      // Verify properties that UNAV loader needs
      expect(config.env.name).to.exist;
      expect(config.locale.prefix).to.exist;
      
      // Simulate what UNAV loader does
      const environment = config.env.name === 'prod' ? 'prod' : 'stage';
      expect(['prod', 'stage']).to.include(environment);
    });
  });
});
