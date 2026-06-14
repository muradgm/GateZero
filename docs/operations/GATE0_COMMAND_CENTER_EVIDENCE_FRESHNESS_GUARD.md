# Gate 0 Command Center Evidence Freshness Guard

## Purpose

This record documents the guard that prevents command-center evidence from drifting behind the Gate
0 tracker and review records.

## Guard

```powershell
pnpm check:gate0-command-center
```

The guard checks:

- Command-center latest packet against `ops/runtime/tracklist.md`.
- Command-center local validation summary against `ops/runtime/tracklist.md`.
- Command-center review coverage count against accepted ORCHESTRATOR records.

## Integration

The guard is included in:

```powershell
pnpm check:gate0
pnpm verify:gate0
```

## Boundary

The guard checks local static evidence only. It does not fetch external data, assess strategy
quality, create approval semantics, or change risk posture.

## Source Links

- Source packet: `ops/assignments/TRD-197_COMMAND_CENTER_EVIDENCE_FRESHNESS_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-197_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-197_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-197_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-command-center-freshness.ts`
- Tests: `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- Tracker: `ops/runtime/tracklist.md`
