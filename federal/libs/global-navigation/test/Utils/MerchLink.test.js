import { expect } from '@esm-bundle/chai';
import { isMerchLink, isMasLink, isMasFieldLink } from '../../src/Utils/Utils';

describe('commerce link helpers', () => {
  describe('isMerchLink', () => {
    it('matches OST and miniplans links', () => {
      expect(isMerchLink('https://www.adobe.com/tools/ost?osi=x')).to.equal(true);
      expect(isMerchLink('https://www.adobe.com/creativecloud/plans/miniplans')).to.equal(true);
    });
    it('rejects ordinary links', () => {
      expect(isMerchLink('https://www.adobe.com/photoshop.html')).to.equal(false);
    });
  });

  describe('isMasLink', () => {
    it('matches mas.adobe.com studio links', () => {
      expect(isMasLink('https://mas.adobe.com/studio.html#field=cardTitle')).to.equal(true);
    });
    it('rejects non-studio links', () => {
      expect(isMasLink('https://www.adobe.com/tools/ost?osi=x')).to.equal(false);
    });
  });

  describe('isMasFieldLink', () => {
    it('matches a studio link with a field in the hash (inline value)', () => {
      const href = 'https://mas.adobe.com/studio.html#content-type=merch-card&field=cardTitle';
      expect(isMasFieldLink(href)).to.equal(true);
    });
    it('rejects a studio link without a field (full merch-card)', () => {
      const href = 'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc';
      expect(isMasFieldLink(href)).to.equal(false);
    });
    it('rejects a non-studio link even if it contains field=', () => {
      expect(isMasFieldLink('https://www.adobe.com/x?field=cardTitle')).to.equal(false);
    });
  });
});
