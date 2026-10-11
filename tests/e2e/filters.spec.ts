import { test, expect } from './test';

const KNOWN_BUG =
  'Bug #2: learnt.astro reads Astro.url.searchParams at build time, so filters do nothing on the static site';

test('category filter narrows the list', async ({ page }) => {
  test.fail(true, KNOWN_BUG);
  await page.goto('/learnt/');
  const all = await page.locator('article').count();
  await page.goto('/learnt/?category=backend');
  expect(await page.locator('article').count()).toBeLessThan(all);
});

test('unknown category shows no projects', async ({ page }) => {
  test.fail(true, KNOWN_BUG);
  await page.goto('/learnt/?category=not-a-category');
  expect(await page.locator('article').count()).toBe(0);
});
