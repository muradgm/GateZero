# TraderFrame Capability Roadmap

## Governing Rule

> No trade without evidence. No execution without risk approval.

TraderFrame advances by proven capability, not feature count. An epoch closes only when its exit
evidence is reproducible and the preceding safety boundary remains intact.

## Current Position

- Product phase: validated decision trace
- Financial gate: Gate 2 paper-simulation planning
- Runtime authority: canonical decision assessment only
- Intelligence workspace: local, synthetic, non-canonical demonstration
- Capability proof: Epochs 1 through 4 implemented with bounded local fixtures on the continuation
  branch
- External accounts, broker routes, credentials, live orders, and autonomous action: blocked

Foundation is substantial but not considered complete until the validated trace is reproducible
end-to-end. A passing test suite proves repository health; it does not prove trading correctness.

## Epoch 0: Controlled Foundation

**Outcome:** A maintainable repository with explicit financial and autonomy boundaries.

Delivered capabilities include contracts, application services, fixtures, verification, governance
records, workspace prototypes, and local review tooling.

**Exit evidence**

- Full repository verification is green.
- Runtime surfaces fail closed on missing or malformed boundary metadata.
- Synthetic fixtures are visibly separated from canonical evidence.
- Dependency audit has no known high-severity vulnerability.

## Epoch 1: Validated Decision Trace

**Outcome:** The same historical input and configuration produce the same inspectable decision
trace.

### 1. Historical intake

- CSV adapter with provenance and content hash
- strict chronological ordering and interval continuity
- explicit missing event context
- bounded market-closure exceptions

### 2. Candidate detection

- chronological scan
- deterministic identifiers
- no future-data access
- explainable rejection and blocked states

### 3. Canonical assessment

- one runtime recommendation owner
- rule-level evidence references
- blockers, expiry, and next action
- immutable assessment hash

### 4. Risk review

- explicit risk-review record linked by identifier and hash
- sizing, spread, commission, slippage, and exposure assumptions
- fail-closed behavior for missing, stale, or contradictory risk evidence

### 5. Frozen decision bundle

- input, evidence, assessment, risk review, and operator decision
- immutable content hashes
- schema and engine versions
- no mutation after simulation starts

### 6. Deterministic simulation

- deterministic entry and exit rules
- explicit fill assumptions
- MAE, MFE, and R-multiple output
- no external account or order route

### 7. Outcome and learning

- outcome attribution to frozen evidence and assumptions
- manual operator note
- deterministic learning event
- complete replay from source input

### 8. Reproducibility checkpoint

**Exit evidence**

- Independent reruns produce identical bundle and outcome hashes.
- Time-causality tests prove no look-ahead.
- Risk review is present and validated before simulation eligibility.
- One complete case replays from historical candles through learning event.
- Browser tests show evidence, limitations, risk, and operator decision together.

## Epoch 2: Evidence Intelligence

**Outcome:** Evidence becomes a first-class, versioned dependency graph.

- provenance, availability time, freshness, and expiry
- producer rule and dependent decisions
- contradiction and conflict records
- quality and limitation metadata
- historical revisions without silent overwrite

**Entry gate:** Epoch 1 reproducibility checkpoint accepted.

**Exit evidence:** Every canonical conclusion can be traced to the exact evidence version available
at decision time.

## Epoch 3: Risk Intelligence

**Outcome:** Risk review expands from one simulated case to bounded portfolio context.

- instrument and currency exposure
- correlated and event exposure
- session and daily risk budgets
- drawdown limits
- portfolio-level blockers

Risk status may block or require review. It must not become an implied approval score.

**Entry gate:** Evidence dependencies and freshness are reliable.

**Branch implementation status:** Complete as a bounded local capability proof. This does not
promote the financial gate or establish production readiness.

**Exit evidence**

- Fixed policy limits cover instrument, currency, correlation, event, session, daily, and drawdown
  risk.
- Identical inputs produce identical portfolio-risk assessment hashes.
- A review-required fixture keeps near-limit concerns visible without approval semantics.
- A separate blocked fixture proves correlation and event limits fail closed.
- The workspace renders computed risk utilization, limitations, and the no-approval boundary
  together.
- Runtime loading rejects a missing, malformed, approving, or executing Epoch 3 proof.

## Epoch 4: Deterministic Learning Intelligence

**Outcome:** Completed simulations produce inspectable patterns without predictive claims.

- recurring invalidations
- evidence combinations and failure modes
- operator process errors
- regime and strategy drift
- comparable case clusters

**Entry gate:** Outcomes are reproducibly linked to frozen decision bundles.

**Branch implementation status:** Complete as a bounded local capability proof. This remains
descriptive learning evidence and does not establish strategy edge, predict future outcomes, update
rules automatically, or promote the financial gate.

**Exit evidence**

- Learning cases are immutably linked to frozen bundle, outcome, and learning-event hashes.
- Recurring invalidations and evidence/failure combinations are extracted deterministically.
- Operator-process errors require explicit `MANUAL_LOCAL` attribution and confirmation.
- Comparable clusters use exact shared attributes without similarity scores or forecasts.
- Strategy-version and declared-regime drift produce review findings, not recommendations.
- Reordered source cases produce the same report hash.
- The workspace renders patterns, source case IDs, drift reasons, and interpretation limits
  together.
- Runtime loading rejects predictive, performance, rule-changing, risk-changing, or executing
  learning output.

## Epoch 5: Multi-Strategy Platform

**Outcome:** Additional strategies use the same validated pipeline without weakening it.

Each strategy must provide versioned rules, observations, evidence, tests, risk requirements, and
reproducibility fixtures.

**Entry gate:** One strategy has completed the full learning loop.

## Epoch 6: AI Review Council

**Outcome:** Language models challenge deterministic evidence; they do not own recommendations.

Permitted roles include evidence auditor, red team, structure reviewer, macro reviewer, and
explanation synthesizer.

Every output must include sources, uncertainty, limitations, invalidation conditions, and an
operator-review requirement. AI output cannot create execution authority or override deterministic
gates.

**Entry gate:** Deterministic recommendations, evidence lineage, and risk controls are stable.

## Epoch 7: Professional Trading OS

**Outcome:** Operator-grade workflows around validated local decision support.

- saved layouts and efficient keyboard workflows
- linked charts, evidence, and timeline replay
- annotations and review requests
- audit trails, permissions, and version history

Collaboration and external integrations require separate security and autonomy reviews.

## Version 1.0 Bar

Version 1.0 requires:

- deterministic, reproducible decision traces
- operator-ready evidence and risk workspace
- validated risk controls
- working outcome and learning loop
- complete replay and traceability
- no unresolved critical or high-severity control gap

Version 1.0 is not permission for live execution. Broker connectivity, real orders, and increased
autonomy require a separately approved future gate.

## Delivery Tracks

| Track              | Continuous responsibility                               |
| ------------------ | ------------------------------------------------------- |
| Trace integrity    | Causality, hashes, versions, replay, reproducibility    |
| Evidence           | Provenance, quality, conflicts, freshness, dependencies |
| Risk               | Assumptions, limits, blockers, exposure, review linkage |
| Simulation         | Deterministic fills, costs, outcomes, attribution       |
| Operator workspace | Evidence-first UX, limitations, notes, replay           |
| Security and QA    | Boundary guards, negative tests, CI, browser validation |

## Sequencing Rule

New work must directly improve the current epoch's exit evidence. Defer broad UI expansion, new
markets, new strategies, AI reviewers, external data services, and execution features until their
entry gates are met.
