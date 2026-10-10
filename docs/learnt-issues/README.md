# Learnt — Garden ledger issues, merged into epic #32

The Garden ledger work (stages, proof of work, light and dark themes) goes into the existing epic **#32 "Learnt evidence graveyard"**, using the combined data model: `stage` sits **alongside** `causeOfDeath` and `tier` from #15/#16.

## Run it (from your machine)

```bash
cd learnt-issues/merge
python3 file_merged.py --dry-run   # preview everything in ./out; nothing is sent
python3 file_merged.py             # file it for real
```

You need the GitHub CLI, logged in (`gh auth login`). The script uses only REST calls (`gh api`). It's safe to re-run:
- issues are matched by title, so it won't create duplicates;
- comments carry a hidden `<!-- garden-ledger -->` marker, so it won't post twice;
- the #32 section is added once.

## What it does

**1. Creates 10 issues**, using the repo's existing labels:

| Issue | Labels |
|---|---|
| Bug: archive search and filters never work on the static build | bug, search, phase:1-fixes |
| Bug: every project screenshot 404s | bug, content, phase:1-fixes |
| Bug: contact form posts to /api/contact, which doesn't exist | bug, phase:1-fixes |
| Add `stage` field alongside causeOfDeath + tier | phase:2-schema, vwc:proof-of-work |
| Garden ledger: design tokens + light/dark theme | phase:3-ui, ux/ui |
| Garden ledger: StageChip + StageLegend | phase:3-ui, ux/ui |
| Garden ledger: layout shell | phase:3-ui, ux/ui |
| Garden ledger: Home page | phase:3-ui, ux/ui |
| Garden ledger: project detail page with Proof of work | phase:3-ui, vwc:proof-of-work |
| Garden ledger: accessibility + QA pass in light and dark | phase:1.5-testing |

Each one has its scope, acceptance criteria, testing criteria and suggestions.

**2. Comments on 12 existing issues** that overlap: #15, #16, #18, #19, #21, #22, #23, #25, #31, #34, #35, #36. Each comment adds the Garden ledger spec, testing criteria and suggestions, instead of filing a duplicate issue.

**3. Appends a "Garden ledger" section** to the #32 checklist, linking the new issues.

## Files

- `merge/*.md` — bodies of the new issues
- `merge/comments/<n>.md` — the comment for existing issue #n
- `merge/epic-append.md` — the section added to #32
- `issues/` — the original stand-alone 13-issue drafts, kept for reference only. Don't file them; they duplicate #32.
