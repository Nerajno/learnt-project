Part of #32 · Phase 1 (fixes) · Related: #12, #27

## Bug

All 43 `screenshot` / `gallery` paths in `src/data/projects.ts` point to `/images/screenshots/*.png`, but `public/images/` only contains three placeholder files. **Every project image on the live site is broken.**

## Scope

- Capture screenshots for each project: from the live demo where one exists, otherwise from the repo README or a local run. Save them in `src/assets/screenshots/{slug}.png` and render them with Astro `<Image>` so they're optimised (WebP/AVIF, sized).
- Projects with nothing to capture get a designed placeholder: a `--surface` box with a dashed `--line-2` border showing the repo name in mono. Not the stock placeholder image.
- Write real alt text for each image (what the screen shows), stored in the content entry.
- Generate per-project OG images (`og:image` currently points every project at its missing screenshot).

## Acceptance criteria

- [ ] No 404s for images on any page; check with a link checker.
- [ ] Every image has meaningful alt text, or `alt=""` if it's decorative.

## Testing

- **Build-time check:** a schema rule or a Vitest test asserting that every `screenshot` path resolves to a real file in `src/assets/screenshots/`. The build fails on a missing file.
- **End-to-end:** on Home, the Archive and every detail page, collect `<img>` elements and check `naturalWidth > 0` (no broken images). Separately, every image is either decorative (`alt=""`) or has non-empty alt text.
- **Link check:** run `lychee` or `linkinator` against the built `dist/` in CI. No 404s for images or internal links.
- **Performance:** Lighthouse "Properly size images" and "Serve images in modern formats" both pass on `/learnt`.
- **OG:** open-graph-check a sample of 3 project URLs on the deploy preview.

## Suggestions

- Script the captures: a Playwright script that visits each `liveUrl` and saves a 1280×800 screenshot. Re-run it whenever a demo changes.
- Add a subtle "Retired — screenshot from {date}" caption on Composted projects, so old UIs read as history, not as current work.
- Generate OG images with `astro-og-canvas` or Satori: the title, stage chip and lifespan on the ledger background.
