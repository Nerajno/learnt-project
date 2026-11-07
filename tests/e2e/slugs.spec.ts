import { readFileSync } from 'node:fs';
import { test, expect } from './test';

const slugs: string[] = JSON.parse(
  readFileSync(new URL('./fixtures/slugs.json', import.meta.url), 'utf8'),
);

test.describe('project detail URLs', () => {
  for (const slug of slugs) {
    test(`/learnt/${slug}/ renders`, async ({ page }) => {
      const response = await page.goto(`/learnt/${slug}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1').first()).not.toBeEmpty();
    });
  }

  test('unknown slug returns 404', async ({ page }) => {
    const response = await page.goto('/learnt/does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});
