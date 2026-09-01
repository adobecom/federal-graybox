import { expect } from '@esm-bundle/chai';
import { initPromoCountdown } from '../../../src/Components/CountdownTimer/cdt.ts';
import { setMiloConfig } from '../../../src/Utils/Utils.ts';

// ?instant overrides are only honoured in non-prod environments, so the
// countdown code reads the env from MiloConfig. Initialise it once here
// (setMiloConfig is a singleton and ignores subsequent calls).
setMiloConfig({ locale: { prefix: '' }, env: { name: 'stage' } });

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formats a Date as the canonical local-time "YYYY-MM-DDTHH:MM:SS" string
// (no timezone suffix) accepted by the countdown parser.
function toLocalDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function setMeta(content) {
  document.querySelector('meta[name="gnav-promo-countdown"]')?.remove();
  if (content === null) return;
  const meta = document.createElement('meta');
  meta.name = 'gnav-promo-countdown';
  meta.content = content;
  document.head.append(meta);
}

function buildInner() {
  const inner = document.createElement('div');
  inner.className = 'feds-promo-bar-inner';

  const icon = document.createElement('img');
  icon.className = 'feds-promo-bar-icon';
  icon.src = 'icon.svg';
  icon.alt = 'icon';

  const text = document.createElement('p');
  text.className = 'feds-promo-bar-text';
  text.textContent = 'Sale ends soon';

  inner.append(icon, text);
  document.body.append(inner);
  return { inner, text };
}

function activeRange() {
  const start = toLocalDateTime(new Date(Date.now() - 60_000));
  const end = toLocalDateTime(new Date(Date.now() + 60 * 60_000));
  return `${start},${end}`;
}

function futureRange() {
  const start = toLocalDateTime(new Date(Date.now() + 24 * 60 * 60_000));
  const end = toLocalDateTime(new Date(Date.now() + 48 * 60 * 60_000));
  return `${start},${end}`;
}

function pastRange() {
  const start = toLocalDateTime(new Date(Date.now() - 48 * 60 * 60_000));
  const end = toLocalDateTime(new Date(Date.now() - 24 * 60 * 60_000));
  return `${start},${end}`;
}

afterEach(() => {
  document.querySelectorAll('.feds-promo-bar-inner').forEach((el) => el.remove());
  setMeta(null);
  // Remove any ?instant param leftover
  const url = new URL(window.location.href);
  url.searchParams.delete('instant');
  window.history.replaceState({}, '', url);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CDT — initPromoCountdown', () => {

  // ── Metadata parsing ────────────────────────────────────────────────────────

  describe('metadata absent or malformed', () => {
    it('does not inject CDT when gnav-promo-countdown meta is missing', () => {
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when meta has only one value (no comma)', () => {
      setMeta('2026-09-01T00:00:00');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when meta has more than two comma-separated values', () => {
      setMeta('2026-09-01T00:00:00,2026-09-30T00:00:00,2026-10-01T00:00:00');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when start date is invalid', () => {
      setMeta('not-a-date,2026-09-30T00:00:00');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when end date is invalid', () => {
      setMeta('2026-09-01T00:00:00,not-a-date');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when dates use a "Z"/UTC suffix (non-canonical)', () => {
      setMeta('2026-09-01T00:00:00.000Z,2026-09-30T00:00:00.000Z');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when dates use a named timezone (non-canonical)', () => {
      setMeta('2026-09-01 00:00:00 PST,2026-09-30 00:00:00 PST');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when start is after end (reversed range)', () => {
      setMeta('2026-09-30T00:00:00,2026-09-01T00:00:00');
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when the window exceeds 99 days', () => {
      const start = toLocalDateTime(new Date(Date.now() - 60_000));
      // 100 days after start — beyond the 99-day cap.
      const end = toLocalDateTime(new Date(Date.now() + 100 * 24 * 60 * 60_000));
      setMeta(`${start},${end}`);
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('injects CDT when the window is exactly 99 days', () => {
      const start = toLocalDateTime(new Date(Date.now() - 60_000));
      const end = toLocalDateTime(new Date(Date.now() - 60_000 + 99 * 24 * 60 * 60_000));
      setMeta(`${start},${end}`);
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.not.equal(null);
    });
  });

  // ── Time-window guards ───────────────────────────────────────────────────────

  describe('time window', () => {
    it('does not inject CDT when current time is before the start date', () => {
      setMeta(futureRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('does not inject CDT when current time is after the end date', () => {
      setMeta(pastRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });

    it('injects CDT when current time is within the start–end range', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      expect(inner.querySelector('.feds-cdt')).to.not.equal(null);
    });
  });

  // ── DOM structure ────────────────────────────────────────────────────────────

  describe('DOM structure when within range', () => {
    it('inserts .feds-promo-bar-icon-cdt wrapper immediately before .feds-promo-bar-text', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const wrapper = inner.querySelector('.feds-promo-bar-icon-cdt');
      expect(wrapper).to.not.equal(null);
      expect(wrapper.nextElementSibling).to.equal(text);
    });

    it('moves the icon inside the wrapper', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const wrapper = inner.querySelector('.feds-promo-bar-icon-cdt');
      expect(wrapper.querySelector('.feds-promo-bar-icon')).to.not.equal(null);
      // icon is no longer a direct child of inner
      expect(inner.querySelector(':scope > .feds-promo-bar-icon')).to.equal(null);
    });

    it('places .feds-cdt inside the wrapper', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const wrapper = inner.querySelector('.feds-promo-bar-icon-cdt');
      expect(wrapper.querySelector('.feds-cdt')).to.not.equal(null);
    });

    it('renders visible timer text in DD:HH:MM:SS format (aria-hidden)', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const visual = inner.querySelector('.feds-cdt .feds-cdt-visual');
      expect(visual).to.not.equal(null);
      expect(visual.getAttribute('aria-hidden')).to.equal('true');
      expect(visual.textContent).to.match(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
    });
    it('sets role="timer" on the CDT element', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const cdt = inner.querySelector('.feds-cdt');
      expect(cdt.getAttribute('role')).to.equal('timer');
    });

    it('exposes an on-arrival "Ends in" label via a visually-hidden span', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const sr = inner.querySelector('.feds-cdt .feds-cdt-sr');
      expect(sr).to.not.equal(null);
      expect(sr.textContent).to.match(/^Ends in /);
    });
    it('adds an empty polite live region for announcements', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const live = inner.querySelector('.feds-cdt-live');
      expect(live).to.not.equal(null);
      expect(live.getAttribute('aria-live')).to.equal('polite');
      expect(live.getAttribute('aria-atomic')).to.equal('true');
      expect(live.textContent).to.equal('');
    });
    it('does not put the colon time in an aria-label (NVDA reads it literally)', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const cdt = inner.querySelector('.feds-cdt');
      expect(cdt.getAttribute('aria-label')).to.equal(null);
    });
  });

  // ── Theme ────────────────────────────────────────────────────────────────────

  describe('theme', () => {
    it('does not add feds-cdt--dark when isDark is false', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const cdt = inner.querySelector('.feds-cdt');
      expect(cdt.classList.contains('feds-cdt--dark')).to.equal(false);
    });

    it('adds feds-cdt--dark when isDark is true', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, true);

      const cdt = inner.querySelector('.feds-cdt');
      expect(cdt.classList.contains('feds-cdt--dark')).to.equal(true);
    });
  });

  // ── Timer values via ?instant ─────────────────────────────────────────────────

  describe('timer values', () => {
    it('shows correct DD:HH:MM:SS for a known ?instant override', () => {
      setMeta('2026-09-01T00:00:00,2026-10-01T00:00:00');

      const url = new URL(window.location.href);
      url.searchParams.set('instant', '2026-09-24T00:00:00');
      window.history.replaceState({}, '', url);

      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const visual = inner.querySelector('.feds-cdt .feds-cdt-visual');
      expect(visual.textContent).to.equal('07:00:00:00');
    });

    it('shows correct seconds component', () => {
      setMeta('2026-08-31T00:00:00,2026-09-01T01:30:45');

      const url = new URL(window.location.href);
      url.searchParams.set('instant', '2026-09-01T00:00:00');
      window.history.replaceState({}, '', url);

      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const visual = inner.querySelector('.feds-cdt .feds-cdt-visual');
      expect(visual.textContent).to.equal('00:01:30:45');
    });

    it('ignores a ?instant value that is not in canonical format', () => {
      // A "Z"-suffixed instant is non-canonical and must be ignored, falling
      // back to real time (which is outside this past window → no timer).
      setMeta('2020-01-01T00:00:00,2020-01-02T00:00:00');

      const url = new URL(window.location.href);
      url.searchParams.set('instant', '2020-01-01T12:00:00.000Z');
      window.history.replaceState({}, '', url);

      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      expect(inner.querySelector('.feds-cdt')).to.equal(null);
    });
  });

  // ── End reached — structure restored ─────────────────────────────────────────

  describe('when the end time is reached', () => {
    // ?instant equal to the end time makes startTimer's first (synchronous)
    // tick see diff <= 0, triggering the teardown immediately.
    function buildInnerWithCta() {
      const inner = document.createElement('div');
      inner.className = 'feds-promo-bar-inner';

      const icon = document.createElement('img');
      icon.className = 'feds-promo-bar-icon';
      icon.src = 'icon.svg';
      icon.alt = 'icon';

      const text = document.createElement('p');
      text.className = 'feds-promo-bar-text';
      text.textContent = 'Sale ends soon';

      const ctas = document.createElement('div');
      ctas.className = 'feds-promo-bar-ctas';

      inner.append(icon, text, ctas);
      document.body.append(inner);
      return { inner, text, icon, ctas };
    }

    function initAtEnd(inner, text) {
      setMeta('2026-09-01T00:00:00,2026-09-30T23:59:59');
      const url = new URL(window.location.href);
      url.searchParams.set('instant', '2026-09-30T23:59:59');
      window.history.replaceState({}, '', url);
      initPromoCountdown(inner, text, false);
    }

    it('removes the countdown element and wrapper', () => {
      const { inner, text } = buildInnerWithCta();
      initAtEnd(inner, text);

      expect(inner.querySelector('.feds-cdt')).to.equal(null);
      expect(inner.querySelector('.feds-promo-bar-icon-cdt')).to.equal(null);
    });

    it('restores the icon as a direct child before the text', () => {
      const { inner, text, icon } = buildInnerWithCta();
      initAtEnd(inner, text);

      expect(inner.querySelector(':scope > .feds-promo-bar-icon')).to.equal(icon);
      expect(icon.nextElementSibling).to.equal(text);
    });

    it('preserves the original icon / text / CTA order', () => {
      const { inner, text, icon, ctas } = buildInnerWithCta();
      initAtEnd(inner, text);

      const structural = [...inner.children]
        .filter((c) => !c.classList.contains('feds-cdt-live'));
      expect(structural).to.deep.equal([icon, text, ctas]);
    });

    it('announces "has ended" (with promo details) at the end', () => {
      const { inner, text } = buildInnerWithCta();
      initAtEnd(inner, text);

      const live = inner.querySelector('.feds-cdt-live');
      expect(live.textContent).to.match(/has ended$/);
    });
  });

  // ── DOM order ─────────────────────────────────────────────────────────────────

  describe('DOM order', () => {
    it('wrapper appears before headline text as a direct child of inner', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const children = [...inner.children];
      const wrapperIdx = children.findIndex((c) => c.classList.contains('feds-promo-bar-icon-cdt'));
      const textIdx = children.findIndex((c) => c.classList.contains('feds-promo-bar-text'));

      expect(wrapperIdx).to.be.greaterThanOrEqual(0);
      expect(wrapperIdx).to.be.lessThan(textIdx);
    });

    it('icon appears before CDT inside the wrapper', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const wrapper = inner.querySelector('.feds-promo-bar-icon-cdt');
      const wrapperChildren = [...wrapper.children];
      const iconIdx = wrapperChildren.findIndex((c) => c.classList.contains('feds-promo-bar-icon'));
      const cdtIdx  = wrapperChildren.findIndex((c) => c.classList.contains('feds-cdt'));

      expect(iconIdx).to.be.lessThan(cdtIdx);
    });

    it('does not duplicate or move the headline text element', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);

      const textEls = inner.querySelectorAll('.feds-promo-bar-text');
      expect(textEls.length).to.equal(1);
      expect(textEls[0]).to.equal(text);
    });
  });

  // ── Idempotency ───────────────────────────────────────────────────────────────

  describe('idempotency', () => {
    it('does not inject a second timer when called twice on the same inner', () => {
      setMeta(activeRange());
      const { inner, text } = buildInner();
      initPromoCountdown(inner, text, false);
      initPromoCountdown(inner, text, false);

      expect(inner.querySelectorAll('.feds-cdt').length).to.equal(1);
      expect(inner.querySelectorAll('.feds-promo-bar-icon-cdt').length).to.equal(1);
    });
  });
});

