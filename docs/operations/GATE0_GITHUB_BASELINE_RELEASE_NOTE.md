# Gate 0 GitHub Baseline Release Note

## Status

`private baseline`

## Summary

GateZero now has a private GitHub baseline with local and CI verification for the Gate 0
Research-Only control plane.

This is not a trading release, deployment release, paper-trading release, strategy release, or
performance claim.

## Included Baseline Controls

- Private canonical GitHub repository: `https://github.com/muradgm/GateZero.git`
- GitHub Actions workflow for `pnpm verify:gate0`
- Handoff and clone runbook for future operators
- Agent manifest drift guard
- Repository hygiene guard

## Boundary

The baseline remains:

```text
G0_RESEARCH
research_only
```

The baseline does not authorize live trading, broker integration, autonomous execution, AI buy/sell
prediction, paper execution mechanics, broker API keys, strategy profitability claims, readiness
claims, public marketing claims, or risk-gate loosening.

## Source Links

- Source packet: `ops/assignments/TRD-176_GITHUB_BASELINE_RELEASE_NOTE.md`
- Reviews: `ops/runtime/reviews/TRD-176_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-176_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-176_ORCHESTRATOR_ACCEPTANCE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Handoff runbook: `docs/operations/GATE0_GITHUB_REPO_HANDOFF_AND_CLONE_RUNBOOK.md`
- Agent guard: `docs/operations/GATE0_AGENT_MANIFEST_DRIFT_GUARD.md`
- Repo hygiene guard: `docs/operations/GATE0_REPO_HYGIENE_GUARD.md`
- Tracker: `ops/runtime/tracklist.md`
