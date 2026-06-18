# Gate 0 Command Center Runtime Schema Contract

## Purpose

This record documents the local command-center runtime data schema added for TRD-255.

The schema validates the JSON payload produced by the local runtime data builder before the preview
server can return it through `/runtime/command-center-data.json`.

Accepted validation after this packet is `70 test files, 347 tests passed`.

## Contract Coverage

| Area                  | Control                                                                  |
| --------------------- | ------------------------------------------------------------------------ |
| Packet identity       | Requires `latestPacket` to use the `TRD-NNN` shape.                      |
| Local verification    | Requires `N files / N tests` formatting.                                 |
| Remote CI evidence    | Requires numeric run id, success state, and commit hash shape.           |
| Accepted-record count | Requires accepted records to be positive and not lag latest packet.      |
| Runtime boundary      | Defines local-only, non-executing boundary fields for review checks.     |
| Builder integration   | Parses generated runtime payloads with `CommandCenterRuntimeDataSchema`. |

## Boundary

This contract does not add live external fetching, deployment authorization, broker access,
execution pathways, AI prediction, strategy approval, readiness claims, profitability claims, report
publishing, or risk-gate movement.

## Validation

- `pnpm test -- packages/contracts/tests/command-center-runtime-data.test.ts packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- `pnpm check:gate0-command-center`
- `pnpm verify:gate0`

## Source Links

- Source packet: `ops/assignments/TRD-255_COMMAND_CENTER_RUNTIME_SCHEMA_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-255_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-255_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-255_ORCHESTRATOR_ACCEPTANCE.md`
- Runtime schema: `packages/contracts/src/command-center-runtime-data.ts`
- Runtime builder: `scripts/build-command-center-runtime-data.ts`
- Runtime tests: `packages/contracts/tests/command-center-runtime-data.test.ts`,
  `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- Tracker: `ops/runtime/tracklist.md`
