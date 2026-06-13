# TRD-002 - Tighten Gate 0 Forbidden-Pattern Scanner Allowlist

## Assigned Agent

`QA_SECURITY`

## Objective

Tighten the Gate 0 forbidden-pattern scanner allowlist so governance/reference files can discuss
blocked concepts while implementation source remains scanned by default.

## Current Financial Gate

`G0_RESEARCH`

## Allowed Files

- `packages/validation/src/forbidden-patterns.ts`
- `packages/validation/tests/forbidden-patterns.test.ts`
- `ops/assignments/TRD-002_TIGHTEN_GATE0_SCANNER_ALLOWLIST.md`
- `ops/runtime/reviews/TRD-002_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-002_ORCHESTRATOR_ACCEPTANCE.md`

## Blocked Files

- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- broker integration files
- live trading files
- paper execution files
- broker secret handling
- strategy promotion records

## Source Truth Files

- `ops/runtime/reviews/TRD-001_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-001_ORCHESTRATOR_ACCEPTANCE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `docs/operations/SECURITY_BASELINE.md`

## Required Changes

- Replace broad `^ops/` scanner allowlist with explicit ops categories.
- Keep implementation source under `apps/`, `packages/`, and `scripts/` scanned by default.
- Preserve docs/governance/reference ability to discuss blocked scope.
- Keep validation scanner source and test fixtures allowlisted where needed.
- Add tests for allowed governance/reference paths and disallowed implementation paths.

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- The scanner no longer allowlists all `ops/` paths with one broad pattern.
- Tests prove package source remains scanned.
- Full validation passes.
