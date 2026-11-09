import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';

// Netlify only detects forms that are present in the static HTML, so check the
// served build output rather than the hydrated DOM.
test('static contact HTML carries the Netlify form contract', async ({ page }) => {
  const html = await (await page.request.get('/contact/')).text();
  const form = html.match(/<form[^>]*id="contact-form"[^>]*>/)?.[0] ?? '';
  expect(form).toContain('data-netlify="true"');
  expect(form).toContain('name="contact"');
  expect(form).toContain('netlify-honeypot="bot-field"');
  expect(form).toContain('action="/contact/thanks"');
  expect(form).not.toContain('/api/contact');
  expect(html).toMatch(/<input[^>]*type="hidden"[^>]*name="form-name"[^>]*value="contact"/);
  expect(html).toMatch(/name="bot-field"/);
});

test('inputs are labelled, typed, autocompleted and at least 48px tall', async ({ page }) => {
  await page.goto('/contact');
  const expected = {
    name: { type: 'text', autocomplete: 'name' },
    email: { type: 'email', autocomplete: 'email' },
    project: { type: 'text', autocomplete: 'off' },
  } as const;
  for (const [id, attrs] of Object.entries(expected)) {
    const input = page.locator(`#${id}`);
    await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
    await expect(input).toHaveAttribute('type', attrs.type);
    await expect(input).toHaveAttribute('autocomplete', attrs.autocomplete);
  }
  for (const id of ['name', 'email', 'topic', 'project', 'message']) {
    await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
    const box = await page.locator(`#${id}`).boundingBox();
    expect(box?.height ?? 0, `#${id} height`).toBeGreaterThanOrEqual(48);
  }
  for (const id of ['name', 'email', 'message']) {
    const hint = await page.locator(`#${id}`).getAttribute('aria-describedby');
    await expect(page.locator(`#${hint}`)).toBeVisible();
  }
});

test('empty submit is blocked by native validation on required fields', async ({ page }) => {
  await page.goto('/contact');
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  for (const id of ['name', 'email', 'message']) {
    const valid = await page.locator(`#${id}`).evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(valid, `#${id} should be invalid when empty`).toBe(false);
  }
});

test('an invalid email is rejected', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('#email', 'not-an-email');
  const typeMismatch = await page
    .locator('#email')
    .evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
  expect(typeMismatch).toBe(true);
});

test('?project= prefills the project field and topic', async ({ page }) => {
  await page.goto('/contact?project=side-project-status');
  await expect(page.locator('#project')).toHaveValue('side-project-status');
  await expect(page.locator('#topic')).toHaveValue('A project in the archive');
});

test('detail pages link to a prefilled contact form', async ({ page }) => {
  await page.goto('/learnt/side-project-status');
  const link = page.getByTestId('report-link');
  await expect(link).toHaveAttribute('href', '/contact?project=side-project-status');
});

test('thanks page focuses its heading and links back to the archive', async ({ page }) => {
  await page.goto('/contact/thanks');
  await expect(page.locator('#thanks-heading')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Back to the archive' })).toHaveAttribute('href', '/learnt');
});

for (const path of ['/contact', '/contact/thanks'] as const) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`no serious axe violations on ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await page.addStyleTag({
        content: '* { animation: none !important; transition: none !important; }',
      });
      const results = await new AxeBuilder({ page }).include('main').analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(serious).toEqual([]);
    });
  }
}

// #79: prefill round trip and edge cases.
test('report link on a detail page lands on a prefilled form', async ({ page }) => {
  await page.goto('/learnt/side-project-status');
  await page.getByTestId('report-link').click();
  await expect(page.locator('#project')).toHaveValue('side-project-status');
  await expect(page.locator('#topic')).toHaveValue('A project in the archive');
});

test('?project= is capped at 200 characters', async ({ page }) => {
  await page.goto(`/contact?project=${'x'.repeat(250)}`);
  await expect(page.locator('#project')).toHaveValue('x'.repeat(200));
});

test('?project= decodes encoded characters', async ({ page }) => {
  await page.goto('/contact?project=a%20b%26c%C3%A9');
  await expect(page.locator('#project')).toHaveValue('a b&cé');
});
