# Conviction Atlas — Implementation Roadmap

This roadmap converts the approved visual operating system into a buildable React Three Fiber experience.

## Milestone 1 — Field prototype

### Goal

Prove that living intelligence threads can generate and reshape a topographic field in real time.

### Deliverables

- procedural terrain grid,
- contour rendering,
- 24–48 living intelligence threads,
- merge, split, fade, and weight behaviours,
- semantic colour states,
- stable 60 FPS desktop target,
- reduced-motion static field.

### Acceptance gate

The scene must already communicate correlation and probability without labels.

## Milestone 2 — Thesis formation

### Goal

Turn intelligence flow into several plausible future routes.

### Deliverables

- terrain displacement driven by evidence weights,
- route generation over the field,
- supporting and contradictory evidence,
- confidence through route clarity and persistence,
- multiple visible outcomes,
- camera transition from Observe to Form Thesis.

### Acceptance gate

No route may look selected before evidence has visibly influenced it.

## Milestone 3 — Challenge and risk

### Goal

Make contradiction and risk materially change the field.

### Deliverables

- fracture system,
- unstable terrain regions,
- risk valleys and heat zones,
- route erosion and collapse,
- volatility turbulence,
- invalidation markers,
- slowed camera and motion at high-risk moments.

### Acceptance gate

Risk must reshape the recommendation rather than appear as a separate warning badge.

## Milestone 4 — Conviction

### Goal

Allow one conditional route to emerge calmly from the field.

### Deliverables

- route-strength resolution,
- gradual violet conviction state,
- retained alternatives,
- visible invalidation route,
- confidence and probability labels derived from the field,
- user-controlled thesis inspection.

### Acceptance gate

The selected route must feel strongest, not certain.

## Milestone 5 — Landscape-to-interface transformation

### Goal

Transform the same 3D system into the TraderFrame workspace.

### Deliverables

- contours flatten into panel boundaries,
- route becomes chart and recommendation line,
- evidence threads become evidence rows,
- risk zones become risk panel data,
- terrain labels become metadata,
- continuous camera alignment,
- no hard cut or unrelated dashboard overlay.

### Acceptance gate

A viewer should be able to trace each interface element back to its landscape origin.

## Milestone 6 — Art direction and authored assets

### Goal

Replace prototype surfaces with final premium materials and authored details.

### Deliverables

- obsidian terrain material,
- smoked-glass uncertainty layers,
- optical acrylic route treatment,
- graphite interface surfaces,
- final lighting rig,
- restrained post-processing,
- authored sound cues.

### Acceptance gate

Material polish must preserve information readability and performance.

## Milestone 7 — Production hardening

### Goal

Ship a reliable experience across devices.

### Deliverables

- adaptive quality tiers,
- mobile choreography,
- keyboard navigation,
- reduced-motion mode,
- WebGL fallback,
- performance telemetry,
- cross-browser testing,
- deployment and monitoring.

## Initial technical architecture

```text
src/
├── config/
│   └── creativeSystem.ts
├── conviction-atlas/
│   ├── field/
│   │   ├── TerrainField.tsx
│   │   ├── ContourLayer.tsx
│   │   └── fieldMath.ts
│   ├── intelligence/
│   │   ├── IntelligenceThread.tsx
│   │   ├── ThreadSystem.tsx
│   │   └── threadSemantics.ts
│   ├── routes/
│   │   ├── ProbabilityRoutes.tsx
│   │   └── routeScoring.ts
│   ├── risk/
│   │   ├── RiskField.tsx
│   │   └── FractureSystem.tsx
│   ├── camera/
│   │   └── AtlasCameraRig.tsx
│   ├── transition/
│   │   └── LandscapeToWorkspace.tsx
│   └── shaders/
│       ├── terrain.glsl.ts
│       ├── contours.glsl.ts
│       └── liquidLight.glsl.ts
└── ui/
    └── TraderFrameWorkspace.tsx
```

## First implementation task

Build a minimal standalone `ConvictionAtlasScene` containing:

1. a deformable terrain plane,
2. contour lines,
3. living intelligence threads,
4. evidence-weighted elevation,
5. six manually selectable narrative states.

Do not begin final UI, Blender assets, or heavy post-processing before this field prototype passes review.
