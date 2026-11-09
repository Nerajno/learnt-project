import { site } from '../../src/data/site';
import { test, expect } from './test';

const socials: [label: string, href: string][] = [
  ['GitHub', site.social.github.url],
  ['LinkedIn', site.social.linkedin.url],
  ['X (Twitter)', site.social.x.url],
];

for (const path of ['/', '/learnt/', '/about/', '/contact/']) {
  test(`footer on ${path} links to real profiles (#11, #13)`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator('footer');
    for (const [label, href] of socials) {
      const link = footer.locator(`a.social-link[aria-label="${label}"]`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
    await expect(footer.getByRole('link', { name: site.name })).toHaveAttribute('href', site.portfolio);
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
    expect(await page.content()).not.toContain('yourusername');
  });
}

// Short pages pin the footer to the bottom of the viewport; long pages push it below the content.
for (const size of [{ width: 1280, height: 1000 }, { width: 390, height: 844 }]) {
  test(`footer sits at the viewport bottom on a short page (${size.width}px)`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/contact/thanks');
    const box = await page.locator('footer').boundingBox();
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(docHeight).toBeLessThanOrEqual(size.height + 1);
    expect(Math.round(box!.y + box!.height)).toBeGreaterThanOrEqual(size.height - 1);
  });
}

test('footer follows the content on a long page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/learnt/');
  const main = await page.locator('main').boundingBox();
  const footer = await page.locator('footer').boundingBox();
  expect(footer!.y).toBeGreaterThanOrEqual(Math.floor(main!.y + main!.height));
  expect(footer!.y).toBeGreaterThan(1000);
});

test('favicon is the book, with PNG fallbacks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.locator('link[rel="icon"][type="image/png"]')).toHaveAttribute('href', '/favicon-32.png');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  const svg = await page.request.get('/favicon.svg');
  expect(svg.status()).toBe(200);
  const body = await svg.text();
  expect(body).toContain('<title>learnt</title>');
  expect(body).toContain('prefers-color-scheme: dark');
  for (const path of ['/favicon-32.png', '/apple-touch-icon.png']) {
    const res = await page.request.get(path);
    expect(res.status(), path).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});
