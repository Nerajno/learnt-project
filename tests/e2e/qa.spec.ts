import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';
import { projects } from '../../src/data/projects';

// #47: site-wide accessibility + QA pass. Manual items live in docs/qa.md.
const ROUTES = [
  '/',
  '/learnt/',
  '/learnt/?view=timeline',
  '/learnt/side-project-status/', // composted
  '/learnt/trumma-drum-machine/', // shipped
  '/about/',
  '/contact/',
  '/contact/thanks/',
  '/404.html',
] as const;

const desktopOnly = () => test.skip(test.info().project.name !== 'desktop', 'route sweep runs once');

for (const scheme of ['light', 'dark'] as const) {
  test(`no serious axe violations on any route (${scheme})`, async ({ page }) => {
    desktopOnly();
    test.setTimeout(120_000);
    await page.emulateMedia({ colorScheme: scheme });
    const found: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
      const { violations } = await new AxeBuilder({ page }).analyze();
      for (const v of violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')) {
        found.push(`${route} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      }
    }
    expect(found).toEqual([]);
  });
}

test('no horizontal scroll at 360, 768, 1024 and 1440px', async ({ page }) => {
  desktopOnly();
  test.setTimeout(120_000);
  const found: string[] = [];
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) found.push(`${route} @${width}: +${overflow}px`);
    }
  }
  expect(found).toEqual([]);
});

test('every interactive target in main is at least 24×24px (WCAG 2.5.8)', async ({ page }) => {
  desktopOnly();
  test.setTimeout(120_000);
  const found: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    const small = await page.locator('main').evaluate((main) => {
      const els = main.querySelectorAll<HTMLElement>('a[href], button, input:not([type=hidden]), select, textarea, summary');
      const targets = Array.from(els)
        .filter((el) => el.offsetParent !== null)
        // Links inside a sentence are exempt (2.5.8 "inline" exception).
        .filter((el) => !(el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p')))
        .map((el) => ({ el, r: el.getBoundingClientRect() }));
      // 2.5.8 spacing exception: an undersized target passes if a 24px box centred
      // on it doesn't intersect any other target.
      const hits = (a: DOMRect | { left: number; right: number; top: number; bottom: number }, b: DOMRect) =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      return targets
        .filter(({ r }) => r.width < 24 || r.height < 24)
        .filter(({ el, r }) => {
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const box = { left: cx - 12, right: cx + 12, top: cy - 12, bottom: cy + 12 };
          // Per-line boxes, so a link that wraps doesn't count as covering the whole paragraph.
          return targets.some(
            (o) => o.el !== el && !o.el.contains(el) && !el.contains(o.el) && Array.from(o.el.getClientRects()).some((b) => hits(box, b)),
          );
        })
        .map(({ el, r }) => `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    });
    for (const s of small) found.push(`${route} ${s}`);
  }
  expect(found).toEqual([]);
});

test('reduced motion: cards do not lift on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learnt/');
  const card = page.locator('#project-list article').first();
  await card.hover();
  const transform = await card.evaluate((el) => getComputedStyle(el).transform);
  expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
});

test('every route has title, description, canonical, Open Graph and Twitter meta', async ({ page }) => {
  desktopOnly();
  const found: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    const meta = await page.evaluate(() => {
      const q = (sel: string) => document.head.querySelector(sel)?.getAttribute('content') ?? document.head.querySelector(sel)?.getAttribute('href') ?? '';
      return {
        title: document.title,
        description: q('meta[name="description"]'),
        canonical: q('link[rel="canonical"]'),
        ogTitle: q('meta[property="og:title"]'),
        ogImage: q('meta[property="og:image"]'),
        twCard: q('meta[name="twitter:card"]'),
        twTitle: q('meta[name="twitter:title"]'),
      };
    });
    for (const [k, v] of Object.entries(meta)) if (!v) found.push(`${route} missing ${k}`);
  }
  expect(found).toEqual([]);
});

test('sitemap lists the main pages and every project', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const path of ['/', '/learnt/', '/about/', '/contact/']) expect(xml).toContain(`${path}</loc>`);
  for (const p of projects) expect(xml, p.slug).toContain(`/learnt/${p.slug}/</loc>`);
  expect(xml).not.toContain('/404');
  expect(xml).not.toContain('/contact/thanks');
});

test('every internal link resolves', async ({ page, request }) => {
  desktopOnly();
  test.setTimeout(180_000);
  const hrefs = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const links = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')!));
    for (const h of links) hrefs.add(h.split('#')[0]);
  }
  const broken: string[] = [];
  for (const href of hrefs) {
    if (!href) continue;
    const res = await request.get(href);
    if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
  }
  expect(broken).toEqual([]);
});

test('reduced motion: nothing on any route animates or transitions', async ({ page }) => {
  desktopOnly();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const found: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    const moving = await page.evaluate(() => {
      const secs = (v: string) => Math.max(...v.split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) / 1000 : parseFloat(x)) || 0));
      return Array.from(document.querySelectorAll<HTMLElement>('body *'))
        .filter((el) => {
          const s = getComputedStyle(el);
          return (s.animationName !== 'none' && secs(s.animationDuration) > 0.01) || secs(s.transitionDuration) > 0.01;
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')}`);
    });
    for (const m of moving) found.push(`${route} ${m}`);
  }
  expect(found).toEqual([]);
});
