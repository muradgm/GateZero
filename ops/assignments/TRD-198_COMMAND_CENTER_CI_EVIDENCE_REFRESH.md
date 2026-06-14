# TRD-198: Command Center CI Evidence Refresh

## Objective

Refresh command-center CI evidence after the pushed hardening batch.

## Scope

Allowed:

- Record the latest passing GitHub Actions run.
- Update the static command-center CI run display.
- Update the remote verification evidence index.

Blocked:

- Deployment approval, broker integration, execution, prediction, strategy claims, approval
  semantics, readiness semantics, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_COMMAND_CENTER_CI_EVIDENCE_REFRESH.md`
- Updated `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Updated `apps/web/src/command-center-data.js`

## Acceptance Criteria

- CI evidence is recorded as repository-quality evidence only.
- Gate remains `G0_RESEARCH`.

## Source Links

- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
