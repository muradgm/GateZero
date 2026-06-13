# Gate 0 Name Check Coverage Audit

## Purpose

This audit documents the current GateZero project-name check coverage.

It is a documentation audit only. It does not change command behavior, strategy state, risk state,
maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this audit only to understand local project-name consistency coverage. Do not use it as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval, or
future-phase eligibility.

## Checked Surfaces

| Surface                     | Current coverage                                       | Source                                                     | Status |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | ------ |
| `package.json` package name | Requires `"name": "gatezero"`.                         | `scripts/check-gate0-project-name.ts`                      | Pass   |
| `package.json` description  | Requires `GateZero` in package description.            | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Tracklist title             | Requires `# GateZero Project Tracklist`.               | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Tracklist project field     | Requires the project field to be `GateZero`.           | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Checked text file content   | Rejects previous display name in checked files.        | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Checked text file content   | Rejects previous package name in checked files.        | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Checked repo-relative paths | Rejects previous package name in checked paths.        | `scripts/check-gate0-project-name.ts`                      | Pass   |
| Regression tests            | Covers passing state, old display name, old path name. | `packages/fixtures/tests/gate0-project-name-check.test.ts` | Pass   |

## Checked File Types

The current name check scans repo-relative files with these extensions:

- `.css`
- `.html`
- `.js`
- `.json`
- `.md`
- `.svg`
- `.ts`
- `.yaml`
- `.yml`

The check skips generated or dependency directories:

- `.git`
- `dist`
- `node_modules`

## Coverage Notes

- The check is local and deterministic.
- The check reports the number of scanned files.
- The latest accepted run scanned 597 files.
- The check preserves Gate 0 scope by validating naming only.
- The check does not touch binary image exports directly, but it covers adjacent SVG, HTML,
  markdown, JSON, and TypeScript surfaces that carry local project identity.

## Out Of Scope

This audit does not add:

- New app branding direction.
- UI, marketing, or launch claims.
- External publishing.
- Broker or execution integration.
- Any approval, readiness, profitability, performance, or future-phase semantics.

## Maintenance Rule

Update this audit when the project-name check changes scanned file extensions, ignored paths,
required identity fields, or regression coverage. Do not use this audit to authorize execution,
strategy promotion, product launch, risk-gate movement, or later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Validation command audit: `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Name check coverage check: `docs/operations/GATE0_NAME_CHECK_COVERAGE_CHECK.md`
- Source packet: `ops/assignments/TRD-064_GATE0_NAME_CHECK_COVERAGE_AUDIT.md`
- Reviews: `ops/runtime/reviews/TRD-064_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-064_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-064_ORCHESTRATOR_ACCEPTANCE.md`
