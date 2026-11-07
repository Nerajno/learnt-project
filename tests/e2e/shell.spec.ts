import { site } from '../../src/data/site';
import { test, expect } from './test';

const routes = [
  ['/', 'Home'],
  ['/learnt/', 'Archive'],
  ['/learnt/trumma-drum-machine/', 'Archive'],
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
  await expect(button).toHaveAttribute('aria-label', 'Close menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toHaveAttribute('aria-label', 'Open menu');
  await expect(menu).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.locator('main').click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
});

test('tap targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const desktop = [
    ...(await page.locator('.nav-link').all()),
    page.locator('#theme-toggle'),
    ...(await page.locator('footer .social-link').all()),
    ...(await page.locator('footer .footer-link').all()),
  ];
  for (const target of desktop) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  await page.locator('#mobile-menu-toggle').click();
  const mobile = [
    ...(await page.locator('.mobile-nav-link').all()),
    page.locator('#theme-toggle'),
    page.locator('#mobile-menu-toggle'),
  ];
  for (const target of mobile) {
    const box = await target.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('keyboard focus is visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  const outline = () =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { id: el.id, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });

  // skip link -> wordmark -> Home nav link
  for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
  let style = await outline();
  expect(style.id).not.toBe('theme-toggle');
  expect(style.outlineStyle).not.toBe('none');
  expect(style.outlineWidth).not.toBe('0px');

  // Archive, About, Contact, external, toggle
  for (let i = 0; i < 5; i++) await page.keyboard.press('Tab');
  style = await outline();
  expect(style.id).toBe('theme-toggle');
  expect(style.outlineStyle).not.toBe('none');
  expect(style.outlineWidth).not.toBe('0px');
});

test('no horizontal overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
