# Gate 0 Skill Routing Guard

This record documents `pnpm check:gate0-skill-routing`.

The guard verifies that `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md` names every governed project
skill and every required decision lane.

Boundary: `G0_RESEARCH`, `research_only`.

Validation:

```powershell
pnpm check:gate0-skill-routing
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-220_GATE0_SKILL_ROUTING_GUARD.md`
- QA review: `ops/runtime/reviews/TRD-220_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-220_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-220_ORCHESTRATOR_ACCEPTANCE.md`
- Routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Routing guard: `scripts/check-gate0-skill-routing.ts`
- Routing tests: `packages/fixtures/tests/gate0-skill-routing.test.ts`
