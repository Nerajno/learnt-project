Part of #32 · Phase 3 (UI) · Blocked by {{TOKENS}}

## Scope

Restyle `src/layouts/Layout.astro` (header, mobile menu, footer) to match the mockup.

- **Wordmark:** `learnt/` in IBM Plex Mono, with the slash in `--accent-text`.
- **Nav:** Home, Archive, About, Contact, and `developingdvlpr.com ↗`. The current page gets `aria-current="page"` and a `--nav-hover` background.
- **Theme toggle:** keep the existing behaviour. Restyle it as a 44×44 bordered button showing a sun in dark mode and a moon in light mode. Change `aria-label` to "Toggle light mode" and set `aria-pressed`.
- **Footer:** `learnt/` wordmark and "Progress over perfection. © {year} Nerando Johnson". Links: Blog, Garden (`garden.developingdvlpr.com`), GitHub, LinkedIn, X, all from `src/data/site.ts`.
- **Remove the footer "Categories" column.** Its `?category=` links don't work on the static build (see {{FILTERS}}).
- **Fluid container:** `max-width: 1160px`, 24px side gutter. The menu collapses below 768px.

## Acceptance criteria

- [ ] Every tap target is at least 44px.
- [ ] Keyboard focus is visible on all nav items and the toggle, in both themes.
- [ ] No horizontal scroll at 360px width.

## Testing

- **End-to-end:**
  - each nav link goes to the right page, and that page's link has `aria-current="page"`;
  - the mobile menu opens and closes with click, `Enter` and `Escape`, and focus returns to the menu button;
  - the theme toggle's `aria-pressed` flips.
- **Keyboard:** Tab through the header and footer at 1280px and 360px. Every control is reachable, in a logical order, with a visible focus ring. Assert with `page.keyboard.press('Tab')` and `:focus-visible`.
- **Layout:** at 360px, assert `document.documentElement.scrollWidth <= 360`.
- **Target size:** measure the bounding boxes of the nav links, toggle and menu button; each is at least 44×44.
- **Accessibility:** axe on `/` in both themes. There is exactly one `<nav aria-label="Main">`.
- **Visual:** header and footer screenshots in both themes at both widths.

## Suggestions

- Add a "Skip to content" link as the first focusable element (it already exists; keep it and restyle it).
- Don't make the header sticky on mobile: it takes space from the archive cards. Sticky is fine on desktop.
- Mark external links (`developingdvlpr.com ↗`) with visually hidden text "(opens external site)" if they open in a new tab. Better still, don't open a new tab at all.
