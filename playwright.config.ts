import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
  },
  webServer: {
    command: 'npx tsx src/server/index.ts',
    url: 'http://127.0.0.1:3000/health',
    reuseExistingServer: !process.env.CI,
  },
});
