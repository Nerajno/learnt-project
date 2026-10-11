# Learnt

Archive of past projects at [learnt.developingdvlpr.com](https://learnt.developingdvlpr.com). Astro 5 + Tailwind, static output.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the build locally |
| `npm test` | Component + unit tests (Vitest) |
| `npm run test:e2e` | Build, then end-to-end tests (Playwright, desktop + mobile) |

First e2e run: `npx playwright install chromium`.

## Tests

- `tests/unit/` — Vitest. Components render through Astro's Container API.
- `tests/e2e/` — Playwright against `astro preview`. Import `test`/`expect` from `tests/e2e/test.ts`, which blocks analytics.
- `tests/e2e/fixtures/slugs.json` — frozen list of project URLs. Edit only when deliberately adding or removing a project.
