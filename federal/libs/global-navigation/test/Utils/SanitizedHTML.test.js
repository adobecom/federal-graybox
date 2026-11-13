import { expect } from '@esm-bundle/chai';
import { setSanitizedHTML, isHttpUrl } from '../../src/Utils/Utils';

describe('isHttpUrl', () => {
  it('accepts absolute and relative http(s) URLs', () => {
    expect(isHttpUrl('https://www.adobe.com/tools/ost?osi=abc')).to.be.true;
    expect(isHttpUrl('http://example.com')).to.be.true;
    expect(isHttpUrl('/photoshop')).to.be.true;
  });

  it('rejects empty and script-capable URLs', () => {
    expect(isHttpUrl('')).to.be.false;
    expect(isHttpUrl('javascript:alert(1)')).to.be.false;
    expect(isHttpUrl(' JaVaScRiPt:alert(1)')).to.be.false;
    expect(isHttpUrl('data:text/html,<script>alert(1)</script>')).to.be.false;
    expect(isHttpUrl('vbscript:msgbox(1)')).to.be.false;
  });
});

describe('setSanitizedHTML', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('strips script tags', () => {
    setSanitizedHTML(el, '<span>ok</span><script>window.__xss = 1;</script>');
    expect(el.querySelector('script')).to.be.null;
    expect(el.textContent).to.equal('ok');
  });

  it('strips inline event handlers', () => {
    setSanitizedHTML(el, '<img src="x" onerror="window.__xss = 1"><a href="/" onclick="alert(1)">a</a>');
    expect(el.querySelector('img').hasAttribute('onerror')).to.be.false;
    expect(el.querySelector('a').hasAttribute('onclick')).to.be.false;
  });

  it('strips javascript: URLs', () => {
    setSanitizedHTML(el, '<a href="javascript:alert(1)">a</a>');
    expect(el.querySelector('a').hasAttribute('href')).to.be.false;
  });

  it('neutralizes decoded page text injected into the template', () => {
    // e.g. a breadcrumb whose textContent decodes `&lt;img onerror&gt;`
    const crumb = '<img src=x onerror="window.__xss = 1">';
    setSanitizedHTML(el, `<ul class="feds-breadcrumbs"><li><span>${crumb}</span></li></ul>`);
    expect(el.querySelector('[onerror]')).to.be.null;
    expect(el.querySelector('.feds-breadcrumbs span')).to.not.be.null;
  });

  it('removes iframes, objects and embeds', () => {
    setSanitizedHTML(el, '<iframe src="https://evil.example"></iframe><object data="x"></object><embed src="x">');
    expect(el.querySelector('iframe, object, embed')).to.be.null;
  });

  it('preserves the markup the gnav relies on', () => {
    setSanitizedHTML(el, `
      <nav class="localnav">
        <button class="feds-nav-toggle" type="button" aria-label="Navigation menu"
          daa-ll="hamburgermenu|open" aria-expanded="false" aria-controls="fonts">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7" focusable="false" aria-hidden="true"><path d="M0 0H1"/></svg>
        </button>
        <div id="fonts" class="feds-popup" daa-lh="Fonts" role="dialog" tabindex="-1">
          <a class="feds-link" href="https://www.adobe.com/fonts.html" target="_blank"
            data-feds-merch-pending daa-ll="Fonts">Fonts</a>
          <picture><source media="(min-width: 600px)" srcset="/a.png"><img src="/a.png" alt="" loading="lazy"></picture>
        </div>
        <a href="#main-content" class="feds-skip-link">Skip</a>
      </nav>`);

    const toggle = el.querySelector('.feds-nav-toggle');
    expect(toggle.getAttribute('daa-ll')).to.equal('hamburgermenu|open');
    expect(toggle.getAttribute('aria-controls')).to.equal('fonts');
    expect(toggle.querySelector('svg path')).to.not.be.null;
    expect(toggle.querySelector('svg').getAttribute('focusable')).to.equal('false');

    // ids that shadow document properties (document.fonts) must survive
    const popup = el.querySelector('#fonts');
    expect(popup).to.not.be.null;
    expect(popup.getAttribute('daa-lh')).to.equal('Fonts');
    expect(popup.getAttribute('tabindex')).to.equal('-1');

    const link = el.querySelector('a.feds-link');
    expect(link.getAttribute('href')).to.equal('https://www.adobe.com/fonts.html');
    expect(link.getAttribute('target')).to.equal('_blank');
    expect(link.hasAttribute('data-feds-merch-pending')).to.be.true;

    expect(el.querySelector('picture source').getAttribute('srcset')).to.equal('/a.png');
    expect(el.querySelector('img').getAttribute('loading')).to.equal('lazy');
    expect(el.querySelector('.feds-skip-link').getAttribute('href')).to.equal('#main-content');
  });
});
