# Gate 2 Simulation Evidence Detail Schema Implementation

TRD: TRD-532

## Implementation

`Gate2SimulationEvidenceDetailContractSchema` records local source artifacts, workflow evidence
cards, risk panels, artifact summaries, failure-mode references, source-link map references,
reproducibility notes, limitation notes, and freshness state.

## Boundary

The schema requires `G2_PAPER_TRADING`, `paper_simulation_planning_only`, operator authority,
simulation-only state, no external account, no credentials, no live route, no automation, no
approval claim, no performance claim, no external access, and no execution path.

## Source Links

- Source packet: `ops/assignments/TRD-532_SIMULATION_EVIDENCE_SCHEMA_SOURCE_UPDATE.md`
- `packages/contracts/src/gate2-paper-simulation-contracts.ts`
- `packages/fixtures/src/gate2-paper-simulation-fixtures.ts`
- `ops/runtime/reviews/TRD-532_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-532_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-532_ORCHESTRATOR_ACCEPTANCE.md`
