# TRD-532 Simulation Evidence Schema Source Update

Status: accepted

## Goal

Add the Gate 2 simulation evidence detail schema to the existing local contract module.

## Scope

- Add a strict local evidence-detail schema.
- Require source artifact, workflow, risk, artifact-summary, failure-mode, and source-link
  references.
- Preserve explicit no-account, no-credential, no-live-route, no-automation, and no-claim literals.

## Blocked Scope

- External account routes, execution paths, stored secrets, market connectivity, and strategy
  approval language.

## Acceptance

Accepted when contract tests and guard checks validate the new schema.
