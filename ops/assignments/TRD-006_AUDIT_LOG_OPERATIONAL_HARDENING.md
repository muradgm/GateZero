# TRD-006 - Audit Log Operational Hardening

## Assigned Agent

`BACKEND`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add local audit-log operational hardening for Gate 0 use:

- safe path resolution
- local lock-file guarded reads and appends
- retention and backup policy validation

This packet must not add APIs, network clients, broker integration, paper execution, live execution,
AI prediction, or strategy promotion.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

The audit log must preserve evidence without unsafe path handling or concurrent local writes
corrupting records.

## Allowed Files

- `packages/core/src/audit-log-safety.ts`
- `packages/core/src/index.ts`
- `packages/core/tests/audit-log-safety.test.ts`
- `ops/assignments/TRD-006_AUDIT_LOG_OPERATIONAL_HARDENING.md`
- `ops/runtime/reviews/TRD-006_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-006_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-006_ORCHESTRATOR_ACCEPTANCE.md`

## Blocked Files

- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- broker integration files
- live trading files
- paper execution files
- broker secret handling
- strategy promotion records
- API route files
- network client files

## Source Truth Files

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `docs/operations/DATA_HANDLING.md`
- `docs/operations/SECURITY_BASELINE.md`
- `ops/runtime/reviews/TRD-005_ORCHESTRATOR_ACCEPTANCE.md`

## Required Changes

Create local operational helpers that:

- resolve audit log paths only inside a caller-provided base directory
- reject absolute paths
- reject directory traversal outside the base directory
- require `.ndjson` audit log files
- guard reads and appends with a local lock file
- remove the lock file after successful or failed operations
- validate retention/backup policy shape without performing backup writes

## Required Tests

Add tests proving:

- safe relative paths resolve inside the base directory
- absolute paths are rejected
- traversal paths are rejected
- non-`.ndjson` paths are rejected
- append helper writes through the lock guard
- read helper reads through the lock guard
- pre-existing lock files block guarded operations
- locks are removed after failed operations
- retention/backup policy validation rejects unsafe backup paths

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Operational hardening helpers exist and are exported.
- Tests cover path safety, lock behavior, and policy validation.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
