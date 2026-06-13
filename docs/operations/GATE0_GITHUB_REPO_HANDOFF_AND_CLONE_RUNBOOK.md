# Gate 0 GitHub Repo Handoff And Clone Runbook

## Purpose

This runbook gives a future operator the minimum private-repo handoff path for GateZero while
preserving Gate 0 Research Only boundaries.

## Repository

```text
https://github.com/muradgm/GateZero.git
```

The repository is private. Access must stay limited to trusted operators.

## Fresh Clone Sequence

```powershell
git clone https://github.com/muradgm/GateZero.git
cd GateZero
corepack enable
pnpm install --frozen-lockfile
pnpm verify:gate0
```

## Expected Result

- Dependencies install from the lockfile.
- Gate 0 guards, lint, format, typecheck, and tests pass.
- The repo remains at `G0_RESEARCH` and `research_only`.

## Failure Triage

If verification fails, inspect the failing command first. Do not loosen gates, remove checks, add
allowlist entries, or change risk language merely to make verification pass.

Escalate to QA_SECURITY for guard, formatting, secret, or forbidden-pattern failures. Escalate to
RISK for any wording or artifact that implies approval, readiness, profitability, execution, or gate
movement.

## Source Links

- Source packet: `ops/assignments/TRD-173_GITHUB_REPO_HANDOFF_AND_CLONE_RUNBOOK.md`
- Reviews: `ops/runtime/reviews/TRD-173_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-173_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-173_ORCHESTRATOR_ACCEPTANCE.md`
- Verification command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
