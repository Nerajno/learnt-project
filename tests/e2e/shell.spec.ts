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

test('theme toggle mirrors dark mode on load and click', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.locator('#theme-toggle');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');

  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
});

test('mobile menu opens, closes with Escape, and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const button = page.locator('#mobile-menu-toggle');
  const menu = page.locator('#mobile-menu');

  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();

  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
});

test('tap targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const targets = [
    ...(await page.locator('.nav-link').all()),
    page.locator('#theme-toggle'),
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  for (const target of [page.locator('#theme-toggle'), page.locator('#mobile-menu-toggle')]) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('keyboard focus is visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = getComputedStyle(el);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(outline.outlineStyle).not.toBe('none');
  expect(outline.outlineWidth).not.toBe('0px');
});

test('no horizontal overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
