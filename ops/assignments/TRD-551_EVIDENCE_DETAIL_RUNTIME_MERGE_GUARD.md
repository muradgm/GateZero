# TRD-551 Evidence Detail Runtime Merge Guard

Status: accepted

## Goal

Keep runtime refresh from dropping simulation evidence detail data.

## Scope

- Preserve Gate 2 paper-simulation planning scope.
- Harden the read-only Command Center evidence-detail lane.
- Add or preserve local validation and review evidence.

## Blocked Scope

- Broker integration, account connection, credentials, live execution, autonomous action, AI
  prediction, approval semantics, readiness semantics, performance claims, and risk-gate loosening.

## Acceptance

Accepted when focused checks and full local verification pass without adding action controls or
future-phase authority.
