# Epoch 3 Risk Intelligence Outcome

## Outcome

Epoch 3 expands risk inspection from one case-level review to bounded local portfolio context.

The implementation computes:

- instrument and currency exposure;
- correlation-group and event-linked exposure;
- session and daily risk-budget utilization;
- account drawdown against a fixed high-water mark;
- explicit review findings and portfolio-level blockers.

## Authority Boundary

Portfolio risk status is limited to:

- `CLEAR`
- `REVIEW_REQUIRED`
- `BLOCKED`

These statuses are evidence for operator review. They are not approval, readiness, promotion, or
execution authority.

The implementation has no broker route, external account access, credentials, live order path,
autonomous action, or risk-limit mutation.

## Implemented Surface

- Runtime contracts: `packages/contracts/src/portfolio-risk-intelligence.ts`
- Deterministic evaluator and checkpoint: `packages/application/src/portfolio-risk-intelligence.ts`
- Focused tests: `packages/application/tests/portfolio-risk-intelligence.test.ts`
- Local fixture generator: `scripts/generate-epoch3-risk-case.ts`
- Runtime proof: `apps/intelligence-workspace/public/runtime/epoch3-risk-case.json`
- Workspace projection: `apps/intelligence-workspace/src/WorkspaceRoot.jsx` and
  `apps/intelligence-workspace/src/AppRuntime.jsx`

## Exit Evidence

The local proof contains:

1. A `REVIEW_REQUIRED` EUR/USD portfolio context.
2. A separate `BLOCKED` comparison that breaches correlation and event limits.
3. A deterministic checkpoint proving repeat evaluation produces the same assessment hash.
4. Explicit limitations beside the rendered risk evidence.
5. `riskApproval: false`, `executionPath: false`, and `automatedAction: false`.

## Validation

Required completion commands:

```text
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:ci
pnpm build:workspace
pnpm verify
```

Browser QA must cover desktop and a 390px mobile viewport with no document-level horizontal
overflow.

## Next Epoch

Epoch 4 may begin with deterministic learning intelligence over frozen decision bundles and linked
simulation outcomes. It must identify inspectable patterns without prediction, performance, or
strategy-promotion claims.
