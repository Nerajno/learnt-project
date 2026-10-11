import { projects } from '../../src/data/projects';
import { test, expect } from './test';

const active = projects.filter((p) => p.phase === 'active');

test('About lists every active project under "Currently building" (#14)', async ({ page }) => {
  await page.goto('/about/');
  const list = page.locator('h2:has-text("Currently building") ~ ul');
  await expect(list).toBeVisible();
  for (const project of active) {
    await expect(list.getByRole('link', { name: project.title, exact: true })).toHaveAttribute(
      'href',
      `/learnt/${project.slug}`,
    );
  }
});
