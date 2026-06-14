# TRD-184: CI Evidence Freshness Guard Proposal

## Objective

Define a local freshness rule for Gate 0 remote CI evidence.

## Scope

Allowed:

- Define required CI evidence fields.
- Define a maximum evidence age for manual freshness checks.
- Keep the rule separate from pre-push `pnpm verify:gate0`.

Blocked:

- Making CI evidence an execution approval, changing gates, deployment, broker access, live trading,
  paper execution, autonomous execution, AI prediction, or strategy claims.

## Required Output

- `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Proposal states why the guard is standalone.
- Proposal defines pass/fail fields.
- Gate 0 verification remains passing.

## Source Links

- Remote verification runbook: `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- Current tracker: `ops/runtime/tracklist.md`
