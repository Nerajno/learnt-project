# Tier and Proof-of-Work fields — design (issue #16)

## Intent

Add the VWC §3 proof-of-work fields to `Project` and give every entry a **tier**
so later tickets know how deep its page goes. This is a schema and triage slice:
the fields exist and every project is classified, but the prose stays unset for
the content pass (#25).

## Goals

- `tier: 'headstone' | 'marker' | 'coursework'` is required on all 42 entries.
- `outcome?`, `impact?`, `demoVideo?`, and `proof?` are typed but optional;
  no content is invented.
- Tier split: **5 headstones, 9 coursework, 28 markers**.
- Unit guards keep every tier valid and the counts coherent.
- No UI or rendering change in this ticket.

## Non-goals

- Writing `outcome`, `impact`, `epitaph`, or `causeOfDeath` — #25.
- The `deepDive` block — #17.
- The Astro content collection and Zod enforcement — #18.
- Card/detail rendering of the new fields — #19/#46.
- `stage` and the `causeOfDeath`/`tier` consistency rules — #39.

## Constraints

- Builds on #15's `born`/`died`; `status` and `phase` stay until #39.
- No new dependencies; the site stays static.
- Never invent metrics: `proof` keys stay unset until real values exist.
- `outcome`/`impact` are optional here even though the issue snippet shows them
  required, because #25 owns the copy; #18's Zod will require them for
  non-coursework entries once the content exists.

## Approaches

- **A. Additive schema + tier assignment (chosen).** Type the fields, classify
  all 42 entries, leave prose unset.
- **B. Schema + 42 outcome/impact lines now.** Coherent immediately, but
  duplicates #25 and risks invented copy.
- **C. `tier` optional for now.** Smallest diff, but fails #16's acceptance
  criterion that every entry has a tier.

## Tier assignment

| Tier | Slugs |
| ---- | ----- |
| headstone | `devconnector`, `trapper-keeper-v1`, `cs50p-final`, `fcc-d3-story`, `burble-v1` |
| coursework | `javascript30`, `100-days-of-code`, `fcc-calculator`, `fcc-d3-bars`, `assaggio-fcc`, `bravur-fcc`, `toppur-fcc`, `frontend-final-project`, `backend-final-project` |
| marker | the remaining 28 |

`fcc-d3-story` is a **headstone**, not coursework; it is removed from the FCC
coursework group. This is a product call and #25 may revise individual tiers.

## Schema

```ts
tier: 'headstone' | 'marker' | 'coursework';
outcome?: string;   // 3-1 what it did; TODO(#25)
impact?: string;    // 3-2 one-sentence impact; TODO(#25)
demoVideo?: string; // 3-4 for apps that no longer deploy
proof?: {           // 3-6 visual proof strip; leave keys unset when unknown
  tests?: string;
  lastDeploy?: string;
  lighthouse?: number;
  ci?: boolean;
};
```

`githubUrl` already covers 3-5; `liveUrl` covers part of 3-4.

## Migration

A one-off codemod inserts `tier` into each project block from a
`slug → tier` map (headstone and coursework sets; everyone else `marker`).
It must preserve comments, order, and every non-tier line. Verify 42 entries,
5/9/28 counts, and a clean diff.

## Testing

### Unit (`tests/unit/projects.test.ts`)

- every project has a tier in `{ headstone, marker, coursework }`;
- the three counts sum to `projects.length`;
- headstones number between 3 and 5 (the issue's range).

### Build

`npm run build` passes; no page changes are expected.

## Risks

- **Tier is a product call.** The split is isolated in one field per entry and
  #25 may revise it.
- **Optional prose could linger.** #18's Zod rules are the enforcement point;
  this ticket must not ship the impression that the content exists.
- **Codemod drift.** Guard with the counts, a slug diff, and a diff review.
- **fcc-d3-story conflict.** Resolved as headstone; recorded so #25 can revisit.
