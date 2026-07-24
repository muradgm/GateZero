# TRD-758 Read-Only Intelligence Brief MVP

Status: accepted

## Goal

Render one concise, source-linked local market scenario brief without creating a trading
instruction, ranking, action channel, or external data dependency.

## Required Agents

- ORCHESTRATOR
- CODEX
- MARKET_INTELLIGENCE_SCENARIO_ANALYST
- RISK
- QA_SECURITY

## Allowed Scope

- Checked-in local replay sources with verified provenance and freshness.
- Separate hourly, daily, and monthly evidence.
- Bullish, bearish, and neutral conditional scenarios shown together.
- Supporting evidence, counter-evidence, red flags, invalidation conditions, and limitations.
- Evidence quality, semantic safety, adversarial review, and frozen content hash.
- Explicit risk-review and operator-decision requirements.

## Blocked Scope

- Network fetching, background polling, alerts, notifications, or scheduled scanning.
- Accounts, credentials, orders, execution, or external simulation dispatch.
- Asset, opportunity, scenario, or timing ranking.
- Buy, sell, hold, enter, exit, sizing, or allocation instructions.
- Export, publish, share, print, or report channels.
- Certainty, edge, profitability, readiness, approval, or promotion claims.

## Acceptance Criteria

- The brief is assembled deterministically from accepted local contracts and fixtures.
- Stale, missing, unverified, unsafe, or unresolved evidence fails closed.
- Three timeframes and three conditional scenario directions remain visible together.
- Evidence and limitations remain adjacent at desktop and mobile widths.
- No interactive action route exists.
- `pnpm verify:gate0` passes.

## Done Definition

The operator can inspect one balanced local intelligence brief end to end and understand its
evidence, uncertainty, invalidation, review requirements, and blocked scope without mistaking it for
permission to trade.

## Next Agent

ORCHESTRATOR may issue TRD-759 for operator-visible blocked and unavailable brief states.
