import { describe, expect, it } from "vitest";
import { CommandCenterRuntimeDataSchema } from "../../../packages/contracts/src/index.js";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-259",
      localVerification: "71 files / 355 tests",
      ciRun: "27786633422",
      ciState: "success",
      lastVerifiedCommit: "2b967ae",
      acceptedRecords: 259,
      evidenceRecords: 17
    });
    expect(CommandCenterRuntimeDataSchema.parse(result)).toEqual(result);
  });
});
