# Milestone 3 Plan — Setup Review Domain

## Outcome

A canonical Setup Review aggregate connects market context, thesis, evidence, strategy results,
invalidation, risk, portfolio impact, operator decision, and limitations.

## Initial implementation order

1. Add contracts for the aggregate and nested domain records.
2. Add invariant helpers for `REJECT`, `WATCH`, and `PAPER_SIMULATE`.
3. Add fixtures for each decision outcome.
4. Add application assembly and transition services.
5. Add a generated read-only frontend projection.

## Critical invariants

`PAPER_SIMULATE` must fail unless:

- the thesis is directional;
- market context is current;
- supporting evidence exists;
- contradicting evidence has been reviewed;
- strategy evidence is reproducible;
- invalidation is observable;
- risk review is accepted;
- projected exposure is allowed;
- no critical evidence blocker exists;
- the operator records a manual decision.

`WATCH` must explain what is missing or unresolved.

`REJECT` must preserve the rejected thesis and evidence rather than deleting or rewriting the case.

## Fixtures

Create at least:

- strong evidence but exposure blocked -> `REJECT`;
- plausible setup awaiting trigger -> `WATCH`;
- complete bounded case -> `PAPER_SIMULATE`;
- stale context -> `WATCH`;
- integrity mismatch -> `REJECT`;
- missing invalidation -> cannot reach `PAPER_SIMULATE`.

## Exit criteria

- Contracts and invariants are fully tested.
- Every outcome is explainable through decision reasons and blockers.
- No scalar confidence score can bypass evidence or risk requirements.
- The aggregate remains local, read-only, and free of execution authority.
