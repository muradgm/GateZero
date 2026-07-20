# TraderFrame Experience Engine Architecture

## Objective

Build a reusable visual operating system, not a one-off landing-page animation.

```text
Experience Engine
├─ intelligence
├─ landscape
├─ routes
├─ motion
├─ camera
├─ materials
├─ interface
├─ narrative
├─ audio
└─ performance
```

## Dependency direction

```text
Market evidence
    ↓
Intelligence Engine
    ↓
Landscape + Route Engines
    ↓
Motion + Camera + Material Engines
    ↓
Scenes and product compositions
    ↓
Interface transformation
```

The landscape must be derived from intelligence state. Visual geometry must not invent product meaning independently.

## Engine responsibilities

### Intelligence Engine

Normalizes evidence and calculates semantic state:

- confidence
- freshness
- directional agreement
- contradiction
- priority
- risk impact
- route weight

### Landscape Engine

Converts intelligence state into a spatial field:

- elevation
- valleys
- fractures
- density
- liquidity flow
- volatility deformation

### Route Engine

Produces candidate paths and a conditional recommendation:

- candidate routes
- support score
- contradiction score
- risk-adjusted strength
- persistence
- invalidation

### Motion Engine

Maps semantic transitions to timing and easing. It does not own product logic.

### Camera Engine

Selects authored camera states based on narrative and semantic transitions.

### Material Engine

Owns semantic material presets and device quality tiers.

### Interface Engine

Transforms spatial reasoning into inspectable TraderFrame UI without a visual cut.

### Narrative Engine

Coordinates:

```text
Observe → Correlate → Form Thesis → Challenge → Conviction → Execute
```

### Performance Engine

Selects quality tiers and monitors runtime cost.

## Promotion rule

Experiments begin in `src/playground/`. They move into an engine only after:

1. semantic purpose is documented,
2. reduced-motion behaviour exists,
3. performance cost is measured,
4. the Creative Council approves the behaviour.

## Initial folder target

```text
src/
├─ config/
├─ engine/
│  ├─ intelligence/
│  ├─ landscape/
│  ├─ routes/
│  ├─ motion/
│  ├─ camera/
│  ├─ materials/
│  ├─ interface/
│  ├─ narrative/
│  ├─ audio/
│  └─ performance/
├─ scenes/
├─ playground/
└─ ui/
```
