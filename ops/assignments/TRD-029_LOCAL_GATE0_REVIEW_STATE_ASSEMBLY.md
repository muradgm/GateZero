# TRD-029: Local Gate 0 Review State Assembly

## Objective

Create a deterministic in-memory Gate 0 review state assembly that composes a local review state
snapshot, threshold result, issue register, and optional comparisons.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing local Gate 0 review state snapshot.
- Evaluate supplied local evidence thresholds.
- Generate a local issue register from the threshold result.
- Optionally compare the current snapshot, threshold result, and issue register against a prior
  local assembly.
- Add strict schemas and focused tests.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Blocked Scope

- Live trading.
- Broker integration.
- Autonomous execution.
- AI buy/sell prediction.
- Real or paper market order placement.
- Broker API key handling.
- External persistence services.
- API routes or UI flows.
- Report export or publishing workflows.
- Strategy profitability or performance claims.
- Readiness scoring or approval scoring.
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/local-gate0-review-state-assembly.ts`
- Export from `packages/core/src/index.ts`
- Tests for current-only assembly, baseline comparison assembly, blocked assembly status, invalid
  current input, and invalid baseline input.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Assembly preserves `G0_RESEARCH` and `research_only`.
- Assembly accepts only valid local Gate 0 review state snapshots.
- Assembly derives threshold result and issue register from the current snapshot.
- Assembly comparisons are descriptive only.
- Assembly does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
