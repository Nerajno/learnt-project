Part of #32 · Phase 2 (schema) · Builds on #15, #16 and #18

## Why

#15 and #16 describe *how a project ended* (`causeOfDeath`, `died`) and *how deep its page goes* (`tier`). Neither says where a project is in its life right now. The Garden ledger adds one field for that: **stage**. All three work together:

| Field | Answers | Values |
|---|---|---|
| `stage` (new) | Where is it in its life? | `seed` · `sprout` · `shipped` · `composted` |
| `causeOfDeath` (#15) | Why did it end? (Composted only) | `superseded` · `outgrew-stack` · `course-ended` · `abandoned` · `merged-into` |
| `tier` (#16) | How deep is its page? | `headstone` · `marker` · `coursework` |

`stage` replaces the overlapping `status` and `phase` fields. They currently contradict each other: for example, `side-project-status` is `completed` + `sunset`.

## Scope

1. Add `stage: z.enum(['seed', 'sprout', 'shipped', 'composted'])` to the schema from #18. Remove `status` and `phase`.
2. **Consistency rules** (zod `superRefine`; a bad entry fails the build):
   - `seed` / `sprout` → no `died`, no `causeOfDeath`.
   - `shipped` → `died` is optional (the date it was finished). `causeOfDeath` is unset or `shipped`.
   - `composted` → `died` is required, `causeOfDeath` is required and not `shipped`, and `supersededBy` is required when `causeOfDeath` is `superseded` or `merged-into`.
   - `shipped` and `composted` require `githubUrl` and `outcome` (#16).
3. **Migration mapping** for the one-off move off `projects.ts`:

   | `status` | `phase` | `stage` |
   |---|---|---|
   | planned | any | seed |
   | in-progress | any | sprout |
   | completed | active / archived | shipped |
   | completed | sunset | composted (**review**: side-project-status, burble-v1) |
   | archived | any | composted |

4. **Helpers** in `src/lib/projects.ts`:
   - `getLifespan(p)` returns days from `born` to `died` (or to today);
   - `getLineage(p)` walks `supersededBy` in both directions;
   - `getStats()` returns counts by stage, tier and cause;
   - `getByYear()` returns counts per year, split by stage.

## Acceptance criteria

- [ ] `stage` is required on every entry; `status` and `phase` are gone from types, data and UI.
- [ ] The consistency rules fail the build when broken; each rule has a unit test.
- [ ] The migration output lists every project it flagged for review; those go to #25.
- [ ] Home and Archive counts come from `getStats()`, not hard-coded numbers.

## Testing

- **Schema unit tests** (Vitest, run on fixtures):
  - Sprout with `died` → fails;
  - Composted without `causeOfDeath` → fails;
  - Composted `superseded` without `supersededBy` → fails;
  - Shipped without `outcome` → fails;
  - a minimal valid Seed → passes.
- **Helper tests:**
  - `getLifespan`: same-day project is 0, leap years handled, Sprout uses today (`vi.setSystemTime`);
  - `getLineage`: the chain learnt-v1 → learnt-v2 → learnt-project, both directions, and a cycle guard;
  - `getStats` and `getByYear`: totals equal the number of projects.
- **Migration:** run it on a copy of today's `projects.ts`. All 42 entries come out, and every mapping row gives the expected stage.
- **Build:** `astro check` and `astro build` both pass.

## Suggestions

- Land this in the same PR as #15, or straight after it, so the dates and `causeOfDeath` exist before the rules that reference them.
- Keep one `STAGES` map (label, icon, one-line definition) in `src/lib/stages.ts`. The chip, the legend, the filters and the About copy then all read the same source.
- Show `causeOfDeath` as a sub-label on Composted chips ("Composted · superseded"). That gives the graveyard its personality.
