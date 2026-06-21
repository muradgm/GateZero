# Gate 1 Review Artifact Aging Policy Draft

TRD-368 drafts a review artifact aging policy.

## Refresh Triggers

- A referenced source file changes materially.
- A gate or scope changes.
- A scanner, guard, or validation command changes behavior.
- A review references stale product naming or stale boundary language.
- A finding is contradicted by later accepted evidence.

## Non-Triggers

- A newer passing CI run exists with no material code or doc change.
- A tracker count increments due to unrelated accepted packets.
- A review is old but still source-linked and accurate.

## Boundary

Review refresh is evidence maintenance only. It does not create approval, readiness, promotion, or
execution authority.

## Source Links

- Source packet: `ops/assignments/TRD-368_REVIEW_ARTIFACT_AGING_POLICY_DRAFT.md`
- Reviews: `ops/runtime/reviews/TRD-368_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-368_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-368_ORCHESTRATOR_ACCEPTANCE.md`
