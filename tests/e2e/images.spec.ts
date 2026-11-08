import { test, expect } from './test';

const pages = ['/', '/learnt', '/learnt/trumma-drum-machine', '/learnt/trapper-keeper-v1'];

for (const path of pages) {
  test(`no broken images on ${path}`, async ({ page }) => {
    const failures: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400) failures.push(`${res.status()} ${res.url()}`);
    });

    await page.goto(path);

    // Scroll each image into view so native `loading="lazy"` images actually load,
    // then wait until every img is complete. A single scroll-to-bottom jump misses
    // images in the middle of a long page.
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await images.nth(i).scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete)
    );

    // Every real image must have loaded and carry alt text.
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }

    // With no screenshots captured yet, every project image is a designed placeholder.
    // Home (#45) has no project images, so only pages with cards or a hero shot are checked.
    if (path !== '/') {
      expect(await page.locator('[data-placeholder="true"]').count()).toBeGreaterThan(0);
    }

    // The OG asset must exist in THIS build, not just on the deployed site.
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toBeTruthy();
    const ogPath = new URL(og!, page.url()).pathname;
    const ogResponse = await page.request.get(ogPath);
    expect(ogResponse.ok()).toBe(true);

    expect(failures).toEqual([]);
  });
}
