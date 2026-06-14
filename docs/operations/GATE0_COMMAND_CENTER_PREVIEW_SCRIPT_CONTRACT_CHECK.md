# Gate 0 Command Center Preview Script Contract Check

## Purpose

This record documents contract tests for the local command-center preview script.

## Covered Behavior

- Host remains `127.0.0.1`.
- Default port remains `4173`.
- Alternate local ports can be selected with `--port`.
- Root route maps to `apps/web/index.html`.
- Traversal outside `apps/web` is blocked.

## Boundary

The preview script remains a local QA convenience. It is not public deployment, external hosting,
authentication, broker integration, execution support, prediction, approval, or readiness authority.

## Source Links

- Source packet: `ops/assignments/TRD-202_COMMAND_CENTER_PREVIEW_SCRIPT_CONTRACT_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-202_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-202_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-202_ORCHESTRATOR_ACCEPTANCE.md`
- Preview script: `scripts/preview-web.ts`
- Tests: `packages/fixtures/tests/gate0-command-center-preview-script.test.ts`
- Tracker: `ops/runtime/tracklist.md`
