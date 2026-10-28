import { expect } from '@esm-bundle/chai';
import { setMiloConfig } from '../../src/Utils/Utils';
import {
  getLanguage,
  decorateEmail,
  decorateProfileLink,
  getOrgFlags,
  getProfileLabels,
  getSignInContext,
} from '../../src/PostRendering/Profile/Profile.utils';

describe('Profile utils', () => {
  before(() => {
    try {
      setMiloConfig({
        env: { name: 'stage' },
        locale: { prefix: '', ietf: 'en-US' },
        signInContext: { foo: 'bar' },
      });
    } catch (e) {
      // singleton already initialized in another test file
    }
  });

  describe('getLanguage', () => {
    it('defaults to en for empty locale', () => {
      expect(getLanguage('')).to.equal('en');
    });
    it('extracts the language segment', () => {
      expect(getLanguage('fr-FR')).to.equal('fr');
    });
    it('maps no-NO to nb', () => {
      expect(getLanguage('no-NO')).to.equal('nb');
    });
  });

  describe('decorateEmail', () => {
    it('leaves short emails intact', () => {
      expect(decorateEmail('jane@adobe.com')).to.equal('jane@adobe.com');
    });
    it('truncates a long username and domain, preserving the TLD', () => {
      const out = decorateEmail('averylongusername@averylongdomain.com');
      expect(out).to.equal('averylonguse…@averylongdom….com');
    });
  });

  describe('decorateProfileLink', () => {
    it('returns the default host when env has no override', () => {
      expect(decorateProfileLink('account', '?lang=en'))
        .to.equal('https://account.adobe.com?lang=en');
    });
    it('returns empty string for an unknown service', () => {
      // @ts-expect-error deliberately passing an invalid service
      expect(decorateProfileLink('nope')).to.equal('');
    });
  });

  describe('getOrgFlags', () => {
    it('returns false with no organizations', () => {
      expect(getOrgFlags(null).hasOrgs).to.equal(false);
      expect(getOrgFlags({ organizations: [] }).hasOrgs).to.equal(false);
    });
    it('is true for a DIRECT org admin', () => {
      const orgs = {
        organizations: [
          { orgType: 'DIRECT', groups: [{ role: 'GRP_ADMIN' }] },
        ],
      };
      expect(getOrgFlags(orgs).hasOrgs).to.equal(true);
    });
    it('is false for a non-admin member', () => {
      const orgs = {
        organizations: [
          { orgType: 'Enterprise', groups: [{ role: 'MEMBER' }] },
        ],
      };
      expect(getOrgFlags(orgs).hasOrgs).to.equal(false);
    });
  });

  describe('getProfileLabels', () => {
    it('reads keys from the map with fallbacks', () => {
      const labels = getProfileLabels(new Map([['sign-in', 'Login']]));
      expect(labels.signIn).to.equal('Login');
      expect(labels.signOut).to.equal('Sign out');
    });
  });

  describe('getSignInContext', () => {
    it('returns the configured sign-in context', () => {
      expect(getSignInContext()).to.deep.equal({ foo: 'bar' });
    });
  });
});
