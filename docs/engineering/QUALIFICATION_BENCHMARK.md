# GateZero Strategy Qualification Benchmark

## Purpose

GateZero needs a reusable benchmark layer on top of test fixtures.

The goal is to measure whether the pipeline makes the right strategy-review judgment, not just
whether individual unit tests pass.

## What It Scores

The benchmark should replay known strategy/data/risk fixtures and report alignment for:

- data validity
- backtest reproducibility
- fees and slippage inclusion
- lookahead-bias detection
- survivorship-bias warning, when applicable
- drawdown calculation
- risk-veto behavior
- strategy maturity verdict
- final qualification verdict

## Qualification Verdicts

Use explicit verdicts:

| Verdict                 | Meaning                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `reject`                | Strategy or data is unsafe, invalid, or misleading.                         |
| `revise`                | Strategy is testable but evidence is insufficient or assumptions need work. |
| `research_candidate`    | Strategy may remain in research with more validation.                       |
| `paper_ready_candidate` | Strategy may be considered for paper trading after Risk + QA approval.      |

No benchmark may produce `live_ready` during Phase 0.

## Dataset Design

The benchmark dataset should include:

- clean deterministic cases
- missing-data cases
- stale-data cases
- biased feature cases
- lookahead trap cases
- high-drawdown cases
- high-fee/slippage cases
- overfit parameter cases
- low-trade-count cases
- strong-looking but fragile cases

## How To Run, Future Command Shape

Report-only benchmark:

```bash
pnpm benchmark:strategy-qualification
```

Strict benchmark that exits non-zero on mismatches:

```bash
pnpm benchmark:strategy-qualification:strict
```

Markdown report output:

```bash
pnpm benchmark:strategy-qualification:report
```

Expected report path:

```text
reports/strategy-qualification-benchmark.md
```

## How To Extend

When adding a new strategy review fixture:

1. add the fixture under `tests/fixtures/strategy-qualification/`
2. define expected verdict and risk flags
3. include data assumptions
4. include fee/slippage assumptions
5. include a short explanation of what the case is testing
6. update the benchmark index
7. run strict benchmark

## Benchmark Rules

- Benchmarks must test safety, not only success.
- A blocked strategy is a valid successful benchmark outcome.
- Profit alone cannot pass a fixture.
- Every fixture must declare assumptions.
- Every mismatch must produce a readable explanation.
