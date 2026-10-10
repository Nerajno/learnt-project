Part of {{EPIC}} · Blocked by {{DATA}}

## Why

The new schema fails the build when a Shipped or Composted project has no proof of work. This issue tracks filling in the content for every project.

For each project, set or confirm:
- the stage;
- the lifespan dates (`planted`, `shippedOn`, `compostedOn`);
- lineage (`supersededBy` / `fedInto`);
- `proof.problem`, `proof.built`, `proof.outcome`;
- the repo link;
- a demo if one still runs;
- a retrospective for Composted projects.

**Flagged for review:**
- `side-project-status` and `burble-v1` are `completed` + `sunset`, so they migrate to Composted. Confirm that's right.
- Only 2 of 42 projects have a `liveUrl`. Check whether any more demos still run.

The proposed stage below comes from the migration mapping in {{DATA}}.

### Sprout (in progress)
- [ ] portfolio-v3 — Portfolio V3
- [ ] learnt-project — Learnt Project
- [ ] digital-garden — Digital Garden
- [ ] is-nerando-done-yet — Is Nerando Done Yet
- [ ] digital-mausoleum — My Digital Mausoleum
- [ ] github-profile — GitHub Profile README

### Composted
- [ ] learnt-v2 — Learnt V2 → superseded by learnt-project
- [ ] learnt-v1 — Learnt V1 → superseded by learnt-v2
- [ ] side-project-status — Side Project Status Tracker → superseded by learnt-project (review)
- [ ] burble-v1 — Burble V1 (review: Shipped or Composted?)
- [ ] portfolio-2023 — Current Portfolio 2023 → superseded by portfolio-v3?
- [ ] hosted-blog-v3 — Hosted Blog V3
- [ ] astro-blog — Astro Blog
- [ ] nextjs-mdx-blog — MDX Blog with Next.js
- [ ] freecodecamp-fork — FreeCodeCamp Fork
- [ ] dotnet-tools — .NET Tools Exploration
- [ ] yup-nosey — Yup Nosey
- [ ] gulp-jest — Gulp Jest Plugin

### Shipped
- [ ] fcc-calculator — FreeCodeCamp Calculator
- [ ] trumma-drum-machine — Drum Machine - Trumma
- [ ] javascript30 — JavaScript30
- [ ] vue-conf-workshop — Vue Conference Workshop
- [ ] fcc-d3-bars — FCC D3 Bar Chart
- [ ] fcc-d3-story — FCC D3 Story
- [ ] vue-holiday-card — Vue Holiday Card Maker
- [ ] assaggio-fcc — Assaggio FCC Project
- [ ] bravur-fcc — bRavur FCC Project
- [ ] toppur-fcc — Toppur FCC Project
- [ ] cv-website — CV Website (currently `active`; Sprout or Shipped?)
- [ ] trapper-keeper-v1 — Trapper Keeper V1
- [ ] devconnector — DevConnector 2.0
- [ ] frontend-final-project — Frontend Final Project
- [ ] backend-final-project — Backend Final Project
- [ ] native-treats-api — Native Treats API
- [ ] jpmc-forage — JP Morgan Forage Program
- [ ] cs50p-final — CS50P Final Project
- [ ] 100-days-of-code — 100 Days of Code Log
- [ ] redux-reducer-exercise — Redux Reducer Bootcamp Exercise
- [ ] folkmusic-contribution — Folkmusic Contribution
- [ ] github-actions-ci — GitHub Actions for CI
- [ ] connect-tech-2021 — Connect Tech 2021 Conference App
- [ ] tdd-big-picture — TDD Big Picture

## Acceptance criteria

- [ ] `astro build` passes with the schema rules on and no exceptions.
- [ ] Every Composted project has lineage or a retrospective.

## Testing

- **Build:** `astro build` with the strict schema from {{DATA}}. That's the main gate.
- **Unit:**
  - every `supersededBy` / `fedInto` reference points to an existing project;
  - no project supersedes itself;
  - lineage has no cycles;
  - `compostedOn` and `shippedOn` are on or after `planted`;
  - no dates are in the future.
- **Content lint:** fail CI if any entry contains `[` placeholders, "TODO" or "lorem".
- **Links:** run `lychee` against every `githubUrl` and `liveUrl`. Dead demos become "Demo: none (retired)", not broken links.
- **Spot review:** read five random detail pages on the deploy preview, and check the proof reads like a person wrote it.

## Suggestions

- Do it in batches of about 10 projects per PR, newest first. The PRs stay reviewable, and the archive improves visibly as you go.
- Keep each proof field to 1–2 sentences. The structure does the work; the long story goes in the `.md` body.
- Use `gh api repos/{owner}/{repo}/commits` to pull real commit counts and first/last commit dates for `planted` and `compostedOn`. That's actual evidence, not memory.
- It's fine for some Composted entries to say "fed into nothing yet". Honesty is the point of the archive.
