# TRD-004 - Canonical Trace Hashing And Deterministic Serialization

## Assigned Agent

`BACKEND`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add canonical serialization and deterministic SHA-256 hashing helpers for Gate 0 strategy decision
traces.

This prepares trace integrity for future durable audit-log work without adding persistence, APIs,
broker integration, paper execution, live execution, AI prediction, or strategy promotion.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Canonical hashing makes strategy review traces tamper-evident by ensuring the same trace event
payload always produces the same hash.

## Allowed Files

- `packages/core/src/trace-hashing.ts`
- `packages/core/src/index.ts`
- `packages/core/tests/trace-hashing.test.ts`
- `ops/assignments/TRD-004_CANONICAL_TRACE_HASHING.md`
- `ops/runtime/reviews/TRD-004_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-004_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-004_ORCHESTRATOR_ACCEPTANCE.md`

## Blocked Files

- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- broker integration files
- live trading files
- paper execution files
- broker secret handling
- strategy promotion records
- durable storage files
- API route files

## Source Truth Files

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `docs/engineering/SENIOR_TECHNICAL_LEAD_REMEDIATION_BRIEF.md`
- `docs/engineering/DECISION_LOOP_HARDENING_ROADMAP.md`
- `docs/engineering/API_CONTRACTS.md`

## Required Changes

Create core helpers that:

- serialize JSON-compatible values deterministically by sorting object keys
- compute SHA-256 hashes from canonical event payloads
- build a hash-linked `StrategyDecisionTrace` from a hashless draft
- verify existing trace event hashes against canonical recomputation
- validate through existing runtime schemas
- return immutable trace data

## Required Tests

Add tests proving:

- canonical serialization is stable across object key order
- event hash recomputation is deterministic
- a hash-linked trace can be built from a hashless draft
- tampering with an event payload is detected
- tampering with previous hash linkage is detected
- non-Gate-0 trace drafts are rejected

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Canonical serialization helper exists.
- Hash-linked trace builder exists.
- Existing trace hash verifier exists.
- Tests cover deterministic hashing and tamper detection.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
