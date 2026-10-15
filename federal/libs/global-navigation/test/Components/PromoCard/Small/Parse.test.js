import { expect } from '@esm-bundle/chai';
import { parsePromoCardSmall } from '../../../../src/Components/PromoCard/Small/Parse';
import { promoCardSmall } from '../../../../src/Components/PromoCard/Small/Render';
import { initMerchLinks } from '../../../../src/PostRendering/MerchLinks';
import { setMerchDecorators } from '../../../../src/Utils/Utils';

const MAS = (field) =>
  `https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=${field}`;
const MAS_IMAGE = 'https://mas.adobe.com/studio.html#content-type=merch-card&page=content&path=acom-cc&query=fe3d78d4-14c6-41d3-8c81-dcc0171b7421&field=backgroundImage';
const OST = 'https://www.adobe.com/tools/ost?osi=abc&type=price';

const build = (
  contentHtml,
  backgroundHtml = '<picture><img src="/bg.png" alt="decorative"></picture>',
) => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="promo-card-small">
      <div>${backgroundHtml}</div>
      <div>${contentHtml}</div>
    </div>
  `;
  return container.querySelector('.promo-card-small');
};

describe('parsePromoCardSmall — M@S / OST link preservation', () => {
  afterEach(() => setMerchDecorators({}));

  it('preserves a MAS background image field through rendering and late decoration', async () => {
    const el = build(
      '<p>Creative Cloud</p><p>Get all apps</p>',
      `<div><a href="${MAS_IMAGE}">MAS background image</a></div>`,
    );
    const [{ card }, errors] = parsePromoCardSmall(el);
    expect(errors).to.have.lengthOf(0);
    expect(card.bgImageSrc).to.equal('');
    expect(card.bgImageFieldHtml).to.contain('field=backgroundImage');

    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = promoCardSmall({ type: 'PromoCardSmall', card });
    document.body.append(mountpoint);
    setMerchDecorators({
      merch: (link) => {
        const field = document.createElement('mas-field');
        link.replaceWith(field);
        return field;
      },
    });

    try {
      await initMerchLinks(mountpoint);
      const background = mountpoint.querySelector('.promo-card-small__bg');
      const field = background.querySelector('mas-field');
      expect(field).to.not.equal(null);
      expect(mountpoint.querySelector('.promo-card-small__title').textContent.trim())
        .to.equal('Creative Cloud');

      field.innerHTML = '<picture data-role="mas-field-content"><img src="/mas-bg.png" alt="Sale"></picture>';
      field.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));
      expect(background.querySelector('picture img').getAttribute('src'))
        .to.equal('/mas-bg.png');
    } finally {
      mountpoint.remove();
    }
  });

  it('continues to use an authored picture in preference to a MAS field', () => {
    const el = build(
      '<p>Creative Cloud</p>',
      `<picture><img src="/bg.png" alt="Static"></picture>
       <a href="${MAS('backgroundImage')}">MAS background image</a>`,
    );
    const [{ card }, errors] = parsePromoCardSmall(el);
    expect(errors).to.have.lengthOf(0);
    expect(card.bgImageSrc).to.equal('/bg.png');
    expect(card.bgImageFieldHtml).to.equal(null);
    expect(promoCardSmall({ type: 'PromoCardSmall', card })).to.contain('src="/bg.png"');
  });

  it('reports a missing background when the field is not an image field', () => {
    const el = build(
      '<p>Creative Cloud</p>',
      `<a href="${MAS('cardTitle')}">Not a background image</a>`,
    );
    const [{ card }, errors] = parsePromoCardSmall(el);
    expect(card.bgImageFieldHtml).to.equal(null);
    expect(errors.some((error) => error.message.includes('missing background image')))
      .to.equal(true);
  });

  it('preserves an inline M@S field title/description as live anchors', () => {
    const el = build(`
      <p><a href="${MAS('cardTitle')}">mas-field: CC → Title</a></p>
      <p><a href="${MAS('shortDescription')}">mas-field: CC → Short Description</a></p>
    `);

    const [{ card }] = parsePromoCardSmall(el);

    // textContent is retained for the id/aria seed…
    expect(card.title).to.equal('mas-field: CC → Title');
    // …but the rendered HTML keeps the anchor so MerchLinks can resolve it.
    expect(card.titleHtml).to.contain('<a');
    expect(card.titleHtml).to.contain('field=cardTitle');
    expect(card.body).to.contain('<a');
    expect(card.body).to.contain('field=shortDescription');
  });

  it('preserves a strong-wrapped M@S field CTA and skips the typed CTA', () => {
    const el = build(`
      <p><a href="${MAS('cardTitle')}">mas-field: CC → Title</a></p>
      <p><strong><a href="${MAS('ctas%5Bx%5D')}">mas-field: CC → ctas[Buy now]</a></strong></p>
    `);

    const [{ card }] = parsePromoCardSmall(el);

    expect(card.ctaHtml).to.be.a('string');
    expect(card.ctaHtml).to.contain('<strong>');
    expect(card.ctaHtml).to.contain('field=ctas');
    expect(card.cta).to.equal(null);
  });

  it('preserves an OST price link authored in the description', () => {
    const el = build(`
      <p><a href="/photoshop">Photoshop</a></p>
      <p><a href="${OST}">US$22.99/mo</a></p>
    `);

    const [{ card }] = parsePromoCardSmall(el);

    expect(card.body).to.contain('<a');
    expect(card.body).to.contain('/tools/ost');
  });

  it('renders plain text (no anchor) when there is no commerce link', () => {
    const el = build(`
      <p>Students &amp; teachers save 71%.</p>
      <p>Get 20+ apps for less.</p>
      <p><em><a href="/buy">Buy now</a></em></p>
    `);

    const [{ card }] = parsePromoCardSmall(el);

    expect(card.titleHtml).to.equal('Students & teachers save 71%.');
    expect(card.body).to.equal('Get 20+ apps for less.');
    // An ordinary (non-commerce) CTA still flows through the typed path.
    expect(card.cta?.href).to.equal('/buy');
  });
});
