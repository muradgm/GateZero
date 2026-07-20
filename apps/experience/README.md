# TraderFrame — Conviction Atlas

Interactive visual operating system for GateZero and TraderFrame.

## Active branch

```text
agent/conviction-atlas-creative-system
```

This branch preserves the Evidence Gate prototype while building the reusable **TraderFrame Experience Engine** around the Conviction Atlas direction.

## Product definition

TraderFrame is a private trading decision-intelligence platform. It interprets market structure, events, sentiment, flows, technical evidence, and risk context to form an explainable directional thesis and recommend whether the user should act, wait, reduce exposure, or reject the setup.

## Wedge

> TraderFrame turns fragmented market evidence into one explainable, risk-aware trading decision.

## Source of truth

Start with:

```text
apps/experience/docs/creative-system/README.md
apps/experience/docs/creative-system/experience-principles.md
apps/experience/docs/creative-system/experience-engine-architecture.md
apps/experience/docs/creative-system/visual-operating-system.md
apps/experience/src/config/creativeSystem.ts
```

## Experience Engine

```text
Intelligence
→ Landscape
→ Routes
→ Motion
→ Camera
→ Materials
→ Interface
```

The landscape and routes must be derived from semantic intelligence state. Visual geometry must not invent product meaning independently.

## Current implementation status

- Existing Evidence Gate prototype remains runnable.
- Conviction Atlas visual operating system is documented.
- Canonical experience principles are locked.
- Reusable engine architecture is defined.
- The first typed Intelligence Engine is implemented.
- Signals now carry confidence, freshness, importance, contradiction, risk impact, and route weight.
- The next code milestone is a playground that visualizes intelligence clusters before terrain generation begins.

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
