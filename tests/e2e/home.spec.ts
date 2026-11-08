import { projects } from '../../src/data/projects';
import { getStats } from '../../src/lib/projects';
import { test, expect } from './test';

const livingTitles = projects
  .filter((p) => p.stage === 'seed' || p.stage === 'sprout')
  .map((p) => p.title);

test.describe('home page', () => {
  test('Featured shows no active projects (#14)', async ({ page }) => {
    await page.goto('/');
    const featured = page.locator('section', {
      has: page.getByRole('heading', { name: 'Featured Projects' }),
    });
    await expect(featured.locator('article').first()).toBeVisible();
    const titles = (await featured.locator('article h3').allTextContents()).map((t) => t.trim());
    for (const title of livingTitles) {
      expect(titles).not.toContain(title);
    }
  });

  test('no card shows a made-up progress value (#10)', async ({ page }) => {
    await page.goto('/');
    expect(await page.content()).not.toContain('width: 75%');
  });

  test('the hero stats come from getStats()', async ({ page }) => {
    const stats = getStats();
    await page.goto('/');
    await expect(
      page.getByText(
        `${stats.total} projects · ${stats.byStage.shipped} shipped · ${stats.byStage.composted} composted`,
      ),
    ).toBeVisible();
  });
});
