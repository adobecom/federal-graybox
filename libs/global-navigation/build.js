import esbuild from 'esbuild';
import { execSync } from 'child_process';

const isWatch = process.argv.includes('--watch');

// Plugin to inject CSS into JS
const injectCSSPlugin = {
  name: 'inject-css',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const fs = await import('fs/promises');
      const css = await fs.readFile(args.path, 'utf8');

      const contents = `
        const css = ${JSON.stringify(css)};
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      `;

      return { contents, loader: 'js' };
    });
  },
};

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
  plugins: [injectCSSPlugin],
};

if (isWatch) {

  const context = await esbuild.context({
    ...buildOptions,
    plugins: [
      {
        name: 'type-check',
        setup(build) {
          build.onStart(() => {
            // Build CSS bundle (pruned tokens + gnav CSS) before esbuild
            execSync('node scripts/build-css.js', { stdio: 'inherit' });
            execSync('tsc --noEmit', { stdio: 'inherit' });
          });
        },
      },
    injectCSSPlugin,
    ],
  });
  await context.watch();
} else {
  // Build CSS bundle (pruned tokens + gnav CSS) before esbuild
  execSync('node scripts/build-css.js', { stdio: 'inherit' });

  execSync('tsc --noEmit', { stdio: 'inherit' });
  
  await esbuild.build(buildOptions);
  console.log('Build complete - CSS inlined into main.js');
}
