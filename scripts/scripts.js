/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { setLibs } from './utils.js';
import locales from '../federal/utils/locales.js';

// Add project-wide style path here.
const STYLES = '';

// Use 'https://milo.adobe.com/libs' if you cannot map '/libs' to milo's origin.
const LIBS = '/libs';

// Add any config options.
const CONFIG = {
  // codeRoot: '',
  // contentRoot: '',
  imsClientId: 'fedsmilo',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  uniqueSiteId: 'federal',
  mepLingoCountryToRegion: {
    africa: ['ke', 'mu', 'ng', 'za'],
    la: ['bo', 'cr', 'do', 'ec', 'gt', 'pa', 'pr', 'py', 'sv', 'uy', 've'],
    mena_en: ['bh', 'dz', 'iq', 'ir', 'jo', 'lb', 'ly', 'om', 'ps', 'sy', 'tn', 'ye'],
  },
  prodDomains: ['www', 'business', 'blog', 'helpx', 'stock'].map(
    (sub) => `${sub}.adobe.com`
  ),
  locales,
};

// Load LCP image immediately
(function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
})();

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) {
    paths.push(STYLES);
  }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
})();

(async function loadPage() {
  const { loadArea, setConfig } = await import(`${miloLibs}/utils/utils.js`);

  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
})();
