# Gate 0 CI Evidence Refresh Helper

## Purpose

This record documents the local helper for refreshing Gate 0 remote CI evidence after a pushed
verification run succeeds.

The helper reduces manual markdown edits while keeping the evidence refresh explicit and reviewable.

## Command

```bash
pnpm refresh:gate0-ci-evidence -- --run 27785795555 --packet TRD-258 --after TRD-257 --record docs/operations/GATE0_REMOTE_CI_EVIDENCE_REFRESH_AFTER_TRD257_PUSH.md
```

## Behavior

| Area       | Control                                                                  |
| ---------- | ------------------------------------------------------------------------ |
| Run source | Reads a specified GitHub Actions run with `gh run view`.                 |
| Workflow   | Requires `Gate 0 Verification`.                                          |
| Event      | Requires `push`.                                                         |
| Status     | Requires `completed`.                                                    |
| Conclusion | Requires `success`.                                                      |
| Evidence   | Writes a local markdown record under `docs/operations/`.                 |
| Index      | Upserts the row in `GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`.        |
| Dashboard  | Refreshes static command-center fallback metadata from the accepted run. |
| Duplicates | Blocks recording the same run id under a different packet.               |

## Boundary

This helper records repository verification evidence only. It does not authorize deployment, broker
access, execution, AI prediction, strategy approval, strategy readiness, profitability claims,
marketing claims, public release claims, or risk-gate movement.

## Validation

- `pnpm test -- packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts`
- `pnpm check:gate0-ci-evidence`
- `pnpm check:gate0-command-center`
- `pnpm verify:gate0`

## Source Links

- Source packet: `ops/assignments/TRD-258_GATE0_CI_EVIDENCE_REFRESH_AUTOMATION.md`
- Reviews: `ops/runtime/reviews/TRD-258_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-258_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-258_ORCHESTRATOR_ACCEPTANCE.md`
- Helper: `scripts/refresh-gate0-ci-evidence.ts`
- Helper tests: `packages/fixtures/tests/gate0-ci-evidence-refresh.test.ts`
- Evidence index: `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Tracker: `ops/runtime/tracklist.md`
