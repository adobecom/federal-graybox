import { expect } from '@esm-bundle/chai';
import { link } from '../../../src/Components/Link/Render';

describe('Link Render', () => {
  it('hides a MAS CTA authoring label until commerce resolves it', () => {
    const html = link({
      type: 'Link',
      text: 'Mas-field: Buy now',
      href: 'https://mas.adobe.com/studio.html#path=acom-cc&field=ctas%5B1%5D',
    });
    const container = document.createElement('div');
    container.innerHTML = html;

    expect(
      container.querySelector('a.feds-link')
        .hasAttribute('data-feds-merch-pending')
    ).to.equal(true);
  });

  it('does not hide an ordinary navigation link', () => {
    const html = link({
      type: 'Link',
      text: 'Overview',
      href: '/overview',
    });
    const container = document.createElement('div');
    container.innerHTML = html;

    expect(
      container.querySelector('a.feds-link')
        .hasAttribute('data-feds-merch-pending')
    ).to.equal(false);
  });
});
