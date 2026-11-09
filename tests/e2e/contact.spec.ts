import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './test';

type Page = import('@playwright/test').Page;

const SEND = '#contact-form button[type="submit"]';
const ARCHIVE = 'A project in the archive';

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
  // Every field Netlify should store is in the static HTML, project included.
  for (const name of ['name', 'email', 'topic', 'project', 'message']) {
    expect(html, `field ${name}`).toMatch(new RegExp(`name="${name}"`));
  }
});

test('inputs are labelled, typed, autocompleted and at least 48px tall', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('radio', { name: ARCHIVE }).check();
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
  for (const id of ['name', 'email', 'project', 'message']) {
    const box = await page.locator(`#${id}`).boundingBox();
    expect(box?.height ?? 0, `#${id} height`).toBeGreaterThanOrEqual(48);
  }
  for (const id of ['email', 'message']) {
    const hint = await page.locator(`#${id}`).getAttribute('aria-describedby');
    await expect(page.locator(`#${hint?.split(' ')[0]}`)).toBeVisible();
  }
});

test('topic is a group of four unchosen options', async ({ page }) => {
  await page.goto('/contact');
  const group = page.getByRole('group', { name: "What's it about?" });
  await expect(group.getByRole('radio')).toHaveCount(4);
  for (const radio of await group.getByRole('radio').all()) {
    await expect(radio).not.toBeChecked();
  }
  // Each option is a 44px+ tap target.
  for (const option of await group.locator('label').all()) {
    const box = await option.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test('project field appears only for the archive topic', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('#project')).toBeHidden();
  await page.getByRole('radio', { name: 'Collaboration' }).check();
  await expect(page.locator('#project')).toBeHidden();
  await page.getByRole('radio', { name: ARCHIVE }).check();
  await expect(page.locator('#project')).toBeVisible();
});

test('optional project is the only field marked, and hints are at least 12px', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByText('Required.', { exact: true })).toHaveCount(0);
  await page.getByRole('radio', { name: ARCHIVE }).check();
  await expect(page.locator('label[for="project"]')).toContainText('optional');
  for (const id of ['email-hint', 'message-hint', 'project-hint']) {
    const size = await page.locator(`#${id}`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, id).toBeGreaterThanOrEqual(12);
  }
});

test('empty submit shows a focused error summary and inline errors', async ({ page }) => {
  await page.goto('/contact');
  await page.locator(SEND).click();
  await expect(page).toHaveURL(/\/contact\/?$/);

  const summary = page.locator('#form-errors');
  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  await expect(summary.getByRole('link')).toHaveCount(4);

  for (const id of ['name', 'email', 'message']) {
    const field = page.locator(`#${id}`);
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    const valid = await field.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(valid, `#${id} should be invalid when empty`).toBe(false);
    const describedBy = (await field.getAttribute('aria-describedby')) ?? '';
    expect(describedBy).toContain(`${id}-error`);
    await expect(page.locator(`#${id}-error`)).toBeVisible();
  }
  await expect(page.locator('#topic-error')).toBeVisible();
});

test('summary links move focus to the field', async ({ page }) => {
  await page.goto('/contact');
  await page.locator(SEND).click();
  await page.locator('#form-errors').getByRole('link', { name: /email/i }).click();
  await expect(page.locator('#email')).toBeFocused();
});

test('an invalid email gets a specific message that clears once fixed', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('#email', 'not-an-email');
  const typeMismatch = await page
    .locator('#email')
    .evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
  expect(typeMismatch).toBe(true);
  await page.locator(SEND).click();
  await expect(page.locator('#email-error')).toContainText('@');
  await page.fill('#email', 'me@example.com');
  await expect(page.locator('#email-error')).toBeHidden();
  await expect(page.locator('#email')).not.toHaveAttribute('aria-invalid', 'true');
});

async function fillValid(page: Page) {
  await page.fill('#name', 'Ada');
  await page.fill('#email', 'ada@example.com');
  await page.getByRole('radio', { name: 'Collaboration' }).check();
  await page.fill('#message', 'Hello there.');
}

test('a valid note shows a sending state, then lands on the thanks page', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((r) => (release = r));
  await page.route('**/contact/thanks**', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    await held;
    await route.fulfill({ status: 200, body: 'ok' });
  });
  await page.goto('/contact');
  await fillValid(page);
  await page.locator(SEND).click();
  await expect(page.locator(SEND)).toBeDisabled();
  await expect(page.locator(SEND)).toHaveText(/Sending/);
  await expect(page.locator('#contact-form')).toHaveAttribute('aria-busy', 'true');
  release();
  await expect(page).toHaveURL(/\/contact\/thanks/);
});

test('a failed send keeps the note and says what to do', async ({ page }) => {
  await page.route('**/contact/thanks**', (route) =>
    route.request().method() === 'POST' ? route.fulfill({ status: 500, body: 'no' }) : route.continue(),
  );
  await page.goto('/contact');
  await fillValid(page);
  await page.locator(SEND).click();
  const failure = page.locator('#send-error');
  await expect(failure).toBeVisible();
  await expect(failure).toContainText(/try again/i);
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.locator('#message')).toHaveValue('Hello there.');
  await expect(page.locator(SEND)).toBeEnabled();
  await expect(page.locator(SEND)).toHaveText(/Send/);
});

test('?project= prefills the project, picks the archive topic and names it', async ({ page }) => {
  await page.goto('/contact?project=side-project-status');
  await expect(page.locator('#project')).toHaveValue('side-project-status');
  await expect(page.getByRole('radio', { name: ARCHIVE })).toBeChecked();
  const chip = page.locator('#project-chip');
  await expect(chip).toBeVisible();
  await expect(chip).toContainText('Side Project Status Tracker');
});

test('an unknown ?project= shows the text as given', async ({ page }) => {
  await page.goto('/contact?project=not-a-real-slug');
  await expect(page.locator('#project-chip')).toContainText('not-a-real-slug');
});

test('the prefilled project can be removed', async ({ page }) => {
  await page.goto('/contact?project=side-project-status');
  await page.getByRole('button', { name: /remove project/i }).click();
  await expect(page.locator('#project-chip')).toBeHidden();
  await expect(page.locator('#project')).toHaveValue('');
  await expect(page.locator('#project')).toBeVisible();
  await expect(page.locator('#project')).toBeFocused();
});

test('detail pages link to a prefilled contact form', async ({ page }) => {
  await page.goto('/learnt/side-project-status');
  const link = page.getByTestId('report-link');
  await expect(link).toHaveAttribute('href', '/contact?project=side-project-status');
});

test('elsewhere links read as links', async ({ page }) => {
  await page.goto('/contact');
  const links = page.getByRole('list', { name: 'Elsewhere' }).getByRole('link');
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    const line = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(line).toContain('underline');
    await expect(link).not.toHaveAttribute('rel', /noopener/);
  }
});

test('on a phone the form comes before the elsewhere links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');
  const form = await page.locator('#contact-form').boundingBox();
  const elsewhere = await page.getByRole('list', { name: 'Elsewhere' }).boundingBox();
  expect(form!.y).toBeLessThan(elsewhere!.y);
});

test('thanks page focuses its heading and links back to the archive', async ({ page }) => {
  await page.goto('/contact/thanks');
  await expect(page.locator('#thanks-heading')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Back to the archive' })).toHaveAttribute('href', '/learnt');
});

test('thanks page names the project the note was about', async ({ page }) => {
  await page.goto('/contact/thanks?project=side-project-status');
  await expect(page.locator('#thanks-project')).toContainText('Side Project Status Tracker');
  await expect(page.locator('#thanks-project').getByRole('link')).toHaveAttribute(
    'href',
    '/learnt/side-project-status',
  );
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

test('no serious axe violations with errors showing (light + dark)', async ({ page }) => {
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/contact?project=side-project-status');
    await page.locator(SEND).click();
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    const results = await new AxeBuilder({ page }).include('main').analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious, scheme).toEqual([]);
  }
});

// #79: prefill round trip and edge cases.
test('report link on a detail page lands on a prefilled form', async ({ page }) => {
  await page.goto('/learnt/side-project-status');
  await page.getByTestId('report-link').click();
  await expect(page.locator('#project')).toHaveValue('side-project-status');
  await expect(page.getByRole('radio', { name: ARCHIVE })).toBeChecked();
});

test('?project= is capped at 200 characters', async ({ page }) => {
  await page.goto(`/contact?project=${'x'.repeat(250)}`);
  await expect(page.locator('#project')).toHaveValue('x'.repeat(200));
});

test('?project= decodes encoded characters', async ({ page }) => {
  await page.goto('/contact?project=a%20b%26c%C3%A9');
  await expect(page.locator('#project')).toHaveValue('a b&cé');
});
