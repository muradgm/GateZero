# TRD-749 Local Source Adapter Boundary

Status: accepted

## Goal

Define and enforce a deterministic local replay source envelope.

## Outputs

- Canonical repository-source schema.
- Replay-only source envelope.
- Real-path containment, regular-file, tracked-file, and SHA-256 guard.
- Negative tests for URL, absolute, traversal, encoded traversal, and untracked paths.

## Blocked Scope

No providers, network calls, scraping, polling, credentials, external storage, or vendor selection.

## Acceptance

Every fixture source is canonical, local, present, regular, tracked, hash-verified, credential-free,
and network-disabled.

## Next Agent

MARKET_DATA and BACKEND implement TRD-750 after QA_SECURITY review.
