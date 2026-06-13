# TRD-170: Phase 0 Paper Candidate Semantic Block

## Objective

Remove active Phase 0 validation paths that could imply paper-trading readiness.

## Scope

Allowed:

- Block `paper_candidate` risk review validation while the system remains `G0_RESEARCH`.
- Remove `record_paper_candidate` from active operator decision validation.
- Remove paper-candidate maturity from active maturity validation.
- Update local tests.

Blocked:

- Paper trading, paper order placement, live execution, broker integration, strategy readiness
  claims, performance claims, or risk-gate loosening.

## Required Output

- Updated contract schemas and tests.
- `docs/operations/GATE0_PAPER_CANDIDATE_SEMANTIC_BLOCK.md`

## Acceptance Criteria

- Paper-candidate verdicts and operator decisions do not validate as active Phase 0 states.
- Existing research-only review bundle behavior remains valid.
- Gate 0 verification remains passing.

## Source Links

- Risk review schema: `packages/contracts/src/risk-review.ts`
- Operator decision schema: `packages/contracts/src/operator-decision.ts`
- Strategy maturity schema: `packages/contracts/src/strategy-maturity.ts`
- Current tracker: `ops/runtime/tracklist.md`
