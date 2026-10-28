import { expect } from '@esm-bundle/chai';
import { setMiloConfig } from '../../src/Utils/Utils';
import { setPlaceholders } from '../../src/Utils/Placeholders';
import { loadProfile } from '../../src/PostRendering/Profile/Profile.loader';

/**
 * Legacy Profile loader tests.
 *
 * Covers the signed-out sign-in button, the signed-in avatar + dropdown,
 * admin-console gating, sign-out wiring, reload, and the missing-container
 * error path. window.adobeIMS / adobeid / fetch are stubbed per test.
 */

const makeNav = () => {
  const nav = document.createElement('nav');
  const profile = document.createElement('div');
  profile.className = 'feds-profile-new';
  nav.appendChild(profile);
  document.body.appendChild(nav);
  return nav;
};

describe('Profile loader', () => {
  let nav;
  let originalIMS;
  let originalAdobeId;
  let originalFetch;

  before(() => {
    try {
      setMiloConfig({
        env: { name: 'stage', adobeIO: 'io.example.com' },
        locale: { prefix: '', ietf: 'en-US' },
      });
    } catch (e) { /* singleton */ }
    try {
      setPlaceholders(Promise.resolve(new Map([
        ['sign-in', 'Sign in'],
        ['profile-button', 'Profile'],
        ['sign-out', 'Sign out'],
        ['view-account', 'View account'],
        ['go-to-admin-console', 'Go to Admin Console'],
      ])));
    } catch (e) { /* singleton */ }
  });

  beforeEach(() => {
    originalIMS = window.adobeIMS;
    originalAdobeId = window.adobeid;
    originalFetch = window.fetch;
    window.adobeid = { client_id: 'test-client' };
  });

  afterEach(() => {
    window.adobeIMS = originalIMS;
    window.adobeid = originalAdobeId;
    window.fetch = originalFetch;
    if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
    nav = null;
  });

  it('returns a RecoverableError when the container is missing', async () => {
    const bareNav = document.createElement('nav');
    const result = await loadProfile(bareNav, null);
    expect(result.message).to.equal('missing ".feds-profile-new" container');
  });

  describe('signed out', () => {
    beforeEach(() => {
      window.adobeIMS = { isSignedInUser: () => false };
    });

    it('renders a sign-in button and wires it to IMS signIn', async () => {
      let signInCalled = false;
      window.adobeIMS.signIn = () => { signInCalled = true; };
      nav = makeNav();

      const result = await loadProfile(nav, null);
      expect(result.reloadProfile).to.be.a('function');

      const button = nav.querySelector('.feds-signIn');
      expect(button).to.not.equal(null);
      expect(button.textContent).to.equal('Sign in');

      button.click();
      expect(signInCalled).to.equal(true);
    });
  });

  describe('signed in', () => {
    const profileData = {
      userId: 'user-123',
      displayName: 'Jane Doe',
      email: 'jane@adobe.com',
    };

    const stubSignedIn = ({ orgs = { organizations: [] } } = {}) => {
      window.adobeIMS = {
        isSignedInUser: () => true,
        getAccessToken: () => ({ token: 'tok' }),
        getProfile: async () => profileData,
        getOrganizations: async () => orgs,
        signOut: () => {},
      };
      window.fetch = async () => ({
        ok: true,
        json: async () => ({ images: { 138: 'https://avatar.example/x.png' } }),
      });
    };

    it('renders the avatar button and dropdown menu', async () => {
      stubSignedIn();
      nav = makeNav();

      await loadProfile(nav, null);

      const button = nav.querySelector('.feds-profile-new-button');
      expect(button).to.not.equal(null);
      expect(button.getAttribute('aria-label')).to.equal('Jane Doe');

      const img = button.querySelector('.feds-profile-new-img');
      expect(img.getAttribute('src')).to.equal('https://avatar.example/x.png');

      const menu = nav.querySelector('#feds-profile-new-menu');
      expect(menu).to.not.equal(null);
      expect(menu.querySelector('.feds-profile-new-name').textContent)
        .to.equal('Jane Doe');
      expect(menu.querySelector('.feds-profile-new-signout')).to.not.equal(null);
    });

    it('toggles aria-expanded on button click', async () => {
      stubSignedIn();
      nav = makeNav();
      await loadProfile(nav, null);

      const button = nav.querySelector('.feds-profile-new-button');
      expect(button.getAttribute('aria-expanded')).to.equal('false');
      button.click();
      expect(button.getAttribute('aria-expanded')).to.equal('true');
      button.click();
      expect(button.getAttribute('aria-expanded')).to.equal('false');
    });

    it('omits Admin Console without an admin org', async () => {
      stubSignedIn();
      nav = makeNav();
      await loadProfile(nav, null);
      const actions = nav.querySelectorAll('.feds-profile-new-action');
      // Only sign-out is present.
      expect(actions.length).to.equal(1);
    });

    it('shows Admin Console for an admin org', async () => {
      stubSignedIn({
        orgs: {
          organizations: [
            { orgType: 'DIRECT', groups: [{ role: 'GRP_ADMIN' }] },
          ],
        },
      });
      nav = makeNav();
      await loadProfile(nav, null);
      const actions = nav.querySelectorAll('.feds-profile-new-action');
      expect(actions.length).to.equal(2);
    });

    it('wires sign-out to IMS signOut', async () => {
      stubSignedIn();
      let signOutCalled = false;
      window.fetch = async () => ({
        ok: true,
        json: async () => ({ images: { 138: 'x' } }),
      });
      nav = makeNav();
      await loadProfile(nav, null);
      window.adobeIMS.signOut = () => { signOutCalled = true; };

      nav.querySelector('.feds-profile-new-signout').click();
      expect(signOutCalled).to.equal(true);
    });

    it('reloadProfile re-decorates the container', async () => {
      stubSignedIn();
      nav = makeNav();
      const result = await loadProfile(nav, null);

      expect(nav.querySelectorAll('.feds-profile-new-button').length).to.equal(1);
      await result.reloadProfile();
      expect(nav.querySelectorAll('.feds-profile-new-button').length).to.equal(1);
    });

    it('bails without rendering when the profile fetch fails', async () => {
      stubSignedIn();
      window.fetch = async () => ({ ok: false, statusText: 'Boom', url: 'u' });
      nav = makeNav();
      await loadProfile(nav, null);
      expect(nav.querySelector('.feds-profile-new-button')).to.equal(null);
    });
  });
});
