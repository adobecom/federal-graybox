import { expect } from '@esm-bundle/chai';
import { parseLinksCard } from '../../../src/Components/LinksCard/Parse';

const MAS_FIELD =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=shortDescription';
const OST = 'https://www.adobe.com/tools/ost?osi=abc&type=price';

const build = (inner) => {
  const container = document.createElement('div');
  container.innerHTML = `<div class="links-card">${inner}</div>`;
  return container.querySelector('.links-card');
};

describe('parseLinksCard — commerce description support', () => {
  it('treats a M@S field link after a product link as that link’s description', () => {
    const el = build(`
      <h2>All-in-one</h2>
      <p><a href="/creativecloud">Creative Cloud Pro for Students</a></p>
      <p><a href="${MAS_FIELD}">mas-field: shortDescription</a></p>
    `);

    const [{ card }] = parseLinksCard(el);

    // The mas-field is folded into the description, not a standalone link.
    expect(card.links).to.have.lengthOf(1);
    expect(card.links[0].text).to.equal('Creative Cloud Pro for Students');
    expect(card.links[0].description).to.contain('feds-commerce-placeholder');
    expect(card.links[0].description).to.contain('data-commerce-href');
    expect(card.links[0].description).to.contain('field=shortDescription');
    // The anchor is replaced by a non-anchor placeholder (no nested <a>).
    expect(card.links[0].description).to.not.contain('<a');
  });

  it('swaps every commerce link when a description holds text + multiple prices', () => {
    const el = build(`
      <h2>Photography &amp; design</h2>
      <p><a href="/photoshop">Photoshop for Students</a></p>
      <p>Image editing and design. <a href="${OST}">US$89.99/mo</a> can be saved <a href="${MAS_FIELD}">mas-field: prices</a> now</p>
    `);

    const [{ card }] = parseLinksCard(el);

    // Only the product link is standalone; both commerce links became placeholders.
    expect(card.links).to.have.lengthOf(1);
    expect(card.links[0].description).to.not.contain('<a');
    expect((card.links[0].description.match(/feds-commerce-placeholder/g) ?? [])).to.have.lengthOf(2);
    expect(card.links[0].description).to.contain('Image editing and design.');
  });

  it('treats an OST price link after a product link as its description', () => {
    const el = build(`
      <h2>Plans</h2>
      <p><a href="/photoshop">Photoshop</a></p>
      <p><a href="${OST}">US$22.99/mo</a></p>
    `);

    const [{ card }] = parseLinksCard(el);

    expect(card.links).to.have.lengthOf(1);
    expect(card.links[0].description).to.contain('feds-commerce-placeholder');
    expect(card.links[0].description).to.contain('/tools/ost');
  });

  it('keeps plain-text descriptions unchanged (no regression)', () => {
    const el = build(`
      <h2>Photography &amp; design</h2>
      <p><a href="/photoshop">Photoshop for Students</a></p>
      <p>Image editing and design for learning and projects</p>
      <p><a href="/lightroom">Lightroom for Students</a></p>
      <p>Photo editing and organization</p>
    `);

    const [{ card }] = parseLinksCard(el);

    expect(card.links).to.have.lengthOf(2);
    expect(card.links[0].description).to.equal('Image editing and design for learning and projects');
    expect(card.links[0].description).to.not.contain('feds-commerce-placeholder');
    expect(card.links[1].description).to.equal('Photo editing and organization');
  });

  it('does not treat consecutive product links as descriptions', () => {
    const el = build(`
      <h2>Video</h2>
      <p><a href="/premiere">Premiere for Students</a></p>
      <p><a href="/after-effects">After Effects for Students</a></p>
    `);

    const [{ card }] = parseLinksCard(el);

    expect(card.links).to.have.lengthOf(2);
    expect(card.links[0].description).to.equal(undefined);
    expect(card.links[1].description).to.equal(undefined);
  });
});
