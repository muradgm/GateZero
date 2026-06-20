import { describe, expect, it } from "vitest";
import {
  checkGate0SkillRouting,
  renderGate0SkillRoutingResult,
  type Gate0SkillRoutingInput
} from "../../../scripts/check-gate0-skill-routing.js";

const completeInput: Gate0SkillRoutingInput = {
  matrix: [
    "G1_BACKTESTING",
    "historical_backtesting_only",
    "Selection Rules",
    "Assignment sequencing and handoff",
    "Risk gate and autonomy boundary review",
    "Validation and blocked-scope review",
    "Documentation and tracker consistency",
    "Product scope and wedge review",
    "Static command-center UI review",
    "Backtest contract and metric review",
    "Trader workflow and trust review",
    "Forex mechanics and domain review",
    "gatezero-docs-control-plane-reviewer",
    "gatezero-orchestrator-reviewer",
    "gatezero-product-strategy-reviewer",
    "gatezero-qa-security-reviewer",
    "gatezero-quant-backtest-reviewer",
    "gatezero-risk-governance-reviewer",
    "gatezero-ui-command-center-reviewer",
    "trader-product-reviewer",
    "trading-forex-domain-expert"
  ].join("\n")
};

describe("Gate 0 skill routing check", () => {
  it("accepts a complete skill routing matrix", () => {
    const result = checkGate0SkillRouting(completeInput);

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedSkillCount: 9,
      checkedDecisionCount: 9
    });
    expect(renderGate0SkillRoutingResult(result)).toContain("Gate 0 skill routing check passed.");
  });

  it("rejects a missing governed skill", () => {
    const result = checkGate0SkillRouting({
      matrix: completeInput.matrix.replace("gatezero-qa-security-reviewer", "missing-skill")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing routing matrix skill: gatezero-qa-security-reviewer"
    );
  });

  it("rejects a missing decision lane", () => {
    const result = checkGate0SkillRouting({
      matrix: completeInput.matrix.replace("Product scope and wedge review", "Product review")
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain(
      "Missing routing matrix decision type: Product scope and wedge review"
    );
  });
});
