# Epoch 1 Historical Dataset, Ingestion, and Risk

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

## Verify the frozen source only

1. Copy `EURUSD_15M_MANIFEST.example.json` to a local path outside tracked repository content.
2. Fill in the exact dataset metadata.
3. Calculate the SHA-256 hash of the CSV after final export.
4. Run:

```bash
pnpm import:epoch1-dataset -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json
```

Optional output path:

```bash
pnpm import:epoch1-dataset -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json \
  --output .local-data/epoch1/historical-import.json
```

## Run the deterministic ingestion pipeline

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

The default output is:

```text
.local-data/epoch1/historical-ingestion-run.json
```

A different output can be supplied with `--output`.

## Optional event context

Candidate detection remains deterministic without macro-event data, but the canonical assessment
marks event context unavailable rather than assuming the window is clear.

A local JSON object can provide an explicit integer minute distance for decision timestamps:

```json
{
  "2025-01-02T12:15:00.000Z": 90,
  "2025-01-02T12:30:00.000Z": 75
}
```

Run with:

```bash
pnpm run:epoch1-ingestion -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json \
  --event-context /path/to/EURUSD_event_context.json
```

Missing timestamps remain `UNAVAILABLE`; they are not interpreted as event-safe.

## Calculate instrument-aware EUR/USD risk

Copy `EURUSD_RISK_POLICY.example.json` to an untracked local path and set the account equity, risk
budget, pip-value policy, execution-cost assumptions, and position-size limits.

Run:

```bash
pnpm exec tsx scripts/run-epoch1-risk-calculation.ts -- \
  --ingestion .local-data/epoch1/historical-ingestion-run.json \
  --policy /path/to/EURUSD_risk_policy.json \
  --candidate <candidate-id>
```

The default output is:

```text
.local-data/epoch1/eurusd-risk-calculation.json
```

The risk engine records:

- account currency and risk basis;
- source-run and candidate lineage;
- policy and canonical-assessment hashes;
- stop distance in pips;
- pip value per unit;
- adverse entry and stop execution prices;
- position size rounded down to the declared unit increment;
- planned gross loss;
- spread, slippage, and commission costs;
- total worst-case planned loss;
- risk-budget utilization;
- a deterministic `WITHIN_LIMIT` or `BLOCKED` gate;
- engine version and calculation hash.

Supported EUR/USD pip-value policies:

- `QUOTE_CURRENCY` for USD accounts;
- `BASE_CURRENCY_AT_ENTRY` for EUR accounts;
- `EXPLICIT_QUOTE_TO_ACCOUNT_RATE` for another account currency with an explicit USD conversion
  rate.

A calculated risk result does not grant execution authority. An operator must still create a
hash-linked canonical risk review before local paper simulation.

## Fail-closed boundaries

The importer, ingestion pipeline, or risk engine rejects progression when:

- the content hash differs;
- the row count differs;
- provider metadata differs;
- timestamps or numbers are invalid;
- rows are out of order;
- rows fall outside the declared range;
- OHLC invariants fail;
- data gaps are unclassified;
- 1H or 4H windows are incomplete;
- the adapter reports any partial-import failure;
- the canonical assessment is not eligible for `PAPER_SIMULATE`;
- invalidation is missing or directionally invalid;
- commission consumes the risk budget;
- no permitted position increment fits inside the total worst-case risk budget.

Rejected ingestion runs do not emit candidates or canonical assessments. Blocked risk calculations
emit a zero position and explicit blockers.

Accepted local output is written beneath `.local-data/`, which is ignored by Git.

## Milestone rule

Synthetic fixtures remain useful for unit and integration tests, but they do not satisfy the
real-data Epoch 1 exit criterion. The milestone may only claim a frozen historical source after this
pipeline accepts a real export and its ingestion, risk, decision, simulation, outcome, and learning
hashes are recorded in one validated trace.
