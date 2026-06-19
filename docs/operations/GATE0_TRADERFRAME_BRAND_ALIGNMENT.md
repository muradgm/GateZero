# Gate 0 TraderFrame Brand Alignment

## Purpose

This record defines the current naming rule for the product and the internal operating gate.

## Naming Rule

- Public product/app name: `TraderFrame`
- Internal gate/control-plane codename: `GateZero`
- Legacy spelling to avoid: the older name without the second `r`

`GateZero` remains valid when referring to gate status, Gate 0/Gate 1 governance, internal reviewer
skills, guard names, package history, and operating controls. Current product-facing surfaces should
use `TraderFrame`.

## Scope

This packet changes naming and guard expectations only. It does not add broker integration, paper or
live execution, autonomous execution, AI buy/sell prediction, strategy approval semantics, external
publishing, credentials, or risk-gate loosening.

## Updated Surfaces

- Root package name and description.
- Root README.
- Documentation index.
- Product docs.
- Command center title, project name, and brand mark.
- Tracklist project field and current boundary language.
- Project-name guard and tests.

Historical records may continue to mention `GateZero` when describing previously accepted packets or
internal gate controls.

## Validation

Run:

```powershell
pnpm check:gate0-name
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-264_TRADERFRAME_BRAND_ALIGNMENT.md`
- QA/security review: `ops/runtime/reviews/TRD-264_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-264_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-264_ORCHESTRATOR_ACCEPTANCE.md`
- Project-name guard: `scripts/check-gate0-project-name.ts`
- Project-name guard tests: `packages/fixtures/tests/gate0-project-name-check.test.ts`
- Command center data: `apps/web/src/command-center-data.js`
- Command center UI: `apps/web/src/main.js`
- Tracklist: `ops/runtime/tracklist.md`
