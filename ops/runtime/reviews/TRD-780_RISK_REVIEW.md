# TRD-780 Risk Review

Status: `pending_validation`

## Risk-boundary assessment

The command center now frames ranked outputs as evidence indices and bounded operator dispositions.
Risk language refers to review status, visibility, planned loss, ceilings, invalidation, and exposure
rather than trade readiness or approval.

`PAPER_SIMULATE`, `WATCH`, and `REJECT` remain local review dispositions. They do not authorize
simulation by themselves, recommend a trade, imply a buy/sell direction, grant account access, or
create an execution path.

## Required validation

Risk signoff remains withheld until the language regression test, workspace build, full verification,
and browser visual QA pass. Any copy or control that implies readiness, approval, prediction,
profitability, external dispatch, or autonomous action blocks acceptance.
