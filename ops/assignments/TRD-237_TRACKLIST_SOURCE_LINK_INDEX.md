# TRD-237 Tracklist Source-Link Index

## Goal

Clean up the tracklist source-of-truth link section so it remains unique, scannable, and compatible
with the new duplicate-link guard.

## Allowed Scope

- Dedupe repeated source-link paths.
- Keep canonical references to guard scripts and command sources.
- Document the index cleanup.
- Update tracker, docs index, command-center references, and artifact map.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No removal of required evidence references.
- No source link hiding to make a guard pass.
- No live trading, broker integration, paper order mechanics, autonomous execution, AI prediction,
  broker API key handling, strategy approval, readiness semantics, profitability claims, marketing
  claims, or risk-gate loosening.

## Required Outputs

- Updated `ops/runtime/tracklist.md`.
- `docs/operations/GATE0_TRACKLIST_SOURCE_LINK_INDEX.md`.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Source-of-truth links contain no duplicate indexed paths.
- Required command, guard, docs, and review references remain present.
- Gate remains `G0_RESEARCH` and scope remains `research_only`.

## Next Agent

QA_SECURITY review, then RISK review, then ORCHESTRATOR acceptance.
