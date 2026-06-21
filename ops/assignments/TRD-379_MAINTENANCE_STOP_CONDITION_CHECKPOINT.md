# TRD-379 Maintenance Stop-Condition Checkpoint

## Goal

Define when the Gate 1 maintenance queue should pause again.

## Scope

- Define stop conditions for maintenance-only queues.
- Require material gaps before continuing repetitive maintenance.
- Keep next-phase work behind a separate assessment packet.

## Blocked

- No Gate 2 authorization.
- No provider, broker, credential, execution, or autonomy work.

## Acceptance

- Stop-condition checkpoint exists.
- Queue continuation criteria are explicit.
- `pnpm verify:gate0` passes.
