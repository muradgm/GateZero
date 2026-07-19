# TRD-617 Local Paper Simulator Authorization

Status: accepted

## Goal

Authorize contract, fixture, and pure-control hardening of the existing local simulation engine.

## Required Reviews

PM, Quant, Risk, QA/Security, and Orchestrator must accept the bounded lane.

## Allowed Scope

- Deterministic local records and pure calculations.
- Fail-closed risk, integrity, journal, and reconciliation controls.

## Blocked Scope

External accounts, credentials, broker routes, live orders, autonomous action, AI prediction,
performance claims, and scope promotion.

## Acceptance

Accepted only when all required reviews agree that active scope remains
`paper_simulation_planning_only`.
