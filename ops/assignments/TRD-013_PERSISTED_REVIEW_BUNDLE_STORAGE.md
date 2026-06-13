# TRD-013: Persisted Review Bundle Storage

## Objective

Persist accepted Gate 0 strategy review bundles to local append-only NDJSON storage through the
existing path-safe audit-log guard.

## Required Agents

- ORCHESTRATOR
- BACKEND
- RISK
- QA_SECURITY

## Allowed Scope

- Add a local review bundle log helper.
- Store accepted strategy review bundles as canonical NDJSON records.
- Hash bundle payloads and trace payloads.
- Reject malformed existing log lines.
- Reject duplicate bundle IDs and duplicate trace IDs.
- Reuse safe relative path resolution, `.ndjson` enforcement, and lock guarding.
- Add focused tests and review notes.

## Blocked Scope

- Live trading.
- Broker integration.
- Autonomous execution.
- AI buy/sell prediction.
- Real or paper market order placement.
- Broker API key handling.
- External persistence services.
- API routes or UI flows.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/local-review-bundle-log.ts`
- Tests for append, read, duplicate rejection, tamper rejection, malformed existing log rejection,
  and guarded path safety.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Only `G0_RESEARCH` bundles are persisted.
- Bundle and trace canonical hashes are recorded and verified on read.
- Duplicate bundle IDs and trace IDs are blocked.
- Tampered bundles are rejected before append and during read.
- Guarded operations keep paths inside the audit base directory and use `.ndjson`.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
