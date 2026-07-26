# Codex Handoff — Validated Decision Trace Completion

## Branch

`feature/validated-decision-trace-completion`

Base branch:

`feature/trading-intelligence-command-center`

Repository:

`muradgm/GateZero`

The base branch is currently 277 commits ahead of `main` and contains the complete Trading Intelligence Command Center, the validated-trace foundation, deterministic EUR/USD strategy logic, candidate detection, and the first historical-provider adapter boundary.

## Product position

TraderFrame is not currently being built as a TradingView replacement or a production execution terminal.

The active product position is:

> An operating system for auditable discretionary trading decisions.

The governing milestone is:

> Prove one complete, valid, immutable, deterministic, and reproducible EUR/USD decision lifecycle from real historical data without manually authored intelligence.

The current milestone is not a profitability claim. It validates data integrity, temporal integrity, deterministic reasoning, instrument-aware risk, explicit simulation assumptions, immutable decision-time evidence, reproducibility, outcome capture, and learning.

## Governing source documents

Read these before changing code:

1. `docs/product/VALIDATED_DECISION_TRACE_MILESTONE.md`
2. `docs/product/BRANCH_SCOPE.md`
3. `docs/product/CURRENT_ROADMAP.md`
4. `docs/product/DECISION_LOG.md`
5. `docs/architecture/DECISION_PIPELINE.md`
6. `docs/architecture/MILESTONE_B_TRADING_INTELLIGENCE_ENGINE.md`
7. `docs/architecture/SETUP_REVIEW_VERTICAL_SLICE.md`

When these documents conflict with assumptions from old branches or chat history, the validated-trace milestone is the governing source.

## Current status

### Product and UX

Implemented:

- Decision Intelligence Workspace in `apps/intelligence-workspace`
- branded TraderFrame workspace shell
- Candidate Queue v2
- persistent Candidate Action Bar
- explicit Lifecycle Rail
- Command Palette and keyboard navigation
- Evidence Graph
- Decision Replay
- Decision Memory
- Similar Setups
- Outcome Journal
- AI Evidence Council presentation layer
- confidence-change and alignment views
- glossary hover layer
- chart interactions and local runtime-data generation
- quiet `pnpm verify` progress runner with verbose fallback

The UI is intentionally ahead of the full runtime engine. Do not add more analytical panels during this milestone unless they expose truth-related state such as provenance, validity, freshness, blockers, frozen-versus-outcome data, simulation assumptions, or reproducibility.

### Domain and application architecture

Implemented packages:

- `packages/contracts`
- `packages/application`
- `packages/ui`

Implemented workflow services include:

- create setup review
- evaluate setup review
- request risk review
- record operator decision
- decision pipeline
- query setup reviews
- similar-setup ranking
- trading-intelligence report projection
- trace-quality evaluation
- market-data validation
- timeframe aggregation
- EUR/USD observation derivation
- EUR/USD strategy gate evaluation
- canonical decision assessment
- chronological candidate detection
- Dukascopy CSV historical adapter

### Validated decision-trace contracts

Implemented:

- trace requirement statuses
- lifecycle statuses
- independent release gates
- validity-failure taxonomy
- temporal evidence contracts
- frozen decision-bundle contract
- simulation-policy contract
- market candle contracts
- timeframe aggregation contracts
- canonical decision-assessment contract
- candidate-detection contract
- historical-market-adapter contract

### Market data integrity

Implemented:

- UTC normalization
- duplicate detection
- interval-gap detection
- OHLC invariant checks
- finalized-candle checks
- instrument and timeframe checks
- deterministic candle IDs and hashes
- 15m to 1H and 4H deterministic aggregation
- `availableAt` enforcement
- exclusion of incomplete higher-timeframe candles
- no-look-ahead candle selection

### Strategy v1

Instrument:

`EUR/USD`

Strategy:

`EURUSD_LN_NY_PULLBACK`

Version:

`1.0.0`

Implemented deterministic concepts:

- 1H and 4H EMA alignment
- 15m ATR
- pullback depth and age
- swing lookback
- liquidity sweep penetration
- reclaim window
- displacement in ATR
- close-confirmed trigger
- event restriction gate
- invalidation beyond sweep extreme
- candidate expiry
- explicit PASS / FAIL / BLOCKED gates
- recommendations limited to `REJECT`, `WATCH`, `PAPER_SIMULATE`

No composite score or calibrated probability is allowed in the canonical assessment.

### Canonical decision authority

Implemented:

`packages/application/src/build-canonical-decision-assessment.ts`

The canonical assessment owns:

- eligibility
- recommendation
- lifecycle state
- hard and conditional blockers
- passed and failed gates
- required next action
- expiry
- deterministic assessment identity

Downstream UI, reports, councils, replay, risk, simulation, and learning must consume this object rather than recalculate recommendations.

### Candidate detection

Implemented:

`packages/application/src/detect-eurusd-overlap-candidates.ts`

Behavior:

- scans chronologically
- exposes only decision-time-available candles
- derives observations per decision point
- emits structural candidate detections
- deduplicates repeated trigger sightings
- records trigger and sweep candle references
- creates deterministic candidate IDs
- creates reproducible source-window hashes
- does not own recommendations, scores, or confidence

### Historical adapter

Implemented:

`packages/application/src/adapt-dukascopy-csv.ts`

Current adapter boundary:

- provider: Dukascopy CSV export
- instrument: EUR/USD
- timeframe: 15m
- strict UTC timestamps ending in `Z`
- strict header:
  `timestamp,open,high,low,close,volume`
- source-content SHA-256 hash
- provider-neutral `RawMarketCandle[]`
- explicit failure codes
- no silent timezone or column guessing

A real frozen dataset is not yet committed. The next branch must ingest one user-supplied or legally reusable historical export through this adapter.

## Developer experience changes

Default verification:

```bash
pnpm verify
```

This displays stage-level progress for:

1. repository checks
2. lint
3. formatting
4. type checking
5. tests

Verbose fallback:

```bash
pnpm verify:verbose
```

Do not replace the quiet runner with raw chained terminal output.

## Current branch validation state

The latest confirmed local run before the adapter phase passed all checks.

Historical baseline before the latest adapter tests:

- 126 test files
- 870 tests

The adapter and candidate-detection additions should increase the final count after the continuation branch is synchronized and verified.

Do not record a new verified count until `pnpm verify` passes locally on the continuation branch.

## Immediate local synchronization note

The user previously had a local modification to:

`packages/application/src/adapt-dukascopy-csv.ts`

The remote branch already contains the strict-nullability fix in commit:

`b092087 fix: guard Dukascopy CSV array access under strict null checks`

Before switching branches locally, use:

```bash
git status
git diff -- packages/application/src/adapt-dukascopy-csv.ts
```

If the local edit only duplicates the remote fix:

```bash
git restore packages/application/src/adapt-dukascopy-csv.ts
git pull --ff-only
git switch feature/validated-decision-trace-completion
pnpm install
pnpm verify
```

Do not overwrite unrelated local work.

## Exact next implementation sequence

### Phase 1 — Frozen real EUR/USD dataset

Goal:

Add one fixed historical 15m EUR/USD CSV export with explicit provenance and permitted repository usage.

Requirements:

- fixed UTC date range
- source identity
- source-content hash
- license or usage note
- no generated or manually altered candle values
- adapter test against the frozen dataset
- avoid committing data if its license forbids redistribution; in that case add a deterministic local-import fixture workflow and a content-hash manifest instead

### Phase 2 — End-to-end historical ingestion service

Create one application service that performs:

```text
CSV source
→ Dukascopy adapter
→ raw candle validation
→ UTC normalization
→ 1H aggregation
→ 4H aggregation
→ candidate detection
→ canonical assessment
```

Required output:

- source snapshot
- raw and normalized hashes
- validation failures
- aggregation failures
- detected candidates
- canonical assessments
- deterministic run ID

No UI formatting and no simulation in this service.

### Phase 3 — Instrument-aware risk engine

Implement EUR/USD risk mathematics.

Minimum inputs:

- account currency
- account equity or risk basis
- allowed risk percentage or amount
- entry price
- invalidation price
- pip size
- pip value policy
- spread
- slippage
- commission

Minimum outputs:

- stop distance in pips
- worst-case execution price
- position size
- planned gross loss
- estimated costs
- total worst-case planned loss
- risk-gate result
- engine version and deterministic hash

Risk must not be hard-coded as presentation strings.

### Phase 4 — Frozen decision bundle

Build the immutable decision-time artifact containing:

- raw-data hash
- normalized-data hash
- source identity
- source range
- strategy version and parameters
- observation-engine version
- risk-engine version
- simulation-policy version
- canonical-assessment hash
- evidence-bundle hash
- configuration hash
- application commit
- schema versions
- decision timestamp
- operator identity

Outcome and learning must never mutate this bundle.

### Phase 5 — Deterministic paper simulation

Implement bar-by-bar simulation using the versioned simulation policy.

Must define and enforce:

- order type
- trigger condition
- fill assumption
- spread
- slippage
- commission
- gaps
- stop and target behavior
- same-candle stop/target conflict policy
- expiry
- maximum holding period
- incomplete or ambiguous result handling

Unknown intrabar ordering must not be silently guessed.

### Phase 6 — Outcome and learning

Produce separate deterministic records for:

- simulated fill
- exit reason
- MAE
- MFE
- result in R
- duration
- policy exceptions
- process-quality findings
- learning event
- applicability to future reviews

The outcome must not rewrite the original evidence, recommendation, or operator rationale.

### Phase 7 — Reproduction harness

From frozen inputs and an empty generated-state directory, repeated runs must produce identical canonical outputs and hashes.

Separate:

- canonical deterministic artifacts
- volatile operational metadata such as runtime duration and generated timestamp

The milestone fails if candidate, evidence, assessment, risk, simulation, outcome, or learning hashes differ across identical runs.

### Phase 8 — Browser E2E

The operator must be able to:

- open the real detected candidate
- inspect source provenance
- inspect freshness and validity
- inspect passed and failed gates
- see blockers and next action
- inspect risk
- record an operator decision
- inspect the frozen trace
- inspect simulation outcome
- inspect the learning event
- reproduce the trace

The UI must project canonical data. It must not own or recreate decision logic.

## Hard constraints

Do not add during this milestone:

- new markets
- additional strategies
- broker integration
- live order routing
- live WebSocket feeds
- LLM-owned recommendations
- seven-agent AI councils
- portfolio optimization
- confidence calibration claims
- new dashboard widgets without trace-related purpose
- broad BOS/CHOCH/SMC ontology expansion

Every new trading concept must pass:

1. Is it required for the current decision?
2. Can it be mechanically defined?
3. Can its availability time be proven?
4. Can independent implementations reproduce it?
5. Does it alter a gate, blocker, risk result, or next action?

## Architectural rules

- One canonical recommendation owner.
- Candidate detection never emits recommendation or confidence.
- Provider-specific fields stop at the adapter boundary.
- Every feature and evidence item declares `availableAt`.
- Future information causes rejection or explicit exclusion.
- Decision-time artifacts are immutable.
- Outcome-time artifacts are separate.
- Arrays, timestamps, IDs, hashes, and serialization must be deterministic.
- No manually authored evidence values in the validated vertical slice.
- No silent data repair.
- No silent simulation assumptions.
- No profitability claim.

## Codex orchestrator operating instructions

Act as the senior technical lead and orchestrator for this branch.

Before editing:

1. Read the governing documents listed above.
2. Inspect `packages/contracts`, `packages/application`, and their tests.
3. Inspect the latest branch diff and recent commits.
4. Run or request `pnpm verify` before claiming the branch is green.
5. Preserve the existing domain language and deterministic boundaries.

For each slice:

1. State the slice objective.
2. Identify contracts first.
3. Implement application logic outside React.
4. Add focused tests for valid, invalid, temporal, and deterministic behavior.
5. Export through package indexes.
6. Avoid drive-by refactors.
7. Commit in small coherent commits.
8. Give exact pull and verification commands.
9. Never claim local verification unless the user confirms it or CI evidence exists.
10. Record any unresolved assumption explicitly.

## Copy-paste prompt for a new Codex session

```text
Act as the senior tech lead and Codex orchestrator for the GateZero / TraderFrame repository.

Repository:
https://github.com/muradgm/GateZero

Work only on branch:
feature/validated-decision-trace-completion

Start by reading:
- docs/product/CODEX_HANDOFF_VALIDATED_DECISION_TRACE.md
- docs/product/VALIDATED_DECISION_TRACE_MILESTONE.md
- docs/product/BRANCH_SCOPE.md
- docs/product/CURRENT_ROADMAP.md
- docs/product/DECISION_LOG.md
- docs/architecture/DECISION_PIPELINE.md
- docs/architecture/MILESTONE_B_TRADING_INTELLIGENCE_ENGINE.md

Then inspect:
- packages/contracts
- packages/application
- apps/intelligence-workspace
- package.json
- scripts/verify-progress.ts
- recent commits on the branch

Do not restart product discovery or redesign the architecture. Continue the governing milestone:

Produce one complete, valid, immutable, deterministic, and reproducible EUR/USD decision lifecycle from real historical data without manually authored intelligence.

Current completed foundation includes:
- validated candle contracts and UTC normalization
- 15m to 1H/4H aggregation with availableAt
- no-look-ahead enforcement
- deterministic EUR/USD overlap-pullback strategy gates
- derived EMA/ATR/pullback/sweep/reclaim/displacement/trigger observations
- canonical decision assessment
- chronological candidate detection with deduplication and source-window hashes
- Dukascopy CSV provider adapter
- Candidate Queue, Action Bar, Lifecycle Rail, replay, graph, journal, glossary, and command palette
- quiet pnpm verify progress runner

Immediate next objective:
1. introduce one frozen real EUR/USD 15m dataset or a license-safe deterministic import manifest;
2. build the end-to-end historical ingestion service;
3. then implement the instrument-aware EUR/USD risk engine.

Hard constraints:
- no new markets or strategies
- no live execution or broker work
- no LLM-owned recommendation
- no new analytical panels unrelated to trace truth
- no composite confidence score
- no manual evidence values
- no silent look-ahead, data repair, or simulation assumptions
- one canonical recommendation owner

Use contracts first, deterministic application services second, UI projections last. Add focused tests and small commits. Run pnpm verify and report failures honestly. Do not claim verification until confirmed.
```

## Completion definition

The continuation branch is complete only when one real historical EUR/USD case can be reproduced through:

```text
Historical source
→ adapter
→ validation
→ normalization
→ aggregation
→ candidate detection
→ evidence and gates
→ canonical assessment
→ instrument-aware risk
→ immutable decision bundle
→ operator decision
→ deterministic simulation
→ outcome
→ learning
→ exact replay and reproducibility
```

All four release gates must pass:

- completeness
- validity
- reproducibility
- browser workflow
