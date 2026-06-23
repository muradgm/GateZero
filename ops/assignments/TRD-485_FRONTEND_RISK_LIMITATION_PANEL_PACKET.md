# TRD-485 Frontend Risk Limitation Panel Packet

## Goal

Draft the bounded implementation packet for read-only risk and limitation panels.

## Scope

- Gate: `G2_PAPER_TRADING`.
- Scope: `paper_simulation_planning_only`.
- Work type: implementation packet only.

## Required Outputs

- Risk and limitation panel packet.
- QA/security, risk, and orchestrator review records.
- Tracker and guard coverage updates.

## Acceptance Criteria

- Risk and limitation copy remains adjacent to evidence.
- No approval, readiness, safety, profitability, or performance-claim wording.
- No risk-gate loosening or execution authority.
- `pnpm verify:gate0` passes.

## Source Links

- Report: `docs/operations/GATE2_FRONTEND_RISK_LIMITATION_PANEL_PACKET.md`
- Tracklist: `ops/runtime/tracklist.md`
