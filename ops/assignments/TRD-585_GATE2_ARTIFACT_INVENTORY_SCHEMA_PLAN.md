# TRD-585 Gate 2 Artifact Inventory Schema Plan

Status: accepted

## Goal

Define the local artifact inventory schema needed to support `TRD-592` Strategy Review Workspace
MVP.

## Purpose

Artifact inventory means: can the workspace show the operator which local evidence files support
this research case?

This packet exists only to make `TRD-592` easier to build. Any schema field that does not support
the Strategy Review Workspace evidence chain is out of scope.

## Required Fields

- `artifact_id`
- `artifact_type`
- `local_path`
- `source_category`
- `linked_research_case_id`
- `linked_evidence_detail_id`
- `linked_risk_review_id` when applicable
- `freshness_status`
- `limitation_notes`
- `redaction_status`
- `blocked_scope_flags`
- `created_timestamp`
- `verified_timestamp`

## Allowed Scope

- Local evidence file inventory for one research case.
- Source categories tied to the protected loop:
  - strategy idea
  - data snapshot
  - backtest evidence
  - metric report
  - risk review
  - operator decision note
  - outcome log
  - learning event
- Freshness, limitation, redaction, and blocked-scope status needed for operator inspection.
- Command Center data record proving the schema remains narrow and local.

## Blocked Scope

- Export, report, share, or print concepts.
- External storage.
- Cloud sync.
- Broker artifacts.
- Market-account data.
- Credentials.
- Live or broker paper-trading execution records.
- AI recommendation records.
- Performance claims, readiness claims, approval claims, or risk-gate loosening.

## Acceptance Criteria

- The schema plan contains only fields needed by the Strategy Review Workspace.
- The schema answers which local evidence files support one research case.
- Output-channel, external-storage, account, credential, execution, and AI recommendation concepts
  remain blocked.
- Command Center data records the schema plan without adding a new UI action surface.
- Focused tests prove the schema plan is local and workspace-bound.
- `pnpm verify:gate0` passes.

## Done Definition

Accepted when QA_SECURITY, RISK, and ORCHESTRATOR reviews confirm that TRD-585 makes `TRD-592`
easier to build without expanding scope beyond local evidence-file inspection.
