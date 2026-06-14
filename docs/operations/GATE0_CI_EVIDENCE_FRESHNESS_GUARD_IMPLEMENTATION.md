# Gate 0 CI Evidence Freshness Guard Implementation

## Purpose

This record documents the standalone local guard for Gate 0 CI evidence freshness.

Command:

```powershell
pnpm check:gate0-ci-evidence
```

## Checks

- Finds Gate 0 GitHub CI evidence documents.
- Parses the latest evidence record by `Updated` timestamp.
- Requires `Gate 0 Verification`, `push`, `completed`, and `success`.
- Requires the run URL to include the recorded run id.
- Requires the evidence commit to exist in local git history.
- Requires the latest evidence age to be no more than 14 days.

## Boundary

This command is intentionally standalone and is not part of `pnpm verify:gate0`.

It does not authorize deployment, broker access, execution, AI prediction, strategy approval,
readiness claims, profitability claims, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-185_CI_EVIDENCE_FRESHNESS_GUARD_IMPLEMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-185_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-185_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-185_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-ci-evidence-freshness.ts`
- Guard tests: `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`
- Proposal: `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`
- Tracker: `ops/runtime/tracklist.md`
