# TRD-167: Format Check Control Plane Coverage

## Objective

Ensure `pnpm format:check` covers the documentation and operations control plane.

## Scope

Allowed:

- Update the root format check command to include `docs/**/*.{md,json}` and `ops/**/*.{md,json}`.
- Document the added coverage.

Blocked:

- Product expansion, external services, execution paths, strategy claims, or risk gate changes.

## Required Output

- Updated `package.json`
- `docs/operations/GATE0_FORMAT_CHECK_CONTROL_PLANE_COVERAGE.md`

## Acceptance Criteria

- Format check includes docs and ops Markdown/JSON surfaces.
- Formatting remains passing.
- Gate 0 verification remains passing.

## Source Links

- Command source: `package.json`
- Current tracker: `ops/runtime/tracklist.md`
