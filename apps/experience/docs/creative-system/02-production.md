# Layer 2 — Production

Production translates the approved creative system into a performant interactive experience.

## 1. Concept Artist

Creates moodboards, form studies, material studies, environmental compositions, and alternative executions of the approved idea.

**Exit criteria:** one direction is selected with front, side, detail, material, lighting, and motion-reference views.

## 2. Storyboard and Animatic Artist

Defines shots, camera movement, scene transitions, timing, interaction moments, and reduced-motion equivalents.

**Exit criteria:** approved storyboard and low-fidelity animatic with a complete duration map.

## 3. Design System Designer

Defines UI components, typography, spacing, colour tokens, status semantics, responsive behaviour, and overlay rules.

**Exit criteria:** production-ready component specifications and shared tokens.

## 4. 3D Artist

Creates terrain, paths, evidence forms, risk regions, decision markers, materials, UVs, LODs, and GLB exports.

**Exit criteria:** optimized assets with stable naming, pivots, scale, and documented budgets.

## 5. Motion Director and Animator

Defines motion laws and animates terrain formation, evidence weighting, path branching, risk collapse, recommendation emergence, and camera travel.

**Exit criteria:** animation clips and timing data match the approved animatic.

## 6. Shader and VFX Artist

Creates contour shaders, probability fields, directional paths, data-flow effects, risk-zone treatment, atmospheric depth, and restrained post-processing.

**Exit criteria:** effects communicate state and meet performance budgets.

## 7. Creative Technologist

Implements the experience in React Three Fiber, integrates assets and UI, manages state, interaction, responsive behaviour, accessibility, and fallbacks.

**Exit criteria:** feature-complete build with deterministic states and no unsupported product claims.

## 8. QA and Optimization Lead

Tests performance, devices, browsers, accessibility, visual regressions, memory, loading, keyboard operation, reduced motion, and WebGL fallback.

**Exit criteria:** release thresholds pass and known limitations are documented.

## 9. Deployment and Observability Lead

Configures deployment, analytics, error monitoring, performance monitoring, asset caching, and rollback documentation.

**Exit criteria:** production deployment is observable and reversible.

## Production order

```text
Concept art
→ Storyboard and animatic
→ Design system
→ 3D assets
→ Motion and camera
→ Shaders and VFX
→ Implementation
→ QA and optimization
→ Deployment
```

Parallel work is allowed only after dependencies are approved and recorded.