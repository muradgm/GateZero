# TraderFrame Success Metrics

## Purpose

This document defines the success metrics that matter at the current stage.

TraderFrame should not measure success by vanity profit screenshots, strategy count, or automation
breadth.

It should measure whether the operator becomes more disciplined, more informed, and less exposed to
avoidable trading mistakes.

## Stage Definition

TraderFrame is currently a:

> Gate 0 research-only trading operating system.

So the most important metrics are:

- backtest honesty
- risk visibility
- strategy review quality
- operator decision clarity
- system reproducibility
- learning quality

## Primary Metrics

### 1. Backtest Reproducibility

Question:

- Does the same strategy/data/config produce the same result reliably?

Good looks like:

- immutable backtest run records
- deterministic strategy versioning
- stored assumptions
- reproducible metrics
- no hidden config drift

### 2. Risk Review Completeness

Question:

- Does every strategy review expose the main ways the strategy could fail?

Good looks like:

- max drawdown visible
- drawdown duration visible
- fees and slippage included
- exposure and turnover reported
- blocked risks explained clearly

### 3. Bias Detection Quality

Question:

- Does the system catch misleading backtest conditions?

Good looks like:

- lookahead checks
- survivorship warnings
- selection bias warnings
- parameter-mining detection
- out-of-sample requirements

### 4. Operator Decision Quality

Question:

- Does the workspace help the operator decide what to do next without emotional guessing?

Good looks like:

- clear pass/fail/mature-later verdicts
- explanation tied to evidence
- uncertainty preserved
- rejected strategies remain visible with reasons

### 5. Learning Quality

Question:

- Does the system learn from mistakes without making itself more dangerous?

Good looks like:

- postmortems created for major misses
- learning events classified
- rules improved through review
- no automatic increase in autonomy or risk limits

## Secondary Metrics

These matter later, but should not dominate Phase 0:

- UI polish
- dashboard breadth
- number of strategies tested
- paper-trading frequency
- live execution speed
- automation level

## Metrics To Avoid Overweighting Early

Do not let these drive decisions too early:

- total simulated profit
- strategy leaderboard rank
- number of green trades
- model accuracy alone
- AI confidence score alone
- win rate without expectancy and drawdown

## Best Current Success Question

> Does TraderFrame help the operator reject weak or unsafe trading ideas before they become real
> risk?

If the answer becomes reliably yes, the product becomes much stronger.

## Near-Term Operating Scorecard

| Area              | Target                                                   |
| ----------------- | -------------------------------------------------------- |
| Reproducibility   | Every backtest can be rerun from stored config           |
| Risk visibility   | Every report includes drawdown, fees, slippage, exposure |
| Strategy maturity | No strategy jumps maturity gates automatically           |
| Learning          | Every mistake becomes a reviewed learning event          |
| Safety            | Any Risk veto blocks acceptance                          |
