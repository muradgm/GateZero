import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSimulatorWorkspaceData } from "../../../scripts/build-simulator-workspace-data.js";

const root = process.cwd();
const operatorCaseId = "operator-workflow-case-001";

describe("Gate 2 local case revision timeline", () => {
  it("projects one timeline for every checked-in catalog case", () => {
    const data = buildSimulatorWorkspaceData();
    expect(data.revisionTimelines).toHaveLength(data.caseCatalog.items.length);
    expect(data.revisionTimelines.map((timeline) => timeline.case_id)).toEqual(
      data.caseCatalog.items.map((item) => item.case_id)
    );
  });

  it("keeps cases without revisions explicit and operator-reviewed", () => {
    const timelines = buildSimulatorWorkspaceData().revisionTimelines.filter(
      (timeline) => timeline.revision_count === 0
    );
    expect(timelines).toHaveLength(2);
    for (const timeline of timelines) {
      expect(timeline).toMatchObject({
        status: "no_revisions",
        entries: [],
        operator_review_required: true,
        local_only: true,
        read_only: true,
        action_route_created: false
      });
    }
  });

  it("projects validated operator-case lineage as blocked pending review", () => {
    const timeline = operatorTimeline();
    expect(timeline).toMatchObject({
      case_id: operatorCaseId,
      status: "blocked_pending_review",
      revision_count: 1,
      entries: [
        {
          revision_id: `${operatorCaseId}-r1`,
          revision_number: 1,
          parent_revision_id: null,
          freshness_status: "unverified",
          status: "blocked",
          operator_review_required: true
        }
      ]
    });
  });

  it("keeps changed fields, reasons, evidence, risk, and limitations together", () => {
    const entry = operatorTimeline().entries[0];
    expect(entry).toBeDefined();
    expect(entry?.changed_fields).toEqual(["evidence_refs", "limitation_notes", "provenance_refs"]);
    expect(entry?.revision_reason).toMatch(/checked-in workflow evidence/i);
    expect(entry?.evidence_refs).toHaveLength(2);
    expect(entry?.risk_review_ref).toBe("ops/truth/RISK_RULES.md");
    expect(entry?.limitation_notes.join(" ")).toMatch(/not a strategy/i);
  });

  it("renders semantic timeline, empty, and unavailable states", () => {
    const source = workspaceSource();
    expect(source).toContain('class="revision-timeline"');
    expect(source).toContain("<ol>");
    expect(source).toContain("<time datetime=");
    expect(source).toContain("No immutable revisions are recorded.");
    expect(source).toContain("Revision timeline unavailable");
    expect(source).toContain("remains blocked pending local validation");
  });

  it("renders evidence and limitations inside each revision entry", () => {
    const source = workspaceSource();
    const timeline = source.slice(
      source.indexOf("function renderRevisionTimeline"),
      source.indexOf("function linkedOutcomeAndLearning")
    );
    expect(timeline).toContain("Revision evidence and limitations");
    expect(timeline).toContain("entry.evidence_refs");
    expect(timeline).toContain("entry.risk_review_ref");
    expect(timeline).toContain("entry.limitation_notes");
    expect(timeline).toContain("base_content_hash");
    expect(timeline).toContain("revised_content_hash");
  });

  it("keeps the timeline free of editing and action controls", () => {
    const source = workspaceSource();
    const timeline = source.slice(
      source.indexOf("function renderRevisionTimeline"),
      source.indexOf("function linkedOutcomeAndLearning")
    );
    expect(timeline).not.toMatch(/<form|<input|<textarea|contenteditable|upload|execute/i);
    expect(timeline).toContain("operator review required");
    expect(timeline).toContain("blocked");
  });

  it("provides stable responsive timeline layout and hash wrapping", () => {
    const css = readFileSync(path.join(root, "apps/web/src/simulator-workspace.css"), "utf8");
    expect(css).toContain(".revision-timeline");
    expect(css).toContain("width: 100%");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("@media (max-width: 820px)");
  });
});

function operatorTimeline() {
  const timeline = buildSimulatorWorkspaceData().revisionTimelines.find(
    (candidate) => candidate.case_id === operatorCaseId
  );
  if (!timeline) throw new Error("Missing checked-in operator revision timeline.");
  return timeline;
}

function workspaceSource(): string {
  return readFileSync(path.join(root, "apps/web/src/simulator-workspace.js"), "utf8");
}
