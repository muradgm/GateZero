import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const runtimePath = path.join(
  root,
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "epoch5-multi-strategy-case.json"
);

describe("Epoch 5 multi-strategy workspace", () => {
  it("projects two isolated complete strategies without execution authority", async () => {
    const proof = JSON.parse(await readFile(runtimePath, "utf8"));

    expect(proof.dataMode).toBe("LOCAL_MULTI_STRATEGY_FIXTURE");
    expect(proof.registrations).toHaveLength(2);
    expect(proof.lifecycles).toHaveLength(2);
    expect(
      new Set(proof.registrations.map((entry: { strategyId: string }) => entry.strategyId)).size
    ).toBe(2);
    expect(
      proof.lifecycles.every(
        (entry: { trace: { lifecycleStatus: string } }) =>
          entry.trace.lifecycleStatus === "COMPLETE"
      )
    ).toBe(true);
    expect(proof.checkpoint).toMatchObject({
      status: "PASS",
      deterministic: true,
      identityIsolated: true,
      protectedLoopShared: true,
      completeLifecycleCount: 2,
      localResearchOnly: true,
      optimizationAuthority: false,
      recommendationFinal: false,
      executionPath: false,
      automatedAction: false
    });
  });

  it("keeps strategy identity and limitations visible in the workspace source", async () => {
    const panel = await readFile(
      path.join(root, "apps", "intelligence-workspace", "src", "MultiStrategyPanel.jsx"),
      "utf8"
    );
    const rootSource = await readFile(
      path.join(root, "apps", "intelligence-workspace", "src", "WorkspaceRoot.jsx"),
      "utf8"
    );

    expect(panel).toContain("registration.strategyId");
    expect(panel).toContain("proof.limitations");
    expect(panel).toContain("Shared controls");
    expect(rootSource).toContain("epoch5-multi-strategy-case.json");
    expect(rootSource).toContain("optimizationAuthority !== false");
    expect(panel).not.toMatch(/win rate|best strategy|recommended strategy|profit/i);
  });
});
