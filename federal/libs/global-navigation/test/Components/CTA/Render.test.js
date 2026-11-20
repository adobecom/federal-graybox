import { expect } from '@esm-bundle/chai';
import { pinnedCTAs, primaryCTA, secondaryCTA } from '../../../src/Components/CTA/Render';

describe('CTA Render', () => {
  describe('pinnedCTAs', () => {
    const trial = {
      type: 'SecondaryCTA',
      text: 'Free trial',
      href: '/trial',
      daaLl: 'trial',
      ariaLabel: 'Start your free trial',
    };
    const buy = { type: 'PrimaryCTA', text: 'Buy now', href: '/buy' };

    it('renders both CTA types in one measured group in authored order', () => {
      const container = document.createElement('div');
      container.innerHTML = pinnedCTAs([trial, buy]);
      expect(container.querySelectorAll('.feds-pinned-cta')).to.have.lengthOf(1);
      const links = [...container.querySelectorAll('.feds-pinned-cta > a')];
      expect(links.map((link) => link.textContent)).to.deep.equal(['Free trial', 'Buy now']);
      expect(links.map((link) => link.className))
        .to.deep.equal(['feds-secondary-cta', 'feds-primary-cta']);
      expect(links[0].href).to.equal(new URL('/trial', window.location.href).href);
      expect(links[0].getAttribute('daa-ll')).to.equal('trial');
      expect(links[0].getAttribute('aria-label')).to.equal('Start your free trial');
    });

    it('does not reorder primary and secondary CTAs', () => {
      const container = document.createElement('div');
      container.innerHTML = pinnedCTAs([buy, trial]);
      expect([...container.querySelectorAll('a')].map((link) => link.textContent))
        .to.deep.equal(['Buy now', 'Free trial']);
    });

    for (const cta of [trial, buy]) {
      it(`keeps a single ${cta.type} pinned`, () => {
        const container = document.createElement('div');
        container.innerHTML = pinnedCTAs([cta]);
        expect(container.querySelectorAll('.feds-pinned-cta > a')).to.have.lengthOf(1);
        expect(container.querySelector('a').textContent).to.equal(cta.text);
      });
    }

    it('does not render an empty toolbar group', () => {
      expect(pinnedCTAs([])).to.equal('');
    });
  });

  describe('primaryCTA', () => {
    it('renders a plain CTA without the registration-gate marker', () => {
      const html = primaryCTA({
        type: 'PrimaryCTA',
        text: 'Learn more',
        href: 'https://example.com/',
      });
      expect(html).to.not.include('data-feds-hide-when-registered');
    });

    it('strips #_hide-when-registered from the href and marks the anchor', () => {
      const html = primaryCTA({
        type: 'PrimaryCTA',
        text: 'Register',
        href: 'https://max.adobe.com/register#_hide-when-registered',
      });
      const container = document.createElement('div');
      container.innerHTML = html;
      const anchor = container.querySelector('a.feds-primary-cta');
      expect(anchor.getAttribute('href')).to.equal('https://max.adobe.com/register');
      expect(anchor.hasAttribute('data-feds-hide-when-registered')).to.be.true;
    });

    it('composes the registration-gate marker with #_blank target handling', () => {
      const html = primaryCTA({
        type: 'PrimaryCTA',
        text: 'Register',
        href: 'https://max.adobe.com/register#_hide-when-registered#_blank',
      });
      const container = document.createElement('div');
      container.innerHTML = html;
      const anchor = container.querySelector('a.feds-primary-cta');
      expect(anchor.getAttribute('href')).to.equal('https://max.adobe.com/register');
      expect(anchor.getAttribute('target')).to.equal('_blank');
      expect(anchor.hasAttribute('data-feds-hide-when-registered')).to.be.true;
    });

    it('renders textContent with no surrounding whitespace so milo merch /^CTA +/ strips cleanly', () => {
      const html = primaryCTA({
        type: 'PrimaryCTA',
        text: 'CTA Buy now',
        href: 'https://www.adobe.com/tools/ost?type=checkoutUrl',
      });
      const container = document.createElement('div');
      container.innerHTML = html;
      const anchor = container.querySelector('a.feds-primary-cta');
      expect(anchor.textContent).to.equal('CTA Buy now');
      expect(anchor.textContent.replace(/^CTA +/, '')).to.equal('Buy now');
    });

    it('hides a MAS CTA authoring label until commerce resolves it', () => {
      const html = primaryCTA({
        type: 'PrimaryCTA',
        text: 'Mas-field: Free trial',
        href: 'https://mas.adobe.com/studio.html#path=acom-cc&field=ctas%5B5j7s8lw3qy%5D',
      });
      const container = document.createElement('div');
      container.innerHTML = html;
      const anchor = container.querySelector('a.feds-primary-cta');
      expect(anchor.hasAttribute('data-feds-merch-pending')).to.equal(true);
    });
  });

  describe('secondaryCTA', () => {
    it('strips #_hide-when-registered from the href and marks the anchor', () => {
      const html = secondaryCTA({
        type: 'SecondaryCTA',
        text: 'Register',
        href: 'https://max.adobe.com/register#_hide-when-registered',
      });
      const container = document.createElement('div');
      container.innerHTML = html;
      const anchor = container.querySelector('a.feds-secondary-cta');
      expect(anchor.getAttribute('href')).to.equal('https://max.adobe.com/register');
      expect(anchor.hasAttribute('data-feds-hide-when-registered')).to.be.true;
    });
  });
});
