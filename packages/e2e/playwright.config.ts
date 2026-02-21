import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['line']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'project-a',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
    },
    {
      name: 'project-b',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3001' },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter project-a dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
    },
    {
      command: 'pnpm --filter project-b dev',
      url: 'http://localhost:3001',
      reuseExistingServer: true,
    },
  ],
});
