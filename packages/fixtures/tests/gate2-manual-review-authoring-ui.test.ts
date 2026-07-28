import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const mainSource = readFileSync(path.join(process.cwd(), "apps", "web", "src", "main.js"), "utf8");

describe("Gate 2 manual review authoring UI", () => {
  it("renders one local authoring form with bounded decisions", () => {
    expect(mainSource).toContain('id="manual-review-form"');
    expect(mainSource).toContain("keep_research_only");
    expect(mainSource).toContain('<option value="revise">');
    expect(mainSource).toContain('<option value="reject">');
  });

  it("persists locally and retains hard false authority flags", () => {
    expect(mainSource).toContain("window.localStorage.setItem");
    expect(mainSource).toContain("execution_authorized: false");
    expect(mainSource).toContain("external_dispatch: false");
    expect(mainSource).toContain("approval_granted: false");
    expect(mainSource).toContain("simulation_authorized: false");
  });

  it("fails closed for stale or malformed stored records", () => {
    expect(mainSource).toContain("Stored review is blocked and was not loaded.");
    expect(mainSource).toContain("record.brief_content_sha256 === brief.contentHash");
    expect(mainSource).toContain("Stored review history is blocked and cannot be extended.");
  });

  it("retains and renders validated local revision history without new authority", () => {
    expect(mainSource).toContain('id="manual-review-history"');
    expect(mainSource).toContain("traderframe.manual-review-history.v1");
    expect(mainSource).toContain("history.records.every(isValidRecord)");
    expect(mainSource).toContain("records: [...records, record]");
    expect(mainSource).toContain("No local review revisions recorded.");
    expect(mainSource).toContain("Authority</dt><dd>None granted");
  });
});
