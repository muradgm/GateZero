# Gate 2 Frontend Skill Lens Intake

## Summary

TRD-478 adds project-local frontend decision lenses before any frontend implementation packet is
drafted. This keeps frontend progress disciplined: market clarity, safe copy, design quality, and
frontend engineering all stay subordinate to GateZero risk and QA controls.

## Accepted Skills

| Skill                                     | Purpose                                                            | Current Use                                      |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `traderframe-marketing-strategy-reviewer` | Positioning, audience fit, trust-before-breadth, claim discipline. | Frontend narrative and product messaging review. |
| `traderframe-copy-reviewer`               | UI labels, warnings, limitation copy, risk copy, claim safety.     | Panel copy and operator-facing language review.  |
| `traderframe-visual-product-designer`     | Layout, hierarchy, navigation, visual restraint, accessibility.    | Read-only frontend design planning and review.   |
| `traderframe-frontend-engineer`           | Architecture, component boundaries, local data contracts, tests.   | Read-only frontend implementation packet review. |

## Why Project-Local

These skills belong in `skills/` because TraderFrame has unusually strict financial-risk and
autonomy boundaries. A generic marketing, copy, design, or frontend lens could accidentally optimize
for conversion, excitement, or execution affordances. These skills optimize for trust, evidence,
risk visibility, and bounded local operation.

## Usage Rule

For future frontend packets, use:

- `traderframe-marketing-strategy-reviewer` for positioning and product narrative.
- `traderframe-copy-reviewer` for labels, warnings, and claim safety.
- `traderframe-visual-product-designer` for hierarchy, layout, and accessibility.
- `traderframe-frontend-engineer` for architecture, data contracts, tests, and implementation
  safety.

Always pair these with GateZero risk, QA/security, docs, and orchestrator lenses when accepting
frontend work.

## Result

The next frontend implementation packet should be drafted only after these skills are invoked and
their decisions remain read-only, local, and no-claim.

## Source Links

- Source packet: `ops/assignments/TRD-478_FRONTEND_SKILL_LENS_INTAKE.md`
- QA/security review: `ops/runtime/reviews/TRD-478_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-478_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-478_ORCHESTRATOR_ACCEPTANCE.md`
- Skill routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill routing guard: `scripts/check-gate0-skill-routing.ts`
