# Gate 0 Paper Candidate Semantic Block

## Purpose

This document records the Phase 0 semantic block for active paper-candidate validation states.

GateZero remains `G0_RESEARCH` and `research_only`. This document does not authorize paper trading,
paper order placement, broker integration, live execution, strategy readiness claims, or performance
claims.

## Blocked Active States

- `paper_candidate` no longer validates as an active risk-review result at Gate 0.
- `record_paper_candidate` no longer validates as an operator decision.
- Paper-candidate maturity is not an active maturity state while Phase 0 remains research-only.

Historical docs may still mention paper candidates as blocked or future-phase language, but active
contracts must not validate that state.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Risk review schema: `packages/contracts/src/risk-review.ts`
- Operator decision schema: `packages/contracts/src/operator-decision.ts`
- Strategy maturity schema: `packages/contracts/src/strategy-maturity.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-170_PHASE0_PAPER_CANDIDATE_SEMANTIC_BLOCK.md`
- Reviews: `ops/runtime/reviews/TRD-170_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-170_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-170_ORCHESTRATOR_ACCEPTANCE.md`
