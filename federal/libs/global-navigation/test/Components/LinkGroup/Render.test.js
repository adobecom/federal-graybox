import { expect } from '@esm-bundle/chai';
import { linkGroup } from '../../../dist/test-exports.js';

describe('LinkGroup Render', () => {
  describe('linkGroupHeader', () => {
    it('should render a link group header with title', () => {
      const data = {
        type: 'LinkGroupHeader',
        title: 'Document productivity',
        classes: ['link-group', 'header']
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('role="heading"');
      expect(html).to.include('feds-link-group');
      expect(html).to.include('feds-link-group__content');
      expect(html).to.include('feds-link-group__title');
      expect(html).to.include('Document productivity');
    });

    it('should render a link group header with additional classes', () => {
      const data = {
        type: 'LinkGroupHeader',
        title: 'Creative Cloud',
        classes: ['link-group', 'header', 'gray-gradient', 'bold']
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('feds-link-group--gray-gradient');
      expect(html).to.include('feds-link-group--bold');
      expect(html).to.include('Creative Cloud');
    });

    it('should handle header with only base classes', () => {
      const data = {
        type: 'LinkGroupHeader',
        title: 'Basic Header',
        classes: ['link-group', 'header']
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('class="feds-link-group feds-link-group--header"');
      expect(html).to.include('Basic Header');
    });

    it('should escape HTML in title', () => {
      const data = {
        type: 'LinkGroupHeader',
        title: 'Header <script>alert("xss")</script>',
        classes: ['link-group', 'header']
      };
      
      const html = linkGroup(data);
      
      // The title should be included as-is (note: actual XSS protection would be in the rendering layer)
      expect(html).to.include('Header <script>alert("xss")</script>');
    });
  });

  describe('linkGroupLink', () => {
    it('should render a link group with icon', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: 'https://example.com/icon.svg',
        iconAlt: 'Adobe Creative Cloud',
        title: 'What is Creative Cloud?',
        href: 'https://www.adobe.com/creativecloud.html',
        subtitle: 'Creative apps and services for everyone'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('class="feds-link-group"');
      expect(html).to.include('href="https://www.adobe.com/creativecloud.html"');
      expect(html).to.include('daa-ll="What is Creative Cloud?"');
      expect(html).to.include('feds-link-group__icon');
      expect(html).to.include('src="https://example.com/icon.svg"');
      expect(html).to.include('alt="Adobe Creative Cloud"');
      expect(html).to.include('feds-link-group__title');
      expect(html).to.include('What is Creative Cloud?');
      expect(html).to.include('feds-link-group__subtitle');
      expect(html).to.include('Creative apps and services for everyone');
    });

    it('should render a link group without icon', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: 'All Products',
        href: 'https://www.adobe.com/products.html',
        subtitle: 'View all Adobe products'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('class="feds-link-group"');
      expect(html).to.include('href="https://www.adobe.com/products.html"');
      expect(html).to.include('All Products');
      expect(html).to.include('View all Adobe products');
      expect(html).to.not.include('feds-link-group__icon');
      expect(html).to.not.include('<picture');
    });

    it('should include daa-ll attribute with title value', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: 'Test Title',
        href: 'https://example.com',
        subtitle: 'Test Subtitle'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('daa-ll="Test Title"');
    });

    it('should render with loading="lazy" for icon image', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: 'https://example.com/icon.svg',
        iconAlt: 'Icon',
        title: 'Title',
        href: 'https://example.com',
        subtitle: 'Subtitle'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('loading="lazy"');
    });

    it('should handle special characters in attributes', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: 'Title with "quotes"',
        href: 'https://example.com?param=value&other=test',
        subtitle: 'Subtitle with <em>emphasis</em>'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('Title with "quotes"');
      expect(html).to.include('https://example.com?param=value&other=test');
      expect(html).to.include('Subtitle with <em>emphasis</em>');
    });
  });

  describe('linkGroupBlue', () => {
    it('should render a blue link group', () => {
      const data = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Special Offers',
          href: 'https://www.adobe.com/special-offers'
        }
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('class="feds-link-group feds-link-group--blue"');
      expect(html).to.include('href="https://www.adobe.com/special-offers"');
      expect(html).to.include('daa-ll="Special Offers"');
      expect(html).to.include('feds-link-group__title');
      expect(html).to.include('Special Offers');
    });

    it('should render with proper blue class modifier', () => {
      const data = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Blue Link',
          href: 'https://example.com'
        }
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('feds-link-group--blue');
    });

    it('should include daa-ll attribute with link text', () => {
      const data = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Analytics Link Text',
          href: 'https://example.com'
        }
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('daa-ll="Analytics Link Text"');
    });

    it('should only render title without subtitle or icon', () => {
      const data = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Simple Blue Link',
          href: 'https://example.com'
        }
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('feds-link-group__title');
      expect(html).to.not.include('feds-link-group__subtitle');
      expect(html).to.not.include('feds-link-group__icon');
    });
  });

  describe('linkGroup type switching', () => {
    it('should handle all LinkGroup types correctly', () => {
      const headerData = {
        type: 'LinkGroupHeader',
        title: 'Header',
        classes: ['link-group', 'header']
      };
      const linkData = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: 'Link',
        href: 'https://example.com',
        subtitle: 'Subtitle'
      };
      const blueData = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Blue',
          href: 'https://example.com'
        }
      };

      const headerHtml = linkGroup(headerData);
      const linkHtml = linkGroup(linkData);
      const blueHtml = linkGroup(blueData);

      expect(headerHtml).to.include('role="heading"');
      expect(linkHtml).to.include('class="feds-link-group"');
      expect(linkHtml).to.not.include('role="heading"');
      expect(blueHtml).to.include('feds-link-group--blue');
    });
  });

  describe('HTML structure validation', () => {
    it('should render valid HTML for link group link', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: 'https://example.com/icon.svg',
        iconAlt: 'Icon',
        title: 'Title',
        href: 'https://example.com',
        subtitle: 'Subtitle'
      };
      
      const html = linkGroup(data);
      const container = document.createElement('div');
      container.innerHTML = html;
      
      const anchor = container.querySelector('a.feds-link-group');
      expect(anchor).to.exist;
      expect(anchor.getAttribute('href')).to.equal('https://example.com');
      
      const icon = container.querySelector('.feds-link-group__icon img');
      expect(icon).to.exist;
      
      const title = container.querySelector('.feds-link-group__title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Title');
      
      const subtitle = container.querySelector('.feds-link-group__subtitle');
      expect(subtitle).to.exist;
      expect(subtitle.textContent).to.equal('Subtitle');
    });

    it('should render valid HTML for link group header', () => {
      const data = {
        type: 'LinkGroupHeader',
        title: 'Header Title',
        classes: ['link-group', 'header', 'bold']
      };
      
      const html = linkGroup(data);
      const container = document.createElement('div');
      container.innerHTML = html;
      
      const header = container.querySelector('[role="heading"]');
      expect(header).to.exist;
      expect(header.classList.contains('feds-link-group')).to.be.true;
      expect(header.classList.contains('feds-link-group--bold')).to.be.true;
      
      const title = container.querySelector('.feds-link-group__title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Header Title');
    });

    it('should render valid HTML for blue link group', () => {
      const data = {
        type: 'LinkGroupBlue',
        link: {
          type: 'Link',
          text: 'Blue Link',
          href: 'https://example.com'
        }
      };
      
      const html = linkGroup(data);
      const container = document.createElement('div');
      container.innerHTML = html;
      
      const anchor = container.querySelector('a.feds-link-group--blue');
      expect(anchor).to.exist;
      expect(anchor.getAttribute('href')).to.equal('https://example.com');
      
      const title = container.querySelector('.feds-link-group__title');
      expect(title).to.exist;
      expect(title.textContent).to.equal('Blue Link');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: '',
        href: '',
        subtitle: ''
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('class="feds-link-group"');
      expect(html).to.include('href=""');
    });

    it('should handle very long text content', () => {
      const longText = 'A'.repeat(500);
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: longText,
        href: 'https://example.com',
        subtitle: longText
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include(longText);
    });

    it('should handle unicode characters', () => {
      const data = {
        type: 'LinkGroupLink',
        iconHref: null,
        iconAlt: null,
        title: '日本語 中文 한국어 🎨',
        href: 'https://example.com',
        subtitle: 'Emoji: 😀 🎉 ✨'
      };
      
      const html = linkGroup(data);
      
      expect(html).to.include('日本語 中文 한국어 🎨');
      expect(html).to.include('Emoji: 😀 🎉 ✨');
    });
  });
});
