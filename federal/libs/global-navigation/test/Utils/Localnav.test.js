import { expect } from '@esm-bundle/chai';
import { link } from '../../src/Components/Link/Render';
import { megaMenu } from '../../src/Components/MegaMenu/Render';
import { withLocalnavOverviewLabel } from '../../src/Utils/Localnav';

const render = (component) => {
  const container = document.createElement('div');
  container.innerHTML = link(component);
  return container;
};

describe('withLocalnavOverviewLabel', () => {
  it('uses the overview placeholder as the mobile label', () => {
    const container = render(withLocalnavOverviewLabel(
      { type: 'Link', text: 'Video', href: '/video' },
      new Map([['overview', 'Localized overview']]),
    ));

    expect(container.querySelector('.feds-link__desktop-text').textContent)
      .to.equal('Video');
    expect(container.querySelector('.feds-link__mobile-text').textContent)
      .to.equal('Localized overview');
  });

  it('falls back to Overview when the placeholder is missing', () => {
    const container = render(withLocalnavOverviewLabel(
      { type: 'Link', text: 'Video', href: '/video' },
      new Map(),
    ));

    expect(container.querySelector('.feds-link__mobile-text').textContent)
      .to.equal('Overview');
  });

  it('keeps an authored mobile label', () => {
    const component = {
      type: 'Link',
      text: 'Video',
      mobileText: 'Video home',
      href: '/video',
    };

    expect(withLocalnavOverviewLabel(component, new Map([['overview', 'Overview']])))
      .to.equal(component);
  });

  it('relabels a first small menu as Overview on mobile', () => {
    const container = document.createElement('div');
    container.innerHTML = megaMenu(withLocalnavOverviewLabel(
      {
        type: 'SmallMenu',
        title: 'Technical Communication',
        content: [{ type: 'GnavCards', megaMenuTitle: 'Technical Communication', sections: [] }, []],
      },
      new Map([['overview', 'Overview']]),
    ));

    const trigger = container.querySelector('button.mega-menu');
    expect(trigger.getAttribute('aria-controls')).to.equal('technical-communication');
    expect(trigger.querySelector('.feds-link__desktop-text').textContent)
      .to.equal('Technical Communication');
    expect(trigger.querySelector('.feds-link__mobile-text').textContent)
      .to.equal('Overview');
  });
});
