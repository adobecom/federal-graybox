import { expect } from '@esm-bundle/chai';
import { initActiveLink } from '../../src/PostRendering/ActiveLink';

describe('active navigation link detection', () => {
  const currentPage = `${window.location.origin}${window.location.pathname}`;
  let mountpoint;

  beforeEach(() => {
    mountpoint = document.createElement('header');
    mountpoint.innerHTML = `
      <nav>
        <ul class="feds-gnav-items">
          <li><a href="/different-page">Other page</a></li>
          <li><a href="${currentPage}">Current page</a></li>
        </ul>
      </nav>`;
  });

  const initialize = (hash = '') => {
    initActiveLink(mountpoint, new URL(`/gnav${hash}`, window.location.origin));
  };
  const activeItem = () => mountpoint.querySelector('.active-element');
  const matchingItem = () => mountpoint.querySelector('ul > li:last-child');

  it('marks the current page active by default', () => {
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });

  it('disables detection with the legacy source marker', () => {
    initialize('#_noActiveItem');
    expect(activeItem()).to.equal(null);
  });

  it('does not disable detection for unrelated source fragments', () => {
    initialize('#other');
    expect(activeItem()).to.equal(matchingItem());
  });

  it('keeps the marker case-sensitive like legacy Milo', () => {
    initialize('#_noactiveitem');
    expect(activeItem()).to.equal(matchingItem());
  });

  for (const suffix of ['?test=1', '#details']) {
    it(`matches the current page with ${suffix}`, () => {
      matchingItem().querySelector('a').href = `${currentPage}${suffix}`;
      initialize();
      expect(activeItem()).to.equal(matchingItem());
    });
  }

  it('marks the parent menu active for a matching nested link', () => {
    matchingItem().innerHTML = `<div class="feds-popup"><a href="${currentPage}">Page</a></div>`;
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });

  for (const className of [
    'feds-primary-cta',
    'feds-secondary-cta',
  ]) {
    it(`does not mark a matching ${className} active`, () => {
      matchingItem().querySelector('a').className = className;
      initialize();
      expect(activeItem()).to.equal(null);
    });

    it(`continues to ordinary links after a matching ${className}`, () => {
      mountpoint.querySelector('li:first-child a').href = currentPage;
      mountpoint.querySelector('li:first-child a').className = className;
      initialize();
      expect(activeItem()).to.equal(matchingItem());
    });

    it(`marks the parent menu active for a nested ${className}`, () => {
      matchingItem().innerHTML = `
        <div class="feds-popup">
          <a class="${className}" href="${currentPage}">CTA</a>
        </div>`;
      initialize();
      expect(activeItem()).to.equal(matchingItem());
    });
  }

  for (const className of [
    'feds-pinned-cta',
    'feds-product-entry-cta',
  ]) {
    it(`excludes toolbar links inside ${className}`, () => {
      mountpoint.querySelector('nav').insertAdjacentHTML('afterbegin',
        `<div class="${className}"><a href="${currentPage}">CTA</a></div>`);
      initialize();
      expect(activeItem()).to.equal(matchingItem());
    });
  }

  for (const className of [
    'promo-card__cta',
    'promo-card-small__cta',
  ]) {
    it(`marks the parent menu active for links inside ${className}`, () => {
      matchingItem().innerHTML = `
        <div class="feds-popup">
          <div class="${className}"><a href="${currentPage}">CTA</a></div>
        </div>`;
      initialize();
      expect(activeItem()).to.equal(matchingItem());
    });
  }

  it('marks the parent menu active for an image-panel button', () => {
    matchingItem().innerHTML = `
      <div class="feds-popup">
        <a class="image-panel-button" href="${currentPage}">CTA</a>
      </div>`;
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });

  it('disables nested CTA detection with the source marker', () => {
    matchingItem().innerHTML = `
      <div class="feds-popup">
        <a class="feds-primary-cta" href="${currentPage}">CTA</a>
      </div>`;
    initialize('#_noActiveItem');
    expect(activeItem()).to.equal(null);
  });

  it('excludes CTAs in localnav without suppressing ordinary links', () => {
    mountpoint.querySelector('nav').classList.add('localnav');
    matchingItem().insertAdjacentHTML('beforebegin',
      `<li><a class="feds-primary-cta" href="${currentPage}">CTA</a></li>`);
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });

  it('excludes breadcrumb and skip links', () => {
    matchingItem().querySelector('a').href = '/different-page';
    mountpoint.querySelector('nav').insertAdjacentHTML('afterbegin', `
      <a class="feds-skip-link" href="${currentPage}">Skip</a>
      <ul class="feds-breadcrumbs"><li><a href="${currentPage}">Page</a></li></ul>`);
    initialize();
    expect(activeItem()).to.equal(null);
  });

  it('excludes the first localnav item but matches sibling destinations', () => {
    mountpoint.querySelector('nav').classList.add('localnav');
    mountpoint.querySelector('li:first-child a').href = currentPage;
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });

  it('disables detection for localnav too', () => {
    mountpoint.querySelector('nav').classList.add('localnav');
    initialize('#_noActiveItem');
    expect(activeItem()).to.equal(null);
  });

  it('does not disable detection for another navigation instance', () => {
    initialize('#_noActiveItem');
    initialize();
    expect(activeItem()).to.equal(matchingItem());
  });
});
