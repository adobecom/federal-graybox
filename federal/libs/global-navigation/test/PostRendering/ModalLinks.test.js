import { expect } from '@esm-bundle/chai';
import { initModalLinks } from '../../src/PostRendering/ModalLinks';
import { wirePopups } from '../../src/PostRendering/PopupWiring';

describe('host modal link decoration', () => {
  let mountpoint;

  beforeEach(() => {
    mountpoint = document.createElement('header');
    mountpoint.innerHTML = `
      <button aria-controls="feds-menu-wrapper">Menu</button>
      <div id="feds-menu-wrapper">
        <button aria-controls="modal-menu">Products</button>
        <div class="feds-popup" id="modal-menu">
          <a class="feds-primary-cta" href="/fragments/eligibility#eligibility">Check eligibility</a>
          <a href="/ordinary-page">Ordinary link</a>
        </div>
      </div>`;
    document.body.append(mountpoint);
    wirePopups(mountpoint);
  });

  afterEach(() => {
    window.dispatchEvent(new CustomEvent('milo:modal:closed', {
      detail: { hash: '#eligibility' },
    }));
    mountpoint.remove();
  });

  const decorate = async (root) => {
    await Promise.resolve();
    const link = root.querySelector('.feds-primary-cta');
    link.dataset.modalHash = '#eligibility';
    link.dataset.modalPath = '/fragments/eligibility';
    link.href = '#eligibility';
  };

  const clickWithoutNavigation = (link) => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    mountpoint.addEventListener('click', e => e.preventDefault(), { once: true });
    link.dispatchEvent(event);
  };

  it('awaits host decoration on the final rendered anchors', async () => {
    await initModalLinks(mountpoint, decorate);
    const link = mountpoint.querySelector('a');
    expect(link.dataset.modalHash).to.equal('#eligibility');
    expect(link.classList.contains('feds-primary-cta')).to.be.true;
  });

  it('leaves navigation untouched when the host provides no decorator', async () => {
    const html = mountpoint.innerHTML;
    await initModalLinks(mountpoint);
    expect(mountpoint.innerHTML).to.equal(html);
  });

  it('closes the menu and restores focus to its visible control on modal dismissal', async () => {
    await initModalLinks(mountpoint, decorate);
    const menuButton = mountpoint.querySelector('[aria-controls="feds-menu-wrapper"]');
    const popupButton = mountpoint.querySelector('[aria-controls="modal-menu"]');
    menuButton.click();
    popupButton.click();
    const link = mountpoint.querySelector('a');
    link.focus();
    clickWithoutNavigation(link);
    expect(mountpoint.querySelector('.is-open')).to.be.null;
    expect(menuButton.getAttribute('aria-expanded')).to.equal('false');
    expect(popupButton.getAttribute('aria-expanded')).to.equal('false');
    window.dispatchEvent(new CustomEvent('milo:modal:closed', {
      detail: { hash: '#eligibility' },
    }));
    link.focus();
    await Promise.resolve();
    expect(document.activeElement).to.equal(menuButton);
  });

  it('does not close a popup for a modified modal click', async () => {
    await initModalLinks(mountpoint, decorate);
    mountpoint.querySelector('[aria-controls="modal-menu"]').click();
    const link = mountpoint.querySelector('a');
    const event = new MouseEvent('click', {
      bubbles: true, cancelable: true, ctrlKey: true,
    });
    mountpoint.addEventListener('click', e => e.preventDefault(), { once: true });
    link.dispatchEvent(event);
    expect(mountpoint.querySelector('#modal-menu').classList.contains('is-open')).to.be.true;
  });

  it('does not close a popup for an ordinary link', async () => {
    await initModalLinks(mountpoint, decorate);
    mountpoint.querySelector('[aria-controls="modal-menu"]').click();
    clickWithoutNavigation(mountpoint.querySelector('a[href="/ordinary-page"]'));
    expect(mountpoint.querySelector('#modal-menu').classList.contains('is-open')).to.be.true;
  });

  it('propagates host decoration failures', async () => {
    const failure = new Error('Modal decoration failed');
    let caught;
    try {
      await initModalLinks(mountpoint, async () => { throw failure; });
    } catch (error) {
      caught = error;
    }
    expect(caught).to.equal(failure);
  });
});
