import { describe, expect, it } from "vitest";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-254",
      localVerification: "69 files / 343 tests",
      ciRun: "27737830833",
      ciState: "success",
      lastVerifiedCommit: "44121b7",
      acceptedRecords: 254,
      evidenceRecords: 15
    });
  });
});
