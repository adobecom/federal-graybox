import { expect } from '@esm-bundle/chai';
import { wirePopups } from '../../src/PostRendering/PopupWiring';

describe('Popup wiring analytics labels', () => {
  let mountpoint;

  beforeEach(() => {
    mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <button class="feds-nav-toggle" aria-controls="feds-menu-wrapper"></button>
      <div id="feds-menu-wrapper"></div>
      <button class="feds-localnav-bar" aria-controls="localnav-popup"></button>
      <div id="localnav-popup" class="feds-popup"></div>
      <button class="mega-menu" aria-controls="header-popup"></button>
      <div id="header-popup" class="feds-popup"></div>
    `;
    document.body.append(mountpoint);
    wirePopups(mountpoint);
  });

  afterEach(() => {
    mountpoint.remove();
  });

  const cases = [
    ['.feds-nav-toggle', 'hamburgermenu|close', 'hamburgermenu|open'],
    ['.feds-localnav-bar', 'localnav-bar|Close', 'localnav-bar|Open'],
    ['.mega-menu', 'header|Close', 'header|Open'],
  ];

  cases.forEach(([selector, openLabel, closedLabel]) => {
    it(`sets ${selector} labels for open and closed states`, () => {
      const trigger = mountpoint.querySelector(selector);

      trigger.click();
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');
      expect(trigger.getAttribute('daa-ll')).to.equal(openLabel);

      trigger.click();
      expect(trigger.getAttribute('aria-expanded')).to.equal('false');
      expect(trigger.getAttribute('daa-ll')).to.equal(closedLabel);
    });
  });
});
