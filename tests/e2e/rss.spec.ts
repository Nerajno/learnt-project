import { test, expect } from './test';
import { projects } from '../../src/data/projects';

// #29: every ended project (has `died`) is a burial; newest first.
const buried = projects.filter((p) => p.died).sort((a, b) => b.died!.localeCompare(a.died!));

test('rss.xml lists burials newest first, linking to each project', async ({ request }) => {
  test.skip(test.info().project.name !== 'desktop', 'static check');
  const res = await request.get('/rss.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toMatch(/^<\?xml/);
  const links = [...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map((m) => m[1]);
  expect(links).toEqual(buried.map((p) => `https://learnt.developingdvlpr.com/learnt/${p.slug}/`));
});

test('layout advertises the feed', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute('href', /\/rss\.xml$/);
});
