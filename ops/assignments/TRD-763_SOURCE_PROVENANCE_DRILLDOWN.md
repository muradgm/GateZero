# TRD-763 Source Provenance Drilldown

Status: accepted

## Goal

Expose local source identity, repository path, freshness, as-of time, payload hash, provenance
status, and limitations.

## Output

- Generated provenance view derived from validated local source envelopes.
- Responsive source cards and hash-safe provenance list.

## Acceptance

- Every displayed source is local and hash-linked.
- No URL, credential, provider call, or external drilldown exists.

## Next

TRD-764 makes cross-timeframe conflict disposition explicit.
