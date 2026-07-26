import {
  DecisionTimeEvidenceViewSchema,
  EvidenceDependencyGraphSchema,
  EvidenceIntelligenceRecordSchema,
  EvidenceIntelligenceCheckpointSchema,
  EvidenceQualityInspectionSchema,
  EvidenceRevisionComparisonSchema,
  EvidenceRevisionHistorySchema,
  type DecisionTimeEvidenceView,
  type EvidenceDependencyGraph,
  type EvidenceIntelligenceRecord,
  type EvidenceIntelligenceCheckpoint,
  type EvidenceQualityInspection,
  type EvidenceRevisionComparison,
  type EvidenceRevisionHistory
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export type CreateEvidenceIntelligenceRecordCommand = Omit<
  EvidenceIntelligenceRecord,
  "schemaVersion" | "freshnessStatus" | "recordHash" | "executionPath" | "automatedAction"
>;

export function createEvidenceIntelligenceRecord(
  command: CreateEvidenceIntelligenceRecordCommand
): EvidenceIntelligenceRecord {
  const payload = {
    schemaVersion: 1 as const,
    ...command,
    freshnessStatus:
      command.validUntil && Date.parse(command.verifiedAt) > Date.parse(command.validUntil)
        ? ("STALE" as const)
        : ("CURRENT" as const),
    executionPath: false as const,
    automatedAction: false as const
  };
  return EvidenceIntelligenceRecordSchema.parse({
    ...payload,
    recordHash: hashCanonicalValue(payload)
  });
}

export function createEvidenceIntelligenceCheckpoint(input: {
  readonly checkpointId: string;
  readonly graph: EvidenceDependencyGraph;
  readonly view: DecisionTimeEvidenceView;
  readonly inspection: EvidenceQualityInspection;
  readonly revisionHistories: readonly EvidenceRevisionHistory[];
  readonly checkedAt: string;
}): EvidenceIntelligenceCheckpoint {
  const graph = EvidenceDependencyGraphSchema.parse(input.graph);
  const view = DecisionTimeEvidenceViewSchema.parse(input.view);
  const inspection = EvidenceQualityInspectionSchema.parse(input.inspection);
  const histories = input.revisionHistories.map((history) =>
    EvidenceRevisionHistorySchema.parse(history)
  );
  const reasons: string[] = [];
  if (!hasCanonicalHash(graph, "graphHash")) reasons.push("evidence graph content hash mismatch");
  if (!hasCanonicalHash(view, "viewHash")) reasons.push("decision view content hash mismatch");
  if (!hasCanonicalHash(inspection, "inspectionHash")) {
    reasons.push("evidence inspection content hash mismatch");
  }
  if (histories.some((history) => !hasCanonicalHash(history, "historyHash"))) {
    reasons.push("evidence revision history content hash mismatch");
  }
  if (view.graphHash !== graph.graphHash) reasons.push("decision view graph hash mismatch");
  if (inspection.graphHash !== graph.graphHash) reasons.push("inspection graph hash mismatch");
  if (inspection.decisionViewHash !== view.viewHash) {
    reasons.push("inspection decision-view hash mismatch");
  }
  if (inspection.status === "BLOCKED") reasons.push("blocking evidence findings remain");
  const status = reasons.length === 0 ? "PASS" : "FAIL";
  const payload = {
    schemaVersion: 1 as const,
    checkpointId: input.checkpointId,
    graphHash: graph.graphHash,
    decisionViewHash: view.viewHash,
    inspectionHash: inspection.inspectionHash,
    revisionHistoryHashes: histories.map((history) => history.historyHash).sort(),
    status,
    operatorReviewRequired: inspection.status === "REVIEW_REQUIRED",
    reasons:
      status === "PASS"
        ? [
            inspection.status === "REVIEW_REQUIRED"
              ? "Evidence integrity passed; explicit operator conflict review remains required."
              : "Evidence integrity and quality inspection passed."
          ]
        : reasons,
    checkedAt: input.checkedAt,
    recommendationFinal: false as const,
    executionPath: false as const
  };
  return EvidenceIntelligenceCheckpointSchema.parse({
    ...payload,
    checkpointHash: hashCanonicalValue(payload)
  });
}

export function buildEvidenceRevisionHistory(input: {
  readonly historyId: string;
  readonly records: readonly EvidenceIntelligenceRecord[];
  readonly generatedAt: string;
}): EvidenceRevisionHistory {
  const records = input.records
    .map((record) => EvidenceIntelligenceRecordSchema.parse(record))
    .sort((left, right) => left.revision - right.revision);
  if (records.length === 0) throw new Error("evidence revision history requires records");
  const evidenceId = records[0]!.evidenceId;
  for (let index = 0; index < records.length; index += 1) {
    const current = records[index]!;
    const previous = records[index - 1];
    assertEvidenceRecordHash(current);
    if (current.evidenceId !== evidenceId) {
      throw new Error("evidence revision history cannot mix logical evidence IDs");
    }
    if (current.revision !== index + 1) {
      throw new Error("evidence revision history must be consecutive");
    }
    if (previous && current.previousVersionId !== previous.evidenceVersionId) {
      throw new Error("evidence revision history contains a broken previous-version link");
    }
  }
  const payload = {
    schemaVersion: 1 as const,
    historyId: input.historyId,
    evidenceId,
    versionIds: records.map((record) => record.evidenceVersionId),
    currentVersionId: records.at(-1)!.evidenceVersionId,
    revisionCount: records.length,
    generatedAt: input.generatedAt
  };
  return EvidenceRevisionHistorySchema.parse({
    ...payload,
    historyHash: hashCanonicalValue(payload)
  });
}

export function compareEvidenceRevisions(input: {
  readonly comparisonId: string;
  readonly from: EvidenceIntelligenceRecord;
  readonly to: EvidenceIntelligenceRecord;
  readonly comparedAt: string;
}): EvidenceRevisionComparison {
  const from = EvidenceIntelligenceRecordSchema.parse(input.from);
  const to = EvidenceIntelligenceRecordSchema.parse(input.to);
  assertEvidenceRecordHash(from);
  assertEvidenceRecordHash(to);
  if (from.evidenceId !== to.evidenceId || to.previousVersionId !== from.evidenceVersionId) {
    throw new Error("evidence comparison requires directly linked revisions");
  }
  const ignored = new Set(["recordHash", "revision", "evidenceVersionId", "previousVersionId"]);
  const changedFields = Object.keys(from)
    .filter(
      (key) =>
        !ignored.has(key) &&
        JSON.stringify(from[key as keyof typeof from]) !==
          JSON.stringify(to[key as keyof typeof to])
    )
    .sort();
  const payload = {
    schemaVersion: 1 as const,
    comparisonId: input.comparisonId,
    evidenceId: from.evidenceId,
    fromVersionId: from.evidenceVersionId,
    toVersionId: to.evidenceVersionId,
    changedFields,
    contentChanged: from.contentHash !== to.contentHash,
    provenanceChanged: JSON.stringify(from.sourceIds) !== JSON.stringify(to.sourceIds),
    temporalValidityChanged:
      from.availableAt !== to.availableAt || from.validUntil !== to.validUntil,
    limitationsChanged: JSON.stringify(from.limitations) !== JSON.stringify(to.limitations),
    comparedAt: input.comparedAt
  };
  return EvidenceRevisionComparisonSchema.parse({
    ...payload,
    comparisonHash: hashCanonicalValue(payload)
  });
}

function assertEvidenceRecordHash(record: EvidenceIntelligenceRecord): void {
  const { recordHash, ...payload } = record;
  if (recordHash !== hashCanonicalValue(payload)) {
    throw new Error(`evidence record hash mismatch: ${record.evidenceVersionId}`);
  }
}

export function inspectEvidenceQuality(input: {
  readonly inspectionId: string;
  readonly graph: EvidenceDependencyGraph;
  readonly view: DecisionTimeEvidenceView;
  readonly records: readonly EvidenceIntelligenceRecord[];
  readonly inspectedAt: string;
}): EvidenceQualityInspection {
  const graph = EvidenceDependencyGraphSchema.parse(input.graph);
  const view = DecisionTimeEvidenceViewSchema.parse(input.view);
  const records = input.records.map((record) => EvidenceIntelligenceRecordSchema.parse(record));
  assertGraphAndRecords(graph, records);
  if (!hasCanonicalHash(view, "viewHash")) {
    throw new Error("evidence quality view content hash mismatch");
  }
  if (view.graphHash !== graph.graphHash) {
    throw new Error("evidence quality view does not match the dependency graph");
  }
  const findings: EvidenceQualityInspection["findings"] = [];
  for (const blocked of view.blockedEvidence) {
    findings.push({
      code: blocked.reasons.some((reason) => reason.startsWith("blocked dependencies"))
        ? "DEPENDENCY_BLOCK"
        : "TEMPORAL_BLOCK",
      severity: "BLOCKING",
      evidenceVersionIds: [blocked.evidenceVersionId],
      detail: blocked.reasons.join("; ")
    });
  }
  for (const pair of view.contradictionPairs) {
    findings.push({
      code: "CONTRADICTION",
      severity: "REVIEW",
      evidenceVersionIds: pair,
      detail: "Contradicting evidence requires explicit operator review."
    });
  }
  for (const record of records) {
    if (record.redactionStatus === "REDACTED") {
      findings.push({
        code: "REDACTION",
        severity: "REVIEW",
        evidenceVersionIds: [record.evidenceVersionId],
        detail: "Evidence content is redacted and must be interpreted with that limitation."
      });
    }
    findings.push({
      code: "LIMITATION",
      severity: "INFO",
      evidenceVersionIds: [record.evidenceVersionId],
      detail: record.limitations.join("; ")
    });
  }
  const status = findings.some((finding) => finding.severity === "BLOCKING")
    ? "BLOCKED"
    : findings.some((finding) => finding.severity === "REVIEW")
      ? "REVIEW_REQUIRED"
      : "CLEAR";
  const payload = {
    schemaVersion: 1 as const,
    inspectionId: input.inspectionId,
    graphHash: graph.graphHash,
    decisionViewHash: view.viewHash,
    status,
    findings,
    inspectedAt: input.inspectedAt,
    recommendationFinal: false as const,
    executionPath: false as const
  };
  return EvidenceQualityInspectionSchema.parse({
    ...payload,
    inspectionHash: hashCanonicalValue(payload)
  });
}

export function buildDecisionTimeEvidenceView(input: {
  readonly viewId: string;
  readonly graph: EvidenceDependencyGraph;
  readonly records: readonly EvidenceIntelligenceRecord[];
  readonly decisionTimestamp: string;
}): DecisionTimeEvidenceView {
  const graph = EvidenceDependencyGraphSchema.parse(input.graph);
  const records = input.records.map((record) => EvidenceIntelligenceRecordSchema.parse(record));
  assertGraphAndRecords(graph, records);
  const byId = new Map(records.map((record) => [record.evidenceVersionId, record]));
  const blocked = new Map<string, string[]>();
  const decisionMs = Date.parse(input.decisionTimestamp);

  for (const id of graph.dependencyOrder) {
    const record = byId.get(id);
    if (!record) throw new Error(`decision-time view is missing graph record: ${id}`);
    const reasons: string[] = [];
    if (Date.parse(record.availableAt) > decisionMs) {
      reasons.push("evidence was unavailable at decision time");
    }
    if (record.validUntil && Date.parse(record.validUntil) < decisionMs) {
      reasons.push("evidence was stale at decision time");
    }
    const unavailableDependencies = record.dependsOnVersionIds.filter((dependency) =>
      blocked.has(dependency)
    );
    if (unavailableDependencies.length > 0) {
      reasons.push(`blocked dependencies: ${unavailableDependencies.sort().join(", ")}`);
    }
    if (reasons.length > 0) blocked.set(id, reasons);
  }

  const payload = {
    schemaVersion: 1 as const,
    viewId: input.viewId,
    graphHash: graph.graphHash,
    decisionTimestamp: input.decisionTimestamp,
    usableVersionIds: graph.dependencyOrder.filter((id) => !blocked.has(id)),
    blockedEvidence: [...blocked.entries()].map(([evidenceVersionId, reasons]) => ({
      evidenceVersionId,
      reasons
    })),
    contradictionPairs: graph.contradictionPairs,
    reviewRequired: blocked.size > 0 || graph.contradictionPairs.length > 0,
    executionPath: false as const,
    automatedAction: false as const
  };
  return DecisionTimeEvidenceViewSchema.parse({
    ...payload,
    viewHash: hashCanonicalValue(payload)
  });
}

export function buildEvidenceDependencyGraph(input: {
  readonly graphId: string;
  readonly records: readonly EvidenceIntelligenceRecord[];
  readonly generatedAt: string;
}): EvidenceDependencyGraph {
  const records = input.records.map((record) => EvidenceIntelligenceRecordSchema.parse(record));
  const byId = new Map(records.map((record) => [record.evidenceVersionId, record]));
  if (byId.size !== records.length) throw new Error("evidence graph contains duplicate versions");

  for (const record of records) {
    const { recordHash, ...payload } = record;
    if (recordHash !== hashCanonicalValue(payload)) {
      throw new Error(`evidence record hash mismatch: ${record.evidenceVersionId}`);
    }
    for (const reference of [
      ...record.dependsOnVersionIds,
      ...record.contradictsVersionIds,
      ...(record.previousVersionId ? [record.previousVersionId] : [])
    ]) {
      if (!byId.has(reference)) {
        throw new Error(`evidence reference is missing: ${reference}`);
      }
      if (reference === record.evidenceVersionId) {
        throw new Error("evidence records cannot reference themselves");
      }
    }
  }

  const dependencyOrder = topologicalOrder(records);
  const contradictionPairs = [
    ...new Set(
      records.flatMap((record) =>
        record.contradictsVersionIds.map((other) =>
          [record.evidenceVersionId, other].sort().join("|")
        )
      )
    )
  ]
    .sort()
    .map((pair) => pair.split("|") as [string, string]);
  const payload = {
    schemaVersion: 1 as const,
    graphId: input.graphId,
    evidenceVersionIds: [...byId.keys()].sort(),
    dependencyOrder,
    contradictionPairs,
    generatedAt: input.generatedAt,
    executionPath: false as const,
    automatedAction: false as const
  };
  return EvidenceDependencyGraphSchema.parse({
    ...payload,
    graphHash: hashCanonicalValue(payload)
  });
}

function topologicalOrder(records: readonly EvidenceIntelligenceRecord[]): string[] {
  const byId = new Map(records.map((record) => [record.evidenceVersionId, record]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const order: string[] = [];

  function visit(id: string) {
    if (visiting.has(id)) throw new Error("evidence dependency graph contains a cycle");
    if (visited.has(id)) return;
    visiting.add(id);
    const record = byId.get(id)!;
    for (const dependency of [...record.dependsOnVersionIds].sort()) visit(dependency);
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  for (const id of [...byId.keys()].sort()) visit(id);
  return order;
}

function assertGraphAndRecords(
  graph: EvidenceDependencyGraph,
  records: readonly EvidenceIntelligenceRecord[]
): void {
  if (!hasCanonicalHash(graph, "graphHash")) {
    throw new Error("evidence graph content hash mismatch");
  }
  records.forEach(assertEvidenceRecordHash);
  const graphIds = [...graph.evidenceVersionIds].sort();
  const recordIds = records.map((record) => record.evidenceVersionId).sort();
  if (JSON.stringify(graphIds) !== JSON.stringify(recordIds)) {
    throw new Error("evidence graph records do not match its declared evidence versions");
  }
}

function hasCanonicalHash<T extends Record<string, unknown>, K extends keyof T>(
  value: T,
  hashKey: K
): boolean {
  const payload = Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== String(hashKey))
  );
  return value[hashKey] === hashCanonicalValue(payload);
}
