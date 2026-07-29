import { expect } from '@esm-bundle/chai';
import { replacePlaceholders, combineWithFederalPlaceholders } from '../../src/Utils/Placeholders';
import { setMiloConfig } from '../../src/Utils/Utils';

/**
 * Geo-IP placeholder support on the C2 gnav — federal's half of the contract.
 *
 * The milo C2 gnav wrapper resolves geo-IP placeholders and merges the `-geo-ip`
 * overrides into the placeholder map it hands federal (milo's getGeoIpPlaceholders,
 * unit-tested milo-side). Federal then (a) combines that map with its own gnav
 * placeholders and (b) substitutes the gnav's `{{…-geo-ip}}` tokens against the
 * result (main() -> setPlaceholders(combineWithFederalPlaceholders(input)) ->
 * fetchAndProcessPlainHTML -> replacePlaceholders). These tests lock that federal
 * behavior, so the milo-side merge is guaranteed to surface in the rendered gnav.
 */
describe('Geo-IP placeholders on the gnav (federal consumption)', () => {
  describe('replacePlaceholders substitutes geo-ip tokens from the map', () => {
    it('resolves a {{…-geo-ip}} token to the map value', () => {
      const map = new Map([['phone-number-geo-ip', '+352 800 99999']]);
      expect(replacePlaceholders('tel:{{phone-number-geo-ip}}', map))
        .to.equal('tel:+352 800 99999');
    });

    it('resolves the URL-encoded token form too', () => {
      const map = new Map([['phone-number-geo-ip', '+352 800 99999']]);
      expect(replacePlaceholders('tel:%7B%7Bphone-number-geo-ip%7D%7D', map))
        .to.equal('tel:+352 800 99999');
    });

    it('falls back to the bare key when the geo-ip key is absent', () => {
      expect(replacePlaceholders('{{missing-geo-ip}}', new Map()))
        .to.equal('missing-geo-ip');
    });
  });

  describe('combineWithFederalPlaceholders precedence', () => {
    let originalFetch;

    before(() => {
      try {
        setMiloConfig({ env: { name: 'stage' }, locale: { prefix: '', ietf: 'en-US' } });
      } catch (e) { /* singleton — already initialized by another test file */ }
    });

    beforeEach(() => {
      originalFetch = window.fetch;
      window.fetch = async (url) => {
        if (String(url).includes('globalnav/placeholders.json')) {
          return {
            ok: true,
            json: async () => ({
              data: [
                { key: 'buy-now-geo-ip', value: 'Buy now (federal base)' },
                { key: 'federal-only', value: 'Federal only' },
              ],
            }),
          };
        }
        return { ok: false, json: async () => ({ data: [] }) };
      };
    });

    afterEach(() => {
      window.fetch = originalFetch;
    });

    it('lets the milo-provided geo value win over the federal base for the same key', async () => {
      // The cloud/milo map is what the C2 gnav wrapper hands in, now carrying the geo override.
      const input = {
        placeholders: Promise.resolve(new Map([['buy-now-geo-ip', 'Acheter maintenant']])),
      };
      const combined = await combineWithFederalPlaceholders(input);
      expect(combined.get('buy-now-geo-ip')).to.equal('Acheter maintenant');
      // federal-only keys still survive the union merge
      expect(combined.get('federal-only')).to.equal('Federal only');
    });
  });
});
