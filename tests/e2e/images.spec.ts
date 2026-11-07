import { test, expect } from '@playwright/test';

const pages = ['/', '/learnt', '/learnt/trumma-drum-machine', '/learnt/trapper-keeper-v1'];

for (const path of pages) {
  test(`no broken images on ${path}`, async ({ page }) => {
    const failures: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
    });

    await page.goto(path);

    // Load lazy images: scroll to the bottom, then wait until every img is complete.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete)
    );

    // Every real image must have loaded and carry alt text.
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }

    // With no screenshots captured yet, every project image is a designed placeholder.
    expect(await page.locator('[data-placeholder="true"]').count()).toBeGreaterThan(0);

    // No request on the page may 404, including images and the OG asset.
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toBeTruthy();
    const ogResponse = await page.request.get(new URL(og!, page.url()).toString());
    expect(ogResponse.ok()).toBe(true);

    expect(failures).toEqual([]);
  });
}
