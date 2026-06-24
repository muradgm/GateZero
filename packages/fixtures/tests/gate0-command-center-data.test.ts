import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = process.cwd();
const dataPath = path.join(rootDir, "apps", "web", "src", "command-center-data.js");
const indexPath = path.join(rootDir, "apps", "web", "index.html");
const mainPath = path.join(rootDir, "apps", "web", "src", "main.js");
const stylePath = path.join(rootDir, "apps", "web", "src", "styles.css");

describe("Gate 0 command center surface", () => {
  it("keeps the command center tied to Gate 2 simulation-planning scope", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("G2_PAPER_TRADING");
    expect(data).toContain("paper_simulation_planning_only");
    expect(data).toContain("TRD-570");
  });

  it("does not expose trading action language in app data", () => {
    const data = readFileSync(dataPath, "utf8").toLowerCase();

    for (const blockedCopy of [
      "buy",
      "sell",
      "connect broker",
      "place order",
      "submit order",
      "ready to trade",
      "approved strategy"
    ]) {
      expect(data).not.toContain(blockedCopy);
    }
  });

  it("records the latest verified commit without promotion semantics", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain('lastVerifiedCommit: "6e6f513"');
    expect(data).toContain('area: "Verified commit"');
    expect(data).toContain('signal: "6e6f513"');
    expect(data).toContain('reference: "Run 27787807220"');
  });

  it("mounts as a local command center", () => {
    const index = readFileSync(indexPath, "utf8");

    expect(index).toContain('<div id="app"></div>');
    expect(index).toContain("./src/main.js");
    expect(index).toContain("./src/styles.css");
  });

  it("keeps navigation targets aligned to rendered section ids", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    for (const item of ["Overview", "Evidence", "Limitations", "Risk", "Workflow", "Docs"]) {
      const id = item.toLowerCase();

      expect(data).toContain(`"${item}"`);
      expect(main).toContain(`id="${id}"`);
    }
  });

  it("updates active navigation from the current hash", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain("data-section");
    expect(main).toContain("updateActiveNavigation()");
    expect(main).toContain('link.setAttribute("aria-current", "page")');
    expect(main).toContain('link.removeAttribute("aria-current")');
    expect(main).toContain('window.addEventListener("hashchange", updateActiveNavigation)');
    expect(main).toContain('window.location.hash.replace("#", "") || "overview"');
    expect(main).toContain('link.classList.toggle("active", isCurrent)');
  });

  it("refreshes from the local runtime endpoint without external services", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain('"/runtime/command-center-data.json"');
    expect(main).toContain("refreshRuntimeData()");
    expect(main).toContain("setInterval");
    expect(main).toContain('fetch(runtimeDataUrl, { cache: "no-store" })');
  });

  it("keeps the accessibility baseline present in the static surface", () => {
    const index = readFileSync(indexPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(index).toContain('class="skip-link"');
    expect(index).toContain('href="#main"');
    expect(main).toContain('main class="workspace" id="main" tabindex="-1"');
    expect(main).toContain("<caption>");
    expect(main).toContain('data-label="Area"');
    expect(main).toContain('data-label="Reference"');
    expect(styles).toContain(":focus-visible");
    expect(styles).toContain("td::before");
  });

  it("groups source links by operating purpose", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    for (const group of ["Tracker", "Command Center", "Evidence", "Guards", "Skills", "Preview"]) {
      expect(data).toContain(`label: "${group}"`);
    }

    expect(main).toContain("data.docGroups");
    expect(main).toContain('class="doc-group"');
    expect(main).toContain('class="doc-group-heading"');
    expect(main).toContain("group.items.length");
    expect(styles).toContain(".doc-group");
    expect(styles).toContain(".doc-group-heading");
  });

  it("renders read-only frontend shell sections", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    for (const field of [
      "limitationItems",
      "riskItems",
      "workflowItems",
      "simulationEvidenceDetail"
    ]) {
      expect(data).toContain(field);
    }

    for (const sectionId of ["evidence", "limitations", "risk", "workflow", "docs"]) {
      expect(main).toContain(`id="${sectionId}"`);
    }

    expect(main).toContain("workflow-list");
    expect(main).toContain("evidence-detail");
    expect(main).toContain("renderDetailCard");
    expect(main).toContain("renderListCard");
    expect(styles).toContain(".insight-list");
    expect(styles).toContain(".workflow-list");
    expect(styles).toContain(".detail-grid");
    expect(styles).toContain(".detail-adjacency");
  });

  it("keeps risk and limitation copy close to evidence surfaces", () => {
    const main = readFileSync(mainPath, "utf8");
    const evidenceIndex = main.indexOf('id="evidence"');
    const evidenceDetailIndex = main.indexOf("evidence-detail");
    const limitationsIndex = main.indexOf('id="limitations"');
    const riskIndex = main.indexOf('id="risk"');

    expect(evidenceIndex).toBeGreaterThan(-1);
    expect(evidenceDetailIndex).toBeGreaterThan(evidenceIndex);
    expect(limitationsIndex).toBeGreaterThan(evidenceIndex);
    expect(riskIndex).toBeGreaterThan(limitationsIndex);
  });

  it("renders evidence detail without action controls", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("Simulation Evidence Detail");
    expect(main).toContain("Boundary Checks");
    expect(main).toContain("Local Source Artifacts");
    expect(main).toContain("Reproducibility Notes");
    expect(main).not.toContain("<button");
    expect(main).not.toContain("<form");
    expect(styles).not.toContain("cursor: pointer");
  });

  it("keeps runtime refresh from dropping simulation evidence detail", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain("const preservedDetail = normalizeSimulationEvidenceDetail");
    expect(main).toContain("mergedData.simulationEvidenceDetail = preservedDetail");
    expect(main).toContain("normalizeSimulationEvidenceDetail(data.simulationEvidenceDetail)");
  });

  it("validates required simulation evidence detail display fields", () => {
    const data = readFileSync(dataPath, "utf8");

    for (const field of [
      "recordId",
      "simulationRecordId",
      "stateRecordId",
      "operatorRecordId",
      "riskRecordId",
      "assumptionRecordId",
      "workflowRefs",
      "riskRefs",
      "artifactRefs",
      "failureModeRefs",
      "sourceLinkRefs",
      "sourceArtifacts",
      "runtimeSnapshotRefs",
      "fixtureDriftChecks",
      "reviewAgingPolicy",
      "operatorScanChecklist",
      "artifactRetentionNotes",
      "failureTaxonomy",
      "displayPolicies",
      "performanceSmokeChecks",
      "reproducibilityNotes",
      "limitationNotes",
      "boundaryChecks"
    ]) {
      expect(data).toContain(field);
    }
  });

  it("handles missing evidence detail arrays with neutral empty states", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain("function asList");
    expect(main).toContain("renderCodeListItems");
    expect(main).toContain("renderPlainListItems");
    expect(main).toContain("No local references recorded.");
    expect(main).toContain("No local notes recorded.");
    expect(main).not.toContain("please");
  });

  it("wraps long evidence detail references without layout pressure", () => {
    const styles = readFileSync(stylePath, "utf8");

    expect(styles).toContain("overflow-wrap: anywhere");
    expect(styles).toContain("word-break: break-word");
    expect(styles).toContain("white-space: normal");
  });

  it("labels evidence detail cards and adjacent sections for screen readers", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain('aria-labelledby="${slug(title)}-detail-card-title"');
    expect(main).toContain('id="${slug(title)}-detail-card-title"');
    expect(main).toContain('aria-labelledby="reproducibility-notes-title"');
    expect(main).toContain('aria-labelledby="evidence-detail-limitations-title"');
  });

  it("keeps source detail dense but bounded", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("sourceLinkRefs");
    expect(data).toContain("sourceArtifacts");
    expect(data).toContain("docs/operations/GATE2_EVIDENCE_SOURCE_LINK_MAP_IMPLEMENTATION.md");
    expect(data).toContain("ops/assignments/TRD-532_SIMULATION_EVIDENCE_SCHEMA_SOURCE_UPDATE.md");
    expect(data).not.toContain("http://");
    expect(data).not.toContain("https://");
  });

  it("maps evidence detail to runtime snapshot sources without external endpoints", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("runtimeSnapshotRefs");
    expect(data).toContain("scripts/build-command-center-runtime-data.ts");
    expect(data).toContain("packages/fixtures/tests/gate0-command-center-runtime-data.test.ts");
    expect(main).toContain("Runtime Snapshot Map");
    expect(data).not.toContain("api.");
  });

  it("records fixture drift checks as local inspection signals", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    for (const check of [
      "record_id_present",
      "source_artifacts_present",
      "boundary_checks_present",
      "local_paths_only"
    ]) {
      expect(data).toContain(check);
    }

    expect(main).toContain("Fixture Drift Checks");
  });

  it("keeps review aging and operator scan wording manual and non-actionable", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("reviewAgingPolicy");
    expect(data).toContain("operatorScanChecklist");
    expect(data).toContain("display-only");
    expect(data).not.toContain("certified");
  });

  it("records artifact retention without publishing or report controls", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("artifactRetentionNotes");
    expect(data).toContain("external report distribution");
    expect(main).toContain("Artifact Retention");
    expect(main).not.toContain("download");
  });

  it("keeps failure taxonomy evidence-only and bounded", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    for (const failureLabel of [
      "missing_local_reference",
      "stale_fixture_reference",
      "ambiguous_failure_label",
      "blocked_scope_copy"
    ]) {
      expect(data).toContain(failureLabel);
    }

    expect(main).toContain("Failure Taxonomy");
  });

  it("prohibits print and export controls in display policy", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("displayPolicies");
    expect(data).toContain("No print or export control is rendered.");
    expect(main).toContain("Display Policy");
    expect(main).not.toContain("window.print");
  });

  it("keeps performance smoke checks local and layout-oriented", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("performanceSmokeChecks");
    expect(data).toContain("Source lists use scroll-bounded groups.");
    expect(data).toContain("Long paths wrap without horizontal page overflow.");
    expect(main).toContain("Performance Smoke");
    expect(styles).toContain(".detail-control-plane");
  });

  it("renders evidence controls without introducing forms, buttons, or report links", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain("Evidence Controls");
    expect(main).toContain("detail-control-plane");
    expect(main).not.toContain("<button");
    expect(main).not.toContain("<form");
    expect(main).not.toContain("target=");
  });

  it("keeps blocked frontend claim and action language out of the shell", () => {
    const source = [
      readFileSync(indexPath, "utf8"),
      readFileSync(dataPath, "utf8"),
      readFileSync(mainPath, "utf8"),
      readFileSync(stylePath, "utf8")
    ]
      .join("\n")
      .toLowerCase();

    for (const blockedCopy of [
      ["bro", "ker-ready"].join(""),
      "live-ready",
      "optimized returns",
      "approved for trading",
      "strategy is safe"
    ]) {
      expect(source).not.toContain(blockedCopy);
    }
  });
});
