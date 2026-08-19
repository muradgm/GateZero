import { describe, expect, it } from "vitest";
import {
  CommandCenterRuntimeDataSchema,
  RuntimeStatusSchema
} from "../../../packages/contracts/src/index.js";
import { currentRuntimeStatus } from "../../../packages/fixtures/src/runtime-status/current-runtime-status.js";
import {
  buildCanonicalRuntimeStatus,
  buildCommandCenterRuntimeData
} from "../../../scripts/build-command-center-runtime-data.js";

const generatedAt = "2026-08-19T09:00:00.000Z";

describe("TraderFrame command center runtime data", () => {
  it("builds canonical runtime status from one boundary fixture plus repository evidence", async () => {
    const result = await buildCanonicalRuntimeStatus(process.cwd(), generatedAt);

    expect(result).toMatchObject({
      ...currentRuntimeStatus,
      generatedAt,
      validation: {
        status: "passing",
        command: "pnpm verify"
      },
      ci: {
        state: "success"
      }
    });
    expect(result.latestAcceptedEvidenceId).toMatch(/^TRD-\d+$/);
    expect(result.validation?.testFileCount).toBeGreaterThan(0);
    expect(result.validation?.testCount).toBeGreaterThan(0);
    expect(result.ci?.latestRunId).toMatch(/^\d+$/);
    expect(result.ci?.lastVerifiedCommit).toMatch(/^[a-f0-9]{7,40}$/);
    expect(RuntimeStatusSchema.parse(result)).toEqual(result);
  });

  it("projects canonical status into the legacy Command Center runtime contract", async () => {
    const [status, result] = await Promise.all([
      buildCanonicalRuntimeStatus(process.cwd(), generatedAt),
      buildCommandCenterRuntimeData()
    ]);

    expect(result.project).toBe(status.product);
    expect(result.gate).toBe(status.operatingGate);
    expect(result.scope).toBe(status.operatingScope);
    expect(result.latestPacket).toBe(status.latestAcceptedEvidenceId);
    expect(result.testFileCount).toBe(status.validation?.testFileCount);
    expect(result.testCount).toBe(status.validation?.testCount);
    expect(result.ciRun).toBe(status.ci?.latestRunId);
    expect(result.ciState).toBe(status.ci?.state);
    expect(result.lastVerifiedCommit).toBe(status.ci?.lastVerifiedCommit);
    expect(result.externalAccess).toBe(false);
    expect(result.executionPath).toBe(false);
    expect(result.automatedAction).toBe(false);
    expect(result.approvalClaim).toBe(false);
    expect(result.performanceClaim).toBe(false);
    expect(CommandCenterRuntimeDataSchema.parse(result)).toEqual(result);
  });
});
