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
});
