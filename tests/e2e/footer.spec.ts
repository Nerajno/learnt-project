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
