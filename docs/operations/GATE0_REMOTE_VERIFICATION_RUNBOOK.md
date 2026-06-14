# Gate 0 Remote Verification Runbook

## Purpose

This runbook documents read-only GitHub Actions verification checks for GateZero.

Remote CI success is repository-quality evidence only. It is not deployment approval, strategy
approval, risk approval, execution readiness, profitability evidence, or gate advancement.

## Commands

List recent runs:

```powershell
gh run list --repo muradgm/GateZero --limit 5
```

Inspect a run:

```powershell
gh run view <run-id> --repo muradgm/GateZero --json databaseId,headSha,conclusion,status,event,workflowName,createdAt,updatedAt,url
```

Watch a run:

```powershell
gh run watch <run-id> --repo muradgm/GateZero --exit-status
```

## Evidence Fields

Capture workflow name, run id, event, status, conclusion, commit SHA, timestamps, and URL when
writing CI evidence records.

## Boundary

Do not use these commands to authorize deployment, broker access, execution, AI prediction, strategy
readiness, profitability claims, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-181_GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- Reviews: `ops/runtime/reviews/TRD-181_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-181_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-181_ORCHESTRATOR_ACCEPTANCE.md`
- CI workflow: `.github/workflows/gate0-verify.yml`
- Tracker: `ops/runtime/tracklist.md`
