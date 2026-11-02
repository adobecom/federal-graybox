import { expect } from '@esm-bundle/chai';
import { initMerchLinks } from '../../src/PostRendering/MerchLinks';
import {
  setMerchDecorators,
  setMiloConfig,
} from '../../src/Utils/Utils';

const MAS_FIELD =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=cardTitle';
const MAS_CARD =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc';
const OST = 'https://www.adobe.com/tools/ost?osi=abc&type=price';
const MAS_CTA =
  'https://mas.adobe.com/studio.html#content-type=merch-card&path=acom-cc&field=ctas%5B1%5D';

/**
 * initMerchLinks tags OST/miniplans links and inline M@S field links with the
 * `merch` class (routed to Milo's lightweight `merch` block) before it touches
 * config, and leaves full M@S cards untagged so they take the
 * merch-card-autoblock path. Asserting the tagging alone avoids importing the
 * real Milo blocks: the tag runs synchronously, ahead of any config access, and
 * initMerchLinks swallows its own errors, so awaiting it is safe regardless of
 * whatever MiloConfig other test files have (or have not) initialised.
 */
describe('initMerchLinks — commerce link routing', () => {
  afterEach(() => {
    setMerchDecorators({});
  });

  it('tags OST and inline M@S field links, leaves full cards and plain links', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <a href="${OST}">OST price</a>
      <a href="${MAS_FIELD}">M@S field</a>
      <a href="${MAS_CARD}">M@S full card</a>
      <a href="/photoshop">Photoshop</a>
    `;
    document.body.appendChild(mountpoint);

    try {
      await initMerchLinks(mountpoint);

      const [ost, field, card, plain] = mountpoint.querySelectorAll('a');
      expect(ost.classList.contains('merch'), 'OST link').to.equal(true);
      expect(field.classList.contains('merch'), 'inline field link').to.equal(true);
      expect(card.classList.contains('merch'), 'full M@S card').to.equal(false);
      expect(plain.classList.contains('merch'), 'plain link').to.equal(false);
    } finally {
      mountpoint.remove();
    }
  });

  it('rehydrates a product-card commerce placeholder into a merch anchor', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <span class="feds-commerce-placeholder" data-commerce-href="${OST}">US$9.99/mo</span>
    `;
    document.body.appendChild(mountpoint);

    try {
      await initMerchLinks(mountpoint);

      const anchor = mountpoint.querySelector('a');
      expect(anchor, 'placeholder became an anchor').to.not.equal(null);
      expect(anchor.getAttribute('href')).to.equal(OST);
      expect(anchor.classList.contains('merch')).to.equal(true);
      expect(mountpoint.querySelector('.feds-commerce-placeholder')).to.equal(null);
    } finally {
      mountpoint.remove();
    }
  });

  it('resolves a MAS link CTA in authored paragraph context and applies Federal classes', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-link" href="${MAS_CTA}" daa-ll="Buy now">Mas-field: long authoring label</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let stagedLink;
    setMerchDecorators({
      merch: async (link) => {
        stagedLink = link;
        expect(link.closest('p')).to.not.equal(null);
        const masField = document.createElement('mas-field');
        masField.innerHTML = '<a class="con-button button-xl outline">Buy now</a>';
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      const resolved = mountpoint.querySelector('a');
      expect(stagedLink).to.not.equal(resolved);
      expect(resolved.textContent).to.equal('Buy now');
      expect(resolved.classList.contains('feds-link')).to.equal(true);
      expect(resolved.classList.contains('con-button')).to.equal(false);
      expect(resolved.classList.contains('button-xl')).to.equal(false);
      expect(resolved.classList.contains('outline')).to.equal(false);
      expect(resolved.getAttribute('daa-ll')).to.equal('Buy now');
    } finally {
      mountpoint.remove();
    }
  });

  it('preserves only supported Federal link classes', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <a class="merch feds-link feds-link--highlight feds-unrelated" href="${OST}">Price</a>
    `;
    document.body.appendChild(mountpoint);
    setMerchDecorators({
      merch: (link) => {
        const resolved = document.createElement('a');
        resolved.textContent = 'US$9.99/mo';
        link.replaceWith(resolved);
        return resolved;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      const resolved = mountpoint.querySelector('a');
      expect(resolved.classList.contains('feds-link')).to.equal(true);
      expect(resolved.classList.contains('feds-link--highlight')).to.equal(true);
      expect(resolved.classList.contains('feds-unrelated')).to.equal(false);
    } finally {
      mountpoint.remove();
    }
  });

  it('does not add generated analytics to an OST result', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <a class="merch feds-link" href="${OST}">Price</a>
    `;
    document.body.appendChild(mountpoint);
    setMerchDecorators({
      merch: (link) => {
        const resolved = document.createElement('span');
        resolved.textContent = 'US$9.99/mo';
        link.replaceWith(resolved);
        return resolved;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      expect(mountpoint.querySelector('span').hasAttribute('daa-ll'))
        .to.equal(false);
    } finally {
      mountpoint.remove();
    }
  });

  it('replaces a generated MAS analytics label with the resolved link text', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li>
          <a
            class="feds-link"
            href="${MAS_CTA}"
            daa-ll="Mas-field: long authoring label"
          >Mas-field: long authoring label</a>
        </li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    setMerchDecorators({
      merch: async (link) => {
        const resolved = document.createElement('a');
        resolved.textContent = 'Buy now';
        link.replaceWith(resolved);
        return resolved;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      const resolved = mountpoint.querySelector('a');
      expect(resolved.getAttribute('daa-ll')).to.equal('Buy now');
    } finally {
      mountpoint.remove();
    }
  });

  it('preserves an explicit MAS analytics label', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li>
          <a
            class="feds-link"
            href="${MAS_CTA}"
            daa-ll="localnav-buy-now"
          >Mas-field: long authoring label</a>
        </li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    setMerchDecorators({
      merch: async (link) => {
        const resolved = document.createElement('a');
        resolved.textContent = 'Buy now';
        link.replaceWith(resolved);
        return resolved;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      const resolved = mountpoint.querySelector('a');
      expect(resolved.getAttribute('daa-ll')).to.equal('localnav-buy-now');
    } finally {
      mountpoint.remove();
    }
  });

  it('waits for a late mas:ready CTA before replacing the hidden authored label', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-primary-cta" href="${MAS_CTA}" daa-ll="Free trial">Mas-field: long free trial authoring label</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let masField;
    setMerchDecorators({
      merch: async (link) => {
        expect(link.closest('strong')).to.not.equal(null);
        masField = document.createElement('mas-field');
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      await initMerchLinks(mountpoint);

      const pending = mountpoint.querySelector('a');
      expect(pending.hasAttribute('data-feds-merch-pending')).to.equal(true);

      masField.innerHTML = '<a class="con-button button-l">Free trial</a>';
      masField.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));

      const resolved = mountpoint.querySelector('a');
      expect(resolved.textContent).to.equal('Free trial');
      expect(resolved.classList.contains('feds-primary-cta')).to.equal(true);
      expect(resolved.classList.contains('con-button')).to.equal(false);
      expect(resolved.classList.contains('button-l')).to.equal(false);
      expect(resolved.hasAttribute('data-feds-merch-pending')).to.equal(false);
      expect(resolved.getAttribute('daa-ll')).to.equal('Free trial');
    } finally {
      mountpoint.remove();
    }
  });

  it('waits for Milo to hoist a late plain link before finalizing it', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-link" href="${MAS_CTA}">Mas-field: Buy now</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let masField;
    const onMasReady = async (event) => {
      if (event.target !== masField) return;
      if (masField.closest('em, strong') === null) return;
      await Promise.resolve();
      const content = masField.querySelector('[data-role="mas-field-content"]');
      const resolved = content.querySelector('a');
      resolved.dataset.miloDecorated = 'true';
      masField.replaceChildren(resolved);
    };
    document.addEventListener('mas:ready', onMasReady);
    setMerchDecorators({
      merch: async (link) => {
        masField = document.createElement('mas-field');
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      await initMerchLinks(mountpoint);
      masField.innerHTML = `
        <span data-role="mas-field-content">
          <a class="con-button button-l">Buy now</a>
        </span>
      `;
      masField.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));
      await Promise.resolve();
      await Promise.resolve();

      const resolved = mountpoint.querySelector('a');
      expect(resolved.dataset.miloDecorated).to.equal('true');
      expect(resolved.classList.contains('feds-link')).to.equal(true);
      expect(resolved.getAttribute('daa-ll')).to.equal('Buy now');
    } finally {
      document.removeEventListener('mas:ready', onMasReady);
      mountpoint.remove();
    }
  });

  it('removes the navigation item when a staged MAS field resolves empty', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-link" href="${MAS_FIELD}">Mas-field: Missing field</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let masField;
    let resolvedEvents = 0;
    mountpoint.addEventListener('feds:merch-resolved', () => {
      resolvedEvents += 1;
    });
    setMerchDecorators({
      merch: async (link) => {
        masField = document.createElement('mas-field');
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      await initMerchLinks(mountpoint);
      masField.dispatchEvent(new CustomEvent('mas:ready', { bubbles: true }));

      expect(mountpoint.querySelector('li')).to.equal(null);
      expect(mountpoint.textContent).to.not.include('Mas-field: Missing field');
      expect(resolvedEvents).to.equal(1);
    } finally {
      mountpoint.remove();
    }
  });

  it('removes the navigation item when a staged MAS field reports an AEM error', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-link" href="${MAS_FIELD}">Mas-field: Card title</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let masField;
    let stagingContainer;
    let resolvedEvents = 0;
    mountpoint.addEventListener('feds:merch-resolved', () => {
      resolvedEvents += 1;
    });
    setMerchDecorators({
      merch: async (link) => {
        stagingContainer = link.closest('div');
        masField = document.createElement('mas-field');
        masField.append(document.createElement('aem-fragment'));
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      await initMerchLinks(mountpoint);
      masField.querySelector('aem-fragment')
        .dispatchEvent(new CustomEvent('aem:error', { bubbles: true }));

      expect(mountpoint.querySelector('li')).to.equal(null);
      expect(mountpoint.textContent).to.not.include('Mas-field: Card title');
      expect(stagingContainer.isConnected).to.equal(false);
      expect(resolvedEvents).to.equal(1);
    } finally {
      mountpoint.remove();
    }
  });

  it('removes only the failed pending navigation item', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a href="${MAS_FIELD}">First field</a></li>
        <li><a href="${MAS_CTA}">Second field</a></li>
      </ul>
    `;
    document.body.appendChild(mountpoint);
    let resolvedEvents = 0;
    let decoratedLinks = 0;
    mountpoint.addEventListener('feds:merch-resolved', () => {
      resolvedEvents += 1;
    });
    setMerchDecorators({
      merch: (link) => {
        decoratedLinks += 1;
        if (decoratedLinks === 1) throw new Error('decoration failed');
        const masField = document.createElement('mas-field');
        link.replaceWith(masField);
        return masField;
      },
    });

    try {
      const errors = await initMerchLinks(mountpoint);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(errors.size).to.equal(0);
      expect(mountpoint.querySelectorAll('li').length).to.equal(1);
      expect(mountpoint.querySelectorAll('[data-feds-merch-pending]').length)
        .to.equal(1);
      expect(mountpoint.textContent).to.not.include('First field');
      expect(mountpoint.textContent).to.include('Second field');
      expect(resolvedEvents).to.equal(1);
    } finally {
      mountpoint.remove();
    }
  });

  it('does not await a full MAS card or dispatch a compact event', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <div class="feds-popup"><a href="${MAS_CARD}">Full card</a></div>
    `;
    document.body.appendChild(mountpoint);
    let finishDecoration;
    const decorationFinished = new Promise((resolve) => {
      finishDecoration = resolve;
    });
    let resolvedEvents = 0;
    let decorationStarted = false;
    mountpoint.addEventListener('feds:merch-resolved', () => {
      resolvedEvents += 1;
    });
    setMerchDecorators({
      masCard: () => {
        decorationStarted = true;
        return decorationFinished;
      },
    });

    try {
      await initMerchLinks(mountpoint);
      expect(decorationStarted).to.equal(true);
      expect(resolvedEvents).to.equal(0);

      finishDecoration();
      await Promise.resolve();
      expect(resolvedEvents).to.equal(0);
    } finally {
      mountpoint.remove();
    }
  });

  it('keeps a resolved top-level link when the full-card module fails', async () => {
    const mountpoint = document.createElement('div');
    mountpoint.innerHTML = `
      <ul class="feds-gnav-items">
        <li><a class="feds-link" href="${MAS_CTA}">Mas-field: Buy now</a></li>
      </ul>
      <div class="feds-popup"><a href="${MAS_CARD}">Full card</a></div>
    `;
    document.body.appendChild(mountpoint);
    setMiloConfig({
      base: '/missing-milo',
      env: { name: 'stage' },
      locale: { prefix: '', ietf: 'en-US' },
    });
    setMerchDecorators({
      merch: (link) => {
        const resolved = document.createElement('a');
        resolved.textContent = 'Buy now';
        link.replaceWith(resolved);
        return resolved;
      },
    });

    try {
      const errors = await initMerchLinks(mountpoint);

      expect(errors.size).to.equal(1);
      expect([...errors][0].message).to.include('Error initializing M@S cards');
      expect(mountpoint.querySelectorAll('ul.feds-gnav-items > li').length)
        .to.equal(1);
      expect(mountpoint.querySelector('ul.feds-gnav-items > li > a').textContent)
        .to.equal('Buy now');
    } finally {
      mountpoint.remove();
    }
  });
});
