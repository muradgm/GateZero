import { describe, expect, it } from "vitest";
import {
  CommandCenterRuntimeBoundarySchema,
  CommandCenterRuntimeDataSchema
} from "../src/index.js";

const runtimeData = {
  latestPacket: "TRD-255",
  localVerification: "69 files / 343 tests",
  ciRun: "27737830833",
  ciState: "success",
  lastVerifiedCommit: "44121b7",
  acceptedRecords: 255,
  evidenceRecords: 15
};

describe("Command center runtime data contract", () => {
  it("validates the local command-center runtime payload shape", () => {
    expect(CommandCenterRuntimeDataSchema.parse(runtimeData).latestPacket).toBe("TRD-255");
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

  it("keeps the runtime boundary local and non-executing", () => {
    expect(
      CommandCenterRuntimeBoundarySchema.parse({
        gate: "G0_RESEARCH",
        scope: "research_only",
        source: "local repo records",
        externalAccess: false,
        executionPath: false
      }).executionPath
    ).toBe(false);

    expect(() =>
      CommandCenterRuntimeBoundarySchema.parse({
        gate: "G0_RESEARCH",
        scope: "research_only",
        source: "local repo records",
        externalAccess: true,
        executionPath: false
      })
    ).toThrow();
  });
});
