# Local Case Operator Workflow Checkpoint

## Decision

The checked-in workflow is coherent from scaffold through immutable revision, catalog generation,
CLI inspection, and workspace display.

The next useful product surface is a read-only revision timeline in the workspace. The dry run
showed that latest-revision status is visible, while full lineage still requires the CLI.

## Next Surface Boundary

A future timeline may show:

- revision identity and number
- parent revision
- changed fields
- revision reason
- timestamp
- blocked and operator-review-required state

It must not add editing, verification, approval, promotion, upload, external storage, account,
credential, broker, execution, automation, prediction, or performance-claim capability.

## Editor Decision

UI-assisted editing remains deferred. One operational dry run is evidence for read-only lineage, not
evidence for a general editor.
