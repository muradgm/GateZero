import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSimulatorWorkspaceData } from "../../../scripts/build-simulator-workspace-data.js";
import { renderSimulatorWorkspaceData } from "../../../scripts/generate-simulator-workspace-data.js";

const root = process.cwd();

describe("Gate 2 simulator evidence workspace", () => {
  it("adapts one deterministic reducer result for local display", () => {
    const data = buildSimulatorWorkspaceData();

    expect(data).toMatchObject({
      gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      status: "local_state_recorded",
      lifecycle: { operatorRequired: true, automated: false },
      risk: { status: "clear_for_local_simulation", policyLocked: true },
      candidate: { status: "clear_for_local_simulation" },
      journal: { eventCount: 1, immutable: true },
      reconciliation: { status: "reconciled", readonlyEmergency: false }
    });
  });

  it("keeps generated browser data aligned with the core adapter", () => {
    const generated = readFileSync(
      path.join(root, "apps", "web", "src", "simulator-workspace-data.json"),
      "utf8"
    );

    expect(generated).toBe(renderSimulatorWorkspaceData());
  });

  it("renders all required evidence panels without forms or action controls", () => {
    const html = readFileSync(path.join(root, "apps", "web", "simulator.html"), "utf8");
    const main = readFileSync(
      path.join(root, "apps", "web", "src", "simulator-workspace.js"),
      "utf8"
    );

    for (const label of [
      "Position and equity",
      "Lifecycle evidence",
      "Risk and candidate guards",
      "Fill-cost evidence",
      "Journal integrity",
      "Operating boundary"
    ]) {
      expect(main).toContain(label);
    }
    expect(html).not.toMatch(/<form|<button|<input|<select|<textarea/i);
    expect(main).not.toMatch(/<form|<button|<input|<select|<textarea/i);
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
    expect(css).toContain(":focus-visible");
  });
});
