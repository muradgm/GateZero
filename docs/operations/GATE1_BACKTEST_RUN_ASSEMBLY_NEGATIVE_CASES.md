# Gate 1 Backtest Run Assembly Negative Cases

## Purpose

Record negative validation coverage for Gate 1 backtest run assemblies.

## Coverage

- Unchecked assemblies fail validation.
- Claim flags fail validation.
- Wrong scope fails validation.
- Missing evidence references fail validation.

## Boundary

This is local contract validation only. It does not authorize paper trading, live trading, broker
integration, autonomous execution, strategy approval, readiness, or performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-302_BACKTEST_RUN_ASSEMBLY_NEGATIVE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-302_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-302_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-302_ORCHESTRATOR_ACCEPTANCE.md`
