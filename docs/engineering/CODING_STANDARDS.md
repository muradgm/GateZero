# Coding Standards

## Purpose

GateZero code must be boring, explicit, and testable.

In trading systems, clever code is a liability when it hides assumptions or failure modes.

## General Rules

- Prefer explicit names over clever abstractions.
- Keep financial calculations isolated and tested.
- Do not mix UI formatting with financial logic.
- Do not hide risk decisions inside presentation components.
- Do not make strategy code depend on live state in Phase 0.
- Every strategy/backtest/risk module should be reproducible from inputs.

## TypeScript Rules

- Use strict TypeScript.
- Validate external inputs at API boundaries.
- Keep shared contracts in shared packages.
- Do not use `any` for financial data structures unless justified and documented.
- Treat dates/timezones explicitly.

## Python Quant Rules

- Keep backtest functions deterministic.
- Avoid global mutable state.
- Store config used for every run.
- Do not silently forward-fill missing data without recording it.
- Test indicators and metrics with small known fixtures.

## Error Handling

Errors must preserve operational truth.

A failed secondary write must not create a false primary outcome.

Example:

- if a backtest completes but report persistence fails, the system must not imply the backtest
  failed mathematically; it should report persistence failure separately.

## Financial Logic Rule

No financial/risk calculation is accepted without tests.
