import { expect } from '@esm-bundle/chai';
import { brand } from '../../../dist/test-exports.js';

describe('Brand Render', () => {
  it('should render LabelledBrand with image + label', () => {
    const html = brand({
      type: 'Brand',
      data: {
        type: 'LabelledBrand',
        href: 'https://example.com/',
        label: 'Adobe',
        image: { type: 'inline-svg', svgContent: '<svg>logo</svg>', alt: 'Adobe' }
      }
    });

    expect(html).to.include('class="feds-brand-container"');
    expect(html).to.include('class="feds-brand"');
    expect(html).to.include('href="https://example.com/"');
    expect(html).to.include('daa-ll="Brand"');
    expect(html).to.include('class="feds-brand-image"');
    expect(html).to.include('<svg>logo</svg>');
    expect(html).to.include('class="feds-brand-label"');
    expect(html).to.include('Adobe');

    const container = document.createElement('div');
    container.innerHTML = html;
    const a = container.querySelector('a.feds-brand');
    expect(a).to.exist;
    expect(a.getAttribute('aria-label')).to.equal(null);
  });

  it('should render BrandImageOnly with aria-label when alt is provided', () => {
    const html = brand({
      type: 'Brand',
      data: {
        type: 'BrandImageOnly',
        href: 'https://example.com/',
        alt: 'Adobe Home',
        image: { type: 'inline-svg', svgContent: '<svg>brand</svg>', alt: 'Adobe Home' }
      }
    });

    expect(html).to.include('brand-image-only');
    expect(html).to.include('aria-label="Adobe Home"');

    const container = document.createElement('div');
    container.innerHTML = html;
    const a = container.querySelector('a.feds-brand');
    expect(a.getAttribute('aria-label')).to.equal('Adobe Home');
  });

  it('should render ImageOnlyBrand with <img> and alt attribute', () => {
    const html = brand({
      type: 'Brand',
      data: {
        type: 'ImageOnlyBrand',
        href: 'https://example.com/',
        alt: 'Company Logo',
        image: { type: 'image', src: 'https://example.com/logo.png', alt: 'Company Logo' }
      }
    });

    expect(html).to.include('src="https://example.com/logo.png"');
    expect(html).to.include('alt="Company Logo"');
    expect(html).to.include('aria-label="Company Logo"');

    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('.feds-brand-image img');
    expect(img).to.exist;
    expect(img.getAttribute('src')).to.equal('https://example.com/logo.png');
    expect(img.getAttribute('alt')).to.equal('Company Logo');
  });

  it('should render BrandLabelOnly with just label content', () => {
    const html = brand({
      type: 'Brand',
      data: {
        type: 'BrandLabelOnly',
        href: 'https://example.com/',
        label: 'Adobe'
      }
    });

    expect(html).to.include('class="feds-brand-label"');
    expect(html).to.include('Adobe');
    expect(html).to.not.include('feds-brand-image');

    const container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelector('.feds-brand-label')).to.exist;
    expect(container.querySelector('.feds-brand-image')).to.equal(null);
  });

  it('should return empty string for NoRender', () => {
    const html = brand({ type: 'Brand', data: { type: 'NoRender' } });
    expect(html).to.equal('');
  });

  it('should omit img alt attribute when alt is empty', () => {
    const html = brand({
      type: 'Brand',
      data: {
        type: 'ImageOnlyBrand',
        href: 'https://example.com/',
        alt: '',
        image: { type: 'image', src: 'https://example.com/logo.png', alt: '' }
      }
    });

    expect(html).to.include('src="https://example.com/logo.png"');
    expect(html).to.not.include('alt="');
  });
});


