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
- instrument-aware EUR/USD pip valuation and position sizing;
- explicit spread, slippage, and commission cost calculation;
- worst-case planned-loss gate with deterministic hashes;
- source-run, candidate, policy, and assessment risk lineage;
- operator-owned canonical review linked to calculated risk;
- immutable historical decision artifact assembly;
- decision-time evidence resolution from frozen source candles;
- nested bundle and outer artifact integrity hashes;
- deterministic simulation mechanics;
- outcome and learning records;
- reproducibility checkpoint mechanics;
- workspace projections.

## Historical decision pipeline

Implemented application path:

```text
frozen manifest verification
→ Dukascopy CSV adaptation
→ 15m validation and UTC normalization
→ deterministic 1H and 4H aggregation
→ chronological candidate detection
→ canonical decision assessment
→ instrument-aware EUR/USD risk
→ operator-owned risk review
→ immutable historical decision artifact
```

The historical artifact contains the source manifest and provider snapshot, all canonical source
hashes, detection and assessment records, calculated risk, operator review, resolved temporal
evidence, simulation plan, application commit, configuration hashes, and immutable integrity hashes.

The freeze service rejects progression when calculated risk is altered, source lineage differs,
review values do not preserve the calculation, review validity has expired, or evidence cannot be
resolved from the historical run.

## Remaining proof requirements

1. Supply one real EUR/USD 15-minute historical export with permitted local use.
2. Execute ingestion against that source and record the accepted raw, normalized, 1H, and 4H hashes.
3. Confirm candidates are detected from real candles without injected observations.
4. Execute instrument-aware risk and an operator review from the same lineage.
5. Freeze the real-source historical decision artifact.
6. Run deterministic simulation directly from that frozen artifact and the post-decision candles.
7. Produce outcome and learning records from the same artifact and simulation output.
8. Prove exact replay from the frozen source, policies, and configuration.
9. Replace or supplement the synthetic browser proof with the real-source trace.
10. Pass `pnpm verify` and browser E2E.

## Current active phase

**Deterministic paper simulation from the frozen historical decision artifact.**

The complete local workflow through freezing is documented in `docs/data/README.md`:

```text
run:epoch1-ingestion
→ run:epoch1-risk
→ run:epoch1-risk-review
→ freeze:epoch1-decision
```

The next slice must consume `frozen-historical-decision.json`, verify both integrity hashes, select
only post-decision 15-minute candles from the same historical source, enforce the versioned
simulation policy, and emit a deterministic simulation result without silently resolving unknown
intrabar order.

## Claim boundary

Until the real-source path passes, the branch may claim:

> Deterministic validated-trace mechanics, fail-closed historical ingestion, instrument-aware risk,
> operator review, and immutable historical decision freezing are implemented and covered by
> synthetic tests.

It may not claim:

> Epoch 1 completed from real historical market data.
