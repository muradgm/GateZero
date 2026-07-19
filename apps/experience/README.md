# TraderFrame Evidence Gate

Interactive brand and product-storytelling experience for GateZero.

## Current milestone

Foundation commit on `agent/evidence-gate-experience`:

- standalone Vite + React app
- React Three Fiber scene shell
- procedural Evidence Gate prototype
- canonical product-state package
- shared design-token package
- responsive and reduced-motion baseline

## Product boundary

The public experience is governed by `@gatezero/product-state` and currently identifies the product as `G2_PAPER_TRADING` / paper simulation planning.

It must not imply live broker execution, autonomous trading, profitability, strategy approval, or performance guarantees.

## Run

From the repository root:

```bash
pnpm install
pnpm --filter @gatezero/experience dev
```

Build:

```bash
pnpm --filter @gatezero/experience build
```

## Next milestone

1. Add explicit experience state machine.
2. Add evidence particle categories and semantic motion.
3. Add verification membrane and risk boundary shaders.
4. Add operator completion interaction.
5. Transition the 3D audit record into the TraderFrame interface.
6. Add authored Blender asset pipeline after the procedural prototype is approved.
