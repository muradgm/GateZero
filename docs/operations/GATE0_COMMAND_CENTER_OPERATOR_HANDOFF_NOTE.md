# Gate 0 Command Center Operator Handoff Note

## Purpose

This note explains how to use the local command center without expanding its authority.

## Use

Start a local preview:

```powershell
pnpm preview:web
```

Open:

```text
http://127.0.0.1:4173/
```

Verify before trusting the displayed evidence:

```powershell
pnpm verify:gate0
```

## Meaning

The command center shows Gate 0 operating health, local evidence freshness, remote CI evidence,
review coverage, risk boundaries, and source links.

## Not Meaning

The command center must not be used as:

- Strategy approval.
- Readiness approval.
- Profitability evidence.
- Execution approval.
- Broker integration status.
- Public release approval.
- Risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-207_COMMAND_CENTER_OPERATOR_HANDOFF_NOTE.md`
- Reviews: `ops/runtime/reviews/TRD-207_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-207_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-207_ORCHESTRATOR_ACCEPTANCE.md`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
