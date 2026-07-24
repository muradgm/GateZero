# Validation Expectations

This branch must preserve the existing quality suite while improving its semantics.

## Required properties

- Validation commands do not modify tracked files.
- Generation commands are explicit.
- Compatibility aliases remain until CI and documentation migrate.
- Runtime status is schema-validated.
- Gate and scope values are consistent across authoritative surfaces.
- Setup Review transitions are deterministic.
- `PAPER_SIMULATE` cannot bypass evidence, invalidation, risk, exposure, or operator review.
- Frontend projections contain no execution authority.
- Imported or user-authored text is escaped before rendering.

## Required checks before merge

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:ci
pnpm verify:gate0
```

Additional gate-neutral commands will be added during Milestone 1 and will become authoritative after compatibility validation.
