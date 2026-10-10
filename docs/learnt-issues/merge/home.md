Part of #32 · Phase 3 (UI) · Blocked by {{STAGE}}, {{CHIP}}, {{LAYOUT}} · Related: #21 (timeline + stats)

## Scope

Rebuild `src/pages/index.astro` to the Garden ledger mockup. It replaces `Welcome.astro` and the Featured grid.

1. **Hero.**
   - Eyebrow: "The proof-of-work archive · 2022 → now".
   - H1: "Every project I've shipped, sunset or buried — and what each one taught me."
   - Subline, plus two CTAs: Browse the archive / How the stages work.
2. **Stats:** projects logged, shipped, still growing and technologies touched, all from `getStats()`.
3. **Stage legend** (`StageLegend`).
4. **Recently composted:** the three most recent Composted projects by `died`, shown as compost cards. The epitaph line reads "Composted {Month Year} · {epitaph} · It was {lifespan} days old." Then "Superseded by → {title}" when set.
5. **Still growing:** a list of Sprout projects showing chip, title, stack and `born` month.
6. **The trail, by year:** bars from `getByYear()`. Each row links to `/learnt?year=YYYY`. This can be a compact preview of #21's full timeline.

Mockups: "A · Home" and "A light · Home" (https://claude.ai/artifact/LxvPxhbwkX4S9CDfpnyWVe).

## Acceptance criteria

- [ ] Nothing is hard-coded: counts, lists and bars all come from the collection.
- [ ] Matches the mockup in light and dark; stacks to one column below 860px.

## Testing

- **Unit:**
  - the recently-composted selector returns the 3 newest by `died` and handles fewer than 3;
  - still-growing contains only Sprout projects;
  - the year-bar widths are proportional (the largest year is 100%).
- **End-to-end:**
  - the numbers on the page match `getStats()` (written to a JSON fixture at build time);
  - every card and year row links somewhere valid;
  - `/learnt?year=2024` opens with the year filter applied (needs {{FILTERS}}).
- **Copy:** one known lifespan shows correctly (`side-project-status` → 28 days).
- **Accessibility:** axe in both themes; headings run h1 → h2 → h3 in order; year bars have text labels.
- **Visual:** 360px and 1280px, in light and dark.
- **Performance:** Lighthouse LCP under 2.0s (preload the display font).

## Suggestions

- Split the year bars by stage (shipped, composted, sprout) to show *how* each year went, not just how much.
- Use `clamp()` for the H1. It wraps to about 5 lines at 360px.
- Add one "newest entry" line under the hero, so returning visitors see that something changed.
