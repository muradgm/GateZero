# Epoch 1 Historical Decision Workflow

The validated decision trace must use one real EUR/USD 15-minute historical export. The repository
must not commit provider data unless redistribution is explicitly permitted.

## Required CSV format

```csv
timestamp,open,high,low,close,volume
2025-01-02T12:00:00.000Z,1.03500,1.03540,1.03480,1.03520,123
```

Requirements:

- timestamps are explicit ISO UTC datetimes ending in `Z`;
- rows are chronological;
- the declared range uses an inclusive start and exclusive end;
- the range should begin and end on complete 4H UTC boundaries for fail-closed aggregation;
- the file is not manually edited after its SHA-256 hash is recorded;
- the manifest records source identity, licensing, range, expected row count, and hash.

## 1. Verify the frozen source

Copy `EURUSD_15M_MANIFEST.example.json` to an untracked local path, complete the metadata, calculate
the final CSV SHA-256 hash, and run:

```bash
pnpm import:epoch1-dataset -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json
```

The default output is `.local-data/epoch1/historical-import.json`.

## 2. Run deterministic historical ingestion

```bash
pnpm run:epoch1-ingestion -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json
```

The command performs:

```text
frozen manifest verification
→ Dukascopy CSV adaptation
→ 15m validation and UTC normalization
→ deterministic 1H aggregation
→ deterministic 4H aggregation
→ chronological candidate detection
→ canonical decision assessment
```

The default output is `.local-data/epoch1/historical-ingestion-run.json`.

### Optional event context

Missing event context remains `UNAVAILABLE`; it is never interpreted as event-safe. A local JSON
object may supply an explicit integer minute distance for decision timestamps:

```json
{
  "2025-01-02T12:15:00.000Z": 90,
  "2025-01-02T12:30:00.000Z": 75
}
```

```bash
pnpm run:epoch1-ingestion -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json \
  --event-context /path/to/EURUSD_event_context.json
```

## 3. Calculate instrument-aware EUR/USD risk

Copy `EURUSD_RISK_POLICY.example.json` to an untracked local path and set the account equity, risk
budget, pip-value policy, execution-cost assumptions, and position-size limits.

```bash
pnpm run:epoch1-risk -- \
  --ingestion .local-data/epoch1/historical-ingestion-run.json \
  --policy /path/to/EURUSD_risk_policy.json \
  --candidate <candidate-id>
```

The default output is `.local-data/epoch1/eurusd-risk-calculation.json`.

The risk engine records:

- account currency and risk basis;
- source-run, dataset, candidate, and assessment lineage;
- policy and canonical-assessment hashes;
- stop distance and pip value;
- adverse entry and stop execution prices;
- position size rounded down to the declared unit increment;
- spread, slippage, and commission costs;
- total worst-case planned loss and utilization;
- a deterministic `WITHIN_LIMIT` or `BLOCKED` gate.

Supported pip-value policies are `QUOTE_CURRENCY` for USD accounts,
`BASE_CURRENCY_AT_ENTRY` for EUR accounts, and `EXPLICIT_QUOTE_TO_ACCOUNT_RATE` for another account
currency with an explicit USD conversion rate.

## 4. Record the operator-owned risk review

Copy `EURUSD_RISK_REVIEW.example.json` to an untracked local path. The decision must be explicit:
`APPROVE`, `BLOCK`, or `REVISE`.

```bash
pnpm run:epoch1-risk-review -- \
  --ingestion .local-data/epoch1/historical-ingestion-run.json \
  --risk .local-data/epoch1/eurusd-risk-calculation.json \
  --decision /path/to/EURUSD_risk_review.json
```

The default output is `.local-data/epoch1/canonical-risk-review.json`.

The command derives the approved position, risk budget, spread, slippage, commission, and engine
version from the calculated artifact. A blocked calculation cannot be approved. The operator review
remains a separate, hash-linked decision and does not grant live execution authority.

## 5. Freeze the historical decision artifact

Copy `EURUSD_DECISION_FREEZE.example.json` to an untracked local path. Record the checked-out
application commit, simulation-policy version, operator identity, explicit reward-to-risk target, and
freeze timestamp.

```bash
pnpm freeze:epoch1-decision -- \
  --ingestion .local-data/epoch1/historical-ingestion-run.json \
  --risk .local-data/epoch1/eurusd-risk-calculation.json \
  --review .local-data/epoch1/canonical-risk-review.json \
  --configuration /path/to/EURUSD_decision_freeze.json
```

The default output is `.local-data/epoch1/frozen-historical-decision.json`.

The immutable artifact contains:

- frozen source manifest, provider snapshot, range, and licensing note;
- raw, normalized 15m, aggregated 1H, and aggregated 4H hashes;
- ingestion and full decision configuration hashes;
- candidate detection, derived observation, and canonical assessment;
- calculated risk and its policy hash;
- operator risk review and review hash;
- decision-time temporal evidence resolved from the historical series;
- entry, invalidation, target, position size, and planned worst-case risk;
- nested frozen decision-bundle hash and outer artifact hash.

Outcome and learning records must never mutate this decision-time artifact.

## Fail-closed boundaries

Progression is rejected when:

- source hash, row count, provider metadata, range, chronology, timestamps, or numbers differ;
- OHLC invariants fail, gaps are unclassified, or 1H/4H windows are incomplete;
- the canonical assessment is not eligible for `PAPER_SIMULATE`;
- invalidation is absent or directionally invalid;
- no permitted position size fits inside the cost-aware risk budget;
- calculated-risk content or source lineage is altered;
- the operator review does not match the calculation or is not valid at freeze time;
- decision evidence cannot be resolved from the frozen historical series;
- nested bundle or outer artifact hashes differ.

Rejected ingestion runs emit no candidates or assessments. Blocked risk calculations emit a zero
position. Non-approved reviews cannot be frozen for local simulation.

Accepted local output is written beneath `.local-data/`, which is ignored by Git.

## Milestone rule

Synthetic fixtures remain useful for unit and integration tests, but they do not satisfy the
real-data Epoch 1 exit criterion. The milestone may only claim a frozen historical decision after
this workflow accepts a real export and the same artifact continues through deterministic
simulation, outcome, learning, and exact reproduction.
