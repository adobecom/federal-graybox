import { expect } from '@esm-bundle/chai';
import { initMerchLinks } from '../../src/PostRendering/MerchLinks';

const MAS_FIELD =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=cardTitle';
const MAS_CARD =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc';
const OST = 'https://www.adobe.com/tools/ost?osi=abc&type=price';

/**
 * initMerchLinks tags OST/miniplans links and inline M@S field links with the
 * `merch` class (routed to Milo's lightweight `merch` block) before it touches
 * config, and leaves full M@S cards untagged so they take the
 * merch-card-autoblock path. Asserting the tagging alone avoids importing the
 * real Milo blocks: the tag runs synchronously, ahead of any config access, and
 * initMerchLinks swallows its own errors, so awaiting it is safe regardless of
 * whatever MiloConfig other test files have (or have not) initialised.
 */
describe('initMerchLinks — commerce link routing', () => {
  it('tags OST and inline M@S field links, leaves full cards and plain links', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <a href="${OST}">OST price</a>
      <a href="${MAS_FIELD}">M@S field</a>
      <a href="${MAS_CARD}">M@S full card</a>
      <a href="/photoshop">Photoshop</a>
    `;
    document.body.appendChild(mountpoint);

    try {
      await initMerchLinks(mountpoint);

      const [ost, field, card, plain] = mountpoint.querySelectorAll('a');
      expect(ost.classList.contains('merch'), 'OST link').to.equal(true);
      expect(field.classList.contains('merch'), 'inline field link').to.equal(true);
      expect(card.classList.contains('merch'), 'full M@S card').to.equal(false);
      expect(plain.classList.contains('merch'), 'plain link').to.equal(false);
    } finally {
      mountpoint.remove();
    }
  });

  it('rehydrates a product-card commerce placeholder into a merch anchor', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <span class="feds-commerce-placeholder" data-commerce-href="${OST}">US$9.99/mo</span>
    `;
    document.body.appendChild(mountpoint);

    try {
      await initMerchLinks(mountpoint);

      const anchor = mountpoint.querySelector('a');
      expect(anchor, 'placeholder became an anchor').to.not.equal(null);
      expect(anchor.getAttribute('href')).to.equal(OST);
      expect(anchor.classList.contains('merch')).to.equal(true);
      expect(mountpoint.querySelector('.feds-commerce-placeholder')).to.equal(null);
    } finally {
      mountpoint.remove();
    }
  });
});
