# Garden ledger: dvlpr-dialects tokens + theme — design (issue #38)

## Intent

Put the whole site on the **dvlpr-dialects v0.1.0** token spine, on the `learn`
surface: JetBrains Mono at 0.875× density, ochre accent (hue 72), light and dark
themes. This is the visual foundation #40, #41, #45, and #46 build on.

## Authority: the issue body is stale

#38 still lists the green palette (`#B8D46A`), Space Grotesk, IBM Plex, and
token names like `--surface`/`--line`. Epic #32 says that world is superseded —
"#38 carries the token mapping to the spine." The pinned package confirms the
current world:

- `@nerajno/dialects@0.1.0` from `github:Nerajno/dvlpr-dialects#v0.1.0`
  (local source: `/Users/nerandojohnson/Documents/Dev/Projects/Portfolio_Pieces/dvlpr-dialects`, tag `v0.1.0`).
- `learn` dials: `--dial-font: mono`, `--dial-type-scale: 0.875`,
  `--dial-accent-hue: 72`, chroma `0.1`, light `0.48`.
- Token names: `--bg`, `--bg-alt`, `--bg-card`, `--bg-elevated`,
  `--text-strong/body/soft/muted`, `--border`, `--border-strong`, `--accent`,
  `--accent-hover`, `--accent-soft`, `--focus`, plus status/radius/shadow/motion.
- Ships `tokens.css`, `utilities.css`, `fonts.css`, `theme-init.js`, and a
  Tailwind preset.

This design follows the spine. #38's body should be updated to match before the
PR, so the ticket and the code agree.

## Goals

- Install the spine; import `tokens.css` and JetBrains Mono (400/500/700 only).
- Add the Tailwind preset; remove the blue `primary` scale and the `safelist`.
- Set `data-surface="learn"` on `<html>`; inline `theme-init.js` before paint;
  support system preference, saved choice, `.light`/`.dark`, and `data-theme`.
- Move the base and shared component classes in `global.css` onto tokens.
- Replace every `primary-*` utility with a semantic token class.
- Remove raw hex from `src`: tokenize the index hero gradient and delete the
  unused `Welcome.astro`.
- Guard the token contrast, theme behavior, and the no-hex/no-primary rules.

## Non-goals

- Redesigning the shell (#41), Home (#45), detail page (#46), cards (#19), or
  chips (#40). Those tickets move page-specific `gray-*` surfaces onto tokens;
  #38 deliberately leaves them.
- Content, schema, or filtering work.
- A `DESIGN.md`/`PRODUCT.md` capture (the pinned package is the source of truth
  for this slice).

## Constraints

- Astro 5.13, Tailwind 3.4, static output; no runtime framework.
- The preset is CommonJS; the ESM Tailwind config loads it as a default import.
- The spine's `--accent` is a *fill* colour; there is no `--on-accent` token.
  Accent-filled controls use `text-surface` (`var(--bg)`) so the text inverts
  correctly with the theme.
- `--accent-soft` is fill-only in dark mode (the README says it does not hold
  body text there); never put body text on it.
- The 0.875× density shrinks every rem. Verify 360/768/1280 before shipping.
- The page-specific `gray-*` classes stay for now; the site is intentionally in
  a transitional mix until #41/#45/#46 land.
- Keep `scroll-smooth`; keep the theme toggle control in the shell (its behavior
  changes, its placement does not).

## Approaches

- **A. Foundation slice (chosen).** Tokens, fonts, preset, theme init, shared
  class layer, and `primary` replacement. Page surfaces follow in their tickets.
- **B. Full semantic sweep now.** Also rewrite every `gray-*` surface across 12
  files. Overlaps #41/#45/#46 and doubles the churn.
- **C. Build #38's stale green/Space Grotesk table.** Contradicts the epic and
  creates throwaway work.

## Primary → token mapping

| Current | Replacement |
| ------- | ----------- |
| `text-primary-600 dark:text-primary-400` (links, logo, stats) | `text-accent` |
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent-hover` |
| `text-primary-700 dark:hover:text-primary-300` | `hover:text-accent-hover` |
| `bg-primary-600`, `border-primary-600` | `bg-accent`, `border-accent` |
| `hover:bg-primary-700`, `hover:border-primary-700` | `hover:bg-accent-hover`, `hover:border-accent` |
| `ring-primary-500`, `focus:ring-primary-500`, `focus-within:ring-primary-500` | `ring-accent` variants |
| `ring-primary-200 dark:ring-primary-800` (featured card) | `ring-accent` |
| `bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300` (badges) | `bg-accent text-surface` |
| `bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100` (selection) | `background: var(--accent); color: var(--bg)` |
| `border-t-primary-600` (spinner) | `border-t-accent` |
| `from-primary-600 to-purple-600 bg-clip-text text-transparent` (gradient text) | `color: var(--accent)` |
| `from-primary-50 to-purple-50 ...` (archive hero) | `bg-surface-alt` |
| `text-white` on an accent fill | `text-surface` |
| `ring-offset-white dark:ring-offset-gray-900` | `ring-offset-surface` |

Where a class appears with a `dark:` counterpart for the same role, the token
replaces both. Leave non-colour utilities (sizes, spacing, radius) untouched.

## Theme

- `<html lang="en" class="scroll-smooth" data-surface="learn">` so no-JS still
  gets the learn dials (light tokens until JS chooses a theme).
- Replace the existing head script with the package's `theme-init.js?raw`,
  inlined with `data-surface="learn"`; it sets `.light`/`.dark`, `data-theme`,
  and `data-surface` before first paint.
- Update the toggle to swap `.dark`/`.light`, set `data-theme`, and persist the
  same `theme` key. Keep the control's accessible name.
- Add `:root.light { color-scheme: light }` and `:root.dark { color-scheme: dark }`.

## Fonts

- Import `@fontsource/jetbrains-mono/400.css`, `500.css`, `700.css` only. On the
  learn surface `--font-body` and `--font-heading` both resolve to mono, so
  Jakarta and Fraunces are never used; the package still installs them as
  transitive deps.
- Remove the Google Fonts `@import` and the Inter/JetBrains `fontFamily` entries
  (the preset supplies `font-sans`/`font-display`/`font-mono` from the spine).

## Shared layer

`global.css` base and components move to tokens:

- body: `background: var(--bg); color: var(--text-body); font-family: var(--font-body)`.
- headings: `font-family: var(--font-heading); color: var(--text-strong)`.
- links: `var(--accent)` / `var(--accent-hover)`.
- focus: `outline: 2px solid var(--focus)` with `var(--bg)` offset.
- selection: accent fill with `var(--bg)` text.
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card*`, `.badge*`,
  `.input`, `.loading-spinner`, `.gradient-text`, footer/nav shared styles.
- `gray-*` in page markup is left for #41/#45/#46, except inside these shared
  classes.

## Raw hex

- Delete `src/components/Welcome.astro` (210 lines, imported nowhere).
- `src/pages/index.astro` hero: `linear-gradient(135deg, var(--bg-alt), var(--bg-card))`
  and drop the `.dark .hero` override.
- After the sweep, no `#rrggbb` remains under `src/`.

## Testing

### Unit — `tests/tokens.test.ts`

- Read the installed `@nerajno/dialects/tokens.css`.
- Parse the `learn` dials and the light/dark values of `--bg`, `--bg-alt`,
  `--bg-card`, `--text-strong`, `--text-body`, `--text-soft`, `--text-muted`,
  `--accent`, `--border-strong`.
- Convert OKLCH to sRGB with a small helper, compute WCAG contrast, and assert:
  every text token ≥ 4.5:1 on the three grounds; `--accent` ≥ 4.5:1 on the three
  grounds; `--border-strong` ≥ 3:1 on the three grounds.
- Scan `src/**/*.{astro,css,ts}` for `#[0-9a-fA-F]{3,6}` and `primary-`, and
  assert no matches.
- Assert `tailwind.config.mjs` has no `safelist` and no `primary` scale.

### E2E — `tests/e2e/theme.spec.ts`

- `/` with `colorScheme: 'dark'`: `html` has `.dark`, `data-theme="dark"`,
  `data-surface="learn"`.
- Toggle to light: `.light` + `data-theme="light"`; reload keeps it.
- Clear storage, emulate light/dark, reload: follows the system.
- First-paint check: `goto(..., { waitUntil: 'commit' })` then read
  `document.documentElement.className` — the inline head script must already
  have applied the saved/system theme.
- axe on `/` and `/learnt` in both themes: no serious/critical violations in
  the shared shell and base text. If page-specific pre-existing issues surface,
  record them for #47 and scope the assertion to `body`, `nav`, `footer`,
  `.btn`, and headings.

### Gate

- `npm test`, `npm run build`, `npm run test:e2e`.

## Risks

- **Transitional mix.** Gray page surfaces + token shell will look half-migrated
  until #41/#45/#46. This is deliberate; do not expand #38 to fix it.
- **Density.** 0.875× can cause wrapping or overflow; verify 360/768/1280 and
  the archive grid.
- **GitHub install.** `npm i github:Nerajno/dvlpr-dialects#v0.1.0` pulls three
  fontsource packages; the lockfile grows. If the install fails, fall back to
  vendoring the five package files and recording the source tag.
- **Accent contrast.** Text on accent fills uses `var(--bg)`; verify in both
  themes (the unit test covers accent-on-ground, not the inverse).
- **CJS preset in an ESM config.** Import the default export; if Tailwind can't
  load it, rename the config to `.cjs` and use `require`.
- **Missed primary usage.** The grep test and a full build catch it.
- **Stale issue body.** Update #38 (or the PR description) to the spine before
  merging.

## Files touched

- `package.json`, `package-lock.json`
- `tailwind.config.mjs`
- `src/styles/global.css`
- `src/layouts/Layout.astro`
- `src/pages/index.astro`
- `src/pages/learnt.astro`
- `src/components/ProjectCard.astro`
- `src/components/SearchBar.astro`
- delete `src/components/Welcome.astro`
- `tests/tokens.test.ts` (new)
- `tests/e2e/theme.spec.ts` (new)
