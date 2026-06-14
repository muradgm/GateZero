import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = process.cwd();
const dataPath = path.join(rootDir, "apps", "web", "src", "command-center-data.js");
const indexPath = path.join(rootDir, "apps", "web", "index.html");

describe("Gate 0 command center surface", () => {
  it("keeps the static command center tied to Gate 0 research scope", () => {
    const data = readFileSync(dataPath, "utf8");

    expect(data).toContain("G0_RESEARCH");
    expect(data).toContain("research_only");
    expect(data).toContain("TRD-192");
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

  it("mounts as a static local command center", () => {
    const index = readFileSync(indexPath, "utf8");

    expect(index).toContain('<div id="app"></div>');
    expect(index).toContain("./src/main.js");
    expect(index).toContain("./src/styles.css");
  });
});
