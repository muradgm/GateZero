import { describe, expect, it } from "vitest";
import { buildCommandCenterRuntimeData } from "../../../scripts/build-command-center-runtime-data.js";

describe("Gate 0 command center runtime data", () => {
  it("builds a local runtime snapshot from accepted operating records", async () => {
    const result = await buildCommandCenterRuntimeData();

    expect(result).toEqual({
      latestPacket: "TRD-248",
      localVerification: "69 files / 343 tests",
      ciRun: "27720648209",
      ciState: "success",
      lastVerifiedCommit: "5ec9d33",
      acceptedRecords: 248,
      evidenceRecords: 12
    });
  });
});
