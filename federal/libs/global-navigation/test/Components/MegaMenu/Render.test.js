import { expect } from '@esm-bundle/chai';
import { popup } from '../../../src/Components/MegaMenu/Render';

describe('MegaMenu Render', () => {
  const renderProductList = (links) => {
    const container = document.createElement('div');
    container.innerHTML = popup({
      type: 'ProductList',
      megaMenuTitle: 'Products',
      categories: [],
      links,
      placeholders: new Map(),
    }, 'products');
    return container;
  };

  const productLink = (text, href) => ({
    type: 'Link', text, href, daaLl: null, daaLh: null,
  });

  it('uses the last product link in the popup header', () => {
    const container = renderProductList([
      productLink('First link', 'https://www.adobe.com/first.html'),
      productLink('All products', 'https://www.adobe.com/products.html'),
    ]);
    const link = container.querySelector('.feds-popup-header .product-links a');
    expect(link.getAttribute('href')).to.equal('https://www.adobe.com/products.html');
    expect(link.textContent).to.equal('All products');
    expect(link.getAttribute('daa-ll')).to.equal('All products');
  });

  it('uses the only product link when the list contains one link', () => {
    const container = renderProductList([
      productLink('All products', 'https://www.adobe.com/products.html'),
    ]);
    expect(container.querySelector('.feds-popup-header .product-links a').textContent)
      .to.equal('All products');
  });

  it('omits the header product link when the list is empty', () => {
    const container = renderProductList([]);
    expect(container.querySelector('.feds-popup-header .product-links')).to.equal(null);
  });

  it('renders card menus without a product link', () => {
    const html = popup({
      type: 'GnavCards', megaMenuTitle: 'Explore', sections: [],
    }, 'explore');
    expect(html).to.include('feds-popup-header');
    expect(html).not.to.include('class="product-links"');
  });
});
