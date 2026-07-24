# Milestone 6 Plan — Outcome and Learning

## Outcome

TraderFrame compares the original decision-time thesis with observed results without rewriting historical evidence.

## Records

- immutable decision-time evidence bundle;
- paper-simulation candidate;
- simulation outcome;
- thesis-versus-outcome comparison;
- structured learning event.

## Learning dimensions

- thesis quality;
- evidence completeness;
- contradictory evidence handling;
- entry and timing quality;
- invalidation quality;
- risk sizing;
- exposure and correlation;
- execution-assumption error;
- regime mismatch;
- process adherence.

## Invariants

- Outcome records cannot mutate the original thesis.
- Learning events must link to both decision and outcome records.
- A profitable outcome does not automatically validate a weak decision.
- A losing outcome does not automatically invalidate a well-formed decision.
- Process quality and outcome quality are assessed separately.

## Exit criteria

- One complete MVP case reaches `LEARNING_RECORDED`.
- The operator can reconstruct what was known at decision time.
- The learning event identifies what was correct, incorrect, missing, or poorly risked.
- No learning record becomes autonomous strategy promotion or execution authority.
