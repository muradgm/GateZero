import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = process.cwd();
const dataPath = path.join(rootDir, "apps", "web", "src", "command-center-data.js");
const indexPath = path.join(rootDir, "apps", "web", "index.html");
const mainPath = path.join(rootDir, "apps", "web", "src", "main.js");
const stylePath = path.join(rootDir, "apps", "web", "src", "styles.css");
const tracklistPath = path.join(rootDir, "ops", "runtime", "tracklist.md");

describe("Gate 0 command center surface", () => {
  it("keeps the command center tied to Gate 2 simulation-planning scope", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("G2_PAPER_TRADING");
    expect(data).toContain("paper_simulation_planning_only");
    expect(data).toContain('latestPacket: "TRD-726"');
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

    for (const item of [
      "Overview",
      "Evidence",
      "Workspace",
      "Limitations",
      "Risk",
      "Workflow",
      "Docs"
    ]) {
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
    expect(main).toContain('window.addEventListener("hashchange", () =>');
    expect(main).toContain("focusHashTarget()");
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

  it("keeps source-link overflow review focused on workspace inspection", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("sourceOverflowReview");
    expect(data).toContain("Workspace Sources First");
    expect(data).toContain("TRD-592 should expose only the sources needed");
    expect(data).toContain("Historical operating links remain grouped and scroll-bounded");
    expect(main).toContain('aria-label="Source overflow review"');
    expect(main).toContain("source-review-card");
    expect(styles).toContain(".source-review-grid");
    expect(styles).toContain("max-height: 330px");
    expect(main).not.toContain("<button");
    expect(main).not.toContain("download");
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

    for (const sectionId of ["evidence", "workspace", "limitations", "risk", "workflow", "docs"]) {
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
      "visualDensityChecks",
      "accessibilityRecheck",
      "copyMinimizationRules",
      "sourceFreshnessPlan",
      "artifactInventoryPlan",
      "operatorNoteModelPlan",
      "limitationProminenceChecks",
      "sourceCompactionPlan",
      "outputChannelBoundary",
      "controlLaneCheckpoint",
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

  it("keeps evidence controls visually compact and scannable", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("visualDensityChecks");
    expect(data).toContain("Control cards stay compact.");
    expect(main).toContain("Visual Density");
    expect(main).toContain("detail-grid-compact");
    expect(styles).toContain(".detail-grid-compact");
  });

  it("rechecks evidence-control accessibility structure", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("accessibilityRecheck");
    expect(data).toContain(
      "Reading order follows evidence, limitations, controls, then source links."
    );
    expect(main).toContain('aria-label="Evidence control follow-up checks"');
    expect(main).toContain("Accessibility Recheck");
  });

  it("keeps evidence-control copy minimized without hiding risk context", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("copyMinimizationRules");
    expect(data).toContain("Prefer short inspection labels over explanatory paragraphs.");
    expect(data).toContain("Keep risk context visible");
    expect(main).toContain("Copy Minimization");
  });

  it("plans source freshness without automation or external polling", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("sourceFreshnessPlan");
    expect(data).toContain("local planning record");
    expect(data).toContain("No automatic remote polling");
    expect(data).not.toContain("webhook");
    expect(data).not.toContain("cron");
  });

  it("keeps artifact inventory planning local and credential-free", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("artifactInventoryPlan");
    expect(data).toContain("Inventory view may list local simulation artifacts only.");
    expect(data).toContain("must not expose account, credential, or execution data");
    expect(main).toContain("Artifact Inventory Plan");
  });

  it("keeps operator note model manual and non-decisioning", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("operatorNoteModelPlan");
    expect(data).toContain("Operator notes are manual local review records.");
    expect(data).toContain("must not perform decisions");
    expect(main).toContain("Operator Note Model");
  });

  it("keeps limitation prominence adjacent to evidence controls", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const limitationIndex = main.indexOf("evidence-detail-limitations-title");
    const controlsIndex = main.indexOf("evidence-controls-title");

    expect(data).toContain("limitationProminenceChecks");
    expect(data).toContain("Limitations stay adjacent to evidence detail.");
    expect(limitationIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(limitationIndex);
  });

  it("plans source-list compaction without hiding local path visibility", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("sourceCompactionPlan");
    expect(data).toContain("Long source lists should group by operating purpose.");
    expect(data).toContain("preserve local path visibility");
    expect(main).toContain("Source Compaction");
  });

  it("rechecks no output-channel boundary for reports and sharing", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("outputChannelBoundary");
    expect(data).toContain("No report, export, publish, share, or print channel is added.");
    expect(main).toContain("Output Channel Boundary");
    expect(main).not.toContain("navigator.share");
  });

  it("checkpoints the evidence-control lane without opening new scope", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("controlLaneCheckpoint");
    expect(data).toContain("TRD-726 closes immutable local case revision.");
    expect(data).toContain(
      "TRD-727 must exercise a real checked-in workflow before interface expansion."
    );
  });

  it("records dependency audit maintenance without adding runtime capability", () => {
    const data = readFileSync(dataPath, "utf8");
    const packageJson = readFileSync(path.join(rootDir, "package.json"), "utf8");
    const lockfile = readFileSync(path.join(rootDir, "pnpm-lock.yaml"), "utf8");

    expect(data).toContain("Dependency audit");
    expect(data).toContain("Vite 8.1.0 / esbuild 0.28.1");
    expect(data).toContain("pnpm audit --audit-level low");
    expect(packageJson).toContain('"vite": "^8.1.0"');
    expect(packageJson).toContain('"esbuild": "^0.28.1"');
    expect(lockfile).toContain("vite@8.1.0");
    expect(lockfile).toContain("esbuild@0.28.1");
    expect(data).not.toContain("dependency approval");
  });

  it("records market intelligence truth without adding prediction or execution authority", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("Market intelligence truth");
    expect(data).toContain("Scenario analysis boundary");
    expect(data).toContain("ops/truth/MARKET_INTELLIGENCE_TRUTH.md");
    expect(data).toContain("TRD-726 closes immutable local case revision.");
    expect(data).not.toContain("trade caller");
    expect(data).not.toContain("prediction engine");
  });

  it("queues market intelligence after the strategy review workspace", () => {
    const data = readFileSync(dataPath, "utf8");
    const tracklist = readFileSync(tracklistPath, "utf8");

    for (const packet of [
      "TRD-592 Strategy Review Workspace MVP",
      "TRD-593 Market Intelligence Input Model",
      "TRD-594 News/Event Scanner Contract",
      "TRD-595 Signal Candidate Contract",
      "TRD-596 Red Flag Engine",
      "TRD-597 Scenario Recommendation Model",
      "TRD-598 Risk-Gated Recommendation Review",
      "TRD-599 Market Intelligence Workspace",
      "TRD-600 Paper Simulation From Recommendation Candidate",
      "TRD-601 Strategy workspace visual QA",
      "TRD-602 Workspace source-link drilldown",
      "TRD-603 Artifact inventory UI integration",
      "TRD-604 Operator note UI integration",
      "TRD-605 Market intelligence blocker checkpoint",
      "TRD-606 Red flag visual QA"
    ]) {
      expect(data).toContain(packet);
    }

    expect(tracklist).toContain("Post-TRD-592 Market Intelligence Roadmap");
    expect(tracklist).toContain(
      "No market-intelligence recommendation may appear without evidence"
    );
    expect(tracklist.indexOf("TRD-592")).toBeLessThan(tracklist.indexOf("TRD-593"));
    expect(tracklist).toContain("no buy/sell command");
    expect(tracklist).toContain("no external dispatch");
  });

  it("plans artifact inventory schema only for local workspace evidence files", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("artifactInventorySchemaPlan");
    expect(data).toContain(
      "Show which local evidence files support one Strategy Review Workspace research case."
    );

    for (const field of [
      "artifact_id",
      "artifact_type",
      "local_path",
      "source_category",
      "linked_research_case_id",
      "linked_evidence_detail_id",
      "linked_risk_review_id_optional",
      "freshness_status",
      "limitation_notes",
      "redaction_status",
      "blocked_scope_flags",
      "created_at",
      "verified_at"
    ]) {
      expect(data).toContain(field);
    }

    for (const blockedFamily of [
      "output_channel",
      "external_storage",
      "cloud_sync",
      "external_account",
      "market_account_data",
      "credential_reference",
      "execution_record",
      "ai_recommendation_record"
    ]) {
      expect(data).toContain(blockedFamily);
    }

    expect(data).toContain(
      "Keep only fields needed to show the operator which local evidence files support this research case."
    );
    expect(data).not.toContain("export_url");
    expect(data).not.toContain("share_target");
    expect(data).not.toContain("print_profile");
  });

  it("renders the Strategy Review Workspace as a read-only evidence chain", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("strategyReviewWorkspace");
    expect(data).toContain("Can the operator inspect the full evidence chain");
    expect(data).toContain("gate2-research-case-fixture-001");

    for (const label of [
      "Strategy Idea",
      "Data Snapshot",
      "Backtest Evidence",
      "Metric Report",
      "Risk Review",
      "Operator Note",
      "Outcome Log",
      "Learning Event"
    ]) {
      expect(data).toContain(label);
    }

    expect(main).toContain('id="workspace"');
    expect(main).toContain("normalizeStrategyReviewWorkspace");
    expect(main).toContain("workspace-evidence-grid");
    expect(main).toContain("workspace-adjacency");
    expect(styles).toContain(".workspace-evidence-grid");
    expect(styles).toContain(".workspace-adjacency");
    expect(main).not.toContain("<button");
    expect(main).not.toContain("<form");
  });

  it("keeps market intelligence display evidence-only and non-final", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("gate2-market-intelligence-input-fixture-001");
    expect(data).toContain("gate2-news-event-fixture-001");
    expect(data).toContain("gate2-signal-candidate-fixture-001");
    expect(data).toContain("gate2-red-flag-engine-fixture-001");
    expect(data).toContain("gate2-scenario-recommendation-fixture-001");
    expect(data).toContain("gate2-recommendation-review-fixture-001");
    expect(data).toContain("gate2-recommendation-simulation-link-fixture-001");
    expect(data).toContain("No final recommendation.");
    expect(data).not.toContain("buy signal");
    expect(data).not.toContain("sell signal");
  });

  it("records red flag engine output as blocker evidence only", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("Red flag engine");
    expect(data).toContain("Sourced blocker evidence");
    expect(data).toContain("redFlagEngine");
    expect(data).toContain("risk_review_required");
    expect(data).toContain("Blocker evidence only; no route or final recommendation.");
    expect(data).not.toContain("final trade");
  });

  it("renders the market intelligence workspace without action controls", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(data).toContain("marketIntelligenceWorkspace");
    expect(data).toContain("Draft scenario; not a final recommendation.");
    expect(data).toContain("risk_review_required");
    expect(data).toContain("candidate_linked_for_local_simulation");
    expect(main).toContain("normalizeMarketIntelligenceWorkspace");
    expect(main).toContain("market-workspace");
    expect(main).toContain("Scenario Draft");
    expect(main).toContain("Risk-Gated Review");
    expect(main).toContain("Local Simulation Candidate");
    expect(styles).toContain(".market-workspace");
    expect(main).not.toContain("<button");
    expect(main).not.toContain("<form");
  });

  it("keeps recommendation candidate simulation local and external-dispatch-free", () => {
    const data = readFileSync(dataPath, "utf8");

    for (const boundary of [
      "local_simulation_only",
      "no_external_dispatch",
      "no_external_account",
      "credentials_required_false",
      "live_route_false",
      "automated_action_false",
      "operator_required"
    ]) {
      expect(data).toContain(boundary);
    }

    expect(data).toContain("Local simulation link only; no external route.");
    expect(data).not.toContain("external dispatch enabled");
  });

  it("renders local artifact inventory and manual operator note in the workspace", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    expect(data).toContain("artifactInventory");
    expect(data).toContain("gate2-artifact-inventory-fixture-001");
    expect(data).toContain("ops/assignments/TRD-001_INITIALIZE_GATE0_RESEARCH_ONLY_MONOREPO.md");
    expect(data).toContain("operatorNote");
    expect(data).toContain("Manual note fixture; no decision is performed.");
    expect(main).toContain("Local artifact inventory records supporting the research case.");
    expect(main).toContain("Operator Note");
    expect(main).toContain("Manual Note Sources");
    expect(main).toContain("Manual Note Limitations");
  });

  it("keeps red flag visual QA and blocker copy adjacent to the scenario workspace", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const recommendationIndex = main.indexOf("Scenario Draft");
    const blockerIndex = main.indexOf("Blocker Checkpoint");

    expect(data).toContain("blockerCheckpoint");
    expect(data).toContain("No certainty or performance claim.");
    expect(recommendationIndex).toBeGreaterThan(-1);
    expect(blockerIndex).toBeGreaterThan(recommendationIndex);
  });

  it("renders neutral local empty states for missing scenario records", () => {
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(main).toContain("renderEmptyState");
    expect(main).toContain("No local artifacts recorded.");
    expect(main).toContain("No local operator note recorded.");
    expect(main).toContain("Local workspace only.");
    expect(styles).toContain(".empty-state");
  });

  it("preserves strategy and market workspace records during runtime refresh", () => {
    const main = readFileSync(mainPath, "utf8");

    expect(main).toContain("preservedStrategyWorkspace");
    expect(main).toContain("preservedMarketWorkspace");
    expect(main).toContain("mergedData.strategyReviewWorkspace = preservedStrategyWorkspace");
    expect(main).toContain("mergedData.marketIntelligenceWorkspace = preservedMarketWorkspace");
  });

  it("keeps market workspace responsive and keyboard-addressable", () => {
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    expect(main).toContain("focusHashTarget");
    expect(main).toContain('target.setAttribute("tabindex", "-1")');
    expect(main).toContain("target.focus({ preventScroll: true })");
    expect(styles).toContain("[id]:focus-visible");
    expect(styles).toContain("@media (max-width: 680px)");
    expect(styles).toContain(".market-source-groups");
    expect(styles).toContain("overflow-wrap: anywhere");
  });

  it("groups market intelligence sources by operator purpose", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");

    for (const label of ["Scenario Inputs", "Risk Controls", "Local Provenance"]) {
      expect(data).toContain(label);
    }

    expect(data).toContain("sourceGroups");
    expect(main).toContain("market-source-groups");
    expect(main).toContain("Market intelligence sources by purpose");
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
