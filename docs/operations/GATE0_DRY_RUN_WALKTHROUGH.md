# Gate 0 Dry-Run Walkthrough

## Purpose

This walkthrough shows how to inspect the accepted Gate 0 dry-run chain from a local command.

The command is an operator ergonomics aid only. It does not change strategy state, risk limits,
operator decisions, or gate status.

## Boundary

Current gate:

```text
G0_RESEARCH
```

Current scope:

```text
research_only
```

The dry-run path is local, deterministic, synthetic, and redacted.

## Protected Loop Shape

The accepted loop remains:

```text
Strategy Idea -> Data Snapshot -> Backtest -> Metric Report -> Risk Review -> Operator Decision -> Outcome Logged -> Learning Event
```

The inspect command does not print the raw loop payload. It prints a reduced operator view:

```text
Checklist Summary -> Friction Report -> Iteration Recommendation
```

## Run The Inspect Command

From the repository root:

```powershell
pnpm inspect:gate0-dry-run
```

To print local command help:

```powershell
pnpm inspect:gate0-dry-run -- --help
```

The default scenario is `clear`. To inspect the local friction scenario:

```powershell
pnpm inspect:gate0-dry-run -- --scenario friction
```

Available scenario keys:

- `clear`
- `friction`

Invalid scenario keys return a bounded local error with usage text. They should not print stack
traces or any inspect payload.

Expected top-level fields:

- `inspection_id`
- `scenario_id`
- `financial_gate`
- `scope`
- `bundle_id`
- `inspect_status`
- `checklist_summary`
- `friction_report`
- `iteration_recommendation`

Expected boundary values:

```text
financial_gate: G0_RESEARCH
scope: research_only
```

## How To Read The Output

Use `checklist_summary` to confirm whether each local review check completed or was blocked.

Use `friction_report` to see whether any blocked checks map to static friction categories.

Use `iteration_recommendation` to see the next local review action label for each friction category.

If `inspect_status` is `clear`, the accepted synthetic dry-run fixture passed the local inspect
path. That does not imply strategy approval, trading readiness, profitability, or future-phase
eligibility.

If `inspect_status` is `friction_found`, treat the listed action labels as local review work only.

## Redaction Rules

The inspect output must not include:

- Raw strategy-review bundle payloads.
- Raw trace payloads.
- Raw metric payloads.
- Evidence strings.
- Strategy approval language.
- Readiness claims.
- Profitability claims.
- Performance claims.
- External service output.

## Validation Commands

Run the local inspect command and the full Gate 0 validation set:

```powershell
pnpm inspect:gate0-dry-run
pnpm inspect:gate0-dry-run -- --help
pnpm inspect:gate0-dry-run -- --scenario friction
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Operator Notes

This walkthrough is intentionally narrow. It exists to make the accepted dry-run chain easier to
inspect without adding UI, external integrations, reporting workflows, prediction behavior,
execution paths, or broader product surface area.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-046_GATE0_DRY_RUN_WALKTHROUGH.md`
- Reviews: `ops/runtime/reviews/TRD-046_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-046_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-046_ORCHESTRATOR_ACCEPTANCE.md`
