/**
 * Integration test for gnav keyboard navigation.
 */
import { expect } from '@esm-bundle/chai';
import { initKeyboardNav } from '../../../dist/test-exports.js';

describe('Gnav keyboard init', () => {
  let gnav;
  let cleanup;

  afterEach(() => {
    if (cleanup) cleanup();
    gnav?.remove();
  });

  it('returns a cleanup function', () => {
    gnav = document.createElement('nav');
    gnav.className = 'global-navigation site-pivot';
    gnav.innerHTML = `
      <ul>
        <li><a href="#" class="feds-link">Link 1</a></li>
        <li><a href="#" class="feds-link">Link 2</a></li>
      </ul>
    `;
    document.body.appendChild(gnav);
    cleanup = initKeyboardNav(gnav);
    expect(cleanup).to.be.a('function');
  });

  it('navigates top bar with ArrowLeft/ArrowRight', () => {
    gnav = document.createElement('nav');
    gnav.className = 'global-navigation site-pivot';
    gnav.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a href="#" class="feds-link" id="l1">L1</a></li>
        <li><a href="#" class="feds-link" id="l2">L2</a></li>
        <li><a href="#" class="feds-link" id="l3">L3</a></li>
      </ul>
    `;
    document.body.appendChild(gnav);
    cleanup = initKeyboardNav(gnav);

    const l1 = gnav.querySelector('#l1');
    const l2 = gnav.querySelector('#l2');
    l1.focus();

    gnav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(l2);

    gnav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(gnav.querySelector('#l3'));

    gnav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(l1);
  });

  it('cleanup removes listener', () => {
    gnav = document.createElement('nav');
    gnav.className = 'global-navigation site-pivot';
    gnav.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a href="#" class="feds-link" id="a">A</a></li>
        <li><a href="#" class="feds-link" id="b">B</a></li>
      </ul>
    `;
    document.body.appendChild(gnav);
    cleanup = initKeyboardNav(gnav);
    gnav.querySelector('#a').focus();
    cleanup();
    gnav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).to.equal(gnav.querySelector('#a'));
  });
});
