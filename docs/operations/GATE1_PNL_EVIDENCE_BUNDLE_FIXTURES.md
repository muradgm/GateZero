# Gate 1 PnL Evidence Bundle Fixtures

## Purpose

Record reusable synthetic PnL evidence bundle fixtures.

## Fixtures

- `gate1PnlEvidenceReferenceFixture`
- `gate1PnlEvidenceBundleFixture`

## Validation

The fixtures parse through `Gate1PnlEvidenceReferenceContractSchema` and
`Gate1PnlEvidenceBundleContractSchema`.

## Boundary

The bundle is a local schema-only fixture. It is not market evidence, strategy approval, report
publication, or execution permission.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-280_PNL_EVIDENCE_BUNDLE_FIXTURES.md`
- Reviews: `ops/runtime/reviews/TRD-280_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-280_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-280_ORCHESTRATOR_ACCEPTANCE.md`
