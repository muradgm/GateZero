# Gate 0 Format Check Control Plane Coverage

## Purpose

This document records the expansion of the local format check to include documentation and
operations control-plane files.

It does not change strategy state, risk state, gate status, product scope, or execution capability.

## Covered Surfaces

`pnpm format:check` now checks:

- Root project files.
- `apps/**/*.{md,json,ts,js}`
- `packages/**/*.{md,json,ts,js}`
- `scripts/**/*.ts`
- `docs/**/*.{md,json}`
- `ops/**/*.{md,json}`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Command source: `package.json`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-167_FORMAT_CHECK_CONTROL_PLANE_COVERAGE.md`
- Reviews: `ops/runtime/reviews/TRD-167_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-167_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-167_ORCHESTRATOR_ACCEPTANCE.md`
