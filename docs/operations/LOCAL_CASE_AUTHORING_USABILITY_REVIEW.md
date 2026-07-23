# Local Case Authoring Usability Review

## Scope

TRD-717 reviewed the checked-in CLI workflow as an engineering walkthrough. It was not an operator
user study and makes no usability-performance claim.

## Walkthrough

| Step    | Observed behavior                                                        | Friction |
| ------- | ------------------------------------------------------------------------ | -------- |
| Create  | `scaffold:local-case` creates one bounded JSON draft.                    | Low      |
| Inspect | Existing intake diagnostics identify accepted and rejected files.        | Low      |
| Correct | Evidence and limitation changes previously required direct JSON editing. | Material |
| Catalog | Snapshot generation exposes accepted cases but had no revision lineage.  | Material |

## Decision

The observed correction gap justifies a bounded immutable revision command. It does not justify a
general editor, form, upload surface, or external storage.

New drafts and revisions must remain unverified and blocked until explicit operator review occurs.
Original artifacts must remain immutable.
