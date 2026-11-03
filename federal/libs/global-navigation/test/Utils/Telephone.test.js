import { expect } from '@esm-bundle/chai';
import { isTelephoneLink } from '../../src/Utils/Utils';

describe('isTelephoneLink', () => {
  it('detects tel: links', () => {
    expect(isTelephoneLink('tel:1800 102 5567')).to.equal(true);
    expect(isTelephoneLink('tel:+18001025567')).to.equal(true);
  });

  it('is case-insensitive and tolerates leading whitespace', () => {
    expect(isTelephoneLink('  TEL:18001025567')).to.equal(true);
  });

  it('rejects non-telephone hrefs', () => {
    expect(isTelephoneLink('/contact')).to.equal(false);
    expect(isTelephoneLink('https://adobe.com/tel')).to.equal(false);
    expect(isTelephoneLink('mailto:a@adobe.com')).to.equal(false);
  });
});
