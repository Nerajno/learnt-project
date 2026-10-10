Part of {{EPIC}}

## Why

The repo has no tests and no CI: `package.json` only defines `dev`, `build` and `preview`. Every other issue in this epic has testing criteria, and they need somewhere to run. Do this first, alongside {{TOKENS}} and {{DATA}}.

## Scope

- **Vitest** for unit tests: data helpers, schema rules and filter logic. Script: `npm run test`.
- **Playwright** for end-to-end tests against `astro preview`. Projects: Chromium desktop (1280px) and mobile (360px), each in light and dark. Dark is set with `page.emulateMedia({ colorScheme: 'dark' })`. Script: `npm run test:e2e`.
- **`@axe-core/playwright`** for automated accessibility checks, with an `expectNoA11yViolations(page)` helper that fails on serious or critical issues.
- **Playwright screenshot tests** (`toHaveScreenshot`) for each page in each theme. Baselines are committed; update them on purpose with `--update-snapshots`.
- **`astro check`** for type checking. Script: `npm run check`.
- **GitHub Action** `.github/workflows/ci.yml`, on every PR: `npm ci`, then check, then test, then build, then e2e. Upload the Playwright report as an artifact.
- **Netlify deploy previews** on PRs (if not already on), so form submissions and redirects can be checked on a real deploy.

## Acceptance criteria

- [ ] `npm run check`, `npm run test`, `npm run build` and `npm run test:e2e` all run locally and in CI.
- [ ] One example test of each kind exists: a unit test, an e2e smoke test that loads all pages, an axe scan, and a screenshot test.
- [ ] A failing test blocks the PR (set up a branch protection rule on `main`).

## Testing

- Open a throwaway PR that breaks a test on purpose, and confirm CI goes red and blocks the merge.
- Confirm the Playwright HTML report is attached to the CI run.

## Suggestions

- Pin the Playwright browser version in CI. Screenshot diffs from a font or browser update are noise.
- Keep screenshot tests to one per page per theme. Many small ones get flaky fast.
- Add Lighthouse CI (`@lhci/cli`) here or in the QA issue ({{QA}}), with budgets such as Performance ≥ 95 and Accessibility ≥ 95.
