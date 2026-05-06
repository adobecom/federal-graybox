import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'test/**/*.test.{js,ts}',
  nodeResolve: true,
  plugins: [
    // Transpile imported .ts files on the fly so tests can import directly
    // from src/ without a pre-build step. target matches tsconfig.json's
    // "target": "ES2020".
    esbuildPlugin({ ts: true, target: 'es2020' }),
  ],
};
