/**
 * Integration test for gnav keyboard navigation.
 */
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { initKeyboardNav } from '../../../src/PostRendering/Keyboard';
import { isDesktop } from '../../../src/Utils/Utils';
import { IS_OPEN_CLASS } from '../../../src/PostRendering/PopupWiring';

/**
 * Build the DOM shape that `renderGnavString` produces for `localnav=true`,
 * trimmed to what the keyboard trap needs to observe.
 */
function buildLocalnavGnav() {
  const gnav = document.createElement('div');
  gnav.className = 'global-navigation';
  gnav.innerHTML = `
    <nav class="localnav">
      <ul>
        <li class="feds-brand-wrapper">
          <a class="feds-brand" href="#">Brand</a>
          <button class="feds-nav-toggle" aria-controls="first-mega"></button>
        </li>
        <li id="feds-menu-wrapper" class="feds-menu-wrapper">
          <button
            class="feds-localnav-bar"
            aria-controls="feds-menu-wrapper"
            aria-expanded="false"
          ><span class="feds-localnav-bar-label">Bar</span></button>
          <ul class="feds-gnav-items">
            <li>
              <button class="mega-menu feds-link" aria-controls="first-mega" id="t-first">First</button>
              <div id="first-mega" class="feds-popup">
                <button class="feds-popup-back-button" id="first-back">Back</button>
                <a href="#fl1" class="feds-link">FirstLink</a>
              </div>
            </li>
            <li>
              <button class="mega-menu feds-link" aria-controls="mega-a" id="t-a">A</button>
              <div id="mega-a" class="feds-popup">
                <button class="feds-popup-back-button" id="a-back">Back</button>
                <a href="#a1" id="a-link-1">A1</a>
                <a href="#a2" id="a-link-2">A2</a>
              </div>
            </li>
            <li>
              <button class="mega-menu feds-link" aria-controls="mega-b" id="t-b">B</button>
              <div id="mega-b" class="feds-popup"></div>
            </li>
            <li><a href="#cta" class="feds-primary-cta" id="cta">CTA</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  `;
  return gnav;
}

/**
 * Dispatch a ToggleEvent-shaped event that matches what PopupWiring sends.
 */
function dispatchToggle(el, opening) {
  const init = {
    newState: opening ? 'open' : 'closed',
    oldState: opening ? 'closed' : 'open',
    bubbles: false,
    cancelable: false,
  };
  const ToggleEventCtor = window.ToggleEvent;
  const event = ToggleEventCtor !== undefined
    ? new ToggleEventCtor('toggle', init)
    : Object.assign(new Event('toggle', init), init);
  el.dispatchEvent(event);
}

/** Hide the first li's trigger the way the localnav-mobile CSS does. */
function hideFirstTrigger(gnav) {
  const firstTrigger = gnav.querySelector('#t-first');
  if (firstTrigger) firstTrigger.style.display = 'none';
}

describe('Gnav keyboard init', () => {
  let gnav;
  let cleanup;
  let isDesktopStub;

  afterEach(() => {
    if (cleanup) cleanup();
    gnav?.remove();
    if (isDesktopStub) {
      isDesktopStub.restore();
      isDesktopStub = null;
    }
  });

  function forceMobile() {
    isDesktopStub = sinon.stub(isDesktop, 'matches').get(() => false);
  }

  function forceDesktop() {
    isDesktopStub = sinon.stub(isDesktop, 'matches').get(() => true);
  }

  it('returns a cleanup function', () => {
    gnav = document.createElement('nav');
    gnav.className = 'global-navigation';
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
    gnav.className = 'global-navigation';
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
    gnav.className = 'global-navigation';
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

  describe('localnav-mobile tab focus trap', () => {
    it('sets tabindex="-1" on bar items at init when bar is closed', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      ['#t-a', '#t-b', '#cta'].forEach((sel) => {
        expect(gnav.querySelector(sel).getAttribute('tabindex')).to.equal('-1');
      });
    });

    it('does NOT set tabindex="-1" on items when on desktop', () => {
      forceDesktop();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      cleanup = initKeyboardNav(gnav);

      ['#t-a', '#t-b', '#cta'].forEach((sel) => {
        expect(gnav.querySelector(sel).hasAttribute('tabindex')).to.equal(false);
      });
    });

    it('does NOT trap when not localnav (no nav.localnav present)', () => {
      forceMobile();
      gnav = document.createElement('div');
      gnav.className = 'global-navigation';
      gnav.innerHTML = `
        <nav>
          <ul class="feds-gnav-items">
            <li><a href="#" class="feds-link" id="x">X</a></li>
            <li><a href="#" class="feds-link" id="y">Y</a></li>
          </ul>
        </nav>
      `;
      document.body.appendChild(gnav);
      cleanup = initKeyboardNav(gnav);

      // No #feds-menu-wrapper here, no tabindex applied.
      expect(gnav.querySelector('#x').hasAttribute('tabindex')).to.equal(false);
      expect(gnav.querySelector('#y').hasAttribute('tabindex')).to.equal(false);
    });

    it('removes tabindex on items and keeps focus on the bar button when the bar opens', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const bar = gnav.querySelector('.feds-localnav-bar');
      bar.focus();
      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      ['#t-a', '#t-b', '#cta'].forEach((sel) => {
        expect(gnav.querySelector(sel).hasAttribute('tabindex')).to.equal(false);
      });
      // Focus stays on the bar button; user Tabs from there into the items.
      expect(document.activeElement).to.equal(bar);
    });

    it('returns focus to the bar button when the bar closes', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      const bar = gnav.querySelector('.feds-localnav-bar');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      // Focus is now inside the wrap.
      gnav.querySelector('#t-a').focus();
      wrap.classList.remove(IS_OPEN_CLASS);
      dispatchToggle(wrap, false);
      expect(document.activeElement).to.equal(bar);
      // Re-applies tabindex="-1" on items.
      expect(gnav.querySelector('#t-a').getAttribute('tabindex')).to.equal('-1');
    });

    it('Tab on the last bar stop wraps to the bar button', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      const cta = gnav.querySelector('#cta');
      cta.focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab', bubbles: true,
      }));
      expect(document.activeElement)
        .to.equal(gnav.querySelector('.feds-localnav-bar'));
    });

    it('Tab on the bar button moves to the first menu item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('.feds-localnav-bar').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#t-a'));
    });

    it('Shift+Tab on the first menu item moves to the bar button', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      const ta = gnav.querySelector('#t-a');
      ta.focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab', shiftKey: true, bubbles: true,
      }));
      expect(document.activeElement)
        .to.equal(gnav.querySelector('.feds-localnav-bar'));
    });

    it('Shift+Tab on the bar button wraps to the last menu item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('.feds-localnav-bar').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab', shiftKey: true, bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#cta'));
    });

    it('focuses the back button when a subscreen opens from the bar', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      const popup = gnav.querySelector('#mega-a');
      popup.classList.add(IS_OPEN_CLASS);
      dispatchToggle(popup, true);

      expect(document.activeElement).to.equal(gnav.querySelector('#a-back'));
    });

    it('Tab on the last popup focusable wraps to the back button', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      const popup = gnav.querySelector('#mega-a');
      popup.classList.add(IS_OPEN_CLASS);
      dispatchToggle(popup, true);

      const lastLink = gnav.querySelector('#a-link-2');
      lastLink.focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Tab', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#a-back'));
    });

    it('returns focus to the trigger when the subscreen closes', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      const popup = gnav.querySelector('#mega-a');
      popup.classList.add(IS_OPEN_CLASS);
      dispatchToggle(popup, true);

      // Focus is now on the back button inside the popup.
      popup.classList.remove(IS_OPEN_CLASS);
      dispatchToggle(popup, false);
      expect(document.activeElement).to.equal(gnav.querySelector('#t-a'));
    });

    it('does NOT auto-focus into the popup in the hamburger flow', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      // Hamburger flow: menu-wrapper stays closed, popup opens directly.
      const hamburger = gnav.querySelector('.feds-nav-toggle');
      hamburger.focus();
      const popup = gnav.querySelector('#first-mega');
      popup.classList.add(IS_OPEN_CLASS);
      dispatchToggle(popup, true);

      // Focus must not have moved; hamburger flow is untouched.
      expect(document.activeElement).to.equal(hamburger);
    });

    it('does NOT trap Tab in the popup when opened via hamburger flow', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const popup = gnav.querySelector('#first-mega');
      popup.classList.add(IS_OPEN_CLASS);
      dispatchToggle(popup, true);

      // Focus an element inside the popup; press Tab. Without the trap
      // our handler bails (no default-prevent) and the browser's normal
      // tab order takes over. We assert by checking the event was not
      // defaultPrevented.
      const innerLink = popup.querySelector('a');
      innerLink.focus();
      const event = new KeyboardEvent('keydown', {
        key: 'Tab', bubbles: true, cancelable: true,
      });
      gnav.dispatchEvent(event);
      expect(event.defaultPrevented).to.equal(false);
    });

    it('Escape on an open bar refocuses the bar button', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      const bar = gnav.querySelector('.feds-localnav-bar');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#t-a').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape', bubbles: true,
      }));
      expect(document.activeElement).to.equal(bar);
    });

    it('ArrowDown on a bar item moves focus to the next item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#t-a').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#t-b'));
    });

    it('ArrowUp on a bar item moves focus to the previous item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#t-b').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowUp', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#t-a'));
    });

    it('ArrowDown on the last bar item wraps to the first item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#cta').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#t-a'));
    });

    it('ArrowUp on the first bar item wraps to the last item', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#t-a').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowUp', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#cta'));
    });

    it('ArrowDown also cycles to CTAs, not just feds-link items', () => {
      forceMobile();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      hideFirstTrigger(gnav);
      cleanup = initKeyboardNav(gnav);

      const wrap = gnav.querySelector('#feds-menu-wrapper');
      wrap.classList.add(IS_OPEN_CLASS);
      dispatchToggle(wrap, true);

      gnav.querySelector('#t-b').focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown', bubbles: true,
      }));
      expect(document.activeElement).to.equal(gnav.querySelector('#cta'));
    });

    it('ArrowDown does NOT engage on desktop (localnav bar arrows are mobile-only)', () => {
      forceDesktop();
      gnav = buildLocalnavGnav();
      document.body.appendChild(gnav);
      cleanup = initKeyboardNav(gnav);

      // On desktop there is no menu-wrapper open state — handleTopBar
      // owns horizontal arrows and ArrowDown should not move focus to
      // CTAs (which aren't .feds-link).
      const tb = gnav.querySelector('#t-b');
      tb.focus();
      gnav.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown', bubbles: true,
      }));
      // Focus unchanged.
      expect(document.activeElement).to.equal(tb);
    });
  });
});
