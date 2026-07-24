# Milestone 2 Plan — Application Spine

## Outcome

A single application layer owns progression through the protected decision loop.

## Package

```text
packages/application/
  package.json
  src/
    index.ts
    create-research-case.ts
    build-market-context.ts
    assemble-setup-review.ts
    run-strategy-evidence.ts
    assess-evidence-quality.ts
    calculate-risk-plan.ts
    calculate-portfolio-impact.ts
    request-risk-review.ts
    record-operator-decision.ts
    create-paper-simulation-candidate.ts
    record-outcome.ts
    create-learning-event.ts
  tests/
```

## Responsibilities

- Coordinate contracts and core domain mechanics.
- Enforce allowed state transitions.
- Return explicit domain errors for missing evidence, invalid risk, or forbidden scope.
- Preserve immutable references between thesis, decision, simulation, outcome, and learning.
- Keep UI rendering and storage details outside domain logic.

## Package-boundary changes

- Add package manifests and export maps to internal packages where missing.
- Replace direct relative imports such as `../../contracts/src/index.js` with workspace imports.
- Prevent UI and scripts from reaching into internal source paths.
- Add dependency-boundary validation.

## Non-goals

- No network provider abstraction in this milestone.
- No database requirement.
- No external data, broker, account, or execution adapters.
- No AI-generated decision authority.

## Exit criteria

- One fixture can advance through the full protected loop using application services.
- Invalid state transitions fail deterministically.
- The frontend can consume application outputs without assembling domain state itself.
- Package-level imports use declared workspace boundaries.
