# TRD-780 Risk Review

Status: `accepted`

## Risk-boundary assessment

The command center now frames ranked outputs as evidence indices and bounded operator dispositions.
Risk language refers to review status, visibility, planned loss, ceilings, invalidation, and
exposure rather than trade readiness or approval.

`PAPER_SIMULATE`, `WATCH`, and `REJECT` remain local review dispositions. They do not authorize
simulation by themselves, recommend a trade, imply a buy/sell direction, grant account access, or
create an execution path.

## Acceptance evidence

The language regression guard, workspace build, full verification, and desktop/390px visual QA
passed on 2026-07-28. The review found no control or copy that authorizes execution, bypasses risk
review, or changes the Gate 2 paper-simulation planning boundary.
