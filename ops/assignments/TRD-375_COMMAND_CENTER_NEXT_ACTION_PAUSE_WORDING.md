# TRD-375 Command-Center Next-Action Pause Wording

## Goal

Ensure command-center next actions tell operators to pause when no real maintenance gap exists.

## Scope

- Update command-center wording if needed.
- Keep dashboard language as operating health only.
- Avoid readiness, approval, promotion, or execution language.

## Blocked

- No strategy recommendation UI.
- No execution console.
- No broker, credential, paper/live, or autonomous path.

## Acceptance

- Pause wording record exists.
- Command-center data points to material gaps, not churn.
- `pnpm verify:gate0` passes.
