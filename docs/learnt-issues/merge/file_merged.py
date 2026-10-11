"""File the Garden ledger issues into epic #32 of Nerajno/learnt-project (REST only)."""
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = "Nerajno/learnt-project"
HERE = Path(__file__).parent

ISSUES = [
    ("TOKENS", "tokens.md", "Garden ledger: design tokens + light/dark theme", ["enhancement", "ux/ui", "phase:3-ui"]),
    ("STAGE", "stage.md", "Add `stage` field (Seed/Sprout/Shipped/Composted) alongside causeOfDeath + tier", ["enhancement", "phase:2-schema", "vwc:proof-of-work"]),
    ("CHIP", "chip.md", "Garden ledger: StageChip + StageLegend components", ["enhancement", "ux/ui", "phase:3-ui"]),
    ("LAYOUT", "layout.md", "Garden ledger: restyle layout shell (header, nav, theme toggle, footer)", ["enhancement", "ux/ui", "phase:3-ui"]),
    ("FILTERS", "filters-bug.md", "Bug: archive search and filters never work on the static build", ["bug", "search", "phase:1-fixes"]),
    ("SCREENSHOTS", "screenshots.md", "Bug: every project screenshot 404s (/images/screenshots/ missing)", ["bug", "content", "phase:1-fixes"]),
    ("CONTACT", "contact.md", "Bug: contact form posts to /api/contact, which doesn't exist", ["bug", "phase:1-fixes"]),
    ("HOME", "home.md", "Garden ledger: rebuild Home page", ["enhancement", "ux/ui", "phase:3-ui"]),
    ("DETAIL", "detail.md", "Garden ledger: rebuild project detail page with Proof of work", ["enhancement", "phase:3-ui", "vwc:proof-of-work"]),
    ("QA", "qa.md", "Garden ledger: accessibility + QA pass in light and dark", ["enhancement", "phase:1.5-testing"]),
]


def gh(*args, payload=None):
    cmd = ["gh", "api", *args]
    if payload is not None:
        cmd += ["--input", "-"]
    res = subprocess.run(cmd, input=json.dumps(payload) if payload is not None else None,
                         capture_output=True, text=True)
    if res.returncode != 0:
        sys.exit(f"gh api {' '.join(args)} failed: {res.stderr.strip() or res.stdout.strip()}")
    return json.loads(res.stdout) if res.stdout.strip() else None


def existing_titles():
    out = {}
    page = 1
    while True:
        batch = gh(f"repos/{REPO}/issues?state=all&per_page=100&page={page}")
        if not batch:
            return out
        for it in batch:
            out[it["title"]] = it["number"]
        page += 1


MARKER = "<!-- garden-ledger -->"
EPIC = 32
DRY_RUN = "--dry-run" in sys.argv


def fill(text, nums, name):
    for k, n in nums.items():
        text = text.replace("{{" + k + "}}", f"#{n}")
    left = re.findall(r"\{\{\w+\}\}", text)
    if left:
        sys.exit(f"{name}: unfilled placeholders {left}")
    return text


def main():
    out = HERE / "out"
    if DRY_RUN:
        out.mkdir(exist_ok=True)
        print(f"Dry run: rendered text goes to {out}; nothing is sent to GitHub.")

    # 1. Create (or find) the new issues.
    have = {} if DRY_RUN else existing_titles()
    nums = {}
    for i, (key, _, title, labels) in enumerate(ISSUES):
        if DRY_RUN:
            nums[key] = 900 + i
        elif title in have:
            nums[key] = have[title]
            print(f"exists   #{nums[key]}  {title}")
        else:
            made = gh(f"repos/{REPO}/issues", "--method", "POST",
                      payload={"title": title, "labels": labels, "body": "Draft — details are being added."})
            nums[key] = made["number"]
            print(f"created  #{nums[key]}  {title}")

    # 2. Write their real bodies, with cross-links filled in.
    for key, fname, title, labels in ISSUES:
        body = fill((HERE / fname).read_text(), nums, fname)
        if DRY_RUN:
            (out / f"{nums[key]}-{fname}").write_text(f"# {title}\nLabels: {', '.join(labels)}\n\n{body}")
        else:
            gh(f"repos/{REPO}/issues/{nums[key]}", "--method", "PATCH", payload={"body": body})

    # 3. Comment on the existing issues that overlap (once each).
    for path in sorted((HERE / "comments").glob("*.md"), key=lambda p: int(p.stem)):
        n = int(path.stem)
        text = MARKER + "\n" + fill(path.read_text(), nums, path.name)
        if DRY_RUN:
            (out / f"comment-on-{n}.md").write_text(text)
            continue
        existing = gh(f"repos/{REPO}/issues/{n}/comments?per_page=100") or []
        if any(MARKER in (c.get("body") or "") for c in existing):
            print(f"skipped  comment on #{n} (already there)")
            continue
        gh(f"repos/{REPO}/issues/{n}/comments", "--method", "POST", payload={"body": text})
        print(f"comment  #{n}")

    # 4. Append the Garden ledger section to epic #32 (once).
    section = fill((HERE / "epic-append.md").read_text(), nums, "epic-append.md")
    if DRY_RUN:
        (out / f"epic-{EPIC}-append.md").write_text(section)
    else:
        epic = gh(f"repos/{REPO}/issues/{EPIC}")
        if MARKER in (epic.get("body") or ""):
            print(f"skipped  epic #{EPIC} (section already there)")
        else:
            gh(f"repos/{REPO}/issues/{EPIC}", "--method", "PATCH",
               payload={"body": (epic.get("body") or "").rstrip() + "\n" + section})
            print(f"updated  epic #{EPIC}")

    print("Done." + ("" if DRY_RUN else f" https://github.com/{REPO}/issues/{EPIC}"))


if __name__ == "__main__":
    main()
