# TRD-757 Deterministic Historical Backtest Runner MVP

Status: accepted

## Goal

Implement one deterministic local historical backtest runner so TraderFrame can produce reproducible
research evidence instead of stopping at schema-only Gate 1 contracts.

## Required Agents

- ORCHESTRATOR
- CODEX
- QUANT
- RISK
- QA_SECURITY

## Allowed Scope

- Checked-in synthetic bid/ask candles.
- One frozen long-only moving-average crossover rule.
- Signals from closed candles and execution at the next candle open.
- Explicit spread, commission, and slippage costs.
- Deterministic input, output, dataset, and strategy hashes.
- Local generated evidence rendered in the Strategy Review Workspace.

## Blocked Scope

- Network or provider data.
- External accounts, credentials, or order routes.
- Parameter search, optimization, strategy ranking, or promotion.
- AI prediction or buy/sell recommendations.
- Live or external paper execution.
- Profitability, readiness, approval, or performance claims.

## Required Outputs

- Runtime contracts, deterministic runner, synthetic fixture, and focused tests.
- Generated browser evidence with limitations adjacent to the run facts.
- Operator documentation and separate RISK, QA_SECURITY, and ORCHESTRATOR reviews.

## Acceptance Criteria

- Identical inputs produce identical payloads and hashes.
- Signals use only prior closed candles and execute at the next candle open.
- Bid/ask spread, commission, and slippage are applied.
- Missing intervals, future observations, invalid spreads, leverage, and hash tampering fail closed.
- Browser evidence contains no recommendation, attractiveness score, or execution authority.
- `pnpm verify:gate0` passes.

## Done Definition

One local historical case can be run, reproduced, integrity-checked, and inspected as research
evidence without opening an external action channel.

## Next Agent

ORCHESTRATOR may issue TRD-758 for the bounded read-only Intelligence Brief MVP.
