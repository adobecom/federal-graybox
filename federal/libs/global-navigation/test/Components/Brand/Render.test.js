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
    expect(container.querySelector('.desktop-brand').style.minWidth).to.equal('');
    expect(container.querySelector('.mobile-brand').style.minWidth).to.equal('');
  });

  it('should apply authored minimum widths to containers without resizing images', () => {
    const container = document.createElement('div');
    container.innerHTML = brand({
      type: 'Brand',
      data: {
        href: '/',
        label: 'Adobe for Business',
        isDarkBg: false,
        imageData: {
          type: 'svg',
          lightThemeImageSrc: 'https://example.com/desktop.svg',
          mobileLightThemeImageSrc: 'https://example.com/mobile.svg',
          desktopMinWidth: 183.5,
          mobileMinWidth: 183,
        },
      },
    });
    expect(container.querySelector('.desktop-brand').style.minWidth).to.equal('183.5px');
    expect(container.querySelector('.mobile-brand').style.minWidth).to.equal('183px');
    expect(container.querySelectorAll('img').length).to.equal(6);
    container.querySelectorAll('img').forEach(image => {
      expect(image.hasAttribute('width')).to.equal(false);
      expect(image.hasAttribute('height')).to.equal(false);
    });
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

  it('should render an authored scroll-theme image as the 3rd image', () => {
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
          scrollThemeImageSrc: 'https://example.com/desktop-scroll.svg',
          scrollThemeImageAlt: 'Desktop Scroll',
          mobileScrollThemeImageSrc: 'https://example.com/mobile-scroll.svg',
          mobileScrollThemeImageAlt: 'Mobile Scroll',
        },
      },
    });

    const container = document.createElement('div');
    container.innerHTML = html;
    const desktopImgs = container.querySelectorAll('.desktop-brand img');
    const mobileImgs = container.querySelectorAll('.mobile-brand img');
    expect(desktopImgs[2].getAttribute('src')).to.equal('https://example.com/desktop-scroll.svg');
    expect(mobileImgs[2].getAttribute('src')).to.equal('https://example.com/mobile-scroll.svg');
  });

  it('should fallback missing scroll-theme image to the light image', () => {
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
          scrollThemeImageSrc: '',
          scrollThemeImageAlt: '',
          mobileScrollThemeImageSrc: '',
          mobileScrollThemeImageAlt: '',
        },
      },
    });

    const container = document.createElement('div');
    container.innerHTML = html;
    const desktopImgs = container.querySelectorAll('.desktop-brand img');
    const mobileImgs = container.querySelectorAll('.mobile-brand img');
    expect(desktopImgs[2].getAttribute('src')).to.equal('https://example.com/desktop-light.svg');
    expect(mobileImgs[2].getAttribute('src')).to.equal('https://example.com/mobile-light.svg');
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

