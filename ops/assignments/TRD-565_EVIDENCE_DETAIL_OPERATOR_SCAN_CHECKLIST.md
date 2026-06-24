# TRD-565 Evidence Detail Operator Scan Checklist

Status: accepted

## Goal

Add manual inspection checklist language without execution controls.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Harden the read-only Command Center evidence-detail control lane.
- Keep all records local, inspectable, and non-executing.

## Blocked Scope

- Broker integration, account connection, credentials, live execution, autonomous action, AI
  prediction, approval semantics, readiness semantics, performance claims, report publishing, export
  controls, and risk-gate loosening.

## Acceptance

Accepted when local tests, guards, risk review, QA/security review, and full verification pass
without adding action controls or future-phase authority.
