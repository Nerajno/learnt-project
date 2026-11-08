# Stage Field (#39) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the contradictory `status` + `phase` pair with one required `stage` field (`seed`, `sprout`, `shipped`, `composted`), enforce the stage consistency rules with Zod, and expose the lifecycle helpers (`getLifespan`, `getLineage`, `getStats`, `getByYear`) that the Garden-ledger UI needs.

**Architecture:** `src/lib/stages.ts` owns the single stage vocabulary. `src/data/projects.ts` defines the Zod schemas, validates all 42 entries at module load, and exports `Project` as a `z.infer` of the schema so types cannot drift. `src/lib/projects.ts` owns the four lifecycle helpers and the `daysBetween` primitive. The archive stops deriving a stage from `status`/`phase` and reads `project.stage` directly. UI surfaces render a stage label, never a status.

**Tech Stack:** Astro 5.13, TypeScript, Tailwind 3.4, Vitest 3.2, Playwright 1.64, `astro/zod` (already shipped with Astro; no new dependency).

**Spec:** GitHub issue #39, "Add `stage` field (Seed/Sprout/Shipped/Composted) alongside causeOfDeath + tier" — https://github.com/Nerajno/learnt-project/issues/39. Part of epic #32.

**Starting state:** `master` is clean at `f5d2559`. Branch `feature/39-stage-field` is created from it. There is no content collection and no Zod schema yet; #18 has not landed. This plan adds the schema to the current `src/data/projects.ts` so #39 unblocks the UI work; #18 can move the same schema into `src/content.config.ts` later.

## Global Constraints

- Exactly 42 projects. Migration output: **0 seed, 6 sprout, 24 shipped, 12 composted**. Tests derive counts from `projects` wherever possible; the one migration guard may assert this split explicitly.
- `stage` values are exactly `'seed' | 'sprout' | 'shipped' | 'composted'`.
- `status` and `phase` are removed from the type, every data entry, every selector, and every UI surface. No `deriveStage` bridge remains.
- **Never invent content.** `causeOfDeath`, `supersededBy`, `epitaph`, `outcome`, and `impact` stay unset until #25. The strict content rules are implemented and tested on fixtures, but only the structural schema is applied to the real 42 entries. The migration report lists every entry the strict schema would flag; those go to #25.
- The build fails on a structural rule violation: seed/sprout with `died` or `causeOfDeath`; shipped with a non-`shipped` cause; composted without `died` or with cause `shipped`; `superseded`/`merged-into` without `supersededBy`; shipped/composted without `githubUrl`; `died < born`.
- No new dependencies. Use `astro/zod`.
- Site stays static; no runtime dependency changes.
- E2E runs through `npm run test:e2e` (build, then preview at `127.0.0.1:4321`, desktop + mobile). Never point tests at `astro dev`.
- Keep the existing hand formatting in `src/data/projects.ts`; the migration script only swaps two lines per entry.

## Review Focus

- The migration mapping is applied exactly: `planned → seed`; `in-progress → sprout`; `completed + active|archived → shipped`; `completed + sunset → composted`; `archived + any → composted`.
- Seven entries are flagged for review: `learnt-v1`, `side-project-status`, `burble-v1`, `cv-website`, `freecodecamp-fork`, `dotnet-tools`, `gulp-jest`. `cv-website` maps to shipped because it already has `died`; mapping it to sprout would violate the no-`died` rule.
- `getFeaturedProjects()` returns the same six slugs as before: `burble-v1`, `trumma-drum-machine`, `fcc-d3-story`, `trapper-keeper-v1`, `devconnector`, `cs50p-final`.
- `/learnt/?stage=seed` still shows the empty state because there are no seed projects.
- No `project.status`, `project.phase`, `getProjectsByStatus`, `getProjectsByPhase`, `getProjectStats`, or `deriveStage` remains anywhere in `src/` or `tests/`.
- The strict schema is proven by unit tests on fixtures; `projectSchema` (structural) is what validates the real data. The report explains the #25 handoff.
- Home and archive counts come from `getStats()`, not hard-coded numbers.

## Before Task 1

Run `npm install`. If Chromium is missing, run `npx playwright install chromium`.

Commit this plan before changing code:

```bash
git add docs/superpowers/plans/2026-11-07-stage-field.md
git commit -m "docs: add the #39 stage field plan"
```

---

### Task 1: Create the stage vocabulary

**Files:**
- Create: `src/lib/stages.ts`
- Create: `tests/unit/stages.test.ts`

**Interfaces:**
- Produces: `type Stage`, `interface StageMeta`, `STAGES`, `STAGE_LABELS`, `STAGE_VALUES`, `stageLabel(stage)`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/stages.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { STAGES, STAGE_LABELS, STAGE_VALUES, stageLabel } from '../../src/lib/stages';

describe('stage vocabulary (#39)', () => {
  it('defines exactly the four stages in lifecycle order', () => {
    expect(STAGES.map((stage) => stage.value)).toEqual(['seed', 'sprout', 'shipped', 'composted']);
    expect([...STAGE_VALUES]).toEqual(['seed', 'sprout', 'shipped', 'composted']);
  });

  it('labels every stage', () => {
    for (const stage of STAGES) {
      expect(stageLabel(stage.value)).toBe(stage.label);
      expect(STAGE_LABELS[stage.value]).toBe(stage.label);
    }
  });

  it('defines a one-line definition for every stage', () => {
    for (const stage of STAGES) {
      expect(stage.definition.trim().length).toBeGreaterThan(0);
    }
  });
});
```

Run: `npx vitest run tests/unit/stages.test.ts`
Expected: FAIL — cannot resolve `../../src/lib/stages`.

- [ ] **Step 2: Implement `src/lib/stages.ts`**

```ts
export type Stage = 'seed' | 'sprout' | 'shipped' | 'composted';

export interface StageMeta {
  value: Stage;
  label: string;
  definition: string;
  icon: string;
}

export const STAGES: readonly StageMeta[] = [
  { value: 'seed', label: 'Seed', definition: 'Planned, not started', icon: '○' },
  { value: 'sprout', label: 'Sprout', definition: 'In progress', icon: '↑' },
  { value: 'shipped', label: 'Shipped', definition: 'Finished and working', icon: '✓' },
  { value: 'composted', label: 'Composted', definition: 'Ended; lessons kept', icon: '✕' },
];

export const STAGE_LABELS: Record<Stage, string> = Object.fromEntries(
  STAGES.map((stage) => [stage.value, stage.label]),
) as Record<Stage, string>;

export const STAGE_VALUES = new Set<Stage>(STAGES.map((stage) => stage.value));

export function stageLabel(stage: Stage): string {
  return STAGE_LABELS[stage];
}
```

- [ ] **Step 3: Run the test**

Run: `npx vitest run tests/unit/stages.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 4: Commit**

```bash
git add src/lib/stages.ts tests/unit/stages.test.ts
git commit -m "feat: add the stage vocabulary (#39)"
```

---

### Task 2: Migrate the data and add the Zod schema

This task is atomic: the type change, the 42-entry migration, and the schema must land together.

**Files:**
- Create: `scripts/migrate-stage.mjs` (one-off, kept for audit)
- Create: `docs/content/39-stage-migration.md` (generated report)
- Modify: `src/data/projects.ts`
- Modify: `tests/unit/fixtures.ts`
- Modify: `tests/unit/projects.test.ts`
- Create: `tests/unit/project-schema.test.ts`

**Interfaces:**
- Consumes: `Stage` from `src/lib/stages.ts`.
- Produces: `type Category`, `type Difficulty`, `type Tier`, `type CauseOfDeath`, `type DeepDive`, `type Project`; `projectSchema`, `strictProjectSchema`; `projects: Project[]`; `getProjectsByStage(stage: Stage): Project[]`; `getFeaturedProjects()` using `stage`.

- [ ] **Step 1: Write and run the one-off migration script**

Create `scripts/migrate-stage.mjs`:

```js
// One-off #39 migration. Run this BEFORE the Project type changes.
// It imports the old status/phase data, rewrites each entry in place, and
// writes the audit report that hands missing content to #25.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/projects.ts';

const stageOf = (p) =>
  p.status === 'planned'
    ? 'seed'
    : p.status === 'in-progress'
      ? 'sprout'
      : p.status === 'completed'
        ? p.phase === 'sunset'
          ? 'composted'
          : 'shipped'
        : 'composted';

const stageBySlug = new Map(projects.map((p) => [p.slug, stageOf(p)]));
const dataPath = fileURLToPath(new URL('../src/data/projects.ts', import.meta.url));
const lines = readFileSync(dataPath, 'utf8').split('\n');
const out = [];
let slug = null;

for (const line of lines) {
  const slugMatch = line.match(/^\s*slug: '([^']+)',?$/);
  if (slugMatch) slug = slugMatch[1];

  if (/^\s*status: '/.test(line)) {
    const stage = stageBySlug.get(slug);
    if (!stage) throw new Error(`No stage for ${slug}`);
    out.push(line.replace(/status: '[^']+'/, `stage: '${stage}'`));
    continue;
  }

  if (/^\s*phase: '/.test(line)) continue;
  out.push(line);
}

writeFileSync(dataPath, out.join('\n'));

const rows = projects.map((p) => ({
  slug: p.slug,
  status: p.status,
  phase: p.phase,
  stage: stageOf(p),
  died: p.died ?? '',
  cause: p.causeOfDeath ?? '',
  outcome: p.outcome ?? '',
  tier: p.tier,
}));

const count = (stage) => rows.filter((row) => row.stage === stage).length;
const flagged = rows.filter(
  (row) =>
    (row.status === 'completed' && row.phase === 'sunset') ||
    (row.status === 'completed' && row.phase === 'active') ||
    (row.status === 'archived' && row.phase === 'archived'),
);

const table = rows
  .map(
    (row) =>
      `| ${row.slug} | ${row.status} | ${row.phase} | ${row.stage} | ${row.tier} | ${row.died || '—'} |`,
  )
  .join('\n');

const report = `# #39 stage migration

Generated by \`scripts/migrate-stage.mjs\` from the pre-#39 data. This is the audit trail for the one-off move off \`status\` + \`phase\`.

## Mapping

| \`status\` | \`phase\` | \`stage\` |
|---|---|---|
| planned | any | seed |
| in-progress | any | sprout |
| completed | active / archived | shipped |
| completed | sunset | composted (review) |
| archived | any | composted |

## Counts

| stage | count |
|---|---|
| seed | ${count('seed')} |
| sprout | ${count('sprout')} |
| shipped | ${count('shipped')} |
| composted | ${count('composted')} |
| **total** | **${rows.length}** |

## Flagged for review (#25)

${flagged.map((row) => `- \`${row.slug}\`: ${row.status} + ${row.phase} → **${row.stage}**`).join('\n')}

\`cv-website\` is completed + active but already has a \`died\` date, so it maps to \`shipped\`; mapping it to \`sprout\` would break the "sprout has no died" rule.

## Content still missing for #25

- **${rows.filter((row) => row.stage === 'composted' && !row.cause).length} composted entries** have no \`causeOfDeath\`.
- **${rows.filter((row) => (row.stage === 'shipped' || row.stage === 'composted') && !row.outcome).length} shipped/composted entries** have no \`outcome\`.
- All entries still need an \`epitaph\`.

The strict schema (\`strictProjectSchema\`) encodes these rules and is proven by unit tests on fixtures. The build applies the structural schema (\`projectSchema\`) until #25 supplies the content.

## Full mapping

| slug | status | phase | stage | tier | died |
|---|---|---|---|---|---|
${table}
`;

writeFileSync(
  fileURLToPath(new URL('../docs/content/39-stage-migration.md', import.meta.url)),
  report,
);
console.log(`migrated ${stageBySlug.size} projects`);
```

Run: `node --experimental-strip-types scripts/migrate-stage.mjs`
Expected: `migrated 42 projects`.

Verify the rewrite:

```bash
grep -c "status: '" src/data/projects.ts   # 0
grep -c "phase: '" src/data/projects.ts    # 0
grep -c "stage: '" src/data/projects.ts    # 42
```

- [ ] **Step 2: Replace the `Project` interface with the Zod schema**

At the top of `src/data/projects.ts`, replace the current `DeepDive` interface and `Project` interface with:

```ts
import { z } from 'astro/zod';
import type { Stage } from '../lib/stages';

export type Category = 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'design' | 'api';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Tier = 'headstone' | 'marker' | 'coursework';
export type CauseOfDeath =
  | 'shipped'
  | 'superseded'
  | 'outgrew-stack'
  | 'course-ended'
  | 'abandoned'
  | 'merged-into';

const aiSchema = z.union([
  z.object({
    tools: z.array(z.string()),
    aiDid: z.string(),
    iOwned: z.string(),
    aiGotWrong: z.string(),
  }),
  z.literal('No AI tools used'),
]);

const deepDiveSchema = z.object({
  problem: z.string(),
  successCriteria: z.array(z.string()),
  approach: z.string(),
  tradeoffs: z.array(
    z.object({
      decision: z.string(),
      why: z.string(),
      adrUrl: z.string().optional(),
    }),
  ),
  measurableOutcome: z.string(),
  v2: z.array(z.string()),
  walkthroughVideo: z.string().optional(),
  ai: aiSchema.optional(),
  architectureDiagram: z.string().optional(),
  dataModel: z.string().optional(),
  relatedPosts: z.array(z.string()).optional(),
});

const proofSchema = z.object({
  tests: z.string().optional(),
  lastDeploy: z.string().optional(),
  lighthouse: z.number().optional(),
  ci: z.boolean().optional(),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const baseProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  longDescription: z.string(),
  technologies: z.array(z.string()),
  category: z.enum(['frontend', 'backend', 'fullstack', 'mobile', 'design', 'api']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  stage: z.enum(['seed', 'sprout', 'shipped', 'composted']),
  born: isoDate,
  died: isoDate.optional(),
  causeOfDeath: z
    .enum(['shipped', 'superseded', 'outgrew-stack', 'course-ended', 'abandoned', 'merged-into'])
    .optional(),
  supersededBy: z.string().optional(),
  epitaph: z.string().optional(),
  tier: z.enum(['headstone', 'marker', 'coursework']),
  outcome: z.string().optional(),
  impact: z.string().optional(),
  demoVideo: z.string().optional(),
  proof: proofSchema.optional(),
  deepDive: deepDiveSchema.optional(),
  short: z.string().optional(),
  altText: z.string().optional(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  screenshot: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  youtubeId: z.string().optional(),
  notesUrl: z.string().optional(),
  features: z.array(z.string()),
  learnings: z.array(z.string()),
  challenges: z.array(z.string()),
  nextSteps: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  changelog: z.array(z.object({ date: isoDate, note: z.string() })).optional(),
  retrospective: z.string().optional(),
});

export type DeepDive = z.infer<typeof deepDiveSchema>;
export type Project = z.infer<typeof baseProjectSchema>;

type ProjectInput = z.infer<typeof baseProjectSchema>;

function addIssue(ctx: z.RefinementCtx, path: string, message: string) {
  ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
}

function structuralRules(project: ProjectInput, ctx: z.RefinementCtx) {
  if (project.stage === 'seed' || project.stage === 'sprout') {
    if (project.died) addIssue(ctx, 'died', `${project.stage} projects cannot have died`);
    if (project.causeOfDeath) addIssue(ctx, 'causeOfDeath', `${project.stage} projects cannot have causeOfDeath`);
  }

  if (project.stage === 'shipped' && project.causeOfDeath && project.causeOfDeath !== 'shipped') {
    addIssue(ctx, 'causeOfDeath', 'shipped projects may only use causeOfDeath "shipped"');
  }

  if (project.stage === 'composted') {
    if (!project.died) addIssue(ctx, 'died', 'composted projects require died');
    if (project.causeOfDeath === 'shipped') {
      addIssue(ctx, 'causeOfDeath', 'composted projects cannot use causeOfDeath "shipped"');
    }
  }

  if (
    (project.causeOfDeath === 'superseded' || project.causeOfDeath === 'merged-into') &&
    !project.supersededBy
  ) {
    addIssue(ctx, 'supersededBy', `${project.causeOfDeath} projects require supersededBy`);
  }

  if ((project.stage === 'shipped' || project.stage === 'composted') && !project.githubUrl) {
    addIssue(ctx, 'githubUrl', `${project.stage} projects require githubUrl`);
  }

  if (project.died && project.died < project.born) {
    addIssue(ctx, 'died', 'died must be on or after born');
  }
}

function contentRules(project: ProjectInput, ctx: z.RefinementCtx) {
  if (project.stage === 'composted' && !project.causeOfDeath) {
    addIssue(ctx, 'causeOfDeath', 'composted projects require causeOfDeath (#25)');
  }
  if ((project.stage === 'shipped' || project.stage === 'composted') && !project.outcome) {
    addIssue(ctx, 'outcome', `${project.stage} projects require outcome (#16, #25)`);
  }
}

export const projectSchema = baseProjectSchema.superRefine(structuralRules);
export const strictProjectSchema = baseProjectSchema.superRefine((project, ctx) => {
  structuralRules(project, ctx);
  contentRules(project, ctx);
});
```

Keep `export type Stage` available to callers by adding near the types:

```ts
export type { Stage } from '../lib/stages';
```

- [ ] **Step 3: Validate the real array at module load**

Change the array declaration from:

```ts
export const projects: Project[] = [
```

to:

```ts
const rawProjects: Project[] = [
```

After the closing `];` of the array (before the utility functions), add:

```ts
const parsed = z.array(projectSchema).safeParse(rawProjects);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => {
      const [index, ...rest] = issue.path;
      const slug = rawProjects[Number(index)]?.slug ?? String(index);
      return `${slug}${rest.length ? `.${rest.join('.')}` : ''}: ${issue.message}`;
    })
    .join('\n');
  throw new Error(`Invalid project data:\n${details}`);
}

export const projects: Project[] = parsed.data;
```

- [ ] **Step 4: Replace the lifecycle selectors**

In `src/data/projects.ts`:

- Delete `getProjectsByStatus`.
- Delete `getProjectsByPhase`.
- Delete `getProjectStats`.
- Add:

```ts
export function getProjectsByStage(stage: Stage): Project[] {
  return projects.filter((project) => project.stage === stage);
}
```

- Change `getFeaturedProjects()` to:

```ts
export function getFeaturedProjects(): Project[] {
  return projects.filter(
    (project) =>
      project.featured &&
      (project.stage === 'shipped' || project.stage === 'composted') &&
      project.tier !== 'coursework',
  );
}
```

- [ ] **Step 5: Update the unit fixture**

In `tests/unit/fixtures.ts`, replace:

```ts
status: 'completed',
phase: 'archived',
```

with:

```ts
stage: 'shipped',
```

and add a repo so the fixture is a valid shipped project:

```ts
githubUrl: 'https://github.com/Nerajno/test-project',
```

- [ ] **Step 6: Update `tests/unit/projects.test.ts`**

- Replace the `getFeaturedProjects` assertions:

```ts
it('never returns living projects (#14)', () => {
  const featured = getFeaturedProjects();
  expect(featured.length).toBeGreaterThan(0);
  for (const project of featured) {
    expect(project.featured).toBe(true);
    expect(['shipped', 'composted']).toContain(project.stage);
  }
});

it('returns every featured finished project in data order', () => {
  const expected = projects
    .filter(
      (p) =>
        p.featured &&
        (p.stage === 'shipped' || p.stage === 'composted') &&
        p.tier !== 'coursework',
    )
    .map((p) => p.slug);
  expect(getFeaturedProjects().map((p) => p.slug)).toEqual(expected);
});
```

- Add a stage data guard:

```ts
describe('stages (#39)', () => {
  const stageValues = ['seed', 'sprout', 'shipped', 'composted'] as const;

  it('every project has an explicit valid stage', () => {
    for (const project of projects) {
      expect(stageValues).toContain(project.stage);
    }
  });

  it('stage counts sum to every project', () => {
    const total = stageValues
      .map((stage) => projects.filter((p) => p.stage === stage).length)
      .reduce((sum, count) => sum + count, 0);
    expect(total).toBe(projects.length);
  });

  it('keeps the migration split', () => {
    expect(projects.filter((p) => p.stage === 'seed')).toHaveLength(0);
    expect(projects.filter((p) => p.stage === 'sprout')).toHaveLength(6);
    expect(projects.filter((p) => p.stage === 'shipped')).toHaveLength(24);
    expect(projects.filter((p) => p.stage === 'composted')).toHaveLength(12);
  });

  it('keeps no status or phase fields', () => {
    for (const project of projects) {
      expect('status' in project).toBe(false);
      expect('phase' in project).toBe(false);
    }
  });
});
```

- [ ] **Step 7: Write the schema tests**

Create `tests/unit/project-schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { projectSchema, strictProjectSchema } from '../../src/data/projects';
import { makeProject } from './fixtures';

const lenient = (overrides: Parameters<typeof makeProject>[0] = {}) =>
  projectSchema.safeParse(makeProject(overrides));

const strict = (overrides: Parameters<typeof makeProject>[0] = {}) =>
  strictProjectSchema.safeParse(makeProject(overrides));

describe('structural stage rules (#39)', () => {
  it('accepts a minimal valid seed', () => {
    expect(lenient({ stage: 'seed' }).success).toBe(true);
  });

  it('rejects a sprout with died', () => {
    const result = lenient({ stage: 'sprout', died: '2024-01-02' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'died')).toBe(true);
  });

  it('rejects a sprout with causeOfDeath', () => {
    const result = lenient({ stage: 'sprout', causeOfDeath: 'abandoned' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'causeOfDeath')).toBe(true);
  });

  it('rejects a shipped project with a non-shipped cause', () => {
    const result = lenient({ stage: 'shipped', causeOfDeath: 'abandoned' });
    expect(result.success).toBe(false);
  });

  it('rejects a composted project without died', () => {
    const result = lenient({ stage: 'composted', causeOfDeath: 'course-ended' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'died')).toBe(true);
  });

  it('rejects a composted project with cause "shipped"', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'shipped',
    });
    expect(result.success).toBe(false);
  });

  it('rejects superseded without supersededBy', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'superseded',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'supersededBy')).toBe(true);
  });

  it('accepts superseded with supersededBy', () => {
    const result = lenient({
      stage: 'composted',
      died: '2024-02-01',
      causeOfDeath: 'superseded',
      supersededBy: 'test-project-v2',
    });
    expect(result.success).toBe(true);
  });

  it('rejects shipped/composted without githubUrl', () => {
    expect(lenient({ stage: 'shipped', githubUrl: undefined }).success).toBe(false);
    expect(
      lenient({ stage: 'composted', died: '2024-02-01', causeOfDeath: 'course-ended', githubUrl: undefined })
        .success,
    ).toBe(false);
  });

  it('rejects died before born', () => {
    const result = lenient({ stage: 'shipped', died: '2022-12-31', born: '2023-01-01' });
    expect(result.success).toBe(false);
  });
});

describe('strict content rules (ready for #25)', () => {
  it('rejects a composted project without causeOfDeath', () => {
    const result = strict({ stage: 'composted', died: '2024-02-01' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'causeOfDeath')).toBe(true);
  });

  it('rejects a shipped project without outcome', () => {
    const result = strict({ stage: 'shipped' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === 'outcome')).toBe(true);
  });

  it('accepts a shipped project with outcome', () => {
    expect(strict({ stage: 'shipped', outcome: 'Shipped a working thing.' }).success).toBe(true);
  });
});
```

- [ ] **Step 8: Run the focused tests and typecheck**

Run:

```bash
npx vitest run tests/unit/projects.test.ts tests/unit/project-schema.test.ts
npm run typecheck
```

Expected: all tests pass; 0 type errors (the three existing hints in `src/pages/learnt/[slug].astro` are allowed).

- [ ] **Step 9: Verify the migration report**

Run:

```bash
grep -E "learnt-v1|side-project-status|burble-v1|cv-website|freecodecamp-fork|dotnet-tools|gulp-jest" docs/content/39-stage-migration.md
```

Expected: every flagged slug appears.

- [ ] **Step 10: Commit**

```bash
git add scripts/migrate-stage.mjs docs/content/39-stage-migration.md src/data/projects.ts tests/unit/fixtures.ts tests/unit/projects.test.ts tests/unit/project-schema.test.ts
git commit -m "feat: replace status and phase with stage (#39)"
```

---

### Task 3: Add the lifecycle helpers

**Files:**
- Create: `src/lib/projects.ts`
- Create: `tests/unit/project-helpers.test.ts`

**Interfaces:**
- Consumes: `projects`, `Project`, `Tier`, `CauseOfDeath` from `../data/projects`; `Stage` from `./stages`.
- Produces: `daysBetween(born, died): number | null`; `getLifespan(project, now?): number`; `getLineage(project, all?): { predecessors: Project[]; successors: Project[] }`; `getStats(all?): ProjectStats`; `getByYear(all?): YearStats[]`.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/project-helpers.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { projects } from '../../src/data/projects';
import {
  daysBetween,
  getByYear,
  getLifespan,
  getLineage,
  getStats,
} from '../../src/lib/projects';
import { makeProject } from './fixtures';

afterEach(() => {
  vi.useRealTimers();
});

describe('daysBetween', () => {
  it('counts whole days', () => {
    expect(daysBetween('2024-01-01', '2024-01-31')).toBe(30);
  });

  it('returns 0 for the same day', () => {
    expect(daysBetween('2024-01-01', '2024-01-01')).toBe(0);
  });

  it('handles leap years', () => {
    expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2);
  });

  it('clamps an inverted range to zero', () => {
    expect(daysBetween('2024-02-01', '2024-01-01')).toBe(0);
  });

  it('returns null for missing or invalid dates', () => {
    expect(daysBetween('', '2024-01-01')).toBeNull();
    expect(daysBetween('2024-01-01', 'not-a-date')).toBeNull();
  });
});

describe('getLifespan', () => {
  it('uses died when present', () => {
    expect(getLifespan({ born: '2024-01-01', died: '2024-01-11' })).toBe(10);
  });

  it('uses today when died is absent', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-31T00:00:00Z'));
    expect(getLifespan({ born: '2024-01-01' })).toBe(30);
  });
});

describe('getLineage', () => {
  const a = makeProject({ slug: 'learnt-v1', title: 'Learnt V1', supersededBy: 'learnt-v2' });
  const b = makeProject({ slug: 'learnt-v2', title: 'Learnt V2', supersededBy: 'learnt-project' });
  const c = makeProject({ slug: 'learnt-project', title: 'Learnt Project' });
  const all = [a, b, c];

  it('walks successors through supersededBy', () => {
    expect(getLineage(b, all).successors.map((p) => p.slug)).toEqual(['learnt-project']);
    expect(getLineage(a, all).successors.map((p) => p.slug)).toEqual(['learnt-v2', 'learnt-project']);
  });

  it('walks predecessors in both directions', () => {
    expect(getLineage(b, all).predecessors.map((p) => p.slug)).toEqual(['learnt-v1']);
    expect(getLineage(c, all).predecessors.map((p) => p.slug)).toEqual(['learnt-v1', 'learnt-v2']);
  });

  it('guards against cycles', () => {
    const x = makeProject({ slug: 'x', supersededBy: 'y' });
    const y = makeProject({ slug: 'y', supersededBy: 'x' });
    expect(getLineage(x, [x, y]).successors.map((p) => p.slug)).toEqual(['y']);
    expect(getLineage(x, [x, y]).predecessors.map((p) => p.slug)).toEqual(['y']);
  });
});

describe('getStats', () => {
  const sample = [
    makeProject({ slug: 'a', stage: 'shipped', tier: 'marker', causeOfDeath: 'shipped' }),
    makeProject({
      slug: 'b',
      stage: 'composted',
      tier: 'headstone',
      died: '2024-02-01',
      causeOfDeath: 'course-ended',
    }),
    makeProject({ slug: 'c', stage: 'sprout', tier: 'coursework' }),
  ];

  it('counts by stage, tier, and cause', () => {
    const stats = getStats(sample);
    expect(stats.total).toBe(3);
    expect(stats.byStage).toEqual({ seed: 0, sprout: 1, shipped: 1, composted: 1 });
    expect(stats.byTier).toEqual({ headstone: 1, marker: 1, coursework: 1 });
    expect(stats.byCause).toMatchObject({ shipped: 1, 'course-ended': 1, abandoned: 0 });
  });

  it('totals the real data', () => {
    const stats = getStats();
    expect(stats.total).toBe(projects.length);
    expect(Object.values(stats.byStage).reduce((sum, count) => sum + count, 0)).toBe(projects.length);
    expect(Object.values(stats.byTier).reduce((sum, count) => sum + count, 0)).toBe(projects.length);
  });
});

describe('getByYear', () => {
  const sample = [
    makeProject({ slug: 'a', born: '2023-01-01', stage: 'shipped' }),
    makeProject({
      slug: 'b',
      born: '2023-06-01',
      stage: 'composted',
      died: '2023-07-01',
      causeOfDeath: 'course-ended',
    }),
    makeProject({ slug: 'c', born: '2024-01-01', stage: 'sprout' }),
  ];

  it('splits counts by year and stage, newest first', () => {
    const years = getByYear(sample);
    expect(years.map((year) => year.year)).toEqual([2024, 2023]);
    expect(years[1]).toEqual({
      year: 2023,
      total: 2,
      byStage: { seed: 0, sprout: 0, shipped: 1, composted: 1 },
    });
  });

  it('totals the real data', () => {
    const years = getByYear();
    expect(years.reduce((sum, year) => sum + year.total, 0)).toBe(projects.length);
  });
});
```

Run: `npx vitest run tests/unit/project-helpers.test.ts`
Expected: FAIL — cannot resolve `../../src/lib/projects`.

- [ ] **Step 2: Implement `src/lib/projects.ts`**

```ts
import { projects, type CauseOfDeath, type Project, type Tier } from '../data/projects';
import type { Stage } from './stages';

const DAY_MS = 86_400_000;

/** Whole days between two ISO dates; `null` when either is missing or invalid. */
export function daysBetween(born: string, died: string): number | null {
  if (!born || !died) return null;
  const start = Date.parse(born);
  const end = Date.parse(died);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return Math.max(0, Math.round((end - start) / DAY_MS));
}

/** Days from born to died, or to today when the project is still alive. */
export function getLifespan(
  project: Pick<Project, 'born' | 'died'>,
  now: Date = new Date(),
): number {
  const end = project.died ?? now.toISOString().slice(0, 10);
  return daysBetween(project.born, end) ?? 0;
}

export interface Lineage {
  predecessors: Project[]; // older projects this one supersedes, oldest first
  successors: Project[]; // newer projects that supersede this one, nearest first
}

/** Walk `supersededBy` in both directions with a cycle guard. */
export function getLineage(project: Project, all: Project[] = projects): Lineage {
  const bySlug = new Map(all.map((entry) => [entry.slug, entry]));

  const successors: Project[] = [];
  const seenSuccessors = new Set([project.slug]);
  let cursor: Project | undefined = project;

  while (cursor?.supersededBy) {
    const next = bySlug.get(cursor.supersededBy);
    if (!next || seenSuccessors.has(next.slug)) break;
    seenSuccessors.add(next.slug);
    successors.push(next);
    cursor = next;
  }

  const predecessors: Project[] = [];
  const seenPredecessors = new Set([project.slug]);
  let current: Project | undefined = project;

  while (current) {
    const previous = all.find(
      (entry) => entry.supersededBy === current!.slug && !seenPredecessors.has(entry.slug),
    );
    if (!previous) break;
    seenPredecessors.add(previous.slug);
    predecessors.unshift(previous);
    current = previous;
  }

  return { predecessors, successors };
}

export interface ProjectStats {
  total: number;
  byStage: Record<Stage, number>;
  byTier: Record<Tier, number>;
  byCause: Record<CauseOfDeath, number>;
}

export function getStats(all: Project[] = projects): ProjectStats {
  const byStage: Record<Stage, number> = { seed: 0, sprout: 0, shipped: 0, composted: 0 };
  const byTier: Record<Tier, number> = { headstone: 0, marker: 0, coursework: 0 };
  const byCause: Record<CauseOfDeath, number> = {
    shipped: 0,
    superseded: 0,
    'outgrew-stack': 0,
    'course-ended': 0,
    abandoned: 0,
    'merged-into': 0,
  };

  for (const project of all) {
    byStage[project.stage] += 1;
    byTier[project.tier] += 1;
    if (project.causeOfDeath) byCause[project.causeOfDeath] += 1;
  }

  return { total: all.length, byStage, byTier, byCause };
}

export interface YearStats {
  year: number;
  total: number;
  byStage: Record<Stage, number>;
}

export function getByYear(all: Project[] = projects): YearStats[] {
  const years = new Map<number, Record<Stage, number>>();

  for (const project of all) {
    const year = Number(project.born.slice(0, 4));
    if (!Number.isInteger(year)) continue;
    const counts = years.get(year) ?? { seed: 0, sprout: 0, shipped: 0, composted: 0 };
    counts[project.stage] += 1;
    years.set(year, counts);
  }

  return [...years.entries()]
    .map(([year, byStage]) => ({
      year,
      total: Object.values(byStage).reduce((sum, count) => sum + count, 0),
      byStage,
    }))
    .sort((a, b) => b.year - a.year);
}
```

- [ ] **Step 3: Run the helper tests**

Run: `npx vitest run tests/unit/project-helpers.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/projects.ts tests/unit/project-helpers.test.ts
git commit -m "feat: add lifecycle and stats helpers (#39)"
```

---

### Task 4: Remove the archive stage bridge

**Files:**
- Modify: `src/lib/archive.ts`
- Modify: `tests/archive-classify.test.ts`
- Modify: `tests/e2e/archive-filters.spec.ts`

**Interfaces:**
- Consumes: `Stage`, `STAGES` from `./stages`; `daysBetween` from `./projects`.
- Produces: `toArchiveItem` reads `project.stage`; `lifespanDays` delegates to `daysBetween`; `STAGES`/`Stage` stay re-exported for existing importers.

- [ ] **Step 1: Update the failing test first**

In `tests/archive-classify.test.ts`:

- Change the import to remove `deriveStage`:

```ts
import { lifespanDays, toArchiveItem, cardDataset } from '../src/lib/archive';
```

- In the local `project()` fixture, replace:

```ts
status: 'completed',
phase: 'active',
```

with:

```ts
stage: 'shipped',
```

- Delete the entire `describe('deriveStage', ...)` block.
- Add:

```ts
describe('stage passthrough', () => {
  it('carries the project stage into the archive item', () => {
    expect(
      toArchiveItem(project({ stage: 'composted', died: '2024-03-05' })).stage,
    ).toBe('composted');
  });
});
```

In `tests/e2e/archive-filters.spec.ts`:

- Remove the `deriveStage` import.
- Change `.filter((p) => deriveStage(p) === 'composted')` to `.filter((p) => p.stage === 'composted')`.

Run: `npx vitest run tests/archive-classify.test.ts`
Expected: FAIL — `deriveStage` is still exported/used and `toArchiveItem` still calls it.

- [ ] **Step 2: Update `src/lib/archive.ts`**

- Replace the top type/import block with:

```ts
import { STAGES } from './stages';
import type { Stage } from './stages';
import { daysBetween } from './projects';
import type { Project } from '../data/projects';

export { STAGES } from './stages';
export type { Stage } from './stages';
```

- Remove the old `STAGES` array (it now lives in `stages.ts`).
- Remove `deriveStage` entirely.
- In `toArchiveItem`, replace `stage: deriveStage(project)` with `stage: project.stage`.
- Replace the body of `lifespanDays` with:

```ts
export function lifespanDays(item: ArchiveItem): number | null {
  return daysBetween(item.born, item.died);
}
```

Keep `STAGE_VALUES` in `parseFilters` working by deriving it from the re-exported `STAGES`:

```ts
const STAGE_VALUES = new Set<string>(STAGES.map((stage) => stage.value));
```

- [ ] **Step 3: Run the tests**

Run:

```bash
npx vitest run tests/archive-classify.test.ts tests/archive-filter.test.ts tests/archive-url.test.ts
npm run typecheck
```

Expected: PASS; 0 type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/archive.ts tests/archive-classify.test.ts tests/e2e/archive-filters.spec.ts
git commit -m "refactor: read the real stage in the archive (#39)"
```

---

### Task 5: Replace status in every UI surface

**Files:**
- Modify: `src/components/ProjectCard.astro`
- Modify: `src/components/ProjectDetail.astro`
- Modify: `src/pages/learnt/[slug].astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/learnt.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/unit/ProjectCard.test.ts`

**Interfaces:**
- Consumes: `stageLabel` from `src/lib/stages`; `getStats` from `src/lib/projects`; `getProjectsByStage` from `src/data/projects`.
- Produces: stage badges and labels; `getStats()`-driven archive/home counts; no `status`/`phase` reads.

- [ ] **Step 1: Update the card test first**

In `tests/unit/ProjectCard.test.ts`:

- Change the in-progress test to use stage:

```ts
it('shows no progress value for living projects (#10)', async () => {
  const html = await render(makeProject({ stage: 'sprout' }));
  expect(html).not.toContain('width: 75%');
  expect(html).not.toContain('>75%<');
});
```

- Add:

```ts
it('renders the stage label and stage data attribute', async () => {
  const html = await render(makeProject({ stage: 'composted' }));
  expect(html).toContain('Composted');
  expect(html).toContain('data-stage="composted"');
});

it('renders Sprout for a living project', async () => {
  const html = await render(makeProject({ stage: 'sprout' }));
  expect(html).toContain('Sprout');
});
```

Run: `npx vitest run tests/unit/ProjectCard.test.ts`
Expected: FAIL — the card still renders `status` and has no stage label.

- [ ] **Step 2: Update `src/components/ProjectCard.astro`**

- Add the import:

```ts
import { stageLabel } from "../lib/stages";
```

- Replace `getStatusClass` with:

```ts
function getStageClass(stage: string) {
  const classes = {
    seed: "stage-seed",
    sprout: "stage-sprout",
    shipped: "stage-shipped",
    composted: "stage-composted",
  };
  return classes[stage as keyof typeof classes] || "stage-composted";
}
```

- Replace the badge markup:

```astro
<span class={getStageClass(project.stage)}>
  {stageLabel(project.stage)}
</span>
```

- [ ] **Step 3: Update `src/styles/global.css`**

Replace the four `.status-*` rules with:

```css
/* Stage badges for projects */
.stage-seed {
  @apply badge-warning;
}

.stage-sprout {
  @apply badge-primary;
}

.stage-shipped {
  @apply badge-success;
}

.stage-composted {
  @apply badge-gray;
}
```

- [ ] **Step 4: Update `src/components/ProjectDetail.astro`**

Replace:

```astro
<div><strong>Status:</strong> {project.status}</div>
```

with:

```astro
<div><strong>Stage:</strong> {project.stage}</div>
```

- [ ] **Step 5: Update `src/pages/learnt/[slug].astro`**

- Add the import:

```ts
import { stageLabel } from "../../lib/stages";
```

- Replace `statusStyles` with:

```ts
const stageStyles = {
  seed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  sprout: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  composted: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};
```

- Replace the header badge:

```astro
<span
  class={`px-3 py-1 text-sm font-medium rounded-full ${stageStyles[project.stage]}`}
  >{stageLabel(project.stage)}</span
>
```

- Replace the sunset condition:

```astro
project.stage === "composted" && project.died && (
```

- Replace the Quick Info block label and value:

```astro
<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
  Stage
</dt>
<dd
  class={`inline-flex items-center px-2.5 py-0.5 text-sm font-medium rounded-full mt-1 ${stageStyles[project.stage]}`}
>
  {stageLabel(project.stage)}
</dd>
```

- [ ] **Step 6: Update `src/pages/about.astro`**

Replace the import and selector:

```ts
import { getProjectsByStage } from "../data/projects";

const activeProjects = [
  ...getProjectsByStage("seed"),
  ...getProjectsByStage("sprout"),
];
```

- [ ] **Step 7: Update `src/pages/learnt.astro`**

- Replace the import:

```ts
import { getCardProjects, getCourseworkProjects } from "../data/projects";
import { getStats } from "../lib/projects";
```

- Replace `const stats = getProjectStats();` with `const stats = getStats();`.
- Replace the four stat cards with:

```astro
<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <div class="text-3xl font-bold text-accent">
    {stats.total}
  </div>
  <div class="text-sm text-gray-600 dark:text-gray-400">All Projects</div>
</div>

<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
    {stats.byStage.seed + stats.byStage.sprout}
  </div>
  <div class="text-sm text-gray-600 dark:text-gray-400">Growing</div>
</div>

<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <div class="text-3xl font-bold text-green-600 dark:text-green-400">
    {stats.byStage.shipped}
  </div>
  <div class="text-sm text-gray-600 dark:text-gray-400">Shipped</div>
</div>

<div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
    {stats.byStage.composted}
  </div>
  <div class="text-sm text-gray-600 dark:text-gray-400">Composted</div>
</div>
```

- [ ] **Step 8: Update `src/pages/index.astro`**

- Add the import:

```ts
import { getStats } from '../lib/projects';
```

- Add `const stats = getStats();` after `const featuredProjects = getFeaturedProjects();`.
- After the button row (inside the `max-w-3xl` div), add:

```astro
<p class="mt-6 text-sm text-gray-600 dark:text-gray-300">
  {stats.total} projects · {stats.byStage.shipped} shipped · {stats.byStage.composted} composted
</p>
```

- [ ] **Step 9: Run the component tests and typecheck**

Run:

```bash
npx vitest run tests/unit/ProjectCard.test.ts tests/unit/CourseworkList.test.ts
npm run typecheck
```

Expected: PASS; 0 type errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/ProjectCard.astro src/components/ProjectDetail.astro src/pages/learnt/[slug].astro src/pages/about.astro src/pages/learnt.astro src/pages/index.astro src/styles/global.css tests/unit/ProjectCard.test.ts
git commit -m "feat: render stage instead of status across the UI (#39)"
```

---

### Task 6: Update the e2e specs for stage

**Files:**
- Modify: `tests/e2e/about.spec.ts`
- Modify: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `projects` with `stage`; `getStats` from `src/lib/projects`.

- [ ] **Step 1: Update `tests/e2e/about.spec.ts`**

Replace the active filter:

```ts
const living = projects.filter((p) => p.stage === 'seed' || p.stage === 'sprout');

test('About lists every living project under "Currently building" (#14)', async ({ page }) => {
  await page.goto('/about/');
  const list = page.locator('h2:has-text("Currently building") ~ ul');
  await expect(list).toBeVisible();
  for (const project of living) {
    await expect(list.getByRole('link', { name: project.title, exact: true })).toHaveAttribute(
      'href',
      `/learnt/${project.slug}`,
    );
  }
});
```

- [ ] **Step 2: Update `tests/e2e/home.spec.ts`**

Replace the active-title filter:

```ts
const livingTitles = projects
  .filter((p) => p.stage === 'seed' || p.stage === 'sprout')
  .map((p) => p.title);
```

Use `livingTitles` in the Featured test.

Add the stats test:

```ts
import { getStats } from '../../src/lib/projects';

test('the hero stats come from getStats()', async ({ page }) => {
  const stats = getStats();
  await page.goto('/');
  await expect(
    page.getByText(
      `${stats.total} projects · ${stats.byStage.shipped} shipped · ${stats.byStage.composted} composted`,
    ),
  ).toBeVisible();
});
```

- [ ] **Step 3: Run the affected e2e specs**

Run:

```bash
npm run test:e2e -- tests/e2e/about.spec.ts tests/e2e/home.spec.ts tests/e2e/archive-filters.spec.ts tests/e2e/archive-render.spec.ts
```

Expected: PASS on desktop and mobile.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/about.spec.ts tests/e2e/home.spec.ts
git commit -m "test: cover stage-driven About and Home counts (#39)"
```

---

### Task 7: Full verification

**Files:**
- No production changes unless a verification step exposes a bug.

- [ ] **Step 1: Run the unit suite**

Run: `npm test`
Expected: PASS, all test files, 0 failures.

- [ ] **Step 2: Run the type checker**

Run: `npm run typecheck`
Expected: 0 errors (the three existing hints in `src/pages/learnt/[slug].astro` are allowed).

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: build completes with 0 errors; the schema validates all 42 entries.

- [ ] **Step 4: Run the full e2e suite**

Run: `npm run test:e2e`
Expected: all specs pass on desktop and mobile; the known skips are the mobile-only keyboard/data checks.

- [ ] **Step 5: Confirm no status/phase bridge remains**

Run:

```bash
grep -rn "project\.status\|project\.phase\|getProjectsByStatus\|getProjectsByPhase\|getProjectStats\|deriveStage" src tests || echo "no status/phase bridge"
```

Expected: `no status/phase bridge`.

- [ ] **Step 6: Confirm the working tree is clean**

Run: `git status --short`
Expected: no output. If a verification fix produced a change, commit it with a message naming the fix.

---

### Task 8: Review and finish the branch

**Files:**
- No production changes unless the review finds a real defect.

- [ ] **Step 1: Build the review package**

Run:

```bash
MERGE_BASE=$(git merge-base master HEAD)
"$HOME/.cache/opencode/npm/git-superpowers-4f58c7678957/1794069691410/node_modules/superpowers/skills/subagent-driven-development/scripts/review-package" \
  "docs/superpowers/plans/2026-11-07-stage-field.md" "$MERGE_BASE" HEAD
```

- [ ] **Step 2: Dispatch one fresh-context reviewer**

Use the `subagent` tool with `agent: "general"`, the review prompt from the requesting-code-review skill, the plan path, the merge-base/head SHAs, and the review package. The reviewer must check plan alignment, the 42-entry migration, the deferred #25 rules, the helper contracts, the UI surfaces, and the test coverage.

- [ ] **Step 3: Rule on every finding**

Fix real defects with a test first, rerun the full verification, and commit. Record accepted/deferred findings in the execution ledger with a one-line cost if wrong.

- [ ] **Step 4: Merge back to `master` locally**

The prior #20 integration choice was "Merge back to master locally"; reuse it unless the user says otherwise.

```bash
git checkout master
git pull
git merge feature/39-stage-field
npm test && npm run typecheck && npm run build && npm run test:e2e
git branch -d feature/39-stage-field
```

- [ ] **Step 5: Close #39 and hand the missing content to #25**

```bash
gh issue close 39 --comment "Implemented and merged to master. stage replaces status + phase across types, data, UI and selectors; projectSchema validates all 42 entries; strictProjectSchema encodes the content rules for #25; getLifespan/getLineage/getStats/getByYear landed in src/lib/projects.ts. Verification: 133+ unit tests, 0 type errors, build, full e2e."
gh issue comment 25 --body "Stage migration report: docs/content/39-stage-migration.md. 12 composted entries need causeOfDeath, 36 shipped/composted need outcome, and all 42 need epitaph. The strict schema is ready; enable it after this content lands."
```

---

## Handoff Notes

- The `outcome` and `composted causeOfDeath` requirements are intentionally in `strictProjectSchema`, not the schema applied to the real data. #25 is the content ticket that supplies them; after #25, switch the module-load validation from `projectSchema` to `strictProjectSchema` and add the real-data assertion.
- The migration script is a one-off. It imports the pre-#39 `status`/`phase` shape, so do not run it after Task 2. Keep it for audit until the next release.
- `src/lib/stages.ts` is the single source for labels, definitions, and icons. #40's `StageChip`/`StageLegend` should consume it rather than inventing a second map.
- `getByYear()` is ready for #21's timeline; it already splits each year by stage.
- If a future data entry is added with `stage: 'composted'` but no `died`, the build fails at module load with `<slug>.died: composted projects require died`.
