# Gate 0 Command Center Local Runtime Snapshot

## Purpose

This record documents the local runtime snapshot used by the command center preview server.

The snapshot is generated from local repository records only. It does not call GitHub, brokers,
market-data services, AI services, or any external account system from the browser.

## Runtime Snapshot

| Field         | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| Builder       | `scripts/build-command-center-runtime-data.ts`                      |
| Preview route | `/runtime/command-center-data.json`                                 |
| Data sources  | `ops/runtime/tracklist.md`, review records, evidence index          |
| Test          | `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts` |
| Scope         | Local preview server only                                           |

## Boundary

This snapshot does not add deployment, broker access, execution pathways, AI prediction, strategy
approval, readiness claims, profitability claims, report publishing, external polling, credential
handling, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-245_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md`
- Reviews: `ops/runtime/reviews/TRD-245_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-245_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-245_ORCHESTRATOR_ACCEPTANCE.md`
- Runtime builder: `scripts/build-command-center-runtime-data.ts`
- Preview server: `scripts/preview-web.ts`
- Runtime tests: `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- Tracker: `ops/runtime/tracklist.md`
