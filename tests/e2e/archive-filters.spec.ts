import { getCardProjects } from '../../src/data/projects';
import { test, expect } from './test';

const cardProjects = getCardProjects();

const visible = (page: import('@playwright/test').Page) =>
  page.locator('#project-list article[data-slug]:not([hidden])');

test('deep link filters by stage and marks the button pressed', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  const expected = cardProjects
    .filter((p) => p.stage === 'composted')
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
  expect(count).toBeLessThan(cardProjects.length);
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
  await expect(visible(page)).toHaveCount(cardProjects.length);
  await expect(page.locator('[data-stage-filter=""]')).toHaveAttribute('aria-pressed', 'true');
});

test('Enter in the search keeps the active stage and does not reload', async ({ page }) => {
  await page.goto('/learnt/?stage=composted');
  let loads = 0;
  page.on('load', () => {
    loads += 1;
  });

  const search = page.getByRole('searchbox', { name: /search projects/i });
  await search.fill('rails');
  await search.press('Enter');
  await page.waitForTimeout(200);

  expect(page.url()).toContain('stage=composted');
  expect(loads).toBe(0);
  await expect(page.locator('[data-stage-filter="composted"]')).toHaveAttribute('aria-pressed', 'true');
});

test('typing does not add history entries', async ({ page }) => {
  await page.goto('/learnt/');
  const before = await page.evaluate(() => history.length);

  await page
    .getByRole('searchbox', { name: /search projects/i })
    .pressSequentially('rails', { delay: 200 });
  await page.waitForURL(/q=rails/);

  expect(await page.evaluate(() => history.length)).toBe(before);
});

test('archive cards do not replay the entrance animation on filter changes', async ({ page }) => {
  await page.goto('/learnt/');
  const card = page.locator('#project-list article[data-slug]').first();
  expect(await card.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});

test('card hover action links sit above the stretched card link', async ({ page }) => {
  await page.goto('/learnt/');
  const card = page
    .locator('#project-list article')
    .filter({ has: page.getByRole('link', { name: /source code/i }) })
    .first();
  await card.hover();

  const link = card.getByRole('link', { name: /source code/i });
  const topmost = await link.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return hit === el || el.contains(hit);
  });
  expect(topmost).toBe(true);
});
