# TRD-780 Command Center Language, Build, and Visual QA

Status: accepted

## Purpose

Stabilize the TraderFrame command center as a bounded evidence-review workspace, make the React
workspace build part of normal verification, and require visual QA before orchestrator acceptance.

## Scope

- Tighten user-facing language across the static command center and React intelligence workspace.
- Present `PAPER_SIMULATE`, `WATCH`, and `REJECT` only as bounded operator dispositions.
- Replace unbounded recommendation, score, readiness, and action language with evidence-index,
  risk-review, and operator-controlled wording.
- Add an automated UI language regression boundary.
- Add `pnpm build:workspace` to the normal verification flow.
- Preserve local paper-simulation planning only; add no broker, credential, order-routing, or live
  execution capability.
- Resolve the unrelated formatting-only Dukascopy CSV adapter drift in a separate style commit.

## Implemented evidence

- `apps/web/src/intelligence-command-center.js`
- `apps/intelligence-workspace/src/App.jsx`
- `apps/intelligence-workspace/src/AppRuntime.jsx`
- `apps/intelligence-workspace/src/AIEvidenceCouncil.jsx`
- `apps/intelligence-workspace/src/CandidateActionBar.jsx`
- `apps/intelligence-workspace/src/CommandPalette.jsx`
- `apps/intelligence-workspace/src/ConfidenceChange.jsx`
- `apps/intelligence-workspace/src/DecisionMemory.jsx`
- `apps/intelligence-workspace/src/DecisionReplay.jsx`
- `apps/intelligence-workspace/src/EvidenceGraph.jsx`
- `apps/intelligence-workspace/src/IntelligenceTools.jsx`
- `apps/intelligence-workspace/src/OperatorJournal.jsx`
- `apps/intelligence-workspace/src/SimilarSetups.jsx`
- `apps/intelligence-workspace/src/candidate-workflow.js`
- `packages/ui/src/components.jsx`
- `packages/ui/src/components.css`
- `packages/fixtures/tests/intelligence-command-center-language-boundary.test.ts`
- `scripts/verify-progress.ts`
- `package.json`

## Automated acceptance

Refresh the deterministic progress snapshot after pulling the open assignment:

```powershell
pnpm snapshot:gate0-progress
```

Then run in this order:

```powershell
pnpm build:workspace
pnpm test:ci
pnpm typecheck
pnpm lint
pnpm format:check
pnpm validate:gate0
pnpm check:gate0-command-center
pnpm verify:gate0
```

Acceptance requires all commands to pass, including the workspace build stage now included in
`pnpm verify:gate0`. The refreshed progress snapshot must remain uncommitted until its generated
content has been reviewed for the open TRD-780 state.

## Visual QA

Run one of:

```powershell
pnpm dev:workspace
```

or:

```powershell
pnpm build:workspace
pnpm preview:workspace
```

Inspect desktop and narrow/mobile layouts for:

- candidate queue;
- setup review;
- evidence graph;
- AI evidence council;
- decision replay;
- operator journal;
- command palette;
- adjacent evidence and limitations;
- browser-console errors;
- text overlap and clipped controls;
- any control or wording that implies prediction, approval, readiness, buy/sell direction, profit,
  live execution, or automated action.

## Boundary

This packet changes presentation, regression coverage, and build verification only. It grants no
risk approval, simulation authorization, external dispatch, account access, credential handling,
order placement, or live execution authority.

## Exit condition

Accepted on 2026-07-28 after `pnpm verify:gate0` passed with 129 test files and 888 tests. Desktop
and 390px visual QA confirmed no console errors or page-level horizontal overflow in the static
command center and React workspace. TRD-781 is now the active merge-readiness checkpoint.
