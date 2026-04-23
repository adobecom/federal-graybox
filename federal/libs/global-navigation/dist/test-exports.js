// src/Utils/Log.ts
var LANA_CLIENT_ID = "feds-milo";
var lanaLog = (message, tags = "default", errorType = "e") => {
  const { locale } = getMiloConfig();
  const url = getMetadata("gnav-source") ?? `${locale.contentRoot ?? ""}/gnav`;
  if (!window.lana)
    console.warn("lana logging unavailable in the gnav");
  window?.lana?.log(`${message} | gnav-source: ${url} | href: ${window.location.href}`, {
    clientId: LANA_CLIENT_ID,
    sampleRate: 1,
    tags,
    errorType
  });
};

// src/Error/Error.ts
var IrrecoverableError = class _IrrecoverableError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _IrrecoverableError.prototype);
  }
};
var RecoverableError = class _RecoverableError extends Error {
  constructor(message, severity = "Minor") {
    super(message);
    Object.setPrototypeOf(this, _RecoverableError.prototype);
    if (severity === "Critical") {
      lanaLog(message);
    }
  }
};

// src/Utils/Placeholders.ts
var [
  setPlaceholders,
  getPlaceholders
] = /* @__PURE__ */ (() => {
  let placeholdersPromise;
  return [
    (p) => {
      if (placeholdersPromise) return;
      placeholdersPromise = p;
    },
    () => {
      if (!placeholdersPromise) {
        throw new Error("Placeholders not initialized. Call setPlaceholders() first.");
      }
      return placeholdersPromise;
    }
  ];
})();

// src/Utils/Utils.ts
var isDesktop = window.matchMedia("(min-width: 1024px)");
var alternative = (primaryFn) => {
  return {
    eval: primaryFn,
    or: (fallbackFn) => alternative((input) => {
      try {
        return primaryFn(input);
      } catch (_error) {
        return fallbackFn(input);
      }
    })
  };
};
var [setPersonalizationConfig, getPersonalizationConfig] = /* @__PURE__ */ (() => {
  let personalizationConfig;
  let isInitialized = false;
  return [
    (config) => {
      if (isInitialized) {
        return;
      }
      personalizationConfig = config;
      isInitialized = true;
    },
    () => {
      if (!personalizationConfig) {
        throw new Error("PersonalizationConfig not initialized. Call setPersonalizationConfig() first.");
      }
      return personalizationConfig;
    }
  ];
})();
var [setLocalizeLink, getLocalizeLink] = /* @__PURE__ */ (() => {
  let localizeLink = (link) => link;
  return [
    (nextLocalizeLink) => {
      localizeLink = nextLocalizeLink;
    },
    () => localizeLink
  ];
})();
var localizeHref = (href) => {
  try {
    return getLocalizeLink()(href);
  } catch {
    return href;
  }
};
var federatedContentRoot;
var getFederatedContentRoot = () => {
  if (federatedContentRoot) return federatedContentRoot;
  const cdnWhitelistedOrigins = [
    "https://www.adobe.com",
    "https://business.adobe.com",
    "https://blog.adobe.com",
    "https://milo.adobe.com",
    "https://news.adobe.com",
    "graybox.adobe.com"
  ];
  if (federatedContentRoot) return federatedContentRoot;
  const origin = window.location.origin;
  const isAllowedOrigin = cdnWhitelistedOrigins.some((o) => {
    const originNoStage = origin.replace(".stage", "");
    return o.startsWith("https://") ? originNoStage === o : originNoStage.endsWith(o);
  });
  federatedContentRoot = isAllowedOrigin ? origin : "https://www.adobe.com";
  const SLD = window.location.hostname.includes(".aem.") ? "aem" : "hlx";
  if (origin.includes("localhost") || origin.includes(`.${SLD}.`)) {
    federatedContentRoot = `https://main--federal--adobecom.aem.${origin.endsWith(".live") ? "live" : "page"}`;
  }
  return federatedContentRoot;
};
var federateUrl = (url = "") => {
  if (url.includes("stage.adobe.com")) {
    return url.replace("c2-poc--milo--adobecom", "main--federal--adobecom");
  }
  if (url.includes("c2-poc-feds-gnav--milo--adobecom")) {
    return url.replace("c2-poc-feds-gnav--milo--adobecom", "main--federal--adobecom");
  }
  if (url.includes("localhost:3000")) {
    return url.replace("localhost:3000", "main--federal--adobecom.aem.page");
  }
  if (typeof url !== "string" || !url.includes("/federal/")) return url;
  if (url.startsWith("/")) return `${getFederatedContentRoot()}${url}`;
  try {
    const { pathname, search, hash } = new URL(url);
    return `${getFederatedContentRoot()}${pathname}${search}${hash}`;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`getFederatedUrl errored parsing the URL: ${url}: ${message}`);
  }
  return url;
};
var getAnalyticsAttrs = (daaLh, daaLl) => {
  const daaLhAttr = daaLh !== null && daaLh !== "" ? ` daa-lh="${daaLh}"` : "";
  const daaLlAttr = daaLl !== null && daaLl !== "" ? ` daa-ll="${daaLl}"` : "";
  return `${daaLhAttr}${daaLlAttr}`;
};
function loadLink(href, {
  id,
  as,
  callback,
  crossorigin,
  rel,
  fetchpriority
} = { rel: "stylesheet" }) {
  const existingLink = document.head.querySelector(`link[href="${href}"]`);
  if (existingLink) {
    callback?.("noop");
    return existingLink;
  }
  const link = document.createElement("link");
  link.setAttribute("rel", rel);
  if (id !== void 0) link.setAttribute("id", id);
  if (as !== void 0) link.setAttribute("as", as);
  if (crossorigin !== void 0) link.setAttribute("crossorigin", crossorigin);
  if (fetchpriority !== void 0) link.setAttribute("fetchpriority", fetchpriority);
  link.setAttribute("href", href);
  if (callback) {
    link.onload = (e) => callback(e.type);
    link.onerror = (e) => callback(typeof e === "string" ? "error" : e.type);
  }
  document.head.appendChild(link);
  return link;
}
function loadStyle(href, callback) {
  return loadLink(href, { rel: "stylesheet", callback });
}
function loadStyles(url, override = false) {
  if (!override) return;
  loadStyle(url);
}
var loadScript = (url, type, { mode, id } = {}) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement("script");
    script.setAttribute("src", url);
    if (id !== null && id !== void 0) script.setAttribute("id", id);
    if (type !== null && type !== void 0) {
      script.setAttribute("type", type);
    }
    if (mode && ["async", "defer"].includes(mode)) script.setAttribute(mode, "");
    head.append(script);
  }
  const loaded = script.dataset.loaded;
  if (loaded !== null && loaded !== void 0) {
    resolve(script);
    return;
  }
  const onScript = (event) => {
    script.removeEventListener("load", onScript);
    script.removeEventListener("error", onScript);
    if (event.type === "error") {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === "load") {
      script.dataset.loaded = "true";
      resolve(script);
    }
  };
  script.addEventListener("load", onScript);
  script.addEventListener("error", onScript);
});
function getMetadata(name, doc = document) {
  const attr = name && name.includes(":") ? "property" : "name";
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta?.content ?? null;
}
var isValidMiloConfig = (config) => {
  const cfg = config;
  const invalid = (x) => x === null || x === void 0 || typeof x !== "object";
  if (invalid(cfg)) return false;
  if (invalid(cfg.locale)) return false;
  const locale = cfg.locale;
  if (typeof locale.prefix !== "string") return false;
  if (invalid(cfg.env)) return false;
  const env = cfg.env;
  if (typeof env.name !== "string") return false;
  if (cfg.unav !== void 0) {
    if (typeof cfg.unav !== "object" || cfg.unav === null) return false;
    const unav = cfg.unav;
    if (unav.profile !== void 0) {
      if (typeof unav.profile !== "object" || unav.profile === null) return false;
      const profile = unav.profile;
      if (profile.signInCtaStyle !== void 0) {
        if (profile.signInCtaStyle !== "primary" && profile.signInCtaStyle !== "secondary") {
          return false;
        }
      }
      if (profile.messageEventListener !== void 0 && typeof profile.messageEventListener !== "function") {
        return false;
      }
    }
  }
  if (cfg.jarvis !== void 0) {
    if (typeof cfg.jarvis !== "object" || cfg.jarvis === null) return false;
    const jarvis = cfg.jarvis;
    if (typeof jarvis.id !== "string") return false;
  }
  return true;
};
var [setMiloConfig, getMiloConfig] = /* @__PURE__ */ (() => {
  let miloConfig;
  let isInitialized = false;
  return [
    (config) => {
      if (isInitialized) {
        return;
      }
      if (!isValidMiloConfig(config)) {
        throw new Error("MiloConfig validation failed: Invalid structure");
      }
      miloConfig = config;
      isInitialized = true;
    },
    () => {
      if (!miloConfig) {
        throw new Error("MiloConfig not initialized. Call setMiloConfig() first.");
      }
      return miloConfig;
    }
  ];
})();
var LanguageMap = {
  en: "US",
  "en-gb": "GB",
  "es-mx": "MX",
  "fr-ca": "CA",
  da: "DK",
  et: "EE",
  ar: "DZ",
  el: "GR",
  iw: "IL",
  he: "IL",
  id: "ID",
  ms: "MY",
  nb: "NO",
  sl: "SI",
  sv: "SE",
  cs: "CZ",
  uk: "UA",
  hi: "IN",
  "zh-hans": "CN",
  "zh-hant": "TW",
  ja: "JP",
  ko: "KR",
  fil: "PH",
  th: "TH",
  vi: "VN"
};
var GeoMap = {
  ar: "AR_es",
  be_en: "BE_en",
  be_fr: "BE_fr",
  be_nl: "BE_nl",
  br: "BR_pt",
  ca: "CA_en",
  ch_de: "CH_de",
  ch_fr: "CH_fr",
  ch_it: "CH_it",
  cl: "CL_es",
  co: "CO_es",
  la: "DO_es",
  mx: "MX_es",
  pe: "PE_es",
  africa: "MU_en",
  dk: "DK_da",
  de: "DE_de",
  ee: "EE_et",
  eg_ar: "EG_ar",
  eg_en: "EG_en",
  es: "ES_es",
  fr: "FR_fr",
  gr_el: "GR_el",
  gr_en: "GR_en",
  ie: "IE_en",
  il_he: "IL_iw",
  it: "IT_it",
  lv: "LV_lv",
  lt: "LT_lt",
  lu_de: "LU_de",
  lu_en: "LU_en",
  lu_fr: "LU_fr",
  my_en: "MY_en",
  my_ms: "MY_ms",
  hu: "HU_hu",
  mt: "MT_en",
  mena_en: "DZ_en",
  mena_ar: "DZ_ar",
  nl: "NL_nl",
  no: "NO_nb",
  pl: "PL_pl",
  pt: "PT_pt",
  ro: "RO_ro",
  si: "SI_sl",
  sk: "SK_sk",
  fi: "FI_fi",
  se: "SE_sv",
  tr: "TR_tr",
  uk: "GB_en",
  at: "AT_de",
  cz: "CZ_cs",
  bg: "BG_bg",
  ru: "RU_ru",
  ua: "UA_uk",
  au: "AU_en",
  in_en: "IN_en",
  in_hi: "IN_hi",
  id_en: "ID_en",
  id_id: "ID_id",
  nz: "NZ_en",
  sa_ar: "SA_ar",
  sa_en: "SA_en",
  sg: "SG_en",
  cn: "CN_zh-Hans",
  tw: "TW_zh-Hant",
  hk_zh: "HK_zh-hant",
  jp: "JP_ja",
  kr: "KR_ko",
  za: "ZA_en",
  ng: "NG_en",
  cr: "CR_es",
  ec: "EC_es",
  pr: "US_es",
  // not a typo, should be US
  gt: "GT_es",
  cis_en: "TM_en",
  cis_ru: "TM_ru",
  sea: "SG_en",
  th_en: "TH_en",
  th_th: "TH_th"
};
function getDefaultLangstoreCountry(language) {
  let country = LanguageMap[language];
  if (!country && GeoMap[language]) {
    country = language;
  }
  if (!country && language.includes("-")) {
    [country] = language.split("-");
  }
  return country || "US";
}
var LANG_STORE_PREFIX = "langstore/";
function getMiloLocaleSettings(miloLocale) {
  const localePrefix = miloLocale?.prefix || "US_en";
  const geo = localePrefix.replace("/", "") ?? "";
  let [country = "US", language = "en"] = (GeoMap[geo] ?? geo).split("_", 2);
  if (geo.startsWith(LANG_STORE_PREFIX) || window.location.pathname.startsWith(`/${LANG_STORE_PREFIX}`)) {
    const localeLang = geo.replace(LANG_STORE_PREFIX, "").toLowerCase();
    country = getDefaultLangstoreCountry(localeLang);
    language = localeLang;
  }
  country = country.toUpperCase();
  language = language.toLowerCase();
  return {
    language,
    country,
    locale: `${language}_${country}`
  };
}

// src/Components/Link/Parse.ts
var ERRORS = {
  elementNull: "Error when parsing Link. Element is null",
  notAnchor: "Cannot parse non-anchor as Link",
  textContentNotFound: "Error when parsing Link. Element has no textContent",
  hrefNotFound: "Element has no href"
};
var parseLink = (anchor) => {
  if (anchor === null)
    throw new IrrecoverableError(ERRORS.elementNull);
  if (anchor.tagName !== "A")
    throw new IrrecoverableError(ERRORS.notAnchor);
  const [text, ariaLabel] = anchor?.textContent?.split("|").map((s) => s.trim()) ?? ["", ""];
  if (text === "")
    throw new IrrecoverableError(ERRORS.textContentNotFound);
  const href = anchor?.getAttribute("href") ?? "";
  if (href === "")
    throw new IrrecoverableError(ERRORS.hrefNotFound);
  const daaLl = anchor.getAttribute("daa-ll");
  return [
    {
      type: "Link",
      text,
      href,
      daaLl,
      ariaLabel
    },
    []
  ];
};

// src/Components/ProductCard/Parse.ts
var parseProductCard = (element) => {
  if (!element)
    throw new IrrecoverableError(ERRORS2.elementNull);
  if (!element.classList.contains("product-card"))
    throw new IrrecoverableError(ERRORS2.notAProductCard);
  return alternative(parseProductCardHeader).or(parseProductCardLink).or(parseProductCardBlue).eval(element);
};
var ERRORS2 = {
  elementNull: "Element not found",
  noTitleAnchor: "Title anchor not found",
  noHref: "Title Anchor has no href",
  noTitle: "Title text not found",
  noSubtitleP: "Subtitle <p> not found",
  noSubtitle: "Subtitle text not found",
  notAHeader: "Expected a Header class",
  notAProductCard: "Expected a product-card class"
};
var parseProductCardLink = (element) => {
  const errors = /* @__PURE__ */ new Set();
  if (!element)
    throw new IrrecoverableError(ERRORS2.elementNull);
  const titleElement = element.querySelector("p a") ?? element.querySelector("div ~ div > a");
  if (!titleElement)
    throw new IrrecoverableError(ERRORS2.noTitleAnchor);
  const title = titleElement.textContent ?? "";
  if (title === "")
    errors.add(new RecoverableError(ERRORS2.noTitle));
  const href = titleElement.getAttribute("href") ?? "";
  if (href === "")
    errors.add(new RecoverableError(ERRORS2.noHref));
  const daaLl = titleElement.getAttribute("daa-ll");
  const daaLh = titleElement.getAttribute("daa-lh");
  const subtitleElement = titleElement?.closest("p")?.nextElementSibling;
  if (!subtitleElement)
    errors.add(new RecoverableError(ERRORS2.noSubtitleP));
  const subtitle = subtitleElement?.textContent ?? "";
  if (subtitle === "")
    errors.add(new RecoverableError(ERRORS2.noSubtitle));
  const badgePs = element.querySelectorAll(":scope > div:nth-child(2) > :first-child p") ?? [];
  const badges = Array.from(badgePs).map((p) => {
    const isFilled = p.querySelector("strong") !== null;
    return {
      text: p?.textContent?.trim() ?? "",
      isFilled
    };
  });
  const [iconHref, iconAlt = null] = (element.firstElementChild?.firstElementChild?.textContent?.split("|") ?? []).map((x) => x.trim());
  return [
    {
      type: "ProductCardLink",
      iconHref,
      iconAlt,
      title,
      href,
      subtitle,
      badges,
      daaLl,
      daaLh
    },
    [...errors]
  ];
};
var parseProductCardHeader = (element) => {
  if (!element)
    throw new IrrecoverableError(ERRORS2.elementNull);
  const classes = [...element.classList];
  if (!classes.includes("header"))
    throw new IrrecoverableError(ERRORS2.notAHeader);
  const title = element.querySelector("a")?.textContent ?? "";
  const daaLl = element.querySelector("a")?.getAttribute("daa-ll") ?? null;
  const daaLh = element.querySelector("a")?.getAttribute("daa-lh") ?? null;
  if (title === "")
    throw new IrrecoverableError(ERRORS2.noTitle);
  return [
    {
      type: "ProductCardHeader",
      title,
      classes,
      daaLl,
      daaLh
    },
    []
  ];
};
var parseProductCardBlue = (element) => {
  if (!element)
    throw new IrrecoverableError(ERRORS2.elementNull);
  if (!element.classList.contains("blue"))
    throw new Error("Not a Blue Product Card");
  const a = element.querySelector("a");
  const [link, es] = parseLink(a);
  const daaLl = a?.getAttribute("daa-ll") ?? null;
  const daaLh = a?.getAttribute("daa-lh") ?? null;
  return [
    {
      type: "ProductCardBlue",
      link,
      daaLl,
      daaLh
    },
    es
  ];
};

// src/Components/ProductCard/Render.ts
var productCard = (card) => {
  switch (card.type) {
    case "ProductCardHeader":
      return productCardHeader(card);
    case "ProductCardLink":
      return productCardLink(card);
    case "ProductCardBlue":
      return productCardBlue(card);
    default: {
      const exhaustivenessCheck = card;
      console.error(exhaustivenessCheck);
      return "";
    }
  }
};
var productCardHeader = ({
  title,
  classes,
  daaLl,
  daaLh
}) => {
  const classNames = classes.slice(1).map((cls) => `feds-product-card--${cls}`).join(" ");
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  return `
    <div role="heading" class="feds-product-card ${classNames}"${analyticsAttrs}>
      <div class="feds-product-card__content">
        <div class="feds-product-card__title">${title}</div>
      </div>
    </div>
  `;
};
var productCardLink = ({
  iconHref,
  iconAlt: _,
  title,
  href,
  subtitle,
  badges = [],
  daaLl,
  daaLh
}) => {
  const hasIcon = iconHref !== null;
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? title);
  const icon = !hasIcon ? "" : `
      <picture class="feds-product-card__icon">
        <img
          loading="lazy"
          src="${federateUrl(iconHref)}"
          class="feds-product-card__icon-img"
        >
      </picture>
    `;
  const badgesMarkup = badges.length === 0 ? "" : `
      <div class="feds-product-card__badges">
        ${badges.map(({ text, isFilled }) => `
          <span class="feds-product-card__badge${isFilled ? " feds-product-card__badge--filled" : ""}">
            ${text}
          </span>
        `).join("")}
      </div>
    `;
  const subtitleMarkup = subtitle === "" ? "" : `<div class="feds-product-card__subtitle">${subtitle}</div>`;
  return `
    <a class="feds-product-card" href="${localizeHref(href)}"${analyticsAttrs}>
      <div class="feds-product-card-header">
        ${icon}
        ${badgesMarkup}
      </div>
      <div class="feds-product-card__content">
       
        <div class="feds-product-card__title">${title}</div>
        ${subtitleMarkup}
      </div>
    </a>
  `;
};
var productCardBlue = ({
  link,
  daaLl,
  daaLh
}) => {
  const analyticsAttrs = getAnalyticsAttrs(daaLh, daaLl ?? link.text);
  return `
  <a href="${localizeHref(link.href)}" class="feds-product-card feds-product-card--blue"${analyticsAttrs}>
    <div class="feds-product-card__content">
        <div class="feds-product-card__title">${link.text}</div>
      </div>
  </a>
`;
};

// src/Components/Brand/Parse.ts
var ERRORS3 = {
  elementNull: "Error when parsing Brand. Element is null",
  noLinkSection: "Error when parsing Brand. No link section found",
  noLink: "Error when parsing Brand. No link found",
  noImageSection: "Error when parsing Brand. No image section found",
  missingImageSections: "Error when parsing Brand. Missing mobile or desktop image section",
  missingThemeImages: "Error when parsing Brand. Missing mobile or desktop image section"
};
var parseBrand = (element) => {
  const errors = /* @__PURE__ */ new Set();
  if (element === null) {
    throw new IrrecoverableError(ERRORS3.elementNull);
  }
  const isDarkBg = !!element.classList.contains("dark-bg");
  const [linkSection, imagesSection] = element.querySelectorAll(":scope > div");
  if (linkSection === void 0) {
    throw new IrrecoverableError(ERRORS3.noLinkSection);
  }
  const linkElement = linkSection.querySelector("a");
  if (linkElement === null) {
    throw new IrrecoverableError(ERRORS3.noLink);
  }
  const href = linkElement.getAttribute("href") ?? "";
  const label = linkElement.textContent?.trim() ?? "";
  if (imagesSection === void 0) {
    errors.add(new RecoverableError(ERRORS3.noImageSection));
  }
  const [mobileImageSection, desktopImageSection] = imagesSection?.querySelectorAll(":scope > div") ?? [];
  if (mobileImageSection === void 0 || desktopImageSection === void 0) {
    errors.add(new RecoverableError(ERRORS3.missingImageSections));
  }
  const lightThemeImages = mobileImageSection?.querySelectorAll('a[href$=".svg"]');
  const darkThemeImages = desktopImageSection?.querySelectorAll('a[href$=".svg"]');
  const lightThemeMobileImageSrc = lightThemeImages?.[0]?.getAttribute("href") ?? "";
  const lightThemeMobileImageAlt = lightThemeImages?.[0]?.textContent?.split("|")[1]?.trim() ?? "";
  const darkThemeMobileImageSrc = lightThemeImages?.[1]?.getAttribute("href") ?? "";
  const darkThemeMobileImageAlt = lightThemeImages?.[1]?.textContent?.split("|")[1]?.trim() ?? "";
  const lightThemeDesktopImageSrc = darkThemeImages?.[0]?.getAttribute("href") ?? "";
  const lightThemeDesktopImageAlt = darkThemeImages?.[0]?.textContent?.split("|")[1]?.trim() ?? "";
  const darkThemeDesktopImageSrc = darkThemeImages?.[1]?.getAttribute("href") ?? "";
  const darkThemeDesktopImageAlt = darkThemeImages?.[1]?.textContent?.split("|")[1]?.trim() ?? "";
  if (!lightThemeMobileImageSrc || !lightThemeDesktopImageSrc || !darkThemeMobileImageSrc || !darkThemeDesktopImageSrc) {
    errors.add(new RecoverableError(ERRORS3.missingThemeImages));
  }
  return [{
    type: "Brand",
    data: {
      href,
      label,
      isDarkBg,
      imageData: {
        type: "svg",
        lightThemeImageSrc: lightThemeDesktopImageSrc,
        lightThemeImageAlt: lightThemeDesktopImageAlt,
        darkThemeImageSrc: darkThemeDesktopImageSrc,
        darkThemeImageAlt: darkThemeDesktopImageAlt,
        mobileLightThemeImageSrc: lightThemeMobileImageSrc,
        mobileLightThemeImageAlt: lightThemeMobileImageAlt,
        mobileDarkThemeImageSrc: darkThemeMobileImageSrc,
        mobileDarkThemeImageAlt: darkThemeMobileImageAlt
      }
    }
  }, [...errors]];
};

// src/Components/Brand/Render.ts
var DESKTOP_SVG = `
<?xml
version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.57 35" fill="currentColor">
    <path d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/>
</svg>
`.trim();
var MOBILE_SVG = `
<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path id="Logo" d="M17.5512 15.9999H13.8827C13.7233 16.0027 13.5666 15.9587 13.4326 15.8735C13.2987 15.7882 13.1934 15.6656 13.1303 15.5211L9.1476 6.3291C9.1372 6.29332 9.11539 6.26179 9.08542 6.23919C9.05545 6.2166 9.0189 6.20413 8.98118 6.20365C8.94347 6.20316 8.9066 6.21469 8.87605 6.2365C8.84549 6.25832 8.82286 6.28928 8.81152 6.32478L6.32954 12.161C6.31607 12.1925 6.31072 12.2269 6.31397 12.261C6.31721 12.2951 6.32896 12.3279 6.34815 12.3565C6.36735 12.385 6.39339 12.4084 6.42398 12.4246C6.45456 12.4408 6.48872 12.4493 6.52343 12.4493H9.25162C9.33426 12.4493 9.41508 12.4733 9.48398 12.5183C9.55288 12.5634 9.60681 12.6275 9.63905 12.7026L10.8335 15.3264C10.8652 15.4 10.8778 15.4802 10.8704 15.5599C10.863 15.6395 10.8357 15.7161 10.791 15.7828C10.7463 15.8495 10.6856 15.9042 10.6142 15.9421C10.5429 15.98 10.4631 15.9998 10.3821 15.9999H0.450101C0.375399 15.9994 0.301967 15.9808 0.236351 15.9455C0.170735 15.9103 0.114973 15.8595 0.0740362 15.7979C0.0330997 15.7362 0.00826021 15.6655 0.00173221 15.592C-0.00479579 15.5185 0.00719033 15.4446 0.0366223 15.3769L6.35412 0.526466C6.41869 0.369291 6.52976 0.234984 6.67284 0.141079C6.81593 0.0471732 6.98437 -0.00196688 7.15618 7.38373e-05H10.7999C10.9718 -0.00217252 11.1403 0.0468839 11.2835 0.140814C11.4266 0.234745 11.5377 0.369168 11.6021 0.526466L17.9633 15.3769C17.9927 15.4445 18.0048 15.5183 17.9983 15.5917C17.9919 15.665 17.9672 15.7357 17.9264 15.7973C17.8856 15.859 17.83 15.9097 17.7646 15.9451C17.6991 15.9804 17.6258 15.9992 17.5512 15.9999V15.9999Z" />
</svg>
`.trim();
var renderBrand = (data) => {
  const { href, label, isDarkBg, imageData } = data;
  const desktopLightSrc = imageData.lightThemeImageSrc?.trim() || imageData.darkThemeImageSrc?.trim() || "";
  const desktopDarkSrc = imageData.darkThemeImageSrc?.trim() || imageData.lightThemeImageSrc?.trim() || "";
  const mobileLightSrc = imageData.mobileLightThemeImageSrc?.trim() || imageData.mobileDarkThemeImageSrc?.trim() || "";
  const mobileDarkSrc = imageData.mobileDarkThemeImageSrc?.trim() || imageData.mobileLightThemeImageSrc?.trim() || "";
  const desktopLightAlt = imageData.lightThemeImageAlt || imageData.darkThemeImageAlt || "";
  const desktopDarkAlt = imageData.darkThemeImageAlt || imageData.lightThemeImageAlt || "";
  const mobileLightAlt = imageData.mobileLightThemeImageAlt || imageData.mobileDarkThemeImageAlt || "";
  const mobileDarkAlt = imageData.mobileDarkThemeImageAlt || imageData.mobileLightThemeImageAlt || "";
  const hasDesktopLight = !!desktopLightSrc;
  const hasDesktopDark = !!desktopDarkSrc;
  const hasMobileLight = !!mobileLightSrc;
  const hasMobileDark = !!mobileDarkSrc;
  const desktopLightImg = hasDesktopLight ? `<img src="${federateUrl(desktopLightSrc)}" alt="${desktopLightAlt}" />` : "";
  const desktopDarkImg = hasDesktopDark ? `<img src="${federateUrl(desktopDarkSrc)}" alt="${desktopDarkAlt}" />` : "";
  const mobileLightImg = hasMobileLight ? `<img src="${federateUrl(mobileLightSrc)}" alt="${mobileLightAlt}" />` : "";
  const mobileDarkImg = hasMobileDark ? `<img src="${federateUrl(mobileDarkSrc)}" alt="${mobileDarkAlt}" />` : "";
  const desktopSvg = hasDesktopLight && hasDesktopDark ? "" : DESKTOP_SVG;
  const mobileSvg = hasMobileLight && hasMobileDark ? "" : MOBILE_SVG;
  return `<div class="feds-brand-container${isDarkBg ? " feds-dark-bg" : ""}">
    <a href="${href}" class="feds-brand" daa-ll="Brand" aria-label="${label}">
      <span class="feds-brand-image desktop-brand">
        ${desktopLightImg}
        ${desktopDarkImg}
        ${desktopSvg}
      </span>
      <span class="feds-brand-image mobile-brand">
        ${mobileLightImg}
        ${mobileDarkImg}
        ${mobileSvg}
      </span>
    </a>
  </div>`.trim();
};
var brand = (brandData) => {
  const { data } = brandData;
  return renderBrand(data);
};

// src/PostRendering/Unav/Unav.utils.ts
var SIGNED_OUT_ICONS = ["appswitcher", "help"];
var LANGMAP = {
  cs: ["cz"],
  da: ["dk"],
  de: ["at"],
  en: ["africa", "au", "ca", "ie", "in", "mt", "ng", "nz", "sg", "za"],
  es: ["ar", "cl", "co", "cr", "ec", "gt", "la", "mx", "pe", "pr"],
  et: ["ee"],
  ja: ["jp"],
  ko: ["kr"],
  nb: ["no"],
  pt: ["br"],
  sl: ["si"],
  sv: ["se"],
  uk: ["ua"],
  zh: ["cn", "tw"]
};
var [setUserProfile, getUserProfile] = (() => {
  let profileData;
  let profileResolve;
  let profileTimeout;
  const profilePromise = new Promise((resolve) => {
    profileResolve = resolve;
    profileTimeout = setTimeout(() => {
      profileData = {};
      resolve(profileData);
    }, 5e3);
  });
  return [
    (data) => {
      if (profileData === void 0) {
        profileData = data;
        clearTimeout(profileTimeout);
        profileResolve?.(profileData);
      }
    },
    () => profilePromise
  ];
})();
function getUnavWidthCSS(unavComponents, signedOut = false) {
  const iconWidth = 32;
  const flexGap = 0.25;
  const sectionDivider = false;
  const sectionDividerMargin = 4;
  const cartEnabled = /uc_carts=/.test(document.cookie);
  const components = (!cartEnabled ? unavComponents?.filter((x) => x !== "cart") : unavComponents) ?? [];
  const n = components.length ?? 3;
  if (signedOut) {
    const l = components.filter((c) => SIGNED_OUT_ICONS.includes(c)).length;
    const signInButton = 92;
    return `calc(${signInButton}px + ${l * iconWidth}px + ${l * flexGap}rem${sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ""})`;
  }
  return `calc(${n * iconWidth}px + ${(n - 1) * flexGap}rem${sectionDivider ? ` + 2px + ${2 * sectionDividerMargin}px + ${flexGap}rem` : ""})`;
}
var getUniversalNavLocale = (locale) => {
  if (!locale.prefix || locale.prefix === "/") return "en_US";
  const prefix = locale.prefix.replace("/", "");
  if (prefix.includes("_")) {
    const [lang, country] = prefix.split("_").reverse();
    return `${lang.toLowerCase()}_${country.toUpperCase()}`;
  }
  if (prefix === "uk") return "en_GB";
  const customLang = Object.keys(LANGMAP).find(
    (key) => LANGMAP[key].includes(prefix)
  );
  if (customLang) return `${customLang.toLowerCase()}_${prefix.toUpperCase()}`;
  return `${prefix.toLowerCase()}_${prefix.toUpperCase()}`;
};
var OS_MAP = {
  Mac: "macOS",
  Win: "windows",
  Linux: "linux",
  CrOS: "chromeOS",
  Android: "android",
  iPad: "iPadOS",
  iPhone: "iOS"
};
var getDevice = () => {
  const agent = navigator.userAgent;
  for (const [os, osName] of Object.entries(OS_MAP)) {
    if (agent.includes(os)) {
      return osName;
    }
  }
  return "linux";
};
var getVisitorGuid = async () => {
  const windowWithAlloy = window;
  if (typeof windowWithAlloy.alloy !== "function") {
    return void 0;
  }
  return windowWithAlloy.alloy("getIdentity").then((data) => data?.identity?.ECID).catch(() => void 0);
};

// src/PostRendering/Unav/Unav.config.ts
var getSignInContext = () => {
  try {
    const config = getMiloConfig();
    return config.signInContext || {};
  } catch {
    return {};
  }
};
var getSignInCtaStyle = () => {
  const config = getMiloConfig();
  const isPrimary = getMetadata("signin-cta-style") === "primary" || config?.unav?.profile?.signInCtaStyle === "primary";
  return isPrimary ? "primary" : "secondary";
};
var getMessageEventListener = () => {
  const config = getMiloConfig();
  const configListener = config?.unav?.profile?.messageEventListener;
  if (configListener) return configListener;
  return (event) => {
    const { name, payload, executeDefaultAction } = event.detail;
    if (name !== "System" || typeof executeDefaultAction !== "function") return;
    switch (payload.subType) {
      case "AppInitiated":
        window.adobeProfile?.getUserProfile().then((data) => {
          setUserProfile(data);
        }).catch(() => {
          setUserProfile({});
        });
        break;
      case "SignOut":
        executeDefaultAction();
        break;
      case "ProfileSwitch":
        Promise.resolve(executeDefaultAction()).then((profile) => {
          if (profile !== null && profile !== void 0) {
            window.location.reload();
          }
        });
        break;
      default:
        break;
    }
  };
};
function getHelpChildren() {
  const { unav } = getMiloConfig();
  return unav?.unavHelpChildren || [
    { type: "Support" },
    { type: "Community" }
  ];
}
var getUnavComponents = () => {
  const config = getMiloConfig();
  const uncAppId = config?.unav?.uncAppId;
  return {
    profile: {
      name: "profile",
      attributes: {
        accountMenuContext: {
          sharedContextConfig: {
            enableLocalSection: true,
            enableProfileSwitcher: true,
            miniAppContext: {
              logger: {
                trace: () => {
                },
                debug: () => {
                },
                info: () => {
                },
                // TODO: Integrate with lanaLog for proper logging
                // warn: (e) => lanaLog({
                //   message: 'Profile Menu warning',
                //   e,
                //   tags: 'universalnav,warn',
                // }),
                // error: (e) => lanaLog({
                //   message: 'Profile Menu error',
                //   e,
                //   tags: 'universalnav',
                //   errorType: 'e',
                // }),
                warn: () => {
                },
                error: () => {
                }
              }
            },
            complexConfig: config?.unav?.profile?.complexConfig || null,
            ...config?.unav?.profile?.config
          },
          messageEventListener: getMessageEventListener()
        },
        // UNav 1.5 supports primary/secondary signIn CTA styles.
        // 'primary' means signIn is primary and signUp is secondary.
        signInCtaStyle: getSignInCtaStyle(),
        isSignUpRequired: false,
        callbacks: {
          onSignIn: () => {
            window.adobeIMS?.signIn(getSignInContext());
          },
          onSignUp: () => {
            window.adobeIMS?.signIn(getSignInContext());
          }
        }
      }
    },
    appswitcher: {
      name: "app-switcher"
    },
    notifications: {
      name: "notifications",
      attributes: {
        notificationsConfig: {
          applicationContext: {
            appID: uncAppId !== void 0 && uncAppId !== "" ? uncAppId : "adobecom",
            ...config?.unav?.uncConfig
          }
        }
      }
    },
    help: {
      name: "help",
      attributes: {
        children: getHelpChildren()
      }
    },
    jarvis: {
      name: "jarvis",
      attributes: {
        appid: config?.jarvis?.id,
        callbacks: config?.jarvis?.callbacks
      }
    },
    cart: {
      name: "cart"
    }
  };
};

// src/PostRendering/Unav/Unav.loader.ts
var setProfileSignUpRequired = (children, value) => {
  const profileChild = children[0];
  if (profileChild === void 0) {
    return;
  }
  if (!("attributes" in profileChild)) {
    return;
  }
  const { attributes } = profileChild;
  if (attributes === void 0 || attributes === null) {
    return;
  }
  if (typeof attributes !== "object" || !("isSignUpRequired" in attributes)) {
    return;
  }
  attributes.isSignUpRequired = value;
};
var loadUnav = async (nav, _config) => {
  try {
    const utilitiesContainer = nav.querySelector(".feds-utilities");
    if (!(utilitiesContainer instanceof HTMLElement)) {
      return new RecoverableError('missing ".feds-utilities" container');
    }
    const errors = /* @__PURE__ */ new Set();
    const meta = document.head.querySelector('meta[name="universal-nav"]');
    const rawValue = meta instanceof HTMLMetaElement ? meta.content ?? "" : "";
    if (!(meta instanceof HTMLMetaElement)) {
      errors.add(new RecoverableError('metadata "universal-nav" is missing'));
    }
    const trimmedValue = rawValue.trim();
    if (meta instanceof HTMLMetaElement && trimmedValue.length === 0) {
      errors.add(new RecoverableError('metadata "universal-nav" has no value'));
    }
    const signedOut = window.adobeIMS?.isSignedInUser() !== true;
    const unavComponents = trimmedValue.split(",").map((option) => option.trim()).filter(
      (component) => Object.keys(getUnavComponents()).includes(component) || component === "signup"
    );
    if (signedOut) {
      const width = getUnavWidthCSS(unavComponents, signedOut);
      utilitiesContainer.style.setProperty("min-width", width);
    }
    let config;
    try {
      config = getMiloConfig();
    } catch (_error) {
      throw new Error("MiloConfig not available for UNAV initialization");
    }
    const locale = getUniversalNavLocale(config.locale);
    const environment = config.env.name === "prod" ? "prod" : "stage";
    const visitorGuid = await getVisitorGuid();
    let unavVersion = new URLSearchParams(
      window.location.search
    ).get("unavVersion");
    if (!/^\d+(\.\d+)?$/.test(unavVersion ?? "")) {
      unavVersion = "1.5";
    }
    await Promise.all([
      loadScript(
        `https://${environment}.adobeccstatic.com/unav/${unavVersion}/UniversalNav.js`
      ),
      loadStyles(
        `https://${environment}.adobeccstatic.com/unav/${unavVersion}/UniversalNav.css`,
        true
      )
    ]);
    const getChildren = () => {
      const unavComponentsConfig = getUnavComponents();
      const children = [unavComponentsConfig.profile];
      setProfileSignUpRequired(children, false);
      unavComponents.forEach((component) => {
        if (component === "profile") return;
        if (component === "signup") {
          setProfileSignUpRequired(children, true);
          return;
        }
        const unavComponent = unavComponentsConfig[component];
        if (unavComponent !== void 0) {
          children.push(unavComponent);
        }
      });
      return children;
    };
    const getConfiguration = () => ({
      target: utilitiesContainer,
      env: environment,
      locale,
      countryCode: getMiloLocaleSettings(config?.locale)?.country || "US",
      imsClientId: window?.adobeid?.client_id,
      theme: "light",
      // TODO: Add toggle based on site theme
      analyticsContext: {
        consumer: {
          name: "adobecom",
          version: "1.0",
          platform: "Web",
          device: getDevice(),
          os_version: navigator.platform
        },
        event: { visitor_guid: visitorGuid }
      },
      children: getChildren(),
      isSectionDividerRequired: config?.unav?.showSectionDivider === true,
      showTrayExperience: !isDesktop.matches
    });
    await window?.UniversalNav?.(getConfiguration());
    if (!signedOut) {
      utilitiesContainer?.style.removeProperty("min-width");
    }
    const reloadUnav = (_) => {
      window?.UniversalNav?.reload(
        getConfiguration()
      );
    };
    isDesktop.addEventListener("change", () => {
      reloadUnav();
    });
    return {
      reloadUnav,
      errors
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to load universal nav";
    return new RecoverableError(message);
  }
};

// src/PostRendering/Keyboard/index.ts
function $$(root, selector) {
  return [...root.querySelectorAll(selector)];
}
function setTabindex(root, selector, enabled) {
  $$(root, selector).forEach(
    (el) => enabled ? el.removeAttribute("tabindex") : el.setAttribute("tabindex", "-1")
  );
}
var ARROW_DELTA = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowDown: 1
};
var HORIZONTAL = /* @__PURE__ */ new Set(["ArrowLeft", "ArrowRight"]);
var VERTICAL = /* @__PURE__ */ new Set(["ArrowUp", "ArrowDown"]);
var SELECTED_TAB = '.tabs [role="tab"][aria-selected="true"]';
function wrapIndex(index, delta, length) {
  return (index + delta + length) % length;
}
function gridNextIndex(items, index, key, grid) {
  const delta = ARROW_DELTA[key];
  if (HORIZONTAL.has(key)) {
    const next = index + delta;
    return next >= 0 && next < items.length ? next : null;
  }
  const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  const children = [...grid.children];
  const cellOf = (i) => {
    const parent = items[i].parentElement;
    return parent ? children.indexOf(parent) : -1;
  };
  const currentCol = cellOf(index) % cols;
  const targetRow = Math.floor(cellOf(index) / cols) + (key === "ArrowDown" ? 1 : -1);
  const maxRow = Math.floor((children.length - 1) / cols);
  if (targetRow < 0 || targetRow > maxRow) return null;
  let best = null;
  let bestDist = Infinity;
  for (let j = 0; j < items.length; j++) {
    const dist = Math.abs(cellOf(j) % cols - currentCol);
    if (Math.floor(cellOf(j) / cols) === targetRow && dist < bestDist) {
      bestDist = dist;
      best = j;
    }
  }
  return best;
}
function initKeyboardNav(gnav) {
  setTabindex(gnav, '.tab-content [role="tabpanel"] a', false);
  const cleanups = [];
  $$(gnav, ".feds-popup[popover]").forEach((popup) => {
    const onToggle = () => {
      if (!popup.matches(":popover-open")) setTabindex(popup, '[role="tabpanel"] a', false);
    };
    popup.addEventListener("toggle", onToggle);
    cleanups.push(() => popup.removeEventListener("toggle", onToggle));
    let tabPressed = false;
    const onKeyDown = (event) => {
      if (event.key === "Tab" && !event.shiftKey) {
        tabPressed = true;
      }
    };
    popup.addEventListener("keydown", onKeyDown);
    cleanups.push(() => popup.removeEventListener("keydown", onKeyDown));
    const onFocusOut = (event) => {
      if (tabPressed && !popup.contains(event.relatedTarget)) {
        popup.hidePopover?.();
        if (!isDesktop.matches) {
          const gnavItems = popup.closest(".feds-gnav-items");
          gnavItems?.classList.remove("subscreen-opening");
          gnavItems?.classList.add("subscreen-closing");
        }
        tabPressed = false;
      }
    };
    popup.addEventListener("focusout", onFocusOut);
    cleanups.push(() => popup.removeEventListener("focusout", onFocusOut));
  });
  const focusAndPrevent = (target, event) => {
    target.focus();
    event.preventDefault();
  };
  const openPopup = () => gnav.querySelector(".feds-popup:popover-open");
  const selectedTab = (scope) => scope.querySelector(SELECTED_TAB);
  const visiblePanel = (scope) => scope.querySelector('[role="tabpanel"]:not([hidden])');
  function handleEscape(event) {
    const popup = openPopup();
    const menuWrapper = gnav.querySelector("#feds-menu-wrapper");
    if (!menuWrapper) return false;
    const gnavItems = menuWrapper.querySelector(".feds-gnav-items");
    const backButton = popup ? popup.querySelector(".feds-popup-back-button") : null;
    const isSubscreenOpening = gnavItems?.classList.contains("subscreen-opening") === true;
    if (popup !== null && isSubscreenOpening && backButton !== null) {
      backButton.click();
      event.preventDefault();
      return true;
    }
    const popover = popup ?? (menuWrapper?.matches(":popover-open") ? menuWrapper : null);
    if (!popover) return false;
    popover.hidePopover?.();
    const trigger = popup ? `[popovertarget="${popover.id}"]` : ".feds-nav-toggle";
    gnav.querySelector(trigger)?.focus();
    event.preventDefault();
    return true;
  }
  function handleTopBar(el, key, event) {
    if (!HORIZONTAL.has(key)) return false;
    const items = $$(gnav, ".feds-gnav-items > li > .feds-link");
    const index = items.indexOf(el);
    if (index < 0) return false;
    focusAndPrevent(
      items[wrapIndex(index, ARROW_DELTA[key], items.length)],
      event
    );
    return true;
  }
  function handleTabs(el, popup, key, event) {
    const items = $$(popup, '.tabs :is([role="tab"], .product-links a)');
    const firstTabOffsetLeft = items[0]?.offsetLeft ?? 0;
    const index = items.indexOf(el);
    if (index < 0) return false;
    const tabArrowDelta = isDesktop.matches ? { ArrowLeft: 0, ArrowRight: 0, ArrowUp: -1, ArrowDown: 1 } : { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };
    if (tabArrowDelta[key]) {
      const next = items[wrapIndex(index, tabArrowDelta[key], items.length)];
      if (next.matches('[role="tab"]')) {
        next.click();
        if (!isDesktop.matches) {
          requestAnimationFrame(() => {
            const container = next.closest(".tabs");
            if (container !== null) {
              container.scrollLeft = next.offsetLeft - firstTabOffsetLeft;
            }
          });
        }
      }
      focusAndPrevent(next, event);
      return true;
    }
    if (key in tabArrowDelta) {
      event.preventDefault();
      return true;
    }
    if (key === "Tab" && !event.shiftKey && el.matches('[aria-selected="true"]')) {
      const panel = visiblePanel(popup);
      if (!panel) return false;
      setTabindex(panel, "a", true);
      const firstLink = panel.querySelector("a");
      if (firstLink) focusAndPrevent(firstLink, event);
      return true;
    }
    return false;
  }
  function handlePanel(el, popup, key, event) {
    const panel = visiblePanel(popup);
    if (!panel) return false;
    const items = $$(panel, "a");
    const index = items.indexOf(el);
    if (index < 0) return false;
    if (ARROW_DELTA[key]) {
      const nextIndex = gridNextIndex(items, index, key, panel);
      if (nextIndex !== null) {
        focusAndPrevent(items[nextIndex], event);
        return true;
      }
      if (key === "ArrowUp") {
        setTabindex(panel, "a", false);
        focusAndPrevent(selectedTab(popup) ?? items[0], event);
        return true;
      }
      return false;
    }
    if (key === "Tab" && !event.shiftKey) {
      if (index + 1 < items.length) {
        focusAndPrevent(items[index + 1], event);
      } else return false;
      return true;
    }
    if (key === "Tab" && event.shiftKey) {
      if (index > 0) {
        focusAndPrevent(items[index - 1], event);
      } else {
        setTabindex(panel, "a", false);
        const target = selectedTab(popup) ?? $$(popup, '.tabs :is([role="tab"], .product-links a)')[0];
        if (target) focusAndPrevent(target, event);
      }
      return true;
    }
    return false;
  }
  function handleCards(el, popup, key, event) {
    if (!VERTICAL.has(key)) return false;
    const items = $$(popup, ".feds-gnav-cards a");
    const index = items.indexOf(el);
    if (index < 0) return false;
    focusAndPrevent(
      items[wrapIndex(index, ARROW_DELTA[key], items.length)],
      event
    );
    return true;
  }
  function onKeydown(event) {
    const el = document.activeElement ?? event.target;
    if (event.key === "Escape") {
      handleEscape(event);
      return;
    }
    const popup = openPopup();
    if (popup) {
      if (popup.matches(":has(.product-list)")) {
        if (handleTabs(el, popup, event.key, event)) return;
        if (handlePanel(el, popup, event.key, event)) return;
      }
      if (popup.matches(":has(.feds-gnav-cards)")) {
        if (handleCards(el, popup, event.key, event)) return;
      }
    }
    handleTopBar(el, event.key, event);
  }
  const trapLink = gnav.querySelector(".trap-focus-gnav");
  const onTrapFocus = (e) => {
    if (!gnav.querySelector(".feds-menu-active")) return;
    e.preventDefault();
    gnav.querySelector(".feds-nav-toggle")?.focus();
  };
  trapLink?.addEventListener("focus", onTrapFocus);
  cleanups.push(() => trapLink?.removeEventListener("focus", onTrapFocus));
  gnav.addEventListener("keydown", onKeydown);
  cleanups.push(() => gnav.removeEventListener("keydown", onKeydown));
  return () => cleanups.forEach((fn) => fn());
}
export {
  IrrecoverableError,
  LANGMAP,
  RecoverableError,
  SIGNED_OUT_ICONS,
  brand,
  getDevice,
  getMetadata,
  getMiloConfig,
  getUnavComponents,
  getUnavWidthCSS,
  getUniversalNavLocale,
  getUserProfile,
  getVisitorGuid,
  initKeyboardNav,
  loadScript,
  loadStyles,
  loadUnav,
  parseBrand,
  parseLink,
  parseProductCard,
  productCard,
  setMiloConfig,
  setUserProfile
};
//# sourceMappingURL=test-exports.js.map
