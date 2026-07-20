# TraderFrame Experience Principles

## Purpose

This document is the constitution of the TraderFrame Experience Engine. Every scene, animation, shader, interaction, camera move, material, and sound must follow these rules.

## 1. Philosophy

TraderFrame visualizes how a market thesis forms under uncertainty. The experience must make reasoning more understandable without implying certainty, guaranteed prediction, autonomous execution, or market-beating performance.

## 2. Visual grammar

- Intelligence flows as structured threads, fields, contours, and routes.
- Probability emerges through persistence, elevation, clarity, width, and convergence.
- Risk reshapes the field through compression, valleys, fractures, drag, and route loss.
- Contradiction remains visible and creates branching, tension, or deformation.
- Context stays neutral and supports interpretation without competing for attention.
- The recommended route is dominant, never absolute.

## 3. Motion grammar

- Motion communicates state change.
- Agreement merges.
- Conflict splits.
- Confidence stabilizes.
- Uncertainty drifts or oscillates within strict limits.
- Expired intelligence fades and loses influence.
- Risk slows, compresses, redirects, or collapses.
- Conviction resolves gradually.
- Nothing rotates, floats, pulses, or glows without semantic meaning.

## 4. Intelligence grammar

Each intelligence signal carries:

- source
- category
- direction
- confidence
- freshness
- importance
- contradiction
- risk impact
- route weight

Signals may merge when direction and context agree. Signals must remain separate when their assumptions conflict. Time decay reduces influence before removing visibility.

## 5. Spatial grammar

- Height represents weighted probability, not certainty.
- Width represents accumulated support.
- Fractures represent contradiction or invalidation.
- Valleys represent risk or weak evidence.
- Flow speed represents urgency or information arrival, not confidence.
- Route persistence represents stability over time.

## 6. Material grammar

Preferred materials:

- smoked glass
- matte obsidian
- polished graphite
- optical acrylic
- liquid light

Avoid chrome-heavy science fiction, decorative holograms, and generic glowing machinery.

## 7. Camera grammar

- The camera observes before it interprets.
- Camera movement reveals relationships and state changes.
- Risk moments reduce camera movement.
- Conviction uses slow, controlled approach.
- The interface transformation preserves spatial continuity.
- No idle orbit camera.

## 8. Interaction grammar

- Interaction exposes reasoning rather than triggering spectacle.
- The user may inspect evidence, challenge a thesis, compare routes, and reveal invalidation.
- User actions must not imply that clicking creates market certainty.
- Keyboard and reduced-motion alternatives are mandatory.

## 9. Audio grammar

- Audio is optional and user initiated.
- Agreement produces subtle harmonic convergence.
- Contradiction introduces tension, not alarm.
- Risk reduces density and creates restraint.
- Conviction resolves quietly.
- No cinematic trailer music or constant ambient noise.

## 10. Performance rules

- Build mobile and integrated-GPU quality tiers from the first prototype.
- Prefer deterministic geometry and instancing.
- Avoid high-cost transparency stacks.
- Pause simulation when hidden.
- Cap device pixel ratio.
- Provide a non-WebGL fallback.

## 11. Accessibility rules

- Support `prefers-reduced-motion`.
- Keep all meaning available in text.
- Do not encode state by colour alone.
- Preserve keyboard navigation and visible focus.
- Do not autoplay audio.

## 12. Things we never do

- Generic particles with no meaning.
- Floating cubes as market data.
- Decorative rotation.
- Random camera movement.
- Mechanical gates as the main metaphor.
- Glowing objects without semantic purpose.
- Dashboard overlays disconnected from the landscape.
- Visual certainty.
- Hidden contradictory evidence.
- Animation that does not explain a state change.

## Evaluation question

Every element must answer:

> What does this tell the trader about the quality of this decision?
