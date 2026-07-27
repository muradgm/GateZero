# Epoch 1 Historical Dataset Import

The validated decision trace must use one real EUR/USD 15-minute historical export. The repository
does not commit provider data unless redistribution is explicitly permitted.

## Required CSV format

```csv
timestamp,open,high,low,close,volume
2025-01-02T12:00:00.000Z,1.03500,1.03540,1.03480,1.03520,123
```

Requirements:

- timestamps are explicit ISO UTC datetimes ending in `Z`;
- rows are chronological;
- the declared range uses an inclusive start and exclusive end;
- the file is not manually edited after its SHA-256 hash is recorded;
- the manifest records source identity, licensing, range, expected row count, and hash.

## Local workflow

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

The importer fails closed when:

- the content hash differs;
- the row count differs;
- provider metadata differs;
- timestamps or numbers are invalid;
- rows are out of order;
- rows fall outside the declared range;
- the adapter reports any partial-import failure.

Accepted output is written beneath `.local-data/`, which is ignored by Git.

## Milestone rule

Synthetic fixtures remain useful for unit tests, but they do not satisfy the real-data Epoch 1 exit
criterion. The milestone may only claim a frozen historical source after this importer accepts a real
export and the resulting hash is recorded in the validated trace.
