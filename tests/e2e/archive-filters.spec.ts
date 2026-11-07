import { projects } from '../../src/data/projects';
import { deriveStage } from '../../src/lib/archive';
import { test, expect } from './test';

const visible = (page: import('@playwright/test').Page) =>
  page.locator('#project-list article[data-slug]:not([hidden])');

test('deep link filters by stage and marks the button pressed', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  const expected = projects
    .filter((p) => deriveStage(p) === 'composted')
    .map((p) => p.slug)
    .sort();
  await expect(visible(page)).toHaveCount(expected.length);
  expect(await visible(page).evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.slug!).sort())).toEqual(expected);
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');
});

test('typing filters without navigation and updates the URL', async ({ page }) => {
  await page.goto('/learnt/');
  let loads = 0;
  page.on('load', () => {
    loads += 1;
  });

  await page.getByRole('searchbox', { name: /search projects/i }).fill('rails');
  await page.waitForURL(/q=rails/);

  const count = await visible(page).count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(projects.length);
  expect(loads).toBe(0);
});

test('filtered-out cards are actually hidden', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  const hidden = page.locator('#project-list article[data-slug][hidden]');
  expect(await hidden.count()).toBeGreaterThan(0);
  expect(await hidden.first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
});

test('Back restores the previous filters', async ({ page }) => {
  await page.goto('/learnt/');
  await page.locator('[data-stage-filter="composted"]').click();
  await page.waitForURL(/stage=composted/);
  await page.locator('[data-stage-filter="shipped"]').click();
  await page.waitForURL(/stage=shipped/);

  await page.goBack();
  await page.waitForURL(/stage=composted/);
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-stage-filter="shipped"]')).toHaveAttribute('aria-pressed', 'false');
});

test('an impossible combination shows the empty state', async ({ page }) => {
  await page.goto('/learnt/?stage=seed');
  await expect(page.locator('#archive-empty')).toBeVisible();
  await expect(page.locator('#archive-count')).toHaveText('0');
  await expect(page.locator('#archive-result')).toContainText('Showing 0 of');
});

test('clear all resets the list and the URL', async ({ page }) => {
  await page.goto('/learnt/?stage=composted&q=rails');
  await page.locator('#archive-clear').click();
  await page.waitForURL(/\/learnt\/$/);
  await expect(visible(page)).toHaveCount(projects.length);
  await expect(page.locator('[data-stage-filter=""]')).toHaveAttribute('aria-pressed', 'true');
});
