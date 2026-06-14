# Gate 0 CI Evidence Freshness Guard Proposal

## Purpose

This proposal defines a local freshness rule for Gate 0 GitHub Actions evidence records.

## Rule

A CI evidence record is fresh enough for manual audit when:

- The latest evidence workflow is `Gate 0 Verification`.
- The latest evidence event is `push`.
- The latest evidence status is `completed`.
- The latest evidence conclusion is `success`.
- The evidence URL includes the recorded run id.
- The evidence commit is known in local git history.
- The evidence timestamp is no older than 14 days when the manual check is run.

## Standalone Guard Decision

The freshness guard must remain outside `pnpm check:gate0` and `pnpm verify:gate0`.

Reason: a post-push CI evidence record can only exist after a commit is pushed and GitHub Actions
runs. Making it part of pre-push verification would create a circular workflow.

## Boundary

Fresh CI evidence is repository-quality evidence only. It is not deployment approval, strategy
approval, risk approval, execution readiness, profitability evidence, or gate advancement.

## Source Links

- Source packet: `ops/assignments/TRD-184_CI_EVIDENCE_FRESHNESS_GUARD_PROPOSAL.md`
- Reviews: `ops/runtime/reviews/TRD-184_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-184_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-184_ORCHESTRATOR_ACCEPTANCE.md`
- Remote verification runbook: `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- Tracker: `ops/runtime/tracklist.md`
