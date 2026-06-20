# Gate 1 Skill Guard Naming Recheck

The skill governance guard now checks skill metadata for stale Gate 0 active-phase snippets.

## Guard Result

- `G0_RESEARCH`, `research_only`, and `Gate 0 scope` are rejected in skill metadata.
- Eval fixtures continue to reject stale Gate 0 wording.
- Explicit invocation remains required.

## Boundary

This is skill routing hygiene only. It does not authorize implicit skills or trading autonomy.

## Source Links

- Source packet: `ops/assignments/TRD-334_GATE1_SKILL_GUARD_NAMING_RECHECK.md`
- Reviews: `ops/runtime/reviews/TRD-334_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-334_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-334_ORCHESTRATOR_ACCEPTANCE.md`
