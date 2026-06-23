# Gate 2 Frontend Evidence Panel Requirements Draft

## Summary

TRD-467 drafts requirements for future read-only frontend evidence panels. This is a planning record
only.

## Required Panels

| Panel             | Purpose                                             | Boundary                           |
| ----------------- | --------------------------------------------------- | ---------------------------------- |
| Evidence Summary  | Show local evidence bundle status and source links. | No trade recommendation.           |
| Limitations       | Keep simulation assumptions and caveats visible.    | No readiness or safety claim.      |
| Risk Review       | Show risk review status and blockers.               | No approval semantics.             |
| Operator Workflow | Show manual local workflow state.                   | No automation or execution action. |
| Verification      | Show local validation and review coverage.          | Repository health only.            |
| Source Links      | Link packets, reviews, docs, and tests.             | Local records only.                |

## Interaction Rules

- Panels may filter, navigate, expand, and reveal source links.
- Panels must not place orders, connect accounts, store credentials, generate buy/sell calls, or
  promote strategies.
- Warning and limitation copy should stay near any evidence display.

## Result

Future frontend implementation should start only after a separate implementation packet accepts the
read-only scope, panel requirements, QA checks, and risk gates.

## Next Task

Proceed to future bounded frontend planning, starting with frontend information architecture.

## Source Links

- Source packet: `ops/assignments/TRD-467_FRONTEND_EVIDENCE_PANEL_REQUIREMENTS_DRAFT.md`
- QA/security review: `ops/runtime/reviews/TRD-467_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-467_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-467_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
