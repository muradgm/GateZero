# TraderFrame Release Status

## Status

| Field | Current value |
| --- | --- |
| Product | TraderFrame |
| Internal control plane | GateZero |
| Operating gate | `G2_PAPER_TRADING` |
| Operating scope | `paper_simulation_planning_only` |
| Product mode | Local research and read-only decision support |
| Execution authority | None |
| Current initiative | Trading Intelligence Command Center |
| Current milestone | Evidence-Gated Setup Review MVP |

## What exists today

TraderFrame currently provides a substantial local research foundation:

- runtime-validated contracts;
- deterministic historical backtest evidence;
- output and dataset integrity hashes;
- reproducibility checks;
- fee, spread, and slippage assumptions;
- local paper-account and simulation mechanics;
- research-case intake and revision evidence;
- intelligence-brief review records;
- read-only command-center and simulator evidence surfaces;
- validation, security, risk, and forbidden-scope controls.

## What is not complete

TraderFrame should not yet be described as a complete trading application or a complete Trading
Intelligence Command Center.

The following product capabilities are incomplete or absent:

- a decision-first application shell;
- a canonical Setup Review aggregate;
- a dynamic market overview and candidate queue;
- multi-timeframe market context;
- systematic supporting versus contradicting evidence;
- calibrated evidence-quality assessment;
- mandatory invalidation and integrated portfolio impact;
- a complete operator workflow from candidate to outcome learning;
- external historical-data adapters;
- browser-level end-to-end workflow coverage.

## Current quality position

The repository has strong contract, fixture, test, and governance coverage. Passing repository
validation indicates control-plane integrity; it does not imply strategy profitability, market
readiness, execution readiness, or permission to trade.

## Known consistency debt

- Several compatibility commands still use Gate 0 naming.
- The historical tracklist is too large to function as the current roadmap.
- Runtime counts and status values have been duplicated across documentation and frontend source.
- Some generated snapshots are refreshed within check commands instead of being independently
  validated.
- Gate 1 evidence can appear inside Gate 2 workflows without an explicit origin-versus-consumption
  authority model.

These items are part of the Source-of-Truth Consolidation milestone.

## Release boundary

The following remain blocked:

- broker or exchange integration;
- external account and credential handling;
- live or external paper order routing;
- autonomous trade execution;
- unreviewed AI directional decisions;
- performance, approval, or readiness claims.

## Next release target

The next release target is not a broader dashboard. It is one complete Evidence-Gated Setup Review
vertical slice that produces a traceable `REJECT`, `WATCH`, or `PAPER_SIMULATE` operator decision and
connects it to a later immutable outcome and learning event.
