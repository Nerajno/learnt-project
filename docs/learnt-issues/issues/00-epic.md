## Goal

Rebuild learnt.developingdvlpr.com as the **Garden ledger**: a Killed-by-Google-style archive where every project has a stage, a lifespan, its lineage, and proof of work. It ships with both a dark theme and a light theme.

Mockups: Learnt Rebuild Mockups canvas, rows "A · Garden ledger" and "A · Garden ledger — light" (https://claude.ai/artifact/LxvPxhbwkX4S9CDfpnyWVe, private until shared).

## What changes

- **Stages replace status + phase.** Each project is one of Seed, Sprout, Shipped or Composted, with a lifespan (planted → shipped → composted) and lineage (superseded by / fed into).
- **Proof of work on every project.** The problem, what I built, the evidence and the outcome, following the Vets Who Code portfolio checklist's evidence-of-work section.
- **New visual system.** Dark green "ledger" palette with a matching light palette; Space Grotesk, IBM Plex Sans and IBM Plex Mono.
- **Every page rebuilt:** Home, Archive (`/learnt`), Project detail, About and Contact.
- **Three existing bugs fixed:** archive filters, the contact form and missing screenshots.

## Work items

<!-- TASKLIST -->

## Suggested order

1. Test harness, tokens and theme, and the data model (these can run in parallel).
2. Stage chip, then layout shell.
3. Pages: Home, Archive, Project detail, About, Contact.
4. Content audit (can start once the data model lands).
5. Accessibility and QA pass last.

## Testing strategy

- **Unit (Vitest):** data helpers, schema rules and filter logic.
- **End-to-end (Playwright):** every page at 360px and 1280px, in light and dark.
- **Accessibility:** axe on every page in both themes, plus a manual keyboard pass and screen-reader spot checks.
- **Visual:** one screenshot test per page per theme.
- **CI:** check, then test, then build, then e2e on every PR (see {{HARNESS}}). Netlify deploy previews for form and redirect checks.

## Suggestions

- Ship it as one feature branch with a PR per issue. Or put the new pages behind `/v2/` until the content audit is done, then swap them in.
- Track the epic on a GitHub Project board with columns Seed → Sprout → Shipped. It suits the theme and keeps the work visible.
- Write the two planned articles (what a learning garden is; why seedling/budding/evergreen became stages) alongside the build, and link them from About.
- Log each finished issue on isnerandodoneyet.com, so the rebuild is its own proof of work.

## Done when

- All five pages match the mockups in both themes.
- Every Shipped or Composted project passes the proof-of-work check (the build fails otherwise).
- WCAG 2.2 AA holds in both themes, and pages work at 360px width.
