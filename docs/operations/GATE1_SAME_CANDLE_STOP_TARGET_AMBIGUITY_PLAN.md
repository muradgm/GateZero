# Gate 1 Same-Candle Stop/Target Ambiguity Plan

## Purpose

Record how same-candle stop/target ambiguity is handled in Gate 1 evidence.

## Implemented Contract

- Schema: `Gate1SameCandleAmbiguityContractSchema`
- Fixture: `gate1SameCandleAmbiguityFixture`

## Boundary

Ambiguous same-candle sequencing blocks evidence use unless intrabar order is known. This does not
create a fill engine or execution path.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-290_SAME_CANDLE_STOP_TARGET_AMBIGUITY_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-290_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-290_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-290_ORCHESTRATOR_ACCEPTANCE.md`
