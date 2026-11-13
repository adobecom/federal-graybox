import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { initClickListeners } from '../../src/PostRendering/ClickListeners';
import { isDesktop } from '../../src/Utils/Utils';

describe('Component click listener initialization', () => {
  let sandbox;
  let gnav;
  let main;
  let cleanup;
  let desktop;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    desktop = true;
    sandbox.stub(isDesktop, 'matches').get(() => desktop);
    gnav = document.createElement('header');
    gnav.innerHTML = `
      <a class="feds-skip-link" href="#main-content">Skip</a>
      <div class="tabs" role="tablist">
        <button role="tab" aria-selected="true">First</button>
        <button role="tab" aria-selected="false">Second</button>
      </div>
      <div class="tab-content">
        <div role="tabpanel">First panel</div>
        <div role="tabpanel" hidden>Second panel</div>
      </div>
    `;
    main = document.createElement('main');
    main.id = 'main-content';
    document.body.append(gnav, main);
    cleanup = initClickListeners(gnav);
  });

  afterEach(() => {
    cleanup();
    gnav.remove();
    main.remove();
    sandbox.restore();
  });

  it('focuses main content on skip-link click and removes the listener on cleanup', () => {
    const clock = sandbox.useFakeTimers();
    const scroll = sandbox.stub(main, 'scrollIntoView');
    const skipLink = gnav.querySelector('.feds-skip-link');
    const click = () => {
      const event = new MouseEvent('click', { cancelable: true });
      skipLink.dispatchEvent(event);
      return event;
    };

    expect(click().defaultPrevented).to.be.true;
    clock.tick(100);
    expect(document.activeElement).to.equal(main);
    expect(main.getAttribute('tabindex')).to.equal('-1');
    expect(scroll.calledOnceWithExactly({ behavior: 'smooth', block: 'start' })).to.be.true;

    cleanup();
    expect(click().defaultPrevented).to.be.false;
    clock.tick(100);
    expect(scroll.calledOnce).to.be.true;
  });

  it('switches tab panels and removes tab click handlers on cleanup', () => {
    const buttons = gnav.querySelectorAll('[role="tab"]');
    const panels = gnav.querySelectorAll('[role="tabpanel"]');

    buttons[1].click();
    expect(buttons[0].getAttribute('aria-selected')).to.equal('false');
    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(panels[0].hasAttribute('hidden')).to.be.true;
    expect(panels[1].hasAttribute('hidden')).to.be.false;

    cleanup();
    buttons[0].click();
    expect(buttons[1].getAttribute('aria-selected')).to.equal('true');
    expect(panels[1].hasAttribute('hidden')).to.be.false;
  });

  it('updates tab orientation on viewport changes and stops after cleanup', () => {
    const tabList = gnav.querySelector('[role="tablist"]');
    expect(tabList.getAttribute('aria-orientation')).to.equal('vertical');

    desktop = false;
    isDesktop.dispatchEvent(new Event('change'));
    expect(tabList.hasAttribute('aria-orientation')).to.be.false;

    cleanup();
    desktop = true;
    isDesktop.dispatchEvent(new Event('change'));
    expect(tabList.hasAttribute('aria-orientation')).to.be.false;
  });
});
