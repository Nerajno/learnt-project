# #46 Project detail page rebuild: plan

Issue: https://github.com/Nerajno/learnt-project/issues/46 · Branch: `feature/46-detail-page`, stacked on `feature/29-rss`, which contains #40, #45 and #29.
Process: `superpowers:test-driven-development` for each task, then `cavecrew-reviewer`, then a PR carrying #46's labels (`enhancement`, `phase:3-ui`, `vwc:proof-of-work`).
Style: follow the ledger mockup (artifact `ENYCyj4dr8VtzYZ5ZaJ8BN`, the Trumma and Trapper Keeper views) on the dvlpr-dialects tokens, the same way `src/pages/index.astro` does.

## Goal
`src/pages/learnt/[slug].astro` is about 800 lines today. Cut it to under 150 lines that compose components under `src/components/project/`. Hide any section that has no data, never render it blank. Remove the share buttons and the duplicate screenshot (closes #12).

## Tasks (one commit each, test first)
1. **Selectors in `src/lib/detail.ts`**:
   - `getRelated(project, all)` returns at most 3 projects, never the project itself, ordered by how many technologies they share.
   - `getNeighbours(project, all)` returns prev/next and handles the first and last project.
   - Unit tests go in `tests/unit/detail.test.ts`.
2. **`DetailHeader.astro`**:
   - the breadcrumb, `learnt / archive / {slug}`, inside `<nav aria-label="Breadcrumb">`
   - three chips: `StageChip` (with cause), category, and tier
   - the H1 and the one-line description
   - the epitaph line, e.g. "Born May 4, 2025 · Composted June 1, 2025 · It was 28 days old.", using `getLifespan`, with amber text when the project is composted
3. **`SuccessorBanner.astro`**: when `supersededBy` is set, show "Superseded by **{title}**" and "Open the successor →".
4. **`ProofOfWork.astro`**:
   - outcome, impact and epitaph
   - evidence: the repo, the live demo or `demoVideo`, and a proof strip (tests, last deploy, Lighthouse, CI) that shows only the keys that are set; never invent a metric
5. **`Learned.astro`**: three sections, hidden when empty:
   - "What was hard" (`challenges`)
   - "What I learned" (`learnings`, keeping the `data-testid="learnings-list"` hook from #49)
   - "Retrospective" as a blockquote with an `--amber` rule
6. **`DetailSidebar.astro`**:
   - quick info: born, died and lifespan; the stage chip already appears in the header, so don't repeat it
   - stack chips and "View code"
   - a lineage card built from `getLineage()`, hidden when there's no lineage
7. **`SameSoil.astro`**: the 3 related projects, followed by prev/next navigation.
8. **Rewrite `[slug].astro`** to compose the components above.
   - **Keep:** the JSON-LD (`projectJsonLd`, #28), the "Spot something wrong? Tell me" contact link (#44), the composted wording (#39), and the `ProjectImage` placeholder for the screenshot.
   - **Delete:** the dead keyboard-nav script, `copyToClipboard`, the unused `Image` import, the share buttons, and `ProjectNav` if `SameSoil` replaces it.
9. **E2E in `tests/e2e/detail.spec.ts`**:
   - `side-project-status` (composted and superseded): the epitaph, the banner and the lineage all show. Its `supersededBy` isn't set until #25; if it's still empty, use a fixture or skip with a TODO.
   - `trumma-drum-machine` (shipped, has a demo): no banner, and a Demo link.
   - `github-profile` (sprout, sparse data): no empty headings.
   - every slug: one `<h1>`, a Proof of work section on shipped and composted projects, and no console errors
   - axe in both themes, and no horizontal scroll at 360px
10. **Clean up existing tests** that target the old markup: `learnings.spec.ts`, `stage-chip.spec.ts` (detail header), `dates.spec.ts`, `json-ld.spec.ts`, `images.spec.ts` and `contact.spec.ts` (report link). Keep what they check and update only their selectors.

## Done when
The type check passes, `npm test` and `npx playwright test` are green, screenshots at 360px and 1280px in light and dark have been reviewed, and the reviewer's findings are handled.

## Watch out
- `npm install` rewrites `@nerajno/dialects` to `git+ssh` in `package-lock.json`. Set it back to `git+https` before committing.
- Check `gh pr view N --json state` before pushing to any PR branch, because PRs get merged quickly.
- Opencode may be working in the same tree. Check `git status` and the current branch before starting.
