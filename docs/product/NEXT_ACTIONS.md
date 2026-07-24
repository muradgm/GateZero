# Immediate Implementation Actions

The next code changes on this branch should be implemented in this order:

1. Add a canonical runtime status contract under `packages/contracts`.
2. Add a status builder that derives volatile values instead of embedding them in frontend source.
3. Split status generation from status validation.
4. Add gate-neutral root commands while retaining compatibility aliases.
5. Add focused backtest timing tests.
6. Correct fill-adjusted capital and exposure checks.
7. Add `packages/application` and workspace package boundaries.
8. Add Setup Review contracts, fixtures, and invariants.
9. Produce one validated read-only Setup Review projection.
10. Rework the command center around that projection.

Do not add broker, provider, live feed, autonomous execution, or generic AI scoring work before the first complete Setup Review reaches an immutable learning event.
