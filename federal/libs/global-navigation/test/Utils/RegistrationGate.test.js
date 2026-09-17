import { expect } from '@esm-bundle/chai';
import { getRegistrationGateAttrs, HIDE_WHEN_REGISTERED_SUFFIX } from '../../src/Utils/Utils';

describe('getRegistrationGateAttrs', () => {
  it('strips the #_hide-when-registered suffix and flags the link', () => {
    const { href, hideWhenRegistered } = getRegistrationGateAttrs(
      `https://max.adobe.com/register${HIDE_WHEN_REGISTERED_SUFFIX}`,
    );
    expect(href).to.equal('https://max.adobe.com/register');
    expect(hideWhenRegistered).to.be.true;
  });

  it('leaves ordinary hrefs untouched', () => {
    const { href, hideWhenRegistered } = getRegistrationGateAttrs('https://max.adobe.com/register');
    expect(href).to.equal('https://max.adobe.com/register');
    expect(hideWhenRegistered).to.be.false;
  });

  it('composes with the #_blank suffix regardless of authoring order', () => {
    const { href, hideWhenRegistered } = getRegistrationGateAttrs(
      `https://max.adobe.com/register${HIDE_WHEN_REGISTERED_SUFFIX}#_blank`,
    );
    expect(href).to.equal('https://max.adobe.com/register#_blank');
    expect(hideWhenRegistered).to.be.true;
  });
});
