Part of {{EPIC}} · Blocked by {{DATA}}, {{CHIP}}, {{LAYOUT}}

## Scope

Rebuild `src/pages/index.astro`; it replaces `Welcome.astro` and the "Featured Projects" grid. Sections, top to bottom:

1. **Hero.**
   - Eyebrow: "The proof-of-work archive · 2022 → now".
   - H1: "Every project I've shipped, sunset or buried — and what each one taught me."
   - Subline, plus two CTAs: Browse the archive (accent fill) and How the stages work (outlined).
2. **Stats row.** Four tiles from `getStats()`: projects logged, shipped, still growing, technologies touched.
3. **Stage legend** (`StageLegend`): "Four stages, no shame".
4. **Recently composted.** The three most recent Composted projects by `compostedOn`, shown as compost cards (`--compost-bg` / `--compost-line`). Each card's epitaph reads "Composted {Month Year}, {title} {one-liner}. It was {lifespan} days old.", followed by "Superseded by → {title}" or "Fed into → …".
5. **Still growing.** A list of Sprout projects: chip, title, stack and planted month.
6. **The trail, by year.** One horizontal bar per year from `getByYear()`, filled with `--bar` on a `--line` track. Each row links to `/learnt?year=YYYY`.

## Acceptance criteria

- [ ] Nothing is hard-coded: counts, lists and bars all come from the collection.
- [ ] Matches the mockup in both themes; the layout stacks to one column below 860px.

## Testing

- **Unit:**
  - the "recently composted" selector returns the 3 most recent by `compostedOn`, and handles fewer than 3;
  - the "still growing" list contains only Sprout projects;
  - the year-bar widths are proportional (the largest year is 100%).
- **End-to-end:**
  - the stats on the page equal `getStats()` (compare against a JSON the build writes, or a fixture);
  - each compost card links to its detail page;
  - each year row links to `/learnt?year=YYYY`, and the archive opens with that year selected (needs {{ARCHIVE}}).
- **Copy:** the epitaph shows "It was N days old" with N from `getLifespan`; check one known project (`side-project-status` → 28 days).
- **Accessibility:** axe on `/` in both themes; headings run h1 → h2 → h3 in order; the year bars have text labels, not just widths.
- **Visual:** screenshots at 360px and 1280px, in both themes.
- **Performance:** Lighthouse on `/` with LCP under 2.0s (the H1 is the LCP element; preload the display font).

## Suggestions

- Show the year trail as stacked bars by stage (shipped, composted, sprout). It turns "how much" into "how it went".
- Add one "newest entry" line under the hero, so returning visitors see that something changed.
- Keep the hero copy short on mobile. The H1 wraps to about 5 lines at 360px; consider a shorter variant via `clamp()` font sizing.
