import esbuild from 'esbuild';
import { execSync } from 'child_process';
import { inlineLightningCss } from './build-plugins/inline-lightning-css.js';

const isWatch = process.argv.includes('--watch');

// Lightning CSS browser targets. Align with the team's supported baseline.
// The gnav uses `:popover-open`, `adoptedStyleSheets`, CSS nesting, and
// `@starting-style` — all baseline-supported in the versions below.
// `version << 16` is Lightning CSS's encoded-version format (see its docs).
const cssTargets = {
  chrome: 114 << 16,
  edge: 114 << 16,
  firefox: 125 << 16,
  safari: 17 << 16,
};

// CSS pipeline: bundles src/styles/styles.css (which @imports design tokens
// and all component CSS), prunes :root-scoped custom properties unreachable
// from any external `var()` reference, minifies, and inlines the result as
// a constructable stylesheet adopted via document.adoptedStyleSheets. The
// plugin also reports every @imported CSS file to esbuild's watcher.
const cssPlugin = inlineLightningCss({
  entry: 'src/styles/styles.css',
  targets: cssTargets,
});

const buildOptions = {
  entryPoints: ['src/Main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  sourcemap: true,
  logLevel: 'info',
  plugins: [cssPlugin],
};

if (isWatch) {
  const context = await esbuild.context({
    ...buildOptions,
    plugins: [
      {
        name: 'type-check',
        setup(build) {
          build.onStart(() => {
            execSync('tsc --noEmit', { stdio: 'inherit' });
          });
        },
      },
      cssPlugin,
    ],
  });
  await context.watch();
} else {
  execSync('tsc --noEmit', { stdio: 'inherit' });

  await esbuild.build(buildOptions);
  console.log('Build complete - CSS inlined into main.js');
}
