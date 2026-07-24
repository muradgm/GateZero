import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildBacktestRunEvidence } from "../../../scripts/build-backtest-run-evidence.js";
import { renderBacktestRunEvidenceModule } from "../../../scripts/generate-backtest-run-evidence.js";

describe("Gate 1 generated backtest evidence", () => {
  it("projects generated runner evidence without trade-attractiveness fields", () => {
    const evidence = buildBacktestRunEvidence();

    expect(evidence).toMatchObject({
      status: "Historical evidence recorded",
      observationCount: 12,
      closedTradeCount: 1,
      declaredCostsApplied: true,
      reproducibilityStatus: "reproduced"
    });
    expect(evidence).not.toHaveProperty("recommendation");
    expect(evidence).not.toHaveProperty("winProbability");
    expect(evidence).not.toHaveProperty("expectedProfit");
  });

  it("keeps the checked-in browser module synchronized with the runner fixture", async () => {
    const file = readFileSync(
      path.join(process.cwd(), "apps", "web", "src", "backtest-run-evidence.js"),
      "utf8"
    );

    expect(file).toBe(await renderBacktestRunEvidenceModule());
  });

  it("renders generated evidence and avoids the ambiguous Action label", () => {
    const main = readFileSync(path.join(process.cwd(), "apps", "web", "src", "main.js"), "utf8");

    expect(main).toContain("Generated Historical Backtest Evidence");
    expect(main).toContain("Backtest Limitations");
    expect(main).toContain("Candidate disposition");
    expect(main).not.toContain('["Action"');
  });
});
