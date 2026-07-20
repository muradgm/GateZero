# TraderFrame — Conviction Atlas

Interactive brand and product-storytelling experience for GateZero.

## Active branch

```text
agent/conviction-atlas-creative-system
```

This branch preserves the Evidence Gate prototype while establishing the new two-layer creative system for the **Conviction Atlas / Decision Landscape** direction.

## Product definition

TraderFrame is a private trading decision-intelligence platform. It interprets market structure, events, sentiment, flows, technical evidence, and risk context to form an explainable directional thesis and recommend whether the user should act, wait, reduce exposure, or reject the setup.

## Wedge

> TraderFrame turns fragmented market evidence into one explainable, risk-aware trading decision.

## Creative system

The work is structured into two layers:

1. **Creative Thinking** — product strategy, creative direction, information architecture, experience narrative, and art direction.
2. **Production** — concept art, storyboard, design system, 3D, motion, shaders, implementation, QA, and deployment.

Start here:

```text
apps/experience/docs/creative-system/README.md
```

The machine-readable source of truth is:

```text
apps/experience/src/config/creativeSystem.ts
```

## Product boundary

The public experience is governed by `@gatezero/product-state` and currently identifies the product as `G2_PAPER_TRADING` / paper simulation planning.

It must not imply live broker execution, autonomous trading, profitability, strategy approval, certainty, or performance guarantees.

## Run

From the repository root:

```bash
pnpm install
pnpm --filter @gatezero/experience dev
```

Build and typecheck:

```bash
pnpm --filter @gatezero/experience typecheck
pnpm --filter @gatezero/experience build
```

## Current implementation status

- Existing Evidence Gate prototype remains runnable.
- Conviction Atlas creative brief is defined.
- Creative Council and approval gates are documented.
- Production deliverables and initial performance budgets are defined.
- The next implementation milestone is a new terrain-based prototype built from the approved brief rather than modifying the old gate scene in place.
