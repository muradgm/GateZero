# TRD-622 Duplicate And Stale Candidate Guards

Status: accepted

## Goal

Block repeated or expired local simulation candidates before evidence recording.

## Acceptance

- Fingerprint reuse produces a duplicate block.
- Negative or excessive age produces a stale block.
- Clear status cannot coexist with blocking reasons.
