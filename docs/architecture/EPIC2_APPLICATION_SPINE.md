# Epic 2 — Application Spine

## Purpose

Move protected-loop assembly out of UI code and scripts into explicit application services with validated inputs, durable ports, and auditable outputs.

## Implemented first slice

The first application service is `createSetupReviewService` in `packages/application`.

It owns:

- duplicate setup-review prevention;
- maximum-loss calculation from entry, stop, quantity, fees, and slippage;
- account-risk enforcement;
- supporting-evidence enforcement;
- risk-review enforcement before `PAPER_SIMULATE`;
- canonical Gate 2 boundary fields;
- schema validation;
- repository persistence.

## Package boundaries

`@traderframe/contracts` owns runtime-validated domain contracts.

`@traderframe/application` depends on the contracts package and exposes use cases and persistence ports. UI and script layers should depend on application services rather than assembling protected-loop records themselves.

## Current ports

```text
SetupReviewRepository
  save(review)
  findById(setupReviewId)
```

An in-memory adapter is provided for deterministic tests and local composition. A file-backed adapter should be added before the frontend writes Setup Reviews.

## Remaining Epic 2 work

1. Add a file-backed immutable Setup Review repository.
2. Add `requestRiskReview` and `recordOperatorDecision` services.
3. Separate draft creation from final reviewed decision state.
4. Add explicit transition errors for illegal state movement.
5. Route command-center write paths through the application package.
6. Add an application-level query for the decision-first frontend.

## Boundary

This application layer creates evidence records only. It must not create broker connections, dispatch orders, authorize live activity, or infer approval from successful validation.
