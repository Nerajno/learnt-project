import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const trumma = projects.find((p) => p.slug === 'trumma-drum-machine')!;
const side = projects.find((p) => p.slug === 'side-project-status')!;

test('archive card and detail page show the same born date', async ({ page }) => {
  await page.goto('/learnt/');
  await expect(
    page.locator('article[data-slug="trumma-drum-machine"] time'),
  ).toHaveAttribute('datetime', trumma.born);

  await page.goto('/learnt/trumma-drum-machine/');
  await expect(page.locator(`time[datetime="${trumma.born}"]`).first()).toBeVisible();
});

test('duration is born to died and does not age with today', async ({ page }) => {
  await page.goto('/learnt/side-project-status/');
  await expect(page.locator(`time[datetime="${side.died}"]`).first()).toBeVisible();
  // 2025-04-15 -> 2025-06-01 = 47 days
  await expect(page.getByText('47 days', { exact: true })).toBeVisible();
});

test('visible dates match the stored calendar date', async ({ page }) => {
  await page.goto('/learnt/trumma-drum-machine/');
  await expect(page.locator(`time[datetime="${trumma.born}"]`).first()).toHaveText('August 15, 2024');

  await page.goto('/learnt/');
  await expect(page.locator('article[data-slug="trumma-drum-machine"] time')).toHaveText('Aug 2024');
  await expect(page.locator('article[data-slug="digital-garden"] time')).toHaveText('Sep 2025');
});

test('an open project shows no duration', async ({ page }) => {
  await page.goto('/learnt/portfolio-v3/');
  await expect(page.getByText('Duration', { exact: true })).toHaveCount(0);
});

test('project JSON-LD carries the born date', async ({ page }) => {
  await page.goto('/learnt/trumma-drum-machine/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(raw!).dateCreated).toBe(trumma.born);
});
