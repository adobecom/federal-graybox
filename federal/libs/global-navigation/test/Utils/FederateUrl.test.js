import { expect } from '@esm-bundle/chai';
import { federateUrl } from '../../src/Utils/Utils';

describe('federateUrl', () => {
  const source = 'https://main--federal--adobecom.aem.page/federal/site-redesign/gnav';

  it('uses the publish host in prod', () => {
    const result = new URL(federateUrl(source, 'prod'));
    expect(result.origin).to.equal('https://main--federal--adobecom.aem.live');
    expect(result.pathname).to.equal('/federal/site-redesign/gnav');
  });

  it('uses the preview host in stage', () => {
    const result = new URL(federateUrl(source, 'stage'));
    expect(result.origin).to.equal('https://main--federal--adobecom.aem.page');
    expect(result.pathname).to.equal('/federal/site-redesign/gnav');
  });

  it('keeps localhost sources on the preview host', () => {
    const result = new URL(federateUrl('http://localhost:3000/federal/gnav', 'prod'));
    expect(result.origin).to.equal('http://main--federal--adobecom.aem.page');
  });

  it('does not use the configured environment for non-AEM URLs', () => {
    const result = new URL(federateUrl('https://content.example/federal/gnav', 'prod'));
    expect(result.origin).to.equal('https://main--federal--adobecom.aem.page');
  });
});
