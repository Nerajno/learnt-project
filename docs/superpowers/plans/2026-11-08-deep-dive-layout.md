# #24 Deep Dive layout: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (Native). Steps use `- [ ]`.

**Goal:** On detail pages where `tier: 'headstone'` and `deepDive` is set, render the story layout from #24 (VWC §4). Markers and coursework keep the current layout.

**Architecture:** one new component, `src/components/project/DeepDive.astro`, rendered by `[slug].astro` in place of `Overview` + `Learned` when `project.tier === 'headstone' && project.deepDive`. The data comes from `deepDiveSchema` in `src/data/projects.ts`; there are no schema changes.

**Spec:** https://github.com/Nerajno/learnt-project/issues/24 · Branch: `feature/24-deep-dive-layout`, cut from master. Labels: `enhancement`, `phase:3-ui`, `vwc:artifact-deep-dive`.

## Decisions (mine — confirm at approval)
- No project has `deepDive` yet (#26 and #50 are content), so tests use `makeProject` fixtures. Live pages don't change until that content lands.
- `ProofOfWork` and `DetailSidebar` stay on headstone pages too. DeepDive adds its sections; it doesn't remove those.
- `architectureDiagram` is an image path. Render it with `ProjectImage`, with alt text `"{title} architecture diagram"`.
- `ai === 'No AI tools used'` renders that sentence as the whole AI section.

## Section order (from #24) and the field each one uses
1. Problem: `problem`
2. Success criteria: `successCriteria[]`
3. Approach and architecture: `approach`, plus `architectureDiagram`
4. Tradeoffs: a table of `tradeoffs[]` (decision, why, and an ADR link when `adrUrl` is set)
5. Measurable outcome: `measurableOutcome`
6. AI collaboration: `ai.tools`, `aiDid`, `iOwned`, `aiGotWrong`
7. What I'd change in v2: `v2[]`
8. Evidence: `walkthroughVideo`, `dataModel`, `relatedPosts[]`

Each section has an `h2` with an id and `aria-labelledby`. Lists get `role="list"`. Any empty section or field is omitted, never shown empty.

## Global constraints
- Use tokens only; match the `Learned.astro` and `Overview.astro` styles.
- Run `npm run build` before E2E. E2E specs import from `./test`.
- Commit trailer: `Facilitated-by: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review focus
1. A headstone with no `deepDive` falls back to the marker layout and doesn't crash.
2. A partial `deepDive` (empty arrays, no optional fields) shows no empty headings.
3. The tradeoffs table is readable at 360px: either it scrolls inside its own wrapper or it stacks.
4. The diagram has meaningful alt text.
5. `ai` as the literal string vs as an object.

### Task 1: `DeepDive.astro` + unit tests
- [ ] Write `tests/unit/DeepDive.test.ts`:
  - full fixture → all 8 headings in order
  - `ai: 'No AI tools used'` → that text appears, and no tools list
  - empty arrays plus missing optionals → those headings are absent
  - tradeoff with `adrUrl` → link present
  - diagram → `alt` contains "architecture diagram"
- [ ] Run it and watch it fail. Implement until it passes. Commit: `feat: add deep dive component (#24)`.

### Task 2: Wire into `[slug].astro` + E2E
- [ ] Unit/E2E test: headstone fixture → the DeepDive headings show; a marker page has no "Problem" heading. Use a test-only page, or assert on `getProjectBySlug` data once #26 lands. Until then, use the Astro container test of the page logic.
- [ ] Wire the conditional in. The full suite and axe in both themes must stay green.
- [ ] Commit, run the cavecrew-reviewer, open a PR with the labels and `Closes #24`.
