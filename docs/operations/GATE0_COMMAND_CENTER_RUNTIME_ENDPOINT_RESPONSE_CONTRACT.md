# Gate 0 Command Center Runtime Endpoint Response Contract

## Purpose

This record documents the response-level contract test added for the local preview server route
`/runtime/command-center-data.json`.

The test verifies the local preview server can return schema-valid command-center runtime data
without adding external access, broker access, execution behavior, or trading authority.

Accepted validation after this packet is `70 test files, 348 tests passed`.

## Contract Coverage

| Area          | Control                                                         |
| ------------- | --------------------------------------------------------------- |
| Local route   | Starts the preview server on `127.0.0.1` with a local port.     |
| Status        | Requires HTTP `200` for the runtime data route.                 |
| Content type  | Requires `application/json; charset=utf-8`.                     |
| Cache policy  | Requires `Cache-Control: no-store`.                             |
| Payload shape | Parses the response body with `CommandCenterRuntimeDataSchema`. |

## Boundary

This contract does not add live external fetching, deployment authorization, broker access,
execution pathways, AI prediction, strategy approval, readiness claims, profitability claims, report
publishing, or risk-gate movement.

## Validation

- `pnpm test -- packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- `pnpm check:gate0-command-center`
- `pnpm verify:gate0`

## Source Links

- Source packet: `ops/assignments/TRD-256_COMMAND_CENTER_RUNTIME_ENDPOINT_RESPONSE_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-256_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-256_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-256_ORCHESTRATOR_ACCEPTANCE.md`
- Preview test: `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- Preview server: `scripts/preview-web.ts`
- Runtime schema: `packages/contracts/src/command-center-runtime-data.ts`
- Tracker: `ops/runtime/tracklist.md`
