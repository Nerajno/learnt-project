Part of #32 · Phase 3 (UI) · Blocked by {{TOKENS}}, {{STAGE}}

## Scope

Build one `StageChip.astro` component for every card, list row and detail header, plus `StageLegend.astro` for Home and About. Both read from the `STAGES` map in {{STAGE}}.

| Stage | Icon | Style |
|---|---|---|
| Seed | ○ | dashed `--seed-dash` border, `--soft` text |
| Sprout | ◐ | `--accent` fill, `--on-accent` text |
| Shipped | ● | `--teal` fill, `--on-accent` text |
| Composted | ✕ | `--amber` fill, `--on-accent` text, optional cause sub-label ("Composted · superseded") |

- Text is IBM Plex Mono, 12px, uppercase, pill-shaped. The icon sits in `<span aria-hidden="true">`.
- Never colour-only: the label is always visible text.
- `StageLegend` is four cards, each with a chip and a one-line definition: "Four stages, no shame".

Mockups: rows "A · Garden ledger" and "A · Garden ledger — light" (https://claude.ai/artifact/LxvPxhbwkX4S9CDfpnyWVe, private until shared).

## Acceptance criteria

- [ ] One component covers all stages and the cause sub-label; no chip markup is duplicated elsewhere.
- [ ] Chip text reaches 4.5:1 contrast on every fill in both themes.
- [ ] The tombstone card (#19) and the detail header use this chip.

## Testing

- **Component test** (Vitest + Astro Container API, as set up in #34): render each stage and Composted-with-each-cause. Assert the label text, `data-stage`, and that the icon is `aria-hidden`.
- **Contrast:** add each `--on-accent`-on-fill pair to the token contrast test in {{TOKENS}}.
- **Visual:** a Playwright screenshot of a fixture page showing every variant and the legend, in light and dark.
- **Accessibility:** axe on the fixture page in both themes.

## Suggestions

- Keep the chip purely presentational: it takes `stage` and `cause` props only and does no lookups.
- A `title` tooltip with the stage definition is fine as an extra, but never the only explanation.
