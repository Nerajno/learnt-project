import AxeBuilder from '@axe-core/playwright';
import { ANALYTICS, test, expect } from './test';
import { projects } from '../../src/data/projects';

// #46: the detail page is composed from src/components/project/*.

test('composted project shows its epitaph line and composted wording', async ({ page }) => {
  await page.goto('/learnt/side-project-status/');
  await expect(page.locator('.lifeline')).toContainText('It was');
  await expect(page.getByRole('heading', { name: 'Composted' })).toBeVisible();
  await expect(page.getByText('Work on this project stopped on')).toBeVisible();
  // TODO(#25): supersededBy isn't set yet; assert the Successor banner and lineage once it is.
});

test('shipped project with a demo: no successor banner, has a demo link', async ({ page }) => {
  await page.goto('/learnt/trumma-drum-machine/');
  await expect(page.getByRole('complementary', { name: 'Successor' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Live demo' })).toBeVisible();
});

test('sparse sprout project renders no empty headings', async ({ page }) => {
  await page.goto('/learnt/github-profile/');
  const headings = page.locator('article h2');
  expect(await headings.count()).toBeGreaterThan(0);
  for (const h of await headings.all()) {
    const id = await h.getAttribute('id');
    expect(id, await h.innerText()).toBeTruthy();
    // Every heading labels a section that has content besides the heading itself.
    const body = page.locator(`[aria-labelledby="${id}"] > :not(h2)`);
    expect(await body.count(), id!).toBeGreaterThan(0);
    expect((await body.allInnerTexts()).join('').trim().length, id!).toBeGreaterThan(0);
  }
});

test('page is composed: breadcrumb, sidebar, pager, report link; no share buttons', async ({ page }) => {
  await page.goto('/learnt/trumma-drum-machine/');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Project details' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Project navigation' })).toBeVisible();
  await expect(page.getByTestId('report-link')).toHaveAttribute('href', '/contact?project=trumma-drum-machine');
  await expect(page.getByText('Share', { exact: true })).toHaveCount(0);
  await expect(page.locator('#nav-prev-btn')).toHaveCount(0);
  const trumma = projects.find((p) => p.slug === 'trumma-drum-machine')!;
  await expect(page.getByText(trumma.longDescription)).toBeVisible();
  await expect(page.getByText(trumma.features[0], { exact: true })).toBeVisible();
  // Safari drops list semantics under list-style:none unless role="list" is set.
  for (const list of await page.locator('article ul, article ol').all()) {
    await expect(list).toHaveAttribute('role', 'list');
  }
});

test('every project page: one h1, proof of work when finished, no console errors', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop', 'one pass is enough');
  test.setTimeout(120_000);
  const errors: string[] = [];
  // Analytics requests are aborted by ./test, so their load failures are expected noise.
  page.on('console', (m) => {
    const fromAnalytics = ANALYTICS.test(m.location().url) || /ERR_FAILED/.test(m.text());
    if (m.type() === 'error' && !fromAnalytics) errors.push(`${page.url()}: ${m.text()}`);
  });
  page.on('requestfailed', (r) => {
    if (!ANALYTICS.test(r.url())) errors.push(`${page.url()}: failed ${r.url()}`);
  });
  for (const p of projects) {
    await page.goto(`/learnt/${p.slug}/`);
    await expect(page.locator('h1'), p.slug).toHaveCount(1);
    const hasEvidence = Boolean(p.githubUrl || p.liveUrl || p.demoVideo);
    if ((p.stage === 'shipped' || p.stage === 'composted') && hasEvidence) {
      await expect(page.getByRole('heading', { name: 'Proof of work' }), p.slug).toHaveCount(1);
    }
  }
  expect(errors).toEqual([]);
});

test('no horizontal scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const slug of ['side-project-status', 'trumma-drum-machine', 'github-profile']) {
    await page.goto(`/learnt/${slug}/`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, slug).toBeLessThanOrEqual(0);
  }
});

for (const scheme of ['light', 'dark'] as const) {
  test(`detail page has no serious axe violations (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const slug of ['side-project-status', 'trumma-drum-machine']) {
      await page.goto(`/learnt/${slug}/`);
      await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
      const results = await new AxeBuilder({ page }).include('main').analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious, slug).toEqual([]);
    }
  });
}
