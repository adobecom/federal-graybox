import { expect } from '@esm-bundle/chai';
import { parseLinkGroup, IrrecoverableError, RecoverableError } from '../../../dist/test-exports.js';

describe('LinkGroup Parse', () => {
  describe('parseLinkGroupLink', () => {
    it('should parse a valid link group with icon', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
      expect(result.title).to.equal('What is Creative Cloud?');
      expect(result.href).to.equal('https://www.adobe.com/creativecloud.html');
      expect(result.subtitle).to.equal('Creative apps and services for everyone');
      expect(result.iconHref).to.equal('https://main--federal--adobecom.hlx.page/federal/assets/svgs/creative-cloud-40.svg');
      expect(result.iconAlt).to.equal('Adobe Creative Cloud');
      expect(errors).to.have.lengthOf(0);
    });

    it('should parse a valid link group without icon', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
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
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Title text not found');
    });

    it('should return recoverable error when href is empty', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Title Anchor has no href');
    });

    it('should return recoverable error when subtitle is empty', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
      expect(errors).to.have.lengthOf(1);
      expect(errors[0]).to.be.instanceOf(RecoverableError);
      expect(errors[0].message).to.equal('Subtitle text not found');
    });

    it('should throw irrecoverable error when element is null', () => {
      expect(() => parseLinkGroup(null)).to.throw(IrrecoverableError, 'Element not found');
    });

    it('should throw error when title anchor is missing', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseLinkGroup(element)).to.throw();
    });

    it('should throw error when subtitle paragraph is missing', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseLinkGroup(element)).to.throw();
    });
  });

  describe('parseLinkGroupHeader', () => {
    it('should parse a valid link group header', () => {
      const html = `
        <div class="link-group gray-gradient bold header">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupHeader');
      expect(result.title).to.equal('Document productivity');
      expect(result.classes).to.include('link-group');
      expect(result.classes).to.include('header');
      expect(result.classes).to.include('gray-gradient');
      expect(result.classes).to.include('bold');
      expect(errors).to.have.lengthOf(0);
    });

    it('should throw error when header class is missing', () => {
      const html = `
        <div class="link-group gray-gradient">
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
      const element = container.querySelector('.link-group');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseLinkGroup(element)).to.throw();
    });

    it('should throw error when title is empty', () => {
      const html = `
        <div class="link-group header">
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
      const element = container.querySelector('.link-group');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseLinkGroup(element)).to.throw();
    });

    it('should throw error when anchor is missing', () => {
      const html = `
        <div class="link-group header">
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
      const element = container.querySelector('.link-group');
      
      // Will try different parsers and eventually throw an error
      expect(() => parseLinkGroup(element)).to.throw();
    });
  });

  describe('parseLinkGroupBlue', () => {
    it('should parse a valid blue link group', () => {
      const html = `
        <div class="link-group blue">
          <div>
            <div></div>
            <div>
              <p><a href="https://www.adobe.com/special-offers">Special Offers</a></p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement('div');
      container.innerHTML = html;
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupBlue');
      expect(result.link.type).to.equal('Link');
      expect(result.link.text).to.equal('Special Offers');
      expect(result.link.href).to.equal('https://www.adobe.com/special-offers');
      expect(errors).to.have.lengthOf(0);
    });

    it('should parse as LinkGroupLink when blue class is missing', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result] = parseLinkGroup(element);
      // Without blue class and with subtitle, it should parse as LinkGroupLink
      expect(result.type).to.equal('LinkGroupLink');
    });
  });

  describe('parseLinkGroup with multiple recoverable errors', () => {
    it('should collect multiple recoverable errors', () => {
      const html = `
        <div class="link-group">
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
      const element = container.querySelector('.link-group');
      
      const [result, errors] = parseLinkGroup(element);
      
      expect(result.type).to.equal('LinkGroupLink');
      expect(errors.length).to.be.greaterThan(1);
      expect(errors.every(e => e instanceof RecoverableError)).to.be.true;
    });
  });
});
