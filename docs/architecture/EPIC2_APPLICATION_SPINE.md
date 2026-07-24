# Epic 2 — Application Spine

## Purpose

Move protected-loop assembly out of UI code and scripts into explicit application services with
validated inputs, durable ports, and auditable outputs.

## Implemented services

`packages/application` now owns the first complete Setup Review workflow:

```text
createSetupReviewService
  -> requestRiskReviewService
  -> recordOperatorDecisionService
  -> querySetupReviewsService
```

The legal state flow is:

```text
draft -> ready_for_risk_review -> reviewed
```

Creation cannot select `PAPER_SIMULATE`. That outcome is only available after a separate risk-review
reference and explicit operator decision.

## Enforced behavior

The application layer owns:

- duplicate setup-review prevention;
- maximum-loss calculation from entry, stop, quantity, fees, and slippage;
- account-risk enforcement;
- supporting-evidence enforcement;
- explicit state-transition validation;
- risk-review enforcement before `PAPER_SIMULATE`;
- canonical Gate 2 boundary fields;
- schema validation;
- repository persistence;
- decision-oriented query summaries for browser surfaces.

## Package boundaries

`@traderframe/contracts` owns runtime-validated domain contracts.

`@traderframe/application` depends on the contracts package and exposes use cases and persistence
ports. UI and script layers should depend on application services rather than assembling
protected-loop records themselves.

## Persistence ports

```text
SetupReviewRepository
  save(review)
  findById(setupReviewId)
  list()
```

Two adapters are available:

- `InMemorySetupReviewRepository` for deterministic tests and local composition;
- `FileSetupReviewRepository` for append-only local revisions.

The file adapter writes content-hashed revision files and never overwrites a previous revision.

## Epic 2 completion criteria

- [x] Application package and workspace dependency boundaries.
- [x] Draft creation service.
- [x] Risk-review request transition.
- [x] Operator-decision transition.
- [x] Illegal transition errors.
- [x] Append-only file-backed persistence.
- [x] Decision-oriented query service.
- [x] Workflow tests covering draft through reviewed state.
- [ ] Route the browser runtime endpoint through the query service.

The final unchecked item is intentionally the bridge into Epic 5's decision-first command center.
The domain and application spine are now ready for that integration.

## Boundary

This application layer creates evidence records only. It must not create broker connections,
dispatch orders, authorize live activity, or infer approval from successful validation.
