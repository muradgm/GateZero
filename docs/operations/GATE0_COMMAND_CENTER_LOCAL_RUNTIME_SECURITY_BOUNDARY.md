# Gate 0 Command Center Local Runtime Security Boundary

## Purpose

This record documents the security boundary for the local command-center runtime endpoint:

```text
/runtime/command-center-data.json
```

The endpoint exists only to refresh the local GateZero command center from repository operating
records during local preview. It is control-plane evidence for the operator, not a trading surface.

Accepted validation after this packet is `70 test files, 348 tests passed`.

## Local Boundary

| Area          | Boundary                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| Host posture  | Preview server listens on `127.0.0.1`.                                   |
| Route         | Runtime data is served only at `/runtime/command-center-data.json`.      |
| Payload       | Payload is built from local tracker, review, and evidence-index records. |
| Validation    | Payload is parsed by `CommandCenterRuntimeDataSchema` before serving.    |
| Cache posture | Runtime response uses `Cache-Control: no-store`.                         |
| Failure mode  | Runtime build failure returns bounded JSON: `runtime_data_unavailable`.  |

## Security Controls

- The preview server does not connect to brokers, accounts, exchanges, or external market feeds.
- The runtime endpoint does not read environment variables, secrets, broker keys, or account
  identifiers.
- Static file serving is constrained to the local web root and rejects traversal paths.
- The endpoint reports repository verification state only; it does not evaluate strategy quality.
- CI success and local test success remain repository evidence only, not approval to trade.

## Blocked Interpretations

Do not treat the command center, runtime endpoint, local validation, or CI status as:

- strategy approval
- trading readiness
- performance evidence
- profitability evidence
- deployment authorization
- paper-trading authorization
- live-execution authorization
- broker-connectivity authorization

## Validation

- `pnpm check:gate0-command-center`
- `pnpm check:gate0-docs-coverage`
- `pnpm check:gate0-tracklist`
- `pnpm check:gate0-reviews`
- `pnpm verify:gate0`

## Source Links

- Source packet: `ops/assignments/TRD-257_COMMAND_CENTER_LOCAL_RUNTIME_SECURITY_BOUNDARY.md`
- Reviews: `ops/runtime/reviews/TRD-257_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-257_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-257_ORCHESTRATOR_ACCEPTANCE.md`
- Preview server: `scripts/preview-web.ts`
- Runtime builder: `scripts/build-command-center-runtime-data.ts`
- Runtime schema: `packages/contracts/src/command-center-runtime-data.ts`
- Endpoint contract: `docs/operations/GATE0_COMMAND_CENTER_RUNTIME_ENDPOINT_RESPONSE_CONTRACT.md`
- Tracker: `ops/runtime/tracklist.md`
