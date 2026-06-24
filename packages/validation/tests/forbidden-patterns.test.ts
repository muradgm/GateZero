import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isAllowlistedPath, scanTextForForbiddenPatterns } from "../src/forbidden-patterns.js";

const rootDir = process.cwd();

describe("Gate 0 forbidden pattern scanner", () => {
  it("catches blocked implementation terms", () => {
    const findings = scanTextForForbiddenPatterns(
      "function placeOrder() {}",
      "packages/x/src/x.ts"
    );

    expect(findings).toHaveLength(1);
    expect(findings[0]?.label).toBe("order placement function");
  });

  it("supports explicit governance and validation allowlists", () => {
    expect(isAllowlistedPath("ops/governance/FINANCIAL_RISK_GATES.md")).toBe(true);
    expect(isAllowlistedPath("ops/agents/EXECUTION/references/required_refs.md")).toBe(true);
    expect(isAllowlistedPath("docs/operations/SECURITY_BASELINE.md")).toBe(true);
    expect(isAllowlistedPath("skills/trader-product-reviewer/SKILL.md")).toBe(true);
    expect(isAllowlistedPath("packages/validation/tests/forbidden-patterns.test.ts")).toBe(true);
    expect(isAllowlistedPath("packages/core/src/unsafe.ts")).toBe(false);
    expect(isAllowlistedPath("apps/web/src/unsafe.ts")).toBe(false);
    expect(isAllowlistedPath("ops/unreviewed/unsafe.md")).toBe(false);
  });

  it("keeps market intelligence truth evidence-based and operator-reviewed", () => {
    const truth = readFileSync(
      path.join(rootDir, "ops", "truth", "MARKET_INTELLIGENCE_TRUTH.md"),
      "utf8"
    );

    for (const requiredField of [
      "evidence",
      "source references",
      "confidence level",
      "red flags",
      "invalidation condition",
      "risk review status",
      "operator decision requirement"
    ]) {
      expect(truth).toContain(requiredField);
    }

    expect(truth).toContain("It must not present predictions as certainty");
    expect(truth).toContain("Unreviewed trade recommendations");
    expect(truth).toContain("Hidden promotion from scenario to action");
  });

  it("distinguishes AI-assisted scenarios from blocked trade decisions", () => {
    const riskRules = readFileSync(path.join(rootDir, "ops", "truth", "RISK_RULES.md"), "utf8");
    const productWedge = readFileSync(
      path.join(rootDir, "ops", "truth", "PRODUCT_WEDGE.md"),
      "utf8"
    );

    expect(productWedge).toContain("Read the market. Frame the risk. Decide with evidence.");
    expect(riskRules).toContain("AI-assisted signal candidate analysis");
    expect(riskRules).toContain("AI-generated scenario explanations");
    expect(riskRules).toContain("AI-generated live buy/sell decisions");
    expect(riskRules).toContain("Unreviewed trade recommendations");
    expect(riskRules).toContain("Prediction certainty, safety, or profit claims");
  });
});
