import { createGate2ManualReviewAuthoringRecord } from "../../core/src/index.js";
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
