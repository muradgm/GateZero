import {
  createGate2ManualReviewAuthoringRecord,
  inspectGate2ManualReviewHistory
} from "../../core/src/index.js";
import {
  gate2BriefManualRiskReviewFixture,
  gate2BriefOperatorDecisionFixture
} from "./gate2-intelligence-brief-workflow-fixtures.js";
import { gate2ReadOnlyIntelligenceBriefFixture } from "./gate2-read-only-intelligence-brief-fixtures.js";

export const gate2ManualReviewAuthoringRecordFixture = createGate2ManualReviewAuthoringRecord({
  authoringRecordId: "manual-review-authoring-record-001",
  linkedResearchCaseId: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
  briefId: gate2ReadOnlyIntelligenceBriefFixture.brief_id,
  briefContentSha256: gate2ReadOnlyIntelligenceBriefFixture.content_sha256,
  riskReview: gate2BriefManualRiskReviewFixture,
  operatorDecision: gate2BriefOperatorDecisionFixture,
  revision: 1,
  createdAt: "2026-07-24T00:00:00.000Z",
  updatedAt: "2026-07-24T00:00:00.000Z"
});

export const gate2ManualReviewAuthoringRecordRevision2Fixture =
  createGate2ManualReviewAuthoringRecord({
    authoringRecordId: "manual-review-authoring-record-002",
    linkedResearchCaseId: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
    briefId: gate2ReadOnlyIntelligenceBriefFixture.brief_id,
    briefContentSha256: gate2ReadOnlyIntelligenceBriefFixture.content_sha256,
    riskReview: {
      ...gate2BriefManualRiskReviewFixture,
      risk_review_id: "manual-risk-review-002",
      disposition: "blocked",
      findings: ["The event blocker remains unresolved after the manual local review."],
      reviewed_at: "2026-07-24T01:00:00.000Z"
    },
    operatorDecision: {
      ...gate2BriefOperatorDecisionFixture,
      operator_decision_id: "manual-operator-decision-002",
      risk_review_id: "manual-risk-review-002",
      decision: "reject",
      reason: "Rejected until fresh evidence removes the unresolved event blocker.",
      evidence_refs: [gate2ReadOnlyIntelligenceBriefFixture.brief_id, "manual-risk-review-002"],
      decided_at: "2026-07-24T01:00:00.000Z"
    },
    revision: 2,
    createdAt: "2026-07-24T00:00:00.000Z",
    updatedAt: "2026-07-24T01:00:00.000Z"
  });

export const gate2ManualReviewHistoryFixture = inspectGate2ManualReviewHistory({
  historyId: "manual-review-history-001",
  linkedResearchCaseId: gate2ReadOnlyIntelligenceBriefFixture.linked_research_case_id,
  briefId: gate2ReadOnlyIntelligenceBriefFixture.brief_id,
  briefContentSha256: gate2ReadOnlyIntelligenceBriefFixture.content_sha256,
  records: [
    gate2ManualReviewAuthoringRecordFixture,
    gate2ManualReviewAuthoringRecordRevision2Fixture
  ],
  inspectedAt: "2026-07-24T01:05:00.000Z"
});
