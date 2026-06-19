# Gate 1 Stable CI Test Command

## Purpose

This record adds a stable test command for CI and acceptance verification.

## Command

```powershell
pnpm test:ci
```

`pnpm test:ci` runs Vitest with:

```text
--no-file-parallelism --maxWorkers=1
```

This keeps test execution deterministic for CI and operating evidence. It does not change product
scope, trading capability, risk gates, or command-center behavior.

## Boundary

The command is local validation only. Passing tests do not approve strategies, imply readiness,
authorize paper trading, authorize live trading, or create execution authority.

## Source Links

- Source packet: `ops/assignments/TRD-266_STABLE_CI_TEST_COMMAND.md`
- QA/security review: `ops/runtime/reviews/TRD-266_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-266_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-266_ORCHESTRATOR_ACCEPTANCE.md`
- Package scripts: `package.json`
- Root README: `README.md`
- Tracklist: `ops/runtime/tracklist.md`
