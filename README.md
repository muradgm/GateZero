# TraderFrame

TraderFrame is an evidence-gated trading research and decision-support workspace. GateZero is the
internal control plane that protects research integrity, risk review, operator authority, and scope
boundaries.

## Core wedge

```text
No trade without evidence. No execution without risk approval.
```

TraderFrame is being built around one protected decision loop:

```text
Market Candidate -> Research Case -> Evidence -> Backtest -> Risk Review -> Operator Decision -> Paper Simulation -> Outcome -> Learning Event
```

## Current operating state

- Operating gate: `G2_PAPER_TRADING`
- Scope: local deterministic research and paper-simulation evidence
- Product authority: read-only decision support and manual operator review
- External execution authority: none

The repository currently includes:

- runtime-validated trading research contracts;
- deterministic historical backtest evidence;
- declared fee and slippage assumptions;
- reproducibility and integrity checks;
- local paper-account and simulation mechanics;
- research-case intake and immutable revision history;
- source-linked intelligence briefs;
- a read-only command center and simulator evidence workspace;
- extensive validation, security, risk, and scope guards.

The repository does **not** authorize broker integration, live orders, external account access,
autonomous execution, unreviewed AI trade decisions, profitability claims, or production-readiness
claims.

## Product direction

The next product milestone is the Trading Intelligence Command Center: a decision-first workspace
that helps an operator evaluate a market candidate using market context, supporting and
contradicting evidence, deterministic strategy evidence, invalidation, risk, portfolio exposure,
paper simulation, and outcome learning.

The immediate vertical slice is an **Evidence-Gated Setup Review** that ends with one of three
bounded operator outcomes:

- `REJECT`
- `WATCH`
- `PAPER_SIMULATE`

See:

- [`docs/product/CURRENT_ROADMAP.md`](docs/product/CURRENT_ROADMAP.md)
- [`docs/product/RELEASE_STATUS.md`](docs/product/RELEASE_STATUS.md)
- [`docs/architecture/SETUP_REVIEW_VERTICAL_SLICE.md`](docs/architecture/SETUP_REVIEW_VERTICAL_SLICE.md)

## Repository map

- `apps/web` — local command center and simulator evidence workspaces.
- `packages/contracts` — runtime-validated TypeScript contracts.
- `packages/core` — deterministic research, backtest, simulation, and decision-loop mechanics.
- `packages/fixtures` — bounded synthetic and checked-in research evidence.
- `packages/validation` — forbidden-scope and repository boundary checks.
- `scripts` — generation, inspection, validation, and local preview commands.
- `ops` — historical assignments, reviews, evidence records, and operating tracklist.
- `docs` — architecture, product, engineering, and operating documentation.

## Local validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:ci
pnpm verify:gate0
```

`verify:gate0` is the current compatibility command. A gate-neutral verification command will replace
it during the command and source-of-truth consolidation milestone.
