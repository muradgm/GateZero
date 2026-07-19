import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSimulatorWorkspaceData } from "../../../scripts/build-simulator-workspace-data.js";
import { renderSimulatorWorkspaceData } from "../../../scripts/generate-simulator-workspace-data.js";

const root = process.cwd();

describe("Gate 2 simulator evidence workspace", () => {
  it("adapts four deterministic reducer outcomes for local inspection", () => {
    const data = buildSimulatorWorkspaceData();

    expect(data).toMatchObject({
      gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      defaultScenario: "recorded"
    });
    expect(data.scenarios.map((scenario) => scenario.key)).toEqual([
      "recorded",
      "risk_blocked",
      "candidate_blocked",
      "state_mismatch"
    ]);
  });

  it("links the reviewed research case to simulator evidence", () => {
    const { researchCase } = buildSimulatorWorkspaceData();

    expect(researchCase).toMatchObject({
      id: "gate2-research-case-fixture-001",
      handoffId: "gate2-strategy-simulator-handoff-fixture-001",
      strategyIdeaId: "gate0-strategy-idea-fixture-001",
      simulationEvidenceDetailId: "gate2-simulation-evidence-detail-fixture-001",
      simulatedOrderRecordId: "gate2-sim-record-fixture-001",
      riskReviewId: "gate2-risk-review-fixture-001"
    });
  });

  it("keeps handoff provenance local and operator review explicit", () => {
    const { researchCase } = buildSimulatorWorkspaceData();

    expect(researchCase.provenanceRefs).toHaveLength(2);
    expect(
      researchCase.provenanceRefs.every(
        (source) => source.startsWith("ops/") || source.startsWith("docs/")
      )
    ).toBe(true);
    expect(researchCase.operatorChecklist).toHaveLength(3);
    expect(researchCase.limitationNotes).toHaveLength(1);
  });

  it("links a manual note without performing an operator decision", () => {
    const { operatorNote } = buildSimulatorWorkspaceData().researchCase;

    expect(operatorNote).not.toBeNull();
    if (!operatorNote) {
      throw new Error("Expected the default research case to include an operator note.");
    }

    expect(operatorNote).toMatchObject({
      id: "gate2-operator-note-fixture-001",
      manualEntry: true,
      decisionPerformed: false
    });
    expect(operatorNote.limitationNotes).toContain(
      "Manual note fixture; no decision is performed."
    );
  });

  it("links outcome and learning records without promotion semantics", () => {
    const { researchCase } = buildSimulatorWorkspaceData();

    expect(researchCase.outcome).not.toBeNull();
    expect(researchCase.learning).not.toBeNull();
    if (!researchCase.outcome || !researchCase.learning) {
      throw new Error(
        "Expected the default research case to include outcome and learning records."
      );
    }

    expect(researchCase.outcome).toMatchObject({
      id: "gate0-outcome-log-fixture-001",
      status: "linked_local_record"
    });
    expect(researchCase.learning).toMatchObject({
      id: "gate0-learning-event-fixture-001",
      status: "linked_local_record"
    });
    expect(`${researchCase.outcome.limitation} ${researchCase.learning.limitation}`).not.toMatch(
      /approved|ready|profitable/i
    );
  });

  it("builds a read-only two-case workspace with a stable default", () => {
    const { caseWorkspace, researchCase, researchCases } = buildSimulatorWorkspaceData();

    expect(caseWorkspace).toMatchObject({
      localOnly: true,
      readonly: true,
      operatorRequired: true,
      actionRoutePresent: false
    });
    expect(researchCases).toHaveLength(2);
    expect(researchCase.inventoryId).toBe(caseWorkspace.defaultCaseInventoryId);
  });

  it("keeps the second case stale, blocked, and explicit about missing evidence", () => {
    const blockedCase = buildSimulatorWorkspaceData().researchCases[1];

    expect(blockedCase).toBeDefined();
    if (!blockedCase) {
      throw new Error("Expected a blocked research case fixture.");
    }

    expect(blockedCase).toMatchObject({
      status: "risk_blocked",
      completeness: "blocked",
      freshness: "stale",
      operatorReviewStatus: "blocked",
      operatorRequired: true,
      operatorNote: null,
      outcome: null,
      learning: null
    });
    expect(blockedCase.missingEvidence).toEqual([
      "metric_report",
      "operator_decision_note",
      "outcome_log",
      "learning_event"
    ]);
  });

  it("compares clear and risk-blocked states without scoring", () => {
    const { riskComparison } = buildSimulatorWorkspaceData();

    expect(riskComparison).toHaveLength(2);
    expect(riskComparison[0]).toMatchObject({
      scenarioKey: "recorded",
      riskStatus: "clear_for_local_simulation",
      stateChanged: true
    });
    expect(riskComparison[1]).toMatchObject({
      scenarioKey: "risk_blocked",
      riskStatus: "risk_blocked",
      stateChanged: false
    });
  });

  it("shows a recorded local mutation with an immutable journal event", () => {
    const scenario = scenarioByKey("recorded");

    expect(scenario).toMatchObject({
      status: "local_state_recorded",
      blockingReasons: [],
      account: { stateChanged: true },
      lifecycle: { operatorRequired: true, automated: false },
      risk: { status: "clear_for_local_simulation", policyLocked: true },
      candidate: { status: "clear_for_local_simulation" },
      journal: { eventCount: 1, immutable: true },
      reconciliation: { status: "reconciled", readonlyEmergency: false }
    });
  });

  it("shows a drawdown breach without mutating state", () => {
    const scenario = scenarioByKey("risk_blocked");

    expect(scenario).toMatchObject({
      status: "local_state_blocked",
      account: { stateChanged: false },
      risk: { status: "risk_blocked", breaches: ["max_drawdown_fraction"] },
      journal: { eventCount: 0 }
    });
  });

  it("shows stale and duplicate candidate reasons without mutating state", () => {
    const scenario = scenarioByKey("candidate_blocked");

    expect(scenario).toMatchObject({
      status: "local_state_blocked",
      account: { stateChanged: false },
      candidate: {
        status: "blocked",
        reasons: ["duplicate_candidate", "stale_candidate"]
      },
      journal: { eventCount: 0 }
    });
  });

  it("shows reconciliation drift in a readonly emergency posture", () => {
    const scenario = scenarioByKey("state_mismatch");

    expect(scenario).toMatchObject({
      status: "local_state_blocked",
      account: { stateChanged: false },
      reconciliation: {
        status: "mismatch",
        mismatchReasons: ["equity_mismatch"],
        readonlyEmergency: true
      },
      journal: { eventCount: 0 }
    });
  });

  it("keeps generated browser data aligned with the core adapter", async () => {
    const generated = readFileSync(
      path.join(root, "apps", "web", "src", "simulator-workspace-data.json"),
      "utf8"
    );

    expect(generated).toBe(await renderSimulatorWorkspaceData());
  });

  it("renders the required evidence panels and a view-only scenario selector", () => {
    const html = readFileSync(path.join(root, "apps", "web", "simulator.html"), "utf8");
    const main = readFileSync(
      path.join(root, "apps", "web", "src", "simulator-workspace.js"),
      "utf8"
    );

    for (const label of [
      "Strategy-to-simulator handoff",
      "Research cases",
      "Completeness",
      "Missing records",
      "Case provenance",
      "Operator review checklist",
      "Manual operator note",
      "Outcome and learning",
      "Clear and blocked risk states",
      "Position and equity",
      "Lifecycle evidence",
      "Risk and candidate guards",
      "Fill-cost evidence",
      "Journal chain evidence",
      "Reconciliation evidence",
      "Operating boundary"
    ]) {
      expect(main).toContain(label);
    }
    expect(main).toContain('data-scenario="${scenario.key}"');
    expect(main).toContain('data-case="${item.inventoryId}"');
    expect(main).toContain('aria-pressed="${scenario.key === data.defaultScenario}"');
    expect(html).not.toMatch(/<form|<button|<input|<select|<textarea/i);
    expect(main).not.toMatch(/<form|<input|<select|<textarea/i);
    expect(main).not.toMatch(/run simulation|submit order|execute simulation/i);
  });

  it("links the Command Center to the simulator evidence surface", () => {
    const main = readFileSync(path.join(root, "apps", "web", "src", "main.js"), "utf8");

    expect(main).toContain('href="./simulator.html"');
    expect(main).toContain("Simulator Evidence");
  });

  it("keeps blocked scope explicit and avoids unsafe product copy", () => {
    const data = JSON.stringify(buildSimulatorWorkspaceData()).toLowerCase();

    for (const boundary of [
      "no external account",
      "no external market route",
      "no automated action",
      "no prediction or performance claim"
    ]) {
      expect(data).toContain(boundary);
    }
    for (const unsafe of ["connect broker", "place order", "ready to trade", "profit guarantee"]) {
      expect(data).not.toContain(unsafe);
    }
  });

  it("provides responsive constraints and visible keyboard focus", () => {
    const css = readFileSync(
      path.join(root, "apps", "web", "src", "simulator-workspace.css"),
      "utf8"
    );

    expect(css).toContain("@media (max-width: 820px)");
    expect(css).toContain("@media (max-width: 480px)");
    expect(css).toContain(".scenario-selector button:focus-visible");
    expect(css).toContain(".case-selector button:focus-visible");
    expect(css).toContain(".case-state-strip");
    expect(css).toContain('button[aria-pressed="true"]');
  });
});

function scenarioByKey(
  key: ReturnType<typeof buildSimulatorWorkspaceData>["scenarios"][number]["key"]
) {
  const scenario = buildSimulatorWorkspaceData().scenarios.find(
    (candidate) => candidate.key === key
  );

  if (!scenario) {
    throw new Error(`Missing simulator workspace scenario: ${key}`);
  }

  return scenario;
}
