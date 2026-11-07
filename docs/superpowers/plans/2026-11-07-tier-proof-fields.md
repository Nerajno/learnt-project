# Tier and Proof-of-Work Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every project an explicit `tier` and add the optional VWC §3 proof-of-work fields, without inventing any content.

**Architecture:** Add the fields to the `Project` type, run a one-off codemod that inserts an explicit `tier` into all 42 entries from a slug map, and guard the result with unit tests. `outcome`, `impact`, `demoVideo`, and `proof` stay unset for #25/#18.

**Tech Stack:** TypeScript, Vitest 3.2, Astro 5.13.

**Spec:** `docs/superpowers/specs/2026-11-07-tier-proof-fields-design.md`

## Global Constraints

- Exactly 42 projects; every one gets an explicit `tier`.
- Tier values are exactly `headstone`, `marker`, `coursework`; no other value.
- Headstones: `devconnector`, `trapper-keeper-v1`, `cs50p-final`, `fcc-d3-story`, `burble-v1`.
- Coursework: `javascript30`, `100-days-of-code`, `fcc-calculator`, `fcc-d3-bars`, `assaggio-fcc`, `bravur-fcc`, `toppur-fcc`, `frontend-final-project`, `backend-final-project`.
- Everyone else is `marker` (28 projects).
- `outcome`, `impact`, `demoVideo`, `proof` are optional and must stay unset; do not invent content or placeholder values.
- `fcc-d3-story` is a headstone and is not in the coursework group.
- No UI, content-collection, `deepDive`, or `stage` changes; `status`/`phase` stay until #39.
- No new dependencies. Preserve comments, grouping, slug order, and every non-tier line.
- E2E is not required for this ticket; the build and unit guards are the gate.

## Review Focus

- A project with no `tier` must fail the guard, not silently behave like a marker.
- Tier counts must always sum to the number of projects.
- The codemod must not drop, duplicate, reorder, or alter any project or non-tier field.
- `fcc-d3-story` must be a headstone exactly once and never also coursework.
- Optional proof content must remain absent; no placeholder metrics may ship.

## Before Task 1

Run `npm install`.

---

### Task 1: Add tier and proof-of-work fields, then classify every project

**Files:**
- Modify: `src/data/projects.ts` (type block + 42 entries)
- Create: `scripts/migrate-tiers.mjs` (temporary, deleted after use)
- Modify: `tests/unit/projects.test.ts`

**Interfaces:**
- Produces: `Project.tier: 'headstone' | 'marker' | 'coursework'`, `Project.outcome?`, `Project.impact?`, `Project.demoVideo?`, `Project.proof?: { tests?: string; lastDeploy?: string; lighthouse?: number; ci?: boolean }`.

- [ ] **Step 1: Write the failing guard tests**

Add to `tests/unit/projects.test.ts`:

```ts
describe('tiers (#16)', () => {
  const tierValues = ['headstone', 'marker', 'coursework'] as const;

  it('every project has an explicit valid tier', () => {
    for (const project of projects) {
      expect(tierValues).toContain(project.tier);
    }
  });

  it('tier counts sum to every project', () => {
    const total = tierValues
      .map((tier) => projects.filter((p) => p.tier === tier).length)
      .reduce((sum, count) => sum + count, 0);
    expect(total).toBe(projects.length);
  });

  it('has three to five headstones', () => {
    const headstones = projects.filter((p) => p.tier === 'headstone').length;
    expect(headstones).toBeGreaterThanOrEqual(3);
    expect(headstones).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: FAIL — `project.tier` is undefined on every entry.

- [ ] **Step 3: Add the schema fields**

In `src/data/projects.ts`, after `epitaph?: string;`, add:

```ts
  tier: 'headstone' | 'marker' | 'coursework';
  outcome?: string; // 3-1 what it did; TODO(#25)
  impact?: string; // 3-2 one-sentence impact; TODO(#25)
  demoVideo?: string; // 3-4 for apps that no longer deploy
  proof?: {
    // 3-6 visual proof strip; leave keys unset when unknown
    tests?: string;
    lastDeploy?: string;
    lighthouse?: number;
    ci?: boolean;
  };
```

- [ ] **Step 4: Run the tier codemod**

Create `scripts/migrate-tiers.mjs`:

```js
// One-off #16 tier migration. Run: node scripts/migrate-tiers.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const headstones = new Set([
  'devconnector',
  'trapper-keeper-v1',
  'cs50p-final',
  'fcc-d3-story',
  'burble-v1',
]);

const coursework = new Set([
  'javascript30',
  '100-days-of-code',
  'fcc-calculator',
  'fcc-d3-bars',
  'assaggio-fcc',
  'bravur-fcc',
  'toppur-fcc',
  'frontend-final-project',
  'backend-final-project',
]);

const file = new URL('../src/data/projects.ts', import.meta.url);
const lines = readFileSync(file, 'utf8').split('\n');
const out = [];
let block = null;

function flush() {
  if (!block) return;
  const slug = block.join('\n').match(/^ {4}slug: '([^']+)'/m)?.[1];
  if (!slug) throw new Error('Project block without a slug');
  const tier = headstones.has(slug)
    ? 'headstone'
    : coursework.has(slug)
      ? 'coursework'
      : 'marker';
  for (const line of block) {
    out.push(line);
    if (/^ {4}born: /.test(line)) out.push(`    tier: '${tier}',`);
  }
  block = null;
}

for (const line of lines) {
  if (line === '  {') block = [];
  if (block) {
    block.push(line);
    if (line === '  },') flush();
  } else {
    out.push(line);
  }
}

writeFileSync(file, out.join('\n'));
```

Run it, then delete it:

```bash
node scripts/migrate-tiers.mjs
rm scripts/migrate-tiers.mjs
```

- [ ] **Step 5: Verify the migration**

Run:

```bash
node --experimental-strip-types -e "import {projects} from './src/data/projects.ts'; const c=t=>projects.filter(p=>p.tier===t).length; console.log('total',projects.length,'headstone',c('headstone'),'coursework',c('coursework'),'marker',c('marker'))"
diff <(git show HEAD:src/data/projects.ts | grep -o "^    slug: '[^']*'") <(grep -o "^    slug: '[^']*'" src/data/projects.ts)
git diff --stat src/data/projects.ts
```

Expected: `total 42 headstone 5 coursework 9 marker 28`; the slug diff is
empty; the diff adds only `tier` lines (plus the type block).

- [ ] **Step 6: Run the guard tests**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: PASS.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: build completes with 0 errors.

- [ ] **Step 8: Commit**

```bash
git add src/data/projects.ts tests/unit/projects.test.ts
git commit -m "feat: classify projects by tier and add proof fields"
```
