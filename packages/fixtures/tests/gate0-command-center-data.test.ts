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
    expect(data).toContain("TRD-500");
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
    expect(main).toContain('window.addEventListener("hashchange", updateActiveNavigation)');
    expect(main).toContain('window.location.hash.replace("#", "") || "overview"');
    expect(main).toContain(
      'link.classList.toggle("active", link.dataset.section === currentSection)'
    );
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
    expect(styles).toContain(".doc-group");
  });

  it("renders read-only frontend shell sections", () => {
    const data = readFileSync(dataPath, "utf8");
    const main = readFileSync(mainPath, "utf8");
    const styles = readFileSync(stylePath, "utf8");

    for (const field of ["limitationItems", "riskItems", "workflowItems"]) {
      expect(data).toContain(field);
    }

    for (const sectionId of ["evidence", "limitations", "risk", "workflow", "docs"]) {
      expect(main).toContain(`id="${sectionId}"`);
    }

    expect(main).toContain("workflow-list");
    expect(styles).toContain(".insight-list");
    expect(styles).toContain(".workflow-list");
  });

  it("keeps risk and limitation copy close to evidence surfaces", () => {
    const main = readFileSync(mainPath, "utf8");
    const evidenceIndex = main.indexOf('id="evidence"');
    const limitationsIndex = main.indexOf('id="limitations"');
    const riskIndex = main.indexOf('id="risk"');

    expect(evidenceIndex).toBeGreaterThan(-1);
    expect(limitationsIndex).toBeGreaterThan(evidenceIndex);
    expect(riskIndex).toBeGreaterThan(limitationsIndex);
  });
});
