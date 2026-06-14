import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  defaultPreviewPort,
  previewHost,
  readPort,
  resolvePreviewFile
} from "../../../scripts/preview-web.js";

const rootDir = process.cwd();
const webRoot = path.join(rootDir, "apps", "web");

describe("Gate 0 command center preview script", () => {
  it("keeps the preview host local and default port stable", () => {
    expect(previewHost).toBe("127.0.0.1");
    expect(defaultPreviewPort).toBe(4173);
    expect(readPort(["node", "preview-web.ts"], {})).toBe(4173);
  });

  it("accepts explicit local preview ports", () => {
    expect(readPort(["node", "preview-web.ts", "--port", "4175"], {})).toBe(4175);
    expect(readPort(["node", "preview-web.ts"], { GATEZERO_WEB_PORT: "4180" })).toBe(4180);
  });

  it("rejects invalid preview ports", () => {
    expect(() => readPort(["node", "preview-web.ts", "--port", "80"], {})).toThrow(
      "Invalid preview port"
    );
    expect(() => readPort(["node", "preview-web.ts", "--port", "70000"], {})).toThrow(
      "Invalid preview port"
    );
  });

  it("maps the root route to the static command center", () => {
    expect(resolvePreviewFile(webRoot, "/")).toBe(path.join(webRoot, "index.html"));
    expect(resolvePreviewFile(webRoot, "/src/styles.css")).toBe(
      path.join(webRoot, "src", "styles.css")
    );
  });

  it("blocks traversal outside the static web root", () => {
    expect(resolvePreviewFile(webRoot, "/../package.json")).toBeUndefined();
  });
});
