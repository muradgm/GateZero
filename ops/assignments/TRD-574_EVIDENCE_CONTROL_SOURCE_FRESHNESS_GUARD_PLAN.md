# TRD-574 Evidence Control Source Freshness Guard Plan

Status: accepted

## Goal

Plan stale-source detection without automation or external polling.

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
