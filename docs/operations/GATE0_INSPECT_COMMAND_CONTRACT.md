# Gate 0 Inspect Command Contract

## Purpose

This contract defines the local command behavior for the Gate 0 dry-run inspect routine.

The command is an operator review aid for synthetic, deterministic, redacted local artifacts. It
does not change strategy state, risk state, maturity state, operator decisions, or gate status.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

The command must remain local-only, deterministic, and documentation-supported. It must not
introduce external access, report publishing, product UI, API routes, order mechanics, credential
handling, or future-phase authorization language.

## Supported Command Forms

```powershell
pnpm inspect:gate0-dry-run
pnpm inspect:gate0-dry-run -- --help
pnpm inspect:gate0-dry-run -- -h
pnpm inspect:gate0-dry-run -- --scenario clear
pnpm inspect:gate0-dry-run -- --scenario friction
```

The default command is equivalent to:

```powershell
pnpm inspect:gate0-dry-run -- --scenario clear
```

## Arguments

| Argument        | Required | Values              | Behavior                                           |
| --------------- | -------- | ------------------- | -------------------------------------------------- |
| `--help`        | No       | None                | Prints command help and exits successfully.        |
| `-h`            | No       | None                | Prints command help and exits successfully.        |
| `--scenario`    | No       | `clear`, `friction` | Selects a static synthetic local scenario fixture. |
| No `--scenario` | No       | Not applicable      | Uses the `clear` scenario.                         |

Unsupported scenario values must be rejected with bounded usage text.

## Exit Codes And Streams

| Path                    | Exit code | Stdout        | Stderr             |
| ----------------------- | --------- | ------------- | ------------------ |
| Help                    | `0`       | Help text     | Empty              |
| Default clear scenario  | `0`       | Redacted JSON | Empty              |
| Explicit clear scenario | `0`       | Redacted JSON | Empty              |
| Friction scenario       | `0`       | Redacted JSON | Empty              |
| Missing scenario value  | `1`       | Empty         | Bounded usage text |
| Unknown scenario value  | `1`       | Empty         | Bounded usage text |

Invalid input must not print a stack trace.

## Help Output Contract

Help output must include:

- Command name.
- Supported usage forms.
- Static scenario keys.
- Output summary.
- Boundary values for `G0_RESEARCH`, `research_only`, and local-only operation.

Help output must not print inspect JSON payloads.

## JSON Output Contract

Successful scenario output must be formatted as redacted JSON.

The output must preserve these operating expectations:

- `financial_gate` is `G0_RESEARCH`.
- `scope` is `research_only`.
- The inspect status is bounded to local review state.
- Checklist summary is derived from synthetic local fixture data.
- Friction report is local review friction only.
- Iteration recommendation is local review guidance only.

The output must not include raw evidence payloads, raw traces, raw metrics, credentials, external
destinations, strategy approval semantics, readiness semantics, profitability claims, performance
claims, or future-phase eligibility language.

## Scenario Contract

| Scenario   | Expected inspect status | Expected meaning                                 |
| ---------- | ----------------------- | ------------------------------------------------ |
| `clear`    | `clear`                 | Synthetic local fixture has no review block.     |
| `friction` | `friction_found`        | Synthetic local fixture exposes review friction. |

Neither status authorizes strategy action, execution, product expansion, deployment, or gate
movement.

## Invalid Input Contract

Invalid input handling must:

- Exit with code `1`.
- Print only bounded usage text to stderr.
- Keep stdout empty.
- Avoid stack traces.
- Avoid partial inspect JSON.
- Keep supported scenario keys static and explicit.

## Review Obligations

QA_SECURITY review must confirm:

- The command remains local.
- Invalid input is bounded.
- Help and JSON outputs do not leak raw payloads.
- No external access, credential handling, UI, API route, or publishing path is introduced.

RISK review must confirm:

- Financial gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- Output language does not imply approval, readiness, profitability, performance, or later-phase
  eligibility.
- The command does not alter risk limits, strategy state, maturity status, or operator decisions.

ORCHESTRATOR acceptance may be recorded only after QA_SECURITY and RISK reviews pass and required
validation commands pass.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-055_GATE0_INSPECT_COMMAND_CONTRACT_NOTES.md`
- Reviews: `ops/runtime/reviews/TRD-055_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-055_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-055_ORCHESTRATOR_ACCEPTANCE.md`
- Command sources: `scripts/inspect-gate0-dry-run.ts`, `scripts/inspect-gate0-dry-run-output.ts`,
  `packages/fixtures/src/gate0-dry-run-scenario.ts`
