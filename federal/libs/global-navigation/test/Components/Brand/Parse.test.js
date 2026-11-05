import { expect } from '@esm-bundle/chai';
import { parseBrand } from '../../../src/Components/Brand/Parse';
import { IrrecoverableError } from '../../../src/Error/Error';

describe('Brand Parse', () => {
  const widthBlock = (desktopWidths = [], mobileWidths = []) => {
    const container = document.createElement('div');
    const links = (variant, widths) => ['light', 'dark', 'scroll'].map((theme, index) => `
      <a href="https://example.com/${variant}-${theme}.svg">${variant}-${theme}.svg | ${variant} ${theme} | ${widths[index] ?? ''}</a>
    `).join('');
    container.innerHTML = `
      <div><a href="/">Adobe</a></div>
      <div>
        <div>${links('mobile', mobileWidths)}</div>
        <div>${links('desktop', desktopWidths)}</div>
      </div>`;
    return container;
  };

  it('should parse the largest width across each variant without changing alt text', () => {
    const [result, errors] = parseBrand(widthBlock([183, 187.5, 190], [18, 24, 20]));
    expect(errors).to.have.lengthOf(0);
    expect(result.data.imageData.desktopMinWidth).to.equal(190);
    expect(result.data.imageData.mobileMinWidth).to.equal(24);
    expect(result.data.imageData.lightThemeImageAlt).to.equal('desktop light');
    expect(result.data.imageData.mobileLightThemeImageAlt).to.equal('mobile light');
  });

  it('should leave minimum widths unset when no values are authored', () => {
    const [result, errors] = parseBrand(widthBlock());
    expect(errors).to.have.lengthOf(0);
    expect(result.data.imageData.desktopMinWidth).to.equal(undefined);
    expect(result.data.imageData.mobileMinWidth).to.equal(undefined);
  });

  it('should accept a width on only the dark or scroll logo and trim whitespace', () => {
    const [result, errors] = parseBrand(widthBlock(['', ' 183.5 '], ['', '', '183']));
    expect(errors).to.have.lengthOf(0);
    expect(result.data.imageData.desktopMinWidth).to.equal(183.5);
    expect(result.data.imageData.mobileMinWidth).to.equal(183);
  });

  for (const value of ['0', '-1', 'NaN', 'Infinity', '183px', '12oops', '1e2', '12; color:red']) {
    it(`should report and ignore invalid authored width "${value}"`, () => {
      const [result, errors] = parseBrand(widthBlock([value]));
      expect(errors).to.have.lengthOf(1);
      expect(errors[0].message).to.include('Invalid logo width');
      expect(result.data.imageData.desktopMinWidth).to.equal(undefined);
      expect(result.data.imageData.lightThemeImageSrc).to.equal('https://example.com/desktop-light.svg');
    });
  }

  it('should keep valid widths when another theme contains an invalid value', () => {
    const [result, errors] = parseBrand(widthBlock(['183px', '183'], ['18', 'bad']));
    expect(errors).to.have.lengthOf(2);
    expect(result.data.imageData.desktopMinWidth).to.equal(183);
    expect(result.data.imageData.mobileMinWidth).to.equal(18);
  });

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

  it('should parse an optional 3rd scroll-theme image when present', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="gnav-brand">
        <div><a href="https://example.com/">Adobe</a></div>
        <div>
          <div>
            <a href="https://example.com/mobile-light.svg">mobile-light.svg | Mobile Light</a>
            <a href="https://example.com/mobile-dark.svg">mobile-dark.svg | Mobile Dark</a>
            <a href="https://example.com/mobile-scroll.svg">mobile-scroll.svg | Mobile Scroll</a>
          </div>
          <div>
            <a href="https://example.com/desktop-light.svg">desktop-light.svg | Desktop Light</a>
            <a href="https://example.com/desktop-dark.svg">desktop-dark.svg | Desktop Dark</a>
            <a href="https://example.com/desktop-scroll.svg">desktop-scroll.svg | Desktop Scroll</a>
          </div>
        </div>
      </div>
    `;

    const [result, errors] = parseBrand(container.querySelector('.gnav-brand'));
    expect(errors).to.have.lengthOf(0);
    expect(result.data.imageData.scrollThemeImageSrc).to.equal('https://example.com/desktop-scroll.svg');
    expect(result.data.imageData.mobileScrollThemeImageSrc).to.equal('https://example.com/mobile-scroll.svg');
  });

  it('should not error when the 3rd scroll-theme image is absent', () => {
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
    expect(result.data.imageData.scrollThemeImageSrc).to.equal('');
    expect(result.data.imageData.mobileScrollThemeImageSrc).to.equal('');
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

