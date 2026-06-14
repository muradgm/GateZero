# TRD-194: Command Center Accessibility Baseline

## Objective

Add a small accessibility baseline for the static command center.

## Scope

Allowed:

- Add landmarks, skip navigation, focus styles, and table semantics.
- Record keyboard and readability expectations.

Blocked:

- External services, user accounts, execution workflows, prediction, strategy claims, approval
  semantics, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_COMMAND_CENTER_ACCESSIBILITY_BASELINE.md`
- Updated static app markup and styles.

## Acceptance Criteria

- Main content has a skip target.
- Primary sections are addressable.
- Evidence table has a nonvisual caption.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
