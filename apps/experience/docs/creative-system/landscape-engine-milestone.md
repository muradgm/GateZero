# Landscape Engine — Milestone 1

## Objective

Convert Intelligence Engine output into a deterministic, inspectable spatial field.

The landscape is not decorative terrain. Every major visual property is derived from intelligence state:

- confidence raises the field,
- risk creates valleys,
- contradiction introduces fractures,
- freshness controls surface energy,
- directional balance tilts the field,
- route weight controls candidate-path visibility,
- the strongest current route is highlighted without implying certainty.

## Architecture

```text
IntelligenceState
  ↓
Landscape Engine
  ├─ Field sampler
  ├─ Elevation solver
  ├─ Risk-valley solver
  ├─ Contradiction fracture field
  ├─ Candidate-route generator
  └─ Dominant-route resolver
  ↓
LandscapeState
  ↓
ConvictionAtlasScene
```

## Added source

```text
src/engine/landscape/
├── index.ts
├── landscapeEngine.ts
└── types.ts

src/scenes/ConvictionAtlasScene.tsx
src/playground/LandscapePlayground.tsx
src/landscape.css
```

## Development controls

The playground exposes:

- time elapsed,
- risk pressure,
- contradiction pressure,
- candidate route count.

These controls are development-only and exist to evaluate whether terrain and routes respond semantically to intelligence changes.

## Acceptance criteria

- Identical input and seed produce identical terrain and routes.
- Increased risk visibly deepens valleys and weakens candidate routes.
- Increased contradiction visibly destabilizes the field and weakens route weights.
- Older evidence reduces freshness and surface energy.
- A dominant route emerges from the model rather than being hard-coded.
- Alternative routes remain visible enough to communicate probability rather than certainty.
- The Evidence Gate prototype and Intelligence Playground remain accessible as archive/development modes.

## Next milestone

- animated interpolation between landscape states,
- living intelligence threads entering and carving the field,
- contour generation in both axes,
- stronger fracture geometry,
- route merge and split behavior,
- narrative states: Observe, Correlate, Form Thesis, Challenge, Conviction.
