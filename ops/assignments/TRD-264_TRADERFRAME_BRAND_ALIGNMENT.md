# TRD-264 TraderFrame Brand Alignment

## Goal

Align current product-facing surfaces to `TraderFrame` while preserving `GateZero` as the internal
gate/control-plane codename.

## Allowed Scope

- Update package metadata, README, product docs, command center, tracklist, and project-name guard.
- Add an operations record documenting the naming rule.
- Update local tests that enforce the naming rule.

## Blocked Scope

- Broker integration.
- Paper or live execution.
- Autonomous execution.
- AI buy/sell prediction.
- Strategy approval, readiness, promotion, or profitability claims.
- Credentials, account identifiers, or external publishing.
- Risk-gate loosening.

## Required Outputs

- `docs/operations/GATE0_TRADERFRAME_BRAND_ALIGNMENT.md`
- Updated `scripts/check-gate0-project-name.ts`
- Updated `packages/fixtures/tests/gate0-project-name-check.test.ts`
- Updated command-center product-name surfaces.
- Updated tracklist project field.

## Acceptance Criteria

- Product-facing current surfaces use `TraderFrame`.
- `GateZero` remains allowed for internal gate/control-plane vocabulary.
- The older spelling without the second `r` is rejected by the project-name guard.
- Gate status remains `G0_RESEARCH` and scope remains `research_only`.
- Local verification passes.

## Risk Gates

- Naming changes must not imply a gate promotion.
- Validation success must mean repository verification only, not strategy approval.
- Command center must remain read-only.

## Next Packet

`TRD-265 Gate 1 Operating Gate Model Activation`.
