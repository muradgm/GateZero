# TraderFrame — Conviction Atlas

## Project Brief, Current Status, and Handover

**Repository:** `muradgm/GateZero`  
**Active implementation branch:** `codex/traderframe-production-implementation`  
**Primary local entry point:** `apps/web/traderframe.html`  
**Local preview URL:** `http://127.0.0.1:4173/traderframe.html`  
**Document purpose:** provide a complete project handoff for design, engineering, QA, and future implementation work.

---

# 1. Executive Summary

TraderFrame Conviction Atlas is a premium market-decision interface for turning fragmented trading evidence into an explainable, risk-aware thesis.

The product is designed around one central idea:

> Multiple market signals should not be shown as disconnected dashboards. They should converge into one visible decision landscape where evidence, opportunity, risk, competing scenarios, and the recommended path can be inspected together.

The approved product direction is a dark, cinematic intelligence interface centered on an interactive 3D topographic market landscape.

The intended product experience is:

```text
Evidence enters
→ relationships form
→ scenarios emerge
→ contradictions and risk challenge the thesis
→ one route earns conviction
→ the user decides whether to execute
```

The implementation currently contains a working production-oriented shell, an interactive scenario model, a Three.js terrain renderer, explainability tools, responsive fallbacks, and runtime QA scaffolding.

It is not yet visually approved against the final concept reference.

The core engineering architecture is credible. The remaining gap is mainly art direction, rendering quality, visual hierarchy, and final browser validation.

---

# 2. Product Positioning

## Product name

**TraderFrame**

## Experience name

**Conviction Atlas**

## Category

Private trading decision intelligence.

## Product promise

TraderFrame transforms fragmented market evidence into one explainable, risk-aware decision.

## Strategic wedge

Most trading tools provide charts, indicators, feeds, alerts, or automated signals.

TraderFrame should differentiate through **decision synthesis**:

- preserve evidence provenance;
- expose competing scenarios;
- show why a thesis exists;
- show what contradicts it;
- make risk visible before execution;
- maintain user control;
- generate a reviewable decision path rather than an unexplained output.

## Product principles

1. **Evidence first**  
   Every conclusion should be traceable to its source inputs.

2. **Transparent reasoning**  
   The interface should explain why a thesis exists, not only state the conclusion.

3. **User controlled**  
   Recommendations are decision support, not autonomous execution.

4. **Risk aware**  
   No trade is considered good when the risk conditions are wrong.

---

# 3. Final Experience Vision

The final concept is a dark, cinematic, high-density interface with three primary areas.

## Left rail — Brand and operating principles

Contains:

- TraderFrame wordmark;
- Conviction Atlas title;
- product positioning statement;
- Evidence First;
- Transparent Reasoning;
- You Stay in Control;
- Risk Aware.

## Center — The Market Landscape

The hero experience should show:

- nine evidence channels entering from the left;
- a visible evidence-convergence core;
- a three-dimensional topographic terrain;
- Bull, Sideways, Bear, and Recommended regions;
- scenario beacons anchored into terrain;
- a continuous recommended route;
- selected and inactive scenario paths;
- terrain-embedded risk basins;
- animated particles;
- controlled camera parallax;
- regional contour illumination;
- reduced-motion and static fallbacks.

## Right rail — Decision summary

Contains:

- current thesis;
- bias and confidence;
- key positive and negative drivers;
- risk score;
- position-sizing guidance;
- recommendation;
- timeframe;
- invalidation level.

## Lower sections

### Decision Journey

Six stages:

1. Observe
2. Correlate
3. Form Thesis
4. Challenge
5. Conviction
6. Execute

### Decision Trace

An explainability layer that shows:

- current stage;
- evidence state;
- challenge pressure;
- active scenario;
- active lens;
- decision contract;
- risk effect on recommendation;
- user-control guarantees.

---

# 4. Approved Visual Direction

The selected intelligence-language formula is:

```text
Conviction Topography
+ Decision Lenses for control
+ Scenario Braids for comparison motion
+ Signal Rivers for evidence inflow
```

## Core metaphor

**Conviction Topography**

Market states are represented as terrain:

- confidence becomes elevation;
- uncertainty becomes branching paths;
- contradictions become pressure or deformation;
- risk becomes hazardous basins;
- evidence becomes incoming rivers;
- the recommendation becomes the illuminated route.

## Decision lenses

The interface currently supports:

- Evidence
- Opportunity
- Risk
- Conviction

Each lens changes the visible hierarchy without changing the underlying scenario state.

## Color language

- Evidence / Bull: cyan
- Sideways: electric blue
- Bear / caution: orange
- Recommended / conviction: violet-white
- Risk: red
- Base terrain: near-black navy

## Material language

- obsidian;
- graphite;
- glass;
- acrylic;
- restrained liquid light.

The final result should feel premium, technical, cinematic, and controlled—not game-like, glossy, pastel, or decorative.

---

# 5. Current Technical Architecture

## Entry page

```text
apps/web/traderframe.html
```

This page loads the TraderFrame experience and its supporting modules.

## Primary experience shell

```text
apps/web/src/traderframe-experience.js
apps/web/src/traderframe-experience.css
apps/web/src/traderframe-experience-data.js
```

Responsibilities:

- page structure;
- scenario cards and state;
- evidence records;
- right-side thesis summary;
- decision journey shell;
- keyboard behavior;
- responsive base layout.

## 2D renderer and safe fallback

```text
apps/web/src/conviction-atlas-engine.js
```

Responsibilities:

- non-WebGL landscape rendering;
- static and reduced-mode support;
- safe fallback when Three.js or WebGL fails.

## Three.js renderer

```text
apps/web/src/conviction-atlas-3d-engine.js
apps/web/src/conviction-atlas-3d.css
```

Current responsibilities:

- procedural terrain generation;
- custom terrain shader;
- minor and major topographic contours;
- regional topology color;
- terrain-following scenario routes;
- animated route nodes;
- evidence streams and particles;
- convergence core and rings;
- scenario beacons;
- risk zones;
- camera parallax;
- fog and exposure control;
- active-scenario emphasis.

## Intelligence-language controls

```text
apps/web/src/conviction-atlas-language.js
apps/web/src/conviction-atlas-language.css
```

Responsibilities:

- Evidence lens;
- Opportunity lens;
- Risk lens;
- Conviction lens;
- semantic control state;
- lens-specific visual hierarchy.

## Decision trace

```text
apps/web/src/conviction-atlas-decision-trace.js
apps/web/src/conviction-atlas-decision-trace.css
```

Responsibilities:

- six-stage explainability system;
- active-stage detail;
- scenario-aware reasoning copy;
- lens-aware context;
- keyboard navigation;
- decision-contract display.

## Production readiness

```text
apps/web/src/conviction-atlas-production-readiness.js
apps/web/src/conviction-atlas-production-readiness.css
```

Responsibilities:

- Full mode;
- Reduced mode;
- Static mode;
- reduced-motion handling;
- low-power detection;
- renderer downgrade logic;
- fallback selection;
- tab visibility pause and resume;
- renderer-status messaging.

## Runtime QA

```text
apps/web/src/conviction-atlas-qa.js
apps/web/src/conviction-atlas-qa.css
docs/conviction-atlas-release-validation.md
```

Responsibilities:

- structural runtime checks;
- visible QA status;
- expected scenario, lens, trace, and fallback counts;
- future browser-automation hooks;
- manual release checklist.

## Journey-state visuals

```text
apps/web/src/conviction-atlas-cinematic-polish.js
apps/web/src/conviction-atlas-cinematic-polish.css
```

Current journey mini-scenes are DOM/CSS-based and remain provisional.

---

# 6. Functional State Model

## Scenarios

The current implementation supports:

| ID | Scenario | Probability | Base risk | Bias |
|---|---|---:|---:|---|
| `bull` | Bull case | 28% | 24 | Bullish |
| `side` | Sideways | 18% | 31 | Neutral |
| `bear` | Bear case | 22% | 67 | Bearish |
| `rec` | Recommended path | 62% | 38 | Moderately Bullish |

## Scenario behavior

Selecting a scenario should update:

- selected route emphasis;
- terrain regional emphasis;
- selected beacon;
- right-side thesis state;
- risk score;
- recommendation;
- decision-trace context;
- accessibility live-region message.

## Route hierarchy

Expected hierarchy:

### Selected non-recommended scenario

- selected route: full emphasis;
- recommended route: visible comparison reference;
- other routes: subdued.

### Recommended scenario selected

- recommended route: dominant;
- alternatives: low-contrast references.

## Lenses

The four lenses change information emphasis:

### Evidence

Shows provenance, agreement, contradiction, and incoming evidence flow.

### Opportunity

Emphasizes upside regions and supportive conditions.

### Risk

Emphasizes hazards, invalidation, fragile assumptions, and risk basins.

### Conviction

Emphasizes surviving routes and decision confidence.

---

# 7. Completed Milestones

## Milestone 1 — Production shell

- dedicated TraderFrame experience page;
- core layout;
- scenario selection;
- decision rail;
- evidence inputs;
- responsive styling.

## Milestone 2 — Evidence-state integration

- structured evidence contract;
- accepted and total counts;
- source, challenge, and risk weights;
- keyboard navigation;
- ARIA and live updates.

## Milestone 3 — Intelligence-language R&D

- Signal Rivers;
- Conviction Topography;
- Evidence Constellation;
- Decision Lenses;
- Scenario Braids;
- shared evaluation framework.

## Milestone 4 — Selected language integration

- topography retained as core;
- four lenses added;
- signal inflow added;
- scenario-braid behavior added selectively.

## Milestone 5 — Decision Trace

- six-stage explainability system;
- scenario-aware and lens-aware reasoning;
- keyboard stage navigation;
- decision contract.

## Milestone 6 — Production readiness

- Full, Reduced, and Static modes;
- low-power handling;
- reduced-motion support;
- safe fallback;
- visibility pause and resume.

## Milestone 7 — Runtime QA

- structural runtime checks;
- visible QA panel;
- release-validation checklist.

## Milestone 8 — Initial WebGL terrain

- Three.js renderer;
- procedural terrain;
- routes, beacons, risk zones, evidence streams;
- automatic fallback.

## Milestones 9–11 — Visual parity experiments

- terrain scale;
- camera changes;
- regional lighting;
- journey cards;
- CSS parity overlays.

These passes improved understanding but introduced visual-layer debt.

## Milestone 12 — Unified 3D reconstruction

- removed most CSS hero overlays;
- moved hero visual responsibility into Three.js;
- unified terrain, routes, beacons, risk, convergence, and regional effects.

## Milestones 13–16 — Shader and art-direction correction

- terrain framing changes;
- darker surface;
- emissive topology concept;
- regional contour color;
- deeper channels and risk craters;
- stronger convergence and beacon systems.

## Milestone 17 — Controlled luminance recovery

Latest implemented phase:

- removed excessive CSS darkening;
- increased controlled shader exposure;
- restored minor and major contour visibility;
- improved regional topology visibility;
- strengthened convergence;
- strengthened inactive recommended-route visibility;
- improved beacons and risk rings.

Latest relevant commits:

```text
d6766f1 style: recover controlled Conviction Atlas luminance
5d983f0 feat: recover controlled Conviction Atlas topology luminance
```

---

# 8. Current Status

## Overall status

```text
Functional interactive prototype
+ credible production architecture
+ real Three.js scene
+ incomplete visual parity
+ not release approved
```

## What works

- TraderFrame page loads as a dedicated experience;
- scenarios are selectable;
- thesis and risk states update;
- Evidence, Opportunity, Risk, and Conviction lenses work;
- Decision Journey is present;
- Decision Trace is interactive;
- Full, Reduced, and Static modes exist;
- safe 2D fallback exists;
- reduced-motion behavior exists;
- Three.js terrain initializes;
- evidence streams animate;
- terrain routes animate;
- scenario beacons exist;
- risk regions exist;
- runtime QA scaffolding exists;
- responsive styles exist.

## What is not approved

- final terrain art direction;
- final contour brightness and density;
- final regional balance;
- final route hierarchy;
- final convergence treatment;
- final risk-basin drama;
- final camera composition;
- final journey-card imagery;
- mobile visual parity;
- deterministic screenshot QA;
- final performance validation;
- production bundle strategy for Three.js;
- final asset pipeline;
- accessibility audit evidence;
- release approval.

## Honest current assessment

The product currently proves the interaction model and rendering architecture.

It does not yet reproduce the concept reference at the required premium visual quality.

The latest screenshot before Milestone 17 showed the scene becoming too dark. Milestone 17 was created to recover topology and landmark luminance without returning to a bright, pastel terrain surface.

Milestone 17 has been committed but still requires local browser and screenshot review.

---

# 9. Main Visual Gap Against the Concept

The concept reference has:

- a near-black terrain body;
- dense fine contours;
- strong but selective regional light;
- a bright evidence-convergence event;
- clear scenario destinations;
- a continuous violet-white recommended route;
- obvious red risk basins;
- strong atmospheric depth;
- premium journey-state imagery.

The implementation has repeatedly oscillated between two failure states:

## Failure state A — Too bright

- pastel cyan-violet terrain;
- printed-map appearance;
- inflated landforms;
- routes disappear into surface color.

## Failure state B — Too dark

- topology disappears;
- inactive regions disappear;
- convergence becomes invisible;
- hero lacks density.

## Required balance

The correct target is:

```text
near-black surface
+ visible fine topology
+ bright major contours
+ localized regional emission
+ continuous route hierarchy
+ strong convergence and risk landmarks
```

The terrain body should not be the primary light source.

The information should provide the light.

---

# 10. Known Technical and Design Debt

## Three.js loaded from CDN

Current renderer import:

```js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm";
```

This is acceptable for prototyping but should be replaced by a pinned local dependency and production bundle before release.

## Procedural terrain is code-authored

The current terrain is generated from:

- Gaussian landforms;
- warped ridge functions;
- channels;
- local peaks;
- risk depressions.

It is flexible, but final art direction may require:

- a height-map authoring workflow;
- Blender-generated terrain;
- a deterministic baked mesh;
- or a hybrid of authored geometry and procedural displacement.

## No production post-processing stack

There is no final EffectComposer pipeline for:

- selective bloom;
- depth-based haze;
- color grading;
- local glow isolation;
- anti-aliasing beyond renderer defaults.

## No true scene-derived journey thumbnails

The Decision Journey images are currently CSS diagrams.

They should eventually become:

- dedicated miniature Three.js scenes;
- pre-rendered images from the hero scene;
- or baked motion stills generated from deterministic scene states.

## Runtime QA is structural, not visual

The QA harness validates presence and structure.

It does not prove:

- visual parity;
- frame rate;
- shader correctness;
- browser compatibility;
- route visibility;
- color contrast;
- layout stability.

## No final automated screenshot comparison

A proper visual release process should include:

- fixed viewport screenshots;
- concept-reference comparison;
- visual-diff thresholds;
- desktop, tablet, and mobile snapshots;
- Full, Reduced, and Static modes;
- all four scenario states;
- all four lens states.

---

# 11. Recommended Next Phase

## Milestone 18 — Browser Validation and Visual Calibration

Do not begin another broad redesign immediately.

First validate the latest Milestone 17 result.

### Required checks

1. Pull the latest branch.
2. Run the local preview.
3. Capture screenshots at the reference viewport.
4. Review Recommended and Bear states first.
5. Confirm that:
   - the surface remains dark;
   - contours are visible;
   - inactive regions remain visible;
   - recommended route is continuous;
   - convergence is readable;
   - beacons are readable;
   - risk basins are readable;
   - no CSS filter is crushing shader output.
6. Check browser console.
7. Record frame rate and downgrade behavior.

### Only after screenshot review

Make a single focused calibration pass covering:

- exposure;
- minor contour strength;
- major contour strength;
- regional color radius;
- recommended-route inactive opacity;
- convergence size;
- beacon inactive opacity;
- risk-ring visibility;
- fog density.

Do not change terrain architecture and presentation filters simultaneously.

Change one layer at a time and compare screenshots.

---

# 12. Recommended Production Roadmap

## Phase 1 — Lock hero art direction

- validate Milestone 17;
- tune shader values;
- lock route hierarchy;
- lock camera;
- lock regional influence;
- lock risk treatment;
- obtain explicit screenshot approval.

## Phase 2 — Scene-derived journey states

- define six deterministic hero states;
- render each state from the same scene system;
- replace CSS placeholders;
- normalize crop, brightness, and density.

## Phase 3 — Production rendering stack

- install Three.js locally;
- remove CDN dependency;
- add deterministic asset loading;
- add selective bloom if justified;
- add performance tiers;
- add shader compile fallback;
- add context-loss handling.

## Phase 4 — Responsive art direction

- desktop composition;
- tablet composition;
- mobile simplification;
- reduced-mode composition;
- static SVG fallback parity.

## Phase 5 — Automated QA

- browser tests;
- scenario and lens interaction tests;
- keyboard tests;
- reduced-motion tests;
- visual snapshots;
- performance budget;
- fallback tests;
- accessibility checks.

## Phase 6 — Product integration

- replace static scenario data with real decision-engine output;
- connect evidence provenance;
- connect real risk and invalidation data;
- connect market-intelligence contracts;
- connect saved decision cases;
- connect paper-simulation flow;
- maintain explainability and user control.

---

# 13. Acceptance Criteria for Visual Approval

The hero should not be declared approved until all of the following are true.

## Terrain

- near-black base surface;
- no pastel slab effect;
- no obvious rectangular platform boundary;
- multiple distinct landforms;
- clear ridges, channels, peaks, and basins;
- fine minor contours;
- selective major contour emission.

## Evidence

- all nine streams visible;
- source labels readable;
- particles clearly converge;
- convergence core is a major visual anchor;
- route network clearly begins after convergence.

## Scenarios

- Bull, Sideways, Bear, and Recommended remain visible;
- active scenario is clearly strongest;
- inactive scenarios remain legible;
- selected route follows terrain;
- recommended route remains visible as comparison;
- beacons feel embedded in terrain.

## Risk

- both risk basins are spatially obvious;
- dark crater centers;
- red topology;
- visible animated cores and rings;
- labels connect to actual basin locations.

## Atmosphere

- foreground, midground, and background separation;
- restrained fog;
- no excessive CSS post-filtering;
- selective glow;
- high contrast without information loss.

## Journey cards

- six unique states;
- same visual language as hero;
- consistent crop and density;
- no generic CSS-placeholder appearance.

## Accessibility

- keyboard controls work;
- selected state is announced;
- reduced motion works;
- static fallback communicates equivalent state;
- DOM text contains all important decision information.

---

# 14. Local Development Instructions

## Pull the implementation branch

```bash
cd ~/Documents/gatezero

git switch codex/traderframe-production-implementation
git pull --ff-only origin codex/traderframe-production-implementation
```

## Run preview

```bash
pnpm preview:web
```

## Open the page

```text
http://127.0.0.1:4173/traderframe.html
```

## Expected renderer states

WebGL success:

```text
WebGL terrain engine
```

Fallback state:

```text
Safe 2D fallback
```

## Important

An existing server may already occupy port `4173`.

When that happens, do not start a second preview process. Open the existing URL and refresh after pulling.

---

# 15. Important Branches

## Main implementation

```text
codex/traderframe-production-implementation
```

This is the current production-oriented TraderFrame branch.

## Current R&D branch

```text
agent/conviction-atlas-rnd-intelligence-v2
```

Contains the five intelligence-language prototype board.

## Older open R&D pull request

An older draft PR exists for:

```text
agent/conviction-atlas-rnd-intelligence
```

It targets an older landscape branch and should not be treated as the current implementation source.

Do not merge it without reviewing divergence and relevance.

---

# 16. Important Commit Sequence

The implementation evolved through many small commits.

Key checkpoints include:

```text
e923088 feat: add TraderFrame production experience shell
ad2dd11 feat: implement TraderFrame evidence-gate interaction shell
f59debb feat: style TraderFrame evidence-gate production shell
84b4b9b feat: add TraderFrame experience data contract
05adfbc feat: connect TraderFrame shell to reviewable evidence state
```

Selected intelligence language and explainability:

```text
d29d110 feat: integrate selected intelligence language
0e99621 feat: add Conviction Atlas decision trace
d185611 feat: add Conviction Atlas production readiness controls
b31754c feat: add Conviction Atlas in-browser QA harness
```

3D implementation and major reconstruction:

```text
97760be feat: add WebGL Conviction Atlas terrain engine
78c820b refactor: unify Conviction Atlas hero in Three.js
24734e6 feat: correct Conviction Atlas 3D art direction
d7c19f2 feat: restore dark emissive Conviction Atlas terrain
6af268c feat: rebuild Conviction Atlas shader around luminous topology
```

Latest recovery pass:

```text
d6766f1 style: recover controlled Conviction Atlas luminance
5d983f0 feat: recover controlled Conviction Atlas topology luminance
```

---

# 17. Files That Should Not Be Reintroduced Into the Live Hero

The following parity-overlay experiment files may remain in history, but their hero-overlay approach should not be restored:

```text
apps/web/src/conviction-atlas-final-parity.js
apps/web/src/conviction-atlas-final-parity.css
```

The hero should remain unified inside Three.js.

CSS should continue to handle:

- layout;
- labels;
- controls;
- panels;
- accessibility;
- responsive framing.

Three.js should handle:

- terrain;
- topology;
- routes;
- convergence;
- beacons;
- risk basins;
- particles;
- regional scene lighting.

---

# 18. Handover Rules for the Next Agent or Team

1. Treat the final concept image as the visual target.
2. Treat the current branch as the engineering source of truth.
3. Do not claim parity without screenshot evidence.
4. Do not add more CSS hero overlays.
5. Do not change shader, camera, geometry, and CSS filters in the same pass.
6. Use small measured calibration changes.
7. Preserve 2D and static fallbacks.
8. Preserve DOM-based decision information.
9. Preserve reduced-motion handling.
10. Preserve scenario and lens state contracts.
11. Do not merge older R&D branches blindly.
12. Do not claim tests or performance results without running them.
13. Replace CDN Three.js before production release.
14. Keep secrets out of tracked files.
15. Do not bypass GitHub Push Protection.

---

# 19. Current Release Verdict

## Functional verdict

**Strong prototype**

The interaction architecture, state model, fallback strategy, and explainability direction are credible.

## Visual verdict

**Not approved**

The latest luminance recovery still requires screenshot review.

## Production verdict

**Not release ready**

Missing:

- final visual approval;
- journey-state renders;
- automated browser QA;
- performance evidence;
- accessibility audit evidence;
- local Three.js bundling;
- final data integration;
- release sign-off.

## Recommended project state label

```text
Production-oriented interactive prototype
— visual calibration in progress
```

---

# 20. Immediate Handover Task

The next person taking over should perform exactly this sequence:

```text
1. Pull the latest implementation branch.
2. Open traderframe.html at the reference viewport.
3. Capture Recommended and Bear screenshots.
4. Compare against the final concept.
5. Check contour, route, beacon, convergence, and risk visibility.
6. Check the browser console.
7. Record issues without changing code.
8. Make one focused luminance-calibration pass.
9. Capture the same screenshots again.
10. Request explicit visual approval before continuing.
```

Do not begin journey-card rebuilding or product-data integration until the hero visual direction is stable.

---

# 21. Final Handover Statement

TraderFrame Conviction Atlas has moved beyond a static visual mockup and now exists as an interactive, stateful, fallback-aware Three.js product prototype.

The project has a clear product wedge, coherent interaction model, explainability layer, and credible technical foundation.

The remaining work is not another conceptual redesign.

The remaining work is disciplined execution:

- calibrate the hero visual system;
- lock the rendering language;
- replace journey placeholders;
- validate responsiveness and accessibility;
- automate QA;
- connect real intelligence data;
- prepare the renderer for production deployment.

The project should be continued from the current implementation branch without reintroducing fragmented overlay experiments.
