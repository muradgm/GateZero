# Gate 0 Review Coverage Drift Guard

## Purpose

This guard checks that every local Gate 0 assignment has the required QA_SECURITY, RISK, and
ORCHESTRATOR review records.

It is a local coverage guard only. It does not authorize trading, broker integration, autonomous
execution, AI prediction, product expansion, external publishing, later-phase movement, or risk-gate
loosening.

## Command

```powershell
pnpm check:gate0-reviews
```

## Checked Coverage

The guard compares packet ids from:

- `ops/assignments/TRD-*.md`
- `ops/runtime/reviews/TRD-*_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-*_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-*_ORCHESTRATOR_ACCEPTANCE.md`

It fails when a required review is missing or when a review record exists without a matching
assignment.

## Current Result

The current local record set passes:

- Assignments: 134.
- QA_SECURITY reviews: 134.
- RISK reviews: 134.
- ORCHESTRATOR acceptances: 134.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-134_GATE0_REVIEW_COVERAGE_DRIFT_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-134_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-134_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-134_ORCHESTRATOR_ACCEPTANCE.md`
- Guard source: `scripts/check-gate0-review-coverage.ts`
- Test source: `packages/fixtures/tests/gate0-review-coverage-check.test.ts`
