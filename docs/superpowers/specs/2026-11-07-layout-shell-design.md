# Layout shell — design (issue #41)

## Intent

Restyle the header, navigation, theme toggle, and footer on the dvlpr-dialects
`learn` spine (#38). This is the shell only: no page bodies, no content, no
`stage`.

## Authority: the issue body uses the old token names

#41 says "IBM Plex Mono", `--accent-text`, and `--nav-hover`. Those belong to the
superseded #38 table. The spine uses **JetBrains Mono**, **`--accent`**, and
`--bg-alt`/`--bg-card`. This design follows the spine, as the epic requires.

## Goals

- `learnt/` wordmark in mono, slash in `--accent`, in header and footer.
- Main nav: Home, Archive, About, Contact, `developingdvlpr.com ↗`.
  The current route gets `aria-current="page"` and an `--bg-alt` background.
- Theme toggle: 44×44 bordered control, sun in dark / moon in light,
  `aria-pressed` mirrors dark mode, and the label describes the next action.
- Footer: wordmark, "Progress over perfection. © {year} Nerando Johnson",
  and Blog / Garden / GitHub / LinkedIn / X. Remove Quick Links and Categories.
- Fluid 1160px container with a 24px gutter; the nav collapses below 768px.
- 44px tap targets, visible focus, no horizontal scroll at 360px.
- Keep the footer's existing contracts: `social-link` class, aria-labels, the
  `site.name` link to the portfolio, and the © year.

## Non-goals

- Restyling page bodies, cards, chips, or the archive controls (#19/#40/#45/#46).
- Changing theme mechanics or the token layer (#38).
- Adding a Blog page; the footer links out.
- Making the header sticky on mobile.

## Constraints

- Astro 5, static output; no new dependencies.
- The shell is one file (`Layout.astro`); do not extract components in this
  ticket.
- `Layout.astro` currently imports `global.css` twice (frontmatter and a
  `<style>@import`); keep the frontmatter import and remove the duplicate.
- External links open in the same tab (the issue's suggestion) — no
  `target="_blank"` and no "opens external site" hidden text.
- `site.ts` gains `blog` and `garden`; both URLs return 200:
  `https://developingdvlpr.com/blog`, `https://garden.developingdvlpr.com/`.
- The nav's "Archive" points at `/learnt` and is current on every `/learnt*`
  path.

## Approaches

- **A. Rebuild the shell markup in place (chosen).** Meets the wordmark, nav,
  footer, toggle, and mobile-menu spec with the existing file and script.
- **B. Token swap only.** Keeps the current multi-column footer and icon
  wordmark; fails the layout and content spec.
- **C. Extract Header/Footer components.** Cleaner long term but a larger
  refactor than the ticket asks for.

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ learnt/    Home  Archive  About  Contact   dev… ↗   [☾] [☰] │
├──────────────────────────────────────────────────────────────┤
│ page                                                         │
├──────────────────────────────────────────────────────────────┤
│ learnt/                                  Blog Garden GitHub… │
│ Progress over perfection. © 2026 Nerando Johnson             │
└──────────────────────────────────────────────────────────────┘
```

- Header `nav aria-label="Main"`, `static md:sticky md:top-0`, surface and
  hairline border. Exactly one nav landmark.
- Nav links `min-h-11 inline-flex items-center`, current route:
  `aria-current="page"` + `bg-surface-alt text-accent`.
- Theme toggle `w-11 h-11`, border `--border-strong`, surface card, focus ring.
  Sun/moon stay CSS-driven by the `.dark` class; the label and `aria-pressed`
  are synced by the existing toggle script on load and after each click.
- Mobile menu: button `aria-expanded`/`aria-controls="mobile-menu"`; opens on
  click or Enter; Escape closes and returns focus to the button; outside click
  closes; the first menu link receives focus on open.
- Footer: wordmark and tagline on the left; text links on the right. The social
  links keep `social-link` + aria-labels for the existing footer test. The name
  in the copyright line links to `site.portfolio`.

## Copy

- Wordmark: `learnt/`
- Tagline: `Progress over perfection.`
- Copyright: `© {year} Nerando Johnson`
- Toggle labels: `Switch to light mode` / `Switch to dark mode`
- External: `developingdvlpr.com ↗`

## Testing

### E2E — `tests/e2e/shell.spec.ts`

- `/`, `/learnt/`, `/about/`, `/contact/`: the matching nav link has
  `aria-current="page"` and no other link does.
- Exactly one `nav[aria-label="Main"]`.
- Nav labels are Home / Archive / About / Contact; the external link is
  `site.portfolio` with no `target="_blank"`.
- Footer: Blog/Garden/GitHub/LinkedIn/X hrefs, no Categories column, the © year,
  and the `site.name` portfolio link.
- Theme toggle: `aria-pressed` and label flip on click; reload keeps them.
- Mobile menu at 360px: `aria-expanded` false → true; Escape closes, returns
  focus, and sets `aria-expanded=false`; outside click closes; Enter opens.
- Tap targets: every nav link, the toggle, and the menu button are ≥44×44.
- Focus: Tab to a nav link and assert a non-zero outline (`:focus-visible`).
- Overflow: `scrollWidth <= clientWidth` at 360px on `/` and `/learnt/`.
- axe on `/` in both themes, scoped to `nav`, `footer`, and the skip link.

### Existing tests

- `tests/e2e/theme.spec.ts` (toggle, axe shell) and
  `tests/e2e/footer.spec.ts` (socials, © year, name link) must stay green.
- The visually hidden skip link remains the first focusable element.

### Visual

Capture header/footer screenshots at 1280px and 360px, light and dark, and
inspect them before shipping.

## Risks

- **Footer test expectations.** Keep `social-link`, aria-labels, the name link,
  and the © year or update `footer.spec.ts` deliberately.
- **Toggle semantics.** `aria-pressed` = dark mode; the label states the next
  action. Keep both in sync on load, not only on click.
- **Density.** 0.875× shrinks the 44px targets; use fixed `w-11`/`min-h-11`
  (2.75rem at 14px root = 38.5px?) — verify the computed boxes are ≥44px and
  use `min-h-[44px]`/`min-w-[44px]` where rem rounding falls short.
- **Sticky header.** `static md:sticky` avoids stealing viewport on mobile.
- **Focus return.** Escape must return focus to the menu button, not the body.
