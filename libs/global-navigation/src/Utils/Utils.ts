import { IrrecoverableError } from "../Error/Error";
import { lanaLog } from "./Log";
import { getPlaceholders, replacePlaceholders } from "./Placeholders";

export const isDesktop = window.matchMedia('(min-width: 1024px)');

export const icons = {
  brand: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',
  company: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#EB1000"/></svg>',
  search: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',
  home: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',
  chevronLeft: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" focusable="false"><path d="M12.5 4l-5 6 5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronRight: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="3" height="6" viewBox="0 0 3 6" focusable="false"><path d="M.5.5 2.5 3 .5 5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
  chevronDown: '<svg class="chevron-down" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="6" height="3.375" viewBox="0 0 6 3.375" focusable="false"><path d="M.5.5 3 2.875 5.5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>',
};

// split arrays based on a predicate
// unlike string.prototype.split, it works on
// all arrays.
export const split = <T>(
  predicate: (_: T) => boolean
) => (arr: T[]): T[][] => {
  const splitArrays = [];
  let currSubArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      splitArrays.push(currSubArray);
      currSubArray = [];
      continue;
    }
    currSubArray.push(arr[i]);
  }
  splitArrays.push(currSubArray);
  return splitArrays;
};

export const zip = <T, R>(
  xs: T[],
  ys: R[]
): List<[T, R]> => {
  const len = xs.length < ys.length
            ? xs.length
            : ys.length;
  const result = new Array(len) as List<[T, R]>;
  for (let i = 0; i < len; i = i + 1) {
    result[i] = [xs[i], ys[i]];
  }
  return result;
}

export const takeWhile = <T>(
  predicate: (_: T) => boolean
) => (arr: T[]): T[] => {
  if (arr.length === 0)
    return arr;
  const [firstItem, ...remainingItems] = arr;
  if (predicate(firstItem))
    return [firstItem].concat(takeWhile(predicate)(remainingItems));
  return [];
};

export const dropWhile = <T>(
  predicate: (_: T) => boolean
) => (arr: T[]): T[] => {
  if (arr.length === 0)
    return arr;
  const [firstItem, ...remainingItems] = arr;
  if (predicate(firstItem))
    return dropWhile(predicate)(remainingItems);
  return remainingItems;
};

export const getNextSiblings = (element: Element): Element[] => {
  const accumulator = [];
  let iterator = element.nextElementSibling as Element ?? null;
  while(iterator !== null) {
    accumulator.push(iterator);
    iterator = iterator.nextElementSibling as Element ?? null;
  }
  return accumulator;
};

type Alternative<ReturnType, InputType> = {
  or: (
    fallbackFn: (input: InputType) => ReturnType
  ) => Alternative<ReturnType, InputType>;
  eval: (input: InputType) => ReturnType;
};

export const alternative = <ReturnType, InputType>(
  primaryFn: (input: InputType) => ReturnType
): Alternative<ReturnType, InputType> => {
  return {
    eval: primaryFn,
    or: (fallbackFn) => alternative((input) => {
      try {
        return primaryFn(input)
      } catch (_error) {
        return fallbackFn(input);
      }
    })
  }
};

export const parseListAndAccumulateErrors = <
  UnParsedObj,
  ParsedObj,
  ErrorType
  >(
  elements: List<UnParsedObj>,
  parse: (element: UnParsedObj) => Parsed<ParsedObj, ErrorType>
): Parsed<List<ParsedObj>, ErrorType> => elements.reduce(
  ([accElems, accErrors], element) => {
    try {
      const [parsedElement, parseErrors] = parse(element);
      return [
        [...accElems, parsedElement],
        [...accErrors, ...parseErrors]
      ];
    } catch (error) {
      if (error instanceof IrrecoverableError) {
        return [accElems, [
          error as ErrorType,
          ...accErrors]
        ];
      }
      return [accElems, accErrors];
    }
  },
  [[],[]] as Parsed<List<ParsedObj>, ErrorType>
  );

export type PersonalizationConfig = {
  commands: unknown[];
  handleCommands: (
    commands: unknown[],
    rootEl: Document | HTMLElement
  ) => unknown;
};

type PersonalizationStateFunctions = [
  (config: PersonalizationConfig) => void,
  () => PersonalizationConfig
];

// TODO: Consolidate all global state handlers into
// a single file (but still probably keep them separate)
export const [setPersonalizationConfig, getPersonalizationConfig] = 
  ((): PersonalizationStateFunctions => {
    let personalizationConfig: PersonalizationConfig | undefined;
    let isInitialized = false;

    return [
      (config: PersonalizationConfig): void => {
        if (isInitialized) {
          return;
        }

        personalizationConfig = config;
        isInitialized = true;
      },
      (): PersonalizationConfig => {
        if (!personalizationConfig) {
          throw new Error('PersonalizationConfig not initialized. Call setPersonalizationConfig() first.');
        }
        return personalizationConfig;
      },
    ];
  })();

export const fetchAndProcessPlainHTML = async (
  source: URL | null
): Promise<HTMLElement | IrrecoverableError> => {
  try {
    if (source === null)
      return new IrrecoverableError('URL is null');
    const modifiedSource = federateUrl(`${source.origin}${source.pathname.replace(/(\.html$|$)/, '.plain.html')}${source.hash}`);
    const response = await fetch(modifiedSource);
    if (!response.ok) {
      lanaLog(`Request for ${modifiedSource} failed`);
      return new IrrecoverableError(`Request for ${modifiedSource} failed`);
    }
    const htmlText = await response.text();
    const resolvedPlaceholders = await getPlaceholders();
    const processedHtml = replacePlaceholders(htmlText, resolvedPlaceholders);
    const { body } = new DOMParser().parseFromString(processedHtml, "text/html");
    
    // Apply personalization to the fetched HTML
    try {
      const { handleCommands, commands } = getPersonalizationConfig();
      handleCommands(commands, body);
    } catch (error) {
      // PersonalizationConfig not initialized or personalization failed
      // This is non-fatal, so we just log and continue
      // @ts-expect-error errors usually have a message
      lanaLog(`Personalization not applied: ${error?.message}`);
    }
    
    return body;
  } catch (error) {
    // @ts-expect-error errors usually have a message
    return new IrrecoverableError(error?.message);
  }
};

// TODO: refactor
let federatedContentRoot: string;
export const getFederatedContentRoot = (): string => {
  if (federatedContentRoot) return federatedContentRoot;

  const cdnWhitelistedOrigins = [
    'https://www.adobe.com',
    'https://business.adobe.com',
    'https://blog.adobe.com',
    'https://milo.adobe.com',
    'https://news.adobe.com',
    'graybox.adobe.com',
  ];
  if (federatedContentRoot) return federatedContentRoot;
  // Non milo consumers will have its origin from config
  // TODO: allow the passing of a configured origin
  const origin = window.location.origin;

  const isAllowedOrigin = cdnWhitelistedOrigins.some((o) => {
    const originNoStage = origin.replace('.stage', '');
    return o.startsWith('https://')
      ? originNoStage === o
      : originNoStage.endsWith(o);
  });

  federatedContentRoot = isAllowedOrigin ? origin : 'https://www.adobe.com';

  const SLD = window.location.hostname.includes('.aem.') ? 'aem' : 'hlx';
  if (origin.includes('localhost') || origin.includes(`.${SLD}.`)) {
    federatedContentRoot = `https://main--federal--adobecom.aem.${origin.endsWith('.live') ? 'live' : 'page'}`;
  }

  return federatedContentRoot;
};

// TODO we should match the akamai patterns /locale/federal/
// at the start of the url
// and make the check more strict.
export const federateUrl = (url = ''): string => {
  // TEMPORARY REMOVE LATER
  if (url.includes('c2-poc--milo--adobecom')) {
    return url.replace('c2-poc--milo--adobecom', 'main--federal--adobecom');
  }
  if (url.includes('c2-poc-feds-gnav--milo--adobecom')) {
    return url.replace('c2-poc-feds-gnav--milo--adobecom', 'main--federal--adobecom');
  }
  if (url.includes('localhost:3000')) {
    return url.replace('localhost:3000', 'main--federal--adobecom.aem.page');
  }
  if (typeof url !== 'string' || !url.includes('/federal/')) return url;
  if (url.startsWith('/')) return `${getFederatedContentRoot()}${url}`;
  try {
    const { pathname, search, hash } = new URL(url);
    return `${getFederatedContentRoot()}${pathname}${search}${hash}`;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`getFederatedUrl errored parsing the URL: ${url}: ${message}`);
  }
  return url;
};

/**
 * Replaces relative media paths (./media_*) with absolute federated URLs.
 * @param path - The source path/URL used to resolve relative media references
 * @param ele - The DOM element containing media elements to process
 */
export const replaceDotMedia = (path: string, ele: Element): void => {
  /* Helper function to update media attributes for a specific element type */
  const resetAttributeBase = (
    tag: 'img' | 'source',
    attr: 'src' | 'srcset'
  ): void => {
    const selector = `${tag}[${attr}^="./media_"]`;
    const elements = tag === 'img' 
      ? ele.querySelectorAll<HTMLImageElement>(selector)
      : ele.querySelectorAll<HTMLSourceElement>(selector);
    
    elements.forEach((el) => {
      const attrValue = el.getAttribute(attr);
      if (!attrValue) return;
      
      try {
        // Construct absolute URL by resolving
        // relative path against source location
        // Then federate the URL to ensure it 
        // points to the correct content source
        const absoluteUrl = federateUrl(
          new URL(attrValue, new URL(path, window.location.href)).href
        );
        el.setAttribute(attr, absoluteUrl);
      } catch (error) {
        // This prevents one malformed URL from breaking all media processing
        console.warn(`[MediaPathError]: Failed to process relative media path (${attrValue}) for ${tag}`, error);
      }
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');
};

export const inlineNestedFragments = async (
  element: Element | HTMLElement
): Promise<Element | HTMLElement | IrrecoverableError> => {
  const processElement = async (
    currentElem: Element | HTMLElement | IrrecoverableError,
    visitedUrls: Set<string>
  ): Promise<Element | HTMLElement | IrrecoverableError> => {
    if (currentElem instanceof IrrecoverableError)
      return currentElem;
    try {
      const anchorElements = [
        ...currentElem.querySelectorAll('a[href*="#_inline"]')
      ] as HTMLAnchorElement[];
      const inlineLinks = anchorElements
        .map(async (anchorElement: HTMLAnchorElement) => {
          try {
            if (visitedUrls.has(anchorElement.href)) return;
            const federatedUrl = federateUrl(anchorElement.href);
            const fragmentUrl = new URL(federatedUrl);
            const fragmentBody = await fetchAndProcessPlainHTML(fragmentUrl);
            visitedUrls.add(anchorElement.href);
            if (fragmentBody instanceof IrrecoverableError)
              throw fragmentBody;
            await processElement(fragmentBody, visitedUrls);
            anchorElement.replaceWith(...fragmentBody.children);
            return;
          } catch {
            return;
          }
        }, [] as List<[HTMLAnchorElement, URL]>)
      await Promise.all(inlineLinks);
      return currentElem
    } catch (error) {
      return new IrrecoverableError(JSON.stringify(error));
    }
  }
  return processElement(element, new Set());
};

export const renderListItems = <T>(
  items: T[],
  renderFn: (item: T) => string
): string => {
  return items.map(item => `<li>${renderFn(item)}</li>`).join('');
};

export const sanitize = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    // Replace spaces and non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Ensure it starts with a letter (prepend 'id-' if it starts with a number)
    .replace(/^(\d)/, 'id-$1')
};

export const getAnalyticsAttrs = (
  daaLh: string | null,
  daaLl: string | null
): string => {
  const daaLhAttr = daaLh !== null && daaLh !== ""
    ? ` daa-lh="${daaLh}"`
    : "";
  const daaLlAttr = daaLl !== null && daaLl !== ""
    ? ` daa-ll="${daaLl}"`
    : "";
  return `${daaLhAttr}${daaLlAttr}`;
};


export const isDarkMode = (): boolean => {
  // TODO: Implement dark mode detection
  return true;
};

/**
 * Configuration options for dynamically loading link elements
 */
type LoadLinkOptions<T> = {
  id?: string;
  as?: string;
  callback?: (type: string) => T;
  crossorigin?: string;
  rel: string;
  fetchpriority?: string;
}

/**
 * Dynamically loads a link element into the document head.
 * Prevents duplicate loading by checking if a link 
 * with the same href already exists.
 * 
 * @param href - URL of the resource to load
 * @param options - Configuration options for the link element
 * @returns The created or existing HTMLLinkElement
 * 
 * @example
 * // Load a stylesheet with high priority
 * loadLink('/styles/main.css', { 
 *   rel: 'stylesheet', 
 *   fetchpriority: 'high',
 *   callback: (type) => console.log(`Stylesheet ${type}`)
 * });
 */
export function loadLink<T>(
  href: string,
  {
    id,
    as,
    callback,
    crossorigin,
    rel,
    fetchpriority,
  }: LoadLinkOptions<T> = { rel: 'stylesheet' }
): HTMLLinkElement {
  // Check if link already exists to prevent duplicates
  const existingLink = document.head.querySelector(`link[href="${href}"]`);
  if (existingLink) {
    // Link already exists, invoke callback with 
    // 'noop' to indicate no action taken
    callback?.('noop');
    return existingLink as HTMLLinkElement;
  }
  // Create new link element with specified attributes
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  if (id !== undefined) link.setAttribute('id', id);
  if (as !== undefined) link.setAttribute('as', as);
  if (crossorigin !== undefined) link.setAttribute('crossorigin', crossorigin);
  if (fetchpriority !== undefined) link.setAttribute('fetchpriority', fetchpriority);
  link.setAttribute('href', href);
  
  // Attach load/error event handlers if callback provided
  if (callback) {
    link.onload = (e: Event): T => callback(e.type);
    link.onerror = (e: string | Event): T => callback(typeof e === 'string' ? 'error' : e.type);
  }
  document.head.appendChild(link);
  return link;
}

/**
 * Convenience function to load a CSS stylesheet.
 * 
 * @param href - URL of the stylesheet to load
 * @param callback - Optional callback invoked on load/error events
 * @returns The created or existing HTMLLinkElement
 */
export function loadStyle(
  href: string,
  callback?: (type: string) => void
): HTMLLinkElement {
  return loadLink(href, { rel: 'stylesheet', callback });
}

/**
 * Conditionally loads a stylesheet based on the override flag.
 * 
 * @param url - URL of the stylesheet to load
 * @param override - Whether to load the stylesheet (defaults to false)
 */
export function loadStyles(url: string, override = false): void {
  if (!override) return;
  loadStyle(url);
}

/**
 * Configuration options for dynamically loading script elements
 */
type LoadScriptOptions = {
  /** Loading strategy: 'async' for parallel execution, 
    * 'defer' for sequential after DOM parsing */
  mode?: 'async' | 'defer';
  /** Unique identifier for the script element */
  id?: string;
};

/**
 * Dynamically loads a JavaScript file into the document head.
 * Returns a Promise that resolves when the script loads successfully 
 * or rejects on error.
 * Prevents duplicate loading and tracks loaded state via data-loaded attribute.
 * 
 * @param url - URL of the script to load
 * @param type - Script MIME type (e.g., 'module', 'text/javascript')
 * @param options - Configuration options for loading behavior
 * @returns Promise that resolves with the HTMLScriptElement on success
 * 
 * @example
 * // Load a module script asynchronously
 * loadScript('/js/app.js', 'module', { mode: 'async' })
 *   .then(script => console.log('Script loaded'))
 *   .catch(error => console.error('Failed to load:', error));
 */
export const loadScript = (
  url: string,
  type?: string,
  { mode, id }: LoadScriptOptions = {}
): Promise<HTMLScriptElement> => new Promise((resolve, reject) => {
  // Check if script already exists to prevent duplicates
  let script: HTMLScriptElement | null = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    // Create new script element with specified attributes
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (id !== null && id !== undefined) script.setAttribute('id', id);
    if (type !== null && type !== undefined) {
      script.setAttribute('type', type);
    }
    // Set loading mode (async or defer) if specified
    if (mode && ['async', 'defer'].includes(mode)) script.setAttribute(mode, '');
    head.append(script);
  }

  // If script was previously loaded, resolve immediately
  const loaded = script.dataset.loaded;
  if (loaded !== null && loaded !== undefined) {
    resolve(script);
    return;
  }

  // Set up event handler for load and error events
  const onScript = (event: Event): void => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      // Mark script as loaded to prevent re-execution
      script.dataset.loaded = 'true';
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

/**
 * Retrieves metadata content from the document's head section.
 * Automatically determines whether to use 'name' or 'property' 
 * attribute based on the metadata name.
 * 
 * Uses 'property' attribute for Open Graph and other namespaced
 *  metadata (containing ':'),
 * and 'name' attribute for standard HTML metadata.
 * 
 * @param name - The metadata name or property to search for
 * (e.g., 'description', 'og:title')
 * @param doc - The document to search in (defaults to current document)
 * @returns The metadata content value, or null if not found
 * 
 * @example
 * // Get standard meta tag
 * const description = getMetadata('description');
 * 
 * @example
 * // Get Open Graph meta tag
 * const ogTitle = getMetadata('og:title');
 */
export function getMetadata(
  name: string,
  doc: Document = document
): string | null {
  // Use 'property' for namespaced metadata (e.g., Open Graph), 'name' 
  // for standard metadata
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  return meta?.content ?? null;
}

type MiloConfigEnv = {
  name: string;                    // Env name: 'local', 'stage', or 'prod'
  ims?: string;                    // IMS environment: 'stg1' or 'prod'
  adobeIO?: string;                // Adobe I/O hostname
  adminconsole?: string;           // Admin Console hostname
  account?: string;                // Account hostname
  edgeConfigId?: string;           // Edge configuration ID
  pdfViewerClientId?: string;      // PDF Viewer client ID
  consumer?: {                     // Consumer-specific configuration (optional)
    pdfViewerClientId: string;
    pdfViewerReportSuite: string;
    psUrl: string;
    odinEndpoint: string;
  };
};

type MiloConfigLocale = {
  prefix: string;                  // e.g., '', '/fr', '/de', '/jp/ja'
  ietf?: string;                   // e.g., 'en-US', 'fr-FR', 'de-DE'
  tk?: string;                     // Typekit font ID, e.g., 'hah7vzn.css'
  region?: string;                 // Region/country code, e.g. 'us', 'gb', 'fr'
  regions?: Record<string, unknown>; // Regional configuration mapping
  contentRoot?: string;            // Full content path with origin
  language?: string;               // Langcode (new routing)e.g., 'en','fr','de'
  dir?: string;                    // Text direction: 'ltr' or 'rtl'
  
  // Allow additional locale-specific properties
  [key: string]: unknown;          // Additional locale configuration
};

type UnavProfileConfig = {
  messageEventListener?: (event: CustomEvent) => void;
  complexConfig?: Record<string, unknown> | null;
  config?: Record<string, unknown>;
  signInCtaStyle?: 'primary' | 'secondary';
}

type UnavConfig = {
  unavHelpChildren?: Array<{ type: string }>;
  profile?: UnavProfileConfig;
  uncAppId?: string;
  uncConfig?: Record<string, unknown>;
  showSectionDivider?: boolean;
}

type JarvisConfig = {
  id: string;
  callbacks?: Record<string, () => unknown>;
}

export type MiloConfig = {
  env: MiloConfigEnv;
  locale: MiloConfigLocale;
  unav?: UnavConfig;
  jarvis?: JarvisConfig;
  signInContext?: object;          // IMS sign-in context for UNAV
};

/**
 * Validates MiloConfig structure at runtime
 * @param config - Configuration object to validate
 * @returns true if valid, false otherwise
 */
const isValidMiloConfig = (config: unknown): config is MiloConfig => {
  const cfg = config as MiloConfig;

  const invalid = (x: unknown): boolean => x === null || x === undefined || typeof x !== 'object';

  if (invalid(cfg)) return false;

  // Validate locale structure
  if (invalid(cfg.locale)) return false;
  const locale = cfg.locale as Record<string, unknown>;
  if (typeof locale.prefix !== 'string') return false;
  
  // Validate env structure
  if (invalid(cfg.env)) return false;
  const env = cfg.env as Record<string, unknown>;
  if (typeof env.name !== 'string') return false;
  
  // Validate optional unav structure
  if (cfg.unav !== undefined) {
    if (typeof cfg.unav !== 'object' || cfg.unav === null) return false;
    const unav = cfg.unav as Record<string, unknown>;
    
    // Validate unav.profile if present
    if (unav.profile !== undefined) {
      if (typeof unav.profile !== 'object' || unav.profile === null) return false;
      const profile = unav.profile as Record<string, unknown>;
      
      // Validate signInCtaStyle if present
      if (profile.signInCtaStyle !== undefined) {
        if (profile.signInCtaStyle !== 'primary' && profile.signInCtaStyle !== 'secondary') {
          return false;
        }
      }
      
      // Validate messageEventListener if present
      if (profile.messageEventListener !== undefined && typeof profile.messageEventListener !== 'function') {
        return false;
      }
    }
  }
  
  // Validate optional jarvis structure
  if (cfg.jarvis !== undefined) {
    if (typeof cfg.jarvis !== 'object' || cfg.jarvis === null) return false;
    const jarvis = cfg.jarvis as Record<string, unknown>;
    
    // id is required if jarvis object exists
    if (typeof jarvis.id !== 'string') return false;
  }
  
  return true;
};

/**
 * MiloConfig Configuration State Management
 * Implements closure-based singleton pattern 
 * for global configuration with validation
 * 
 * @throws Error if config validation fails or if accessed before initialization
 */

 type ConfigStateFunctions = [ (config: unknown) => void, () => MiloConfig]

export const [setMiloConfig, getMiloConfig] = ((): ConfigStateFunctions => {
  let miloConfig: MiloConfig | undefined;
  let isInitialized = false;

  return [
    (config: unknown): void => {
      if (isInitialized) {
        return;
      }

      // Validate config structure
      if (!isValidMiloConfig(config)) {
        throw new Error('MiloConfig validation failed: Invalid structure');
      }

      miloConfig = config;
      isInitialized = true;
    },
    (): MiloConfig => {
      if (!miloConfig) {
        throw new Error('MiloConfig not initialized. Call setMiloConfig() first.');
      }
      return miloConfig;
    },
  ];
})();

const LanguageMap = {
  en: 'US',
  'en-gb': 'GB',
  'es-mx': 'MX',
  'fr-ca': 'CA',
  da: 'DK',
  et: 'EE',
  ar: 'DZ',
  el: 'GR',
  iw: 'IL',
  he: 'IL',
  id: 'ID',
  ms: 'MY',
  nb: 'NO',
  sl: 'SI',
  sv: 'SE',
  cs: 'CZ',
  uk: 'UA',
  hi: 'IN',
  'zh-hans': 'CN',
  'zh-hant': 'TW',
  ja: 'JP',
  ko: 'KR',
  fil: 'PH',
  th: 'TH',
  vi: 'VN',
};

const GeoMap = {
  ar: 'AR_es',
  be_en: 'BE_en',
  be_fr: 'BE_fr',
  be_nl: 'BE_nl',
  br: 'BR_pt',
  ca: 'CA_en',
  ch_de: 'CH_de',
  ch_fr: 'CH_fr',
  ch_it: 'CH_it',
  cl: 'CL_es',
  co: 'CO_es',
  la: 'DO_es',
  mx: 'MX_es',
  pe: 'PE_es',
  africa: 'MU_en',
  dk: 'DK_da',
  de: 'DE_de',
  ee: 'EE_et',
  eg_ar: 'EG_ar',
  eg_en: 'EG_en',
  es: 'ES_es',
  fr: 'FR_fr',
  gr_el: 'GR_el',
  gr_en: 'GR_en',
  ie: 'IE_en',
  il_he: 'IL_iw',
  it: 'IT_it',
  lv: 'LV_lv',
  lt: 'LT_lt',
  lu_de: 'LU_de',
  lu_en: 'LU_en',
  lu_fr: 'LU_fr',
  my_en: 'MY_en',
  my_ms: 'MY_ms',
  hu: 'HU_hu',
  mt: 'MT_en',
  mena_en: 'DZ_en',
  mena_ar: 'DZ_ar',
  nl: 'NL_nl',
  no: 'NO_nb',
  pl: 'PL_pl',
  pt: 'PT_pt',
  ro: 'RO_ro',
  si: 'SI_sl',
  sk: 'SK_sk',
  fi: 'FI_fi',
  se: 'SE_sv',
  tr: 'TR_tr',
  uk: 'GB_en',
  at: 'AT_de',
  cz: 'CZ_cs',
  bg: 'BG_bg',
  ru: 'RU_ru',
  ua: 'UA_uk',
  au: 'AU_en',
  in_en: 'IN_en',
  in_hi: 'IN_hi',
  id_en: 'ID_en',
  id_id: 'ID_id',
  nz: 'NZ_en',
  sa_ar: 'SA_ar',
  sa_en: 'SA_en',
  sg: 'SG_en',
  cn: 'CN_zh-Hans',
  tw: 'TW_zh-Hant',
  hk_zh: 'HK_zh-hant',
  jp: 'JP_ja',
  kr: 'KR_ko',
  za: 'ZA_en',
  ng: 'NG_en',
  cr: 'CR_es',
  ec: 'EC_es',
  pr: 'US_es', // not a typo, should be US
  gt: 'GT_es',
  cis_en: 'TM_en',
  cis_ru: 'TM_ru',
  sea: 'SG_en',
  th_en: 'TH_en',
  th_th: 'TH_th',
};

function getDefaultLangstoreCountry(language: string): string {
  let country = LanguageMap[language as keyof typeof LanguageMap];
  if (!country && GeoMap[language as keyof typeof GeoMap]) {
    country = language; // es, fr, pt, de
  }
  if (!country && language.includes('-')) {
    [country] = language.split('-'); // variations like es-419, pt-PT
  }

  return country || 'US';
}

const LANG_STORE_PREFIX = 'langstore/';

type MiloLocaleSettings = {
  language: string;
  country: string;
  locale: `${string}_${string}`;
};

export function getMiloLocaleSettings(
  miloLocale: MiloConfigLocale
): MiloLocaleSettings {
  const localePrefix = miloLocale?.prefix || 'US_en';
  const geo = localePrefix.replace('/', '') ?? '';
  let [country = 'US', language = 'en'] = (GeoMap[geo as keyof typeof GeoMap] ?? geo).split('_', 2);

  if (
    geo.startsWith(LANG_STORE_PREFIX)
    || window.location.pathname.startsWith(`/${LANG_STORE_PREFIX}`)
  ) {
    const localeLang = geo.replace(LANG_STORE_PREFIX, '').toLowerCase();
    country = getDefaultLangstoreCountry(localeLang);
    language = localeLang;
  }

  country = country.toUpperCase();
  language = language.toLowerCase();

  return {
    language,
    country,
    locale: `${language}_${country}`,
  };
}
