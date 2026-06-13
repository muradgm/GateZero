# Gate 1 Contract Validation Guard

## Purpose

This document records the local Gate 1 contract guard.

The guard checks local docs, source files, tests, fixtures, package scripts, tracker links, and
schema-only boundary literals. It does not fetch data, run strategy logic, publish reports, approve
strategies, move gates, or loosen risk controls.

## Command

```powershell
pnpm check:gate1-contracts
```

## Implemented Sources

- Script: `scripts/check-gate1-contracts.ts`
- Tests: `packages/fixtures/tests/gate1-contract-guard.test.ts`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-164_GATE1_CONTRACT_VALIDATION_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-164_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-164_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-164_ORCHESTRATOR_ACCEPTANCE.md`
