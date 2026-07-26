# Milestone — One Validated Decision Trace

## Purpose

Prove that TraderFrame can produce one complete, valid, and reproducible trading-decision lifecycle
from real historical EUR/USD market data without manually authored intelligence.

This milestone is not a profitability claim. It validates data integrity, temporal integrity,
deterministic reasoning, instrument-aware risk, explicit paper-simulation assumptions, immutable
decision-time evidence, and reproducible outcomes.

## Scope

- Instrument: `EUR/USD`
- Historical source: one real adapter
- Timeframes: `15m`, `1H`, `4H`
- Strategy: one exact versioned specification
- Historical range: fixed and content-hashed
- Operator: one identified local operator
- Execution: deterministic paper simulation only
- Recommendation vocabulary: `REJECT`, `WATCH`, `PAPER_SIMULATE`
- Composite confidence score: not required for this milestone

## Required lifecycle

```text
Raw source data
→ validation
→ normalized candles
→ feature derivation
→ deterministic candidate detection
→ market-context snapshot
→ supporting evidence
→ contradicting evidence
→ evidence-quality assessment
→ invalidation
→ instrument-aware risk calculation
→ canonical assessment
→ frozen decision bundle
→ operator decision
→ deterministic paper simulation
→ outcome
→ learning event
→ replay
```

## Quality model

### Decision Trace Completeness

Measures whether all applicable lifecycle records exist.

Statuses:

- `COMPLETE`
- `PARTIAL`
- `MISSING`
- `STALE`
- `NOT_APPLICABLE`

Hard caps:

- missing market-data provenance: maximum 40
- missing invalidation: maximum 50
- missing risk calculation: maximum 55
- missing contradiction review: maximum 65
- missing operator rationale: maximum 75
- missing outcome: lifecycle remains `OPEN`
- missing learning event: lifecycle remains `INCOMPLETE`

### Decision Trace Validity

Tests whether the trace is trustworthy.

Required validity areas:

- market-data integrity
- timestamp integrity
- strategy integrity
- evidence integrity
- calculation integrity
- risk integrity
- simulation integrity
- reproducibility
- provenance integrity
- version integrity

### Decision Process Quality

Evaluates whether the decision was reasonable using only information available at decision time.

Profitability remains separate. A winning outcome does not prove good process, and a losing outcome
does not disprove it.

## Temporal invariant

Every derived feature and evidence item must declare `availableAt`.

The canonical assessment must reject evidence where:

```text
evidence.availableAt > decisionTimestamp
```

The same rule applies to incomplete higher-timeframe candles, future-confirmed swing points, revised
values, centered calculations, and end-of-session metrics used before they existed.

## Data-validation minimum

The adapter must verify:

- canonical instrument identity
- timeframe
- timezone and UTC normalization
- expected candle interval
- duplicate timestamps
- missing intervals and classified closures
- finalized versus incomplete candles
- `high >= open`
- `high >= close`
- `low <= open`
- `low <= close`
- `high >= low`
- valid numeric precision
- positive volume where the source provides meaningful volume

## Simulation policy minimum

The versioned policy must define:

- order type
- trigger condition
- fill assumption
- spread
- commission
- slippage
- gap behavior
- stop execution
- target execution
- same-candle stop-and-target conflict
- partial-fill policy
- session closure
- maximum holding period

Unknown intrabar ordering must not be guessed silently.

## Frozen decision bundle

The immutable decision-time bundle must contain:

- raw-data hash
- normalized-data hash
- source identity
- strategy version and parameters
- feature-engine version
- risk-engine version
- simulation-policy version
- canonical-assessment hash
- evidence-bundle hash
- application commit
- configuration hash
- schema versions
- decision timestamp
- operator identity

Outcome records and learning events are stored separately and must never rewrite the decision-time
bundle.

## Release gates

### Gate A — Completeness

All mandatory lifecycle records exist and required hard caps pass.

### Gate B — Validity

Data, timestamps, transformations, calculations, risk, and simulation assumptions pass independent
validation.

### Gate C — Reproducibility

A run from an empty generated-state directory and frozen inputs produces byte-equivalent canonical
outputs, excluding explicitly volatile operational metadata.

### Gate D — Workflow

A browser end-to-end test allows an operator to inspect the case, view provenance and blockers,
record a decision, inspect the simulation outcome, and review the learning event.

The milestone fails if any gate fails.

## Acceptance criteria

1. Output is derived from raw adapter data.
2. No evidence values or contribution points are manually authored.
3. No future information is consumed.
4. One canonical assessment owns the recommendation.
5. Qualification is expressed through explicit gates before numerical aggregation.
6. Instrument-aware risk is calculated.
7. Simulation assumptions are explicit and versioned.
8. Decision-time evidence is immutable.
9. Outcome and learning records remain separate.
10. MAE, MFE, and result in R are reproducible.
11. The complete trace is visible in the workspace.
12. Completeness and validity checks pass.
13. The browser workflow passes end to end.
14. Identical frozen inputs produce identical canonical hashes.

## UI freeze

No new analytical panels, markets, agents, broker integrations, or layout systems are allowed during
this milestone.

UI changes are allowed only to expose truth-related information:

- source provenance
- freshness and staleness
- trace status
- validity failures
- strategy version
- simulation assumptions
- decision-time versus outcome-time data
- incomplete and blocked states

## Product position

> TraderFrame creates reproducible, evidence-gated trading decision records and measures whether the
> decision process improves over time.
