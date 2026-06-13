# TRD-134: Gate 0 Review Coverage Drift Guard

## Objective

Add an automated local guard that checks every assignment has QA_SECURITY, RISK, and ORCHESTRATOR
review records.

## Scope

Allowed:

- Add a local review coverage check script.
- Add tests for pass, missing-review, and unexpected-review cases.
- Add a package command and documentation.
- Update tracker and indexes.

Blocked:

- Trading guidance, broker integration, execution workflows, AI prediction, strategy performance
  claims, readiness claims, product launch claims, external publishing, or risk-gate changes.

## Required Output

- `scripts/check-gate0-review-coverage.ts`
- `packages/fixtures/tests/gate0-review-coverage-check.test.ts`
- `docs/operations/GATE0_REVIEW_COVERAGE_DRIFT_GUARD.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker and documentation indexes.

## Acceptance Criteria

- Guard fails when any assignment lacks QA_SECURITY, RISK, or ORCHESTRATOR review coverage.
- Guard fails when a review exists without a matching assignment.
- Guard passes on the current local review set.
- Gate 0 validation remains passing.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
