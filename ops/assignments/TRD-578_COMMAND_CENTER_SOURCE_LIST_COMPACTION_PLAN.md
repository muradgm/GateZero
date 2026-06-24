# TRD-578 Command Center Source-List Compaction Plan

Status: accepted

## Goal

Plan better grouping for long source lists while preserving local paths.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Harden the read-only Command Center evidence-control lane.
- Keep records local, compact, accessible, and non-executing.

## Blocked Scope

- Broker integration, account connection, credentials, live execution, autonomous action, AI
  prediction, approval semantics, readiness semantics, performance claims, report output, export
  controls, sharing controls, print controls, and risk-gate loosening.

## Acceptance

Accepted when local tests, guards, risk review, QA/security review, and full verification pass
without adding action controls or future-phase authority.
