# Gate 2 Evidence Detail Local Data Adapter Update

TRD: TRD-542

## Implementation

The Command Center data now includes `simulationEvidenceDetail`, a local static record with detail,
workflow, risk, artifact, failure-mode, source-link, reproducibility, limitation, and boundary-check
fields.

## Boundary

The data object is checked in and local. It does not fetch external data or store sensitive
payloads.

## Source Links

- Source packet: `ops/assignments/TRD-542_EVIDENCE_DETAIL_LOCAL_DATA_ADAPTER_UPDATE.md`
- `apps/web/src/command-center-data.js`
- `packages/fixtures/tests/gate0-command-center-data.test.ts`
- `ops/runtime/reviews/TRD-542_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-542_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-542_ORCHESTRATOR_ACCEPTANCE.md`
