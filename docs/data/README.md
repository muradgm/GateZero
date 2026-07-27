# Epoch 1 Historical Dataset and Ingestion

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

## Fail-closed boundaries

The importer or pipeline rejects progression when:

- the content hash differs;
- the row count differs;
- provider metadata differs;
- timestamps or numbers are invalid;
- rows are out of order;
- rows fall outside the declared range;
- OHLC invariants fail;
- data gaps are unclassified;
- 1H or 4H windows are incomplete;
- the adapter reports any partial-import failure.

Rejected runs do not emit candidates or canonical assessments.

Accepted output is written beneath `.local-data/`, which is ignored by Git.

## Milestone rule

Synthetic fixtures remain useful for unit and integration tests, but they do not satisfy the
real-data Epoch 1 exit criterion. The milestone may only claim a frozen historical source after this
pipeline accepts a real export and the resulting hashes are recorded in the validated trace.
