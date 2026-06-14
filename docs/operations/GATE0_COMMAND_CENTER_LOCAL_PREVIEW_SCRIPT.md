# Gate 0 Command Center Local Preview Script

## Purpose

This record documents the repeatable local preview command for the command center.

## Command

```powershell
pnpm preview:web
```

Optional alternate local port:

```powershell
pnpm preview:web -- --port 4175
```

## Behavior

- Serves `apps/web`.
- Binds to `127.0.0.1`.
- Defaults to port `4173`.
- Uses no external service or deployment target.

## Boundary

The preview is an operator convenience for local visual QA. It is not public deployment, execution
support, broker integration, prediction, readiness assessment, or approval authority.

## Source Links

- Source packet: `ops/assignments/TRD-196_COMMAND_CENTER_LOCAL_PREVIEW_SCRIPT.md`
- Reviews: `ops/runtime/reviews/TRD-196_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-196_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-196_ORCHESTRATOR_ACCEPTANCE.md`
- Script: `scripts/preview-web.ts`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
