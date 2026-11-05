import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { getIntrinsicItemsWidth, initCompactOverflow } from '../../src/PostRendering/CompactOverflow.ts';
import { isDesktop } from '../../src/Utils/Utils.ts';
import { MERCH_RESOLVED_EVENT } from '../../src/PostRendering/MerchLinks.ts';

describe('compact overflow measurement', () => {
  it('measures the intrinsic item widths and gaps', () => {
    const list = document.createElement('ul');
    list.style.columnGap = '24px';
    const first = document.createElement('li');
    const second = document.createElement('li');
    Object.defineProperties(first, {
      offsetWidth: { value: 120 },
      scrollWidth: { value: 120 },
    });
    Object.defineProperties(second, {
      offsetWidth: { value: 160 },
      scrollWidth: { value: 160 },
    });
    list.append(first, second);
    document.body.append(list);

    expect(getIntrinsicItemsWidth(list)).to.equal(304);
    list.remove();
  });

  it('ignores hidden items', () => {
    const list = document.createElement('ul');
    const visible = document.createElement('li');
    const hidden = document.createElement('li');
    hidden.style.display = 'none';
    Object.defineProperties(visible, {
      offsetWidth: { value: 100 },
      scrollWidth: { value: 100 },
    });
    Object.defineProperties(hidden, {
      offsetWidth: { value: 500 },
      scrollWidth: { value: 500 },
    });
    list.append(visible, hidden);
    document.body.append(list);

    expect(getIntrinsicItemsWidth(list)).to.equal(100);
    list.remove();
  });

  it('excludes zero-width direct items from margins and gap count', () => {
    const list = document.createElement('ul');
    list.style.columnGap = '24px';
    const visible = document.createElement('li');
    const pending = document.createElement('li');
    pending.style.marginLeft = '40px';
    pending.style.marginRight = '40px';
    Object.defineProperties(visible, {
      offsetWidth: { value: 100 },
      scrollWidth: { value: 100 },
    });
    Object.defineProperties(pending, {
      offsetWidth: { value: 0 },
      scrollWidth: { value: 0 },
    });
    list.append(visible, pending);
    document.body.append(list);

    expect(getIntrinsicItemsWidth(list)).to.equal(100);
    list.remove();
  });
});

describe('compact initialization (MWPW-210874)', () => {
  let header;
  let item;
  let itemWidth;
  let headerWidth;
  let resize;
  let fonts;
  let resolveFonts;
  let desktop;

  beforeEach(() => {
    desktop = true;
    sinon.stub(isDesktop, 'matches').get(() => desktop);
    sinon.stub(window, 'ResizeObserver').callsFake(function Observer(callback) {
      resize = callback;
      this.observe = () => {};
    });
    fonts = new EventTarget();
    fonts.ready = new Promise((resolve) => { resolveFonts = resolve; });
    fonts.status = 'loaded';
    sinon.stub(document, 'fonts').get(() => fonts);
    headerWidth = 1100;
    itemWidth = 1200;
    header = document.createElement('header');
    header.className = 'global-navigation';
    header.innerHTML = '<nav><div class="feds-menu-wrapper"><ul class="feds-gnav-items"><li>Menu</li></ul></div></nav>';
    item = header.querySelector('li');
    Object.defineProperty(header, 'clientWidth', { get: () => headerWidth });
    Object.defineProperties(item, {
      offsetWidth: { get: () => itemWidth },
      scrollWidth: { get: () => itemWidth },
    });
    document.body.append(header);
  });

  afterEach(() => {
    header.remove();
    sinon.restore();
  });

  it('decides compact state synchronously without waiting for a frame or fonts', () => {
    initCompactOverflow(header);
    expect(header.classList.contains('is-compact')).to.equal(true);
  });

  it('keeps a fitting initial desktop row full', () => {
    itemWidth = 500;
    initCompactOverflow(header);
    expect(header.classList.contains('is-compact')).to.equal(false);
  });

  it('does not force compact state on native mobile', () => {
    desktop = false;
    initCompactOverflow(header);
    expect(header.classList.contains('is-compact')).to.equal(false);
  });

  it('reevaluates after resize and breakpoint changes', () => {
    initCompactOverflow(header);
    headerWidth = 1500;
    resize();
    expect(header.classList.contains('is-compact')).to.equal(false);
    headerWidth = 1100;
    isDesktop.dispatchEvent(new Event('change'));
    expect(header.classList.contains('is-compact')).to.equal(true);
  });

  it('reevaluates on merch resolution at a fixed header width', () => {
    itemWidth = 500;
    initCompactOverflow(header);
    expect(header.classList.contains('is-compact')).to.equal(false);
    itemWidth = 1200;
    header.dispatchEvent(new Event(MERCH_RESOLVED_EVENT));
    expect(header.classList.contains('is-compact')).to.equal(true);
  });

  it('reevaluates both initial and later font loads', async () => {
    fonts.status = 'loading';
    initCompactOverflow(header);
    itemWidth = 500;
    resolveFonts();
    await fonts.ready;
    expect(header.classList.contains('is-compact')).to.equal(false);
    itemWidth = 1200;
    fonts.dispatchEvent(new Event('loadingdone'));
    expect(header.classList.contains('is-compact')).to.equal(true);
  });

  it('hides the nav until fonts settle, then reveals the final layout', async () => {
    fonts.status = 'loading';
    itemWidth = 500; // with fallback fonts the row appears to fit
    initCompactOverflow(header);
    const nav = header.querySelector('nav');
    expect(nav.style.visibility).to.equal('hidden');
    itemWidth = 1200; // Adobe Clean is wider and the row actually overflows
    resolveFonts();
    await fonts.ready;
    expect(nav.style.visibility).to.equal('');
    expect(header.classList.contains('is-compact')).to.equal(true);
  });

  it('preserves compact scroll lock while the drawer is open', () => {
    initCompactOverflow(header);
    header.querySelector('.feds-menu-wrapper').classList.add('is-open');
    itemWidth = 500;
    resize();
    expect(header.classList.contains('is-compact')).to.equal(true);
  });
});
