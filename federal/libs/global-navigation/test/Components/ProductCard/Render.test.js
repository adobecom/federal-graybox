import { expect } from '@esm-bundle/chai';
import { productCard } from '../../../src/Components/ProductCard/Render';
import { setLocalizeLink, setSanitizedHTML } from '../../../src/Utils/Utils';

describe('ProductCard Render', () => {
  afterEach(() => setLocalizeLink((href) => href));

  const render = (type, href) => {
    const container = document.createElement('div');
    const card = type === 'ProductCardLink'
      ? { type, title: 'Photoshop', href, subtitle: 'Image editing', icons: [] }
      : { type, link: { type: 'Link', text: 'Photoshop', href } };
    setSanitizedHTML(container, productCard({
      ...card,
      daaLl: 'Photoshop link',
      daaLh: 'Products',
    }));
    return container;
  };

  ['ProductCardLink', 'ProductCardBlue'].forEach((type) => {
    describe(type, () => {
      it('strips #_blank and preserves the target and analytics through sanitization', () => {
        const container = render(type, 'https://www.adobe.com/photoshop?source=nav#details#_blank');
        const anchor = container.querySelector('a.feds-product-card');

        expect(anchor.getAttribute('href')).to.equal('https://www.adobe.com/photoshop?source=nav#details');
        expect(anchor.target).to.equal('_blank');
        expect(anchor.getAttribute('daa-ll')).to.equal('Photoshop link');
        expect(anchor.getAttribute('daa-lh')).to.equal('Products');
      });

      it('keeps unmarked links in the same tab and preserves their fragments', () => {
        const container = render(type, '/photoshop#details');
        const anchor = container.querySelector('a.feds-product-card');

        expect(anchor.href).to.equal(`${window.location.origin}/photoshop#details`);
        expect(anchor.hasAttribute('target')).to.equal(false);
      });

      it('strips the marker before localizing a relative link', () => {
        let localizedHref;
        setLocalizeLink((href) => {
          localizedHref = href;
          return href.replace('/photoshop', '/fr/photoshop');
        });
        const container = render(type, '/photoshop#_blank');
        const anchor = container.querySelector('a.feds-product-card');

        expect(localizedHref).to.equal(`${window.location.origin}/photoshop`);
        expect(anchor.href).to.equal(`${window.location.origin}/fr/photoshop`);
        expect(anchor.target).to.equal('_blank');
      });
    });
  });

  it('keeps header-only cards non-interactive', () => {
    const container = document.createElement('div');
    setSanitizedHTML(container, productCard({
      type: 'ProductCardHeader',
      title: 'Products',
      classes: ['product-card', 'header'],
      daaLl: null,
      daaLh: null,
    }));

    expect(container.querySelector('a')).to.equal(null);
    expect(container.querySelector('[role="heading"]').textContent.trim()).to.equal('Products');
  });
});