# TRD-045: Gate 0 Local Dry-Run Inspect Script

## Objective

Add a deterministic local command that assembles the accepted Gate 0 dry-run chain into a redacted
inspect result for operator review.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local TypeScript inspect assembler for the accepted synthetic dry-run fixture.
- Add a local package script that prints redacted JSON.
- Include checklist summary, friction report, and iteration recommendation only.
- Add focused tests for clear and friction-found paths.
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
- Raw bundle payload output.
- Raw trace payload output.
- Raw metric payload output.
- Evidence string output.
- Advice, readiness, approval, profitability, or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/core/src/gate0-dry-run-inspect-result.ts`
- `packages/core/tests/gate0-dry-run-inspect-result.test.ts`
- `scripts/inspect-gate0-dry-run.ts`
- `package.json` script: `inspect:gate0-dry-run`
- `ops/runtime/reviews/TRD-045_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-045_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-045_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Inspect command builds from the accepted synthetic dry-run fixture.
- Output confirms `G0_RESEARCH` and `research_only`.
- Output includes checklist summary, friction report, and iteration recommendation.
- Output excludes raw bundle, trace, metric, evidence, advice, readiness, approval, profitability,
  and performance content.
- Tests cover the accepted clear path and a local friction path.
- No external service, UI, API route, credential handling, or execution path is added.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
