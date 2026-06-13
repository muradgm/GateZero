# TRD-138: Gate 0 Verification Failure Triage Template

## Objective

Add a local template for recording what happened when `pnpm verify:gate0` fails.

## Scope

Allowed:

- Document the minimum fields to capture after a failed verification run.
- Keep the template local and non-authorizing.
- Point failures to bounded Gate 0 maintenance only.
- Update tracker and documentation indexes.

Blocked:

- Trading guidance, broker integration, execution workflows, AI prediction, strategy performance
  claims, readiness claims, product launch claims, external publishing, or risk-gate changes.

## Required Output

- `docs/operations/GATE0_VERIFICATION_FAILURE_TRIAGE_TEMPLATE.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.
- Updated tracker and documentation indexes.

## Acceptance Criteria

- Template captures the first failing command, artifact, observed message, expected local state, and
  proposed bounded repair.
- Template does not authorize product or execution work.
- Gate 0 verification remains passing.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
