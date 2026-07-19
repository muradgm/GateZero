# TRD-609 Recommendation Evidence Consistency Guard

Status: accepted

## Goal

Detect drift between scenario recommendations and the local evidence references shown by the
Strategy Review Workspace.

## Scope

- Validate recommendation, signal, red-flag, risk-review, and simulation-link references.
- Reject detached blockers, duplicate references, remote source paths, and missing local detail.

## Blocked Scope

- Market access, credentials, recommendation finalization, autonomous action, and gate promotion.

## Acceptance

Accepted when a deterministic guard passes valid local fixtures and rejects inconsistent chains.
