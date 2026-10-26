import { expect } from '@esm-bundle/chai';
import { panels } from '../../../src/Components/Panels/Render';

describe('Panels Render', () => {
  const data = {
    type: 'Panels',
    layout: {
      type: 'PanelsLayout', gridColumns: ['1fr', '2fr'], gridRows: ['1fr'],
    },
    panels: [{
      type: 'LinkPanel',
      position: {
        type: 'PanelPosition', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 2,
      },
      title: 'Explore', links: [], footer: null,
    }],
  };
  let css;
  let frame;

  before(async () => {
    const response = await fetch('/src/Components/Panels/panels.css');
    expect(response.ok).to.equal(true);
    css = await response.text();
  });

  afterEach(() => frame?.remove());

  const renderAtWidth = async (width, compact = false) => {
    frame = document.createElement('iframe');
    frame.style.width = `${width}px`;
    frame.style.height = '600px';
    const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
    frame.srcdoc = `<!doctype html><style>${css}</style>
      <header class="global-navigation${compact ? ' is-compact' : ''}">${panels(data)}</header>`;
    document.body.append(frame);
    await loaded;
    return frame.contentDocument.querySelector('.panels');
  };

  it('stores authored grid tracks in custom properties and preserves panel positions', () => {
    const container = document.createElement('div');
    container.innerHTML = panels(data);
    const grid = container.querySelector('.panels');
    expect(grid.style.getPropertyValue('--feds-panel-grid-columns').trim()).to.equal('1fr 2fr');
    expect(grid.style.getPropertyValue('--feds-panel-grid-rows').trim()).to.equal('1fr');
    expect(grid.style.display).to.equal('');
    expect(grid.style.gridTemplateColumns).to.equal('');
    expect(grid.querySelector('li').style.gridArea).to.equal('1 / 1 / 2 / 3');
  });

  it('uses the authored grid at desktop widths', async () => {
    const grid = await renderAtWidth(1440);
    const style = frame.contentWindow.getComputedStyle(grid);
    expect(style.display).to.equal('grid');
    const columns = style.gridTemplateColumns.split(' ').map(Number.parseFloat);
    expect(columns).to.have.lengthOf(2);
    expect(columns[1] / columns[0]).to.be.closeTo(2, 0.01);
    expect(style.gridTemplateRows).not.to.equal('none');
  });

  for (const width of [768, 1023]) {
    it(`stacks panels at ${width}px without important declarations`, async () => {
      const grid = await renderAtWidth(width);
      const style = frame.contentWindow.getComputedStyle(grid);
      expect(style.display).to.equal('block');
      expect(style.gridTemplateColumns).to.equal('none');
      expect(style.gridTemplateRows).to.equal('none');
    });
  }

  it('stacks panels in compact mode at desktop widths', async () => {
    const grid = await renderAtWidth(1440, true);
    const style = frame.contentWindow.getComputedStyle(grid);
    expect(style.display).to.equal('block');
    expect(style.gridTemplateColumns).to.equal('none');
    expect(style.gridTemplateRows).to.equal('none');
  });
});
