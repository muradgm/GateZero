import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const uiSourcePaths = [
  "apps/web/src/intelligence-command-center.js",
  "apps/intelligence-workspace/src/App.jsx",
  "apps/intelligence-workspace/src/AppRuntime.jsx",
  "apps/intelligence-workspace/src/AIEvidenceCouncil.jsx",
  "apps/intelligence-workspace/src/CandidateActionBar.jsx",
  "apps/intelligence-workspace/src/CommandPalette.jsx",
  "apps/intelligence-workspace/src/ConfidenceChange.jsx",
  "apps/intelligence-workspace/src/ConfidenceHeatmap.jsx",
  "apps/intelligence-workspace/src/DecisionMemory.jsx",
  "apps/intelligence-workspace/src/DecisionReplay.jsx",
  "apps/intelligence-workspace/src/EvidenceGraph.jsx",
  "apps/intelligence-workspace/src/IntelligenceTools.jsx",
  "apps/intelligence-workspace/src/OperatorJournal.jsx",
  "apps/intelligence-workspace/src/SimilarSetups.jsx",
  "apps/intelligence-workspace/src/candidate-workflow.js",
  "packages/ui/src/components.jsx"
] as const;

const blockedPatterns = [
  { label: "risk readiness", pattern: /risk readiness/gi },
  { label: "Win Probability", pattern: /win probability/gi },
  {
    label: "Recommendation: LONG or SHORT",
    pattern: /recommendation\s*:\s*(?:long|short)/gi
  },
  {
    label: "BUY or SELL disposition",
    pattern: /(["'`])(?:buy|sell)\1|>\s*(?:buy|sell)\s*</gi
  },
  {
    label: "LONG or SHORT disposition",
    pattern: /(["'`])(?:long|short)\1|>\s*(?:long|short)\s*</gi
  },
  { label: "AI Consensus", pattern: /ai consensus/gi },
  { label: "ready to trade", pattern: /ready to trade/gi },
  { label: "Ready for decision", pattern: /ready for decision/gi },
  { label: "approved for trading", pattern: /approved for trading/gi },
  { label: "recommended trade", pattern: /recommended trade/gi },
  { label: "recommended buy or sell", pattern: /recommended (?:buy|sell)/gi },
  {
    label: "visible Recommendation label",
    pattern: /(["'`])recommendation\1|>\s*recommendation\s*</gi
  },
  {
    label: "visible Score label",
    pattern: /(["'`])(?:score|score changes|open score changes)\1|>\s*score(?: changes)?\s*</gi
  }
] as const;

async function readSource(relativePath: string): Promise<string> {
  return readFile(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("intelligence command center language boundary", () => {
  it("rejects execution-like, readiness, prediction, and unbounded scoring copy", async () => {
    const findings: string[] = [];

    for (const relativePath of uiSourcePaths) {
      const source = await readSource(relativePath);
      for (const rule of blockedPatterns) {
        rule.pattern.lastIndex = 0;
        if (rule.pattern.test(source)) findings.push(`${relativePath}: ${rule.label}`);
      }
    }

    expect(findings).toEqual([]);
  });

  it(
    "requires bounded disposition and evidence-index framing at the primary UI boundaries",
    async () => {
      const [staticCommandCenter, runtimeWorkspace, sharedComponents, workflow] = await Promise.all([
        readSource("apps/web/src/intelligence-command-center.js"),
        readSource("apps/intelligence-workspace/src/AppRuntime.jsx"),
        readSource("packages/ui/src/components.jsx"),
        readSource("apps/intelligence-workspace/src/candidate-workflow.js")
      ]);

      expect(staticCommandCenter).toContain("Bounded operator disposition");
      expect(staticCommandCenter).toContain("risk review status");
      expect(staticCommandCenter).toContain("Evidence index");
      expect(runtimeWorkspace).toContain("Bounded disposition");
      expect(runtimeWorkspace).toContain("Evidence index");
      expect(sharedComponents).toContain("Disposition");
      expect(workflow).toContain("Operator decision due");
      expect(workflow).toContain("bounded operator disposition");
    }
  );
});
