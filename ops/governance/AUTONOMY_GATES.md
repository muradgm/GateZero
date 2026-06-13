# Autonomy Gates

## Gate A — Advisory

Agent may analyze, critique, design, or propose. It may not modify canonical truth or execution
policy.

## Gate B — Bounded Execution

Agent may modify named files from an assignment packet. QA/Security review is mandatory.

## Gate C — Repeatable Low-Risk Lane

Allowed only for well-benchmarked non-financial tasks.

Examples:

- UI copy cleanup
- test fixture expansion
- docs sync

Forbidden for:

- broker code
- risk rules
- strategy promotion
- live execution
- secrets handling

## Gate D — Human Decision Required

Triggered by:

- risk-limit changes
- data-model changes affecting metrics
- strategy-readiness changes
- paper/live promotion
- broker integration
- execution policy changes

## Gate E — Frozen Lane

No new execution. Only diagnosis and repair.
