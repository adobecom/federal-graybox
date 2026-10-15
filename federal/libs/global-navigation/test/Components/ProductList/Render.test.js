import { expect } from '@esm-bundle/chai';
import { productlist } from '../../../src/Components/ProductList/Render';

const render = (links = [], placeholders = new Map()) => {
  const element = document.createElement('div');
  element.innerHTML = productlist({
    type: 'ProductList',
    megaMenuTitle: '',
    categories: ['Design', 'Video'].map((name) => ({
      type: 'ProductCategory', name, daaLl: name, links: [],
    })),
    links,
    placeholders,
  });
  return element;
};

const link = (text, daaLl = null) => ({
  type: 'Link', text, href: `https://example.com/${text}`, daaLl,
});

describe('ProductList Render regression', () => {
  it('renders tabs with their correct indices, selected state and panel references', () => {
    const element = render();
    const tabs = [...element.querySelectorAll('[role="tab"]')];
    expect(tabs).to.have.lengthOf(2);
    tabs.forEach((tab, i) => {
      expect(tab.getAttribute('aria-controls')).to.equal(String(i));
      expect(tab.getAttribute('aria-selected')).to.equal(String(i === 0));
      expect(tab.getAttribute('aria-describedby')).to.equal(`product-hint-${i}`);
      expect(element.querySelector(`[id="${i}"]`).hidden).to.equal(i !== 0);
    });
    expect(tabs.map((tab) => tab.textContent.trim())).to.deep.equal(['Design', 'Video']);
  });

  it('omits the trailing link when no links are provided', () => {
    expect(render().querySelector('.product-links')).to.equal(null);
  });

  it('renders a single trailing link with its fallback analytics label', () => {
    const anchor = render([link('products')]).querySelector('.product-links a');
    expect(anchor.getAttribute('href')).to.equal('https://example.com/products');
    expect(anchor.getAttribute('daa-ll')).to.equal('products');
  });

  it('renders only the last trailing link and preserves its analytics label', () => {
    const element = render([link('first'), link('last', 'all-products')]);
    const anchors = element.querySelectorAll('.product-links a');
    expect(anchors).to.have.lengthOf(1);
    expect(anchors[0].getAttribute('href')).to.equal('https://example.com/last');
    expect(anchors[0].getAttribute('daa-ll')).to.equal('all-products');
    expect(anchors[0].textContent).to.equal('last');
  });

  it('preserves translated product count placeholders', () => {
    const element = render([], new Map([
      ['product-list-includes', 'contient'],
      ['product-list-products', 'produits'],
    ]));
    expect(element.querySelector('.product-hint').textContent).to.equal('contient 0 produits');
  });
});