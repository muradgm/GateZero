# TRD-326 Fixture Mutation Negative Cases

## Goal

Add negative cases proving blocked evidence fixtures reject boundary mutations.

## Scope

- Mutate evidence usability, approval claims, execution paths, gate, and scope.
- Keep tests synthetic and deterministic.
- Avoid external market data.

## Blocked

- No real strategy results.
- No broker or data-provider integration.

## Acceptance

- Negative fixture mutations throw schema errors.
- Guard indexing recognizes the test coverage.
