# Gate 1 Skill Metadata Guard Index Record

The skill metadata stale-phase guard is now documented as part of the Gate 1 control plane.

## Guarded Drift

- Skill metadata must not carry `G0_RESEARCH` as active phase text.
- Skill metadata must not carry `research_only` as active scope text.
- Skill metadata must still require explicit invocation.

## Boundary

The guard controls project skill routing hygiene only. It does not add new skills or implicit
invocation.

## Source Links

- Source packet: `ops/assignments/TRD-349_SKILL_METADATA_GUARD_INDEX_RECORD.md`
- Reviews: `ops/runtime/reviews/TRD-349_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-349_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-349_ORCHESTRATOR_ACCEPTANCE.md`
