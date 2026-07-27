# Epoch 1 Completion Status

## Current verdict

**Not complete against the governing real-data exit criteria.**

The branch contains a deterministic synthetic proof that exercises canonical assessment, risk
review, frozen decision state, simulation, outcome, learning, and reproducibility. That proof is
valuable integration evidence, but it does not replace the required real historical ingestion path.

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
- risk-review contract and deterministic simulation mechanics;
- frozen decision-bundle mechanics;
- outcome and learning records;
- reproducibility checkpoint mechanics;
- workspace projections.

## Remaining proof requirements

1. Import one real EUR/USD 15-minute historical export through the frozen dataset manifest workflow.
2. Validate its hash, row count, range, chronology, timestamps, and adapter result.
3. Normalize and aggregate the accepted source.
4. Detect candidates from that source without manually authored observations.
5. Build canonical assessments from detected candidates.
6. Run risk, freezing, simulation, outcome, learning, and reproduction from the same source lineage.
7. Replace or supplement the synthetic browser proof with a real-source trace.
8. Pass `pnpm verify` and browser E2E.

## Current active phase

**Frozen historical dataset import.**

Use:

```bash
pnpm import:epoch1-dataset -- \
  --csv /path/to/EURUSD_15m.csv \
  --manifest /path/to/EURUSD_15m.manifest.json
```

See `docs/data/README.md`.

## Claim boundary

Until the real-source path passes, the branch may claim:

> Deterministic validated-trace mechanics demonstrated with a local synthetic fixture.

It may not claim:

> Epoch 1 completed from real historical market data.
