import { ANALYTICS, test, expect } from './test';

test('analytics tags are configured with real IDs', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('surxnzd38u');
  expect(html).not.toContain('REPLACE_WITH_PROJECT_ID');
  expect(html).toContain('G-CXQYQ18LFT');
  expect(html).toContain('type="text/partytown"');
});

// Aborted requests never produce a response, so any response here means
// an analytics request (GA4 or Clarity) actually reached a server.
test('no analytics request gets a response during tests', async ({ page }) => {
  const reached: string[] = [];
  page.on('response', (res) => {
    if (ANALYTICS.test(res.url())) reached.push(res.url());
  });
  await page.goto('/');
  expect(reached).toEqual([]);
});
