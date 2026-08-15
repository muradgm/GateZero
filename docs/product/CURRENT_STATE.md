# TraderFrame Current State

## Purpose

This is the canonical current-state record for TraderFrame. Read it with
[CURRENT_ROADMAP.md](CURRENT_ROADMAP.md) before selecting new work. Historical `TRD-*` records
remain in `ops/runtime/tracklist.md` as evidence, not as the active delivery roadmap.

## Operating Boundary

| Field                            | Current value                              |
| -------------------------------- | ------------------------------------------ |
| Product                          | `TraderFrame`                              |
| Internal control plane           | `GateZero`                                 |
| Financial gate                   | `G2_PAPER_TRADING`                         |
| Scope                            | `paper_simulation_planning_only`           |
| Execution authority              | none                                       |
| Latest accepted operating packet | `TRD-779`                                  |
| Active delivery stage            | `R1 — Selective Historical Reconciliation` |

The governing wedge remains:

```text
No trade without evidence. No execution without risk approval.
```

## Canonical Delivery Order

```text
R0  Repository Health + Decision Authority Reconciliation
 -> R1  Selective Historical Reconciliation
 -> R2  Real EUR/USD Case Zero
 -> R3  Strategy Research Lab / Gauntlet
 -> R4  Read-only Prediction Market Intelligence
 -> R5  Forward Paper Observation
 -> R6  AI Review Artifacts
 -> R7  Separate Execution Research Gate
```

## R0 Authority Rule

Evidence may inform authority. Evidence never creates authority by itself.

An intelligence report may expose evidence completeness, freshness, consistency, robustness,
contradictions, blockers, limitations, and review urgency. It must not create a bounded simulation
disposition.

`PAPER_SIMULATE` is allowed only when all of the following are present:

1. Complete setup review.
2. Valid risk review.
3. Explicit observable invalidation.
4. Portfolio and exposure eligibility.
5. Manual operator record.

Missing any one condition must block that outcome. AI output, a score, a confidence value, or a
strategy result has no authority on its own.

## R0 Exit Criteria

1. Dependency audit has no unresolved high-severity finding.
2. `pnpm verify` includes the workspace build.
3. `verify` and `verify:verbose` enforce the same quality gates.
4. `TradingIntelligenceReport` cannot derive a bounded simulation disposition from score or
   confidence.
5. Queue ordering represents review urgency, not attractiveness.
6. Runtime contracts require the complete protected review chain for `PAPER_SIMULATE`.
7. Migration tests prove that standalone intelligence artifacts have zero authority.
8. README, release status, roadmap, capability roadmap, and this document agree with current main.
9. Full verification is green before R1 begins.

## R0 Completion Record

R0 is complete on `codex/r0-authority-reconciliation`, pending normal code review and merge.

- Dependency audit: `pnpm audit --audit-level high` reports no known vulnerabilities.
- Verification: `pnpm verify:gate0` passed on 2026-08-15 with repository checks, workspace build,
  lint, formatting, type checking, and tests.
- Authority: intelligence reports and setup-review assessments now publish evidence status and
  review urgency only. They do not contain a confidence field or a bounded disposition.
- Pipeline: only the `operator_decision` stage may record `REJECT`, `WATCH`, or `PAPER_SIMULATE`;
  non-operator stages reject supplied dispositions.
- Workspace: a blocked assessment without a manual record is displayed as `Review blocked`, never as
  an operator rejection.

## Known Open Risks

- `apps/web` and `apps/intelligence-workspace` overlap; R1 must designate one canonical operator
  workspace.
- Historical real-data work on `feature/validated-decision-trace-completion` must be selectively
  reconciled, never merged wholesale.

## Canonical References

- [PROJECT_TRUTH.md](../../ops/truth/PROJECT_TRUTH.md)
- [RISK_RULES.md](../../ops/truth/RISK_RULES.md)
- [FINANCIAL_RISK_GATES.md](../../ops/governance/FINANCIAL_RISK_GATES.md)
- [AUTONOMY_GATES.md](../../ops/governance/AUTONOMY_GATES.md)
- [CURRENT_ROADMAP.md](CURRENT_ROADMAP.md)
- [RELEASE_STATUS.md](RELEASE_STATUS.md)
