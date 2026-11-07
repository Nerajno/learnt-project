import { test, expect } from './test';

const visibleCards = (page: import('@playwright/test').Page) =>
  page.locator('#project-list article:not([hidden])');

test('category filter narrows the list', async ({ page }) => {
  await page.goto('/learnt/');
  const all = await visibleCards(page).count();
  await page.goto('/learnt/?category=backend');
  expect(await visibleCards(page).count()).toBeLessThan(all);
});

test('unknown category shows no projects', async ({ page }) => {
  await page.goto('/learnt/?category=not-a-category');
  expect(await visibleCards(page).count()).toBe(0);
});
