# Epoch 1 Completion Status

## Current verdict

**Not complete against the governing real-data exit criteria.**

The branch contains a deterministic synthetic proof that exercises canonical assessment, risk
review, frozen decision state, simulation, outcome, learning, and reproducibility. That proof is
valuable integration evidence, but it does not replace the required real historical source lineage.

The generated file `epoch1-validated-case.json` currently declares:

```text
dataMode = LOCAL_VALIDATED_FIXTURE
```

It must not be represented as a real-market validation result.

## Completed foundation

- deterministic EUR/USD strategy observations and gates;
- canonical recommendation authority;
- candidate detection;
- provider adapter boundary;
- frozen source manifest and hash verification;
- fail-closed historical dataset import;
- deterministic 15m normalization;
- deterministic 1H and 4H aggregation;
- end-to-end candidate detection and canonical assessment service;
- risk-review contract and deterministic simulation mechanics;
- frozen decision-bundle mechanics;
- outcome and learning records;
- reproducibility checkpoint mechanics;
- workspace projections.

## Historical ingestion pipeline

Implemented application path:

```text
frozen manifest verification
→ Dukascopy CSV adaptation
→ 15m validation and UTC normalization
→ deterministic 1H aggregation
→ deterministic 4H aggregation
→ chronological candidate detection
→ canonical decision assessment
```

The run records source, configuration, normalized-series, higher-timeframe, candidate, and
assessment identities. It fails closed before candidate evaluation when import, validation, or
aggregation fails.

## Remaining proof requirements

1. Supply one real EUR/USD 15-minute historical export with permitted local use.
2. Execute the frozen manifest and ingestion workflow against that source.
3. Record the accepted raw, normalized, 1H, and 4H hashes.
4. Confirm candidates are detected from real candles without injected or manually authored
   observations.
5. Run instrument-aware risk from the same candidate and source lineage.
6. Freeze the real-source decision bundle.
7. Run simulation, outcome, learning, and reproduction from that same frozen bundle.
8. Replace or supplement the synthetic browser proof with the real-source trace.
9. Pass `pnpm verify` and browser E2E.

## Current active phase

**Execute the historical ingestion pipeline with a real frozen source.**

Use:

```bash
pnpm run:epoch1-ingestion -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json
```

Optional explicit event context:

```bash
pnpm run:epoch1-ingestion -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json \
  --event-context /path/to/EURUSD_event_context.json
```

See `docs/data/README.md`.

## Claim boundary

Until the real-source path passes, the branch may claim:

> Deterministic validated-trace mechanics and a fail-closed historical ingestion pipeline are
> implemented and covered by synthetic tests.

It may not claim:

> Epoch 1 completed from real historical market data.
