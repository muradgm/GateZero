import { describe, expect, it } from "vitest";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-252",
      localVerification: "69 files / 343 tests",
      ciRun: "27737368249",
      ciState: "success",
      lastVerifiedCommit: "fb85f84",
      acceptedRecords: 252,
      evidenceRecords: 14
    });
  });
});
