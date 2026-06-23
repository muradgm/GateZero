# Gate 2 Paper Simulation Limitation Register

## Summary

TRD-460 records limitations that must stay visible before any frontend or product expansion.

## Limitations

| Limitation                       | Boundary                                                               |
| -------------------------------- | ---------------------------------------------------------------------- |
| Simulation is local              | No external account, broker, market venue, or live route is connected. |
| Evidence is synthetic/bounded    | It supports workflow validation, not profitability or market claims.   |
| Risk review is local             | It does not approve strategies or authorize execution.                 |
| Operator action is manual        | No autonomous action path is introduced.                               |
| Fill assumptions are assumptions | They are not execution quality, liquidity, or slippage promises.       |
| UI is command-center only        | It is not a trading terminal.                                          |

## Required Display Posture

Future frontend panels should show limitations near evidence and review state. The UI must not make
progress appear more important than risk boundaries.

## Result

Gate 2 remains local paper-simulation evidence only.

## Next Task

Proceed to `TRD-461`, the operator workflow dry-run plan.

## Source Links

- Source packet: `ops/assignments/TRD-460_PAPER_SIMULATION_LIMITATION_REGISTER.md`
- QA/security review: `ops/runtime/reviews/TRD-460_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-460_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-460_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
