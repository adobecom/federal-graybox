import { expect } from '@esm-bundle/chai';
import { primaryCTA, secondaryCTA } from '../../../src/Components/CTA/Render';

describe('CTA Render', () => {
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
