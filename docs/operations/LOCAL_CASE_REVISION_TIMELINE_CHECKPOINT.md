# Local Case Revision Timeline Checkpoint

## Outcome

TraderFrame now projects validated immutable revision chains into generated workspace data and
renders them as accessible read-only timelines.

The timeline includes:

- revision identity, number, parent, and timestamp
- changed fields and revision reason
- evidence and provenance references
- linked risk review
- limitation notes
- before and after content hashes
- explicit blocked, unverified, and operator-review-required state

Cases without revisions receive a neutral empty state. Missing timeline data receives a fail-closed
blocked state. Invalid revision chains continue to stop generation.

## Depth Decision

No deeper lineage feature is justified yet. The checked-in workflow contains one revision, so
comparison, branching, restoration, and editing controls would be premature.

## Next Phase

The next bounded lane is Senior Market Intelligence foundation work at Gate 2. It must reuse the
existing market-intelligence truth and contracts, remain read-only, and produce sourced scenarios
rather than buy or sell instructions.
