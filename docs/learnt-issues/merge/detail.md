Part of #32 · Phase 3 (UI) · Blocked by {{STAGE}}, {{CHIP}}, {{LAYOUT}} · Related: #23 (superseded chains), #24 (headstone deep-dive layout)

## Scope

Rebuild `src/pages/learnt/[slug].astro`, currently 849 lines, as the Garden ledger **marker** page. Headstones get #24's deep-dive layout on top of it, and coursework can use a slim variant. Split it into components under `src/components/project/`.

- **Header.**
  - Breadcrumb: `learnt / archive / {slug}`.
  - Chips: stage (with cause), category and tier.
  - H1 and the one-line description.
  - Epitaph line (`--amber-text` when Composted): "Born May 4, 2025 · Composted June 1, 2025 · It was 28 days old."
- **Successor banner** (when `supersededBy` is set): "Superseded by **{title}**" plus "Open the successor →". This is #23's surface.
- **Screenshot or demo video** (`demoVideo` from #16 when the app no longer deploys).
- **Proof of work** (`ProofOfWork.astro`), mapped to the #16 fields:
  - **Outcome** (3-1);
  - **Impact** (3-2);
  - **Evidence**: repo (3-5), live demo or demo video (3-4), and the proof strip (3-6): tests, last deploy, Lighthouse, CI — each shown only when set; never invent a metric;
  - **Epitaph**.
- **What was hard** (`challenges`), **What I learned** (`learnings`), **Retrospective** as a blockquote with an `--amber` rule.
- **Sidebar:** quick info (stage, born, died, lifespan), stack chips, View code, and a lineage card from `getLineage()`.
- **Same soil:** three related projects by shared technology. Then prev/next.
- **Remove** the share buttons and the duplicate screenshot (closes #12).

Mockups: "A · Project" and "A light · Project" (https://claude.ai/artifact/LxvPxhbwkX4S9CDfpnyWVe).

## Acceptance criteria

- [ ] `[slug].astro` is under 150 lines and composes the components above.
- [ ] Empty sections are hidden, never rendered blank.
- [ ] `side-project-status` matches the mockup in light and dark.

## Testing

- **Unit:** the related selector returns at most 3, never the project itself, ordered by overlap; prev/next handle the first and last project.
- **End-to-end** across three fixture types:
  - **Composted + superseded** (`side-project-status`): epitaph, banner and lineage all show;
  - **Shipped with a demo** (`trumma-drum-machine`): no banner, and the Demo link is present;
  - **Sprout with sparse data** (`github-profile`): no empty headings.
- **Every route:** a loop over all slugs checks for a 200 response, one `<h1>`, a Proof of work section on Shipped and Composted projects, and no console errors. This extends #35's frozen-slug contract.
- **Accessibility:** axe in both themes; the breadcrumb is `<nav aria-label="Breadcrumb">`.
- **Visual:** the three fixtures at 360px and 1280px, light and dark.

## Suggestions

- Add a "Spot something wrong? Tell me" link to `/contact?project={slug}` (see {{CONTACT}}).
- Remember the archive filters the visitor came from, so "Back to archive" returns to that same filtered view.
- #28's JSON-LD can be built from the same props that feed this page.
