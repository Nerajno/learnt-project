Part of {{EPIC}}

## Why

`Project` currently has two overlapping fields. `status` is completed, in-progress, planned or archived; `phase` is active, sunset or archived. They contradict each other: for example, `side-project-status` is `completed` + `sunset`, but its retrospective says it was superseded. The Garden ledger replaces both with a single **stage**, plus lifespan, lineage and proof-of-work fields.

## Scope

1. **Move projects to an Astro content collection** (`src/content/projects/*.md`, or `.json`/`.yaml`) with a zod schema in `src/content.config.ts`. This replaces the 2,300-line `src/data/projects.ts`.

   Schema changes:
   - `stage: z.enum(['seed', 'sprout', 'shipped', 'composted'])` replaces `status` and `phase`.
   - `planted: z.coerce.date()` replaces `dateStarted`.
   - `shippedOn?: date` replaces `dateCompleted`.
   - `compostedOn?: date` replaces `sunsetDate` / `dateSunset`.
   - `supersededBy?: reference('projects')` and `fedInto?: reference('projects')[]` are new (lineage).
   - `proof` is new: `{ problem: string, built: string, outcome: string, commits?: number }`.
   - `retrospective`, `features`, `learnings` and `challenges` stay. Fold `learned` into `learnings`.
   - Remove `id`, `short`, `dateCreated` and `altText` (alt text moves next to the image).

2. **Schema rules** (use `superRefine`, so a bad entry fails the build):
   - `shipped` or `composted` requires `githubUrl` and `proof.problem`.
   - `composted` requires `compostedOn`, plus either `supersededBy`, `fedInto` or a `retrospective`.
   - `shipped` requires `shippedOn`.

3. **Migration script** (`scripts/migrate-projects.ts`, one-off) using this mapping:

   | Current `status` | Current `phase` | New `stage` |
   |---|---|---|
   | planned | any | seed |
   | in-progress | any | sprout |
   | completed | active / archived | shipped |
   | completed | sunset | **composted** (flag for review) |
   | archived | any | composted |

4. **Helpers** in `src/lib/projects.ts`:
   - `getLifespan(p)` returns days from planted to composted (or to today).
   - `getLineage(p)` walks `supersededBy` both ways.
   - `getStats()` returns counts per stage and per technology.
   - `getByYear()` returns counts per year.

## Acceptance criteria

- [ ] All 42 projects migrate; `astro build` passes with the schema rules on. Projects that fail go into the content-audit issue ({{CONTENT}}) rather than being given loosened rules.
- [ ] Nothing references `status`, `phase`, `dateStarted` or `sunsetDate` any more.
- [ ] Stats on Home and Archive come from `getStats()`, not hard-coded numbers.
- [ ] The PR lists the projects the migration flagged for review.

## Testing

- **Schema unit tests** (Vitest; run the zod schema directly on fixtures):
  - a Shipped entry without `githubUrl` → fails;
  - Shipped without `proof.problem` → fails;
  - Composted without `compostedOn` → fails;
  - Composted with `compostedOn` but no lineage and no retrospective → fails;
  - a valid Seed with minimal fields → passes.
- **Helper unit tests:**
  - `getLifespan`: same day → 0; leap year; Sprout uses today (mock the date with `vi.setSystemTime`).
  - `getLineage`: a chain of 3 (learnt-v1 → learnt-v2 → learnt-project), forward and back; a cycle doesn't loop forever.
  - `getStats`: counts on a fixture set match by hand.
  - `getByYear`: the totals add up to the number of projects.
- **Migration test:** run the script against a copy of the current `projects.ts`. Check 42 entries come out, each mapping row in the table gives the expected stage, and no field is dropped without being listed.
- **Build:** `astro build` passes, and `astro check` shows no type errors.

## Suggestions

- Use `.md` files with frontmatter, not JSON. The retrospective and longer write-ups then read like posts, and the body can become the long post-mortem.
- Make `proof` a structured object rather than free text. It keeps the Proof of work block consistent and makes the build-time checks simple.
- Keep the migration script in the repo for one release, so the mapping can be audited, then delete it.
- Add `featured: boolean` back only if Home needs it. The Recently composted and Still growing lists may make it unnecessary.
