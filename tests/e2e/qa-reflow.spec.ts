import { test, expect } from './test';

// #47 (docs/qa.md "Zoom"): 200% zoom at 1280px ≈ a 640px viewport; 400% ≈ 320px (WCAG 1.4.10).
const ROUTES = ['/', '/learnt/', '/learnt/?view=timeline', '/learnt/side-project-status/', '/learnt/trumma-drum-machine/', '/about/', '/contact/', '/contact/thanks/', '/404.html'];

test.skip(({ isMobile }) => isMobile, 'viewport sweep runs once');

for (const [label, width] of [['200% zoom', 640], ['400% reflow', 320]] as const) {
  test(`${label} (${width}px): no horizontal scroll and nothing wider than the viewport`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 800 });
    const problems: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      const result = await page.evaluate(() => {
        const overflow = document.documentElement.scrollWidth - window.innerWidth;
        const wide = [...document.querySelectorAll('main *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            if (r.width === 0 || style.position === 'fixed') return false;
            if (el.closest('[style*="overflow"], pre, table, .overflow-x-auto')) return false;
            return r.right > window.innerWidth + 1 || r.left < -1;
          })
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 2).join('.')}`);
        return { overflow, wide };
      });
      if (result.overflow > 1) problems.push(`${route}: scrolls ${result.overflow}px sideways`);
      if (result.wide.length) problems.push(`${route}: ${result.wide.join(', ')}`);
    }
    expect(problems).toEqual([]);
  });
}
