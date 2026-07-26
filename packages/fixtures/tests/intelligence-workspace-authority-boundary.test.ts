import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const runtimePath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "workspace-data.json"
);
const loaderPath = path.join(root, "apps", "intelligence-workspace", "src", "WorkspaceRoot.jsx");
const proofPath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "epoch1-validated-case.json"
);
const evidenceProofPath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "epoch2-evidence-case.json"
);
const riskProofPath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "epoch3-risk-case.json"
);
const learningProofPath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "epoch4-learning-case.json"
);
const learningPanelPath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "src",
  "LearningIntelligencePanel.jsx"
);

describe("intelligence workspace authority boundary", () => {
  it("keeps synthetic workspace assessments explicitly non-canonical", () => {
    const runtime = JSON.parse(readFileSync(runtimePath, "utf8")) as {
      dataMode: string;
      boundary: {
        assessmentAuthority: string;
        recommendationOwner: string;
        executionPath: boolean;
        automatedAction: boolean;
      };
    };

    expect(runtime.dataMode).toBe("SYNTHETIC_DEMO");
    expect(runtime.boundary).toMatchObject({
      assessmentAuthority: "NON_CANONICAL_DEMO",
      recommendationOwner: "CANONICAL_DECISION_ASSESSMENT_ONLY",
      executionPath: false,
      automatedAction: false
    });
  });

  it("makes the workspace loader reject missing authority declarations", () => {
    const loader = readFileSync(loaderPath, "utf8");

    expect(loader).toContain('data.boundary.assessmentAuthority !== "NON_CANONICAL_DEMO"');
    expect(loader).toContain(
      'data.boundary.recommendationOwner !== "CANONICAL_DECISION_ASSESSMENT_ONLY"'
    );
  });

  it("renders only a complete, passing, non-executing Epoch 1 proof", () => {
    const proof = JSON.parse(readFileSync(proofPath, "utf8")) as {
      dataMode: string;
      trace: { lifecycleStatus: string; gates: Array<{ status: string }> };
      checkpoint: { status: string; mismatchReasons: string[] };
      simulation: { executionPath: boolean; performanceClaim: boolean };
      limitations: string[];
    };
    const loader = readFileSync(loaderPath, "utf8");

    expect(proof.dataMode).toBe("LOCAL_VALIDATED_FIXTURE");
    expect(proof.trace.lifecycleStatus).toBe("COMPLETE");
    expect(proof.trace.gates.every((gate) => gate.status === "PASS")).toBe(true);
    expect(proof.checkpoint).toMatchObject({ status: "PASS", mismatchReasons: [] });
    expect(proof.simulation).toMatchObject({
      executionPath: false,
      performanceClaim: false
    });
    expect(proof.limitations).toHaveLength(2);
    expect(loader).toContain('proof.checkpoint?.status !== "PASS"');
  });

  it("keeps Epoch 2 integrity separate from operator conflict review", () => {
    const proof = JSON.parse(readFileSync(evidenceProofPath, "utf8")) as {
      dataMode: string;
      checkpoint: {
        status: string;
        operatorReviewRequired: boolean;
        recommendationFinal: boolean;
        executionPath: boolean;
      };
      graph: { contradictionPairs: string[][] };
      limitations: string[];
    };
    const loader = readFileSync(loaderPath, "utf8");

    expect(proof.dataMode).toBe("LOCAL_EVIDENCE_INTELLIGENCE_FIXTURE");
    expect(proof.checkpoint).toMatchObject({
      status: "PASS",
      operatorReviewRequired: true,
      recommendationFinal: false,
      executionPath: false
    });
    expect(proof.graph.contradictionPairs).toHaveLength(1);
    expect(proof.limitations[1]).toContain("does not resolve contradictions");
    expect(loader).toContain("proof.checkpoint?.operatorReviewRequired !== true");
  });

  it("keeps Epoch 3 portfolio risk status separate from approval authority", () => {
    const proof = JSON.parse(readFileSync(riskProofPath, "utf8")) as {
      dataMode: string;
      reviewAssessment: {
        status: string;
        operatorReviewRequired: boolean;
        riskApproval: boolean;
        findings: Array<{ severity: string }>;
      };
      blockedAssessment: { status: string; blockers: string[] };
      checkpoint: {
        status: string;
        deterministic: boolean;
        portfolioBlockersExercised: boolean;
        executionPath: boolean;
      };
      limitations: string[];
    };
    const loader = readFileSync(loaderPath, "utf8");

    expect(proof.dataMode).toBe("LOCAL_PORTFOLIO_RISK_FIXTURE");
    expect(proof.reviewAssessment).toMatchObject({
      status: "REVIEW_REQUIRED",
      operatorReviewRequired: true,
      riskApproval: false
    });
    expect(proof.reviewAssessment.findings.length).toBeGreaterThan(0);
    expect(proof.blockedAssessment).toMatchObject({ status: "BLOCKED" });
    expect(proof.blockedAssessment.blockers).toHaveLength(2);
    expect(proof.checkpoint).toMatchObject({
      status: "PASS",
      deterministic: true,
      portfolioBlockersExercised: true,
      executionPath: false
    });
    expect(proof.limitations.at(-1)).toContain("not approval");
    expect(loader).toContain("proof.reviewAssessment?.riskApproval !== false");
  });

  it("keeps Epoch 4 learning descriptive, deterministic, and operator-reviewed", () => {
    const proof = JSON.parse(readFileSync(learningProofPath, "utf8")) as {
      dataMode: string;
      sourceCaseCount: number;
      report: {
        status: string;
        recurringInvalidations: unknown[];
        evidenceFailurePatterns: unknown[];
        operatorProcessPatterns: Array<{ attributionMode: string }>;
        comparableCaseClusters: unknown[];
        driftInspection: { status: string };
        operatorReviewRequired: boolean;
        recommendationFinal: boolean;
        updatesRules: boolean;
        updatesRiskLimits: boolean;
        predictiveClaim: boolean;
        performanceClaim: boolean;
        executionPath: boolean;
      };
      checkpoint: {
        status: string;
        deterministic: boolean;
        sourceChainsValid: boolean;
        requiredPatternsExercised: boolean;
        executionPath: boolean;
      };
    };
    const loader = readFileSync(loaderPath, "utf8");
    const panel = readFileSync(learningPanelPath, "utf8");

    expect(proof.dataMode).toBe("LOCAL_DETERMINISTIC_LEARNING_FIXTURE");
    expect(proof.sourceCaseCount).toBe(6);
    expect(proof.report).toMatchObject({
      status: "REVIEW_REQUIRED",
      operatorReviewRequired: true,
      recommendationFinal: false,
      updatesRules: false,
      updatesRiskLimits: false,
      predictiveClaim: false,
      performanceClaim: false,
      executionPath: false
    });
    expect(proof.report.recurringInvalidations).toHaveLength(1);
    expect(proof.report.evidenceFailurePatterns).toHaveLength(2);
    expect(
      proof.report.operatorProcessPatterns.every(
        (pattern) => pattern.attributionMode === "MANUAL_LOCAL"
      )
    ).toBe(true);
    expect(proof.report.comparableCaseClusters).toHaveLength(2);
    expect(proof.report.driftInspection.status).toBe("REVIEW_REQUIRED");
    expect(proof.checkpoint).toMatchObject({
      status: "PASS",
      deterministic: true,
      sourceChainsValid: true,
      requiredPatternsExercised: true,
      executionPath: false
    });
    expect(loader).toContain("proof.report?.predictiveClaim !== false");
    expect(loader).toContain("proof.report?.performanceClaim !== false");
    expect(panel).toContain("The system does not infer operator intent.");
    expect(panel).toContain("Interpretation limits");
    expect(panel).not.toContain("winRate");
    expect(panel).not.toContain("probability");
  });
});
