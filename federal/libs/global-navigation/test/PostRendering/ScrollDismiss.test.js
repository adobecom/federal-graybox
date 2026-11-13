import { expect } from '@esm-bundle/chai';
import { initScrollDismiss } from '../../src/PostRendering/ScrollDismiss.ts';
import { wirePopups, isPopupOpen } from '../../src/PostRendering/PopupWiring.ts';

describe('navigation scroll dismissal', () => {
  let mountpoint;
  let cleanup;
  let drawer;
  let popup;
  let drawerTrigger;
  let popupTrigger;
  let stylesheet;

  before(async () => {
    stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('../../src/styles/styles.css', import.meta.url).href;
    await new Promise((resolve, reject) => {
      stylesheet.onload = resolve;
      stylesheet.onerror = reject;
      document.head.append(stylesheet);
    });
  });

  after(() => stylesheet.remove());

  beforeEach(() => {
    mountpoint = document.createElement('header');
    mountpoint.className = 'global-navigation is-compact';
    mountpoint.innerHTML = `
      <nav>
        <button class="feds-nav-toggle" aria-controls="feds-menu-wrapper"></button>
        <div id="feds-menu-wrapper" class="feds-menu-wrapper">
          <button aria-controls="test-popup"></button>
          <div id="test-popup" class="feds-popup"><div class="content"></div></div>
        </div>
      </nav>`;
    document.body.append(mountpoint);
    wirePopups(mountpoint);
    cleanup = initScrollDismiss(mountpoint);
    drawer = mountpoint.querySelector('#feds-menu-wrapper');
    popup = mountpoint.querySelector('#test-popup');
    drawerTrigger = mountpoint.querySelector('[aria-controls="feds-menu-wrapper"]');
    popupTrigger = mountpoint.querySelector('[aria-controls="test-popup"]');
  });

  afterEach(() => {
    cleanup();
    mountpoint.remove();
  });

  it('closes a desktop popup and reflects its collapsed state', () => {
    popupTrigger.click();
    expect(isPopupOpen(popup)).to.equal(true);
    window.dispatchEvent(new Event('scroll'));
    expect(isPopupOpen(popup)).to.equal(false);
    expect(popupTrigger.getAttribute('aria-expanded')).to.equal('false');
    expect(popupTrigger.getAttribute('daa-ll')).to.equal('header|Open');
  });

  it('closes the drawer and its nested popup on document scroll', () => {
    drawerTrigger.click();
    popupTrigger.click();
    document.dispatchEvent(new Event('scroll', { bubbles: true }));
    expect(isPopupOpen(drawer)).to.equal(false);
    expect(isPopupOpen(popup)).to.equal(false);
    expect(drawerTrigger.getAttribute('aria-expanded')).to.equal('false');
    expect(popupTrigger.getAttribute('aria-expanded')).to.equal('false');
  });

  it('dismisses reopened menus on subsequent scrolls without a threshold', () => {
    for (let i = 0; i < 2; i += 1) {
      drawerTrigger.click();
      expect(isPopupOpen(drawer)).to.equal(true);
      window.dispatchEvent(new Event('scroll'));
      expect(isPopupOpen(drawer)).to.equal(false);
    }
  });

  it('does not dismiss menus when their contents scroll', () => {
    drawerTrigger.click();
    popupTrigger.click();
    [drawer, popup, popup.querySelector('.content')].forEach(element => {
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
      expect(isPopupOpen(drawer)).to.equal(true);
      expect(isPopupOpen(popup)).to.equal(true);
    });
  });

  it('does not emit redundant toggle events when already closed', () => {
    let toggles = 0;
    popup.addEventListener('toggle', () => { toggles += 1; });
    window.dispatchEvent(new Event('scroll'));
    expect(toggles).to.equal(0);
  });

  it('can remove the scroll listener', () => {
    popupTrigger.click();
    cleanup();
    window.dispatchEvent(new Event('scroll'));
    expect(isPopupOpen(popup)).to.equal(true);
  });

  it('lets the page scroll with the localnav bar expanded and closes it fully', () => {
    mountpoint.querySelector('nav').classList.add('localnav');
    drawerTrigger.className = 'feds-localnav-bar';
    drawerTrigger.click();
    expect(isPopupOpen(drawer)).to.equal(true);
    expect(getComputedStyle(document.body).overflowY).not.to.equal('hidden');

    document.dispatchEvent(new Event('scroll', { bubbles: true }));
    expect(isPopupOpen(drawer)).to.equal(false);
    expect(drawer.classList.contains('feds-menu-active')).to.equal(false);
    expect(drawerTrigger.getAttribute('aria-expanded')).to.equal('false');
    expect(drawerTrigger.getAttribute('daa-ll')).to.equal('localnav-bar|Open');
  });

  it('keeps the page locked while a localnav submenu is open', () => {
    mountpoint.querySelector('nav').classList.add('localnav');
    drawerTrigger.className = 'feds-localnav-bar';
    drawerTrigger.click();
    popupTrigger.click();
    expect(getComputedStyle(document.body).overflowY).to.equal('hidden');
    popup.dispatchEvent(new Event('scroll', { bubbles: true }));
    expect(isPopupOpen(drawer)).to.equal(true);
    expect(isPopupOpen(popup)).to.equal(true);
  });

  it('keeps the page locked for a regular compact navigation drawer', () => {
    drawerTrigger.click();
    expect(getComputedStyle(document.body).overflowY).to.equal('hidden');
  });
});
