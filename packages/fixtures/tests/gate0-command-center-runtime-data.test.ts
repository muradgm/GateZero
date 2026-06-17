import { describe, expect, it } from "vitest";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-246",
      localVerification: "69 files / 343 tests",
      ciRun: "27718333544",
      ciState: "success",
      lastVerifiedCommit: "a5d50b1",
      acceptedRecords: 246,
      evidenceRecords: 11
    });
  });
});
