import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { initEventRegistrationGating } from '../../src/PostRendering/EventRegistration';
import { setMiloConfig } from '../../src/Utils/Utils';

const setMetadata = (name, content) => {
  const meta = document.createElement('meta');
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
};

const buildMountpoint = () => {
  const mountpoint = document.createElement('div');
  mountpoint.innerHTML = `
    <ul class="feds-gnav-items">
      <li><a class="feds-nav-link" href="/sessions">Sessions</a></li>
      <li><a class="feds-primary-cta" href="/register" data-feds-hide-when-registered>Register</a></li>
    </ul>
  `;
  document.body.appendChild(mountpoint);
  return mountpoint;
};

describe('initEventRegistrationGating', () => {
  before(() => {
    try {
      setMiloConfig({
        env: { name: 'stage' },
        locale: { prefix: '', ietf: 'en-US' },
      });
    } catch {
      // Already initialized by another test file — fine, lanaLog just needs
      // *some* config present.
    }
  });

  afterEach(() => {
    // Flush any still-pending { once: true } registration:resolved listener
    // left by a test that attached one without dispatching (isRegistered:false
    // is a no-op for applyGate, and once-listeners self-remove after firing),
    // so listeners never leak across tests.
    window.dispatchEvent(new CustomEvent('registration:resolved', {
      detail: { isRegistered: false },
    }));
    document.head.querySelectorAll('meta[name="event-code"]').forEach((m) => m.remove());
    document.body.querySelectorAll('div').forEach((el) => el.remove());
    delete window.events;
    delete window.adobeIMS;
  });

  const isPending = (mountpoint) =>
    mountpoint
      .querySelector('[data-feds-hide-when-registered]')
      .hasAttribute('data-feds-registration-pending');

  it('does nothing when event-code metadata is absent', () => {
    const mountpoint = buildMountpoint();
    window.events = { getRegistrationStatus: () => Promise.reject(new Error('should not be called')) };
    initEventRegistrationGating(mountpoint);
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;
  });

  it('does nothing when there are no gated links, even with event-code present', () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = '<ul class="feds-gnav-items"><li><a href="/sessions">Sessions</a></li></ul>';
    document.body.appendChild(mountpoint);
    let called = false;
    window.events = { getRegistrationStatus: () => { called = true; return Promise.resolve({ isRegistered: true, inPersonAttendee: false }); } };
    initEventRegistrationGating(mountpoint);
    expect(called).to.be.false;
  });

  it('removes the gated CTA\'s <li> when the visitor is registered', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    window.events = {
      getRegistrationStatus: () => Promise.resolve({ isRegistered: true, inPersonAttendee: false }),
    };
    initEventRegistrationGating(mountpoint);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.not.exist;
    expect(mountpoint.querySelector('a[href="/sessions"]')).to.exist;
  });

  it('leaves the gated CTA in place when the visitor is not registered', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    window.events = {
      getRegistrationStatus: () => Promise.resolve({ isRegistered: false, inPersonAttendee: false }),
    };
    initEventRegistrationGating(mountpoint);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;
  });

  it('does not throw when window.events.getRegistrationStatus rejects', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    window.events = {
      getRegistrationStatus: () => Promise.reject(new Error('RF unavailable')),
    };
    expect(() => initEventRegistrationGating(mountpoint)).to.not.throw();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;
  });

  it('does not throw when window.events is undefined', () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    expect(() => initEventRegistrationGating(mountpoint)).to.not.throw();
  });

  it('rendered-early path: gates off the registration:resolved event when window.events is absent at call time', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    // window.events is NOT set yet at call time — this is the real-world
    // ordering where da-events dispatches registration:resolved (and only
    // later assigns window.events) after GNAV has already rendered.
    initEventRegistrationGating(mountpoint);
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;

    // da-events fires the event first, carrying the answer in detail.
    window.dispatchEvent(new CustomEvent('registration:resolved', {
      detail: { isRegistered: true, inPersonAttendee: false },
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.not.exist;
  });

  it('rendered-early path: leaves the CTA when the event reports not registered', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    initEventRegistrationGating(mountpoint);

    window.dispatchEvent(new CustomEvent('registration:resolved', {
      detail: { isRegistered: false, inPersonAttendee: false },
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;
  });

  it('rendered-early path: ignores a stale event once and does not re-gate on later events', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = buildMountpoint();
    initEventRegistrationGating(mountpoint);

    // First event says not registered — CTA stays.
    window.dispatchEvent(new CustomEvent('registration:resolved', {
      detail: { isRegistered: false, inPersonAttendee: false },
    }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;

    // Listener was { once: true }; a later event must NOT trigger removal.
    window.dispatchEvent(new CustomEvent('registration:resolved', {
      detail: { isRegistered: true, inPersonAttendee: false },
    }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.exist;
  });

  it('removes the whole .feds-product-entry-cta wrapper, not just the link', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <div class="feds-product-entry-cta">
        <a class="feds-primary-cta" href="/register" data-feds-hide-when-registered>Register</a>
      </div>
    `;
    document.body.appendChild(mountpoint);
    window.events = {
      getRegistrationStatus: () => Promise.resolve({ isRegistered: true, inPersonAttendee: false }),
    };
    initEventRegistrationGating(mountpoint);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('.feds-product-entry-cta')).to.not.exist;
  });

  it('falls back to removing the link itself when no li/product-entry-cta wrapper exists', async () => {
    setMetadata('event-code', 'max2026');
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = '<a class="feds-primary-cta" href="/register" data-feds-hide-when-registered>Register</a>';
    document.body.appendChild(mountpoint);
    window.events = {
      getRegistrationStatus: () => Promise.resolve({ isRegistered: true, inPersonAttendee: false }),
    };
    initEventRegistrationGating(mountpoint);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mountpoint.querySelector('[data-feds-hide-when-registered]')).to.not.exist;
  });

  describe('anti-flicker pre-hide', () => {
    it('pre-hides the CTA up front, before status resolves', () => {
      setMetadata('event-code', 'max2026');
      const mountpoint = buildMountpoint();
      window.events = {
        getRegistrationStatus: () => Promise.resolve({ isRegistered: false, inPersonAttendee: false }),
      };
      initEventRegistrationGating(mountpoint);
      // Synchronous: the attribute is set before the resolve microtask runs.
      expect(isPending(mountpoint)).to.be.true;
    });

    it('reveals the pre-hidden CTA once status resolves not-registered', async () => {
      setMetadata('event-code', 'max2026');
      const mountpoint = buildMountpoint();
      window.events = {
        getRegistrationStatus: () => Promise.resolve({ isRegistered: false, inPersonAttendee: false }),
      };
      initEventRegistrationGating(mountpoint);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(isPending(mountpoint)).to.be.false;
    });

    it('reveals the pre-hidden CTA when status resolution errors', async () => {
      setMetadata('event-code', 'max2026');
      const mountpoint = buildMountpoint();
      window.events = {
        getRegistrationStatus: () => Promise.reject(new Error('RF unavailable')),
      };
      initEventRegistrationGating(mountpoint);
      expect(isPending(mountpoint)).to.be.true;
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(isPending(mountpoint)).to.be.false;
    });

    it('reveals via the safety-net timeout if status never resolves', () => {
      const clock = sinon.useFakeTimers();
      try {
        setMetadata('event-code', 'max2026');
        const mountpoint = buildMountpoint();
        // No window.events and no registration:resolved event ever fires.
        initEventRegistrationGating(mountpoint);
        expect(isPending(mountpoint)).to.be.true;
        // Advance past the safety-net timeout — the CTA is revealed.
        clock.tick(5000);
        expect(isPending(mountpoint)).to.be.false;
      } finally {
        clock.restore();
      }
    });
  });
});
