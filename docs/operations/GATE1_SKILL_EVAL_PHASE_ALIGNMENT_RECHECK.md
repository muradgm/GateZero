# Gate 1 Skill Eval Phase Alignment Recheck

The skill governance check now scans project skill eval fixtures for stale Gate 0 phase language.

## Guard Rules

- Skill eval fixtures must not use `G0_RESEARCH` as the active gate.
- Skill eval fixtures must not use `research_only` as the active scope.
- Stale Gate 0 boundary wording fails the local skill governance check.

## Boundary

This is a routing and evaluation hygiene check. It does not introduce implicit skill invocation or
new trading capabilities.

## Source Links

- Source packet: `ops/assignments/TRD-332_SKILL_EVAL_PHASE_ALIGNMENT_RECHECK.md`
- Reviews: `ops/runtime/reviews/TRD-332_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-332_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-332_ORCHESTRATOR_ACCEPTANCE.md`
