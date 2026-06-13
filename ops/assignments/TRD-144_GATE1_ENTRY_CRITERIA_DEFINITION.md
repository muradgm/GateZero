# TRD-144: Gate 1 Entry Criteria Definition

## Objective

Define the criteria that must be satisfied before GateZero can request movement from Gate 0 Research
Only to Gate 1 Backtesting.

## Scope

Allowed:

- Define non-authorizing Gate 1 entry criteria.
- Link criteria to existing financial and autonomy gates.
- Keep current operation at `G0_RESEARCH`.
- Update tracker and documentation indexes.

Blocked:

- Changing the current operating gate, adding backtest execution, broker integration, paper/live
  execution, AI prediction, strategy claims, readiness claims, external publishing, or risk-gate
  loosening.

## Required Output

- `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker and documentation indexes.

## Acceptance Criteria

- Criteria are explicit and stricter than the minimum Gate 1 text where needed.
- Criteria do not move the project out of Gate 0.
- Gate 0 verification remains passing.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
