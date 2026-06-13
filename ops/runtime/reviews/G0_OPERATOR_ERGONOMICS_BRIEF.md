# Gate 0 Operator Ergonomics Brief

## Verdict

`next_step_defined`

The accepted Gate 0 baseline is strong enough to support a small local operator ergonomics layer.
The next work should make the dry-run chain easier to inspect from the command line without adding
UI, export, broker, prediction, execution, or readiness scope.

## Current Boundary

Gate:

```text
G0_RESEARCH
```

Scope:

```text
research_only
```

The baseline remains local-only and non-executional.

## Current Operator Friction

Observed friction in the accepted baseline:

- The dry-run chain exists as composable TypeScript utilities, but an operator has no single local
  command to inspect the accepted dry-run path.
- The current command surface validates the repository, but does not show the dry-run checklist,
  friction report, or iteration recommendation in one deterministic local view.
- The next local workflow is discoverable through tests, but not yet through an explicit walkthrough
  or operator-facing developer script.
- The system has one accepted synthetic dry-run scenario, so the happy/revise path is represented,
  but no second scenario tests a deliberately blocked friction path as a first-class fixture.

## Recommended Next Packets

Recommended first:

`TRD-045: Gate 0 Local Dry-Run Inspect Script`

- Add a local developer script that builds the accepted TRD-037 fixture through checklist, summary,
  friction report, and iteration recommendation.
- Print or return a redacted JSON object only.
- Include no raw bundle payload, trace payload, metric payload, evidence strings, advice, readiness
  claims, external service calls, or execution paths.
- Add a package script such as `inspect:gate0-dry-run` only if it remains local and deterministic.

Recommended second:

`TRD-046: Gate 0 Dry-Run Walkthrough`

- Add a short docs walkthrough for the local dry-run inspect path.
- Explain the chain and blocked capabilities.
- Include validation commands.
- Avoid marketing, profitability, readiness, or trading claims.

Recommended third:

`TRD-047: Gate 0 Blocked-Friction Dry-Run Scenario`

- Add a second synthetic fixture that intentionally creates one local friction category.
- Use it to test the inspect script against a blocked local review path.
- Keep it synthetic, deterministic, local-only, and revision-oriented.

## Explicitly Rejected For Now

Do not add:

- UI expansion.
- Broker integration.
- Live trading.
- Paper execution mechanics.
- Autonomous execution.
- AI buy/sell prediction.
- External persistence services.
- Report export or publishing workflows.
- Approval scoring.
- Readiness scoring.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Recommended Next Assignment

Proceed with:

```text
TRD-045: Gate 0 Local Dry-Run Inspect Script
```

This is the smallest useful ergonomics step because it makes the accepted chain observable without
adding product surface area.
