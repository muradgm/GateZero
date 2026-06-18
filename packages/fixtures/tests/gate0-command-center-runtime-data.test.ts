import { describe, expect, it } from "vitest";
import { CommandCenterRuntimeDataSchema } from "../../../packages/contracts/src/index.js";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-256",
      localVerification: "70 files / 348 tests",
      ciRun: "27737830833",
      ciState: "success",
      lastVerifiedCommit: "44121b7",
      acceptedRecords: 256,
      evidenceRecords: 15
    });
    expect(CommandCenterRuntimeDataSchema.parse(result)).toEqual(result);
  });
});
