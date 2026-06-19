# Gate 1 Backtest Assumption Risk Register Negative Cases

## Purpose

Harden the Gate 1 backtest assumption risk register with explicit failure-path tests.

## Coverage

- Empty risk registers are rejected.
- Invalid risk severity values are rejected.
- Invalid risk disposition values are rejected.
- Stale or downgraded gate/scope values are rejected.
- Evidence-only, no-claim, and no-execution boundaries remain enforced.

## Boundary

This is contract validation only. It does not approve a strategy, rank a strategy, predict trade
direction, connect to external accounts, or create an execution path.

## Source Links

- Contract tests: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Source packet: `ops/assignments/TRD-292_BACKTEST_ASSUMPTION_RISK_REGISTER_NEGATIVE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-292_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-292_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-292_ORCHESTRATOR_ACCEPTANCE.md`
