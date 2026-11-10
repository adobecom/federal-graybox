import { expect } from '@esm-bundle/chai';
import { linkscard } from '../../../src/Components/LinksCard/Render';
import { setLocalizeLink, setSanitizedHTML } from '../../../src/Utils/Utils';

describe('LinksCard Render', () => {
  afterEach(() => setLocalizeLink((href) => href));

  const render = (href) => {
    const container = document.createElement('div');
    setSanitizedHTML(container, linkscard({
      type: 'LinksCard',
      card: {
        type: 'LinksCardItem',
        title: 'Products',
        links: [
          { type: 'Link', text: 'Overview', href },
          { type: 'Link', text: 'Details', href, description: 'Product details' },
        ],
        footerLink: { type: 'Link', text: 'All products', href },
        footerCTA: { type: 'PrimaryCTA', text: 'Buy now', href },
      },
    }));
    return container;
  };

  it('supports #_blank on ordinary links, description links, footer links and CTAs', () => {
    const container = render('https://www.adobe.com/products?source=nav#details#_blank');
    const anchors = [...container.querySelectorAll('a')];

    expect(anchors).to.have.lengthOf(4);
    anchors.forEach((anchor) => {
      expect(anchor.getAttribute('href')).to.equal('https://www.adobe.com/products?source=nav#details');
      expect(anchor.target).to.equal('_blank');
    });
    expect(container.querySelector('.links-card-links__item-description').textContent)
      .to.equal('Product details');
  });

  it('keeps unmarked links in the same tab and preserves their fragments', () => {
    const container = render('/products#details');

    container.querySelectorAll('a').forEach((anchor) => {
      expect(anchor.href).to.equal(`${window.location.origin}/products#details`);
      expect(anchor.hasAttribute('target')).to.equal(false);
    });
  });

  it('localizes description links after stripping the marker', () => {
    const localizedHrefs = [];
    setLocalizeLink((href) => {
      localizedHrefs.push(href);
      return href.replace('/products', '/fr/products');
    });
    const container = render('/products#_blank');

    expect(localizedHrefs).to.have.lengthOf(4);
    expect(localizedHrefs.every((href) => !href.includes('#_blank'))).to.equal(true);
    expect(container.querySelector('.links-card-links__item-link').href)
      .to.equal(`${window.location.origin}/fr/products`);
  });
});