# Gate 0 Command Index Coverage Check

## Purpose

This check verifies that the Gate 0 operator command index covers the current local package scripts
and aligns with the operator-facing validation docs.

It is a documentation check only. It does not change command behavior, strategy state, risk state,
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

Use this check only to verify local command documentation coverage. Do not use command coverage as
strategy approval, readiness review, performance evidence, profitability evidence, deployment
approval, or future-phase eligibility.

## Package Script Coverage

| Package script            | Command index section     | Validation audit reference | Operator checklist reference | Status |
| ------------------------- | ------------------------- | -------------------------- | ---------------------------- | ------ |
| `inspect:gate0-dry-run`   | Inspect Commands          | Yes                        | Yes                          | Pass   |
| `snapshot:gate0-progress` | Operating Record Commands | Yes                        | Yes                          | Pass   |
| `check:gate0-name`        | Operating Record Commands | Yes                        | No                           | Pass   |
| `check:gate0-snapshot`    | Operating Record Commands | Yes                        | No                           | Pass   |
| `check:gate0-tracklist`   | Operating Record Commands | Yes                        | Yes                          | Pass   |
| `lint`                    | Quality Commands          | Yes                        | Yes                          | Pass   |
| `format:check`            | Quality Commands          | Yes                        | Yes                          | Pass   |
| `typecheck`               | Quality Commands          | Yes                        | Yes                          | Pass   |
| `test`                    | Quality Commands          | Yes                        | Yes                          | Pass   |
| `validate:gate0`          | Quality Commands          | Yes                        | Yes                          | Pass   |

## Command Form Coverage

The command index also documents supported inspect command forms:

- `pnpm inspect:gate0-dry-run`
- `pnpm inspect:gate0-dry-run -- --help`
- `pnpm inspect:gate0-dry-run -- -h`
- `pnpm inspect:gate0-dry-run -- --scenario friction`
- `pnpm inspect:gate0-dry-run -- --scenario other`

These forms align with the validation audit and operator checklist. The invalid scenario form is
documented as an expected nonzero local path with bounded usage text and no stack trace.

## Findings

No blocking command-index coverage gaps were found.

The command index covers:

- All current `package.json` scripts.
- All current validation commands recorded in the tracklist.
- The inspect, progress snapshot, tracklist, and validation paths used by the operator checklist.
- The quality command sequence used before ORCHESTRATOR acceptance.

## Maintenance Rule

Update this check when a later Gate 0 packet adds, removes, renames, or changes a package script,
operator command, validation command, or checklist command. Do not use this check to authorize
execution, strategy promotion, product launch, risk-gate movement, or later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Package scripts: `package.json`
- Command index: `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Validation audit: `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Operator checklist: `docs/operations/GATE0_OPERATOR_CHECKLIST.md`
- Command index coverage recheck: `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_RECHECK.md`
- Artifact map coverage check: `docs/operations/GATE0_ARTIFACT_MAP_COVERAGE_CHECK.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-065_GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-065_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-065_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-065_ORCHESTRATOR_ACCEPTANCE.md`
