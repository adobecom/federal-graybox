import { expect } from '@esm-bundle/chai';
import { federateUrl, getFederatedContentRoot } from '../../src/Utils/Utils';

describe('federateUrl', () => {
  const source = 'https://main--federal--adobecom.aem.page/federal/site-redesign/gnav';

  it('uses the page-derived content root for AEM sources', () => {
    const result = new URL(federateUrl(source));
    expect(result.origin).to.equal(new URL(getFederatedContentRoot()).origin);
    expect(result.pathname).to.equal('/federal/site-redesign/gnav');
  });

  it('preserves the path, query and fragment when changing hosts', () => {
    const result = new URL(federateUrl(
      'https://main--federal--adobecom.aem.live/federal/site-redesign/gnav?test=1#menu',
    ));
    expect(result.origin).to.equal(new URL(getFederatedContentRoot()).origin);
    expect(`${result.pathname}${result.search}${result.hash}`)
      .to.equal('/federal/site-redesign/gnav?test=1#menu');
  });

  it('keeps localhost sources on the preview host', () => {
    const result = new URL(federateUrl('http://localhost:3000/federal/gnav'));
    expect(result.origin).to.equal('http://main--federal--adobecom.aem.page');
  });

  it('uses the content root for non-AEM Federal URLs', () => {
    const result = new URL(federateUrl('https://content.example/federal/gnav'));
    expect(result.origin).to.equal(new URL(getFederatedContentRoot()).origin);
    expect(result.pathname).to.equal('/federal/gnav');
  });

  it('resolves relative Federal URLs against the content root', () => {
    expect(federateUrl('/federal/gnav'))
      .to.equal(`${getFederatedContentRoot()}/federal/gnav`);
  });

  it('leaves non-Federal URLs unchanged', () => {
    const url = 'https://content.example/products/aftereffects?test=1#menu';
    expect(federateUrl(url)).to.equal(url);
  });
});
