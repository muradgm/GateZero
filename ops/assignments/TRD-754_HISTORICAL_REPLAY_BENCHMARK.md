# TRD-754 Historical Replay Benchmark

Status: accepted

## Goal

Measure evidence-control behavior against frozen historical replay cases.

## Outputs

- Historical replay case and benchmark contracts.
- Linked source, quality, scenario, review, and unique frozen-hash evidence.
- Source coverage, scenario completion, invalidation, red-flag, and unsafe-input-block rates.

## Blocked Scope

No returns, profitability, hit rate, edge, strategy selection, readiness, or promotion metrics.

## Acceptance

Replay evidence cannot use future timestamps, every reported rate is derived from linked frozen
records, and benchmark output contains no trading-performance semantics.

## Next Agent

PM and ORCHESTRATOR define TRD-755.
