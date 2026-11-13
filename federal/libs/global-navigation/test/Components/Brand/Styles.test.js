import { expect } from '@esm-bundle/chai';
import { parseBrand } from '../../../src/Components/Brand/Parse';
import { brand as renderBrand } from '../../../src/Components/Brand/Render';
import { setSanitizedHTML } from '../../../src/Utils/Utils';

describe('Brand minimum-width reservation', () => {
  let stylesheet;
  let container;

  before(async () => {
    stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('../../../src/Components/Brand/brand.css', import.meta.url).href;
    await new Promise((resolve, reject) => {
      stylesheet.onload = resolve;
      stylesheet.onerror = reject;
      document.head.append(stylesheet);
    });
  });

  after(() => stylesheet.remove());
  afterEach(() => container?.remove());

  const createBrand = (variant, authoredWidth) => {
    const source = document.createElement('div');
    const links = (imageVariant) => ['light', 'dark'].map(theme => {
      const width = imageVariant === variant && authoredWidth !== undefined
        ? ` | ${authoredWidth}` : '';
      return `<a href="https://example.com/${imageVariant}-${theme}.svg">${imageVariant}-${theme}.svg | Adobe${width}</a>`;
    }).join('');
    source.innerHTML = `
      <div><a href="/">Adobe</a></div>
      <div><div>${links('mobile')}</div><div>${links('desktop')}</div></div>`;
    const [parsed, errors] = parseBrand(source);
    expect(errors).to.have.lengthOf(0);
    container = document.createElement('div');
    container.style.display = 'flex';
    setSanitizedHTML(container, `
      <div class="feds-brand-wrapper">
        ${renderBrand(parsed).replace(/\ssrc="[^"]*"/g, '')}
      </div>
      <span>Navigation</span>`);
    container.querySelector('.feds-brand').style.display = 'flex';
    container.querySelector(`.${variant}-brand`).style.display = 'flex';
    container.querySelector(`.${variant === 'desktop' ? 'mobile' : 'desktop'}-brand`)
      .style.display = 'none';
    container.querySelectorAll('img').forEach(image => { image.alt = ''; });
    document.body.append(container);
    return container.querySelector(`.${variant}-brand`);
  };

  const loadLogo = async (image, width) => {
    image.src = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="16"></svg>`,
    )}`;
    await image.decode();
  };

  for (const [variant, width] of [['desktop', 67], ['mobile', 18]]) {
    it(`should reserve ${width}px before the ${variant} logo loads and keep the menu stable`, async () => {
      const brand = createBrand(variant);
      expect(getComputedStyle(brand).minWidth).to.equal(`${width}px`);
      expect(brand.getBoundingClientRect().width).to.equal(width);
      const menuX = container.lastElementChild.getBoundingClientRect().x;
      await loadLogo(brand.querySelector('img'), width);
      expect(brand.getBoundingClientRect().width).to.equal(width);
      expect(container.lastElementChild.getBoundingClientRect().x).to.equal(menuX);
    });

    it(`should allow a wider ${variant} logo to retain its natural width`, async () => {
      const brand = createBrand(variant);
      const image = brand.querySelector('img');
      await loadLogo(image, 183);
      expect(image.getBoundingClientRect().width).to.equal(183);
      expect(brand.getBoundingClientRect().width).to.equal(183);
      expect(image.hasAttribute('width')).to.equal(false);
      expect(image.hasAttribute('height')).to.equal(false);
    });

    it(`should reserve an authored ${variant} width before loading and keep the menu stable`, async () => {
      const brand = createBrand(variant, 183);
      expect(getComputedStyle(brand).minWidth).to.equal('183px');
      expect(brand.getBoundingClientRect().width).to.equal(183);
      const menuX = container.lastElementChild.getBoundingClientRect().x;
      await loadLogo(brand.querySelector('img'), 183);
      expect(brand.getBoundingClientRect().width).to.equal(183);
      expect(container.lastElementChild.getBoundingClientRect().x).to.equal(menuX);
    });

    it(`should allow a ${variant} logo to grow beyond its authored minimum`, async () => {
      const brand = createBrand(variant, 183);
      await loadLogo(brand.querySelector('img'), 220);
      expect(brand.getBoundingClientRect().width).to.equal(220);
    });

    it(`should reserve space across ${variant} light, dark, and scroll themes`, async () => {
      const brand = createBrand(variant);
      container.classList.add('global-navigation');
      const images = [...brand.querySelectorAll('img')];
      await Promise.all(images.map(image => loadLogo(image, width)));
      for (const state of ['light', 'dark', 'scroll']) {
        container.classList.toggle('feds-dark-bg', state === 'dark');
        container.classList.toggle('feds-header-scrolled', state === 'scroll');
        const active = state === 'light' ? 0 : state === 'dark' ? 1 : 2;
        images.forEach((image, index) => {
          expect(getComputedStyle(image).display === 'none').to.equal(index !== active);
        });
        expect(brand.getBoundingClientRect().width).to.equal(width);
      }
    });
  }
});
