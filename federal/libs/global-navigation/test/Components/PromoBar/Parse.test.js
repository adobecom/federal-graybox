import { expect } from '@esm-bundle/chai';
import { parsePromoBar } from '../../../src/Components/PromoBar/Parse';
import { promoBar } from '../../../src/Components/PromoBar/Render';

const parseHtml = (html) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};

const createPromo = (cells, classes = '') => {
  const element = parseHtml(`
    <div><div>#123456</div></div>
    <div>${cells.map((cell) => `<div>${cell}</div>`).join('')}</div>
  `);
  element.className = `promo-bar ${classes}`;
  return element;
};

describe('PromoBar regression', () => {
  const viewportCases = [
    [0, []],
    [1, [['mobile', 'tablet', 'desktop']]],
    [2, [['mobile', 'tablet'], ['desktop']]],
    [3, [['mobile'], ['tablet'], ['desktop']]],
    [4, Array.from({ length: 4 }, () => ['mobile', 'tablet', 'desktop'])],
  ];

  viewportCases.forEach(([count, expected]) => {
    it(`preserves viewport mapping for ${count} content cells`, () => {
      const cells = Array.from({ length: count }, (_, i) => `<p><strong>Offer ${i}</strong></p>`);
      const [data, errors] = parsePromoBar(createPromo(cells));
      expect(errors).to.have.lengthOf(0);
      expect(data.slots.map((slot) => slot.viewports)).to.deep.equal(expected);
      const output = parseHtml(promoBar(data));
      expect(output.querySelectorAll('.feds-promo-bar-slot')).to.have.lengthOf(count);
      data.slots.forEach((slot, i) => {
        const renderedSlot = output.querySelectorAll('.feds-promo-bar-slot')[i];
        slot.viewports.forEach((viewport) => {
          expect(renderedSlot.classList.contains(`feds-promo-bar-slot--${viewport}`)).to.equal(true);
        });
      });
    });
  });

  ['minimized', 'maximized', 'maximized-release'].forEach((variant) => {
    ['light', 'dark'].forEach((theme) => {
      it(`renders ${variant} with the ${theme} theme and CTAs`, () => {
        const element = createPromo([`
          <h5>Adobe Photoshop</h5>
          <p><strong>Save on Photoshop</strong></p>
          <p>Offer details</p>
          <p><strong><a href="https://www.adobe.com/buy" daa-ll="buy-offer">Buy now</a></strong></p>
          <p><em><a href="https://www.adobe.com/learn">Learn more</a></em></p>
        `], `${variant} ${theme}`);
        const [data] = parsePromoBar(element);
        const output = parseHtml(promoBar(data));
        const root = output.querySelector('.feds-promo-bar');
        expect(root.classList.contains(`feds-promo-bar--${variant}`)).to.equal(true);
        expect(root.classList.contains(`feds-promo-bar--${theme}`)).to.equal(true);
        expect(root.style.backgroundColor).to.equal('rgb(18, 52, 86)');
        expect(root.getAttribute('role')).to.equal('region');
        expect(root.getAttribute('aria-label')).to.equal('Promotion');
        expect(root.getAttribute('daa-lh')).to.equal('promo-bar');
        expect(root.textContent).to.include('Save on Photoshop');
        expect(root.querySelector('.feds-primary-cta').getAttribute('daa-ll')).to.equal('buy-offer');
        expect(root.querySelector('.feds-secondary-cta').textContent).to.equal('Learn more');
      });
    });
  });

  it('keeps the last background picture with its responsive sources', () => {
    const [data] = parsePromoBar(createPromo([`
      <picture><img src="https://example.com/icon.png" alt="Product icon"></picture>
      <picture><img src="https://example.com/old.png" alt="Old background"></picture>
      <picture><source srcset="https://example.com/background.webp" type="image/webp">
        <img src="https://example.com/background.png" alt="Background"></picture>
    `], 'maximized-release'));
    expect(data.slots[0].content.icon).to.equal('https://example.com/icon.png');
    const output = parseHtml(promoBar(data));
    const background = output.querySelector('.feds-promo-bar-bg');
    expect(background.querySelector('source').getAttribute('srcset')).to.equal('https://example.com/background.webp');
    expect(background.querySelector('img').getAttribute('src')).to.equal('https://example.com/background.png');
  });

  it('does not use the icon-only picture as a background', () => {
    const [data] = parsePromoBar(createPromo([
      '<picture><img src="https://example.com/icon.png" alt="Product icon"></picture>',
    ], 'maximized-release'));
    expect(data.slots[0].content.bgImage).to.equal(null);
    expect(parseHtml(promoBar(data)).querySelector('.feds-promo-bar-bg')).to.equal(null);
  });

  it('renders missing optional content without null or undefined text', () => {
    const [data] = parsePromoBar(createPromo([''], 'maximized-release'));
    const html = promoBar(data);
    expect(html).not.to.include('null');
    expect(html).not.to.include('undefined');
    expect(parseHtml(html).querySelectorAll('a, img, picture, h2')).to.have.lengthOf(0);
  });
});

describe('PromoBar M@S field copy', () => {
  const MAS_FIELD = (field) =>
    `https://mas.adobe.com/studio.html#content-type=merch-card&page=content&path=acom-cc&query=201bf3df&field=${field}`;
  const OFFERS = 'https://www.adobe.com/products/special-offers.html?promoid=MH16SFKV';

  it('renders a plain (unbolded) M@S field link as the promo copy', () => {
    const [data] = parsePromoBar(createPromo([`
      <p><a href="${MAS_FIELD('cardTitle')}">mas-field &#8594; Title</a></p>
      <p><strong><a href="${OFFERS}">See offers</a></strong></p>
    `]));
    const { content } = data.slots[0];
    expect(content.headline).to.contain('field=cardTitle');
    const output = parseHtml(promoBar(data));
    expect(output.querySelectorAll('a[href*="mas.adobe.com"]')).to.have.lengthOf(1);
    expect(content.primaryCta.text).to.equal('See offers');
  });

  it('keeps the CTA when the copy is a plain field link', () => {
    const [data] = parsePromoBar(createPromo([`
      <p><a href="${MAS_FIELD('cardTitle')}">mas-field &#8594; Title</a></p>
      <p><strong><a href="${OFFERS}">See offers</a></strong></p>
    `]));
    const output = parseHtml(promoBar(data));
    expect(output.textContent).to.contain('See offers');
  });

  it('still renders an inline bold headline mixed with M@S fields', () => {
    const [data] = parsePromoBar(createPromo([`
      <p>
        <a href="${MAS_FIELD('description')}">mas-field &#8594; Description</a>
        <strong>Save</strong>
        <a href="${MAS_FIELD('promoText')}">mas-field &#8594; Promo Text</a>
      </p>
      <p><strong><a href="${OFFERS}">See offers</a></strong></p>
    `]));
    const { content } = data.slots[0];
    expect(content.headline).to.contain('Save');
    const output = parseHtml(promoBar(data));
    expect(output.querySelectorAll('a[href*="mas.adobe.com"]')).to.have.lengthOf(2);
    expect(content.primaryCta.text).to.equal('See offers');
  });

  it('does not treat a background-image field as copy', () => {
    const [data] = parsePromoBar(createPromo([`
      <p><a href="${MAS_FIELD('backgroundImage')}">mas-field &#8594; Background</a></p>
      <p><strong><a href="${OFFERS}">See offers</a></strong></p>
    `]));
    expect(data.slots[0].content.headline).to.equal(null);
    const output = parseHtml(promoBar(data));
    expect(output.querySelectorAll('a[href*="mas.adobe.com"]')).to.have.lengthOf(0);
  });

  ['maximized', 'maximized-release'].forEach((variant) => {
    it(`maps a title field to headline and a description field to body (${variant})`, () => {
      const [data] = parsePromoBar(createPromo([`
        <p><a href="${MAS_FIELD('cardTitle')}">mas-field &#8594; Title</a></p>
        <p><a href="${MAS_FIELD('description')}">mas-field &#8594; Description</a></p>
        <p><strong><a href="${OFFERS}">See offers</a></strong></p>
      `], variant));
      const { content } = data.slots[0];
      expect(content.headline).to.contain('field=cardTitle');
      expect(content.body).to.contain('field=description');
      const output = parseHtml(promoBar(data));
      expect(output.querySelectorAll('a[href*="mas.adobe.com"]')).to.have.lengthOf(2);
      expect(content.primaryCta.text).to.equal('See offers');
    });
  });

  it('prefers a bold headline over an earlier plain field paragraph', () => {
    const [data] = parsePromoBar(createPromo([`
      <p><a href="${MAS_FIELD('description')}">mas-field &#8594; Description</a></p>
      <p><strong>Big Sale</strong></p>
      <p><strong><a href="${OFFERS}">See offers</a></strong></p>
    `], 'maximized'));
    const { content } = data.slots[0];
    expect(content.headline).to.contain('Big Sale');
    expect(content.headline).not.to.contain('field=description');
    expect(content.primaryCta.text).to.equal('See offers');
  });
});