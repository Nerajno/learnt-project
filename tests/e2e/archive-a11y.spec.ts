import AxeBuilder from '@axe-core/playwright';
import { getCardProjects } from '../../src/data/projects';
import { test, expect } from './test';

const cardCount = getCardProjects().length;

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all card projects still render', async ({ page }) => {
    await page.goto('/learnt/?stage=composted');
    await expect(page.locator('#project-list article')).toHaveCount(cardCount);
  });
});

test('the category query filters the archive', async ({ page }) => {
  await page.goto('/learnt/?category=frontend');

  const visible = page.locator('#project-list article[data-slug]:not([hidden])');
  const count = await visible.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(cardCount);
  expect(await visible.evaluateAll((els) => els.every((el) => (el as HTMLElement).dataset.category === 'frontend'))).toBe(true);
});

test('keyboard-only: search and stage buttons work', async ({ page }) => {
  await page.goto('/learnt/');
  await page.getByRole('searchbox', { name: /search projects/i }).fill('rails');
  await page.locator('[data-stage-filter="shipped"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(/stage=shipped/);
  expect(await page.locator('#project-list article[data-slug]:not([hidden])').count()).toBeGreaterThan(0);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`no serious or critical axe violations in the archive UI (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/learnt/?stage=composted');
    const results = await new AxeBuilder({ page })
      .include('#archive-controls')
      .include('#archive-result')
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious).toEqual([]);
  });
}
