import { expect } from '@esm-bundle/chai';
import { parseProductCard, IrrecoverableError, RecoverableError } from '../../../dist/test-exports.js';

describe('ProductCard Parse', () => {
  describe('parseProductCardLink', () => {
    it('should parse a valid link group with icon', () => {
      const html = `
        <div class="product-card">
          <div>
            <div><a href="/federal/assets/svgs/creative-cloud-40.svg">https://main--federal--adobecom.hlx.page/federal/assets/svgs/creative-cloud-40.svg | Adobe Creative Cloud</a></div>
            <div>
              <p><a href="https://www.adobe.com/creativecloud.html">What is Creative Cloud?</a></p>
              <p>Creative apps and services for everyone</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(result.title).to.equal('What is Creative Cloud?');
      expect(result.href).to.equal('https://www.adobe.com/creativecloud.html');
      expect(result.subtitle).to.equal('Creative apps and services for everyone');
      expect(result.iconHref).to.equal('https://main--federal--adobecom.hlx.page/federal/assets/svgs/creative-cloud-40.svg');
      expect(result.iconAlt).to.equal('Adobe Creative Cloud');
      expect(errors).to.have.lengthOf(0);
    });

    it('should parse a valid link group without icon', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/products.html">All Products</a></p>
              <p>View all Adobe products</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(result.title).to.equal('All Products');
      expect(result.href).to.equal('https://www.adobe.com/products.html');
      expect(result.subtitle).to.equal('View all Adobe products');
      // Icon fields can be null or empty string when not provided
      expect(result.iconHref === null || result.iconHref === '').to.be.true;
      expect(result.iconAlt === null || result.iconAlt === '').to.be.true;
      expect(errors).to.have.lengthOf(0);
    });

    it('should return recoverable error when title is empty', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/products.html"></a></p>
              <p>View all Adobe products</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Title text not found');
    });

    it('should return recoverable error when href is empty', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a>All Products</a></p>
              <p>View all Adobe products</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Title Anchor has no href');
    });

    it('should return recoverable error when subtitle is empty', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/products.html">All Products</a></p>
              <p></p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Subtitle text not found');
    });

    it('should throw irrecoverable error when element is null', () => {
      expect(() => parseProductCard(null)).to.throw(IrrecoverableError, 'Element not found');
    });

    it('should throw error when title anchor is missing', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p>No anchor here</p>
              <p>Subtitle text</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseProductCard(element)).to.throw();
    });

    it('should return recoverable errors when subtitle paragraph is missing', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/products.html">All Products</a></p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      expect(result.type).to.equal('ProductCardLink');
      expect(errors.some((e) => e.message === 'Subtitle <p> not found')).to.equal(true);
    });
  });

  describe('parseProductCardHeader', () => {
    it('should parse a valid link group header', () => {
      const html = `
        <div class="product-card gray-gradient bold header">
          <div>
            <div></div>
            <div>
              <h5 id="document-productivity"><a href="bookmark://_document-productivity">Document productivity</a></h5>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardHeader');
      expect(result.title).to.equal('Document productivity');
      expect(result.classes).to.include('product-card');
      expect(result.classes).to.include('header');
      expect(result.classes).to.include('gray-gradient');
      expect(result.classes).to.include('bold');
      expect(errors).to.have.lengthOf(0);
    });

    it('should throw error when header class is missing', () => {
      const html = `
        <div class="product-card gray-gradient">
          <div>
            <div></div>
            <div>
              <h5><a href="#">Document productivity</a></h5>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseProductCard(element)).to.throw();
    });

    it('should throw error when title is empty', () => {
      const html = `
        <div class="product-card header">
          <div>
            <div></div>
            <div>
              <h5><a href="#"></a></h5>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseProductCard(element)).to.throw();
    });

    it('should throw error when anchor is missing', () => {
      const html = `
        <div class="product-card header">
          <div>
            <div></div>
            <div>
              <h5>Document productivity</h5>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseProductCard(element)).to.throw();
    });
  });

  describe('parseProductCardBlue', () => {
    it('should parse a valid blue link group', () => {
      const html = `
        <div class="product-card blue">
          <a href="https://www.adobe.com/special-offers">Special Offers</a>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardBlue');
      expect(result.link.type).to.equal('Link');
      expect(result.link.text).to.equal('Special Offers');
      expect(result.link.href).to.equal('https://www.adobe.com/special-offers');
      expect(errors).to.have.lengthOf(0);
    });

    it('should parse as ProductCardLink when blue class is missing', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/special-offers">Special Offers</a></p>
              <p>Subtitle text</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result] = parseProductCard(element);
      // Without blue class and with subtitle, it should parse as LinkGroupLink
      expect(result.type).to.equal('ProductCardLink');
    });
  });

  describe('parseProductCard with multiple recoverable errors', () => {
    it('should collect multiple recoverable errors', () => {
      const html = `
        <div class="product-card">
          <div>
            <div></div>
            <div>
              <p><a></a></p>
              <p></p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.product-card');
      
      const [result, errors] = parseProductCard(element);
      
      expect(result.type).to.equal('ProductCardLink');
      expect(errors.length).to.be.greaterThan(1);
      expect(errors.every(e => e instanceof RecoverableError)).to.be.true;
    });
  });
});
