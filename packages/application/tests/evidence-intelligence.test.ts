import { describe, expect, it } from "vitest";
import {
  buildDecisionTimeEvidenceView,
  buildEvidenceDependencyGraph,
  buildEvidenceRevisionHistory,
  compareEvidenceRevisions,
  createEvidenceIntelligenceCheckpoint,
  createEvidenceIntelligenceRecord,
  inspectEvidenceQuality
} from "../src/index.js";

function record(
  id: string,
  overrides: Partial<Parameters<typeof createEvidenceIntelligenceRecord>[0]> = {}
) {
  return createEvidenceIntelligenceRecord({
    evidenceId: id.replace(/-v\d+$/, ""),
    evidenceVersionId: id,
    revision: 1,
    evidenceType: "MARKET_DATA",
    producerRuleId: "historical-adapter",
    producerVersion: "1.0.0",
    sourceIds: ["local-csv"],
    observedAt: "2026-07-24T12:00:00.000Z",
    availableAt: "2026-07-24T12:00:01.000Z",
    validUntil: "2026-07-24T14:00:00.000Z",
    verifiedAt: "2026-07-24T12:05:00.000Z",
    dependsOnVersionIds: [],
    contradictsVersionIds: [],
    contentHash: `sha256:${id}`,
    limitations: ["Local historical evidence only."],
    redactionStatus: "NONE",
    ...overrides
  });
}

describe("evidence intelligence", () => {
  it("creates current and stale records from explicit temporal evidence", () => {
    expect(record("market-v1").freshnessStatus).toBe("CURRENT");
    expect(
      record("market-stale-v1", {
        verifiedAt: "2026-07-24T14:00:01.000Z"
      }).freshnessStatus
    ).toBe("STALE");
  });

  it("rejects evidence available before observation", () => {
    expect(() =>
      record("future-v1", {
        availableAt: "2026-07-24T11:59:59.000Z"
      })
    ).toThrow(/available before/);
  });

  it("requires a previous version for later revisions", () => {
    expect(() =>
      record("market-v2", {
        revision: 2
      })
    ).toThrow(/previous version/);
  });

  it("builds a deterministic dependency order and normalized contradiction pairs", () => {
    const source = record("source-v1");
    const feature = record("feature-v1", {
      evidenceType: "DERIVED_FEATURE",
      dependsOnVersionIds: ["source-v1"]
    });
    const challenge = record("challenge-v1", {
      evidenceType: "STRATEGY_RULE",
      contradictsVersionIds: ["feature-v1"]
    });

    const first = buildEvidenceDependencyGraph({
      graphId: "evidence-graph-001",
      records: [challenge, feature, source],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });
    const second = buildEvidenceDependencyGraph({
      graphId: "evidence-graph-001",
      records: [source, challenge, feature],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });

    expect(first.dependencyOrder.indexOf("source-v1")).toBeLessThan(
      first.dependencyOrder.indexOf("feature-v1")
    );
    expect(first.contradictionPairs).toEqual([["challenge-v1", "feature-v1"]]);
    expect(second).toEqual(first);
  });

  it("rejects tampered records and missing graph references", () => {
    const source = record("source-v1");
    expect(() =>
      buildEvidenceDependencyGraph({
        graphId: "tampered",
        records: [{ ...source, contentHash: "sha256:changed" }],
        generatedAt: "2026-07-24T15:00:00.000Z"
      })
    ).toThrow(/hash mismatch/);

    const missing = record("derived-v1", { dependsOnVersionIds: ["absent-v1"] });
    expect(() =>
      buildEvidenceDependencyGraph({
        graphId: "missing",
        records: [missing],
        generatedAt: "2026-07-24T15:00:00.000Z"
      })
    ).toThrow(/reference is missing/);
  });

  it("rejects dependency cycles", () => {
    const first = record("first-v1", { dependsOnVersionIds: ["second-v1"] });
    const second = record("second-v1", { dependsOnVersionIds: ["first-v1"] });

    expect(() =>
      buildEvidenceDependencyGraph({
        graphId: "cycle",
        records: [first, second],
        generatedAt: "2026-07-24T15:00:00.000Z"
      })
    ).toThrow(/cycle/);
  });

  it("reconstructs the evidence that was usable at decision time", () => {
    const source = record("source-v1");
    const future = record("future-v1", {
      observedAt: "2026-07-24T13:10:00.000Z",
      availableAt: "2026-07-24T13:10:01.000Z",
      verifiedAt: "2026-07-24T13:11:00.000Z"
    });
    const dependent = record("dependent-v1", {
      evidenceType: "DERIVED_FEATURE",
      dependsOnVersionIds: ["future-v1"]
    });
    const graph = buildEvidenceDependencyGraph({
      graphId: "decision-view-graph",
      records: [dependent, source, future],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "decision-view-001",
      graph,
      records: [future, dependent, source],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });

    expect(view.usableVersionIds).toEqual(["source-v1"]);
    expect(view.blockedEvidence).toEqual([
      {
        evidenceVersionId: "future-v1",
        reasons: ["evidence was unavailable at decision time"]
      },
      {
        evidenceVersionId: "dependent-v1",
        reasons: ["blocked dependencies: future-v1"]
      }
    ]);
    expect(view.reviewRequired).toBe(true);
  });

  it("surfaces contradictions without resolving them into a recommendation", () => {
    const source = record("source-v1");
    const challenge = record("challenge-v1", {
      contradictsVersionIds: ["source-v1"]
    });
    const graph = buildEvidenceDependencyGraph({
      graphId: "contradiction-view-graph",
      records: [source, challenge],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "contradiction-view",
      graph,
      records: [source, challenge],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });

    expect(view.contradictionPairs).toEqual([["challenge-v1", "source-v1"]]);
    expect(view.reviewRequired).toBe(true);
    expect(view).not.toHaveProperty("recommendation");
    expect(view).not.toHaveProperty("score");
  });

  it("classifies contradictions and redactions as review concerns without scoring", () => {
    const source = record("source-v1");
    const challenge = record("challenge-v1", {
      contradictsVersionIds: ["source-v1"],
      redactionStatus: "REDACTED"
    });
    const graph = buildEvidenceDependencyGraph({
      graphId: "quality-graph",
      records: [source, challenge],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "quality-view",
      graph,
      records: [source, challenge],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });
    const inspection = inspectEvidenceQuality({
      inspectionId: "quality-inspection",
      graph,
      view,
      records: [source, challenge],
      inspectedAt: "2026-07-24T15:05:00.000Z"
    });

    expect(inspection.status).toBe("REVIEW_REQUIRED");
    expect(inspection.findings.map((finding) => finding.code)).toContain("CONTRADICTION");
    expect(inspection.findings.map((finding) => finding.code)).toContain("REDACTION");
    expect(inspection).not.toHaveProperty("score");
    expect(inspection.recommendationFinal).toBe(false);
  });

  it("classifies unavailable evidence as blocking", () => {
    const future = record("future-v1", {
      observedAt: "2026-07-24T13:10:00.000Z",
      availableAt: "2026-07-24T13:10:01.000Z",
      verifiedAt: "2026-07-24T13:11:00.000Z"
    });
    const graph = buildEvidenceDependencyGraph({
      graphId: "blocked-quality-graph",
      records: [future],
      generatedAt: "2026-07-24T15:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "blocked-quality-view",
      graph,
      records: [future],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });

    expect(
      inspectEvidenceQuality({
        inspectionId: "blocked-quality",
        graph,
        view,
        records: [future],
        inspectedAt: "2026-07-24T15:05:00.000Z"
      }).status
    ).toBe("BLOCKED");
  });

  it("preserves a consecutive revision chain and reports exact changes", () => {
    const first = record("market-v1");
    const second = record("market-v2", {
      evidenceId: "market",
      revision: 2,
      previousVersionId: "market-v1",
      contentHash: "sha256:market-v2-content",
      sourceIds: ["local-csv", "verification-log"],
      limitations: ["Local historical evidence only.", "Second-pass verification applied."]
    });
    const history = buildEvidenceRevisionHistory({
      historyId: "market-history",
      records: [second, first],
      generatedAt: "2026-07-24T16:00:00.000Z"
    });
    const comparison = compareEvidenceRevisions({
      comparisonId: "market-v1-v2",
      from: first,
      to: second,
      comparedAt: "2026-07-24T16:00:00.000Z"
    });

    expect(history.versionIds).toEqual(["market-v1", "market-v2"]);
    expect(history.currentVersionId).toBe("market-v2");
    expect(comparison.contentChanged).toBe(true);
    expect(comparison.provenanceChanged).toBe(true);
    expect(comparison.limitationsChanged).toBe(true);
    expect(comparison.changedFields).toEqual(
      expect.arrayContaining(["contentHash", "limitations", "sourceIds"])
    );
  });

  it("rejects broken or mixed revision histories", () => {
    const first = record("market-v1");
    const broken = record("market-v3", {
      evidenceId: "market",
      revision: 3,
      previousVersionId: "market-v1"
    });
    expect(() =>
      buildEvidenceRevisionHistory({
        historyId: "broken-history",
        records: [first, broken],
        generatedAt: "2026-07-24T16:00:00.000Z"
      })
    ).toThrow(/consecutive/);

    expect(() =>
      buildEvidenceRevisionHistory({
        historyId: "mixed-history",
        records: [first, record("other-v1")],
        generatedAt: "2026-07-24T16:00:00.000Z"
      })
    ).toThrow(/mix/);
  });

  it("passes the integrity checkpoint while preserving required conflict review", () => {
    const source = record("source-v1");
    const challenge = record("challenge-v1", {
      contradictsVersionIds: ["source-v1"]
    });
    const graph = buildEvidenceDependencyGraph({
      graphId: "checkpoint-graph",
      records: [source, challenge],
      generatedAt: "2026-07-24T16:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "checkpoint-view",
      graph,
      records: [source, challenge],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });
    const inspection = inspectEvidenceQuality({
      inspectionId: "checkpoint-inspection",
      graph,
      view,
      records: [source, challenge],
      inspectedAt: "2026-07-24T16:05:00.000Z"
    });
    const checkpoint = createEvidenceIntelligenceCheckpoint({
      checkpointId: "epoch2-checkpoint",
      graph,
      view,
      inspection,
      revisionHistories: [],
      checkedAt: "2026-07-24T16:10:00.000Z"
    });

    expect(checkpoint.status).toBe("PASS");
    expect(checkpoint.operatorReviewRequired).toBe(true);
    expect(checkpoint.recommendationFinal).toBe(false);
    expect(checkpoint.reasons[0]).toContain("conflict review");
  });

  it("fails the checkpoint when linked evidence artifacts retain stale hashes", () => {
    const source = record("source-v1");
    const graph = buildEvidenceDependencyGraph({
      graphId: "tampered-checkpoint-graph",
      records: [source],
      generatedAt: "2026-07-24T16:00:00.000Z"
    });
    const view = buildDecisionTimeEvidenceView({
      viewId: "tampered-checkpoint-view",
      graph,
      records: [source],
      decisionTimestamp: "2026-07-24T13:00:00.000Z"
    });
    const inspection = inspectEvidenceQuality({
      inspectionId: "tampered-checkpoint-inspection",
      graph,
      view,
      records: [source],
      inspectedAt: "2026-07-24T16:05:00.000Z"
    });
    const checkpoint = createEvidenceIntelligenceCheckpoint({
      checkpointId: "tampered-epoch2-checkpoint",
      graph: { ...graph, generatedAt: "2026-07-24T16:00:01.000Z" },
      view,
      inspection: {
        ...inspection,
        findings: inspection.findings.map((finding) => ({
          ...finding,
          detail: `${finding.detail} Altered.`
        }))
      },
      revisionHistories: [],
      checkedAt: "2026-07-24T16:10:00.000Z"
    });

    expect(checkpoint.status).toBe("FAIL");
    expect(checkpoint.reasons).toEqual(
      expect.arrayContaining([
        "evidence graph content hash mismatch",
        "evidence inspection content hash mismatch"
      ])
    );
  });
});
