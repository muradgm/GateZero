import { describe, expect, it } from "vitest";
import {
  checkMarketIntelligenceLocalSources,
  loadTrackedRepositoryRefs
} from "../../../scripts/check-market-intelligence-local-sources.js";

describe("market intelligence local source check", () => {
  it("loads tracked repository paths in canonical form", async () => {
    const tracked = await loadTrackedRepositoryRefs(process.cwd());

    expect(tracked.has("ops/truth/MARKET_INTELLIGENCE_TRUTH.md")).toBe(true);
    expect(tracked.has("ops/truth/RISK_RULES.md")).toBe(true);
  });

  it("accepts checked-in local replay fixture sources", async () => {
    const result = await checkMarketIntelligenceLocalSources(process.cwd());

    expect(result).toEqual({
      ok: true,
      findings: [],
      checkedSources: 3
    });
  });
});
