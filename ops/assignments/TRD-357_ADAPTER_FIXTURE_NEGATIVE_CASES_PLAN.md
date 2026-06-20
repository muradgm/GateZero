# TRD-357 Adapter Fixture Negative Cases Plan

## Goal

Plan future negative cases for imported adapter fixture validation.

## Scope

- Identify invalid snapshot fixture classes that future tests should reject.
- Keep all cases as planning records, not executable parser behavior.
- Preserve local-only validation framing.

## Blocked

- No adapter fixture parser.
- No provider data ingestion.
- No executable import command.
- No execution, broker, or credential path.

## Acceptance

- Negative-case plan exists and is source-linked.
- Plan avoids data-provider or execution implementation.
- `pnpm verify:gate0` passes.
