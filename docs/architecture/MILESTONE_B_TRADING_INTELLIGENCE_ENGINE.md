# Milestone B — Trading Intelligence Engine

## Purpose

Turn TraderFrame from an evidence display surface into an explainable decision-support engine while
preserving operator control and the Gate 2 non-execution boundary.

## Implemented first slice

- bounded evidence contributions by dimension;
- contribution-level evidence references, rationale, and limitations;
- bull, bear, and neutral cases;
- evidence score derived from visible contributions;
- calibrated confidence derived from score and unresolved downgrade reasons;
- bounded recommendation outcomes: `REJECT`, `WATCH`, or `PAPER_SIMULATE`;
- chronological intelligence timeline events;
- deterministic candidate ranking;
- explicit non-execution and non-performance-claim fields.

## Evidence-tree model

The score begins at a neutral baseline of 50. Each contribution adds or subtracts no more than 25
points and must identify:

- its intelligence dimension;
- the evidence records supporting it;
- whether it supports, contradicts, or remains neutral;
- its bounded point contribution;
- its reasoning;
- its limitation.

The final score is constrained to `0..100`. It is a review aid, not a probability of profit.

## Recommendation boundary

`PAPER_SIMULATE` requires:

- score of at least 80;
- high derived confidence;
- no unresolved downgrade reasons.

The report never creates broker access, order routing, autonomous action, performance claims, or
live-trading authority.

## Next slices

1. Build candidate inputs from real Setup Review assessments.
2. Generate browser runtime data from intelligence reports rather than static cards.
3. Add portfolio exposure and correlation concentration contributions.
4. Add timeline replay to the command center.
5. Add outcome comparison without rewriting the original report.
