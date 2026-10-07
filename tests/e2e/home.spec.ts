import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const activeTitles = projects.filter((p) => p.phase === 'active').map((p) => p.title);

test.describe('home page', () => {
  test('Featured shows no active projects (#14)', async ({ page }) => {
    await page.goto('/');
    const featured = page.locator('section', {
      has: page.getByRole('heading', { name: 'Featured Projects' }),
    });
    await expect(featured.locator('article').first()).toBeVisible();
    const titles = (await featured.locator('article h3').allTextContents()).map((t) => t.trim());
    for (const title of activeTitles) {
      expect(titles).not.toContain(title);
    }
  });

  test('no card shows a made-up progress value (#10)', async ({ page }) => {
    await page.goto('/');
    expect(await page.content()).not.toContain('width: 75%');
  });
});
