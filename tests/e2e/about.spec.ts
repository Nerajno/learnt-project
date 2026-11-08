import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const living = projects.filter((p) => p.stage === 'seed' || p.stage === 'sprout');

test('About lists every living project under "Currently building" (#14)', async ({ page }) => {
  await page.goto('/about/');
  const list = page.locator('h2:has-text("Currently building") ~ ul');
  await expect(list).toBeVisible();
  for (const project of living) {
    await expect(list.getByRole('link', { name: project.title, exact: true })).toHaveAttribute(
      'href',
      `/learnt/${project.slug}`,
    );
  }
});
