# TRD-001 QA_SECURITY Review

## Verdict

`pass_with_findings`

TRD-001 is acceptable from QA/Security for Gate 0, with one non-blocking follow-up on scanner
allowlist precision.

## Scope Reviewed

- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `tsconfig.json`
- `eslint.config.js`
- `prettier.config.js`
- `apps/web/README.md`
- `packages/contracts/**`
- `packages/core/**`
- `packages/validation/**`
- `scripts/validate-gate0.ts`

## Truth And Policy Files Read

- `ops/assignments/TRD-001_INITIALIZE_GATE0_RESEARCH_MONOREPO.md`
- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`
- `ops/core/04_QA_RISK_GATE.md`
- `docs/engineering/TESTING_STRATEGY.md`
- `docs/operations/SECURITY_BASELINE.md`

## Validation Commands Reviewed

```powershell
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

Observed result: all commands passed.

Test result reviewed:

- 3 test files passed
- 13 tests passed

## Findings

### Medium - Gate 0 scanner allowlist is broader than the assignment wording

File: `packages/validation/src/forbidden-patterns.ts`

The scanner allowlists all `ops/` files and all `README.md` files. This is operationally
understandable because pre-existing governance and agent reference files intentionally discuss
blocked concepts, but it is broader than the assignment's explicit allowlist language.

Risk:

- A future blocked-scope reference could be added under `ops/` and be skipped by default.
- A package README could include prohibited product language and still be skipped.

Required follow-up:

- Narrow the default allowlist into named governance/reference categories.
- Keep implementation source under `apps/`, `packages/`, and `scripts/` scanned by default, except
  validation test fixtures and explicit scanner source.
- Add tests proving package source is scanned while governance/reference docs are intentionally
  skipped.

Blocking status: non-blocking for TRD-001 because no blocked implementation path was found and Gate
0 validation currently passes.

## Security Review

Passed:

- No `.env` file was created.
- No broker credentials were introduced.
- No broker SDK dependency was added.
- No external order or execution API was added.
- No frontend secret path was created.
- No hidden execution path was found in implementation source.
- Runtime contract validation uses `zod`.
- Negative tests cover blocked gate/verdict/learning paths.

## Test Quality Review

Passed:

- Gate restriction test rejects non-Gate-0 financial gates.
- Runtime schema test rejects malformed backtest payloads.
- Risk review test verifies blocked state cannot be approved.
- Strategy review event test requires assumptions and risk flags.
- Learning event test prevents risk/autonomy change.
- Protected decision-loop ordering is tested.
- Forbidden-pattern scanner behavior is tested.

Coverage gap:

- No dependency audit command is wired yet. This is acceptable for the repo foundation but should be
  added before any networked app/API work.

## QA_SECURITY Decision

TRD-001 may proceed to RISK review.

Recommended next agent: `RISK`
