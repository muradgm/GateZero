# Epoch 4 Deterministic Learning Intelligence Outcome

## Outcome

Epoch 4 turns completed, hash-linked local simulation cases into inspectable learning patterns.

The implementation identifies:

- recurring invalidations;
- repeated evidence and failure-mode combinations;
- manually confirmed operator-process errors;
- strategy-version and declared-regime drift;
- exact comparable case clusters.

## Authority Boundary

Learning intelligence is descriptive. It must not:

- predict a future result;
- report a win probability or strategy edge;
- promote a strategy;
- produce a trade recommendation;
- change strategy rules automatically;
- change risk limits automatically;
- create execution authority.

Operator-process errors use `MANUAL_LOCAL` attribution. The system does not infer operator intent
from an outcome.

## Implemented Slices

### Slice 1: Contracts

`packages/contracts/src/learning-intelligence.ts` defines immutable case, report, drift, cluster,
and checkpoint contracts.

### Slice 2: Pattern Extraction

`packages/application/src/learning-intelligence.ts` verifies source hashes and extracts recurring
invalidations, evidence/failure patterns, and manually attributed process patterns.

### Slice 3: Clustering And Drift

Comparable clusters require exact strategy version, regime, and evidence combinations. Drift
inspection reports version and regime changes without scoring outcome attractiveness.

### Slice 4: Runtime Proof

`scripts/generate-epoch4-learning-case.ts` creates six local immutable EUR/USD cases and a
deterministic checkpoint.

The fixture exercises:

- one recurring invalidation;
- two evidence/failure patterns;
- two manually attributed process patterns;
- two exact comparable clusters;
- strategy-version and regime-drift review.

### Slice 5: Workspace Projection

`apps/intelligence-workspace/src/LearningIntelligencePanel.jsx` renders pattern counts, exact source
case IDs, cluster attributes, drift reasons, manual-attribution boundaries, and interpretation
limits.

### Slice 6: Boundary And Browser QA

Application and runtime tests reject tampered hashes, insufficient cases, duplicate cases, and
non-deterministic or authority-expanding output.

Browser QA covers desktop and a 390px viewport with no document-level or source-ID overflow.

## Exit Evidence

The generated proof requires:

- `checkpoint.status: PASS`;
- `deterministic: true`;
- `sourceChainsValid: true`;
- `requiredPatternsExercised: true`;
- `recommendationFinal: false`;
- `predictiveClaim: false`;
- `performanceClaim: false`;
- `updatesRules: false`;
- `updatesRiskLimits: false`;
- `executionPath: false`.

## Validation

```text
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:ci
pnpm build:workspace
pnpm verify
```

## Next Epoch

Epoch 5 may begin by placing a second strategy behind the same validated contracts and protected
loop. No strategy may bypass evidence, risk, deterministic simulation, outcome, or learning
requirements.
