import { test as base, expect } from '@playwright/test';

export const ANALYTICS = /(googletagmanager\.com|google-analytics\.com|clarity\.ms)/;

// Abort analytics so test runs never send hits to GA4 or Clarity.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(ANALYTICS, (route) => route.abort());
    await use(context);
  },
});

export { expect };
