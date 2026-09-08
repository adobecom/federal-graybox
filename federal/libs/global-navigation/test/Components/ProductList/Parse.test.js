import { expect } from '@esm-bundle/chai';
import { parseProductList } from '../../../src/Components/ProductList/Parse';

const parseHtml = (html) => {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
};

describe('ProductList Parse', () => {
  it('parses a category whose product-card divs are authored directly', () => {
    const element = parseHtml(`
      <ul>
        <li>
          <div>
            <h2>Creativity & Design</h2>
            <div class="product-card">
              <div>
                <div></div>
                <div>
                  <p><a href="https://www.adobe.com/creativecloud.html">What is Creative Cloud?</a></p>
                  <p>Creative apps and services for everyone</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    `);

    const [result, errors] = parseProductList(element);

    expect(errors).to.have.lengthOf(0);
    expect(result.categories).to.have.lengthOf(1);
    expect(result.categories[0].links).to.have.lengthOf(1);
    expect(result.categories[0].links[0].type).to.equal('ProductCardLink');
    expect(result.categories[0].links[0].title).to.equal('What is Creative Cloud?');
  });

  it('resolves a product-card nested inside a fragment section wrapper', () => {
    // Mirrors what MegaMenu/Parse.ts's inlineNestedFragments splices in when an
    // author links to a fragment (href ending in `#_inline`) in place of a
    // product-card div: the fragment's plain.html wraps its block in a
    // section <div>, so the spliced-in sibling isn't `.product-card` itself.
    const element = parseHtml(`
      <ul>
        <li>
          <div>
            <h2>Creativity & Design</h2>
            <div>
              <div class="product-card">
                <div>
                  <div></div>
                  <div>
                    <p><a href="https://www.adobe.com/photoshop.html">Adobe Photoshop</a></p>
                    <p>Photo and design editing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    `);

    const [result, errors] = parseProductList(element);

    expect(errors).to.have.lengthOf(0);
    expect(result.categories[0].links).to.have.lengthOf(1);
    expect(result.categories[0].links[0].type).to.equal('ProductCardLink');
    expect(result.categories[0].links[0].title).to.equal('Adobe Photoshop');
  });

  it('parses standalone trailing links', () => {
    const element = parseHtml(`
      <ul>
        <li><a href="https://www.adobe.com/products.html">See all products</a></li>
      </ul>
    `);

    const [result, errors] = parseProductList(element);

    expect(errors).to.have.lengthOf(0);
    expect(result.links).to.have.lengthOf(1);
    expect(result.links[0].href).to.equal('https://www.adobe.com/products.html');
  });
});
