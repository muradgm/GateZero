import { describe, expect, it } from "vitest";
import { CommandCenterRuntimeDataSchema } from "../../../packages/contracts/src/index.js";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("TraderFrame command center runtime data", () => {
  it("builds a canonical local Gate 2 runtime snapshot", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      project: "TraderFrame",
      gate: "G2_PAPER_TRADING",
      scope: "paper_simulation_planning_only",
      source: "local repository evidence",
      localOnly: true,
      evidenceOnly: true,
      operatorRequired: true,
      riskReviewRequired: true,
      externalAccess: false,
      executionPath: false,
      automatedAction: false,
      approvalClaim: false,
      performanceClaim: false,
      latestPacket: "TRD-778",
      localVerification: "138 files / 962 tests",
      testFileCount: 138,
      testCount: 962,
      ciRun: "27787807220",
      ciState: "success",
      lastVerifiedCommit: "6e6f513",
      acceptedRecords: 778,
      evidenceRecords: 18
    });
    expect(CommandCenterRuntimeDataSchema.parse(result)).toEqual(result);
  });
});
