import { esbuildPlugin } from '@web/dev-server-esbuild';

// NOTE: keep this glob in sync with the "test" script in package.json.
// Both must agree on which files are treated as tests.
const TEST_GLOB = 'test/**/*.test.{js,ts}';

export default {
  files: TEST_GLOB,
  nodeResolve: true,
  plugins: [
    // Transpile imported .ts files on the fly so tests can import directly
    // from src/ without a pre-build step. target matches tsconfig.json's
    // "target": "ES2020".
    esbuildPlugin({ ts: true, target: 'es2020' }),
  ],
};
