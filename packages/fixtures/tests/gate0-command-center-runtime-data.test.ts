import { describe, expect, it } from "vitest";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-250",
      localVerification: "69 files / 343 tests",
      ciRun: "27737177617",
      ciState: "success",
      lastVerifiedCommit: "8c4c0dc",
      acceptedRecords: 250,
      evidenceRecords: 13
    });
  });
});
