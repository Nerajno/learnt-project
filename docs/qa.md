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
| Reduced motion: no animation or transition, and no card lift | `qa.spec.ts` |
| Title, description, canonical, Open Graph and Twitter meta on every route | `qa.spec.ts` |
| Sitemap lists every page and project | `qa.spec.ts` |
| Every internal link resolves | `qa.spec.ts` |
| Theme follows the system preference, persists, and doesn't flash | `theme.spec.ts` |
| Visible focus, mobile menu, `aria-current` | `shell.spec.ts` |
| Archive without JS, keyboard filters, `aria-pressed` | `archive-a11y.spec.ts`, `timeline.spec.ts` |

Routes covered: `/`, `/learnt/`, `/learnt/?view=timeline`, a composted detail page, a shipped detail page, `/about/`, `/contact/`, `/contact/thanks/`, `/404.html`.

## Manual

### Keyboard only (no mouse)
- [ ] Filter the archive to Composted, 2024.
- [ ] Switch to the timeline and back.
- [ ] Open a project.
- [ ] Follow its successor, once #25 sets `supersededBy`.
- [ ] Submit the contact form.

### Screen readers
- [ ] **VoiceOver (Safari, macOS):** archive filters and one detail page.
  - The stage name is read.
  - The result count is announced.
  - Toggle states (stage, Grid/Timeline, theme) are read.
- [ ] **VoiceOver (iOS Safari):** the same.
- [ ] **NVDA (Firefox, Windows):** the same.

### Zoom
- [ ] 200% browser zoom: no content lost.
- [ ] 400% reflow at 1280px: no two-way scrolling.

### Browsers
- [ ] Latest Safari, Firefox and Chrome: a smoke test of every route.
- [ ] iOS Safari on a real phone: the theme toggle and the contact form.

### Lighthouse (deploy preview)
- [ ] Performance 95 or above.
- [ ] Accessibility 95 or above.
- [ ] SEO 100.

### Validators
- [ ] JSON-LD (validator.schema.org) on Home and one detail page.
- [ ] The RSS feed (`/rss.xml`) in the W3C feed validator.

### After launch
- [ ] Watch Microsoft Clarity for a week: rage clicks on the filters, and dead clicks on the chips.
