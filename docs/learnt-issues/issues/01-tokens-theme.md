Part of {{EPIC}}

## Why

The current site uses Tailwind gray plus `primary` blue, styled through `dark:` variants. The Garden ledger needs one set of semantic tokens that both themes share, so components never hard-code a colour.

## Scope

- **Define tokens in `src/styles/global.css`** as CSS custom properties on `:root` (light) and `.dark` (dark). The existing `darkMode: 'class'` setup stays.

  | Token | Dark | Light |
  |---|---|---|
  | `--bg` | `#0F1512` | `#F6F7F2` |
  | `--surface` | `#141C17` | `#FFFFFF` |
  | `--surface-2` | `#121A15` | `#EEF1E8` |
  | `--line` | `#243029` | `#DDE3D6` |
  | `--line-2` | `#3A4A40` | `#C3CCBC` |
  | `--text` | `#E8EDE6` | `#1C2620` |
  | `--strong` | `#F1F4EE` | `#0F1512` |
  | `--muted` | `#A9B5AA` | `#4F5C52` |
  | `--faint` | `#8A968C` | `#5E6B61` |
  | `--soft` | `#C7D1C6` | `#33403A` |
  | `--nav-hover` | `#18211C` | `#E9EDE3` |
  | `--accent` (chip/button fill) | `#B8D46A` | `#B8D46A` |
  | `--accent-text` | `#B8D46A` | `#4A6B12` |
  | `--on-accent` | `#0F1512` | `#0F1512` |
  | `--link` / `--link-hover` | `#C9E07F` / `#E2F0B0` | `#3F6212` / `#2D4A0B` |
  | `--teal` (Shipped fill) | `#7CC4B8` | `#7CC4B8` |
  | `--teal-text` | `#7CC4B8` | `#1F7A6E` |
  | `--amber` (Composted fill) | `#D9A35B` | `#D9A35B` |
  | `--amber-text` | `#D9A35B` | `#9A5B12` |
  | `--compost-bg` / `--compost-line` / `--compost-text` | `#17140F` / `#3A3023` / `#E8D6B8` | `#FBF3E6` / `#E9D3B0` / `#5C3D12` |
  | `--seed-dash` | `#6E7D72` | `#7A867D` |
  | `--bar` (year-trail fill) | `#B8D46A` | `#6B8F1F` |

- **Map the tokens into `tailwind.config.mjs`** (`colors: { bg: 'var(--bg)', … }`). Remove the `primary` blue scale and the `safelist`.
- **Fonts.** Load Space Grotesk (display, 500–700), IBM Plex Sans (body, 400–600) and IBM Plex Mono (metadata, 400–500) in `Layout.astro`. Self-host them with `@fontsource` or keep Google Fonts with `display=swap`. Replace the Inter and JetBrains Mono `fontFamily` entries.
- **Theme behaviour.** Keep the existing inline head script: system preference first, then `localStorage`. Make sure it runs before first paint so there's no flash of the wrong theme.

## Acceptance criteria

- [ ] No raw hex values remain in components or pages; everything uses tokens.
- [ ] Body and muted text meet 4.5:1 contrast in both themes; large text and UI borders meet 3:1. Check with a contrast tool and record the results in the PR.
- [ ] Toggling the theme causes no layout shift and no flash on reload.
- [ ] The `primary` colour scale and the old fonts are removed.

## Testing

- **Unit:** a Vitest test that parses `global.css`, reads each text/background token pair in both themes (`--text`/`--bg`, `--muted`/`--bg`, `--muted`/`--surface`, `--faint`/`--bg`, `--link`/`--bg`, `--accent-text`/`--bg`, `--amber-text`/`--compost-bg`, `--on-accent` on each chip fill), and checks contrast with a small WCAG luminance function. Body pairs must reach 4.5:1 or above.
- **End-to-end:**
  - load `/` with `colorScheme: 'light'` and `'dark'` and check that the `dark` class is on `<html>` only in dark;
  - click the toggle, reload, and check the choice persisted;
  - clear `localStorage`, set the system scheme, and check it's followed.
- **No flash:** a Playwright test that captures the first paint (`page.screenshot` straight after `goto` with `waitUntil: 'commit'`) and checks the background colour matches the stored theme.
- **Lint:** grep in CI for `#[0-9a-fA-F]{3,6}` in `src/components` and `src/pages`; it should find nothing.

## Suggestions

- Name tokens by role (`--text-muted`), not by colour (`--green-500`). The light theme then only redefines values.
- Add `color-scheme: light dark` on `:root`, so scrollbars and form controls follow the theme.
- Self-host fonts with `@fontsource/*` and preload only the display weight. It avoids a third-party request and improves LCP.
- Consider one more tweak later: a slightly warmer light background (`#F7F6F0`) if `#F6F7F2` reads too cool next to the green.
