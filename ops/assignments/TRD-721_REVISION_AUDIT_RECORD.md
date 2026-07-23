# TRD-721 Revision Audit Record

Status: accepted

## Goal

Preserved revision number, parent identity, changed fields, reason, timestamp, and before/after
content hashes.

## Boundary

Local provenance only. No external logging or mutable audit history.

## Acceptance

Broken parent chains and content-hash mismatches fail closed.
