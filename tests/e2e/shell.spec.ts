import { site } from '../../src/data/site';
import { test, expect } from './test';

const routes = [
  ['/', 'Home'],
  ['/learnt/', 'Archive'],
  ['/about/', 'About'],
  ['/contact/', 'Contact'],
] as const;

for (const [path, label] of routes) {
  test(`${label} is current on ${path}`, async ({ page }) => {
    await page.goto(path);
    const nav = page.locator('nav[aria-label="Main"]');
    await expect(nav).toHaveCount(1);
    // Desktop and mobile share the label; assert each rendered group once.
    await expect(nav.locator('.nav-link[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('.nav-link[aria-current="page"]')).toHaveText(label);
    await expect(nav.locator('.mobile-nav-link[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('.mobile-nav-link[aria-current="page"]')).toHaveText(label);
  });
}

test('nav has the new labels and the external portfolio link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main"]');
  for (const label of ['Home', 'Archive', 'About', 'Contact']) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  const external = nav.getByRole('link', { name: /developingdvlpr\.com/ });
  await expect(external).toHaveAttribute('href', site.portfolio);
  await expect(external).not.toHaveAttribute('target', '_blank');
});

test('footer has the new links and no categories column', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('href', site.blog);
  await expect(footer.getByRole('link', { name: 'Garden', exact: true })).toHaveAttribute('href', site.garden);
  await expect(footer.getByRole('heading', { name: 'Categories' })).toHaveCount(0);
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  await expect(footer.getByRole('link', { name: site.name })).toHaveAttribute('href', site.portfolio);
});
