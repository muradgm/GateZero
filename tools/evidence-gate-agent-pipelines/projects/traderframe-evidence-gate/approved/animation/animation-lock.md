# TraderFrame — Evidence Gate: Animation Approval Package
**Stage:** Animation Lock (Implementation-Ready Motion & Camera Choreography)

---

## 1. System-Wide Motion Principles

To convey **Calm Precision** and **Transparent Reasoning**, the motion design avoids decorative bounces, playful overshoots, or erratic acceleration. Every movement must feel deliberate, structural, and physically grounded.

```
                                  [SCENE 1: UNFILTERED CHAOS]
                                               │
                                               ▼ (Scroll / ScrollTrigger)
                                  [SCENE 2: THE FILTER GATE]
                                               │
                                               ▼ (Scroll / ScrollTrigger)
                               [SCENE 3: THE STRESS-TEST CHAMBER]
                                               │
                                               ▼ (Scroll / ScrollTrigger)
                                  [SCENE 4: THE EVIDENCE GATE]
```

### 1.1 Easing Curves & Timing Scales
*   **The Decelerate Curve (Standard Transition):** `cubic-bezier(0.16, 1, 0.3, 1)` (Ease Out Quint)
    *   *Usage:* Camera translations, node positioning, and UI panel slide-ins. Rapid initial response with a long, smooth deceleration tail to emphasize precision.
*   **The Structural Curve (State Changes):** `cubic-bezier(0.76, 0, 0.24, 1)` (Ease In Out Quantic)
    *   *Usage:* Gate activation, mechanical rotations, and structural transformations. Balanced acceleration and deceleration to suggest heavy, deliberate physical machinery.
*   **The Micro-Interaction Spring:** `damping: 0.85, stiffness: 120, mass: 1.0`
    *   *Usage:* Cursor-driven parallax, hover states on evidence nodes, and data-tip reveals. Highly damped to prevent oscillation.

### 1.2 Spatial Relationships & Depth Budget
*   **Coordinate Space:** Right-handed coordinate system ($+X$ right, $+Y$ up, $+Z$ toward camera).
*   **Near/Far Clipping Planes:** `Near: 0.1`, `Far: 10