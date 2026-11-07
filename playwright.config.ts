import { defineConfig } from '@playwright/test';

// Port 4322 avoids the developer's `astro dev` server, which owns 4321.
// A reused dev server would test the wrong build.
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4322' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
