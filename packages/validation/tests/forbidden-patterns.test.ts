import { describe, expect, it } from "vitest";
import { isAllowlistedPath, scanTextForForbiddenPatterns } from "../src/forbidden-patterns.js";

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
});
