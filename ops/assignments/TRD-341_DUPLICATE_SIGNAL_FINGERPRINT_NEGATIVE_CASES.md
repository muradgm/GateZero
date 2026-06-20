# TRD-341 Duplicate Signal Fingerprint Negative Cases

## Goal

Add negative cases for weak duplicate signal fingerprint evidence.

## Scope

- Reject repeated duplicate signal IDs.
- Reject empty signal fingerprints.
- Keep duplicate signals blocked from evidence use.

## Blocked

- No signal approval.
- No action recommendation or execution path.

## Acceptance

- Contract tests reject weak duplicate evidence.
- Full verification passes.
