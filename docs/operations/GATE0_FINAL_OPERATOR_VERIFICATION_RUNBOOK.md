# Gate 0 Final Operator Verification Runbook

## Purpose

This runbook tells the operator how to verify the local Gate 0 control plane.

It is an operator runbook only. It does not authorize trading, broker integration, autonomous
execution, AI prediction, product expansion, external publishing, later-phase movement, or risk-gate
loosening.

## Command

Run:

```powershell
pnpm verify:gate0
```

## Pass Interpretation

A passing result means the local Gate 0 control plane is internally consistent at the time of the
run.

It means:

- Gate 0 guard checks passed.
- Review records align with assignments.
- Tracker and progress snapshot align.
- Documentation coverage checks passed.
- Evidence-index drift checks passed.
- Lint, format, typecheck, and tests passed.

It does not mean:

- Trading is authorized.
- Broker integration is authorized.
- Live or paper execution is authorized.
- AI prediction is authorized.
- A strategy is approved.
- Strategy readiness, profitability, or performance is proven.
- Phase 1 or archive readiness is approved.

## Fail Interpretation

A failing result means one local maintenance issue needs investigation.

Do not broaden scope. Identify the first failing command, capture the failing artifact or message,
and open a bounded maintenance packet only for that specific local gap.

## Response Rule

When verification fails:

- Do not add product surface.
- Do not change gates.
- Do not loosen scanner or risk controls.
- Do not add execution, prediction, broker, publishing, or readiness behavior.
- Create the smallest Gate 0 maintenance packet that repairs the failing local control.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Verification command: `docs/operations/GATE0_QUALITY_SUITE_COMMAND_CONSOLIDATION.md`
- Source packet: `ops/assignments/TRD-137_GATE0_FINAL_OPERATOR_VERIFICATION_RUNBOOK.md`
- Reviews: `ops/runtime/reviews/TRD-137_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-137_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-137_ORCHESTRATOR_ACCEPTANCE.md`
