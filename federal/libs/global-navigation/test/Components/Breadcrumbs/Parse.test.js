import { expect } from '@esm-bundle/chai';
import { parseBreadcrumbs } from '../../../src/Components/Breadcrumbs/Parse';
import { IrrecoverableError } from '../../../src/Error/Error';

const breadcrumbsEl = (list) => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="breadcrumbs">
      <div><div>
        <${list}>
          <li><a href="https://www.adobe.com/">Home</a></li>
          <li><a href="https://www.adobe.com/creativecloud.html">Adobe Creative Cloud</a></li>
          <li>Compare plans</li>
        </${list}>
      </div></div>
    </div>`;
  return container.querySelector('.breadcrumbs');
};

describe('Breadcrumbs Parse', () => {
  for (const list of ['ul', 'ol']) {
    it(`parses breadcrumbs authored as <${list}>`, () => {
      const [result, errors] = parseBreadcrumbs(breadcrumbsEl(list));

      expect(errors).to.have.lengthOf(0);
      expect(result.type).to.equal('Breadcrumbs');
      expect(result.items).to.have.lengthOf(3);
      expect(result.items[0].href).to.equal('https://www.adobe.com/');
      expect(result.items[1].href).to.equal('https://www.adobe.com/creativecloud.html');
      expect(result.items[2]).to.equal('Compare plans');
    });
  }

  it('throws when the breadcrumbs block has no list items', () => {
    const container = document.createElement('div');
    container.innerHTML = '<div class="breadcrumbs"><div><div><p>Home</p></div></div></div>';

    expect(() => parseBreadcrumbs(container.querySelector('.breadcrumbs')))
      .to.throw(IrrecoverableError, 'No items found');
  });
});
