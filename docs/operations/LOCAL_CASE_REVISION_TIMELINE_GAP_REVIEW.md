# Local Case Revision Timeline Gap Review

## Finding

At TRD-736, validated revision lineage was available through the local inspection CLI, while the
workspace showed only the latest revision identity and blocked status.

The operator could not inspect changed fields, revision reason, timestamp, evidence references,
limitations, or content hashes without leaving the workspace.

## Bounded Response

The workspace may display validated revision summaries produced from checked-in local artifacts.
Every timeline must:

- represent empty revision history explicitly
- preserve contiguous parent order
- show changed fields and revision reason
- keep evidence, risk review, and limitations adjacent
- show unverified, blocked, and operator-review-required state
- remain local and read-only
- fail closed when lineage data is unavailable or invalid

The gap does not justify editing, verification, approval, promotion, upload, external storage, or
execution controls.
