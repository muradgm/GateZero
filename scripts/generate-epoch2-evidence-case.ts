import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildDecisionTimeEvidenceView,
  buildEvidenceDependencyGraph,
  buildEvidenceRevisionHistory,
  compareEvidenceRevisions,
  createEvidenceIntelligenceCheckpoint,
  createEvidenceIntelligenceRecord,
  inspectEvidenceQuality
} from "../packages/application/src/index.js";

const common = {
  evidenceId: "eurusd-market-context",
  evidenceType: "MARKET_DATA" as const,
  producerRuleId: "historical-adapter",
  producerVersion: "1.0.0",
  observedAt: "2026-07-24T12:00:00.000Z",
  availableAt: "2026-07-24T12:00:01.000Z",
  validUntil: "2026-07-24T14:00:00.000Z",
  verifiedAt: "2026-07-24T12:05:00.000Z",
  dependsOnVersionIds: [],
  contradictsVersionIds: [],
  redactionStatus: "NONE" as const
};
const first = createEvidenceIntelligenceRecord({
  ...common,
  evidenceVersionId: "eurusd-market-context-v1",
  revision: 1,
  sourceIds: ["local-eurusd-csv"],
  contentHash: "sha256:epoch2-market-v1",
  limitations: ["Local historical snapshot only."]
});
const second = createEvidenceIntelligenceRecord({
  ...common,
  evidenceVersionId: "eurusd-market-context-v2",
  revision: 2,
  previousVersionId: first.evidenceVersionId,
  sourceIds: ["local-eurusd-csv", "local-verification-log"],
  contentHash: "sha256:epoch2-market-v2",
  limitations: ["Local historical snapshot only.", "Second-pass provenance verification applied."]
});
const challenge = createEvidenceIntelligenceRecord({
  evidenceId: "eurusd-event-challenge",
  evidenceVersionId: "eurusd-event-challenge-v1",
  revision: 1,
  evidenceType: "STRATEGY_RULE",
  producerRuleId: "event-risk-review",
  producerVersion: "1.0.0",
  sourceIds: ["local-event-context"],
  observedAt: "2026-07-24T12:10:00.000Z",
  availableAt: "2026-07-24T12:10:01.000Z",
  validUntil: "2026-07-24T14:00:00.000Z",
  verifiedAt: "2026-07-24T12:12:00.000Z",
  dependsOnVersionIds: [second.evidenceVersionId],
  contradictsVersionIds: [second.evidenceVersionId],
  contentHash: "sha256:epoch2-event-challenge",
  limitations: ["Event impact direction is not predicted."],
  redactionStatus: "NONE"
});
const records = [first, second, challenge];
const graph = buildEvidenceDependencyGraph({
  graphId: "epoch2-evidence-graph",
  records,
  generatedAt: "2026-07-24T16:00:00.000Z"
});
const view = buildDecisionTimeEvidenceView({
  viewId: "epoch2-decision-view",
  graph,
  records,
  decisionTimestamp: "2026-07-24T13:00:00.000Z"
});
const inspection = inspectEvidenceQuality({
  inspectionId: "epoch2-quality-inspection",
  graph,
  view,
  records,
  inspectedAt: "2026-07-24T16:05:00.000Z"
});
const history = buildEvidenceRevisionHistory({
  historyId: "epoch2-market-context-history",
  records: [first, second],
  generatedAt: "2026-07-24T16:06:00.000Z"
});
const comparison = compareEvidenceRevisions({
  comparisonId: "epoch2-market-context-comparison",
  from: first,
  to: second,
  comparedAt: "2026-07-24T16:07:00.000Z"
});
const checkpoint = createEvidenceIntelligenceCheckpoint({
  checkpointId: "epoch2-evidence-checkpoint",
  graph,
  view,
  inspection,
  revisionHistories: [history],
  checkedAt: "2026-07-24T16:10:00.000Z"
});
const output = {
  dataMode: "LOCAL_EVIDENCE_INTELLIGENCE_FIXTURE",
  records,
  graph,
  view,
  inspection,
  history,
  comparison,
  checkpoint,
  limitations: [
    "One local EURUSD evidence chain only.",
    "Integrity PASS does not resolve contradictions or authorize simulation."
  ]
};
const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "epoch2-evidence-case.json"),
  `${JSON.stringify(output, null, 2)}\n`
);
