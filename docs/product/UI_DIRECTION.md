# GateZero App UI Direction

## Purpose

This document defines the product UI direction for GateZero.

The UI should make risk, evidence, and operator decisions clearer. It should not make trading feel
like a game.

## Product Feel

GateZero should feel:

- calm
- serious
- precise
- evidence-led
- risk-aware
- operator-controlled

It should not feel:

- casino-like
- hype-driven
- social-trading-like
- flashy
- leaderboard-first
- dopamine optimized

## Core Surfaces

Phase 0 / Phase 1 should focus on:

1. Dashboard
2. Strategy Library
3. Backtest Run Detail
4. Risk Review Panel
5. Rejected Strategies
6. Learning / Mistake Ledger
7. Settings / Safety Rules

## UI Principle

Every screen should answer one operator question quickly.

Examples:

| Surface             | Operator Question                                       |
| ------------------- | ------------------------------------------------------- |
| Strategy Library    | What strategies exist and what maturity level are they? |
| Backtest Detail     | What happened and can I trust the result?               |
| Risk Review         | What can go wrong and is this blocked?                  |
| Rejected Strategies | What did we reject and why?                             |
| Learning Ledger     | What mistakes keep repeating?                           |
| Settings            | What safety rules are active?                           |

## Visual Hierarchy

Risk status must be more visually important than profit.

Recommended priority:

1. Gate status
2. Risk verdict
3. Data assumptions
4. Drawdown and downside metrics
5. Profit/return metrics
6. Optional notes

## Tone Rules

Use plain language:

- “Blocked by risk”
- “Needs more evidence”
- “Backtest may be misleading”
- “Paper trading candidate”

Avoid misleading phrases:

- “Winning strategy”
- “Guaranteed edge”
- “AI says buy”
- “Safe profit”

## Empty States

Empty states should teach discipline.

Example:

> No strategy has passed review yet. Start with a simple strategy idea, run an honest backtest, and
> let the risk rules decide whether it deserves more work.
