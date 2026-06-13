# Security Baseline

## Purpose

This document defines the security posture for GateZero.

GateZero may begin as a local/internal research system, but it must be designed as if later phases
could touch broker APIs, financial data, and execution workflows.

## Phase 0 Baseline

Required:

- no broker credentials
- no live trading flags
- no frontend secrets
- internal API token for product-changing routes if exposed outside localhost
- `.env.example` with names only
- dependency audit command documented
- logs must not contain secrets
- test data must not contain real credentials

## Future Broker Credential Rules

Broker credentials must:

- never be committed
- never be sent to the frontend
- never appear in logs
- be scoped to paper trading first
- be separated by environment
- be revocable without code changes

## Logging Rules

Logs may include:

- event IDs
- strategy IDs
- run IDs
- risk verdicts
- error categories

Logs must not include:

- secrets
- API keys
- full credential payloads
- sensitive personal data
- unnecessary account details

## Access Control

Phase 0 may use a simple internal boundary.

Before any paper or live broker integration, GateZero must add:

- operator authentication
- role or mode controls
- explicit live-trading enablement
- audit trail for privileged actions

## Security Acceptance

QA_SECURITY may block any feature that:

- exposes secrets
- bypasses internal boundaries
- hides execution-related changes
- weakens auditability
- allows risk rules to be modified without trace
