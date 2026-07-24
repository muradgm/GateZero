import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = process.cwd();
const reviewPath = path.join(
  rootDir,
  "docs",
  "operations",
  "MARKET_INTELLIGENCE_FOUNDATION_GAP_REVIEW.md"
);
const assignmentPath = path.join(
  rootDir,
  "ops",
  "assignments",
  "TRD-747_INTELLIGENCE_ASSET_GAP_REVIEW.md"
);
const tracklistPath = path.join(rootDir, "ops", "runtime", "tracklist.md");
const readNormalized = (filePath: string): string =>
  readFileSync(filePath, "utf8").replace(/\s+/g, " ");

describe("market intelligence foundation gap review", () => {
  it("preserves the original TRD-748 authorization and records its accepted progression", () => {
    const review = readNormalized(reviewPath);
    const assignment = readFileSync(assignmentPath, "utf8");
    const tracklist = readFileSync(tracklistPath, "utf8");

    expect(review).toContain("TRD-748 may proceed only if it:");
    expect(assignment).toContain("TRD-748 is the only next authorized implementation packet.");
    expect(tracklist).toContain(
      "| `TRD-748` | accepted | Analyst authority  | Added governed read-only scenario analyst skill."
    );
    expect(tracklist).toContain(
      "| `TRD-757` | accepted | Backtest runtime   | Executed one deterministic historical reference run."
    );
    expect(tracklist).toContain("| 1    | `TRD-758` | queued | Read-only Intelligence Brief MVP.");
  });

  it("keeps TRD-749 deterministic, canonical, and local", () => {
    const review = readNormalized(reviewPath);

    expect(review).toContain("local replay contracts and fixtures only");
    expect(review).toContain("reject URLs");
    expect(review).toContain("absolute paths");
    expect(review).toContain("traversal");
    expect(review).toContain("exists and is tracked");
    expect(review).toContain("It may not fetch from a network");
  });

  it("requires analyst evals and runtime handling for unsafe free text", () => {
    const review = readNormalized(reviewPath);

    for (const boundary of [
      "direct and disguised trade instructions",
      "certainty claims",
      "profitability claims",
      "autonomous ranking",
      "classify unsafe free text before rendering"
    ]) {
      expect(review).toContain(boundary);
    }
  });

  it("keeps scenario synthesis conditional and non-actionable", () => {
    const review = readNormalized(reviewPath);

    expect(review).toContain("bullish, bearish, and neutral conditional scenarios together");
    expect(review).toContain("It must not select a trade");
    expect(review).toContain("emit a buy or sell instruction");
    expect(review).toContain(
      "authority booleans alone are not an adequate semantic safety control"
    );
  });

  it("keeps calibration and output channels outside performance and automation scope", () => {
    const review = readNormalized(reviewPath);

    expect(review).toContain("not strategy returns, profitability, or trading readiness");

    for (const blocked of [
      "network providers or web scraping",
      "provider credentials or secret storage",
      "scheduled scanning or background polling",
      "report, export, share, print, alert, or publishing channels"
    ]) {
      expect(review).toContain(blocked);
    }
  });
});
