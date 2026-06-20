# TRD-334 Gate 1 Skill Guard Naming Recheck

## Goal

Recheck project skill guard naming so metadata and evals stay aligned to Gate 1.

## Scope

- Reject stale Gate 0 phase snippets in skill metadata.
- Preserve explicit skill invocation.
- Keep project skills Gate 1-aware.

## Blocked

- No implicit invocation.
- No stale `G0_RESEARCH` or `research_only` active-phase examples.

## Acceptance

- Skill governance tests cover stale metadata snippets.
- `pnpm check:gate0-skills` passes.
