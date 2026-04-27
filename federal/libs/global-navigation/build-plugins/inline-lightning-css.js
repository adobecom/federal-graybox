/**
 * esbuild plugin: bundles a CSS entry file through Lightning CSS, prunes
 * unused :root-scoped custom properties (design tokens), minifies, and
 * inlines the result into the JS bundle as a constructable stylesheet
 * adopted via document.adoptedStyleSheets.
 *
 * It also reports every CSS file Lightning CSS resolved (via @import) to
 * esbuild's watcher through `watchFiles`, so `--watch` rebuilds on any
 * authored CSS edit without esbuild having to follow @imports itself.
 *
 * Usage:
 *   import { inlineLightningCss } from './build-plugins/inline-lightning-css.js';
 *   esbuild.build({
 *     ...
 *     plugins: [inlineLightningCss({
 *       entry: 'src/styles/styles.css',
 *       targets: { chrome: 114 << 16, ... },
 *     })],
 *   });
 */

import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { bundleAsync, transform } from 'lightningcss';

/** Escape regex special characters in an absolute path. */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Collect every `var(--name, …)` reference name in the given CSS into a
 * Set of `--name` strings. Used as a primitive by the external-refs and
 * declaration-graph builders below.
 */
const collectAllVarRefs = (css) => {
  const set = new Set();
  // Given var(--some-variable-name) first capture group
  // contains --some-variable-name
  const re = /var\s*\(\s*(--[a-zA-Z0-9_-]+)/g;
  let m;
  while ((m = re.exec(css)) !== null) set.add(m[1]);
  return set;
};

/**
 * Collect `var(--name)` references that do NOT appear inside the VALUE of
 * a `--foo: …;` custom-property declaration. These are the "root" uses:
 * references in regular CSS property values (`color: var(--x)`) or inside
 * selectors/conditional groups. The set of custom properties transitively
 * reachable from these roots (via the declaration graph) is what must be
 * kept; everything else declared in `:root` is safe to prune.
 *
 * Strategy: strip the VALUE of every `--name: value;` declaration in a
 * copy of the CSS, then scan the remainder. That keeps var() refs inside
 * non-custom-property declarations (the roots) and drops refs that live
 * only inside custom-property values.
 */
const collectExternalVarRefs = (css) => {
  const withoutDeclValues = css.replace(
    // Given "--some-variable-name: /* value */;" 
    // The first capture group gets the variable name
    // the second capture group gets the value from the
    // colon to the semicolon
    /(--[a-zA-Z0-9_-]+\s*:\s*)[^;]*(;)/g,
    '$1$2',
  );
  return collectAllVarRefs(withoutDeclValues);
};

/**
 * Build a graph `declarationName → Set<var refs in its value>`.
 * Declarations may appear in any selector context; the graph is used only
 * for transitive reachability, so a scoped declaration's deps are still
 * legitimate "uses" of those deps. Names declared in multiple blocks
 * (e.g. light/dark theme) have their dep sets unioned.
 */
const buildDeclGraph = (css) => {
  const graph = new Map();
  /**
   * First capture group gets variable name example --css-variable-name.
   * Second capture group gets the value bound to that name.
   * Example `--css-variable-name: rgba(0,0,0,1)` gets parsed into
   * (--css-variable-name, rgba(0,0,0,1)).
   */
  const declRe = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]*);/g;
  let m;
  while ((m = declRe.exec(css)) !== null) {
    const variableName = m[1];
    const variableValue = m[2];
    const refs = collectAllVarRefs(variableValue);
    const existing = graph.get(variableName);
    if (existing) for (const r of refs) existing.add(r);
    else graph.set(variableName, refs);
  }
  return graph;
};

/**
 * Transitive closure of `roots` over `graph`. Starts with the root names
 * and iteratively pulls in every name reachable via the declaration-value
 * dependency edges.
 */
const closure = (roots, graph) => {
  const keep = new Set(roots);
  const stack = [...roots];
  // depth first search
  while (stack.length) {
    const name = stack.pop();
    const deps = graph.get(name);
    if (!deps) continue;
    for (const d of deps) {
      if (!keep.has(d)) {
        keep.add(d);
        stack.push(d);
      }
    }
  }
  return keep;
};

/**
 * Collect every custom-property NAME declared inside a top-level
 * `:root` (or `:root[…]`) block. Only :root-scoped declarations are
 * candidates for pruning — scoped declarations like
 * `.feds-popup:popover-open { --x: … }` are component-local and must be
 * kept regardless of whether the current bundle references them.
 */
const collectDeclaredRootProps = (css) => {
  const set = new Set();
  //:root { /* content being got */ }
  const blockRe = /:\s*root(?:\[[^\]]+\])?\s*\{([^}]+)\}/g;
  let m;
  while ((m = blockRe.exec(css)) !== null) {
    const body = m[1];
    const declRe = /(--[a-zA-Z0-9_-]+)\s*:/g;
    let d;
    while ((d = declRe.exec(body)) !== null) set.add(d[1]);
  }
  return set;
};

/**
 * Build the JS module contents that installs the given CSS as a
 * constructable stylesheet and adopts it on the document.
 * Idempotent across multiple module loads: guarded against adding the
 * same sheet twice.
 */
const buildJsWrapper = (css) => `
const css = ${JSON.stringify(css)};
const sheet = new CSSStyleSheet();
sheet.replaceSync(css);
if (!document.adoptedStyleSheets.includes(sheet)) {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}
`;

/**
 * @param {object} options
 * @param {string} options.entry     Path (absolute or relative to cwd) of the
 *                                   CSS entry file. Only imports that resolve
 *                                   to this exact file are handled by this
 *                                   plugin; other `.css` imports fall through
 *                                   to esbuild's default CSS handling.
 * @param {object} [options.targets] Lightning CSS browser targets (see
 *                                   lightningcss's Targets type). Only used
 *                                   on the minify/transform pass; the
 *                                   analysis pass runs without targets to
 *                                   keep :root blocks structurally intact.
 */
export const inlineLightningCss = ({ entry, targets } = {}) => {
  if (!entry) throw new Error('inlineLightningCss: `entry` option is required');
  const entryAbs = path.resolve(entry);
  const entryFilter = new RegExp('^' + escapeRegex(entryAbs) + '$');

  return {
    name: 'inline-lightning-css',
    setup(build) {
      build.onLoad({ filter: entryFilter }, async (args) => {
        const deps = new Set();
        try {
          // Pass 1 — bundle only. No targets (no lowering) and no minify,
          // so :root blocks and declaration bodies are preserved verbatim
          // for the static-analysis regexes below.
          const bundled = await bundleAsync({
            filename: args.path,
            minify: false,
            resolver: {
              read(filePath) {
                deps.add(filePath);
                return readFile(filePath, 'utf8');
              },
            },
          });
          const bundledCss = bundled.code.toString('utf8');

          // Static analysis: the set of :root-scoped names we would like
          // to prune is those not transitively reachable from any external
          // (non-custom-property-declaration) `var()` reference.
          const rootDeclared = collectDeclaredRootProps(bundledCss);
          const declGraph = buildDeclGraph(bundledCss);
          const externalRefs = collectExternalVarRefs(bundledCss);
          const keep = closure(externalRefs, declGraph);
          const unused = [...rootDeclared].filter((name) => !keep.has(name));

          // Pass 2 — minify + lower to the configured targets + drop the
          // unused declarations. Lightning CSS's `unusedSymbols` also
          // strips `var()` fallbacks referencing the pruned names.
          const transformed = transform({
            filename: args.path,
            code: bundled.code,
            minify: true,
            targets,
            unusedSymbols: unused,
          });
          const finalCss = transformed.code.toString('utf8');

          return {
            contents: buildJsWrapper(finalCss),
            loader: 'js',
            watchFiles: [...deps],
          };
        } catch (err) {
          // Surface Lightning CSS errors to esbuild so they show up in
          // the normal build log and the watcher keeps running.
          return {
            errors: [
              {
                text: `inline-lightning-css: ${err.message ?? String(err)}`,
                detail: err,
              },
            ],
            // Still watch whatever we got far enough to read, so a fix
            // to a parse-failed file re-triggers a rebuild.
            watchFiles: [...deps],
          };
        }
      });
    },
  };
};
