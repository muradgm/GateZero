# Gate 0 Operator Checklist

## Purpose

This checklist is the short local operating companion to the Gate 0 operator review runbook.

Use it only for deterministic, synthetic, redacted Gate 0 command review. It does not change
strategy state, risk state, maturity state, operator decisions, or gate status.

Full references:

- `docs/operations/GATE0_OPERATOR_REVIEW_RUNBOOK.md`
- `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Do not use this checklist as strategy approval, readiness review, deployment approval, product
launch review, performance evidence, profitability evidence, or future-phase eligibility review.

## Quick Checklist

| Step | Check             | Command                                                                                | Pass condition                                                                                                      |
| ---- | ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1    | Boundary          | `Get-Content ops/runtime/tracklist.md`                                                 | Latest packet is current, gate is `G0_RESEARCH`, scope is `research_only`, rejected-for-now scope remains rejected. |
| 2    | Help path         | `pnpm inspect:gate0-dry-run -- --help`                                                 | Exits successfully, lists static local scenario keys, confirms Gate 0 boundary, prints no JSON payload.             |
| 3    | Help alias        | `pnpm inspect:gate0-dry-run -- -h`                                                     | Matches the help path expectations.                                                                                 |
| 4    | Clear scenario    | `pnpm inspect:gate0-dry-run`                                                           | Prints redacted JSON with `financial_gate: G0_RESEARCH`, `scope: research_only`, and `inspect_status: clear`.       |
| 5    | Friction scenario | `pnpm inspect:gate0-dry-run -- --scenario friction`                                    | Prints redacted JSON with `inspect_status: friction_found` and local review friction only.                          |
| 6    | Invalid input     | `pnpm inspect:gate0-dry-run -- --scenario other`                                       | Exits nonzero with bounded usage text, no stack trace, and no inspect JSON payload.                                 |
| 7    | Tracklist guard   | `pnpm check:gate0-tracklist`                                                           | Accepted records, tracklist ledger rows, and latest accepted packet align.                                          |
| 8    | Snapshot refresh  | `pnpm snapshot:gate0-progress`                                                         | Writes the local progress snapshot under `ops/runtime/progress/`.                                                   |
| 9    | Full validation   | `pnpm lint`; `pnpm format:check`; `pnpm typecheck`; `pnpm test`; `pnpm validate:gate0` | All commands pass before acceptance records are finalized.                                                          |

## Escalate To QA_SECURITY

Escalate when:

- Help output includes unsupported scope.
- Invalid input prints stack traces.
- Output includes raw payloads.
- Any path introduces external access, credential handling, UI, API routes, or publishing.

## Escalate To RISK

Escalate when:

- Any output weakens `G0_RESEARCH` or `research_only`.
- Any text implies approval, readiness, profitability, performance, or later-phase eligibility.
- Any change alters risk limits, strategy state, maturity status, operator decisions, or gate
  status.

## Done When

Checklist use is complete when:

- Boundary, help, clear, friction, invalid input, tracklist, snapshot, and validation checks pass.
- QA_SECURITY review is recorded when required.
- RISK review is recorded when required.
- ORCHESTRATOR acceptance is recorded for any packet changing this checklist.

## Source Links

- Operating companions: `docs/operations/GATE0_OPERATOR_REVIEW_RUNBOOK.md`,
  `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`
- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-057_GATE0_RUNBOOK_CHECKLIST_EXTRACTION.md`
- Reviews: `ops/runtime/reviews/TRD-057_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-057_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-057_ORCHESTRATOR_ACCEPTANCE.md`
