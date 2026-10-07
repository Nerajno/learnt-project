import { test, expect } from './test';

test('analytics tags are configured with real IDs', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('surxnzd38u');
  expect(html).not.toContain('REPLACE_WITH_PROJECT_ID');
  expect(html).toContain('G-CXQYQ18LFT');
  expect(html).toContain('type="text/partytown"');
});

test('test runs send no GA hits', async ({ page }) => {
  const hits: string[] = [];
  page.on('requestfinished', (req) => {
    if (req.url().includes('google-analytics.com/g/collect')) hits.push(req.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});
