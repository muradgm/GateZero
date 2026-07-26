import { describe, expect, it } from "vitest";
import {
  CommandCenterRuntimeBoundarySchema,
  CommandCenterRuntimeDataSchema
} from "../src/index.js";

const boundary = {
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
  performanceClaim: false
} as const;

const runtimeData = {
  ...boundary,
  latestPacket: "TRD-255",
  localVerification: "69 files / 343 tests",
  testFileCount: 69,
  testCount: 343,
  ciRun: "27737830833",
  ciState: "success",
  lastVerifiedCommit: "44121b7",
  acceptedRecords: 255,
  evidenceRecords: 15
} as const;

describe("Command center runtime data contract", () => {
  it("validates the canonical local command-center runtime payload", () => {
    const parsed = CommandCenterRuntimeDataSchema.parse(runtimeData);

    expect(parsed.latestPacket).toBe("TRD-255");
    expect(parsed.gate).toBe("G2_PAPER_TRADING");
    expect(parsed.executionPath).toBe(false);
  });

  it("rejects non-success CI states and malformed run identifiers", () => {
    expect(() =>
      CommandCenterRuntimeDataSchema.parse({
        ...runtimeData,
        ciRun: "run-27737830833",
        ciState: "pending"
      })
    ).toThrow();
  });

  it("rejects accepted record counts that lag behind the latest packet", () => {
    expect(() =>
      CommandCenterRuntimeDataSchema.parse({
        ...runtimeData,
        acceptedRecords: 254
      })
    ).toThrow();
  });

  it("rejects display summaries that drift from canonical test counts", () => {
    expect(() =>
      CommandCenterRuntimeDataSchema.parse({
        ...runtimeData,
        localVerification: "68 files / 343 tests"
      })
    ).toThrow();
  });

  it("keeps the runtime boundary local, evidence-only, and non-executing", () => {
    expect(CommandCenterRuntimeBoundarySchema.parse(boundary).executionPath).toBe(false);

    expect(() =>
      CommandCenterRuntimeBoundarySchema.parse({
        ...boundary,
        externalAccess: true
      })
    ).toThrow();

    expect(() =>
      CommandCenterRuntimeBoundarySchema.parse({
        ...boundary,
        gate: "G0_RESEARCH"
      })
    ).toThrow();
  });
});
