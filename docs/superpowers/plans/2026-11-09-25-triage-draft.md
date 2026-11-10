# #25 triage draft — plan

Spec: issue #25 (tiers, causeOfDeath, outcome/impact/epitaph, market skill tags; no invented numbers). Approved in chat 2026-11-09.

Global constraints: docs only; `src/data/projects.ts` unchanged; batch-1 worksheet unchanged; drafts use only facts already in `projects.ts` or git; unknowns marked `needs you`.

## Task 1: Collect evidence
Extract all 44 projects (slug, title, description, tier, status, dates, tags, technologies, features, learnings, challenges, githubUrl, liveUrl) to JSON; fetch first/last `Nerajno` commit dates for each repo via `gh api`.
Expected: 44 records; date rows for every repo reachable.

## Task 2: Validator (the test)
`scripts/check-25-draft.mjs`: parse `docs/content/25-triage-draft.md`; assert every slug present once, tier/causeOfDeath/stage values valid, coursework vs others field rules, headstone/marker have outcome or `needs you`, no digits in outcome/impact/epitaph unless sourced from data.
Expected: fails (file missing), then passes after Task 3.

## Task 3: Write the draft
One section per project in the batch-1 format plus a "Draft" column.
Expected: validator passes.
