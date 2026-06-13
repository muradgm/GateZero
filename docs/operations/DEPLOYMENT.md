# Deployment

## Purpose

This document defines deployment discipline for GateZero.

## Phase 0 Deployment Posture

Phase 0 should run locally or in a private development environment.

Recommended:

- Docker Compose for local services
- no public live deployment unless internal token boundary is enabled
- no broker credentials
- no live trading capability

## Environment Separation

Required environments:

- `local`
- `test`
- `private-dev`

Future environments:

- `paper`
- `live-supervised`

No `live-supervised` environment may exist until Risk + QA + human approval gates are passed.

## Deployment Gates

Before deployment:

- build passes
- tests pass
- typecheck passes
- lint passes
- env vars documented
- no secrets in repo
- risk gates unchanged or explicitly reviewed
- no hidden broker integration

## Future Execution Deployment Rule

Any deployment that can affect paper or live orders must require:

- explicit version tag
- rollback plan
- health checks
- kill switch verification
- audit-log verification
- Risk approval
- QA approval
