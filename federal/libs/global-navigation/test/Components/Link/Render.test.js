import { expect } from '@esm-bundle/chai';
import { link } from '../../../src/Components/Link/Render';
import { setLocalizeLink, setSanitizedHTML } from '../../../src/Utils/Utils';

describe('Link Render', () => {
  afterEach(() => setLocalizeLink((href) => href));

  it('strips #_blank and preserves the target through sanitization', () => {
    const container = document.createElement('div');
    setSanitizedHTML(container, link({
      type: 'Link',
      text: 'Overview',
      href: 'https://www.adobe.com/overview?source=nav#details#_blank',
    }));

    const anchor = container.querySelector('a');
    expect(anchor.getAttribute('href')).to.equal('https://www.adobe.com/overview?source=nav#details');
    expect(anchor.target).to.equal('_blank');
  });

  it('removes #_blank before localizing a relative link', () => {
    let localizedHref;
    setLocalizeLink((href) => {
      localizedHref = href;
      return href.replace('/overview', '/fr/overview');
    });
    const container = document.createElement('div');
    container.innerHTML = link({ type: 'Link', text: 'Overview', href: '/overview#_blank' });

    expect(localizedHref).to.equal(`${window.location.origin}/overview`);
    expect(container.querySelector('a').href).to.equal(`${window.location.origin}/fr/overview`);
    expect(container.querySelector('a').target).to.equal('_blank');
  });

  it('leaves ordinary URL fragments and same-tab behavior unchanged', () => {
    const container = document.createElement('div');
    container.innerHTML = link({ type: 'Link', text: 'Overview', href: '/overview#details' });

    expect(container.querySelector('a').href).to.equal(`${window.location.origin}/overview#details`);
    expect(container.querySelector('a').hasAttribute('target')).to.equal(false);
  });

  it('hides a MAS CTA authoring label until commerce resolves it', () => {
    const html = link({
      type: 'Link',
      text: 'Mas-field: Buy now',
      href: 'https://mas.adobe.com/studio.html#path=acom-cc&field=ctas%5B1%5D',
    });
    const container = document.createElement('div');
    container.innerHTML = html;

    expect(
      container.querySelector('a.feds-link')
        .hasAttribute('data-feds-merch-pending')
    ).to.equal(true);
  });

  it('does not hide an ordinary navigation link', () => {
    const html = link({
      type: 'Link',
      text: 'Overview',
      href: '/overview',
    });
    const container = document.createElement('div');
    container.innerHTML = html;

    expect(
      container.querySelector('a.feds-link')
        .hasAttribute('data-feds-merch-pending')
    ).to.equal(false);
  });
});
