# Gate 2 Next Gap Intake

## Summary

TRD-456 records the next concrete Gate 2 gaps after the local simulation mechanics closure audit.
The mechanics lane is complete for its current bounded purpose, but the product is not a complete
frontend application. The current frontend is a read-only command-center baseline for operating
health, evidence freshness, and control-plane status.

This packet does not authorize UI expansion. It identifies the gap so it can be sequenced behind
wording, stale-reference, limitation, and no-expansion checks.

## Current Gate

- Operating gate: `G2_PAPER_TRADING`.
- Operating scope: `paper_simulation_planning_only`.
- Current allowed capability: local deterministic paper-simulation mechanics and read-only
  control-plane visibility.
- Current blocked capability: broker connectivity, external accounts, live execution, autonomous
  execution, AI directional prediction, real orders, approval labels, readiness labels, and
  performance claims.

## Concrete Local Evidence Gaps

| Gap                          | Current Evidence                                                                       | Required Next Action                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Frontend app shell           | `apps/web` is a static/read-only command-center baseline.                              | Queue a bounded read-only app-shell scope assessment after control-plane wording checks. |
| Command-center wording       | Mechanics are implemented, but some copy may still imply planning-only mechanics.      | Run the post-mechanics wording audit in `TRD-457`.                                       |
| Stale references             | Gate 2 docs may contain stale "planning only" language after mechanics implementation. | Sweep mechanics docs in `TRD-458`.                                                       |
| Guard aging                  | Guard coverage is green, but mechanics changed the evidence surface.                   | Review guard freshness in `TRD-459`.                                                     |
| Paper-simulation limitations | Limitations need a current register before product expansion.                          | Record the limitations register in `TRD-460`.                                            |
| Operator workflow            | Mechanics exist, but a manual local workflow dry-run plan is not yet recorded.         | Plan the local workflow in `TRD-461`.                                                    |
| No-expansion posture         | Gate 2 must stay free of broker, live, AI, and autonomy paths.                         | Recheck blocked scope in `TRD-462`.                                                      |
| Brand isolation              | Brand handoff remains a separate dirty workstream.                                     | Recheck isolation in `TRD-463`.                                                          |
| Maintenance decision         | The project needs a bounded pause-or-proceed checkpoint.                               | Run `TRD-464` and `TRD-465`.                                                             |

## Frontend Finding

The frontend should not be described as complete. What is complete is the Gate 2 local mechanics
lane and its command-center visibility. The next frontend-relevant work should be a scope assessment
for a read-only TraderFrame app shell that can present evidence, reviews, limitations, and operator
workflow state without adding trade controls or execution affordances.

## Recommendation

Proceed next with `TRD-457`, the command-center post-mechanics wording audit. Queue the frontend
app-shell scope assessment after the wording, stale-reference, limitation, operator workflow, and
no-expansion checks have been accepted.

## Source Links

- Source packet: `ops/assignments/TRD-456_NEXT_GATE2_GAP_INTAKE.md`
- QA/security review: `ops/runtime/reviews/TRD-456_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-456_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-456_ORCHESTRATOR_ACCEPTANCE.md`
- Command center data: `apps/web/src/command-center-data.js`
- Tracklist: `ops/runtime/tracklist.md`
