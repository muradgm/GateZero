# TRD-005 - Local Durable Audit Log Storage

## Assigned Agent

`BACKEND`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add local-only append-only audit log helpers for canonical strategy decision traces.

The helper must verify trace contracts and canonical hashes before appending records to a local
newline-delimited JSON file.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Rejected, revised, and research-only strategy decisions must remain visible as evidence.

## Allowed Files

- `packages/core/src/local-audit-log.ts`
- `packages/core/src/index.ts`
- `packages/core/tests/local-audit-log.test.ts`
- `ops/assignments/TRD-005_LOCAL_AUDIT_LOG_STORAGE.md`
- `ops/runtime/reviews/TRD-005_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-005_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-005_ORCHESTRATOR_ACCEPTANCE.md`

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
- `docs/engineering/API_CONTRACTS.md`
- `ops/runtime/reviews/TRD-004_ORCHESTRATOR_ACCEPTANCE.md`

## Required Changes

Create local audit log helpers that:

- write newline-delimited canonical JSON records
- use append-only file writes
- validate each trace through existing runtime schemas
- verify canonical event hashes before append
- compute and store a whole-trace hash
- reject duplicate `trace_id` entries
- reject malformed existing log lines
- read back existing records through schema validation
- do not create APIs, services, external connections, or strategy actions

## Required Tests

Add tests proving:

- a valid trace appends one audit record
- appended records can be read back
- duplicate trace IDs are rejected
- tampered trace hashes are rejected before append
- malformed existing log lines block reads/appends
- no network or credential dependency is required

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Local audit log helper exists and is exported.
- Tests cover append, read, duplicate rejection, tamper rejection, and malformed log rejection.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
