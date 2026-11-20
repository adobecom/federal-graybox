import { expect } from '@esm-bundle/chai';
import { setLinkFilter, setMiloConfig, setSanitizedHTML } from '../../src/Utils/Utils';
import { parseNavigation } from '../../src/Parse/Parse';

const BLOCKED = 'Free trial';

const parse = (html) => {
  const mainNav = document.createElement('div');
  mainNav.innerHTML = html;
  return parseNavigation(mainNav, false);
};

const smallMenu = (title) => `
  <div><h5>${title}</h5><div class="links-card">
    <h3>Apps</h3><p><a href="/apps">All apps</a></p>
  </div></div>`;

describe('host link policy', () => {
  let root;
  let calls;
  const policy = (element) => {
    calls.push(element);
    return element.textContent.includes(BLOCKED);
  };

  before(() => {
    try {
      setMiloConfig({ env: { name: 'stage' }, locale: { prefix: '', ietf: 'en-US' } });
    } catch {
      // Already initialized by another test file.
    }
  });

  beforeEach(() => {
    calls = [];
    root = document.createElement('div');
    document.body.append(root);
  });

  afterEach(() => {
    setLinkFilter(undefined);
    root.remove();
    document.head.querySelector('meta[name="product-entry-cta"]')?.remove();
  });

  it('keeps everything when the host provides no policy', () => {
    setSanitizedHTML(root, `<a href="/trial">${BLOCKED}</a>`);
    expect(root.querySelector('a')).to.not.equal(null);
    expect(parse(`<li><a href="/trial">${BLOCKED}</a></li>`).components.length).to.equal(1);
  });

  describe('top-level items', () => {
    it('omits blocked dropdowns, links and CTAs before rendering, as C1 does', () => {
      setLinkFilter(policy);
      const result = parse(`
        ${smallMenu(BLOCKED)}
        ${smallMenu('Products')}
        <li><a href="/trial">${BLOCKED}</a></li>
        <li><strong><a href="/trial">${BLOCKED}</a></strong></li>
        <li><em><a href="/buy">Buy now</a></em></li>
        <li><a href="tel:1800">1800</a></li>`);

      expect(result.components.map((c) => c.type))
        .to.deep.equal(['SmallMenu', 'SecondaryCTA', 'Link']);
      expect(result.components[0].title).to.equal('Products');
      expect(result.components[1].text).to.equal('Buy now');
      expect(result.telephone.href).to.equal('tel:1800');
      expect(result.errors).to.deep.equal([]);
    });

    it('checks dropdown titles as headings and links/CTAs as anchors', () => {
      setLinkFilter(policy);
      parse(`${smallMenu('Products')}<li><em><a href="/buy">Buy now</a></em></li>`);

      const [title, cta] = calls;
      expect(title.tagName).to.equal('H2');
      expect(title.textContent).to.equal('Products');
      expect(cta.tagName).to.equal('A');
      expect(cta.getAttribute('href')).to.equal('/buy');
      expect(cta.textContent).to.equal('Buy now');
    });

    it('lifts the next allowed product entry CTA when the first is blocked', () => {
      const meta = document.createElement('meta');
      meta.name = 'product-entry-cta';
      meta.content = 'on';
      document.head.append(meta);
      setLinkFilter(policy);
      const entryCta = (text) => `<div><div class="product-entry-cta">
        <p><strong><a href="/x">${text}</a></strong></p></div></div>`;

      const result = parse(`${entryCta(BLOCKED)}${entryCta('Buy now')}`);

      expect(result.productCTA.cta.text).to.equal('Buy now');
    });
  });

  describe('rendered links', () => {
    it('removes blocked links and the wrappers they leave empty, up to the list item', () => {
      setLinkFilter(policy);
      setSanitizedHTML(root, `
        <ul class="feds-gnav-items">
          <li><a class="feds-link" href="/trial">${BLOCKED}</a></li>
          <li><a class="feds-link" href="/buy">Buy now</a></li>
        </ul>
        <div class="feds-pinned-cta"><a class="feds-primary-cta" href="/trial">${BLOCKED}</a></div>
        <ul class="links-card-links"><li><a href="/trial">${BLOCKED}</a></li></ul>
        <article class="featured-card"><h2>Photoshop</h2>
          <div class="footer-container"><a href="/trial">${BLOCKED}</a></div>
        </article>
        <p class="copy">Start a <a href="/trial">${BLOCKED}</a> today</p>`);

      const items = root.querySelectorAll('.feds-gnav-items > li');
      expect(items.length).to.equal(1);
      expect(items[0].textContent.trim()).to.equal('Buy now');
      expect(root.querySelector('.feds-pinned-cta')).to.equal(null);
      expect(root.querySelector('.links-card-links')).to.not.equal(null);
      expect(root.querySelector('.links-card-links li')).to.equal(null);
      expect(root.querySelector('.featured-card h2')).to.not.equal(null);
      expect(root.querySelector('.footer-container')).to.equal(null);
      expect(root.querySelector('.copy').textContent).to.include('Start a');
      expect(root.querySelectorAll('a').length).to.equal(1);
    });

    it('never removes the render root', () => {
      setLinkFilter(policy);
      setSanitizedHTML(root, `<a href="/trial">${BLOCKED}</a>`);
      expect(root.isConnected).to.equal(true);
      expect(root.querySelector('a')).to.equal(null);
    });

    it('supports policies that remove the link wrapper themselves', () => {
      setLinkFilter((link) => {
        if (!link.textContent.includes(BLOCKED)) return false;
        link.parentElement.remove();
        return true;
      });
      setSanitizedHTML(root, `<ul>
        <li><p><em><a href="/trial">${BLOCKED}</a></em></p></li>
        <li><a href="/buy">Buy now</a></li>
      </ul>`);

      expect(root.querySelectorAll('li').length).to.equal(1);
      expect(root.querySelector('ul')).to.not.equal(null);
    });

    it('skips links C1 does not check, but still checks promo CTAs', () => {
      setLinkFilter(policy);
      setSanitizedHTML(root, `
        <a class="feds-brand" href="/">${BLOCKED}</a>
        <a class="feds-skip-link" href="#main">${BLOCKED}</a>
        <a class="trap-focus-gnav" href="#">${BLOCKED}</a>
        <ul class="feds-breadcrumbs"><li><a href="/free">${BLOCKED}</a></li></ul>
        <div class="feds-promo-bar">
          <p>Try a <a href="/copy">${BLOCKED}</a></p>
          <a class="feds-primary-cta" href="/trial">${BLOCKED}</a>
        </div>`);

      expect(root.querySelectorAll('a').length).to.equal(5);
      expect(root.querySelector('.feds-promo-bar .feds-primary-cta')).to.equal(null);
      expect(calls.length).to.equal(1);
    });
  });

  it('keeps content when the host policy throws', () => {
    const { lana } = window;
    const logs = [];
    window.lana = { log: (message) => logs.push(message) };
    setLinkFilter(() => { throw new Error('policy failed'); });
    try {
      setSanitizedHTML(root, `<a href="/trial">${BLOCKED}</a>`);
      const result = parse(`<li><a href="/trial">${BLOCKED}</a></li>`);

      expect(root.querySelector('a')).to.not.equal(null);
      expect(result.components.length).to.equal(1);
      expect(logs.length).to.equal(2);
      expect(logs[0]).to.include('Link policy failed: Error: policy failed');
    } finally {
      window.lana = lana;
    }
  });
});
