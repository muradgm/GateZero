# TRD-386 Gate 2 Blocker Inventory

## Goal

Inventory blockers that must be resolved before any Gate 2 planning can be authorized.

## Scope

- List risk, autonomy, credential, execution, provider, and evidence blockers.
- Keep the inventory assessment-only.
- Require future authorization for each blocked area.

## Blocked

- No broker or paper execution implementation.
- No credential handling.
- No Gate 2 movement.

## Acceptance

- Blocker inventory exists.
- Blockers are not treated as permission.
- `pnpm verify:gate0` passes.
