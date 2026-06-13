# TRD-174 QA_SECURITY Review

## Decision

`approved`

## Scope Checked

- Agent manifest drift guard.
- Required agent file checks.
- Local reference resolution checks.
- Focused guard tests.

## Findings

- Guard operates on local repo metadata only.
- Guard detects manifest/folder mismatch, missing required files, invalid eval JSON, stale project
  name references, and unresolved local references.
- No agent autonomy, external execution, broker access, or credential handling is introduced.

## Required Validation

- `pnpm check:gate0-agents`
- `pnpm verify:gate0`

## Gate

`G0_RESEARCH`
