# TRD-364 Guard Command Doc Alignment Recheck

## Goal

Recheck guard command documentation against the current validation command surface.

## Scope

- Confirm `pnpm check:gate1-contracts` remains documented as local verification only.
- Confirm guard command references do not imply approval or readiness.
- Keep the record documentation-only.

## Blocked

- No new command behavior.
- No execution, broker, provider, credential, or autonomy work.
- No risk-gate loosening.

## Acceptance

- Guard command doc alignment recheck exists.
- Source links and reviews are present.
- `pnpm verify:gate0` passes.
