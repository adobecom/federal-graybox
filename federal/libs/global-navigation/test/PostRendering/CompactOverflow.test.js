import { expect } from '@esm-bundle/chai';
import { getIntrinsicItemsWidth } from '../../src/PostRendering/CompactOverflow.ts';

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
