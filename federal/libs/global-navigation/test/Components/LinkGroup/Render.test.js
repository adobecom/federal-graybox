import { expect } from '@esm-bundle/chai';
import { productCard } from '../../../src/Components/ProductCard/Render';

describe('ProductCard Render', () => {
  describe('productCardHeader', () => {
    it('should render a product card header with title', () => {
      const data = {
        type: 'ProductCardHeader',
        title: 'Document productivity',
        classes: ['product-card', 'header'],
        daaLl: null,
        daaLh: null,
      };
      
      const html = productCard(data);
      
      expect(html).to.include('role="heading"');
      expect(html).to.include('feds-product-card');
      expect(html).to.include('feds-product-card__content');
      expect(html).to.include('feds-product-card__title');
      expect(html).to.include('Document productivity');
    });

    it('should render a product card header with additional classes', () => {
      const data = {
        type: 'ProductCardHeader',
        title: 'Creative Cloud',
        classes: ['product-card', 'header', 'gray-gradient', 'bold'],
        daaLl: null,
        daaLh: null,
      };
      
      const html = productCard(data);
      
      expect(html).to.include('feds-product-card--gray-gradient');
      expect(html).to.include('feds-product-card--bold');
      expect(html).to.include('Creative Cloud');
    });
  });

  describe('productCardLink', () => {
    it('should render a product card link with icon and subtitle', () => {
      const data = {
        type: 'ProductCardLink',
        icons: [{ iconHref: 'https://example.com/icon.svg', iconAlt: 'Adobe Creative Cloud' }],
        title: 'What is Creative Cloud?',
        href: 'https://www.adobe.com/creativecloud.html',
        subtitle: 'Creative apps and services for everyone',
        badges: [],
        daaLl: null,
        daaLh: null,
      };
      
      const html = productCard(data);
      
      expect(html).to.include('class="feds-product-card"');
      expect(html).to.include('href="https://www.adobe.com/creativecloud.html"');
      expect(html).to.include('daa-ll="What is Creative Cloud?"');
      expect(html).to.include('feds-product-card__icon');
      expect(html).to.include('src="https://example.com/icon.svg"');
      expect(html).to.include('feds-product-card__title');
      expect(html).to.include('What is Creative Cloud?');
      expect(html).to.include('feds-product-card__subtitle');
      expect(html).to.include('Creative apps and services for everyone');
    });

    it('should render badges when provided', () => {
      const data = {
        type: 'ProductCardLink',
        icons: [],
        title: 'All Apps',
        href: 'https://www.adobe.com/apps',
        subtitle: 'Explore apps',
        badges: [
          { text: 'New', isFilled: true },
          { text: 'Popular', isFilled: false },
        ],
        daaLl: null,
        daaLh: null,
      };
      const html = productCard(data);
      expect(html).to.include('feds-product-card__badges');
      expect(html).to.include('feds-product-card__badge--filled');
      expect(html).to.include('New');
      expect(html).to.include('Popular');
    });

    it('should render a product card without icon when iconHref is null', () => {
      const data = {
        type: 'ProductCardLink',
        icons: [],
        title: 'All Products',
        href: 'https://www.adobe.com/products.html',
        subtitle: 'View all Adobe products',
        badges: [],
        daaLl: null,
        daaLh: null,
      };
      
      const html = productCard(data);
      
      expect(html).to.include('class="feds-product-card"');
      expect(html).to.include('href="https://www.adobe.com/products.html"');
      expect(html).to.include('All Products');
      expect(html).to.include('View all Adobe products');
      expect(html).to.not.include('feds-product-card__icon');
      expect(html).to.not.include('<picture');
    });
  });

  describe('productCardBlue', () => {
    it('should render a blue product card', () => {
      const data = {
        type: 'ProductCardBlue',
        link: {
          type: 'Link',
          text: 'Special Offers',
          href: 'https://www.adobe.com/special-offers',
        },
        daaLl: null,
        daaLh: null,
      };
      
      const html = productCard(data);
      
      expect(html).to.include('class="feds-product-card feds-product-card--blue"');
      expect(html).to.include('href="https://www.adobe.com/special-offers"');
      expect(html).to.include('daa-ll="Special Offers"');
      expect(html).to.include('feds-product-card__title');
      expect(html).to.include('Special Offers');
    });
  });
});
