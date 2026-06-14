# TRD-185: CI Evidence Freshness Guard Implementation

## Objective

Add a standalone local guard that checks recorded Gate 0 GitHub CI evidence for successful, recent,
locally known pushed-commit records.

## Scope

Allowed:

- Add a TypeScript guard script.
- Add focused unit tests.
- Add a package script for manual operator use.
- Keep the guard outside `pnpm check:gate0` to avoid circular pre-push validation.

Blocked:

- Product behavior changes, deployment, broker access, credential handling, live trading, paper
  execution, autonomous execution, AI prediction, strategy claims, or risk-gate loosening.

## Required Output

- `scripts/check-gate0-ci-evidence-freshness.ts`
- `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`
- `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_IMPLEMENTATION.md`
- Updated `package.json`

## Acceptance Criteria

- Guard fails on unsuccessful evidence.
- Guard fails when evidence commit is not known in local git history.
- Guard fails when evidence is older than the configured freshness window.
- Gate 0 verification remains passing.

## Source Links

- Freshness proposal: `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`
- Current tracker: `ops/runtime/tracklist.md`
