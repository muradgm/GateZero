# Milestone 1 Plan — Source-of-Truth Consolidation

## Outcome

TraderFrame has one accurate, generated, gate-aware current status shared by scripts, documentation,
release status, runtime metadata, and the Command Center.

This slice keeps the project moving from mobile/API access while branch deletion is deferred until
desktop access is available.

## Why this matters

The repository now has substantial historical governance evidence. That history remains useful, but
it should not slow the next product step: the Evidence-Gated Setup Review MVP.

Milestone 1 exists to make the current product state obvious and hard to accidentally regress:

```text
Trading Intelligence Command Center
-> Evidence-Gated Setup Review MVP
-> REJECT | WATCH | PAPER_SIMULATE
```

## Current source of truth

`main` remains the active source of truth for product direction.

The current operating boundary is:

```text
Operating gate: G2_PAPER_TRADING
Scope: paper_simulation_planning_only
Authority: read-only decision support and manual operator review
Execution authority: none
```

## Work packages

### 1. Canonical runtime status contract

Create a typed contract containing:

- product name;
- internal control plane name;
- current operating gate and scope;
- product mode;
- current initiative and milestone;
- allowed operator outcomes;
- latest accepted evidence identifier;
- local test file and test counts;
- last verified commit;
- latest CI run and status;
- review coverage;
- generation timestamp;
- explicit capability and boundary lists.

### 2. Runtime status builder

Build the status from authoritative repository sources. Do not edit volatile counts directly into
frontend source.

The builder should generate a runtime artifact that the Command Center can consume without manually
duplicating status values.

### 3. Generation and validation split

Use separate command concepts:

```text
status:generate
status:check
validate
verify
```

`status:check`, `validate`, and `verify` must not rewrite status artifacts.

Commands that intentionally rewrite generated artifacts must say so in their name.

### 4. Compatibility migration

Keep existing Gate 0 command names as temporary aliases. Mark them as compatibility paths and remove
them only after scripts, CI, documentation, and operator runbooks have migrated.

### 5. Tracklist separation

Keep the historical tracklist intact for audit. Stop using it as the active roadmap. The product
roadmap and release status under `docs/product` become the human-facing current state.

### 6. Branch cleanup deferral

Branch deletion is deferred until desktop access is available.

Until then:

- do not base new implementation on stale branches;
- treat `main` as the source of truth;
- extract useful code from old branches only after reconciling naming, gate language, and product
  boundaries;
- do not merge branches that still describe the product as `G0_RESEARCH` or use the old
  strategy-only loop.

## Non-goals

- No branch deletion in this mobile-safe slice.
- No broker, exchange, credential, or account integration.
- No live or external paper order routing.
- No autonomous execution.
- No unreviewed AI trade decisions.
- No prediction-confidence or profit language.
- No new market-data provider integration.
- No broad UI redesign.
- No report, share, print, or publishing workflow.

## Tests

- Runtime status contract accepts valid generated state.
- Gate or scope disagreement fails.
- Stale or mismatched commit metadata fails.
- Missing evidence fields fail.
- Validation does not change tracked files.
- Frontend reads generated status rather than duplicated constants.
- Stale gate names or old product-loop language fail when they appear in current-state files.

## Exit criteria

- Root README, release status, generated runtime status, and frontend show the same gate and scope.
- Running verification on a clean checkout leaves the checkout clean.
- Volatile status metadata has one authoritative generation path.
- Historical packet records remain accessible but are not required to understand the next product
  milestone.
- The Evidence-Gated Setup Review MVP can start from `main` without reconciling old Gate 0 product
  language.

## Next slice after M1

Start Milestone 2 — Application Spine.

The first useful implementation target is a small application layer that can assemble one Setup
Review flow from local fixtures without the UI manually constructing protected-loop state.
