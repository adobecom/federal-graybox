import { expect } from '@esm-bundle/chai';
import { parseBrand, IrrecoverableError } from '../../../dist/test-exports.js';

describe('Brand Parse', () => {
  it('should throw irrecoverable error when element is null', () => {
    expect(() => parseBrand(null)).to.throw(IrrecoverableError, 'Error when parsing Brand. Element is null');
  });

  it('should throw irrecoverable error when .gnav-brand is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `<div class="not-gnav-brand"></div>`;
    expect(() => parseBrand(container)).to.throw(IrrecoverableError, 'Error when parsing Brand. Element is null');
  });

  it('should throw irrecoverable error when no links are found', () => {
    const container = document.createElement('div');
    container.innerHTML = `<div class="gnav-brand"></div>`;
    expect(() => parseBrand(container)).to.throw(IrrecoverableError, 'Error when parsing Brand. No links found');
  });

  it('should throw irrecoverable error when no primary (non-image) link is found', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <a href="https://example.com/logo.svg">https://example.com/logo.svg | Logo</a>
      </div>
    `;
    expect(() => parseBrand(container)).to.throw(IrrecoverableError, 'Error when parsing Brand. No primary link found');
  });

  it('should parse a labelled brand with default company icon when no image links exist', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <a href="https://example.com/">Adobe</a>
      </div>
    `;

    const [result, errors] = parseBrand(container);
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.type).to.equal('LabelledBrand');
    expect(result.data.href).to.equal('https://example.com/');
    expect(result.data.label).to.equal('Adobe');
    expect(result.data.image.type).to.equal('inline-svg');
    expect(result.data.image.svgContent).to.include('<svg');
    expect(result.data.image.alt).to.equal('Adobe');
  });

  it('should parse brand-image-only and use brand icon by default', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand brand-image-only">
        <a href="https://example.com/">Adobe</a>
      </div>
    `;

    const [result, errors] = parseBrand(container);
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.type).to.equal('BrandImageOnly');
    expect(result.data.href).to.equal('https://example.com/');
    expect(result.data.image.type).to.equal('inline-svg');
    expect(result.data.image.svgContent).to.include('<svg');
  });

  it('should return NoRender when both image + label are disabled (no-logo + brand-image-only)', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand brand-image-only no-logo">
        <a href="https://example.com/">Adobe</a>
      </div>
    `;

    const [result, errors] = parseBrand(container);
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.type).to.equal('NoRender');
  });

  it('should parse BrandLabelOnly when logo is disabled but label is enabled (no-logo only)', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand no-logo">
        <a href="https://example.com/">Adobe</a>
      </div>
    `;

    const [result, errors] = parseBrand(container);
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.type).to.equal('BrandLabelOnly');
    expect(result.data.href).to.equal('https://example.com/');
    expect(result.data.label).to.equal('Adobe');
  });

  it('should parse ImageOnlyBrand when image-only is set, and select dark source when provided', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand image-only">
        <a href="https://example.com/">Adobe</a>
        <a href="https://example.com/logo-light.png">https://example.com/logo-light.png | Light Logo</a>
        <a href="https://example.com/logo-dark.png">https://example.com/logo-dark.png | Dark Logo</a>
      </div>
    `;

    const [result, errors] = parseBrand(container);
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.type).to.equal('ImageOnlyBrand');
    expect(result.data.href).to.equal('https://example.com/');
    expect(result.data.image.type).to.equal('image');
    // isDarkMode() currently always returns true in Utils.ts, so dark is selected when present
    expect(result.data.image.src).to.equal('https://example.com/logo-dark.png');
    expect(result.data.image.alt).to.equal('Light Logo');
  });
});


