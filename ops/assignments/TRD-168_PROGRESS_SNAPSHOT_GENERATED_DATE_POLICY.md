# TRD-168: Progress Snapshot Generated Date Policy

## Objective

Replace the hard-coded progress snapshot date with an explicit generated-date policy.

## Scope

Allowed:

- Add generated date input to the local progress snapshot generator.
- Use `GATEZERO_SNAPSHOT_DATE` or the current ISO date when generating a snapshot.
- Update deterministic tests to pass an explicit date.

Blocked:

- Report publishing, external data access, strategy state changes, approval claims, or gate
  movement.

## Required Output

- Updated `scripts/generate-gate0-progress-snapshot.ts`
- Updated progress snapshot generator tests.
- `docs/operations/GATE0_PROGRESS_SNAPSHOT_GENERATED_DATE_POLICY.md`

## Acceptance Criteria

- Tests can supply a deterministic generated date.
- Local snapshot generation records an explicit date.
- Gate 0 verification remains passing.

## Source Links

- Generator: `scripts/generate-gate0-progress-snapshot.ts`
- Tests: `packages/fixtures/tests/gate0-progress-snapshot-generator.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
