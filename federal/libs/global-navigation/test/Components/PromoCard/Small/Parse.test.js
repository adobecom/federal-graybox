import { expect } from '@esm-bundle/chai';
import { parsePromoCardSmall } from '../../../../src/Components/PromoCard/Small/Parse';

const MAS = (field) =>
  `https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=${field}`;
const OST = 'https://www.adobe.com/tools/ost?osi=abc&type=price';

const build = (contentHtml) => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="promo-card-small">
      <div><picture><img src="/bg.png" alt="decorative"></picture></div>
      <div>${contentHtml}</div>
    </div>
  `;
  return container.querySelector('.promo-card-small');
};

describe('parsePromoCardSmall — M@S / OST link preservation', () => {
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
