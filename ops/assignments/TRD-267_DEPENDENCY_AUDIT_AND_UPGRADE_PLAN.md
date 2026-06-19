# TRD-267 Dependency Audit And Upgrade Plan

## Goal

Audit current dependency risk and define the bounded upgrade packet.

## Allowed Scope

- Run `pnpm audit --audit-level moderate`.
- Record audit findings.
- Define the next dependency upgrade packet.
- Update tracker and command-center metadata.

## Blocked Scope

- Unreviewed dependency upgrades.
- Product behavior changes.
- Broker integration or execution paths.
- AI prediction.
- Strategy approval or performance claims.
- Risk-gate loosening.

## Acceptance Criteria

- Audit findings are recorded.
- Critical/high tooling findings are not ignored.
- Next packet is dependency upgrade execution.
- Full local verification still passes.

## Next Packet

`TRD-268 Dependency Upgrade Execution`.
