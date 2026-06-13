# TRD-046: Gate 0 Dry-Run Walkthrough

## Objective

Add a short operator walkthrough for the Gate 0 dry-run inspect command.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Document the local dry-run inspect command.
- Explain the redacted output shape.
- Explain how to read checklist summary, friction report, and iteration recommendation sections.
- Confirm the current gate and scope.
- Include validation commands.
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
- Strategy approval language.
- Readiness claims.
- Strategy profitability or performance claims.
- Risk-gate loosening.
- New product code.

## Required Outputs

- `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`
- Updated `docs/README.md`
- `ops/runtime/reviews/TRD-046_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-046_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-046_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Walkthrough confirms `G0_RESEARCH`.
- Walkthrough confirms `research_only`.
- Walkthrough explains `pnpm inspect:gate0-dry-run`.
- Walkthrough explains redacted output boundaries.
- Walkthrough includes validation commands.
- Walkthrough does not add product code.
- Walkthrough does not claim strategy approval, readiness, profitability, performance, or
  future-phase eligibility.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
