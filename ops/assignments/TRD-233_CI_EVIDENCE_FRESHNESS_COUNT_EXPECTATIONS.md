# TRD-233 CI Evidence Freshness Count Expectations

## Goal

Tighten CI evidence freshness coverage so the guard explicitly accepts GitHub, remote, and command
center CI evidence records together.

## Allowed Scope

- Add focused CI evidence freshness test coverage.
- Document the count expectation.
- Update tracker, docs index, command-center references, and artifact map.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No external CI polling.
- No deployment authorization.
- No live trading, broker integration, paper order mechanics, autonomous execution, AI prediction,
  broker API key handling, strategy approval, readiness semantics, profitability claims, marketing
  claims, or risk-gate loosening.

## Required Outputs

- Updated `packages/fixtures/tests/gate0-ci-evidence-freshness-check.test.ts`.
- `docs/operations/GATE0_CI_EVIDENCE_FRESHNESS_COUNT_EXPECTATIONS.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Focused test proves the freshness guard counts three evidence record families.
- Evidence remains local and repository-bound.
- Gate remains `G0_RESEARCH` and scope remains `research_only`.

## Next Agent

QA_SECURITY review, then RISK review, then ORCHESTRATOR acceptance.
