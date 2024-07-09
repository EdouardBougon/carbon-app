import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  test: {
    setupFiles: ['src/libs/testing-library/setup.ts'],
    environment: 'jsdom',
    include: [
      'src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'e2e/**/*.test.ts',
    ],
  },
  plugins: [tsconfigPaths(), svgrPlugin()],
});
