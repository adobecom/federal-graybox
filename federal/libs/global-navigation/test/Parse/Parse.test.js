import { expect } from '@esm-bundle/chai';
import { parseNavigation } from '../../src/Parse/Parse';

const parse = (html) => {
  const mainNav = document.createElement('div');
  mainNav.innerHTML = html;
  return parseNavigation(mainNav, false);
};

describe('parseNavigation', () => {
  [
    '<div></div>',
    '<section> \n\t </section>',
    '<section><div><p><br></p></div></section>',
    '<li></li>',
    '<li> \n\t&nbsp; </li>',
    '<li><span></span><!-- empty --></li>',
    '<section><ul><li></li><li>&nbsp;</li></ul></section>',
  ].forEach((html) => {
    it(`does not count empty markup as a menu item: ${html}`, () => {
      const result = parse(html);

      expect(result.components).to.deep.equal([]);
      expect(result.errors).to.deep.equal([]);
    });
  });

  it('keeps meaningful items in order without empty menu items', () => {
    const result = parse(`
      <section></section>
      <li><a href="/products.html">Products</a></li>
      <li>&nbsp;</li>
      <section><p>Explore Adobe</p></section>
      <section><div><p><br></p></div></section>
      <li><a href="/support.html">Support</a></li>
    `);

    expect(result.components.map((component) => component.type))
      .to.deep.equal(['Link', 'Text', 'Link']);
    expect(result.components[0].text).to.equal('Products');
    expect(result.components[1].content).to.equal('Explore Adobe');
    expect(result.components[2].text).to.equal('Support');
    expect(result.errors).to.deep.equal([]);
  });

  it('preserves errors for malformed links', () => {
    const result = parse('<li></li><li><a>Products</a></li>');

    expect(result.components).to.deep.equal([]);
    expect(result.errors.map((error) => error.message))
      .to.deep.equal(['Element has no href']);
  });

  it('flags a tel: link as the pinned telephone without lifting it from the menu', () => {
    const result = parse('<li><strong><a href="/buy">Buy now</a></strong></li><li><a href="tel:1800 102 5567">1800 102 5567</a></li>');

    expect(result.telephone).to.not.equal(null);
    expect(result.telephone.href).to.equal('tel:1800 102 5567');
    expect(result.telephone.text).to.equal('1800 102 5567');
    // Still present in the menu list so it remains reachable in the drawer.
    expect(result.components).to.include(result.telephone);
    expect(result.errors).to.deep.equal([]);
  });

  it('has no telephone when no tel: link is authored', () => {
    const result = parse('<li><a href="/support">Support</a></li>');

    expect(result.telephone).to.equal(null);
  });
});
