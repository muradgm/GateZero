# Gate 0 Command Center Accessibility Baseline

## Purpose

This record defines the first accessibility baseline for the static command center.

## Baseline Controls

- A skip link targets the main command-center workspace.
- Primary navigation has an explicit accessible label.
- Main content is addressable through a stable `main` landmark.
- Major dashboard panels use labelled sections.
- The evidence table includes a nonvisual caption.
- Keyboard focus has a visible outline.

## Boundary

Accessibility improvements may improve operator trust and usability. They do not create execution,
prediction, strategy selection, approval, readiness, or external data authority.

## Required Validation

- `pnpm verify:gate0`
- Keyboard smoke check in local preview.

## Source Links

- Source packet: `ops/assignments/TRD-194_COMMAND_CENTER_ACCESSIBILITY_BASELINE.md`
- Reviews: `ops/runtime/reviews/TRD-194_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-194_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-194_ORCHESTRATOR_ACCEPTANCE.md`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
