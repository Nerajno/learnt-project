# QA checklist

Run this before every redesign or release. The automated checks run in CI; the manual ones need a person.

## Automated: `npm run typecheck && npx vitest run && npm run build && npx playwright test`

Each check, and the spec that covers it:

| Check | Spec |
|---|---|
| No serious or critical axe violations on any route, light and dark | `tests/e2e/qa.spec.ts` |
| No horizontal scroll at 360, 768, 1024 and 1440px | `qa.spec.ts` |
| Targets are 24px or larger, or properly spaced (WCAG 2.5.8) | `qa.spec.ts` |
| Nav targets are 44px or larger | `shell.spec.ts` |
| Reduced motion: CSS durations clamped, no card lift, in-page links jump instantly (delays and Web Animations are not checked) | `qa.spec.ts` |
| Title, description, canonical, Open Graph and Twitter meta on every route | `qa.spec.ts` |
| Sitemap lists every page and project | `qa.spec.ts` |
| Every internal link resolves | `qa.spec.ts` |
| Theme follows the system preference, persists, and doesn't flash | `theme.spec.ts` |
| Visible focus, mobile menu, `aria-current` | `shell.spec.ts` |
| Archive without JS, keyboard filters, `aria-pressed` | `archive-a11y.spec.ts`, `timeline.spec.ts` |
| Keyboard-only journeys: archive filter → timeline → project, contact send | `qa-keyboard.spec.ts` |
| 200% zoom (640px) and 400% reflow (320px): no sideways scroll, nothing wider than the viewport | `qa-reflow.spec.ts` |

Routes covered: `/`, `/learnt/`, `/learnt/?view=timeline`, a composted detail page, a shipped detail page, `/about/`, `/contact/`, `/contact/thanks/`, `/404.html`.

## Manual

### Keyboard only (no mouse)
- [x] Filter the archive to Composted, 2024. *(automated: `qa-keyboard.spec.ts`)*
- [x] Switch to the timeline and back. *(automated)*
- [x] Open a project. *(automated)*
- [ ] Follow its successor, once #25 sets `supersededBy` (#93).
- [x] Submit the contact form. *(automated with a mocked POST; a real send is still a manual check on the deploy)*

### Screen readers
- [ ] **VoiceOver (Safari, macOS):** archive filters and one detail page.
  - The stage name is read.
  - The result count is announced.
  - Toggle states (stage, Grid/Timeline, theme) are read.
- [ ] **VoiceOver (iOS Safari):** the same.
- [ ] **NVDA (Firefox, Windows):** the same.

### Zoom
- [ ] 200% browser zoom: no content lost. *(partly automated: `qa-reflow.spec.ts` proves no horizontal overflow at 640px; clipped, truncated or breakpoint-hidden content still needs a look with Cmd +)*
- [x] 400% reflow at 1280px: no two-way scrolling. *(automated as a 320px viewport)*

### Browsers
- [ ] Latest Safari, Firefox and Chrome: a smoke test of every route.
- [ ] iOS Safari on a real phone: the theme toggle and the contact form.

### Lighthouse (deploy preview)
- [ ] Performance 95 or above. *(local: fails on Home, 89)*
- [ ] Accessibility 95 or above. *(local: passes, 98–100)*
- [ ] SEO 100. *(local: passes, 100)*

Local run, 2026-11-17 (Lighthouse 12.2.1, `astro preview`, headless Chrome, mobile preset). These are local results only: tick each item after the same run on the deploy preview.

| Route | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 89 | 100 | 79 | 100 |
| `/learnt/` | 98 | 98 | 79 | 100 |
| `/learnt/side-project-status/` | 100 | 100 | 79 | 100 |
| `/contact/` | 100 | 100 | 79 | 100 |

Findings:
- **Microsoft Clarity** costs every page: best practices 79 (8 third-party cookies from `clarity.ms` / `bing.com`), plus 4 preconnect misses and a short cache TTL on `clarity.js`. It's also most of Home's 3.6s LCP.
- **`/learnt/` heading order:** card titles are `<h3>` with no `<h2>` above them (axe "moderate", so the serious-only sweeps above don't catch it).

### Validators
- [ ] JSON-LD (validator.schema.org) on Home and one detail page.
- [ ] The RSS feed (`/rss.xml`) in the W3C feed validator.

### After launch
- [ ] Watch Microsoft Clarity for a week: rage clicks on the filters, and dead clicks on the chips.
