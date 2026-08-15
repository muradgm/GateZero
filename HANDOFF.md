# TraderFrame Agent Handoff

## Purpose

Read [docs/product/CURRENT_STATE.md](docs/product/CURRENT_STATE.md) first. This document is the
short operational map for continuing TraderFrame without reconstructing repository history from the
`TRD-*` ledger.

## Current Position

- Product: `TraderFrame`; `GateZero` is the internal control plane.
- Governing wedge: **No trade without evidence. No execution without risk approval.**
- Financial gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`, local deterministic research and read-only decision
  support.
- Execution authority: none. There is no external trading-provider connection, account, credential,
  external order, live order, non-human action, or unreviewed directional-decision authority.
- Latest accepted operating packet: `TRD-779`.
- Active delivery stage: `R1 — Selective Historical Reconciliation`.

The formal operating ledger is [ops/runtime/tracklist.md](ops/runtime/tracklist.md). It is
historical evidence, not the current product roadmap. Use
[docs/product/CURRENT_ROADMAP.md](docs/product/CURRENT_ROADMAP.md) for delivery direction and
[docs/product/CURRENT_STATE.md](docs/product/CURRENT_STATE.md) for canonical status.

## Start Here

1. Check the current branch and working tree with `git status -sb`.
2. Fetch `origin` before selecting work. `main` is checked out in another, potentially stale,
   worktree; create a fresh branch from `origin/main` in the active worktree instead of assuming the
   local `main` worktree is current.
3. Read these sources of truth before changing scope:
   - [ops/truth/PROJECT_TRUTH.md](ops/truth/PROJECT_TRUTH.md)
   - [ops/truth/RISK_RULES.md](ops/truth/RISK_RULES.md)
   - [ops/governance/FINANCIAL_RISK_GATES.md](ops/governance/FINANCIAL_RISK_GATES.md)
   - [ops/governance/AUTONOMY_GATES.md](ops/governance/AUTONOMY_GATES.md)
   - [docs/product/CURRENT_ROADMAP.md](docs/product/CURRENT_ROADMAP.md)
   - [docs/product/RELEASE_STATUS.md](docs/product/RELEASE_STATUS.md)

## What Exists

### Domain and validation foundation

- `packages/contracts/`: Zod contracts for evidence, research cases, deterministic backtests,
  intelligence reports, risk review, local simulation, and decision traces.
- `packages/core/`: deterministic protected-loop, backtest, simulation, intake, and audit logic.
- `packages/application/`: application services that assemble intelligence reports, canonical
  assessments, risk reviews, and strategy-platform evidence.
- `packages/fixtures/`: checked-in synthetic/local fixtures. They are demonstrations and test data,
  not live market data or trade authority.
- `packages/validation/` and `scripts/`: boundary, source-link, tracker, repository, and UI data
  checks.

### Product surfaces

- `apps/web/`: static local control-plane dashboard, simulator, and branded command-center page. Run
  `pnpm preview:web` and open `http://127.0.0.1:4173/`.
- `apps/intelligence-workspace/`: React/Vite evidence workspace. It loads generated local snapshots
  from `runtime/`. Build it with `pnpm build:workspace` or develop with
  `pnpm --filter @traderframe/intelligence-workspace dev` after generating workspace data.
- `packages/ui/`: shared React visual primitives.

### Recent merged milestones

- PR #6: command-center language and rendering safety reconciliation.
- PR #7: Epoch 5 multi-strategy platform, with fixed local strategy registrations and isolated
  deterministic lifecycle traces.
- PR #8: tracker baseline reconciliation, preserving the distinction between the operating ledger
  and product milestones.
- PR #9 / TRD-779: local manual-review history inspection for a frozen intelligence brief; stored
  records retain hard-false execution, external-dispatch, approval, and simulation-authority flags.

## Product Direction

The current milestone is the **Evidence-Gated Setup Review MVP**. It must let an operator inspect a
market candidate, supporting and contradicting evidence, deterministic strategy evidence,
invalidation, risk/exposure, an explicit manual disposition (`REJECT`, `WATCH`, or
`PAPER_SIMULATE`), and later outcome/learning evidence.

The intended next phases are described in
[docs/product/CURRENT_ROADMAP.md](docs/product/CURRENT_ROADMAP.md):

1. Source-of-truth consolidation.
2. One application spine for protected-loop transitions.
3. A canonical Setup Review aggregate.
4. Deterministic evidence hardening.
5. One decision-first command center.
6. Immutable outcome learning.

Do not broaden into providers, real-time data, external-provider connectivity, live or external
paper routing, non-human execution, generic AI scores, profit/readiness claims, or alert
infrastructure.

## Validation

Run a clean install after switching branches or pulling dependency changes:

```powershell
pnpm install --frozen-lockfile
pnpm verify:gate0
pnpm build:workspace
pnpm audit --audit-level high
```

`pnpm verify:gate0` runs repository checks, the React workspace build, lint, formatting, type
checking, and tests. `pnpm verify:verbose` enforces the same quality gates with explicit output. For
UI-affecting work, visually inspect desktop and narrow widths, check browser console output, and
verify that limitations remain beside the evidence they qualify.

## Known Risks And Required Next Actions

1. **There are two overlapping frontend surfaces.** `apps/web/` and `apps/intelligence-workspace/`
   present related command-center concepts with separate generated data and rendering paths. Select
   one canonical operator workspace in the source-of-truth consolidation milestone; preserve the
   other only as a clearly labeled supporting/control-plane view or retire it. Avoid implementing
   features in both.
2. **Status evidence is self-consistent but stale.** `apps/web/src/command-center-data.js` and
   `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md` still show CI run `27787807220`,
   commit `6e6f513`, and older test-count wording. The current freshness check compares these two
   stale sources, so it can pass while the displayed status is outdated. Replace duplicated static
   metadata with one generated canonical status record.
3. **Keep historical tracking out of active planning.** Large edits to `ops/runtime/tracklist.md`
   can create noisy diffs. Do not reformat or rewrite old rows. Add a focused packet/ledger update
   only when formal acceptance changes, and use the current roadmap for product sequencing.

## Handoff Protocol

- Treat all market, scenario, score, and paper-simulation examples as local fixture evidence unless
  they are explicitly tied to a validated canonical aggregate.
- Never make `PAPER_SIMULATE` mean a trade approval. It permits only a local deterministic
  simulation record under the current boundary.
- Keep supporting evidence, contradicting evidence, limitations, invalidation, and risk status
  visible together in the UI.
- Use the `senior-tech-lead` lens for scope, risk, architecture, and sequencing decisions; use the
  `senior-ui-ux-designer` lens for operator-facing interface work.
- Keep unrelated worktrees and user-owned changes untouched.

## Repository State At Handoff

The audited remote mainline was `origin/main` at `702f2f7` (merged TRD-779). R0 work is on
`codex/r0-authority-reconciliation`. The working tree contains the R0 changes until they are fully
validated and reviewed.

## R0 Completion

R0 is validated on 2026-08-15:

- `pnpm audit --audit-level high` reports no known vulnerabilities.
- `pnpm verify:gate0` passes with the workspace build included.
- The verification runner uses a non-shell Windows launch path.
- Intelligence reports and setup-review assessments contain evidence state and review urgency, not
  confidence or bounded dispositions.
- Only the manual `operator_decision` pipeline stage may record a bounded disposition.
- The React workspace keeps blocked evidence distinct from a manually recorded rejection.

Begin R1 by selectively reconciling the historical branch, not by merging it wholesale. First choose
a single real EUR/USD source slice and compare its adapter, evidence provenance, timestamp, and risk
assumptions against the now-authoritative contracts.
