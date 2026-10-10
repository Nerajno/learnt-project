Part of {{EPIC}} · Blocked by {{DATA}}, {{CHIP}}, {{LAYOUT}}

## Scope

Rebuild `src/pages/learnt/[slug].astro`, which is currently 849 lines. Split it into components under `src/components/project/`.

- **Header.**
  - Breadcrumb: `learnt / archive / {slug}`.
  - Chips: stage, category and difficulty.
  - H1 and the one-line description.
  - Epitaph line in `--amber-text` for Composted projects (otherwise `--muted`), e.g. "Planted May 4, 2025 · Composted June 1, 2025 · It was 28 days old."
- **Successor banner** (Composted with `supersededBy` only): "Superseded by **{title}**…" plus "Open the successor →".
- **Screenshot figure** with a caption (depends on {{SCREENSHOTS}}).
- **Proof of work** (`ProofOfWork.astro`): a 2×2 grid of The problem, What I built, Evidence and Outcome. Evidence lists the repo, the demo or "none (retired)", and the commit count if present.
- **What was hard** (from `challenges`), **What I learned** (from `learnings`), and **Retrospective** as a blockquote with an `--amber` left rule.
- **Sidebar** (stacks under the main content on mobile):
  - quick info: stage, planted, shipped/composted, lifespan;
  - stack chips;
  - a "View code" button;
  - a Lineage card from `getLineage()`.
- **Same soil:** three related projects that share technologies.
- **Prev/next** project navigation (chronological).
- **Remove** the Tweet/LinkedIn share buttons and the duplicate screenshot.

## Acceptance criteria

- [ ] `[slug].astro` is under 150 lines and composes the components above.
- [ ] Every section that has no data is hidden, not rendered empty.
- [ ] `side-project-status` matches the mockup in both themes.

## Testing

- **Unit:** the related-projects selector returns at most 3, never the project itself, ordered by shared-technology count; the prev/next helpers handle the first and last project.
- **End-to-end** across three fixture types:
  - a **Composted** project with a successor (`side-project-status`): the epitaph, the successor banner linking to `learnt-project`, and the lineage card all show;
  - a **Shipped** project with a demo (`trumma-drum-machine`): no successor banner, and the Demo link is present;
  - a **Sprout** project with little data (`github-profile`): empty sections are hidden, with no empty headings.
- **Every route:** a Playwright loop over all 42 slugs checks for a 200 response, one `<h1>`, a Proof of work section on Shipped and Composted projects, and no console errors.
- **Accessibility:** axe on the three fixture pages in both themes; the breadcrumb is `<nav aria-label="Breadcrumb">`; the blockquote is a real `<blockquote>`.
- **Visual:** the three fixture pages at 360px and 1280px, in both themes.

## Suggestions

- Add a `?ref=` back link: if the visitor came from a filtered archive view, "Back to archive" returns to that view.
- Add `Article`/`CreativeWork` JSON-LD with `dateCreated` and `dateModified` from the lifespan. It helps search engines and costs nothing.
- Add a "Spot something wrong? Tell me" link to `/contact?project={slug}` (see {{CONTACT}}).
- Later, the body of each `.md` file can hold a longer post-mortem below the structured sections.
