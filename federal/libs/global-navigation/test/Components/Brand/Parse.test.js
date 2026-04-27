import { expect } from '@esm-bundle/chai';
import { parseBrand } from '../../../src/Components/Brand/Parse';
import { IrrecoverableError } from '../../../src/Error/Error';

describe('Brand Parse', () => {
  it('should throw irrecoverable error when element is null', () => {
    expect(() => parseBrand(null)).to.throw(IrrecoverableError, 'Error when parsing Brand. Element is null');
  });

  it('should throw irrecoverable error when link section is missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `<div class="brand-root"></div>`;
    expect(() => parseBrand(container)).to.throw(IrrecoverableError, 'Error when parsing Brand. No link found');
  });

  it('should throw irrecoverable error when no link is found in link section', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <div></div>
      </div>
    `;
    expect(() => parseBrand(container)).to.throw(IrrecoverableError, 'Error when parsing Brand. No link found');
  });

  it('should parse full brand data with all image variants', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <div><a href="https://example.com/">Adobe</a></div>
        <div>
          <div>
            <a href="https://example.com/mobile-light.svg">mobile-light.svg | Mobile Light</a>
            <a href="https://example.com/mobile-dark.svg">mobile-dark.svg | Mobile Dark</a>
          </div>
          <div>
            <a href="https://example.com/desktop-light.svg">desktop-light.svg | Desktop Light</a>
            <a href="https://example.com/desktop-dark.svg">desktop-dark.svg | Desktop Dark</a>
          </div>
        </div>
      </div>
    `;

    const [result, errors] = parseBrand(container.querySelector('.gnav-brand'));
    expect(errors).to.have.lengthOf(0);

    expect(result.type).to.equal('Brand');
    expect(result.data.href).to.equal('https://example.com/');
    expect(result.data.label).to.equal('Adobe');
    expect(result.data.imageData.lightThemeImageSrc).to.equal('https://example.com/desktop-light.svg');
    expect(result.data.imageData.darkThemeImageSrc).to.equal('https://example.com/desktop-dark.svg');
    expect(result.data.imageData.mobileLightThemeImageSrc).to.equal('https://example.com/mobile-light.svg');
    expect(result.data.imageData.mobileDarkThemeImageSrc).to.equal('https://example.com/mobile-dark.svg');
  });

  it('should set isDarkBg when dark-bg class is present', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand dark-bg">
        <div><a href="https://example.com/">Adobe</a></div>
        <div>
          <div>
            <a href="https://example.com/mobile-light.svg">mobile-light.svg | Mobile Light</a>
            <a href="https://example.com/mobile-dark.svg">mobile-dark.svg | Mobile Dark</a>
          </div>
          <div>
            <a href="https://example.com/desktop-light.svg">desktop-light.svg | Desktop Light</a>
            <a href="https://example.com/desktop-dark.svg">desktop-dark.svg | Desktop Dark</a>
          </div>
        </div>
      </div>
    `;

    const [result] = parseBrand(container.querySelector('.gnav-brand'));
    expect(result.data.isDarkBg).to.equal(true);
  });

  it('should return recoverable errors when image sections are missing', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <div><a href="https://example.com/">Adobe</a></div>
      </div>
    `;

    const [result, errors] = parseBrand(container.querySelector('.gnav-brand'));
    expect(result.type).to.equal('Brand');
    expect(errors.length).to.be.greaterThan(0);
    expect(errors.some((e) => e.message === 'Error when parsing Brand. No image section found')).to.equal(true);
  });
});


