Part of {{EPIC}} · Blocked by {{TOKENS}}, {{DATA}}

## Scope

Build one `StageChip.astro` component, used on every card, list row and detail header.

| Stage | Icon | Style |
|---|---|---|
| Seed | ○ | dashed `--seed-dash` border, `--soft` text |
| Sprout | ◐ | `--accent` fill, `--on-accent` text |
| Shipped | ● | `--teal` fill, `--on-accent` text |
| Composted | ✕ | `--amber` fill, `--on-accent` text |

- Text is IBM Plex Mono, 12px, uppercase, `letter-spacing: .06em`, pill-shaped.
- The label is always visible text. Colour is never the only signal.
- Also build `StageLegend.astro`: four cards, each with a chip and one line of definition (copy is in the mockup). It's used on Home and About.

## Acceptance criteria

- [ ] One component handles all four stages; no chip markup is duplicated anywhere else.
- [ ] Chip text is readable in both themes. Fill colours stay the same across themes; text stays `--on-accent`.

## Testing

- **Component test** (Astro container API with Vitest, `experimental_AstroContainer`): render each stage and check the label text, the icon, and the expected class or `data-stage` attribute.
- **Contrast:** for each fill colour, `--on-accent` on that fill must reach 4.5:1. Add these pairs to the token test from {{TOKENS}}.
- **Visual:** a Playwright screenshot of a fixture page showing all four chips and the legend, in both themes.
- **Accessibility:** axe on the fixture page; the icon glyph gets `aria-hidden="true"`, so screen readers only read the label.

## Suggestions

- Put the icon in a `<span aria-hidden="true">` and keep the text as the accessible name.
- Export a `STAGES` map (label, icon, definition) from one file. The chip, the legend, the filters and the About copy then all read from the same source.
- Optionally add `title`/tooltip text with the stage definition on hover, but never rely on it.
