# Milestone 1 Plan — Source-of-Truth Consolidation

## Outcome

One accurate, generated, gate-aware current status shared by scripts, documentation, and the command
center.

## Work packages

### 1. Canonical runtime status contract

Create a typed contract containing:

- product name;
- current operating gate and scope;
- current initiative and milestone;
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

### 3. Generation and validation split

Use separate commands:

```text
status:generate
status:check
validate
verify
```

`status:check`, `validate`, and `verify` must not rewrite status artifacts.

### 4. Compatibility migration

Keep existing Gate 0 command names as temporary aliases. Mark them as compatibility paths and remove
them only after scripts, CI, documentation, and operator runbooks have migrated.

### 5. Tracklist separation

Keep the historical tracklist intact for audit. Stop using it as the active roadmap. The product
roadmap and release status under `docs/product` become the human-facing current state.

## Tests

- Runtime status contract accepts valid generated state.
- Gate or scope disagreement fails.
- Stale or mismatched commit metadata fails.
- Missing evidence fields fail.
- Validation does not change tracked files.
- Frontend reads generated status rather than duplicated constants.

## Exit criteria

- Root README, release status, generated runtime status, and frontend show the same gate and scope.
- Running verification on a clean checkout leaves the checkout clean.
- Volatile status metadata has one authoritative generation path.
- Historical packet records remain accessible but are not required to understand the next product
  milestone.
