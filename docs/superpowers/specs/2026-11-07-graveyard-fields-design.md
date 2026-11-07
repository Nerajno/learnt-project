# Graveyard fields — design (issue #15)

## Intent

Give every project the graveyard framing as data: one canonical birth date, one
canonical death date, and typed slots for cause, successor, and epitaph. Remove
the five overlapping date fields that make cards and detail pages disagree
(#49), and lay the schema foundation #39 needs for `stage`.

## Goals

- `born` (required) and `died` (optional) are the only lifecycle dates.
- Remove `dateStarted`, `dateCreated`, `dateCompleted`, `sunsetDate`,
  `dateSunset` from the type and every entry.
- Add typed, optional `causeOfDeath`, `supersededBy`, `epitaph`.
- Every reader uses `born` / `died`; no fallback chains remain.
- Unit and E2E tests guard the migration and the card/detail consistency.

## Non-goals

- Writing 42 epitaphs, causes of death, or successor links — that is #25/#39.
- Removing `status` / `phase` — that is #39.
- Removing `short` / `learned` / `learnings` — #25 decides what folds into
  `epitaph`.
- Rebuilding the detail page (#46) or card (#19).
- Closing #49 fully: the learnings-count half and the final regression test stay
  there.

## Constraints

- 42 projects in `src/data/projects.ts`; the issue's "44" is stale.
- Site stays static; no runtime dependency changes.
- Never invent content: optional fields stay unset until the content pass.
- `projects.ts` keeps its hand-formatted comments and grouping; the migration
  must not regenerate the file wholesale.

## Approaches

- **A. Schema-only migration (chosen).** Migrate dates, remove the old fields,
  add optional content slots. No invented copy.
- **B. Schema + content now.** Requires 42 epitaphs and causes; duplicates #25
  and risks fabricated copy.
- **C. Additive/deprecated.** Keep old fields beside new ones; leaves the drift
  #49 exists to remove.

## Schema

```ts
born: string;           // YYYY-MM-DD, from dateStarted
died?: string;          // YYYY-MM-DD, from sunsetDate ?? dateCompleted
causeOfDeath?: 'shipped' | 'superseded' | 'outgrew-stack' | 'course-ended'
             | 'abandoned' | 'merged-into';   // TODO(#39) populate
supersededBy?: string;  // slug of the successor; TODO(#25)
epitaph?: string;       // one sentence: what it taught me; TODO(#25)
```

Removed: `dateStarted`, `dateCreated`, `dateCompleted`, `sunsetDate`,
`dateSunset`.

## Migration rules

| New field | Source |
| --------- | ------ |
| `born`    | `dateStarted` (all 42 have it) |
| `died`    | `sunsetDate ?? dateCompleted` (36 projects; 9 sunset, 6 open) |

Run a one-off codemod over the existing file, then review the diff by hand:

1. Import the current data to build `slug → { born, died }`.
2. Rewrite each project block in place: replace `dateStarted:` with `born:`,
   delete `dateCreated`/`dateCompleted`/`sunsetDate`/`dateSunset` lines, and
   insert `died:` after `born:` when present.
3. Do not touch comments, ordering, or other fields.
4. `npm test` and `npm run build` prove every entry migrated.

If the codemod cannot do this safely, fall back to editing the 42 blocks in
batches, using the imported data as the source of truth.

## Reader changes

- `src/lib/archive.ts`: `startDate`/`endDate` collapse to `project.born` /
  `project.died ?? ''`; `toArchiveItem` passes them through.
- `src/components/ProjectCard.astro`: display `project.born`.
- `src/components/ProjectDetail.astro` (unused but must compile): `dateSunset`
  → `died`.
- `src/pages/learnt/[slug].astro`:
  - JSON-LD `dateCreated` → `born`.
  - `getProjectDuration(project.born, project.died)`; returns `null` without a
    `died`, so finished projects stop ageing and open projects show no
    duration. Under 60 days it reports days (“47 days”), then months, then
    years, with correct pluralisation.
  - “Started” block reads `born`; “Completed” block reads `died`.
  - Sunset block condition becomes `project.phase === "sunset" && project.died`
    (the old `project.status === "sunset"` test never matched, because `sunset`
    is a phase value).
- `src/layouts/Layout.astro` JSON-LD (unreachable, must compile):
  `datePublished: born`, `dateModified: died ?? born`.
- `src/data/projects.ts` helpers: `getRecentProjects` and `getProjectsByYear`
  use `born`; year extraction uses the ISO prefix (`born.slice(0, 4)`), not
  local-time parsing.

## Content deferrals

`causeOfDeath`, `supersededBy`, and `epitaph` are typed but unset on every
entry. `TODO(#25)` / `TODO(#39)` mark where they get filled.

## Testing

### Unit (`tests/unit/projects.test.ts`, extend)

- every project has `born` matching `/^\d{4}-\d{2}-\d{2}$/`;
- no project has `dateStarted`, `dateCreated`, `dateCompleted`, `sunsetDate`,
  or `dateSunset`;
- every `died` is absent or a valid date and `died >= born`;
- `getRecentProjects()` is ordered by `born` descending;
- `getProjectsByYear(2023)` matches `born.slice(0, 4)` and is timezone-stable.

### Unit (existing, update)

- `tests/unit/fixtures.ts`: `dateStarted` → `born`.
- `tests/archive-classify.test.ts`: assert `toArchiveItem` passes `born`/`died`
  through; drop the “prefers dateCompleted/sunsetDate/dateSunset” fallback test.

### E2E (`tests/e2e/dates.spec.ts`)

- For `trumma-drum-machine`, the year shown on the archive card equals the
  “Started” date on its detail page (same `born`);
- For `side-project-status`, the detail page shows one “Completed” date
  (`died`) and a duration derived from `born → died`, not a value that grows
  with today.

## Risks

- **Dates shift earlier.** `born` is `dateStarted`, which is earlier than
  `dateCreated` for 41 projects; archive year buckets and “recent” order change.
  This is the intended consolidation.
- **#45's copy conflict.** #45 expects `side-project-status` → “28 days”, which
  matches `dateCreated → sunsetDate`. With `born = dateStarted` the lifespan is
  47 days; #45's example needs updating when that ticket is implemented.
- **Codemod risk.** Review the full diff and rely on the type checker plus the
  no-legacy-keys test.
- **Open projects lose a duration.** `getProjectDuration` returns `null`
  without `died`; this is deliberate (no ageing) and #39's `getLifespan`
  formalises it.
