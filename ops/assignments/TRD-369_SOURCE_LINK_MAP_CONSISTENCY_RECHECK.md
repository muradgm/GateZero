# TRD-369 Source-Link Map Consistency Recheck

## Goal

Recheck consistency between docs, tracklist, artifact map, and command-center indexes.

## Scope

- Confirm new operating docs are indexed and source-linked.
- Confirm no duplicate source-link drift is introduced.
- Keep the recheck local and deterministic.

## Blocked

- No new product capability.
- No external publishing.
- No provider, broker, execution, or credential path.

## Acceptance

- Source-link map consistency recheck exists.
- Source-link duplicate guard passes.
- `pnpm verify:gate0` passes.
