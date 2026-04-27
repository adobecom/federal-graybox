import { expect } from '@esm-bundle/chai';
import { brand } from '../../../src/Components/Brand/Render';

describe('Brand Render', () => {
  it('should render brand with desktop and mobile image containers', () => {
    const html = brand({
      type: 'Brand',
      data: {
        href: 'https://example.com/',
        label: 'Adobe',
        isDarkBg: false,
        imageData: {
          type: 'svg',
          lightThemeImageSrc: 'https://example.com/desktop-light.svg',
          lightThemeImageAlt: 'Desktop Light',
          darkThemeImageSrc: 'https://example.com/desktop-dark.svg',
          darkThemeImageAlt: 'Desktop Dark',
          mobileLightThemeImageSrc: 'https://example.com/mobile-light.svg',
          mobileLightThemeImageAlt: 'Mobile Light',
          mobileDarkThemeImageSrc: 'https://example.com/mobile-dark.svg',
          mobileDarkThemeImageAlt: 'Mobile Dark',
        },
      },
    });

    expect(html).to.include('class="feds-brand-container"');
    expect(html).to.include('class="feds-brand"');
    expect(html).to.include('href="https://example.com/"');
    expect(html).to.include('daa-ll="Brand"');
    expect(html).to.include('class="feds-brand-image desktop-brand"');
    expect(html).to.include('class="feds-brand-image mobile-brand"');
    expect(html).to.include('src="https://example.com/desktop-light.svg"');
    expect(html).to.include('src="https://example.com/mobile-dark.svg"');

    const container = document.createElement('div');
    container.innerHTML = html;
    const a = container.querySelector('a.feds-brand');
    expect(a).to.exist;
    expect(a.getAttribute('aria-label')).to.equal('Adobe');
  });

  it('should apply dark background modifier class', () => {
    const html = brand({
      type: 'Brand',
      data: {
        href: 'https://example.com/',
        label: 'Adobe',
        isDarkBg: true,
        imageData: {
          type: 'svg',
          lightThemeImageSrc: 'https://example.com/desktop-light.svg',
          lightThemeImageAlt: 'Desktop Light',
          darkThemeImageSrc: 'https://example.com/desktop-dark.svg',
          darkThemeImageAlt: 'Desktop Dark',
          mobileLightThemeImageSrc: 'https://example.com/mobile-light.svg',
          mobileLightThemeImageAlt: 'Mobile Light',
          mobileDarkThemeImageSrc: 'https://example.com/mobile-dark.svg',
          mobileDarkThemeImageAlt: 'Mobile Dark',
        },
      },
    });
    expect(html).to.include('class="feds-brand-container feds-dark-bg"');
  });

  it('should fallback missing dark assets to light assets', () => {
    const html = brand({
      type: 'Brand',
      data: {
        href: 'https://example.com/',
        label: 'Adobe',
        isDarkBg: false,
        imageData: {
          type: 'svg',
          lightThemeImageSrc: 'https://example.com/desktop-light.svg',
          lightThemeImageAlt: 'Desktop Light',
          darkThemeImageSrc: '',
          darkThemeImageAlt: '',
          mobileLightThemeImageSrc: 'https://example.com/mobile-light.svg',
          mobileLightThemeImageAlt: 'Mobile Light',
          mobileDarkThemeImageSrc: '',
          mobileDarkThemeImageAlt: '',
        },
      },
    });

    expect(html).to.not.include('<svg id="Layer_1"');
    expect(html).to.include('src="https://example.com/desktop-light.svg"');
    expect(html).to.include('src="https://example.com/mobile-light.svg"');
  });
});


