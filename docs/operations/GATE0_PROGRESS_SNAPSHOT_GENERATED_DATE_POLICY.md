# Gate 0 Progress Snapshot Generated Date Policy

## Purpose

This document records how the local progress snapshot chooses its generated date.

It does not publish reports, change gate status, approve strategies, or create an execution path.

## Policy

- Tests pass an explicit `generatedAt` value into the snapshot creator.
- Local generation reads `GATEZERO_SNAPSHOT_DATE` when set.
- If no override is set, local generation uses the current ISO date from the runtime clock.

This keeps tests deterministic while allowing the generated snapshot to identify the actual local
generation date.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Generator: `scripts/generate-gate0-progress-snapshot.ts`
- Tests: `packages/fixtures/tests/gate0-progress-snapshot-generator.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-168_PROGRESS_SNAPSHOT_GENERATED_DATE_POLICY.md`
- Reviews: `ops/runtime/reviews/TRD-168_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-168_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-168_ORCHESTRATOR_ACCEPTANCE.md`
