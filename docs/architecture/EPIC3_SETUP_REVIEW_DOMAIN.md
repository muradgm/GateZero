# Epic 3 — Setup Review Domain Completion

## Purpose

Turn Setup Review from a valid record into a decision-quality aggregate that can explain why a market candidate is rejected, watched, or eligible for local paper simulation.

## Implemented domain records

### MarketContext

Market context records:

- instrument and operating session;
- volatility and liquidity regime;
- broad directional bias;
- at least two timeframe states;
- macro-event risk;
- portfolio correlation risk;
- observation and expiry times;
- explicit limitations.

A market context record is invalid when its validity window does not extend beyond its observation time.

### EvidenceQuality

Each material evidence record can now be evaluated for:

- freshness;
- provenance;
- sample sufficiency;
- regime relevance;
- independence from other evidence;
- bounded quality score;
- visible limitations.

### SetupReviewAssessment

The assessment connects a reviewed Setup Review with current market context and evidence-quality records.

It exposes:

- supporting-evidence quality;
- contradicting-evidence quality;
- risk quality;
- composite score;
- calibrated confidence;
- downgrade reasons;
- bounded recommendation;
- operator and risk-review requirements.

Allowed recommendations remain:

```text
REJECT
WATCH
PAPER_SIMULATE
```

## Deterministic downgrade rules

The evaluator records downgrade reasons when any of the following are true:

- market context is stale;
- supporting evidence lacks a quality assessment;
- evidence is stale or unverified;
- sample support is insufficient;
- evidence is mismatched to the current regime;
- macro or volatility event risk is high;
- portfolio correlation risk is high;
- risk review is incomplete.

A Setup Review cannot reach `PAPER_SIMULATE` while any downgrade reason remains unresolved.

## Scoring posture

The score is not a prediction of profit and is not an approval claim.

It is a deterministic review aid composed from:

- supporting evidence quality;
- risk quality;
- contradicting evidence pressure.

The operator retains final authority. Successful validation creates no execution path.

## Exit criteria

Epic 3 is complete when:

- market context is structured and time-bounded;
- every material evidence record can expose quality and limitations;
- stale, missing, insufficient, mismatched, or unverified evidence produces a downgrade;
- high event or correlation risk prevents escalation;
- `PAPER_SIMULATE` requires high calibrated confidence and no unresolved downgrade reasons;
- all recommendations remain local, evidence-only, and non-executing.

## Next integration

Epic 4 should harden historical evidence correctness and then supply real quality inputs to this evaluator:

- explicit signal-timing tests;
- fill-adjusted exposure checks;
- conservative liquidation equity;
- sample sufficiency;
- regime segmentation;
- out-of-sample evidence;
- strategy-plugin boundaries.
