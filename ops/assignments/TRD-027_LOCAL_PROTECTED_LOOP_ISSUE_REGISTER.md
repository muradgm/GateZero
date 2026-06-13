# TRD-027: Local Protected-Loop Issue Register

## Objective

Create a deterministic in-memory local issue register from Gate 0 evidence threshold results.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Accept an existing local Gate 0 evidence threshold result.
- Convert unmet threshold checks into local issue entries.
- Preserve check IDs, observed counts, threshold counts, comparison direction, and descriptive
  status.
- Include deterministic local issue IDs.
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

- `packages/core/src/local-protected-loop-issue-register.ts`
- Export from `packages/core/src/index.ts`
- Tests for empty register, needs-review issues, blocked issues, deterministic issue IDs, and
  invalid input behavior.
- QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Register preserves `G0_RESEARCH` and `research_only`.
- Register accepts only valid local Gate 0 evidence threshold results.
- Register includes only unmet threshold checks.
- Register is descriptive only.
- Register does not infer approval, advice, readiness, forecasts, or strategy claims.
- No export, UI, external service, prediction, or execution scope is added.
- Full Gate 0 validation passes.

## Validation Commands

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
