

<!-- garden-ledger -->
## Garden ledger (design + light/dark)

This is the visual layer for the graveyard: the dark ledger palette with a matching light theme, and stage chips (Seed, Sprout, Shipped, Composted) that sit alongside `causeOfDeath` and `tier`. Mockups: https://claude.ai/artifact/LxvPxhbwkX4S9CDfpnyWVe (rows "A · Garden ledger" and "A · Garden ledger — light"; private until shared).

**Bugs found on the live site (phase 1):**
- [ ] {{FILTERS}} archive filters never work on the static build (blocks #22)
- [ ] {{SCREENSHOTS}} every project screenshot 404s
- [ ] {{CONTACT}} contact form posts to a missing endpoint

**Schema (phase 2):**
- [ ] {{STAGE}} `stage` field + consistency rules with `causeOfDeath` / `tier`

**UI (phase 3):**
- [ ] {{TOKENS}} design tokens + light/dark theme
- [ ] {{CHIP}} StageChip + StageLegend
- [ ] {{LAYOUT}} layout shell
- [ ] {{HOME}} Home page
- [ ] {{DETAIL}} project detail page with Proof of work

**Last:**
- [ ] {{QA}} accessibility + QA pass in light and dark

The Garden ledger spec, testing criteria and suggestions were also added as comments on #15, #16, #18, #19, #21, #22, #23, #25, #31, #34, #35 and #36.
