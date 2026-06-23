# TRD-478 Frontend Skill Lens Intake

## Goal

Add the project-local frontend decision lenses needed before any read-only frontend implementation
packet is drafted.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Skills:
  - `traderframe-marketing-strategy-reviewer`
  - `traderframe-copy-reviewer`
  - `traderframe-frontend-engineer`
  - `traderframe-visual-product-designer`

## Blocked Scope

- No frontend implementation.
- No broker integration, account connectivity, credential handling, live execution, autonomous
  execution, AI buy/sell prediction, strategy approval, readiness labels, profitability claims, or
  risk-gate loosening.

## Required Outputs

- Four project-local skills with explicit invocation metadata.
- Skill governance and routing guard updates.
- Frontend skill lens intake record.
- QA/security, risk, and orchestrator review records.
- Tracklist, command-center, progress snapshot, and tests updated to `TRD-478`.

## Acceptance Criteria

- Skills are project-local under `skills/`.
- Each skill has `SKILL.md` and `agents/openai.yaml`.
- Each skill requires `allow_implicit_invocation: false`.
- Governance and routing checks include the new skills.
- Validation remains green.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_SKILL_LENS_INTAKE.md`
- QA/security review: `ops/runtime/reviews/TRD-478_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-478_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-478_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
