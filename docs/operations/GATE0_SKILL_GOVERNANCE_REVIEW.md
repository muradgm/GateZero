# Gate 0 Skill Governance Review

## Purpose

This review records the controlled adoption of local GateZero project skills:

- `skills/gatezero-docs-control-plane-reviewer/`
- `skills/gatezero-orchestrator-reviewer/`
- `skills/gatezero-product-strategy-reviewer/`
- `skills/gatezero-qa-security-reviewer/`
- `skills/gatezero-quant-backtest-reviewer/`
- `skills/gatezero-risk-governance-reviewer/`
- `skills/gatezero-ui-command-center-reviewer/`
- `skills/trader-product-reviewer/`
- `skills/trading-forex-domain-expert/`

The skills are review lenses only. They do not create product capability, modify strategy state,
promote gate state, approve strategies, or authorize execution.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

At this gate, these skills may be used to improve judgment, critique research and backtest surfaces,
identify missing evidence, tighten risk language, and translate future execution concerns into
blockers, contracts, fixtures, and tests.

They must not be used to justify:

- live trading
- broker integration
- paper order mechanics
- autonomous execution
- AI buy/sell prediction
- strategy approval or readiness claims
- performance or profitability claims
- risk-gate loosening

## Adopted Skill Controls

- Each skill has a `GateZero Boundary First` section.
- Each skill names `G0_RESEARCH` and `research_only`.
- Each skill routes Gate 0 recommendations toward local docs, contracts, fixtures, tests, and
  blockers.
- Each skill includes `agents/openai.yaml` with `allow_implicit_invocation: false`.
- The project skill governance guard checks these controls with:

```powershell
pnpm check:gate0-skills
```

## Scanner Allowlist

The Gate 0 forbidden-pattern scanner now allowlists `skills/` because these files are controlled
review references, not implementation code.

This does not loosen product gates. Implementation surfaces remain scanned unless they are already
explicitly allowlisted governance, docs, test, validation, or ops records.

## Source Links

- Source packet: `ops/assignments/TRD-208_GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Reviews: `ops/runtime/reviews/TRD-208_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-208_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-208_ORCHESTRATOR_ACCEPTANCE.md`
- Skill library intake policy: `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`
- Skill routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Orchestrator reviewer skill intake: `docs/operations/GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md`
- QA security reviewer skill intake: `docs/operations/GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md`
- Risk governance reviewer skill intake:
  `docs/operations/GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md`
- Skill guard script: `scripts/check-gate0-skill-governance.ts`
- Skill guard tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
- Forbidden-pattern scanner: `packages/validation/src/forbidden-patterns.ts`
- Tracker: `ops/runtime/tracklist.md`
