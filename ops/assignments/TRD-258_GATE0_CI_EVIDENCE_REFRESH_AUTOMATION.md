# TRD-258 Gate 0 CI Evidence Refresh Automation

## Goal

Add a bounded local helper for refreshing Gate 0 remote CI evidence records without manually editing
the evidence index and command-center metadata every time.

## Gate

- Current gate: `G0_RESEARCH`
- Current scope: `research_only`

## Allowed Scope

- Add `pnpm refresh:gate0-ci-evidence`.
- Fetch a specified GitHub Actions run through the GitHub CLI.
- Require the run to be a successful completed `Gate 0 Verification` push run.
- Generate a local evidence document.
- Upsert the remote verification evidence-index row.
- Refresh static command-center fallback metadata for run id, commit, latest packet, and review
  coverage.
- Add focused tests for validation, blocked runs, duplicate run handling, and metadata updates.
- Record the successful TRD-257 pushed run as repository evidence.

## Blocked Scope

- No automatic trading approval.
- No deployment approval.
- No broker integration.
- No live trading.
- No paper order mechanics.
- No autonomous execution.
- No AI buy/sell prediction.
- No credential storage.
- No strategy approval, readiness, profitability, performance, or marketing claims.
- No risk-gate loosening.

## Required Outputs

- `scripts/refresh-gate0-ci-evidence.ts`
- `packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts`
- `docs/operations/GATE0_CI_EVIDENCE_REFRESH_HELPER.md`
- `docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md`
- Updated `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Updated command-center metadata, tracker, progress snapshot, docs index, and artifact map.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Helper rejects non-successful, non-completed, non-push, or non-Gate 0 workflow runs.
- Helper rejects duplicate run ids under a different packet.
- Helper output remains local repository evidence only.
- Command-center metadata aligns to the refreshed evidence index.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- `pnpm verify:gate0` passes.

## Validation Commands

- `pnpm test -- packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts`
- `pnpm refresh:gate0-ci-evidence -- --run 27785795555 --packet TRD-258 --after TRD-257 --record docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md`
- `pnpm check:gate0-ci-evidence`
- `pnpm check:gate0-command-center`
- `pnpm verify:gate0`

## Done When

TRD-258 is accepted with QA_SECURITY, RISK, and ORCHESTRATOR records, and future CI evidence
refreshes can be prepared through the local helper without loosening Gate 0 controls.
